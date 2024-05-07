import React from "react";

const Wrapper = ({ children }) => {
  return (
    <div className="h-[100%] w-[100%] overflow-hidden relative min-h-screen">
      {children}

      <div className="shape"></div>
      <div className="shape"></div>
      <div className="shape right"></div>
      <div className="shape s3 right"></div>
      <div className="shape s3 right"></div>
    </div>
  );
};

export default Wrapper;
