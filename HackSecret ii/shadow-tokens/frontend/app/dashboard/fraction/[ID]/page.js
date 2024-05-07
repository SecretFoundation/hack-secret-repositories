"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";
import { IoMdArrowRoundBack } from "react-icons/io";

const FractionNFT = () => {
  const router = useRouter();

  return (
    <>
      <div
        onClick={() => router.back()}
        className="purple-text font-semibold text-2xl pointer"
      >
        <span className="flex items-center">
          {" "}
          <IoMdArrowRoundBack />
          Go Back
        </span>
      </div>
      <div className="grid grid-cols-2">
        <div className="my-5 p-4 bg-dark rounded-lg mb-5">
          <form>
            <p className="text-2xl font-semibold leading-purple mb-5">
              Fraction NFT
            </p>
            <div className="flex flex-col mb-5">
              {" "}
              <label>Fraction Amount:</label>
              <input />
            </div>
            <div className="flex flex-col mb-5">
              {" "}
              <label>Price per fraction:</label>
              <input />
            </div>
            <Button className="gradient w-full">Send Fraction</Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default FractionNFT;
