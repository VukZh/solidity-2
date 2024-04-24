// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import {FC, use, useState} from "react";
import {notifications} from "@mantine/notifications";
import {Context} from "../state/ContextProvider.tsx";
import {Anchor, Button, Group, Loader, NumberInput, Select, Stack, Text} from "@mantine/core";
import {createWalletClient, custom} from "viem";
import {sepolia} from "viem/chains";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {ErrorType} from "viem/_types/errors/utils";


const Coins = [
  {
    name: "DAI",
    dec: 18,
    address: "0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357"
  },
  {
    name: "USDT",
    dec: 6,
    address: "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0"
  },
  {
    name: "AAVE",
    dec: 18,
    address: "0x88541670E55cC00bEEFD87eB59EDd1b7C511AC9a"
  }
]

const ContractAbi = [{
  "inputs": [{"internalType": "address", "name": "_addressProvider", "type": "address"}],
  "stateMutability": "nonpayable",
  "type": "constructor"
}, {
  "anonymous": false,
  "inputs": [{"indexed": true, "internalType": "address", "name": "addr", "type": "address"}, {
    "indexed": false,
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }],
  "name": "GetFlashLoan",
  "type": "event"
}, {
  "inputs": [],
  "name": "ADDRESSES_PROVIDER",
  "outputs": [{"internalType": "contract IPoolAddressesProvider", "name": "", "type": "address"}],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "POOL",
  "outputs": [{"internalType": "contract IPool", "name": "", "type": "address"}],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{"internalType": "address", "name": "asset", "type": "address"}, {
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }, {"internalType": "uint256", "name": "premium", "type": "uint256"}, {
    "internalType": "address",
    "name": "initiator",
    "type": "address"
  }, {"internalType": "bytes", "name": "params", "type": "bytes"}],
  "name": "executeOperation",
  "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{"internalType": "address", "name": "_token", "type": "address"}, {
    "internalType": "uint256",
    "name": "_amount",
    "type": "uint256"
  }], "name": "fn_RequestFlashLoan", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
  "inputs": [],
  "name": "str",
  "outputs": [{"internalType": "string", "name": "", "type": "string"}],
  "stateMutability": "view",
  "type": "function"
}, {"stateMutability": "payable", "type": "receive"}]
const makeNotification = (msg: string) => {
  notifications.show({
    title: 'Error',
    message: msg,
    autoClose: 3000,
    style: {position: "absolute", bottom: "50px", right: "10px", maxWidth: "600px"},
    color: "red",
  })
}
export const FlashLoan: FC = () => {

  const [selected, setSelected] = useState<string>(Coins[0].name)
  const [amount, setAmount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [hash, setHash] = useState<string>('')

  const {activeChain} = use(Context);
  const isMainnet = activeChain === 'Eth'

  const getFlashLoanHash = async () => {
    setIsLoading(true)
    const clientWallet = createWalletClient({
      chain: sepolia,
      transport: custom(window.ethereum!)
    })
    try {
      if (amount === 0) {
        throw new Error('The amount should be')
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const {address: addr, dec} = Coins.find(d => d.name === selected);
      const [account] = await clientWallet.getAddresses()
      const hash = await clientWallet.writeContract({
        address: process.env.FLASHLOAN_CONTRACT_ADDRESS as `0x${string}`,
        abi: ContractAbi,
        functionName: 'fn_RequestFlashLoan',
        account,
        args: [addr, amount * Math.pow(10, dec)],
      })
      setHash(hash)
      setIsLoading(false)
      console.log("res", hash)
    } catch (e: ErrorType) {
      console.error(e)
      makeNotification(e.message.toString())
      setIsLoading(false)
    }
  };

  return (
    <Stack m={15}><Text size="md">Flash Loan (only for Sepolia network)</Text>

      <Select
        label="Coin select"
        placeholder="Pick coin"
        w={500}
        mt={10}
        mb={10}
        value={selected}
        onChange={e => setSelected(e!)}
        data={Coins.map(d => d.name)}
      />

      <NumberInput placeholder="Amount" value={amount} w={500} onChange={(e) => setAmount(Number(e))}
      />

      <Group mt={0} mb={10} w={700} h={70}>
        <Button w={500} disabled={isMainnet} onClick={getFlashLoanHash}>Flash loan {selected}</Button>
        {isLoading ? <Loader color="blue" size={12} type="bars"/> :
          hash && <Anchor href={`https://sepolia.etherscan.io/tx/${hash}`} target="_blank" underline="hover">
                Txn hash
            </Anchor>}
      </Group>

    </Stack>
  );
}