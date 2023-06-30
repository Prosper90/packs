import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ThirdwebStorage } from "@thirdweb-dev/storage";


//Read in private key from env
import dotenv from "dotenv";
import fs from 'fs';
dotenv.config();


//Read our treasure chest image to use as metadata


// Enable experimental modules
// Run the script with the following command:
// node --experimental-modules your-script.mjs


(async () => {
 
 //Define our contract addresses
 const packAddress = "0xA144177Ffa3337468574B14b7C137b7E29590297"; 
 const tokenAddress= "0x7D24Bc27c709D6C9117192272D333cD103919731";
 const editionAddress = "0x2EaDcDE49A2192C26c8656de27f8F9b97BEa9303";

 
 //use our private key to instantiate the third web sdk
 
 const sdk = ThirdwebSDK.fromPrivateKey(process.env.PRIVATE_KEY, "goerli", {
    timeout: 60000, // Increase the timeout duration to 60 seconds
  });

 console.log(process.env.PRIVATE_KEY, "private key");




//set approval for the pack contract to act upon token and edition contract
const token = await sdk.getContract(tokenAddress, "token");
await token.setAllowance(packAddress, 45);
console.log("Set allowance For token");



//set approval for the pack contract to act upon token and edition contract
const edition = await sdk.getContract(editionAddress, "edition");
await edition.setApprovalForAll(packAddress, 45);
console.log("Set allowance for Edition");


//read in the chest.jpg as a file using fs
const chestFile = fs.readFileSync("./scripts/chest.jpg");

//upload the chest to ipfs

const ipfsHash = await sdk.storage.upload(chestFile);
const url = ipfsHash.baseUri;
console.log("uploaded assets to ipfs");

// Upload the Chest to IPFS
//const storage = new ThirdwebStorage();
//const url = await storage.upload(chestFile);


try {
console.log("creating packs");
//Get the pack contract using the pack address
const pack = await sdk.getContract(packAddress, "pack");
const packNfts = await pack.create({
    packMetadata: {
        name: "Treasure chest",
        description: "Achest containing treasures to help you on your voyages",
        image: url,
    },
    erc20Rewards: [{
        contractAddress: tokenAddress,
        quantityPerReward: 1,
        quantity: 45,
        totalRewards: 45,
    }],
     
    erc1155Rewards: [{
        //silver swords
        contractAddress: editionAddress,
        tokenId: 0,
        quantityPerReward: 1,
        totalRewards: 97,
    },
     {
        //gold swords
        contractAddress: editionAddress,
        tokenId: 1,
        quantityPerReward: 1,
        totalRewards: 5,
    },
],

    rewardsPerPack: 5,
});

console.log(packNfts, "packNfts");
    
 } catch (err) {
    console.log(err);
 }

 console.log("Hurray, packs created");

})();