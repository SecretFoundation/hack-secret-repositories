import Collection from "@/components/common/DashBoard/Collection";
import React from "react";
import Loading from "./loading";

const Page = async () => {
  return (
    <>
      <p className="font-semibold text-4xl mb-5">Private Collection</p>
      <Collection />
    </>
  );
};

export default Page;
