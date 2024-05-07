"use client";
import "./globals.css";
import { useEffect, useState } from "react";
import { Inter as FontSans } from "next/font/google";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { cn } from "@/lib/utils";
import { User } from "./userContext";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Wrapper from "@/components/common/Wrapper";
import { config } from "@/lib/constants";
export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({ children }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);
  const queryClient = new QueryClient();

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link data-rh="true" rel="icon" href="favicon.svg"></link>
      </head>
      <body>
        {ready ? (
          <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
              <ConnectKitProvider
                customTheme={{
                  "--ck-overlay-background":
                    "linear-gradient(264.28deg, #dec7ff88 -38.2%, #5d27fe78 103.12%)",
                  "--ck-connectbutton-background":
                    "linear-gradient(264.28deg, #dec7ff -38.2%, #5c27fe 103.12%)",
                  "--ck-connectbutton-border-radius": "0.5rem",
                  "--ck-connectbutton-hover-background":
                    "linear-gradient(264.28deg, #dec7ff88 -38.2%, #5d27fe78 103.12%)",
                }}
              >
                <Wrapper>
                  <User>
                    <Header />
                    {children}
                    <Footer />
                  </User>
                </Wrapper>
              </ConnectKitProvider>
            </QueryClientProvider>
          </WagmiProvider>
        ) : null}
      </body>
    </html>
  );
}
