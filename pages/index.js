import { ConnectWallet, useAddress, useDisconnect, useMetamask, useOwnedNFTs, usePack, ThirdwebNftMedia, useContract } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import React, {useState} from "react";
import ERC1155RewardBox from "../components/ERC1155RewardBox";
import ERC20RewardBox from "../components/ERC20RewardBox";


export default function Home() {
  
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectWallet = useDisconnect();

  const { contract }  = useContract("0xA144177Ffa3337468574B14b7C137b7E29590297", "pack");


 const {data: nfts, isLoading} = useOwnedNFTs(contract, address);
 const [openedpackrewards, setopenedpackrewards] = useState();

 console.log(contract, "checking pack data");
 console.log(nfts, "nfts from pack");

 const open = async () => {
   const openedrewards = await pack?.open(0,1);
   console.log(openedrewards);
   setopenedpackrewards(openedrewards);
 }

  return (
  <div className="">
    {
      address ?

      <>
        <div className={styles.container}>

            {/* <button onClick={disconnectWallet}>Disconnect</button> */} 
             <div className={styles.connect}>
                  <ConnectWallet />
              </div>
             
            <div className={styles.collectionContainer}>
                {
                  !isLoading ? (
                    <div className={styles.nftBoxGrid}>
                        {
                          nfts?.map((nft) => (
                            <div className={styles.nftBox}
                              key={nft.metadata.id.toString()}
                            >
                            <ThirdwebNftMedia 
                            metadata={nft.metadata} 
                            className={styles.nftMedia} 
                            />
                            <h3>{nft.metadata.name}</h3>

                            <button 
                            className={`${styles.mainButton} ${styles.spacerBottom}`} 
                            onClick={() => open()}
                              >
                                Open
                              </button>

                            </div>
                          ))
                        }
                    </div>
                  ) : (
                    <p>Loading...</p>
                  )
                  }
            </div>

            </div>

            <hr className={styles.divider} />

            <h2>Opened Rewards</h2>
            {
              openedpackrewards && openedpackrewards?.erc20Rewards && openedpackrewards?.erc20Rewards?.length > 0 && (
                <>
                  <h3>ERC-20 Tokens</h3>
                  <div className={styles.nftBoxGrid}>
                    {openedpackrewards?.erc20Rewards?.map((reward, i) => (
                      <ERC20RewardBox reward={reward} key={i} />
                    ))}
                  </div>
                </>
              )
            }

            {
              openedpackrewards && openedpackrewards?.erc1155Rewards && openedpackrewards?.erc1155Rewards?.length > 0 && (
                <>
                  <h3>ERC-1155 Tokens</h3>
                  <div className={styles.nftBoxGrid}>
                    {openedpackrewards?.erc20Rewards?.map((reward, i) => (
                      <ERC1155RewardBox reward={reward} key={i} />
                    ))}
                  </div>
                </>
              )
            }
      </>
     :
     <div className={styles.connect}>
        <ConnectWallet />
     </div>
    }


  </div>
  );
}
