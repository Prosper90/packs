import React from 'react';
import { ThirdwebNftMedia, useEdition, useNFT } from '@thirdweb-dev/react';
import { BigNumber } from 'ethers';
import styles from "../styles/Home.module.css";

export default function ERC1155RewardBox({reward}) {

    const edition = useEdition(reward.contractAddress);
    const { data } = useNFT (edition, reward.tokenId);
  return (
    <div className={styles.nftBox}>
       {data && (
        <>
          <ThirdwebNftMedia metadata={data} className={styles.nftMedia} />
          <h3>{data?.metadata.name}</h3>
        </>
       )}
    </div>
  )
}
