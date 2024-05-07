"use client";
import React, { Suspense } from "react";
import SideBar from "@/components/common/DashBoard/SideBar";
import { useAccount } from "wagmi";
import { redirect } from "next/navigation";
import Loading from "./loading";

export default function DashBoardLayout({ children }) {
  const { isDisconnected } = useAccount();

  if (isDisconnected) {
    redirect("/");
  }

  return (
    <div className="pt-[5rem] mb-20">
      <div className="gradient h-[6rem] mb-10"></div>
      <div defaultValue="account" className="grid grid-cols-4 mx-10">
        <SideBar />
        <div className="ml-5 col-span-3 mb-16">
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </div>
      </div>
    </div>
  );
}
