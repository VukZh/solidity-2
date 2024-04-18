'use server'

import {createPublicClient, http} from "viem";
import {mainnet, sepolia} from "viem/chains";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import {FC, use, useEffect, useState} from "react";
import {Text} from "@mantine/core";
import {Context} from "../state/ContextProvider.tsx";


export const Block: FC = () => {

  const {activeChain} = use(Context);

  let client = createPublicClient({
    chain: activeChain === 'Sep' ? sepolia : mainnet,
    transport: http(),
  })

  useEffect(() => {
    const execClient = async () => {
      client = createPublicClient({
        chain: activeChain === 'Sep' ? sepolia : mainnet,
        transport: http(),
      })
      const blockNumber = await client.getBlockNumber();
      setCurrentBlock(blockNumber)
    }
    execClient();
  }, [activeChain]);

  const [currentBlock, setCurrentBlock] = useState(0n);
  return <Text>
    {new Date().toLocaleString()} - Block in {client.chain.name}: {Number(currentBlock)}
  </Text>

}