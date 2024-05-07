import React from "react";

import Wrapper from "@/components/Wrapper";
import { FadeIn } from "@/components/FadeIn";
import { NFTGallery } from "@/components/NFTLoaders";
import Image from "next/image";
import { fetchNFTDataFromAPI } from "@/lib/hooks/useNFTCollectibles";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { projectInfo,linkMap} from "@/data/project-summary";
import { ConnectKitButton } from "connectkit";
import { SendTransaction } from "@/components/SendTransaction";
import {MyForm} from "@/components/nftForm";
import { Button } from "@/components/ui/button";
import { useAccount } from 'wagmi';
import { YourSlices } from "@/components/NFTLoaders/your-slices";
import {RandomPizzaPlaceComponent} from '../components/randomresult';


//use to determine if NFT holder
const Page: React.FC = () => {

  const account = useAccount();

  return (
    <main>
      <div className="fixed top-3 right-3 z-10">
        <ConnectKitButton />
      </div>
      <Wrapper>
        <FadeIn>
          <div className="flex items-center flex-col mx-auto w-full mt-16 md:mt-32 justify-center px-2 md:px-8">
            <h1 className="font-bold mt-4 text-2xl text-white">
            🍕🍕
              {projectInfo?.name ?? ""}🍕🍕
           
            </h1>
            <p className="text-white text-center text-base my-8">
            Share your pizza cost in ETH, BTC, or USDC and earn an NFT! <br></br><br></br> After that, discover what others paid for a slice!
</p>       
            <Tabs defaultValue="links" className="w-full">
              <TabsList className="flex items-center justify-center">
              <TabsTrigger value="random">Hungry For Some Pizza?</TabsTrigger>
                <TabsTrigger value="form">Share your Pizza Price!</TabsTrigger>
                <TabsTrigger value="data">Your "Slices"</TabsTrigger>
                <TabsTrigger value="nfts">Other People's slices. </TabsTrigger>
              </TabsList>
              <TabsContent
                value="form"
                className="w-full mt-8 flex flex-col items-center justify-center"
              >
 <MyForm></MyForm>
              </TabsContent>
              <TabsContent value="nfts" className="grid md:grid-cols-3 grid-cols-2 gap-3 max-w-96 place-self-center mx-auto">   
               <NFTGallery contractAddress={projectInfo.nftAddress} userAddress={account.address}></NFTGallery></TabsContent>
              <TabsContent value="data" className="grid md:grid-cols-3 grid-cols-2 gap-3 max-w-96 place-self-center mx-auto">
                <YourSlices address={account.address}></YourSlices>
              </TabsContent>
              <TabsContent value="random" className="w-full mt-8 flex flex-col items-center justify-center">

                <RandomPizzaPlaceComponent></RandomPizzaPlaceComponent>

              </TabsContent>
              <TabsContent value="send">
                <SendTransaction />
              </TabsContent>
            </Tabs>
          </div>
        </FadeIn>
      </Wrapper>
    </main>
  );
};

export default Page;

