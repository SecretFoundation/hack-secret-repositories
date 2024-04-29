require("@chainlink/env-enc").config();

const DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS = 3;

const PRIVATE_KEY = process.env.PRIVATE_KEY;


const accounts = [];
if (PRIVATE_KEY) {
  accounts.push(PRIVATE_KEY);
}
const networks = {
 
  polygonMumbai: {
    url: process.env.MUMBAI_RPC_URL || "UNSET",
    gasPrice: undefined,
    nonce: undefined,
    accounts,
    verifyApiKey: process.env.POLYGONSCAN_API_KEY || "UNSET",
    chainId: 11155111,
    confirmations: DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
    nativeCurrencySymbol: "MATIC",
  },
};

module.exports = {
  networks,
};
