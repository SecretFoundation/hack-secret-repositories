import { SecretNetworkClient, Wallet } from "secretjs";
import * as dotenv from "dotenv" // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

const wallet = new Wallet(process.env.MNEMONIC);

const secretjs = new SecretNetworkClient({
  url: process.env.SECRET_LCD_URL,
  wallet: wallet,
  walletAddress: wallet.address,
  chainId: process.env.SECRET_CHAIN_ID,
});

async function createViewingKey(contractAddress, contractCodeHash) {
  const msg = {
    create_viewing_key: {
      entropy: Math.random().toString(36).substr(2),
    },
  };



  const response = await secretjs.tx.compute.executeContract(
    {
      sender: wallet.address,
      contract_address: contractAddress,
      code_hash: contractCodeHash,
      msg: msg,
    },
    {
      gasLimit: 250_000,
    }
  );

  const dataString = response.data.length > 0
  ? Buffer.from(response.data[0]).toString('binary')
  : '';

  console.log("Binary data:", dataString.slice(3));

  if (dataString) {
    const logs = JSON.parse(dataString.slice(3));
    const viewingKey = logs.create_viewing_key.key;
    console.log("Viewing Key:", viewingKey);
    return viewingKey;
  } else {
    console.error("Error: Empty data in the response.");
    return null;
  }
}

async function getBalance(contractAddress, contractCodeHash, address, viewingKey) {
  const queryMsg = {
    balance: {
      address: address,
      key: viewingKey,
    },
  };

  console.log(queryMsg)

  const balanceResponse = await secretjs.query.compute.queryContract({
    contract_address: contractAddress,
    code_hash: contractCodeHash,
    query: queryMsg,
  });

  console.log(balanceResponse)

  return balanceResponse.balance.amount;
}

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS
  const contractCodeHash = process.env.CONTRACT_CODE_HASH
  const address = wallet.address;

  const viewingKey = await createViewingKey(contractAddress, contractCodeHash);
  console.log(`Viewing Key: ${viewingKey}`);

  const balance = await getBalance(contractAddress, contractCodeHash, address, viewingKey);
  console.log(`Balance: ${balance}`);
}

main().catch((error) => {
  console.error("An error occurred while getting the balance:", error);
});