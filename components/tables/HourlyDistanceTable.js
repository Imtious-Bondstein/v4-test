import {
  hourlyDistanceTableDate,
  hourlyDistanceTableTime,
} from "@/utils/dateTimeConverter";
import React, { useEffect, useRef, useState } from "react";

const HourlyDistanceTable = ({ isLoading, tableData, fetched }) => {
  // STATE
  const [data, setData] = useState([]);
  const [clickOutside, setclickOutside] = useState(false);
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

  // USEEFFECT =============================================================
  useEffect(() => {
    console.log(tableData, "fetched");
    setData(
      tableData.map((item, index) => ({
        ...item,
        displayDropdownInfo: false,
      }))
    );
  }, [tableData]);

  useEffect(() => {
    document.addEventListener("mousedown", handelClickOutside);
    return () => document.removeEventListener("mousedown", handelClickOutside);
  });

  return (
    <div className="hourly-distance-table w-full">
      <div className="overflow-hidden rounded-[20px]">
        <div className="bg-white overflow-x-auto h-[50vh] md:h-[54vh] rounded-[20px] p-2 sm:px-6 sm:pt-[29px] ">
          {isLoading ? (
            <div className="w-full">
              <div className="h-[80px] w-full border-4 skeleton-border rounded-xl p-2 mt-3">
                <div className="h-full skeleton rounded-xl"></div>
              </div>
              <div className="h-[80px] w-full border-4 skeleton-border rounded-xl p-2 mt-3">
                <div className="h-full skeleton rounded-xl"></div>
              </div>
              <div className="h-[80px] w-full border-4 skeleton-border rounded-xl p-2 mt-3">
                <div className="h-full skeleton rounded-xl"></div>
              </div>
              <div className="h-[80px] w-full border-4 skeleton-border rounded-xl p-2 mt-3">
                <div className="h-full skeleton rounded-xl"></div>
              </div>
              <div className="h-[80px] w-full border-4 skeleton-border rounded-xl p-2 mt-3">
                <div className="h-full skeleton rounded-xl"></div>
              </div>
              <div className="h-[80px] w-full border-4 skeleton-border rounded-xl p-2 mt-3">
                <div className="h-full skeleton rounded-xl"></div>
              </div>
              <div className="h-[80px] w-full border-4 skeleton-border rounded-xl p-2 mt-3">
                <div className="h-full skeleton rounded-xl"></div>
              </div>
            </div>
          ) : (
            <table className="md:min-w-[900px] w-full">
              {fetched === true && tableData.length > 0 ? (
                <thead className="bg-[#FFFAE6] h-[70px] rounded-md hidden md:table-header-group">
                  <tr>
                    {/* SL */}
                    <th className="w-[0px] text-left pl-3 rounded-l-[10px] text-[#1E1E1E] text-lg font-bold">
                      Sl.
                    </th>
                    {/* DATE */}
                    <th className="w-[50px] text-center text-[#1E1E1E] text-lg font-bold">
                      Date
                    </th>
                    {/* DISTANCE */}
                    <th className="w-[50px] text-center text-[#1E1E1E] text-lg font-bold">
                      Distance (km)
                    </th>
                    {/* HOUR START */}
                    <th className="w-[50px] text-center text-[#1E1E1E] text-lg font-bold">
                      Hour Start
                    </th>
                    {/* HOUR END */}
                    <th className="w-[50px] text-center text-[#1E1E1E] text-lg font-bold">
                      Hour End
                    </th>
                    {/* MAXIMUM SPEED */}
                    <th className="w-[50px] text-center text-[#1E1E1E] text-lg font-bold">
                      Maximum Speed
                    </th>
                    {/* MINIMUM SPEED  */}
                    <th className="w-[50px] text-center text-[#1E1E1E] text-lg font-bold">
                      Minimum Speed
                    </th>
                  </tr>
                </thead>
              ) : (
                ""
              )}
              <tbody ref={myRef} className="rounded-xl">
                {data.map(
                  (
                    {
                      sl,
                      date,
                      hour_start,
                      hour_end,
                      maximum_speed,
                      minimum_speed,
                      distance,
                      displayDropdownInfo,
                    },
                    index
                  ) => (
                    <tr
                      key={index}
                      className={`relative rounded-xl h-[20px] md:h-[81px] ${
                        sl % 2 === 0 ? "bg-[#F8FBFF]" : "bg-white"
                      }`}
                    >
                      {/* SL */}
                      <td className="w-[0px] pl-3 rounded-l-[10px] text-lg text-[#48525C] hidden md:table-cell">
                        {sl}
                      </td>
                      {/* DATE */}
                      <td className="w-[50px] text-center text-lg text-[#48525C] hidden md:table-cell">
                        {hourlyDistanceTableDate(date)}
                      </td>
                      {/* DISTANCE */}
                      <td className="w-[50px] text-center text-lg text-[#48525C] hidden md:table-cell">
                        {distance.toFixed(2)}
                      </td>
                      {/* HOUR START */}
                      <td className="w-[50px] text-center text-lg text-[#48525C] hidden md:table-cell">
                        {hourlyDistanceTableTime(hour_start)}
                      </td>
                      {/* HOUR END */}
                      <td className="w-[50px] text-center text-lg text-[#48525C] hidden md:table-cell">
                        {hourlyDistanceTableTime(hour_end)}
                      </td>
                      {/* MAXIMUM SPEED */}
                      <td className="w-[50px] text-center text-lg text-[#48525C] hidden md:table-cell">
                        {parseFloat(maximum_speed).toFixed(2)}
                      </td>
                      {/* MINIMUM SPEED */}
                      <td className="w-[50px] text-center text-lg text-[#48525C] hidden md:table-cell">
                        {parseFloat(minimum_speed).toFixed(2)}
                      </td>

                      {/* TABLE DETAILS FOR SMALL SCREEN */}
                      <td
                        onClick={() => handleDropDownData(sl)}
                        className={`p-3 md:hidden flex flex-col space-y-2 duration-300 ease-in-out rounded-[10px] md:rounded-none ${
                          displayDropdownInfo === true
                            ? "h-[185px]"
                            : "h-[45px]"
                        } `}
                      >
                        <div className="flex items-center text-tertiaryText text-sm font-bold">
                          <p>Date:&nbsp;</p>
                          <p> {hourlyDistanceTableDate(date)}</p>
                        </div>
                        {displayDropdownInfo === true ? (
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center text-tertiaryText text-sm font-medium">
                              <p>Hour Start:&nbsp;</p>
                              <p>{hourlyDistanceTableTime(hour_start)}</p>
                            </div>
                            <div className="flex items-center text-tertiaryText text-sm font-medium">
                              <p>Hour End:&nbsp;</p>
                              <p> {hourlyDistanceTableTime(hour_end)}</p>
                            </div>
                            <div className="flex items-center text-tertiaryText text-sm font-medium">
                              <p>Maximum Speed:&nbsp;</p>
                              <p>{parseFloat(maximum_speed).toFixed(2)}</p>
                            </div>
                            <div className="flex items-center text-tertiaryText text-sm font-medium">
                              <p>Minimum Speed:&nbsp;</p>
                              <p>{parseFloat(minimum_speed).toFixed(2)}</p>
                            </div>
                            <div className="flex items-center text-tertiaryText text-sm font-medium">
                              <p>Distance:&nbsp;</p>
                              <p> {distance.toFixed(2)}</p>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          )}
          {fetched === true && tableData.length <= 0 && isLoading === false ? (
            <p className="w-full h-full flex justify-center items-center text-primaryText text-center">
              Not Sufficient Data to Render.
            </p>
          ) : tableData.length <= 0 && isLoading === false ? (
            <p className="w-full h-full flex justify-center items-center text-primaryText text-center">
              Please Select A Vehicle
            </p>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default HourlyDistanceTable;
