"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import DownloadSVG from "../SVG/DownloadSVG";
import "react-toastify/dist/ReactToastify.css";
import {
  vehicleDateTime,
  vehicleRouteChartDate,
} from "@/utils/dateTimeConverter";

// excel generate
import { CSVLink } from "react-csv";
import Link from "next/link";
import LocationSVG from "../SVG/dashboard/LocationSVG";
import LocationSVGMobile from "../SVG/dashboard/LocationSVGMobile";
import axios from "@/plugins/axios";
import SpinSVG from "../SVG/SpinSVG";

const mapLink =
  "https://www.google.com/maps/place/Bondstein+Technologies+Limited/@23.7623926,90.4041494,17z/data=!3m1!4b1!4m6!3m5!1s0x3755c655f3b844c7:0x15b5e83e709e9618!8m2!3d23.7623877!4d90.4067297!16s%2Fg%2F11cs26b244?entry=ttu";

const OverspeedAlertTable = ({
  selectedVehicles,
  dateRange,
  isLoading,
  errorNotify,
  emptyArrayNotify,
  offset,
}) => {
  const [data, setData] = useState([]);
  const myRef = useRef();
  const [isExporting, setIsExporting] = useState(false);

  // HEADERS FOR CSV =======================================================
  const headers = [
    { label: "Sl", key: "sl" },
    { label: "BSTID", key: "bst_id" },
    { label: "Vehicle Name", key: "vehicleName" },
    { label: "Date | Time", key: "dateTime" },
    { label: "Speed", key: "speed" },
    { label: "Type", key: "vehicle_type" },
  ];

  // FETCHING DATA =========================================================
  const initData = (selectedVehicles) => {
    setData(
      selectedVehicles.map((item, index) => ({
        ...item,
        displayAction: false,
        defaultSort: index,
        checkbox: false,
      }))
    );
  };

  useEffect(() => {
    initData(selectedVehicles);
  }, [selectedVehicles]);

  // ==== skeleton
  const divCount = offset;
  const skeletonDiv = [];

  for (let i = 0; i < divCount; i++) {
    skeletonDiv.push(
      <div
        key={i}
        className="h-[80px] w-full border-4 skeleton-border rounded-xl p-2 mt-3"
      >
        <div className="h-full skeleton rounded-xl"></div>
      </div>
    );
  }

  // CLICK DATA SHOW FOR MOBILE ============================================
  const handleClick = (sl) => {
    // console.log(id);
    const newState = data.map((vehicle) => {
      if (vehicle.sl === sl) {
        return { ...vehicle, checkbox: !vehicle.checkbox };
      }
      return vehicle;
    });
    setData(newState);
  };
  // CLICK OUTSIDE ==========================================================
  const handelClickOutside = (e) => {
    if (!myRef.current.contains(e.target)) {
      const newState = data.map((vehicle) => {
        return { ...vehicle, checkbox: false };
      });
      setData(newState);
    }
  };

  const handleDownloadFile = (dataUrl) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    // link.download = filename;
    link.click();
  };

  const handleExport = async () => {
    setIsExporting(true);
    const identifier = selectedVehicles
      .map((item) => item.identifier)
      .join(",");
    const data = {
      identifier,
      start_date: dateRange.startDate,
      end_date: dateRange.endDate,
    };
    console.log("my requested data", data);
    await axios
      .post("/api/v4/alert-management/overspeed-alert-export", data)
      .then((res) => {
        console.log("export res------", res.data.download_path);
        handleDownloadFile(res.data.download_path);
      })
      .catch((err) => {
        console.log("export error :", err);
      })
      .finally(() => {
        setIsExporting(false);
      });
  };

  useEffect(() => {
    document.addEventListener("mousedown", handelClickOutside);
    return () => document.removeEventListener("mousedown", handelClickOutside);
  });

  return (
    <div className="">
      <div className="flex items-center justify-between mb-6 md:mt-1">
        <h1 className="text-[#1E1E1E] text-lg md:text-[32px] font-bold ">
          Overspeed Alert
        </h1>
        {/* <CSVLink
          data={data}
          headers={headers}
          filename={"TMV-Overspeed-Alert.csv"}
        >
          <button
            className={`fill-primaryText flex items-center justify-center gap-3 py-2 md:py-3.5 px-2.5 md:px-4 text-sm bg-primary text-primaryText rounded-lg primary-shadow hover:shadow-xl hover:shadow-primary/60 duration-300 mr-20 lg:mr-16 xl:mr-0`}
          >
            <DownloadSVG />
            <p className="hidden md:block">Export</p>
          </button>
        </CSVLink> */}
        <button
          onClick={handleExport}
          disabled={!selectedVehicles.length}
          className={`fill-primaryText flex items-center justify-center gap-3 text-sm bg-primary text-primaryText rounded-lg w-[32px] sm:w-[42px] md:w-[110px] h-[32px] sm:h-[42px] md:h-[48px] primary-shadow hover:shadow-xl hover:shadow-primary/60 duration-300 ${
            !selectedVehicles.length && "cursor-not-allowed"
          }`}
        >
          {!isExporting ? (
            <>
              <DownloadSVG />
              <p className="hidden md:block text-base">Export</p>
            </>
          ) : (
            <>
              <SpinSVG />
              <p className="hidden md:block">Loading...</p>
            </>
          )}
        </button>
      </div>

      {/* TABLE */}
      <div className="rounded-[20px] overflow-hidden">
        <div className="p-2 sm:p-[15px] overflow-x-auto bg-white  rounded-[20px] h-[65vh] md:h-[75vh]">
          {isLoading ? (
            <div className="w-full">{skeletonDiv}</div>
          ) : (
            <table ref={myRef} className="md:min-w-[1400px] w-full">
              <thead className="bg-[#FFFAE6] h-[70px] rounded-md hidden md:table-header-group">
                <tr className="">
                  {/* SL */}
                  <th className="text-left px-3 rounded-l-[10px] text-[#1E1E1E] text-lg font-bold">
                    Sl.
                  </th>

                  {/* BSTID */}
                  <th className="text-left w-[180px] px-3 text-[#1E1E1E] text-lg font-bold  ">
                    BSTID
                  </th>

                  {/* VEHICLE NAME */}
                  <th className="text-left  px-3 text-[#1E1E1E] text-lg font-bold ">
                    Vehicle
                  </th>

                  {/* DATE | TIME */}
                  <th className="text-left px-3 text-[#1E1E1E] text-lg font-bold">
                    Date | Time
                  </th>

                  {/* SPEED (km/h) */}
                  <th className="text-left px-3 text-[#1E1E1E] text-lg font-bold">
                    Speed (km/h)
                  </th>

                  {/* TYPE */}
                  <th className="text-left px-3 text-[#1E1E1E] text-lg font-bold">
                    Type
                  </th>

                  {/* LOCATION */}
                  <th className="text-left px-3 rounded-r-[10px] text-[#1E1E1E] text-lg font-bold">
                    Location
                  </th>
                </tr>
              </thead>

              <tbody className="rounded-xl">
                {data?.map(
                  (
                    {
                      bst_id,
                      dateTime,
                      identifier,
                      image,
                      latitude,
                      longitude,
                      nearByLocation,
                      sl,
                      speed,
                      vehicleName,
                      vehicle_type,
                      vrn,
                      checkbox,
                    },
                    index
                  ) => {
                    return (
                      <tr
                        key={index}
                        className={`relative rounded-xl h-[20px] md:h-[81px] ${
                          sl % 2 === 0 ? "bg-[#F8FBFF]" : "bg-white"
                        }`}
                      >
                        {/* SL */}
                        <td className="rounded-l-[10px] px-3 text-base text-[#48525C] hidden md:table-cell">
                          {sl}
                        </td>
                        {/* BSTID */}
                        <td className="p-3 md:py-0 text-base text-[#48525C] hidden md:table-cell">
                          {bst_id}
                        </td>
                        {/* VEHICLE */}
                        <td className="px-3 text-base text-[#48525C] hidden md:table-cell">
                          {vrn}
                        </td>
                        {/* DATE | TIME */}
                        <td className="px-3 text-base text-left text-[#48525C] hidden md:table-cell">
                          {vehicleDateTime(dateTime)}
                        </td>
                        {/* SPEED */}
                        <td className="px-3 text-base text-left text-[#48525C] hidden md:table-cell">
                          <p
                            className={`${
                              speed < 70 ? "text-[#48525C]" : "text-[#FF0F0F]"
                            }`}
                          >
                            {speed}
                          </p>
                        </td>
                        {/* TYPE */}
                        <td className="px-3 text-base text-left text-[#48525C] hidden md:table-cell">
                          <p>{vehicle_type} </p>
                        </td>
                        {/* LOCATION */}
                        <td className="px-3 text-base text-left rounded-r-[10px] text-[#48525C] hidden md:table-cell">
                          <div className="flex items-center space-x-3">
                            <Link
                              href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
                              className="group flex items-center space-x-2"
                              target={"_blank"}
                            >
                              <LocationSVG />
                              <p>{nearByLocation}</p>
                            </Link>
                          </div>
                        </td>
                        {/* TABLE DETAILS FOR SMALL SCREEN */}
                        <td
                          onClick={() => handleClick(sl)}
                          className={`p-3 md:hidden flex flex-col space-y-2 duration-300 ease-in-out ${
                            checkbox === true ? "  h-[200px]" : "h-[50px]"
                          } `}
                        >
                          <div className="flex items-center text-tertiaryText text-sm font-medium">
                            <p>Vehicle Name:&nbsp;</p>
                            <p>{vehicleName}</p>
                          </div>
                          {checkbox === true ? (
                            <div className="flex flex-col space-y-2">
                              <div className="flex items-center text-tertiaryText text-[12px] font-medium">
                                <p>BSTID:&nbsp;</p>
                                <p>{bst_id}</p>
                              </div>
                              <div className="flex items-center text-tertiaryText text-[12px] font-medium">
                                <p>Date | Time:&nbsp;</p>
                                <p>{vehicleDateTime(dateTime)} </p>
                              </div>
                              <div className="flex items-center text-tertiaryText text-[12px] font-medium">
                                <p>Speed:&nbsp;</p>
                                <p
                                  className={`${
                                    speed < 70
                                      ? "text-[#48525C]"
                                      : "text-[#FF0F0F]"
                                  }`}
                                >
                                  {speed}
                                </p>
                              </div>
                              <div className="flex items-center text-tertiaryText text-[12px] font-medium">
                                <p>Type:&nbsp;</p>
                                <p>{vehicle_type}</p>
                              </div>
                              <div className="flex items-center text-tertiaryText text-[12px] font-medium">
                                <p>Location:&nbsp;</p>
                                <div className="flex items-center space-x-3">
                                  <Link
                                    href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
                                    className="group flex items-center space-x-2"
                                    target={"_blank"}
                                  >
                                    <LocationSVGMobile />
                                    <p>{nearByLocation}</p>
                                  </Link>
                                </div>
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

export default OverspeedAlertTable;
