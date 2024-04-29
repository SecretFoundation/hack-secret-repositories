"use client";
import React, { useContext } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { UserContext } from "@/app/userContext";
import { useRouter } from "next/navigation";
import Loader from "../Loader";

const Collection = ({ isDashboard = true }) => {
  const { NFTs } = useContext(UserContext);
  return (
    <>
      {NFTs === null ? (
        <Loader count={isDashboard ? 3 : 4} />
      ) : (
        <div
          className={`grid ${
            isDashboard ? "grid-cols-3" : "grid-cols-4"
          } gap-4`}
        >
          {NFTs.map((nft, index) => (
            <div key={index}>
              <CardComp nft={nft} isDashboard={isDashboard} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Collection;

export const CardComp = ({ isDashboard, nft }) => {
  const router = useRouter();
  const { tokenId, price, image, name } = nft;

  return (
    <Card className="bg-dark pointer border-0 text-muted-foreground backdrop-blur-sm">
      <Link href={`/${isDashboard ? "dashboard" : "explore"}/${tokenId}`}>
        <CardHeader className="overflow-hidden h-[272px]">
          <img
            src={image}
            className="w-full rounded-lg h-full transition object-cover"
          />
        </CardHeader>
        <CardContent>
          <CardTitle className="leading-purple">{name}</CardTitle>
        </CardContent>
        <Separator className="bg-[#888]" />
      </Link>
      <CardFooter className="mt-4 flex text-sm justify-between items-center">
        <div className="flex justify-between items-center">
          <div className="bg-white rounded-full flex items-center w-[25px] h-[25px] p-1">
            <img src="/images/polygon-matic-logo.svg" width={20} />
          </div>
          <div className="text-xs ml-2 text-white">
            <p>MATIC</p>
            <p className="font-bold">{price}</p>
          </div>
        </div>
        <Button
          className="gradient ml-5 px-6 font-semibold"
          onClick={() => {
            router.push(`/dashboard/fraction/${tokenId}`);
          }}
        >
          Fractionalize
        </Button>
      </CardFooter>
    </Card>
  );
};
