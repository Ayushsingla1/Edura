import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { eduChainTestnet } from "wagmi/chains";
import React from "react";

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [eduChainTestnet],
    transports: {
      // RPC URL for each chain
      [eduChainTestnet.id]: http(),
    },

    walletConnectProjectId: "123",

    appName: "Edura",
  }),
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children } : {children : React.ReactNode}) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};