import Bondstein from "@/svg/BondsteinSVG";
import React from "react";

const Footer = ({ tacker }) => {
  return (
    <div className="container grid lg:grid-cols-12 grid-cols-1 items-center py-6">
      <div className="lg:col-span-8 col-span-1">
        <div className="flex lg:flex-row flex-col justify-between items-end">
          <div className="lg:w-fit w-full flex lg:justify-start justify-center lg:order-1 order-2">
            <div>
              <div className="hidden md:flex lg:justify-start justify-center">
                <Bondstein />
              </div>
              <p className="text-tertiary mt-3  lg:text-left text-center text-[10px] md:text-sm lg:text-base">
                A Product of Bondstein Technologies Ltd. Ⓒ 2015 - 2023
              </p>
            </div>
          </div>

          {tacker ? (
            <div className="text-center text-primaryText lg:w-96 w-full lg:mb-0 mb-10 lg:order-2 order-1 hidden md:block">
              <p className="font-bold text-2xl">Don’t have a tracker yet?</p>
              <p className="text-xl">
                <a
                  href="https://tmvbd.com/"
                  className="text-secondaryText hover:text-primaryText"
                  target="_blank"
                >
                  Click here
                </a>{" "}
                to get one.
              </p>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>

      <div className="lg:col-span-4 col-span-1"></div>
    </div>
  );
};

export default Footer;
