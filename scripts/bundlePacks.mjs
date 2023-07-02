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



const pack = await sdk.getContract(packAddress, 'pack');


//set approval for the pack contract to act upon token and edition contract
//const token = await sdk.getToken(tokenAddress);
//await token.setAllowance(packAddress, 45);
const token = await sdk.getContract(tokenAddress, 'token');
await token.setAllowance(packAddress, 40);
console.log("Set allowance For token");



//set approval for the pack contract to act upon token and edition contract
//const edition = await sdk.getEdition(editionAddress);
//await edition.setApprovalForAll(packAddress, true);
const edition = await sdk.getContract(editionAddress, 'edition');
await edition.setApprovalForAll(packAddress, true);
console.log("Set allowance for Edition");


//read in the chest.jpg as a file using fs
const chestFile = fs.readFileSync("./scripts/chest.jpg");

//upload the chest to ipfs

//const ipfsHash = await  sdk.storage.upload(chestFile);
//const url = ipfsHash.baseUri;
//console.log("uploaded assets to ipfs");

// Upload the Chest to IPFS
const storage = new ThirdwebStorage();
const url = await storage.upload(chestFile);


try {
console.log("creating packs");
//Get the pack contract using the pack address
//const pack = await sdk.getPack(packAddress);
const packNfts = await pack.create({
    packMetadata: {
        name: "Treasure chest",
        description: "Achest containing treasures to help you on your voyages",
        image: url,
    },
    erc20Rewards: [{
        contractAddress: tokenAddress,
        quantityPerReward: 1,
        quantity: 40,
        totalRewards: 40,
    }],
     
    erc1155Rewards: [{
        //silver swords
        contractAddress: editionAddress,
        tokenId: 0,
        quantityPerReward: 1,
        totalRewards: 90,
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

console.log(packNfts, "packs created");
    
 } catch (err) {
    console.log(err);
 }

 console.log("Hurray, packs created");

})();




/*
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ThirdwebStorage } from "@thirdweb-dev/storage";

import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

(async () => {
  const packAddress = "0xA144177Ffa3337468574B14b7C137b7E29590297";
  const tokenAddress = "0x7D24Bc27c709D6C9117192272D333cD103919731";
  const editionAddress = "0x2EaDcDE49A2192C26c8656de27f8F9b97BEa9303";


  const sdk = await ThirdwebSDK.fromPrivateKey(process.env.PRIVATE_KEY, "goerli");
  console.log(process.env.PRIVATE_KEY, "Private private");

  const pack = await sdk.getPack(packAddress);

  const token = await sdk.getToken(tokenAddress);
  await token.setAllowance(packAddress, 45);

  const edition = await sdk.getEdition(editionAddress);
  await edition.setApprovalForAll(packAddress, true);


//read in the chest.jpg as a file using fs
const chestFile = fs.readFileSync("./scripts/chest.jpg");
const storage = new ThirdwebStorage();
const url = await storage.upload(chestFile);

const packNfts = await pack.create({
    // Metadata for the pack NFTs
    packMetadata: {
        name: "Treasure chest",
        description: "Achest containing treasures to help you on your voyages",
        image: url,
    },

    erc20Rewards: [
      {
        contractAddress: tokenAddress,
        quantityPerReward: 1,
        quantity: 45,
        totalRewards: 45,
      },
    ],

    erc1155Rewards: [
      {
        //silver swords
        contractAddress: editionAddress,
        tokenId: 0,
        quantityPerReward: 1,
        totalRewards: 90,
      },
      {
        //gold swords
        contractAddress: editionAddress,
        tokenId: 1,
        quantityPerReward: 1,
        totalRewards: 5,
      }
      ],
    rewardsPerPack: 5,
  });

  console.log(`====== Success: Pack NFTs created =====`);

  console.log(packNfts);
})();
*/