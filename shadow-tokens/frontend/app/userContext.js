import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export function User({ children }) {
  const [address, setAddress] = useState();
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState();
  const [NFTs, setNFTs] = useState(null);
  async function getNft() {
    await axios
      .get("https://nft-server-7h9e.vercel.app/api/nfts")
      .then((res) => {
        setNFTs(res.data.items);
      });
  }
  useEffect(() => {
    getNft();
  }, []);
  return (
    <UserContext.Provider
      value={{
        address,
        setAddress,
        isConnected,
        setIsConnected,
        balance,
        setBalance,
        NFTs,
        setNFTs,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
