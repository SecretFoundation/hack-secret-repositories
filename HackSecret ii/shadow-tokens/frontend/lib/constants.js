import { getDefaultConfig } from "connectkit";
import { polygonMumbai } from "viem/chains";
import { createConfig, http } from "wagmi";

const projectId = process.env["NEXT_PUBLIC_PROJECT_ID"] ?? "";

export const config = createConfig(
  getDefaultConfig({
    appName: "shadow-tokens",
    walletConnectProjectId: projectId,
    chains: [polygonMumbai],
    ssr: true,
    transports: {
      [polygonMumbai.id]: http("https://rpc-mumbai.maticvigil.com"),
    },
    appDescription:
      "",
    appUrl: "",
    appIcon: "",
  })
);
