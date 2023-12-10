import React, { useEffect, useRef, useState } from "react";
import ColumnTableSVG from "../SVG/table/ColumnTableSVG";
import GraphTableSVG from "../SVG/table/GraphTableSVG";
import { speedReportTableDate } from "@/utils/dateTimeConverter";

const EngineReportTable = ({ isLoading, fetched, tableData }) => {
  // STATE
  const [data, setData] = useState([]);
  const myRef = useRef();

  // CLICK DATA SHOW FOR MOBILE ============================================
  const handleClick = (sl) => {
    console.log(sl);
    const newState = data.map((vehicle) => {
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
    // console.log(e.target);
    if (!myRef.current.contains(e.target)) {
      const newState = data.map((vehicle) => {
        return { ...vehicle, displayDropdownInfo: false };
      });
      setData(newState);
    }
  };
  // USEEFFECT =============================================================
  useEffect(() => {
    setData(
      tableData.map((item, index) => ({
        ...item,
        sl: index + 1,
        displayDropdownInfo: false,
      }))
    );
  }, [tableData]);

  useEffect(() => {
    document.addEventListener("mousedown", handelClickOutside);
    return () => document.removeEventListener("mousedown", handelClickOutside);
  });

  return (
    <div className="h-[400px] 2xl:h-[600px] w-full">
      <div className="h-full w-full bg-white rounded-[10px] overflow-hidden">
        {/* TABLE */}
        <div className="overflow-auto h-full p-2 sm:p-5">
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
            <table className="xl:w-full w-[950px]">
              {fetched === true && tableData.length > 0 ? (
                <thead className="bg-[#FFFAE6] h-[70px] rounded-md hidden md:table-header-group">
                  <tr className="rounded-xl">
                    {/* SL */}
                    <th className="w-[100px] text-left px-3 rounded-l-xl text-[#1E1E1E] text-lg font-bold">
                      Sl.
                    </th>

                    {/* FROM */}
                    <th className="w-[350px] text-left text-[#1E1E1E] text-lg font-bold  ">
                      From
                    </th>

                    {/* STATUS */}
                    <th className="w-[200px] text-left text-[#1E1E1E] text-lg font-bold ">
                      Status
                    </th>

                    {/* TO */}
                    <th className="w-[350px] text-left text-[#1E1E1E] text-lg font-bold">
                      To
                    </th>

                    {/* DURATION */}
                    <th className="w-[150px] text-left rounded-r-[10px] text-[#1E1E1E] text-lg font-bold">
                      Duration
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
                      engine_status,
                      from_time,
                      to_time,
                      duration,
                      displayDropdownInfo,
                    },
                    index
                  ) => {
                    return (
                      <tr
                        key={index}
                        className={`relative rounded-xl h-[20px] md:h-[81px] items-center ${
                          sl % 2 === 0 ? "bg-[#F8FBFF]" : "bg-white"
                        }`}
                      >
                        {/* SL */}
                        <td className="w-[100px] px-3 rounded-l-[10px] text-lg text-[#48525C] hidden md:table-cell">
                          {index + 1}
                        </td>

                        {/* FROM */}
                        <td className="w-[350px] text-left text-lg text-[#48525C] hidden md:table-cell">
                          {speedReportTableDate(from_time)}
                        </td>

                        {/* STATUS */}
                        <td className="w-[200px] text-left text-lg text-[#48525C] hidden md:table-cell">
                          <div className="flex justify-start items-center space-x-2.5">
                            <div
                              className={`h-[18px] w-[18px] rounded-full ${
                                engine_status.toLowerCase() === "low"
                                  ? "bg-[#C9D1DA]"
                                  : engine_status.toLowerCase() === "off"
                                  ? "bg-tmvRed"
                                  : engine_status.toLowerCase() === "idle"
                                  ? "bg-[#FFAA58]"
                                  : engine_status.toLowerCase() === "on"
                                  ? "bg-tmvGreen"
                                  : ""
                              }`}
                            ></div>
                            <p> {engine_status}</p>
                          </div>
                        </td>

                        {/* TO */}
                        <td className="w-[350px] text-left text-lg text-[#48525C] hidden md:table-cell">
                          {speedReportTableDate(to_time)}
                        </td>

                        {/* DURATION */}
                        <td className="w-[150px] text-left rounded-r-[10px] text-lg text-[#48525C] hidden md:table-cell">
                          {duration}
                        </td>

                        {/* TABLE DETAILS FOR SMALL SCREEN */}
                        <td
                          onClick={() => handleClick(sl)}
                          className={`p-3 md:hidden flex flex-col space-y-2 rounded-[10px] duration-300 ease-in-out ${
                            displayDropdownInfo === true
                              ? "h-[155px]"
                              : "h-[50px]"
                          } `}
                        >
                          <div className="flex items-center text-tertiaryText text-sm font-bold md:font-medium">
                            <p>From:&nbsp;</p>
                            <p> {speedReportTableDate(from_time)}</p>
                          </div>
                          {displayDropdownInfo === true ? (
                            <div className="flex flex-col space-y-2">
                              <div className="flex items-center text-tertiaryText text-sm font-medium">
                                <p>Status:&nbsp;</p>
                                <p>{engine_status}</p>
                              </div>
                              <div className="flex items-center text-tertiaryText text-sm font-medium">
                                <p>To:&nbsp;</p>
                                <p> {speedReportTableDate(to_time)}</p>
                              </div>
                              <div className="flex items-center text-tertiaryText text-sm font-medium">
                                <p>Duration:&nbsp;</p>
                                <p>{duration}</p>
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

export default EngineReportTable;
