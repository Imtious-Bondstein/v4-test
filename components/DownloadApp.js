import React from "react";
import AppleStore from "@/svg/AppleStoreSVG";
import PlayStore from "@/svg/PlayStoreSVG";

const DownloadApp = () => {
  return (
    // <div className='mt-6 grid xl:grid-cols-2 lg:grid-cols-1 grid-cols-2 xl:place-content-between lg:place-content-center place-content-between gap-4 '>
    <div className="mt-6 flex lg:flex-col xl:flex-row justify-center gap-4 ">
      <a
        href="https://play.google.com/store/apps/details?id=com.bondstein.tmv.lite"
        target="_blank"
        className="flex flex-wrap justify-center items-center lg:w-[184px] w-36 md:w-44 lg:mx-auto rounded-xl tmv-shadow py-2 bg-white"
      >
        <PlayStore />
        <div className="ml-4 md:ml-6 text-start">
          <p className="text-tertiaryText text-xs">Get it on</p>
          <p className="text-primaryText text-sm font-bold">Play Store</p>
        </div>
      </a>
      <a
        href="https://apps.apple.com/us/app/track-my-vehicle-lite/id1663701040"
        target="_blank"
        className="flex flex-wrap justify-center items-center lg:w-[184px] w-36 md:w-44 lg:mx-auto rounded-xl tmv-shadow py-2 bg-white"
      >
        <AppleStore />
        <div className="ml-4 md:ml-6 text-start">
          <p className="text-primaryText text-xs">Get it on</p>
          <p className="text-primaryText text-sm font-bold">Apple Store</p>
        </div>
      </a>
    </div>
  );
};

export default DownloadApp;
