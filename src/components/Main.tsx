import {ContextProvider} from "../state/ContextProvider.tsx";
import {RootComponent} from "./RootComponent.tsx";

export const Main = () => {

  return (
    <ContextProvider>
      <RootComponent/>
    </ContextProvider>
  );
}