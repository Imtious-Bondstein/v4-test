import React, { useEffect, useRef, useState } from "react";

import {
  hourlyDistanceTableDate,
  dailyDistanceTableTime,
} from "@/utils/dateTimeConverter";

const DailyDistanceTable = ({ isLoading, dailyReportData, fetched }) => {
  // STATE
  const [data, setData] = useState([]);
  const [clickOutside, setclickOutside] = useState(false);
  const myRef = useRef();

  // CLICK DATA SHOW FOR MOBILE ============================================
  const handleDropDownData = (sl) => {
    console.log(sl);
    const newState = data.map((vehicle) => {
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
      setclickOutside(false);
      const newState = data.map((fence) => {
        return { ...fence, displayDropdownInfo: false };
      });
      setData(newState);
    }
  };

  //calculate total distance from dailyReportData array based on distance is string
  const totalDistance = () => {
    let totalDistance = 0;
    dailyReportData.map((data) => {
      totalDistance += parseFloat(data.distance);
    });
    return totalDistance.toFixed(2);
  };
  // USEEFFECT =============================================================
  useEffect(() => {
    setData(
      dailyReportData.map((item, index) => ({
        ...item,
        displayDropdownInfo: false,
      }))
    );
    // setData(dailyReportData);
  }, [dailyReportData]);

  useEffect(() => {
    document.addEventListener("mousedown", handelClickOutside);
    return () => document.removeEventListener("mousedown", handelClickOutside);
  });

  return (
    <div className="hourly-distance-table w-full">
      <div className="overflow-hidden">
        {/* TABLE */}
        <div className="overflow-x-auto sm:h-[65.3vh]">
          {isLoading ? (
            Array(10)
              .fill(0)
              .map((_, index) => (
                <div className="w-full" key={index}>
                  <div className="h-[80px] w-full border-4 skeleton-border rounded-xl p-2 mt-3">
                    <div className="h-full skeleton rounded-xl"></div>
                  </div>
                </div>
              ))
          ) : (
            <table className="md:min-w-[900px] w-full">
              <thead className="bg-[#FFFAE6] h-[70px] rounded-md hidden md:table-header-group">
                <tr className="">
                  {/* SL */}
                  <th className="w-[30px] text-left px-3 rounded-l-[10px] text-[#1E1E1E] text-lg font-bold">
                    Sl.
                  </th>

                  {/* DATE */}
                  <th className="w-[80px] text-left text-[#1E1E1E] text-lg font-bold  ">
                    Date
                  </th>

                  {/* DISTANCE */}
                  <th className="w-[50px] text-left text-[#1E1E1E] text-lg font-bold">
                    Distance (km)
                  </th>

                  {/* START TIME */}
                  <th className="w-[50px] text-left text-[#1E1E1E] text-lg font-bold ">
                    Start Time
                  </th>

                  {/* END TIME */}
                  <th className="w-[50px] text-left text-[#1E1E1E] text-lg font-bold">
                    End Time
                  </th>

                  {/* DURATION */}
                  <th className="w-[50px] text-left text-[#1E1E1E] text-lg font-bold">
                    Duration
                  </th>
                </tr>
              </thead>

              <tbody ref={myRef} className="rounded-xl">
                {data.map(
                  (
                    {
                      sl,
                      date,
                      start_time,
                      end_time,
                      duration,
                      distance,
                      displayDropdownInfo,
                    },
                    index
                  ) => {
                    return (
                      <tr
                        key={index}
                        className={`relative rounded-xl h-[20px] md:h-[81px] items-center ${sl % 2 === 0 ? "bg-[#F8FBFF]" : "bg-white"
                          }`}
                      >
                        {/* SL */}
                        <td className="w-[30px] px-3 rounded-l-[10px] text-lg text-[#48525C] hidden md:table-cell">
                          {sl}
                        </td>

                        {/* DATE */}
                        <td className="w-[80px] text-left text-lg text-[#48525C] hidden md:table-cell">
                          {hourlyDistanceTableDate(date)}
                        </td>

                        {/* DISTANCE */}
                        <td className="w-[50px] text-left text-lg text-[#48525C] hidden md:table-cell">
                          {distance && parseFloat(distance).toFixed(2)}
                        </td>

                        {/* START TIME */}
                        <td className="w-[50px] text-left text-lg text-[#48525C] hidden md:table-cell">
                          {dailyDistanceTableTime(start_time)}
                        </td>

                        {/* END TIME */}
                        <td className="w-[50px] text-left text-lg text-[#48525C] hidden md:table-cell">
                          {dailyDistanceTableTime(end_time)}
                        </td>

                        {/* DURATION */}
                        <td className="w-[50px] text-left text-lg text-[#48525C] hidden md:table-cell">
                          {duration}
                        </td>

                        {/* TABLE DETAILS FOR SMALL SCREEN */}
                        <td
                          onClick={() => handleDropDownData(sl)}
                          className={`p-3 md:hidden flex flex-col space-y-2 duration-300 ease-in-out ${displayDropdownInfo === true
                              ? "h-[155px]"
                              : "h-[50px]"
                            } `}
                        >
                          <div className="flex items-center text-tertiaryText text-sm font-medium">
                            <p>Date:&nbsp; </p>
                            <p> {date}</p>
                          </div>
                          {displayDropdownInfo === true ? (
                            <div className="flex flex-col space-y-2">
                              <div className="flex items-center text-tertiaryText text-sm font-medium">
                                <p>Start Time:&nbsp; </p>
                                <p> {dailyDistanceTableTime(start_time)}</p>
                              </div>
                              <div className="flex items-center text-tertiaryText text-sm font-medium">
                                <p>End Time:&nbsp; </p>
                                <p> {dailyDistanceTableTime(end_time)}</p>
                              </div>
                              <div className="flex items-center text-tertiaryText text-sm font-medium">
                                <p>Duration:&nbsp; </p>
                                <p> {duration}</p>
                              </div>
                              <div className="flex items-center text-tertiaryText text-sm font-medium">
                                <p>Distance:&nbsp; </p>
                                <p>
                                  {distance && parseFloat(distance).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyDistanceTable;
