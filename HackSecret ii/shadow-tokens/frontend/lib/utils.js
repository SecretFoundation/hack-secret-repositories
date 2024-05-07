import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
const { SecretNetworkClient, MetaMaskWallet } = require("secretjs");
const DENOM = "SCRT";
const MINIMAL_DENOM = "uscrt";

// Testnet
const GRPCWEB_URL = "https://grpc.pulsar.scrttestnet.com";
const LCD_URL = "https://api.pulsar.scrttestnet.com";
const RPC_URL = "https://rpc.pulsar.scrttestnet.com";
const CHAIN_ID = "pulsar-2";
const CHAIN_NAME = "Secret Testnet";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function truncateWalletAddress(walletAddress, length = 8) {
  if (!walletAddress || typeof walletAddress !== "string") {
    return "Invalid Address";
  }

  const truncatedAddress =
    walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4);

  return truncatedAddress;
}

export const connectKeplrWallet = async (
  setAddress,
  setBalance,
  setKeplrReady
) => {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const getKeplr = async () => {
    while (
      !window.keplr &&
      !window.getOfflineSigner &&
      !window.getEnigmaUtils
    ) {
      await sleep(10);
    }

    await window.keplr.experimentalSuggestChain({
      chainId: CHAIN_ID,
      chainName: CHAIN_NAME,
      rpc: RPC_URL,
      rest: LCD_URL,
      bip44: {
        coinType: 529,
      },
      coinType: 529,
      stakeCurrency: {
        coinDenom: DENOM,
        coinMinimalDenom: MINIMAL_DENOM,
        coinDecimals: 6,
      },
      bech32Config: {
        bech32PrefixAccAddr: "secret",
        bech32PrefixAccPub: "secretpub",
        bech32PrefixValAddr: "secretvaloper",
        bech32PrefixValPub: "secretvaloperpub",
        bech32PrefixConsAddr: "secretvalcons",
        bech32PrefixConsPub: "secretvalconspub",
      },
      currencies: [
        {
          coinDenom: DENOM,
          coinMinimalDenom: MINIMAL_DENOM,
          coinDecimals: 6,
        },
      ],
      feeCurrencies: [
        {
          coinDenom: DENOM,
          coinMinimalDenom: MINIMAL_DENOM,
          coinDecimals: 6,
        },
      ],
      gasPriceStep: {
        low: 0.1,
        average: 0.25,
        high: 0.4,
      },
      features: ["secretwasm"],
    });

    await window.keplr.enable(CHAIN_ID);

    const keplrOfflineSigner = window.getOfflineSignerOnlyAmino(CHAIN_ID);

    const [{ address: myAddress }] = await keplrOfflineSigner.getAccounts();

    const secretjs = new SecretNetworkClient({
      url: LCD_URL,
      chainId: CHAIN_ID,
      wallet: keplrOfflineSigner,
      walletAddress: myAddress,
      encryptionUtils: window.getEnigmaUtils(CHAIN_ID),
    });

    const {
      balance: { amount },
    } = await secretjs.query.bank.balance({
      address: myAddress,
      denom: MINIMAL_DENOM,
    });

    setBalance(new Intl.NumberFormat("en-US", {}).format(amount / 1e6));

    setKeplrReady(true);
    setAddress(truncateWalletAddress(myAddress));
  };
  getKeplr();
  return () => {};
};

export const connectMetaMaskWallet = async (
  setAddress,
  setBalance,
  setKeplrReady
) => {
  const [ethAddress] = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  const wallet = await MetaMaskWallet.create(window.ethereum, ethAddress);

  const secretjs = new SecretNetworkClient({
    url: LCD_URL,
    chainId: CHAIN_ID,
    wallet: wallet,
    walletAddress: wallet.address,
  });

  const {
    balance: { amount },
  } = await secretjs.query.bank.balance({
    address: wallet.address,
    denom: MINIMAL_DENOM,
  });

  setBalance(new Intl.NumberFormat("en-US", {}).format(amount / 1e6));

  setKeplrReady(true);
  setAddress(truncateWalletAddress(wallet.address));

};
