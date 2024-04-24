// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import {FC, use, useState} from "react";
import {Button, Group, Loader, Select, Stack, Text} from "@mantine/core";
import {Context} from "../state/ContextProvider.tsx";
import {createPublicClient, createWalletClient, custom, http} from "viem";
import {sepolia} from "viem/chains";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {ErrorType} from "viem/_types/errors/utils";
import {notifications} from '@mantine/notifications';


const DataFeedEndpoints = [
  {
    name: "BTC/USD",
    dec: 8,
    address: "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43"
  },
  {
    name: "ETH/USD",
    dec: 8,
    address: "0x694AA1769357215DE4FAC081bf1f309aDC325306"
  },
  {
    name: "LINK/USD",
    dec: 8,
    address: "0xc59E3633BAAC79493d908e63626716e204A45EdF"
  },
  {
    name: "XAU/USD",
    dec: 8,
    address: "0xC5981F461d74c46eB4b0CF3f4Ec79f025573B0Ea"
  }
]

const ContractAbi = [{
  "anonymous": false,
  "inputs": [{"indexed": true, "internalType": "address", "name": "addr", "type": "address"}, {
    "indexed": false,
    "internalType": "int256",
    "name": "data",
    "type": "int256"
  }],
  "name": "GetDataFeedEvent",
  "type": "event"
}, {
  "inputs": [{"internalType": "address", "name": "addr", "type": "address"}],
  "name": "getDataFeed",
  "outputs": [{"internalType": "int256", "name": "", "type": "int256"}],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{"internalType": "address", "name": "coinAddress", "type": "address"}],
  "name": "lastDataFeeds",
  "outputs": [{"internalType": "int256", "name": "data", "type": "int256"}],
  "stateMutability": "view",
  "type": "function"
}]
const makeNotification = (msg: string) => {
  notifications.show({
    title: 'Error',
    message: msg,
    autoClose: 3000,
    style: {position: "absolute", bottom: "50px", right: "10px", maxWidth: "600px"},
    color: "red",
  })
}

export const Oracle: FC = () => {

  const [selected, setSelected] = useState<string>(DataFeedEndpoints[0].name)
  const [dataFeed, setDataFeed] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const {activeChain} = use(Context);
  const isMainnet = activeChain === 'Eth'

  const getDataFeed = async () => {
    setIsLoading(true)
    const clientWallet = createWalletClient({
      chain: sepolia,
      transport: custom(window.ethereum!)
    })
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const {address: addr, dec} = DataFeedEndpoints.find(d => d.name === selected);
      const [account] = await clientWallet.getAddresses()
      const hash = await clientWallet.writeContract({
        address: process.env.ORACLE_CONTRACT_ADDRESS as `0x${string}`,
        abi: ContractAbi,
        functionName: 'getDataFeed',
        account,
        args: [addr],
      })
      const publicClient = createPublicClient({
        chain: sepolia,
        transport: http()
      })
      await publicClient.waitForTransactionReceipt(
        {hash: hash}
      )
      const res = await publicClient.readContract({
        address: process.env.ORACLE_CONTRACT_ADDRESS as `0x${string}`,
        abi: ContractAbi,
        functionName: 'lastDataFeeds',
        args: [addr],
      }) as number
      setDataFeed(Number(res) / Math.pow(10, dec))
      setIsLoading(false)
      console.log("res", res)
    } catch (e: ErrorType) {
      console.error(e)
      makeNotification(e.message.toString())
      setIsLoading(false)
    }
  }

  return (
    <Stack m={15}><Text size="md">OracleContract (only for Sepolia network) </Text>

      <Select
        label="DataFeed select"
        placeholder="Pick coin"
        w={500}
        mt={10}
        mb={10}
        value={selected}
        onChange={e => setSelected(e!)}
        data={DataFeedEndpoints.map(d => d.name)}
      />

      <Group mt={0} mb={10} w={700} h={70}>
        <Button w={500} disabled={isMainnet} onClick={getDataFeed}>Get price {selected}</Button>
        {isLoading ? <Loader color="blue" size={12} type="bars"/> : <Text>{dataFeed ? dataFeed.toString() : ""}</Text>}

      </Group>

    </Stack>
  )

}