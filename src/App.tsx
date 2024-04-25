// import {Center, Box} from '@mantine/core';
import '@mantine/core/styles.css';
import {MantineProvider} from '@mantine/core';
import {Main} from "./components/Main.tsx";

function App() {


  return <MantineProvider defaultColorScheme="dark">
    <Main></Main>
  </MantineProvider>


}

export default App
