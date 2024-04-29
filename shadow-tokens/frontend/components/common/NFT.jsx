import React, { useContext, useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useParams, useRouter } from "next/navigation";
import { UserContext } from "@/app/userContext";
import { Button } from "../ui/button";
import { Separator } from "@/components/ui/separator";
import CustomTable from "./Table";

const NFT = () => {
  const { NFTs } = useContext(UserContext);
  const [data, setData] = useState(null);
  const { nft } = useParams();
  const router = useRouter();

  function fet() {
    setData(NFTs.find((item) => item.tokenId.toString() == nft));
  }

  useEffect(() => {
    fet();
  }, []);

  return (
    <>
      {data === null ? (
        <p>Loading...</p>
      ) : (
        <>
          {" "}
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
          <div className=" mt-5 grid grid-cols-2 gap-4 mb-16">
            <div className="bg-dark rounded-lg h-fit">
              <img
                src={data.image}
                className="object-cover w-full h-[400px] rounded-t-lg"
              />
              <div className="p-5">
                <p className="text-2xl font-semibold leading-purple">
                  {data.name}{" "}
                </p>
                <p>{data.description} </p>
              </div>
              <Separator className="bg-[#888]" />
              <div className="p-5 flex justify-between items-center">
                <div className="flex justify-between items-center">
                  <div className="bg-white rounded-full flex items-center w-[25px] h-[25px] p-1">
                    <img src="/images/polygon-matic-logo.svg" width={20} />
                  </div>
                  <div className="text-xs ml-2 text-white">
                    <p>MATIC</p>
                    <p className="font-bold">{data.price}</p>
                  </div>
                </div>
                <Button className="gradient ml-5 px-6 font-semibold">
                  Add to Vault
                </Button>
              </div>
            </div>
            <div>
              <div className="p-4 bg-dark rounded-lg">
                <p className="text-2xl font-semibold leading-purple my-5">
                  Fractional Owners:
                </p>
                <CustomTable />
              </div>
            </div>
          </div>{" "}
        </>
      )}
    </>
  );
};

export default NFT;
