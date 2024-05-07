import "@/styles/globals.css";
import { WagmiProvider, createConfig, http } from "wagmi";
import { arbitrumSepolia, baseSepolia, mainnet, polygon, polygonMumbai } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
//way to fetch data
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
//connects walletr
import { ThemeProvider } from "@/components/themes";

import type { AppProps } from "next/app";
const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [baseSepolia],
    transports: {
      // RPC URL for each chain
      [baseSepolia.id]: http(
        `https://base-sepolia.blockpi.network/v1/rpc/public`,
      )
    },


    // Required API Keys
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',

    // Required App Info
    appName: "CryptoSlices",

    // Optional App Info
    appDescription: "Share your pizza cost in ETH or Satoshi and earn an NFT. Then, discover what others paid for a slice!",
    appUrl: "🍕", // your app's url
    appIcon: "🍕", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  }),
);


export default function App({ Component, pageProps }: AppProps) {

  
const queryClient = new QueryClient();
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
        <ThemeProvider
          
          
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
        <Component {...pageProps} />;
        </ThemeProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
