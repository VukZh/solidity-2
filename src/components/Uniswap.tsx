import {IconExchange} from '@tabler/icons-react';
import {Button, NativeSelect, NumberInput, Stack} from "@mantine/core";
import {useState} from "react";

const icon = <IconExchange size={14}/>;

const tokens = [{
  name: 'weth',
  address: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
}, {
  name: 'uni',
  address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
}, {
  name: 'link',
  address: '0x779877A7B0D9E8603169DdbD7836e478b4624789',
}, {
  name: 'matic',
  address: '0x8093cF4fB28cF836dc241232a3aCc662637367cE',
}, {
  name: 'usdt',
  address: '0x5F4c7D793D898e64eddd1fC82D27EcfB5F6e4596'
}];

export const UniswapUR = () => {
  const [inputToken, setInputToken] = useState<string>(tokens[0].name);
  const [outputToken, setOutputToken] = useState<string>(tokens[1].name);
  const [amountIn, setAmountIn] = useState<number>(0.1);


  return (

    <Stack
      w={'30vw'}
      gap="md"
      ml="md"
    >
      <NativeSelect
        mt="md"
        label="Input token"
        description="Input token for the swap"
        data={tokens.map(t => t.name)}
        value={inputToken}
        onChange={e => setInputToken(e.currentTarget.value)
        }
      />
      <NumberInput
        label="Amount in"
        placeholder="Amount in"
        description="Amount input token for the swap"
        value={amountIn}
        onChange={e => setAmountIn(Number(e))}
        allowNegative={false}
        min={0}
        stepHoldDelay={500}
        stepHoldInterval={100}
      />
      <NativeSelect
        mt="md"
        label="Output token"
        description="Output token for the swap"
        data={tokens.map(t => t.name)}
        value={outputToken}
        onChange={e =>
          setOutputToken(e.currentTarget.value)
        }
      />
      <Button leftSection={icon}
              variant="gradient"
              gradient={{from: 'tomato', to: 'green', deg: 90}}
      >SWAP</Button>
    </Stack>

  )
}