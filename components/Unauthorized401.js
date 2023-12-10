import React from "react";
import bgImg from "../public/tmv-bg.jpeg";

import NotFound401SVG from "@/components/SVG/NotFound401SVG";

const Unauthorized401 = () => {
  return (
    <div
      className="lg:h-screen min-h-screen backgroundImage flex flex-col justify-center items-center px-10 bg-cover"
      style={{
        backgroundImage: `url(${bgImg.src})`,
      }}
    >
      <NotFound401SVG />
      <div className="text-[#6A7077] mt-5 mb-5">
        <p className="text-base sm:text-[20px] text-center">
          <span className="font-semibold">Oops!</span> We are sorry, your token
          has expired
        </p>
      </div>
    </div>
  );
};

export default Unauthorized401;

