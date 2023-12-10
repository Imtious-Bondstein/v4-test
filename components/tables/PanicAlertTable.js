"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTable, usePagination } from "react-table";
import Link from "next/link";
import LeftArrowPaginateSVG from "../SVG/pagination/LeftArrowPaginateSVG";
import RightArrowPaginateSVG from "../SVG/pagination/RightArrowPaginateSVG";

import DownloadSVG from "../SVG/DownloadSVG";
import CarIcon from "../../public/cars/table/car.png";
import BikeIcon from "../../public/cars/table/bike.png";
import CngIcon from "../../public/cars/table/cng.png";
import AmbulanceIcon from "../../public/cars/table/ambulance.png";
import TruckIcon from "../../public/cars/table/truck.png";
import { vehicleDateTime } from "@/utils/dateTimeConverter";

// excel generate
import { CSVLink } from "react-csv";
import LocationSVG from "../SVG/dashboard/LocationSVG";
import LocationSVGMobile from "../SVG/dashboard/LocationSVGMobile";
import axios from "@/plugins/axios";
import SpinSVG from "../SVG/SpinSVG";
const mapLink =
  "https://www.google.com/maps/place/Bondstein+Technologies+Limited/@23.7623926,90.4041494,17z/data=!3m1!4b1!4m6!3m5!1s0x3755c655f3b844c7:0x15b5e83e709e9618!8m2!3d23.7623877!4d90.4067297!16s%2Fg%2F11cs26b244?entry=ttu";

const PanicAlertTable = ({
  selectedVehicles,
  dateRange,
  isLoading,
  errorNotify,
  emptyArrayNotify,
  offset,
}) => {
  const columns = useMemo(
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
        Header: "Vehicle",
        accessor: "vehicleName",
      },
      {
        Header: "Date | Time",
        accessor: "dateTime",
      },
      {
        Header: "Type",
        accessor: "vehicle_type",
      },
      {
        Header: "",
        accessor: "image",
      },
      {
        Header: "Location",
        accessor: "location",
      },
      //  ==== index 7 displayDropdownInfo
      {
        Header: "",
        accessor: "displayDropdownInfo",
      },
      {
        Header: "Near By Location",
        accessor: "nearByLocation",
      },
    ],
    []
  );

  // {
  //   sl: 1,
  //   bst_id: "TMV 28281",
  //   vehicleName: "DM LA 118-4479 Bikee",
  //   lastOnlineTime: "5 Jan 2023 | 2:33 pm",
  //   vehicle_type: "car",
  //   image: "",
  // },

  //=======header for csv
  const headers = [
    { label: "Sl", key: "sl" },
    { label: "BSTID", key: "bst_id" },
    { label: "Vehicle Name", key: "vehicleName" },
    { label: "Date | Time", key: "dateTime" },
    { label: "Type", key: "vehicle_type" },
  ];

  // const selectedVehicles = [
  //   {3.

  6556;
  //     bst_id: "TMV TEST 887",
  //     vehicleName: "DM LA 118-4479",
  //     dateTime: "16 Jan 2023 | 5:56 pm",
  //     vehicle_type: "Bike",
  //   },
  //   {
  //     bst_id: "TMV TEST 886",
  //     vehicleName: "DM LA 118-4479",
  //     dateTime: "16 Jan 2023 | 5:56 pm",
  //     vehicle_type: "Bike",
  //   },
  //   {
  //     bst_id: "TMV TEST 885",
  //     vehicleName: "DM LA 118-4479",
  //     dateTime: "16 Jan 2023 | 5:56 pm",
  //     vehicle_type: "Bike",
  //   },
  // ];

  const [data, setData] = useState([]);
  const myRef = useRef();
  const [isExporting, setIsExporting] = useState(false);

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,

    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    usePagination
  );

  const clickPrevPage = () => {
    previousPage();
  };

  const clickNextPage = () => {
    nextPage();
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
      .post("/api/v4/alert-management/panic-alert-export", data)
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
      <div className="">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[#1E1E1E] text-lg md:text-[32px] font-bold ">
            Panic Alert
          </h1>
          {/* <CSVLink
            data={data}
            headers={headers}
            filename={"TMV-Alert-Panic.csv"}
          >
            <button
              className={`fill-primaryText flex items-center justify-center gap-3 py-2 md:py-3.5 px-4 text-sm bg-primary text-primaryText rounded-lg primary-shadow hover:shadow-xl hover:shadow-primary/60 duration-300 font-medium mr-20 lg:mr-16 xl:mr-0`}
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
        <div className=" ">
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
                        <th className="text-left text-lg font-bold px-3 rounded-l-[10px] text-[#1E1E1E]">
                          {headerGroup.headers[0].Header}
                        </th>
                        {/* ======= BSTID ======= */}
                        <th className="text-left text-lg font-bold px-3 text-[#1E1E1E]">
                          {headerGroup.headers[1].Header}
                        </th>
                        {/* ======= Vehicle Name ======= */}
                        <th className="text-left text-lg font-bold  px-3  text-[#1E1E1E]">
                          {headerGroup.headers[2].Header}
                        </th>
                        {/* =======Last Online Time ======= */}
                        <th className="text-left text-lg font-bold px-3  text-[#1E1E1E]">
                          {headerGroup.headers[3].Header}
                        </th>

                        {/* ======= Type ======= */}
                        <th className="text-left text-lg font-bold px-3  text-[#1E1E1E] ">
                          {headerGroup.headers[4].Header}
                        </th>
                        {/* LOCATION */}
                        <th className="text-left text-lg font-bold px-3  text-[#1E1E1E] rounded-r-[10px] ">
                          {headerGroup.headers[6].Header}
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
                  {page.map((row, index) => {
                    prepareRow(row);
                    return (
                      <tr
                        {...row.getRowProps()}
                        className={`rounded-xl h-[40px] md:h-[81px] ${
                          index % 2 === 0 ? "bg-white" : "bg-[#F8FBFF]"
                        } `}
                      >
                        {/* ======== SI ======== */}
                        <td className="rounded-l-[10px] px-3 text-[#48525C] hidden md:table-cell">
                          {row.cells[0].value ? row.cells[0].value : ""}
                        </td>

                        {/* ======== BSTID ======== */}
                        <td className="px-3 text-[#48525C]">
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
                                  row.cells[7].value === true
                                    ? "h-[120px]"
                                    : "h-0"
                                } duration-500 ease-in-out overflow-hidden md:hidden`}
                              >
                                {/* VEHICLE */}
                                <div className="flex items-center mt-1">
                                  <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                                    Vehicle:&nbsp;
                                  </p>
                                  <p className="text-[12px] text-[#6A7077] md:text-base">
                                    {row.cells[2].value}
                                  </p>
                                </div>
                                {/* LAST ONLINE TIME */}
                                <div className="flex items-center mt-1">
                                  <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                                    Date | Time:&nbsp;
                                  </p>
                                  <p className="text-[12px] text-[#6A7077] md:text-base">
                                    {row.cells[3].value}
                                  </p>
                                </div>
                                {/* TYPE */}
                                <div className="flex items-center mt-1">
                                  <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                                    Type:&nbsp;
                                  </p>
                                  <p className="text-[12px] text-[#6A7077] md:text-base">
                                    {row.cells[4].value}
                                  </p>
                                </div>
                                {/* LOCATION */}
                                <div className="flex items-center mt-1">
                                  <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                                    Location:&nbsp;
                                  </p>
                                  <div>
                                    <Link
                                      href={mapLink}
                                      className="group flex items-center space-x-2"
                                      target={"_blank"}
                                    >
                                      <LocationSVGMobile />
                                      <p className="text-[12px] text-[#6A7077] md:text-base min-w-[200px]">
                                        {row.cells[6].value}
                                        {row.cells[8].value}
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

                        {/* ======== Vehicle Name ======== */}
                        <td className="px-3 text-[#48525C] hidden md:table-cell">
                          {row.cells[2].value ? row.cells[2].value : ""}
                        </td>

                        {/* ======== last Online Time	======== */}
                        <td className="px-3  text-[#48525C] hidden md:table-cell">
                          {/* <div>
                            {row.cells[3].value
                              ? vehicleDateTime(row.cells[3].value)
                              : ""}
                          </div> */}
                          <div>{row.cells[3].value}</div>
                        </td>

                        {/* ======== Type ======== */}
                        <td
                          className={`px-3 text-[#48525C] capitalize hidden md:table-cell`}
                        >
                          <div className="flex items-center space-x-2.5 ">
                            {row.cells[4].value ? row.cells[4].value : ""}
                          </div>
                        </td>
                        {/* LOCATION */}
                        <td
                          className={`rounded-r-[10px] px-3 py-0 text-[#48525C] hidden md:table-cell`}
                        >
                          <Link
                            href={mapLink}
                            className="group flex items-center space-x-2"
                            target={"_blank"}
                          >
                            <LocationSVG />
                            <p className="text-sm min-w-[200px]">
                              {row.cells[6].value}
                              {row.cells[8].value}
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

        {/* ====== pagination ====== */}
        {/* <div className="pagination flex items-center justify-between pt-6">
          <div className="flex items-center gap-4 ">
            <div>
              <label className="text-[#48525C] mr-2">Rows visible</label>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                }}
                className="p-[10px] rounded-md text-[#48525C] text-sm"
              >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="text-[#48525C]">
                Showing {pageIndex + 1} of {pageOptions.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 my-3">
            <button
              onClick={() => clickPrevPage()}
              disabled={!canPreviousPage}
              className="bg-white hover:bg-[#FDD10E] w-[40px] h-[40px] rounded-md flex items-center justify-center"
            >
              <LeftArrowPaginateSVG />
            </button>

            {[...Array(pageCount).keys()].map((index) => (
              <button
                key={index}
                className={` hover:bg-[#FDD10E] w-[40px] h-[40px] rounded-md flex items-center justify-center ${
                  index == pageIndex ? "bg-[#FDD10E]" : "bg-white"
                }`}
                onClick={() => gotoPage(index)}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => clickNextPage()}
              disabled={!canNextPage}
              className="bg-white hover:bg-[#FDD10E] w-[40px] h-[40px] rounded-md flex items-center justify-center"
            >
              <RightArrowPaginateSVG />
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default PanicAlertTable;
