import Navigation from "./navigation";
import AppProvider from "./context";
import { RecoilRoot } from "recoil";
import { ChakraProvider } from "@chakra-ui/react";

const App = () => {
  return (
    <ChakraProvider>
      <RecoilRoot>
        <AppProvider>
          <Navigation />
        </AppProvider>
      </RecoilRoot>
    </ChakraProvider>
  );
};

export default App;
