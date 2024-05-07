import * as React from 'react'
import { useSendTransaction } from 'wagmi' 
import { parseEther } from 'viem' 
import { useReadContract } from 'wagmi'
 
export function SendTransaction() {
  // const { data: hash, sendTransaction, isPending} = useSendTransaction() 

  // async function submit(e: React.FormEvent<HTMLFormElement>) { 
  //   e.preventDefault() 
  //   const formData = new FormData(e.target as HTMLFormElement)
  //   const value = formData.get('value') as string 
  //   sendTransaction({ to: '0xc0163E58648b247c143023CFB26C2BAA42C9d9A9', value: parseEther(value) }) 
  // } 

//update to mint NFT
const NFT_ABI =[
	{
		"inputs": [],
		"name": "buy",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_trait",
				"type": "string"
			}
		],
		"name": "mint",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "getTraits",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "ownerOf",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

//update to mint contract
const contractConfig = {
    contract: ('0x44c938513d334b4725cbb121a77fc2fbe7d06ac6' as `Ox${string}`),
    abi:NFT_ABI

};

//update to mint function
    const { data: ownerOf } = useReadContract({
      ...contractConfig,
      //call function in smart contract
      functionName: 'ownerOf',
	  //no arguments for nft contract
      args:[0],
      //nft 0 is looked for in the function call, since the ownerOF accepts a parameter of nftID
    })
  

  return (
    <form onSubmit={submit} className="flex flex-col items-center justify-center space-y-4">
      <h1 className="text-2xl font-bold">Buy an NFT!</h1>
      <input name="value" placeholder="0.05 ETH" required className="p-2 border border-gray-300 rounded" />
      <button type="submit" disabled={isPending} className="p-2 text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed bg-purple w-100">
        {isPending ? 'Confirming...' : 'Donate'}
      </button>
      {hash && <div className="text-gray-500">Transaction Hash: {hash}</div>}
    </form>
  )
  }
