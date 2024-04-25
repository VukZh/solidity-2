import React, {createContext} from "react";
import {chain, tabs} from "./constants.ts";

interface IContext {
  activeTab: string,
  activeChain: string,
  walletAddress: string
  setActiveTab: React.Dispatch<React.SetStateAction<IContext['activeTab']>>,
  setActiveChain: React.Dispatch<React.SetStateAction<IContext['activeChain']>>,
  setWalletAddress: React.Dispatch<React.SetStateAction<IContext['walletAddress']>>,
}


export const Context = createContext<IContext | null>(null);
export const ContextProvider = ({children}: React.PropsWithChildren<object>) => {
  const [activeTab, setActiveTab] = React.useState<IContext['activeTab']>(tabs[0]);
  const [activeChain, setActiveChain] = React.useState<IContext['activeChain']>(chain[0]);
  const [walletAddress, setWalletAddress] = React.useState<IContext['walletAddress']>("");

  return (
    <Context.Provider value={{activeTab, activeChain, setActiveTab, setActiveChain, walletAddress, setWalletAddress}}>
      {children}
    </Context.Provider>
  );
}