import { AppProps } from "next/app";
import { FC } from "react";
import "@/styles/globals.css";
import SolanaProvider from "@/components/solana/web3provider";

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <SolanaProvider>
      <Component {...pageProps} />
    </SolanaProvider>
  );
};

export default App;
