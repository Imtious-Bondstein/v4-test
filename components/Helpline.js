import React from "react";
import Headphone from "@/svg/HeadphoneSVG";

const Helpline = () => {
  return (
    <div className="mt-6 hidden md:block">
      <p>Call for any assistance</p>
      <div className="flex justify-center items-center">
        <Headphone />
        <a
          href="tel:09639595959"
          className="text-2xl text-primaryText font-bold ml-3"
        >
          09639595959
        </a>
      </div>
    </div>
  );
};

export default Helpline;
