import {Input, Stack, Text, Button, Divider, Group} from "@mantine/core";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import {FC, use, useState} from "react";
import {createPublicClient, isAddress, http, createWalletClient, custom} from "viem";
import {Context} from "../state/ContextProvider.tsx";
import {sepolia} from "viem/chains";

import {notifications} from '@mantine/notifications';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {ErrorType} from "viem/_types/errors/utils";


const ContractAbi = [{
  "inputs": [{"internalType": "address", "name": "voting", "type": "address"}],
  "name": "AlreadyVotedError",
  "type": "error"
}, {"inputs": [], "name": "InsufficientAddress", "type": "error"}, {
  "inputs": [{
    "internalType": "string",
    "name": "res",
    "type": "string"
  }], "name": "InvalidResult", "type": "error"
}, {
  "anonymous": false,
  "inputs": [{"indexed": true, "internalType": "address", "name": "voting", "type": "address"}, {
    "indexed": false,
    "internalType": "string",
    "name": "res",
    "type": "string"
  }],
  "name": "Voted",
  "type": "event"
}, {
  "inputs": [{"internalType": "address", "name": "who", "type": "address"}],
  "name": "IsVoted",
  "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "PositiveVSNegative",
  "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "TotalNegativeVoters",
  "outputs": [{"internalType": "uint32", "name": "", "type": "uint32"}],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "TotalPositiveVoters",
  "outputs": [{"internalType": "uint32", "name": "", "type": "uint32"}],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "TotalVoters",
  "outputs": [{"internalType": "uint32", "name": "", "type": "uint32"}],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
  "name": "arrayOfVoters",
  "outputs": [{"internalType": "address", "name": "", "type": "address"}],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{"internalType": "address", "name": "voting", "type": "address"}],
  "name": "isVoted",
  "outputs": [{"internalType": "bool", "name": "voted", "type": "bool"}],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{"internalType": "address", "name": "voting", "type": "address"}, {
    "internalType": "string",
    "name": "res",
    "type": "string"
  }], "name": "makeAVote", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
  "inputs": [{"internalType": "address", "name": "voting", "type": "address"}],
  "name": "votingResult",
  "outputs": [{"internalType": "bool", "name": "res", "type": "bool"}],
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
export const MyVotesContract: FC = () => {

  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");

  const [votedResult, setVotedResult] = useState("");
  const [totalPositiveVoters, setTotalPositiveVoters] = useState<number | null>(null);
  const [totalNegativeVoters, setTotalNegativeVoters] = useState<number | null>(null);

  const {activeChain} = use(Context);
  const isMainnet = activeChain === 'Eth'



  const getPositiveVoters = async () => {
    try {
      const publicClient = createPublicClient({
        chain: sepolia,
        transport: http()
      })
      const res = await publicClient.readContract({
        address: process.env.VOTES_CONTRACT_ADDRESS as `0x${string}`,
        abi: ContractAbi,
        functionName: 'TotalPositiveVoters',
      })
      console.log("res", res)
      setTotalPositiveVoters(res as number)
    } catch (e: ErrorType) {
      console.error(e)
      makeNotification(e.message.toString())
    }
  }

  const getNegativeVoters = async () => {
    try {
      const publicClient = createPublicClient({
        chain: sepolia,
        transport: http()
      })
      const res = await publicClient.readContract({
        address: process.env.VOTES_CONTRACT_ADDRESS as `0x${string}`,
        abi: ContractAbi,
        functionName: 'TotalNegativeVoters',
      })
      console.log("res", res)
      setTotalNegativeVoters(res as number)

    } catch (e: ErrorType) {
      console.error(e)
      makeNotification(e.message.toString())
    }
  }

  const getIsVoted = async () => {
    try {
      const publicClient = createPublicClient({
        chain: sepolia,
        transport: http()
      })
      const res = await publicClient.readContract({
        address: process.env.VOTES_CONTRACT_ADDRESS as `0x${string}`,
        abi: ContractAbi,
        functionName: 'isVoted',
        args: [address],
      })
      console.log("res", res, address)
      setVotedResult(res ? "Yes" : "No")
    } catch (e: ErrorType) {
      console.error(e)
      makeNotification(e.message.toString())
    }
  }

  const makeAVote = async () => {
    const clientWallet = createWalletClient({
      chain: sepolia,
      transport: custom(window.ethereum!)
    })
    try {
      const [account] = await clientWallet.getAddresses()
      const res = await clientWallet.writeContract({
        address: process.env.VOTES_CONTRACT_ADDRESS as `0x${string}`,
        abi: ContractAbi,
        functionName: 'makeAVote',
        account,
        args: [address, message],
      })
      console.log("res", res)
    } catch (e: ErrorType) {
      console.error(e)
      makeNotification(e.message.toString())
    }
  }

  return (
    <Stack m={15}><Text size="md">MyVotesContract (only for Sepolia network)</Text>
      <Input placeholder="Voter's address" w={500} error={!isAddress(address)} value={address}
             onChange={e => setAddress(e.target.value)}/>
      <Input placeholder="Voter's message - Yes/No" w={500} value={message} onChange={e => setMessage(e.target.value)}/>
      <Button w={500} disabled={isMainnet || !isAddress(address)} onClick={makeAVote}>Vote</Button>
      <Group mt={0} mb={10} w={550} justify="space-between">
        <Button w={500} disabled={isMainnet || !isAddress(address)} onClick={getIsVoted}>Is voted</Button>
        <Text>{votedResult}</Text>
      </Group>
      <Divider label="Other requests" labelPosition="left"/>
      <Group mt={0} mb={10} w={550} justify="space-between">
        <Button w={500} disabled={isMainnet} onClick={getPositiveVoters}>Total positive votes</Button>
        <Text>{totalPositiveVoters}</Text>
      </Group>
      <Group mt={0} mb={10} w={550} justify="space-between">
        <Button w={500} disabled={isMainnet} onClick={getNegativeVoters}>Total negative votes</Button>
        <Text>{totalNegativeVoters}</Text>
      </Group>
    </Stack>

  );

}