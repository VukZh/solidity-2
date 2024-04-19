// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import {FC, use, useState} from "react";
import {Button, Group, Stack, Text, NumberInput, Input, Divider, Indicator, CloseButton} from "@mantine/core";
import {
  createPublicClient,
  isAddress,
  http,
  formatEther,
  formatGwei,
  parseEther,
  createWalletClient,
  custom,
} from 'viem'
import {IconCurrencyEthereum, IconXboxX} from '@tabler/icons-react';
import {Context} from "../state/ContextProvider.tsx";
import {mainnet, sepolia} from "viem/chains";

const ethToWei = (eth: number) => {
  return BigInt(parseEther(eth.toString()));
}
export const EthContract: FC = () => {
  const [gasPrice, setGasPrice] = useState<bigint>(0n);
  const [balance, setBalance] = useState<bigint>(0n);
  const [amount, setAmount] = useState<number>(0);
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [operationHash, setOperationHash] = useState<string>("");
  const {activeChain, walletAddress} = use(Context);

  const publicClient = createPublicClient({
    chain: activeChain === 'Sep' ? sepolia : mainnet,
    transport: http()
  })

  const clientWallet = createWalletClient({
    chain: activeChain === 'Sep' ? sepolia : mainnet,
    transport: custom(window.ethereum!)
  })

  const getGasPrice = async () => {
    const gasPrice = await publicClient.getGasPrice();
    setGasPrice(gasPrice);
  }

  const getAddressBalance = async () => {
    const balance = await publicClient.getBalance({address: walletAddress});
    setBalance(balance);
  }

  const sendEth = async () => {
    await clientWallet.sendTransaction({
      account: walletAddress,
      to: recipientAddress as `0x${string}`,
      value: ethToWei(amount),
    }).then((hash) => {
      setOperationHash(hash)
    }).catch((e) => {
      console.error(e)
    })
  }

  const isMainnet = activeChain === 'Eth'
  return (
    <Stack m={15}>
      <Divider label="Balance (ETH)" labelPosition="left"/>
      <Group mt={0} mb={10} w={500} justify="space-between">
        <Text w={100}>{formatEther(balance).toString()}</Text>
        <Button size="compact-md" w={150} disabled={!walletAddress} onClick={getAddressBalance}>Get balance</Button>
      </Group>
      <Divider label="Gas price (GWEI)" labelPosition="left"/>
      <Group mt={0} mb={10} w={500} justify="space-between">
        <Text w={320}>{formatGwei(gasPrice).toString()} (eth: {formatEther(gasPrice)})</Text>
        <Button size="compact-md" w={150} onClick={getGasPrice}>Get gas price</Button>
      </Group>
      <Divider label="Send (ETH)" labelPosition="left"/>
      <Group mt={0} mb={10} w={500} justify="space-between">
        <NumberInput placeholder="Eth amount" value={amount.toString()} onChange={(e) => setAmount(Number(e))}
                     rightSection={<IconCurrencyEthereum size={16}/>}/>
        <Indicator inline disabled={!isMainnet} processing color="red" size={12} position="bottom-end" label="Mainnet">
          <Button size="compact-md" w={150} disabled={!isAddress(recipientAddress)} onClick={sendEth}>Send ETH</Button>
        </Indicator>

      </Group>
      <Input w={500} value={recipientAddress} onChange={(e) => setRecipientAddress(e.target.value)}
             error={!isAddress(recipientAddress)}></Input>
      {operationHash && <Group align="center"><Text>Transaction successful:
          <a href={`https://${isMainnet ? '' : 'sepolia.'}etherscan.io/tx/${operationHash}`}
             target="_blank"> {operationHash}</a>
      </Text>
          <CloseButton icon={<IconXboxX size={20} color={"orange"}/>} onClick={() => setOperationHash('')}/>
      </Group>}
    </Stack>

  )
}