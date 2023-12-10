"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import LocationSVG from "../SVG/dashboard/LocationSVG";
import { useTable, usePagination } from "react-table";
import LeftArrowPaginateSVG from "../SVG/pagination/LeftArrowPaginateSVG";
import RightArrowPaginateSVG from "../SVG/pagination/RightArrowPaginateSVG";

import DownloadSVG from "../SVG/DownloadSVG";
import CarIcon from "../../public/cars/table/car.png";
import BikeIcon from "../../public/cars/table/bike.png";
import CngIcon from "../../public/cars/table/cng.png";
import AmbulanceIcon from "../../public/cars/table/ambulance.png";
import TruckIcon from "../../public/cars/table/truck.png";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getYearMonthDay, vehicleDateTime } from "@/utils/dateTimeConverter";

// excel generate
import { CSVLink } from "react-csv";
import LocationSVGMobile from "../SVG/dashboard/LocationSVGMobile";
import SpinSVG from "../SVG/SpinSVG";
import axios from "@/plugins/axios";
const mapLink =
  "https://www.google.com/maps/place/Bondstein+Technologies+Limited/@23.7623926,90.4041494,17z/data=!3m1!4b1!4m6!3m5!1s0x3755c655f3b844c7:0x15b5e83e709e9618!8m2!3d23.7623877!4d90.4067297!16s%2Fg%2F11cs26b244?entry=ttu";

const OfflineAlertTable = ({
  selectedVehicles,
  isLoading,
  errorNotify,
  emptyArrayNotify,
  offset,
  dateRange,
  setDateRange,
  selectedIdentifiers,
}) => {
  const columns = useMemo(
    () => [
      // ==== index 0 ====
      {
        Header: "SI.",
        accessor: "sl",
      },

      // ==== index 1 ====
      {
        Header: "BSTID",
        accessor: "bst_id",
      },

      // ==== index 2 ====
      {
        Header: "Vehicle",
        accessor: "vehicleName",
      },

      // ==== index 3 ====
      {
        Header: "Last Online Time",
        accessor: "lastOnlineTime",
      },

      // ==== index 4 ====
      {
        Header: "Type",
        accessor: "vehicle_type",
      },

      // ==== index 5 ====
      {
        Header: "",
        accessor: "image",
      },

      // ==== index 6 ====
      {
        Header: "Generated at",
        accessor: "generatedAt",
      },
      // ===== index  7
      {
        Header: "Location",
        accessor: "nearByLocation",
      },
      // ===== index 8
      {
        Header: "",
        accessor: "displayDropdownInfo",
      },
      // ===== index 9
      {
        Header: "",
        accessor: "latitude",
      },
      // ===== index 10
      {
        Header: "",
        accessor: "longitude",
      },
      // ===== index 11
      {
        Header: "",
        accessor: "vrn",
      },
    ],
    []
  );

  //=======header for csv
  const headers = [
    { label: "Sl", key: "sl" },
    { label: "BSTID", key: "bst_id" },
    { label: "Vehicle Name", key: "vehicleName" },
    { label: "Last Online Time", key: "lastOnlineTime" },
    { label: "Generated at", key: "generatedAt" },
    { label: "Type", key: "vehicle_type" },
    { label: "Location", key: "location" },
  ];

  const [data, setData] = useState([]);
  const myRef = useRef();

  const [isExporting, setIsExporting] = useState(false);

  // const initData = () => {
  //   const newState = selectedVehicles.map((item, index) => ({
  //     ...item,
  //     sl: index + 1,
  //   }));

  //   setData(newState);
  // };

  // useEffect(() => {
  //   initData();
  // }, [selectedVehicles]);

  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } =
    useTable(
      {
        columns,
        data,
      },
      usePagination
    );

  // EXPORT API ===================================================
  const handleDownloadFile = (dataUrl) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    // link.download = filename;
    link.click();
  };

  const handleExport = async () => {
    setIsExporting(true);
    const identifier = selectedIdentifiers
      .map((item) => item.v_identifier)
      .join(",");

    const data = {
      identifier: identifier,
      start_date: getYearMonthDay(dateRange.startDate),
      end_date: getYearMonthDay(dateRange.endDate),
    };
    console.log("request data", data);

    await axios
      .post("/api/v4/alert-management/offline-alert-export", data)
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

  // HANDLE DROPDOWN DATA FOR MOBILE DEVICE ================================
  const handleDropDownData = (bst_id) => {
    const newState = data?.map((vehicle) => {
      if (vehicle.bst_id === bst_id) {
        return {
          ...vehicle,
          displayDropdownInfo: !vehicle.displayDropdownInfo,
        };
      }
      return vehicle;
    });
    setData(newState);
  };

  // CLICK OUTSIDE ==========================================================
  const handelClickOutside = (e) => {
    if (!myRef.current.contains(e.target)) {
      const newState = data.map((vehicle) => {
        return { ...vehicle, displayDropdownInfo: false };
      });
      setData(newState);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handelClickOutside);
    return () => document.removeEventListener("mousedown", handelClickOutside);
  });

  const initData = () => {
    setData(selectedVehicles);
  };

  useEffect(() => {
    initData();
  }, [selectedVehicles]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-primaryText text-lg md:text-[32px] font-bold ">
          Offline Alert
        </h1>
        <button
          onClick={handleExport}
          disabled={!selectedVehicles.length}
          className={`fill-primaryText flex items-center justify-center gap-3 sm:py-3.5 sm:px-4 p-2 text-sm bg-primary text-primaryText rounded-lg primary-shadow hover:shadow-xl hover:shadow-primary/60 duration-300 font-medium mr-20 lg:mr-16 xl:mr-0 ${
            !selectedVehicles.length && "cursor-not-allowed"
          }`}
        >
          {!isExporting ? (
            <>
              <DownloadSVG /> <p className="hidden sm:block">Export</p>
            </>
          ) : (
            <>
              <SpinSVG />
              <p className="hidden sm:block">Loading...</p>
            </>
          )}
        </button>
      </div>
      <div className=" ">
        <div className="p-[15px] bg-white overflow-x-auto rounded-[20px] h-[75vh]">
          {isLoading ? (
            <div className="w-full">{skeletonDiv}</div>
          ) : (
            <table {...getTableProps()} className="w-full">
              <thead className="bg-secondary h-[70px] rounded-md hidden md:table-header-group">
                {
                  // Loop over the header rows
                  headerGroups.map((headerGroup) => (
                    // Apply the header row props

                    <tr {...headerGroup.getHeaderGroupProps()} className="">
                      {/* ======= SI. ======= */}
                      <th className="text-left text-lg font-bold px-3 rounded-l-[10px]  text-primaryText">
                        {headerGroup.headers[0].Header}
                      </th>
                      {/* ======= BSTID ======= */}
                      <th className="text-left text-lg font-bold  px-3  text-primaryText whitespace-nowrap">
                        {headerGroup.headers[1].Header}
                      </th>
                      {/* ======= Vehicle Name ======= */}
                      <th className="text-left text-lg font-bold  px-3  text-primaryText whitespace-nowrap">
                        {headerGroup.headers[2].Header}
                      </th>
                      {/* =======Last Online Time ======= */}
                      <th className="text-left text-lg font-bold px-3  text-primaryText whitespace-nowrap">
                        {headerGroup.headers[3].Header}
                      </th>

                      {/* ======= generated at ======= */}
                      <th className="text-left text-lg font-bold px-3  text-primaryText whitespace-nowrap ">
                        {headerGroup.headers[6].Header}
                      </th>

                      {/* ======= Type ======= */}
                      <th className="text-left text-lg font-bold px-3  text-primaryText">
                        {headerGroup.headers[4].Header}
                      </th>
                      {/* LOCATION */}
                      <th className="text-left text-lg font-bold px-3  text-[#1E1E1E] rounded-r-[10px] ">
                        {headerGroup.headers[7].Header}
                      </th>
                    </tr>
                  ))
                }
              </thead>

              <tbody
                ref={myRef}
                {...getTableBodyProps()}
                className="rounded-xl"
              >
                {rows.map((row, index) => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps()}
                      className={`rounded-xl h-[50px] md:h-[81px] ${
                        index % 2 === 0 ? "bg-white" : "bg-[#F8FBFF]"
                      } `}
                    >
                      {/* ======== SI ======== */}
                      <td className="rounded-l-[10px] px-3 text-[#48525C] hidden md:table-cell">
                        {row.cells[0].value ? row.cells[0].value : ""}
                      </td>

                      {/* ======== BSTID ======== */}
                      <td className="p-2 md:px-3 md:py-0 text-tmvDarkGray rounded-[10px] md:rounded-none cursor-pointer whitespace-nowrap">
                        {row.cells[1].value ? (
                          <div>
                            <div
                              onClick={() =>
                                handleDropDownData(row.cells[1].value)
                              }
                              className="flex items-center mt-1"
                            >
                              <p className="text-[12px] font-bold text-[#6A7077] md:text-base md:hidden">
                                BSTID:&nbsp;
                              </p>
                              <p className="text-[12px] font-bold md:font-normal text-[#6A7077] md:text-base">
                                {row.cells[1].value}
                              </p>
                            </div>
                            {/* TABLE DETAILS FOR SMALL DEVICE */}
                            <div
                              className={`${
                                row.cells[8].value === true
                                  ? "h-[180px] xs:h-[120px]"
                                  : "h-0"
                              } duration-500 ease-in-out overflow-hidden md:hidden`}
                            >
                              {/* VEHICLE NAME */}
                              <div className="flex items-center mt-1">
                                <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                                  Vehicle:&nbsp;
                                </p>
                                <p className="text-[12px] text-[#6A7077] md:text-base">
                                  {row.cells[11].value}
                                </p>
                              </div>
                              {/* LAST ONLINE TIME */}
                              <div className="flex items-center mt-1">
                                <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                                  Last Online time:&nbsp;
                                </p>
                                <p className="text-[12px] text-[#6A7077] md:text-base">
                                  {vehicleDateTime(row.cells[3].value)}
                                </p>
                              </div>
                              {/* GENERATED AT */}
                              <div className="flex items-center mt-1">
                                <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                                  Generated at:&nbsp;
                                </p>
                                <p className="text-[12px] text-[#6A7077] md:text-base">
                                  {vehicleDateTime(row.cells[6].value)}
                                </p>
                              </div>
                              {/* TYPE */}
                              <div className="flex items-center mt-1">
                                <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                                  Type:&nbsp;
                                </p>
                                <div className="flex items-center space-x-3 ">
                                  <p className="text-[12px] text-[#6A7077] md:text-base">
                                    {row.cells[4].value}
                                  </p>
                                </div>
                              </div>
                              {/* LOCATION */}
                              <div className="flex items-center mt-1">
                                <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                                  Location:&nbsp;
                                </p>
                                <div>
                                  <Link
                                    href={`https://www.google.com/maps?q=${row.cells[9].value},${row.cells[10].value}`}
                                    className="group flex items-center space-x-1"
                                    target={"_blank"}
                                  >
                                    <LocationSVGMobile />
                                    <p className="text-[12px] text-[#6A7077] md:text-base">
                                      {row.cells[7].value}
                                    </p>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </td>

                      {/* ======== Vehicle ======== */}
                      <td className="px-3 text-[#48525C] hidden md:table-cell whitespace-nowrap">
                        {row.cells[11].value ? row.cells[11].value : ""}
                      </td>

                      {/* ======== last Online Time	======== */}
                      <td className="px-3  text-[#48525C] hidden md:table-cell whitespace-nowrap">
                        <div>
                          {row.cells[3].value
                            ? vehicleDateTime(row.cells[3].value)
                            : ""}
                        </div>
                      </td>

                      {/* ======== Generated at	======== */}
                      <td className="px-3  text-[#48525C] hidden md:table-cell whitespace-nowrap">
                        <div>
                          {row.cells[6].value
                            ? vehicleDateTime(row.cells[6].value)
                            : ""}
                        </div>
                      </td>

                      {/* ======== Type ======== */}
                      <td
                        className={`px-3 text-[#48525C] capitalize hidden md:table-cell whitespace-nowrap`}
                      >
                        <div className="flex items-center space-x-3">
                          {row.cells[4].value ? row.cells[4].value : ""}
                        </div>
                      </td>
                      {/* LOCATION */}
                      <td
                        className={`rounded-r-[10px] px-3 text-[#48525C] hidden md:table-cell `}
                      >
                        <Link
                          href={`https://www.google.com/maps?q=${row.cells[9].value},${row.cells[10].value}`}
                          className="group flex items-center space-x-2"
                          target={"_blank"}
                        >
                          <LocationSVG />
                          <p className="text-sm min-w-[200px]">
                            {row.cells[7].value}
                          </p>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfflineAlertTable;
