import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarLinks } from "@/data";
import { useAccount } from "wagmi";
import { truncateWalletAddress } from "@/lib/utils";

const SideBar = () => {
  const currentPath = usePathname();
  const [path, setPath] = useState(currentPath);
  const { address } = useAccount();

  useEffect(() => {
    setPath(currentPath);
  }, [path, currentPath]);

  return (
    <div className="flex flex-col items-center bg-[#8173c131] p-10 h-fit">
      <Avatar className="w-[150px] h-[150px]">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      <div className="text-white text-center mb-6">
        <p className=" font-bold text-xl mt-4 my-2">Shadow User</p>
        <p className="font-semibold text-sm">
          {" "}
          {truncateWalletAddress(address)}{" "}
        </p>
      </div>

      {sidebarLinks.map((item, index) => (
        <Link key={index} href={item.route} className="mb-4">
          <div className={`sidebar-tab ${path === item.route && "active"}`}>
            {item.icon} <p className="ml-3">{item.name} </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SideBar;
