"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

const MintNFT = () => {
  const [formParams, updateFormParams] = useState({
    name: "",
    description: "",
    price: "",
  });
  
  return (
    <>
      <p className="font-semibold text-4xl mb-5">Mint NFT</p>
      <div className="grid grid-cols-3">
        <div className={`col-span-2 bg-dark rounded p-10`}>
          <form>
            <div className="flex flex-col mb-5">
              <label>NFT Name</label>
              <input />
            </div>
            <div className="flex flex-col mb-5">
              <label>NFT Description</label>
              <textarea />
            </div>
            <div className="flex flex-col mb-5">
              <label>NFT Price in MATIC</label>
              <input type="number" />
            </div>

            <div className="flex flex-col mb-5">
              <label>Upload Image</label>
              <input type={"file"} />
            </div>
            <Button className="gradient w-full">Mint NFT</Button>
          </form>
        </div>

        <div></div>
      </div>
    </>
  );
};

export default MintNFT;
