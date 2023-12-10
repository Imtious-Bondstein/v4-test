"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useTable, usePagination } from "react-table";
import LeftArrowPaginateSVG from "../SVG/pagination/LeftArrowPaginateSVG";
import RightArrowPaginateSVG from "../SVG/pagination/RightArrowPaginateSVG";

import ThreeDotSVG from "../SVG/dashboard/ThreeDotSVG";

import DownloadSVG from "../SVG/DownloadSVG";
import CarIcon from "../../public/cars/table/car.png";
import BikeIcon from "../../public/cars/table/bike.png";
import CngIcon from "../../public/cars/table/cng.png";
import AmbulanceIcon from "../../public/cars/table/ambulance.png";
import TruckIcon from "../../public/cars/table/truck.png";
import PrinterSVG from "../SVG/PrinterSVG";

// excel generate
import { CSVLink } from "react-csv";
import { checkTimeDuration } from "@/utils/durationChecker";
import PrintTable from "./PrintTable";
import "../../styles/components/printLandscapeTable.css";
import { useReactToPrint } from "react-to-print";
import LocationSVG from "../SVG/dashboard/LocationSVG";
import LocationSVGMobile from "../SVG/dashboard/LocationSVGMobile";
import SpinSVG from "../SVG/SpinSVG";
import axios from "@/plugins/axios";

const mapLink = "https://www.google.com/maps/dir/?api=1";

const FatigueAlertTable = ({
  selectedVehicles,
  dateRange,
  isLoading,
  errorNotify,
  emptyArrayNotify,
  offset,
}) => {
  const componentRef = useRef();

  const columns = useMemo(
    () => [
      // index 0
      {
        Header: "SI.",
        accessor: "sl",
      },
      {
        // index 1
        Header: "BSTID",
        accessor: "bst_id",
      },

      // index 2
      {
        Header: "Vehicle",
        accessor: "vehicleName",
      },

      // index 3
      {
        Header: "From Location",
        accessor: "start_landmark",
      },

      // index 4
      {
        Header: "",
        accessor: "start_time",
      },

      // index 5
      {
        Header: "To Location",
        accessor: "end_landmark",
      },

      // index 6
      {
        Header: "",
        accessor: "end_time",
      },

      // index 7
      {
        Header: "Duration",
        accessor: "duration",
      },

      // index 8
      {
        Header: "",
        accessor: "from_latitude",
      },
      // index 9
      {
        Header: "",
        accessor: "from_longitude",
      },
      // index 10
      {
        Header: "",
        accessor: "to_latitude",
      },
      // index 11
      {
        Header: "",
        accessor: "to_longitude",
      },
      // index 12
      {
        Header: "",
        accessor: "identifier",
      },
      // index 13
      {
        Header: "Location",
        accessor: "location",
      },
      // index 14
      {
        Header: "",
        accessor: "displayDropdownInfo",
      },
      // index 15
      {
        Header: "Near By Location",
        accessor: "nearByLocation",
      },
      {
        Header: "",
        accessor: "vrn",
      },
    ],
    []
  );

  const columnsForPrint = useMemo(
    () => [
      {
        Header: "SI.",
        accessor: "sl",
      },
      {
        Header: "BSTID",
        accessor: "bst_id",
      },

      {
        Header: "Vehicle Name",
        accessor: "vehicleName",
      },

      {
        Header: "From Location",
        accessor: "start_landmark",
      },

      {
        Header: "To Location",
        accessor: "end_landmark",
      },

      {
        Header: "Start Time",
        accessor: "start_time",
      },

      {
        Header: "End Time",
        accessor: "end_time",
      },

      {
        Header: "Duration",
        accessor: "duration",
      },
      {
        Header: "Location",
        accessor: "location",
      },
      {
        Header: "Near By Location",
        accessor: "nearByLocation",
      },
    ],
    []
  );

  //=======header for csv
  const headers = [
    { label: "SL", key: "sl" },
    { label: "BSTID", key: "bstid" },
    { label: "Vehicle Name", key: "vehicleName" },
    { label: "From Location", key: "start_landmark" },
    { label: "To Location", key: "end_landmark" },
    { label: "Start Time", key: "start_time" },
    { label: "End Time", key: "end_time" },
    { label: "Duration", key: "duration" },
    { label: "Location", key: "location" },
  ];

  const [data, setData] = useState([]);
  const myRef = useRef();
  const [isExporting, setIsExporting] = useState(false);

  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } =
    useTable({
      columns,
      data,
    });

  // const initData = (selectedVehicles) => {
  //   setData(
  //     selectedVehicles.map((item, index) => ({
  //       ...item,
  //       sl: index + 1,
  //     }))
  //   );
  // };

  // useEffect(() => {
  //   initData(selectedVehicles);
  // }, [selectedVehicles]);

  const handlePrintTable = useReactToPrint({
    content: () => componentRef.current,
  });

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
  const handleDropDownData = (sl) => {
    const newState = data?.map((vehicle) => {
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
    const newState = selectedVehicles.map((item, index) => ({
      ...item,
      sl: index + 1,
      displayDropdownInfo: false,
    }));
    setData(newState);
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
      .post("/api/v4/alert-management/fatigue-alert-export", data)
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
    initData();
  }, [selectedVehicles]);

  return (
    <div>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-primaryText text-base xs:text-lg md:text-[32px] font-bold ">
            Driving Fatigue Alert
          </h1>
          <div className="flex items-center sm:space-x-6 space-x-2 pr-20 lg:pr-16 xl:pr-0">
            <div>
              <button
                onClick={handlePrintTable}
                className={`fill-tmvGray  bg-white text-tmvGray flex items-center justify-center gap-3 sm:py-3.5 sm:px-4 p-2 text-sm rounded-lg dark-shadow font-medium hover:shadow-xl hover:dark-shadow/60 duration-300`}
              >
                <PrinterSVG /> <p className="hidden sm:block">Print</p>
              </button>

              {/* ==== table for print ===  */}
              <PrintTable
                data={data}
                columns={columnsForPrint}
                componentRef={componentRef}
              />
            </div>

            {/* <CSVLink
              data={data}
              headers={headers}
              filename={"TMV-Alert-Driving-Fatigue.csv"}
            >
              <button
                className={`fill-primaryText flex items-center justify-center gap-3 sm:py-3.5 sm:px-4 p-2 text-sm bg-primary text-primaryText rounded-lg primary-shadow hover:shadow-xl hover:shadow-primary/60 duration-300 font-medium`}
              >
                <DownloadSVG /> <p className="hidden sm:block">Export</p>
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
        </div>
        <div>
          <div className="p-[15px] bg-white overflow-x-auto rounded-[20px] h-[75vh]">
            {isLoading ? (
              <div className="w-full">{skeletonDiv}</div>
            ) : (
              <table {...getTableProps()} className="w-full">
                <thead className="bg-[#FFFAE6] h-[70px] rounded-md hidden md:table-header-group">
                  {
                    // Loop over the header rows
                    headerGroups.map((headerGroup) => (
                      // Apply the header row props

                      <tr {...headerGroup.getHeaderGroupProps()} className="">
                        {/* ======= SI. ======= */}
                        <th className="text-left text-lg font-bold px-3 rounded-l-[10px]  text-primaryText whitespace-nowrap">
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

                        {/* ======= from Location ======= */}
                        <th className="text-left px-3  text-primaryText whitespace-nowrap">
                          <div>
                            <p className="text-left text-lg font-bold">
                              {headerGroup.headers[3].Header}
                            </p>
                            <p className="text-left  text-sm">Date | Time</p>
                          </div>
                        </th>

                        {/* ======= to Location ======= */}
                        <th className="px-3  text-primaryText whitespace-nowrap">
                          <div>
                            <p className="text-left text-lg font-bold">
                              {headerGroup.headers[5].Header}
                            </p>
                            <p className="text-left text-sm"> Date | Time </p>
                          </div>
                        </th>

                        {/* ======= duration ======= */}
                        <th className="text-left text-lg font-bold px-3  text-primaryText whitespace-nowrap">
                          {headerGroup.headers[7].Header}
                        </th>
                        {/* LOCATION */}
                        <th className="text-left text-lg font-bold px-3  text-[#1E1E1E] rounded-r-[10px] ">
                          {headerGroup.headers[13].Header}
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
                        onClick={() => handleDropDownData(row.cells[0].value)}
                        className={`rounded-xl h-[50px] md:h-[81px] ${
                          index % 2 === 0 ? "bg-white" : "bg-[#F8FBFF]"
                        } `}
                      >
                        {/* ======== SI ======== */}
                        <td className="rounded-l-[10px] px-3  text-tmvDarkGray whitespace-nowrap hidden md:table-cell">
                          {row.cells[0].value}
                        </td>

                        {/* ======== BSTID ======== */}
                        <td
                          className="p-2 md:px-3 md:py-0 text-tmvDarkGray rounded-[10px] md:rounded-none cursor-pointer"
                          title="Click to view details"
                        >
                          {row.cells[1].value ? (
                            <div>
                              <div className="flex items-center mt-1">
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
                                  row.cells[14].value === true
                                    ? "h-[220px] sm:h-[160px]"
                                    : "h-0"
                                } duration-500 ease-in-out overflow-hidden md:hidden`}
                              >
                                {/* VEHICLE NAME */}
                                <div className="flex items-center mt-1">
                                  <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                                    Vehicle:&nbsp;
                                  </p>
                                  <p className="text-[12px] text-[#6A7077] md:text-base">
                                    {row.cells[16].value}
                                  </p>
                                </div>
                                {/* FROM LOCATION & DATE TIME */}
                                <div className="flex items-center mt-1">
                                  <div>
                                    <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                                      From Location
                                    </p>
                                    <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                                      Date | Time
                                    </p>
                                  </div>
                                  :&nbsp;
                                  <div>
                                    <p className="text-[12px] text-[#6A7077] md:text-base">
                                      {row.cells[3].value}
                                    </p>
                                    <p className="text-[12px] text-[#6A7077] md:text-base">
                                      {row.cells[4].value}
                                    </p>
                                  </div>
                                </div>
                                {/* FROM LOCATION & DATE TIME */}
                                <div className="flex items-center mt-1">
                                  <div>
                                    <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                                      To Location
                                    </p>
                                    <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                                      Date | Time
                                    </p>
                                  </div>
                                  :&nbsp;
                                  <div>
                                    <p className="text-[12px] text-[#6A7077] md:text-base">
                                      {row.cells[5].value}
                                    </p>
                                    <p className="text-[12px] text-[#6A7077] md:text-base">
                                      {row.cells[6].value}
                                    </p>
                                  </div>
                                </div>
                                {/* DURATION */}
                                <div className="flex items-center mt-1">
                                  <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                                    Duration:&nbsp;
                                  </p>
                                  <p
                                    className={`text-[12px] text-[#6A7077] md:text-base ${
                                      checkTimeDuration(row.cells[7].value)
                                        ? "text-red-500"
                                        : "text-tmvDarkGray"
                                    } `}
                                  >
                                    {row.cells[7].value}
                                  </p>
                                </div>
                                {/* LOCATION */}
                                <div className="flex items-center mt-1">
                                  <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                                    Location:&nbsp;
                                  </p>
                                  <div>
                                    <Link
                                      href={`${mapLink}&origin=${row.cells[8].value},${row.cells[9].value}&destination=${row.cells[10].value},${row.cells[11].value}`}
                                      className="group flex items-center space-x-2"
                                      target={"_blank"}
                                    >
                                      <LocationSVGMobile />
                                      {row.cells[15].value}
                                      {/* <p className="text-[12px] text-[#6A7077] md:text-base min-w-[200px]">
                                        {row.cells[13].value}
                                      </p> */}
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                        </td>

                        {/* ======== Vehicle Name ======== */}
                        <td className="px-3 text-tmvDarkGray whitespace-nowrap hidden md:table-cell">
                          {row.cells[16].value}
                        </td>

                        {/* ======== from Location	======== */}
                        <td className="px-3  text-tmvDarkGray whitespace-nowrap hidden md:table-cell">
                          <div>
                            <p className="mb-1.5">{row.cells[3].value}</p>
                            <p className="font-light text-sm ">
                              {row.cells[4].value}
                            </p>
                          </div>
                        </td>

                        {/* ======== to Location ======== */}
                        <td
                          className={`px-3 text-tmvDarkGray whitespace-nowrap hidden md:table-cell`}
                        >
                          <div>
                            <p className="mb-1.5">{row.cells[5].value}</p>
                            <p className="font-light text-sm ">
                              {row.cells[6].value}
                            </p>
                          </div>
                        </td>

                        {/* ======== duration ======== */}
                        <td
                          className={`px-3 capitalize hidden md:table-cell ${
                            checkTimeDuration(row.cells[7].value)
                              ? "text-red-500"
                              : "text-tmvDarkGray"
                          } `}
                        >
                          {row.cells[7].value}
                        </td>
                        {/* LOCATION */}
                        <td
                          className={`rounded-r-[10px] px-3 text-[#48525C] hidden md:table-cell`}
                        >
                          <Link
                            href={`${mapLink}&origin=${row.cells[8].value},${row.cells[9].value}&destination=${row.cells[10].value},${row.cells[11].value}`}
                            className="group flex items-center space-x-2"
                            target={"_blank"}
                          >
                            <LocationSVG />
                            {row.cells[15].value}
                            {/* <p className="text-sm">{row.cells[13].value}</p> */}
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
    </div>
  );
};

export default FatigueAlertTable;
