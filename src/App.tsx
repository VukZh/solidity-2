import {Center, Box} from '@mantine/core';
import '@mantine/core/styles.css';
import {MantineProvider} from '@mantine/core';

function App() {


  return <MantineProvider defaultColorScheme="dark">
    <Center maw={'100vw'} h={'100vh'} bg="var(--mantine-color-gray-light)">
      <Box bg="var(--mantine-color-blue-light)">Solidity React Project</Box>
    </Center>
  </MantineProvider>


}

export default App
