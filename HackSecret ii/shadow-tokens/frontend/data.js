import { BsCollectionFill } from "react-icons/bs";
import { RiGitRepositoryPrivateFill } from "react-icons/ri";
import { MdCreateNewFolder } from "react-icons/md";
import { BiSolidPurchaseTag } from "react-icons/bi";

export const sidebarLinks = [
  {
    name: "My Collection",
    route: "/dashboard",
    icon: <RiGitRepositoryPrivateFill />,
  },
  {
    name: "Mint NFT",
    route: "/dashboard/mint",
    icon: <MdCreateNewFolder />,
  },
  {
    name: "Fractionalized NFTs",
    route: "/dashboard/fractionalized-nfts",
    icon: <BsCollectionFill />,
  },
  {
    name: "Purchased Fractions",
    route: "/dashboard/fractionalized-nfts",
    icon: <BiSolidPurchaseTag />,
  },
];

export const navLinks = [
  {
    title: "Home",
    link: "/",
  },

  {
    title: "Explore",
    link: "/explore",
  },
];
