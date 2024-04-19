'use server'

import {Button} from "@mantine/core";
import {IconWallet} from "@tabler/icons-react";
import {createWalletClient, custom} from "viem";
import {mainnet, sepolia} from "viem/chains";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import {FC, use, useEffect} from "react";
import {Context} from "../state/ContextProvider.tsx";

const walletIcon = <IconWallet size={24}/>;

export const Wallet: FC = () => {

  const {walletAddress, setWalletAddress, activeChain, setActiveChain} = use(Context);

  const clientWallet = createWalletClient({
    chain: activeChain === 'Sep' ? sepolia : mainnet,
    transport: custom(window.ethereum!)
  })

  useEffect(() => {
    const newChain: any = activeChain === 'Sep' ? sepolia : mainnet
    const switchChain = async () => {
      await clientWallet.switchChain({ id: newChain.id })
    }
    switchChain().then(() => {
      activeChain === "Sep" ? setActiveChain("Sep") : setActiveChain("Eth")}).catch(() => {
      activeChain === "Sep" ? setActiveChain("Eth") : setActiveChain("Sep")})
  }, [activeChain]);

  const execClientW = async () => {
    const [address] = await clientWallet.requestAddresses();
    setWalletAddress(address);
  }
  return <Button m={5} color={walletAddress? 'green' : 'tomato'} leftSection={walletIcon} w={40} pr={0} onClick={execClientW}></Button>
}

