import React from 'react';
import { ThirdwebNftMedia, useMetadata, useToken } from '@thirdweb-dev/react';
import styles from "../styles/Home.module.css";
 

export default function ERC20RewardBox({reward}) {

    const token = useToken(reward.contractAddress);
    const { data } = useMetadata(token);

  return (
    <div className={styles.nftBox}>
       {data && (
        <>
          <ThirdwebNftMedia metadata={data} className={styles.nftMedia} />
          <h3>{data?.name}</h3>
          <p>Amount: {reward.quantityPerReward}</p>
        </>
       )}
    </div>
  )
}
