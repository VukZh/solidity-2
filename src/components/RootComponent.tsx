import {AppShell, Flex, SegmentedControl, Tabs, Text} from "@mantine/core";
import {Wallet} from "./Wallet.tsx";
import {UniswapUR} from "./Uniswap.tsx";
import {Block} from "./Block.tsx";
import {Context} from "../state/ContextProvider.tsx";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import {use} from 'react';
import {chain, tabs} from "../state/constants.ts";

export const RootComponent: React.FC = () => {
  const {activeTab, setActiveTab, setActiveChain, walletAddress} = use(Context);
  return (
    <AppShell
      withBorder={false}
      padding="md"
      header={{height: 30}}
      footer={{height: 30}}
    >
      <AppShell.Header style={{marginLeft: 25}}><Flex justify="space-between"
                                                      align="flex-start"
                                                      direction="row"
                                                      wrap="wrap"><Text size="xl" variant="gradient"
                                                                        fw={900}
                                                                        gradient={{
                                                                          from: 'tomato',
                                                                          to: 'green',
                                                                          deg: 90
                                                                        }}
                                                                        style={{width: 220}}>Solidity React
        Project</Text>
        <Flex justify="center" align="center">
          {walletAddress && <div style={{marginRight: 20}}>{walletAddress}</div>}
          <SegmentedControl data={chain} onChange={setActiveChain}/>
          <Wallet/>
        </Flex>


      </Flex></AppShell.Header>
      <AppShell.Main>
        <Tabs value={activeTab} onChange={setActiveTab} orientation="vertical">
          <Tabs.List>
            <Tabs.Tab value="uniswap"
                      style={{backgroundColor: activeTab === tabs[0] ? 'darkcyan' : "transparent"}}>Uniswap</Tabs.Tab>
            <Tabs.Tab value="chainlink"
                      style={{backgroundColor: activeTab === tabs[1] ? 'darkcyan' : "transparent"}}>Chainlink</Tabs.Tab>
            <Tabs.Tab value="myContract"
                      style={{backgroundColor: activeTab === tabs[2] ? 'darkcyan' : "transparent"}}>My contract</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="uniswap"><UniswapUR/></Tabs.Panel>
          <Tabs.Panel value="chainlink">chainlink
            tab content</Tabs.Panel>
          <Tabs.Panel value="myContract">my contract
            tab content</Tabs.Panel>
        </Tabs>
      </AppShell.Main>
      <AppShell.Footer style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <Block/>
        <Text
          variant="gradient"
          fw={900}
          gradient={{from: 'tomato', to: 'green', deg: 90}}
          style={{width: 80, marginRight: 15}}
        >
          Vuk, 2024
        </Text></AppShell.Footer>
    </AppShell>
  )

}