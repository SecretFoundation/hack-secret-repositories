import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <center className="pb-3 absolute bottom-0 mx-auto w-full">
      <Link href="/">
        <img src="/images/logo.svg" alt="Shadow Tokens" width={100} />
      </Link>
    </center>
  );
};

export default Footer;
