import React, { useContext } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserContext } from "@/app/userContext";
import { connectKeplrWallet, connectMetaMaskWallet } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as Popover from "@radix-ui/react-popover";
import { Separator } from "../ui/separator";
import { useRouter } from "next/navigation";
import { FaExternalLinkAlt } from "react-icons/fa";
import Link from "next/link";
import { Button } from "../ui/button";


export const ConnectWalletModal = () => {
  const { setAddress, setBalance, setIsConnected, isConnected } =
    useContext(UserContext);
  const router = useRouter();

  return (
    <>
      {isConnected ? (
        <div className="font-semibold text-2xl mt-5 flex items-center purple-text">
          <Link href="/dashboard" className="mr-3">
            Go to Dashboard{" "}
          </Link>{" "}
          <FaExternalLinkAlt />
        </div>
      ) : (
        <Popover.Root modal={true}>
          <Popover.Trigger asChild>
            <Button className="gradient mt-10 text-2xl py-10 px-20">
              Get Started
            </Button>
          </Popover.Trigger>
          <Popover.Anchor />
          <Popover.Portal>
            <Popover.Content side="top">
              <div className="bg-[#161833f7] w-[60vw] rounded-lg h-[450px] p-10">
                <p className="text-4xl font-semibold text-center mb-10">
                  Choose Wallet
                </p>
                <Separator />
                <div className="flex justify-around my-10 ">
                  <div
                    className="gradient-border p-10  pointer flex flex-col items-center w-[200px]"
                    onClick={() => {
                      connectKeplrWallet(
                        setAddress,
                        setBalance,
                        setIsConnected
                      );
                      router.push("/dashboard");
                    }}
                  >
                    <img src="/images/keplr-logo.svg" className="w-[70px]" />
                    <p className="text-center mt-5 text-2xl tracking-wider">
                      Keplr
                    </p>
                  </div>

                  <div
                    className="gradient-border p-10 pointer flex flex-col items-center w-[200px]"
                    onClick={() => {
                      connectMetaMaskWallet(
                        setAddress,
                        setBalance,
                        setIsConnected
                      );
                      router.push("/dashboard");
                    }}
                  >
                    <img src="/images/metamask-fox.svg" className="w-[70px] " />
                    <p className="text-center mt-5 text-2xl tracking-wider">
                      Metamask
                    </p>
                  </div>
                </div>
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      )}
    </>
  );
};

export const ConnectWalletNav = () => {
  const router = useRouter();
  const {
    address,
    setAddress,
    balance,
    setBalance,
    isConnected,
    setIsConnected,
  } = useContext(UserContext);

  return (
    <div>
      {!isConnected ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="gradient font-bold py-4 rounded-lg px-8">
            CONNECT WALLET
          </DropdownMenuTrigger>
          <DropdownMenuContent className="z-[1001]">
            <DropdownMenuItem
              onClick={() => {
                connectKeplrWallet(setAddress, setBalance, setIsConnected);
                router.push("/dashboard");
              }}
            >
              {" "}
              <img src="/images/keplr.png" className="mr-4" />{" "}
              <span className="font-semibold pointer">Connect Keplr</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                connectMetaMaskWallet(setAddress, setBalance, setIsConnected);
                router.push("/dashboard");
              }}
            >
              <img src="/images/metamask-fox.svg" className="mr-4" />{" "}
              <span className="font-semibold pointer">Connect MetaMask</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div>
          <div className="flex items-center">
            <Avatar
              className="mr-4 pointer"
              onClick={() => router.push("/dashboard")}
            >
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div>
              {" "}
              <p>
                <strong>My Address:</strong> {address}
              </p>
              <p>
                <strong>Balance:</strong> {balance} SCRT
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
