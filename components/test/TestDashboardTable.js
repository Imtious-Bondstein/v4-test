"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTable, usePagination, useSortBy } from "react-table";
import LeftArrowPaginateSVG from "../SVG/pagination/LeftArrowPaginateSVG";
import RightArrowPaginateSVG from "../SVG/pagination/RightArrowPaginateSVG";

import Link from "next/link";

import DownloadSVG from "../SVG/DownloadSVG";
import CarIcon from "../../public/cars/table/car.png";
import BikeIcon from "../../public/cars/table/bike.png";
import CngIcon from "../../public/cars/table/cng.png";
import AmbulanceIcon from "../../public/cars/table/ambulance.png";
import TruckIcon from "../../public/cars/table/truck.png";
import ThreeDotSVG from "../SVG/dashboard/ThreeDotSVG";
import CustomToolTip from "../CustomToolTip";
import LocationSVG from "../SVG/dashboard/LocationSVG";
import ClockSVG from "../SVG/dashboard/ClockSVG";
import CalendarSVG from "../SVG/dashboard/CalendarSVG";
import EngineReportSVG from "../SVG/dashboard/EngineReportSVG";
import RouteVSG from "../SVG/dashboard/RouteVSG";
import SpeedIconOff from "../SVG/SpeedIconOff";
import SpeedIconOn from "../SVG/SpeedIconOn";
import SortingSVG from "../SVG/table/SortingSVG";
import DownArrowSVG from "../SVG/table/DownArrowSVG";
import UpArrowSVG from "../SVG/table/UpArrowSVG";

const TestDashboardTable = ({ selectedVehicles, isLoading }) => {
  const columns = useMemo(
    () => [
      // ==== o index
      {
        Header: "User",
        accessor: "v_username",
      },
      // ==== 1 index
      {
        Header: "Vehicle no.",
        accessor: "v_vrn",
      },
      // ==== 2 index
      {
        Header: "Nearby Landmark",
        accessor: "nearby_l_name",
      },
      // ==== 3 index
      {
        Header: "Speed Status",
        accessor: "speed_status",
      },
      // ==== 4 index
      {
        Header: "Date | Time",
        accessor: "time_inserted",
      },
      // ==== 5 index
      {
        Header: "Device Status",
        accessor: "device_status",
      },
      // ==== 6 index
      {
        Header: "",
        accessor: "displayDropdown",
      },
      // ==== 7 index
      {
        Header: "",
        accessor: "engine_status",
      },
      // ==== 8 index
      {
        Header: "",
        accessor: "v_identifier",
      },
      // ==== 9 index
      {
        Header: "",
        accessor: "bst_id",
      },
    ],
    []
  );

  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [dropDownsTracker, setDropDownsTracker] = useState([]);
  const clickCount = useRef(0);
  const activeSortColumn = useRef("");
  // ===== click outside ref
  const dropdownsRef = useRef([]);

  const initData = () => {
    setDropDownsTracker(
      selectedVehicles.map((item, index) => ({
        identifier: item.v_identifier,
        displayDropdown: false,
      }))
    );
  };

  // search by identifier
  const searchVehicleByIdentifier = (id) => {
    // console.log('search by identifier', id);
    // console.log('search by dropDownsTracker', dropDownsTracker);
    return dropDownsTracker.find((vehicle) => vehicle.identifier === id);
  };

  const clickDropdown = (item) => {
    console.log("clickDropdown===");
    const newState = dropDownsTracker.map((vehicle) => {
      if (vehicle.identifier === item.v_identifier) {
        // console.log("display action inside", item);
        return { ...vehicle, displayDropdown: !vehicle.displayDropdown };
      }
      return vehicle;
    });

    setDropDownsTracker(newState);
  };

  function handleOutsideClick(e) {
    dropdownsRef.current.forEach((dropdownRef, index) => {
      if (dropdownRef && !dropdownRef.contains(e.target)) {
        setDropDownsTracker((prevState) => {
          const updatedState = [...prevState];
          updatedState[index].displayDropdown = false;
          return updatedState;
        });
      }
    });
  }

  const handleSorting = (fieldName, count) => {
    // this.items.sort((a, b) =>
    //   a[fieldName] > b[fieldName] ? 1 : b[fieldName] > a[fieldName] ? -1 : 0
    // )
    activeSortColumn.current = fieldName;
    clickCount.current += count;

    if (clickCount.current === 0) {
      // reset sort
      setData([...allData]);
    } else if (clickCount.current === 1) {
      // decending sort
      if (data.find((x) => typeof x[fieldName] !== "number")) {
        setData(data.sort((a, b) => b[fieldName].localeCompare(a[fieldName])));
      } else {
        setData([...data].sort((a, b) => b[fieldName] - a[fieldName]));
      }
    } else if (clickCount.current === 2) {
      // assending sort
      if (data.find((x) => typeof x[fieldName] !== "number")) {
        setData(
          [...data].sort((a, b) => a[fieldName].localeCompare(b[fieldName]))
        );
      } else {
        setData([...data].sort((a, b) => a[fieldName] - b[fieldName]));
      }
    } else {
      // reset sort
      setData([...allData]);
      clickCount.current = 0;
    }
    console.log(clickCount.current);
  };

  useEffect(() => {
    setData(selectedVehicles);
    setAllData(selectedVehicles);
    initData();
  }, [selectedVehicles]);

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick, true);

    return () => {
      document.removeEventListener("click", handleOutsideClick, true);
    };
  }, []);
  // ===== click outside end

  //  ====== react table func ======

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
  } = useTable({
    columns,
    data,
  });

  return (
    <div className="pb-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[#1E1E1E] text-[32px] font-bold ">Dashboard</h1>
      </div>
      <div className=" ">
        <div className="p-[15px] bg-white overflow-x-auto h-[75vh] rounded-[20px] ">
          <table {...getTableProps()} className="w-full  ">
            <thead className="bg-[#FFFAE6] h-[70px] rounded-md">
              {
                // Loop over the header rows
                headerGroups.map((headerGroup, index) => (
                  // Apply the header row props

                  <tr key={index} className="">
                    {/* ======= User. ======= */}
                    <th
                      // onClick={() => handleSort("v_username", 1)}
                      className="text-left text-lg font-bold px-3 rounded-l-[10px]  text-[#1E1E1E] min-w-[150px] cursor-pointer "
                    >
                      <div className="flex items-center">
                        {/* <div>
                          {sortCount === 1 &&
                            activeSortColumn === "v_username" ? (
                            <DownArrowSVG />
                          ) : sortCount === 2 &&
                            activeSortColumn === "v_username" ? (
                            <UpArrowSVG />
                          ) : (
                            ""
                          )}
                        </div> */}
                        {headerGroup.headers[0].Header}
                      </div>
                    </th>

                    {/* ======= Vehicle no. ======= */}
                    <th
                      onClick={() => handleSorting("v_vrn", 1)}
                      className="text-left text-lg font-bold  px-3  text-[#1E1E1E] whitespace-nowrap cursor-pointer "
                    >
                      <div className="flex items-center">
                        <div>
                          {clickCount.current === 1 &&
                          activeSortColumn.current === "v_vrn" ? (
                            <DownArrowSVG />
                          ) : clickCount.current === 2 &&
                            activeSortColumn.current === "v_vrn" ? (
                            <UpArrowSVG />
                          ) : (
                            ""
                          )}
                        </div>
                        {headerGroup.headers[1].Header}
                      </div>
                    </th>

                    {/* ======= Nearby Landmark	 ======= */}
                    <th className="text-left text-lg font-bold  px-3  text-[#1E1E1E] whitespace-nowrap">
                      {headerGroup.headers[2].Header}
                    </th>

                    {/* ======= Speed Status || engine status ======= */}
                    <th
                      onClick={() => handleSorting("speed_status", 1)}
                      className="text-left text-lg font-bold px-3  text-[#1E1E1E] whitespace-nowrap cursor-pointer"
                    >
                      <div className="flex items-center">
                        <div>
                          {clickCount.current === 1 &&
                          activeSortColumn.current === "speed_status" ? (
                            <DownArrowSVG />
                          ) : clickCount.current === 2 &&
                            activeSortColumn.current === "speed_status" ? (
                            <UpArrowSVG />
                          ) : (
                            ""
                          )}
                        </div>
                        {headerGroup.headers[3].Header}
                      </div>
                    </th>

                    {/* ======= Date | Time ======= */}
                    <th
                      onClick={() => handleSorting("time_inserted", 1)}
                      className="text-left text-lg font-bold px-3  text-[#1E1E1E] whitespace-nowrap cursor-pointer"
                    >
                      <div className="flex items-center">
                        <div>
                          {clickCount.current === 1 &&
                          activeSortColumn.current === "time_inserted" ? (
                            <DownArrowSVG />
                          ) : clickCount.current === 2 &&
                            activeSortColumn.current === "time_inserted" ? (
                            <UpArrowSVG />
                          ) : (
                            ""
                          )}
                        </div>
                        {headerGroup.headers[4].Header}
                      </div>
                    </th>

                    {/* ======= Device Status	 ======= */}
                    <th className="text-left text-lg font-bold  px-3  text-[#1E1E1E] whitespace-nowrap">
                      {headerGroup.headers[5].Header}
                    </th>

                    {/* ======= dots ======= */}
                    <th className="w-6 text-left rounded-r-[10px] text-lg font-bold  px-3  text-[#1E1E1E]"></th>
                  </tr>
                ))
              }
            </thead>

            <tbody {...getTableBodyProps()} className="rounded-xl">
              {rows.map((row, index) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    className={`relative rounded-xl h-[81px] ${
                      index % 2 === 0 ? "bg-white" : "bg-[#F8FBFF]"
                    } `}
                  >
                    {/* ======== User ======== */}
                    <td className="rounded-l-[10px] px-3  text-[#48525C]">
                      {row.cells[0].value ? (
                        row.cells[0].value
                      ) : (
                        <p className={` text-sm text-[#6A7077] `}>None</p>
                      )}
                    </td>

                    {/* ======== Vehicle  ======== */}
                    <td className={` px-3 text-[#48525C] `}>
                      {row.cells[1].value ? (
                        <div>
                          <p>{row.cells[9].value}</p>
                          <p>{row.cells[1].value}</p>
                        </div>
                      ) : (
                        <p className={` text-sm text-[#6A7077] `}>None</p>
                      )}
                    </td>

                    {/* ======== 	Nearby Landmark ======== */}
                    <td className={`px-3 text-[#48525C] `}>
                      {row.cells[2].value ? (
                        <div
                          className={` text-sm  ${
                            row.cells[2].value === "Subscription Expired" ||
                            row.cells[2].value === "Renew Subscription"
                              ? "max-w-[157px] h-[34px] text-[#FF6B6B] p-2 bg-[#FF6B6B]/10 rounded-[10px] flex items-center justify-center "
                              : row.cells[2].value === "Need Maintenance"
                              ? "max-w-[145px] text-[#FFAA58] p-2 bg-[#FFAA58]/10 rounded-[10px] flex items-center justify-center"
                              : "text-[#6A7077] "
                          } `}
                        >
                          {row.cells[2].value}
                        </div>
                      ) : (
                        <p className={` text-sm text-[#6A7077]  `}>None</p>
                      )}
                    </td>

                    {/* ======== Speed Status || engine status ======== */}
                    <td className={` px-3 text-[#48525C] `}>
                      {row.cells[7].value === true ? ( // row.cells[7].value = engine status
                        <div className="flex flex-col items-center ">
                          <SpeedIconOn />
                          <p className="text-[#F36B24] ">
                            {row.cells[3].value ? row.cells[3].value : 0} K/H
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <SpeedIconOff />
                          <p className="text-[#F36B24] ">Engine. off</p>
                        </div>
                      )}
                    </td>

                    {/* ======== Date | Time ======== */}
                    <td className={`text-sm px-3 text-[#48525C] `}>
                      {row.cells[4].value ? (
                        <p>{row.cells[4].value}</p>
                      ) : (
                        <p>None</p>
                      )}
                    </td>

                    {/* ======== Device Status	 ======== */}
                    <td className={` px-3  `}>
                      {row.cells[5].value ? (
                        <div
                          className={`rounded-r-xl px-3 text-center text-sm font-bold capitalize ${
                            row.cells[5].value === "Suspended"
                              ? "text-[#FF6B6B]"
                              : row.cells[5].value === "Offline"
                              ? "text-[#8D96A1]"
                              : "text-[#1DD1A1]"
                          }`}
                        >
                          {row.cells[5].value}
                        </div>
                      ) : (
                        <p className="text-center text-sm ">None</p>
                      )}
                    </td>

                    {/* ======== dots ======== */}
                    <td className={`rounded-r-[10px] px-3 text-[#48525C] `}>
                      <div ref={(el) => (dropdownsRef.current[index] = el)}>
                        <button
                          onClick={() => clickDropdown(row.values)}
                          className=" px-4"
                        >
                          <ThreeDotSVG />
                        </button>

                        {searchVehicleByIdentifier(row.cells[8].value)
                          .displayDropdown && (
                          <div className="absolute h-fit top-0 bottom-0 my-auto right-12 ">
                            <div className="flex items-center justify-center gap-1  bg-white dark-shadow w-[145px] h-[50px] rounded-lg ">
                              {/* ======== distance link ======= */}
                              <div>
                                <CustomToolTip
                                  id={`action-distance-${row.cells[0].value}`}
                                  title={`Hourly Distance Report`}
                                  containerClass="action default-tooltip middle-tooltip tooltipStyleChange"
                                >
                                  <Link
                                    href="/alert-summary"
                                    id={`action-distance-${row.cells[0].value}`}
                                    className="group group-hover:bg-[#FAFAFA]  rounded w-[31px] h-[31px] flex items-center justify-center  "
                                  >
                                    <ClockSVG />
                                  </Link>
                                </CustomToolTip>
                              </div>

                              {/* ======== calender link ======= */}
                              <div>
                                <CustomToolTip
                                  id={`action-calendar-${row.cells[0].value}`}
                                  title={`Daily Distance Report`}
                                  containerClass="action default-tooltip middle-tooltip tooltipStyleChange"
                                >
                                  <Link
                                    href="/alert-summary"
                                    id={`action-calendar-${row.cells[0].value}`}
                                    className="group group-hover:bg-[#FAFAFA]  rounded w-[31px] h-[31px] flex items-center justify-center  "
                                  >
                                    <CalendarSVG />
                                  </Link>
                                </CustomToolTip>
                              </div>

                              {/* ======== messenger link ======= */}
                              <div>
                                <CustomToolTip
                                  id={`action-messenger-${row.cells[0].value}`}
                                  title={`Engine Report`}
                                  containerClass="action default-tooltip middle-tooltip tooltipStyleChange"
                                >
                                  <Link
                                    href="/alert-summary"
                                    id={`action-messenger-${row.cells[0].value}`}
                                    className="group group-hover:bg-[#FAFAFA]  rounded w-[31px] h-[31px] flex items-center justify-center  "
                                  >
                                    <EngineReportSVG />
                                  </Link>
                                </CustomToolTip>
                              </div>

                              {/* ======== Vehicle Route ======= */}
                              <div>
                                <CustomToolTip
                                  id={`action-location2-${row.cells[0].value}`}
                                  title={`Vehicle Route`}
                                  containerClass="action default-tooltip middle-tooltip tooltipStyleChange"
                                >
                                  {/* {console.log("row.values", row.values)} */}
                                  <Link
                                    href={`/location/vehicle-route?identifier=${row.values.v_identifier}`}
                                    id={`action-location2-${row.cells[0].value}`}
                                    className="group group-hover:bg-[#FAFAFA]  rounded w-[31px] h-[31px] flex items-center justify-center  "
                                  >
                                    <RouteVSG />
                                  </Link>
                                </CustomToolTip>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {isLoading && (
            <div className="w-full">
              <div className="h-[80px] w-full border-4 skeleton-border rounded-xl p-2 mt-3">
                <div className="h-full skeleton rounded-xl"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestDashboardTable;
