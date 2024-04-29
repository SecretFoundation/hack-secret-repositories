import React from "react";
// import { ConnectWalletModal, CustomConnectKitButton } from "./ConnectWallet";
import { useAccount } from "wagmi";
import Link from "next/link";
import { FaExternalLinkAlt } from "react-icons/fa";
import { ConnectKitButton } from "connectkit";

const Hero = () => {
  const { isDisconnected } = useAccount();
  return (
    <div className="pt-[16rem] flex flex-col items-center text-center">
      <h1 className="mt-10 text-7xl font-bold">Secure and Store Digital Art</h1>
      <p className="mt-10 text-2xl">
        Shadow tokens is a secret vault for safe keeping private digital tokens{" "}
        <br />
        on the Secret Network
      </p>
      {/* <ConnectWalletModal /> */}
      {/* <CustomConnectKitButton /> */}
      {!isDisconnected ? (
        <div className="font-semibold text-2xl mt-5 flex items-center purple-text">
          <Link href="/dashboard" className="mr-3">
            Go to Dashboard{" "}
          </Link>{" "}
          <FaExternalLinkAlt />
        </div>
      ) : (
        <div className="mt-5">
          <ConnectKitButton />
        </div>
      )}
    </div>
  );
};

export default Hero;
