import summary from "@/pages/activity/alerts/summary";
import React, { useEffect, useRef, useState } from "react";

//======utils
import { analyticsAlertSummary } from "@/utils/dateTimeConverter";

const ShortAlertSummaryTable = ({ alertSummary, isLoadingAlertSummary }) => {
  const [clickOutside, setclickOutside] = useState(false);
  const [data, setData] = useState([]);
  const myRef = useRef();

  // CLICK DATA SHOW FOR MOBILE ============================================
  const handleDropDownData = (sl) => {
    console.log(sl);
    const newState = data?.map((vehicle) => {
      setclickOutside(true);
      if (vehicle.sl === sl) {
        return {
          ...vehicle,
          displayDropdownInfo: !vehicle.displayDropdownInfo,
        };
      }
      return vehicle;
    });
    setData(newState);
  };
  // CLICK OUTSIDE =========================================================
  const handelClickOutside = (e) => {
    if (clickOutside === true && !myRef.current.contains(e.target)) {
      const newState = data?.map((vehicle) => {
        return { ...vehicle, displayDropdownInfo: false };
      });
      setData(newState);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handelClickOutside);
    return () => document.removeEventListener("mousedown", handelClickOutside);
  });

  useEffect(() => {
    console.log(alertSummary, "fetched");
    setData(
      alertSummary?.map((item, index) => ({
        ...item,
        sl: index + 1,
        displayDropdownInfo: false,
      }))
    );
  }, [alertSummary]);

  return (
    <div>
      <div className="md:min-w-[726px] text-lg">
        {isLoadingAlertSummary ? (
          <div className="w-full h-full min-h-[350px] md:min-w-[400px] skeleton rounded-lg"></div>
        ) : (
          <div>
            {/* ======= table heading =========  */}
            <div className=" hidden md:flex items-center justify-between bg-[#FFFAE6] p-4 rounded-[13px] gap-3">
              <div className="w-[230px] ">
                <p className="font-bold text-[#1E1E1E]">Date</p>
              </div>
              <div className="w-[136px]">
                <p className="font-bold text-[#1E1E1E]">Trips</p>
              </div>
              <div className="w-[169px]">
                <p className="font-bold text-[#1E1E1E]">Speeding</p>
              </div>
              <div className="w-[190px]">
                <p className="font-bold text-[#1E1E1E]">Fence Out</p>
              </div>
            </div>

            {/* ======= table body =========  */}
            <div ref={myRef}>
              {data?.map(
                (
                  { sl, date, trips, speeding, fench_out, displayDropdownInfo },
                  index
                ) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between py-3 px-2 md:p-4 rounded-[13px] gap-3 ${
                      index % 2 === 0 ? "" : "bg-[#F8FBFF]"
                    }`}
                  >
                    <div className="w-[230px] hidden md:block">
                      <p className="font-bold text-[#6A7077]">
                        {analyticsAlertSummary(date)}
                      </p>
                    </div>
                    <div className=" w-[136px] hidden md:block">
                      <p className="text-[#6A7077]">{trips}</p>
                    </div>
                    <div className="w-[169px] hidden md:block">
                      <p className="text-[#6A7077]">{speeding}</p>
                    </div>
                    <div className="w-[190px] hidden md:block">
                      <p className="text-[#6A7077]">{fench_out}</p>
                    </div>
                    {/* TABLE DETAILS FOR SMALL SCREEN */}
                    <div
                      onClick={() => handleDropDownData(sl)}
                      className={`md:hidden flex flex-col space-y-2 duration-300 ease-in-out rounded-[10px] md:rounded-none ${
                        displayDropdownInfo === true ? "h-[105px]" : "h-[25px]"
                      } `}
                    >
                      <div className="flex items-center text-tertiaryText text-sm font-bold">
                        <p>Date:&nbsp;</p>
                        <p> {analyticsAlertSummary(date)}</p>
                      </div>
                      {displayDropdownInfo === true ? (
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center text-tertiaryText text-sm font-medium">
                            <p>Trips:&nbsp;</p>
                            <p>{trips}</p>
                          </div>
                          <div className="flex items-center text-tertiaryText text-sm font-medium">
                            <p>Speeding:&nbsp;</p>
                            <p> {speeding}</p>
                          </div>
                          <div className="flex items-center text-tertiaryText text-sm font-medium">
                            <p>Fence Out:&nbsp;</p>
                            <p>{fench_out}</p>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShortAlertSummaryTable;
