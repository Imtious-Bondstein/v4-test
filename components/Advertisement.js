import Link from "next/link";
import React from "react";
import addvertisement from "../public/images/addvertisement.png";
import addvertisement2 from "../public/images/Ad.png";

const Advertisement = () => {
  return (
    <div className="">
      <Link href="/" className="">
        <img
          src={addvertisement.src}
          className="w-full rounded-xl hidden md:block"
        />
        <img
          src={addvertisement2.src}
          className="w-full h-[120px] xs:h-[150px] sm:h-[200px] rounded-xl md:hidden"
        />
      </Link>
    </div>
  );
};

export default Advertisement;
