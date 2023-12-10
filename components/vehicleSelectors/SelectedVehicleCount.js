import Search from "@/svg/SearchSVG";
import React, { useRef } from "react";
import "../../styles/components/selected-vehicle-count.css";
import CrossSVG2 from "@/svg/CrossSVG2";
import { useRouter } from "next/router";

const SelectedVehicleCount = ({
  clicked,
  setClicked,
  getCurrentSelectedVehicleLength,
  xlScreen,
}) => {
  const getCurrentSelectedVehicleLengthNum = useRef();

  getCurrentSelectedVehicleLength() > 0
    ? (getCurrentSelectedVehicleLengthNum.current =
        getCurrentSelectedVehicleLength())
    : (getCurrentSelectedVehicleLengthNum.current = 0);

  // Checking if button clicked!
  const handleSearch = () => {
    !clicked ? setClicked(true) : setClicked(false);
  };
  return (
    <>
      <div
        onClick={handleSearch}
        className={`cursor-pointer ${
          clicked === true
            ? "right-80 mr-[7px] h-max-[65px]"
            : "right-0 h-[40px]"
        } ${
          xlScreen === true ? "xl:hidden" : "lg:hidden"
        } search-toggle-button top-28 ease-in-out duration-700 fixed flex justify-center items-center gap-1 xs:gap-2 z-[1001] md:z-0 -mt-2.5 p-2`}
      >
        {!clicked ? <Search /> : <CrossSVG2 />}
        {getCurrentSelectedVehicleLengthNum.current > 0 ? (
          <div className="flex flex-col items-center">
            {clicked === true ? "" : <p className="text-xs">Selected</p>}
            <p
              className={`${
                clicked === true ? "text-xs xs:text-lg" : "text-xs"
              }`}
            >
              {getCurrentSelectedVehicleLengthNum.current}
            </p>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default SelectedVehicleCount;
