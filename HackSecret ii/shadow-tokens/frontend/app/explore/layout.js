"use client";
import React, { Suspense } from "react";
import Loading from "./loading";

export default function ExploreLayout({ children }) {
  return (
    <div className="pt-[5rem] mb-20">
      <div className="gradient h-[6rem] mb-10"></div>
      <div className="px-10 mx-10">
        {" "}
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </div>
    </div>
  );
}
