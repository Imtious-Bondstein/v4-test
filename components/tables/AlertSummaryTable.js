"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTable, usePagination } from "react-table";
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

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// excel generate
import { CSVLink } from "react-csv";
import SpinSVG from "../SVG/SpinSVG";
import axios from "@/plugins/axios";
import { getYearMonthDay } from "@/utils/dateTimeConverter";

const AlertSummaryTable = ({
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
      // ==== o index
      {
        Header: "SI.",
        accessor: "sl",
      },
      // ==== 1 index
      {
        Header: "Vehicle Code",
        accessor: "vehicle_code",
      },
      // ==== 2 index
      {
        Header: "Disconnect",
        accessor: "disconnect",
      },
      // ==== 3 index
      {
        Header: "Engine On",
        accessor: "engine_on",
      },
      // ==== 4 index
      {
        Header: "Engine Off",
        accessor: "engine_off",
      },
      // ==== 5 index
      {
        Header: "Panic",
        accessor: "panic",
      },
      // ==== 6 index
      {
        Header: "Overspeed",
        accessor: "overspeed",
      },
      // ==== 7 index
      {
        Header: "Harsh Brake",
        accessor: "harsh_break",
      },
      // ==== 8 index
      {
        Header: "Parking Exit",
        accessor: "parking_exit",
      },
      // ==== 9 index
      {
        Header: "Fence Entry",
        accessor: "fence_entry",
      },
      // ==== 10 index
      {
        Header: "Fence Exist",
        accessor: "fence_exist",
      },
      // ==== 11 index
      {
        Header: "Total",
        accessor: "total",
      },
      // ==== 12 index
      {
        Header: "action",
        accessor: "displayDropdown",
      },
      // ==== 13 index
      {
        Header: "",
        accessor: "identifier",
      },
      // ===== 14 index
      {
        Header: "",
        accessor: "displayDropdownInfo",
      },
    ],
    []
  );

  //=======header for csv
  const headers = [
    { label: "Sl", key: "sl" },
    { label: "VRN", key: "vrn" },
    { label: "Vehicle Code", key: "vehicle_code" },
    { label: "Disconnect", key: "disconnect" },
    { label: "Engine On", key: "engine_on" },
    { label: "Engine Off", key: "engine_off" },
    { label: "Panic", key: "panic" },
    { label: "Overspeed", key: "overspeed" },
    { label: "Harsh Brake", key: "harsh_break" },
    { label: "Parking Exit", key: "parking_exit" },
    { label: "Fence Entry", key: "fence_entry" },
    { label: "Fence Exist", key: "fence_exist" },
  ];

  const [data, setData] = useState([]);
  const [dropDownsTracker, setDropDownsTracker] = useState([]);
  const [tableSummary, setTableSummary] = useState({});
  const [totalDataShow, setTotalDataShow] = useState(false);
  const myRef = useRef();
  const [isExporting, setIsExporting] = useState(false);

  const initData = () => {
    const newState = selectedVehicles.map((item, index) => ({
      ...item,
      displayDropdownInfo: false,

      total:
        item.disconnect +
        item.engine_on +
        item.engine_off +
        item.panic +
        item.overspeed +
        item.harsh_break +
        item.parking_exit +
        item.fence_entry +
        item.fence_exist,
    }));

    setData(newState);

    setDropDownsTracker(
      selectedVehicles.map((item, index) => ({
        identifier: item.identifier,
        displayDropdown: false,
      }))
    );
  };

  // search by identifier
  const searchVehicleByIdentifier = (id) => {
    return dropDownsTracker.find((vehicle) => vehicle.identifier === id);
  };

  const clickDropdown = (item) => {
    console.log("clickDropdown===");
    const newState = dropDownsTracker.map((vehicle) => {
      if (vehicle.identifier === item.identifier) {
        // console.log("display action inside", item);
        return { ...vehicle, displayDropdown: !vehicle.displayDropdown };
      }
      return vehicle;
    });

    setDropDownsTracker(newState);
  };

  // ===== click outside ref +++
  const dropdownsRef = useRef([]);

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

  const calculateTotal = () => {
    let totalVehicle = selectedVehicles.length;

    let disconnect = 0;
    let engine_on = 0;
    let engine_off = 0;
    let panic = 0;
    let overspeed = 0;
    let harsh_break = 0;
    let parking_exit = 0;
    let fence_entry = 0;
    let fence_exist = 0;

    let total = 0;

    selectedVehicles.map((item, index) => {
      disconnect = disconnect + item.disconnect;
      engine_on = engine_on + item.engine_on;
      engine_off = engine_off + item.engine_off;
      panic = panic + item.panic;
      overspeed = overspeed + item.overspeed;
      harsh_break = harsh_break + item.harsh_break;
      parking_exit = parking_exit + item.parking_exit;
      fence_entry = fence_entry + item.fence_entry;
      fence_exist = fence_exist + item.fence_exist;

      total =
        total +
        (item.disconnect +
          item.engine_on +
          item.engine_off +
          item.panic +
          item.overspeed +
          item.harsh_break +
          item.parking_exit +
          item.fence_entry +
          item.fence_exist);

      // console.log("calculateTotal", item);
    });

    const updateSummary = {
      totalVehicle,
      disconnect,
      engine_on,
      engine_off,
      panic,
      overspeed,
      harsh_break,
      parking_exit,
      fence_entry,
      fence_exist,
      total,
    };

    setTableSummary(updateSummary);

    // console.log("newObj", updateSummary);
  };

  useEffect(() => {
    // console.log("selectedVehicles", selectedVehicles);
    initData();
    calculateTotal();
  }, [selectedVehicles]);

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick, true);

    return () => {
      document.removeEventListener("click", handleOutsideClick, true);
    };
  }, []);

  // ====== table func

  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } =
    useTable({
      columns,
      data,
      setData,
    });

  const clickAction = (item) => {
    const clickedId = item.original.id;
    let foundItem = data.find((vehicle) => vehicle.id === clickedId);

    console.log("foundItem--", foundItem);
    foundItem.displayDropdown = true;
    setData(...data, foundItem);
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
  const handleDropDownData = (vehicle_code) => {
    const newState = data?.map((vehicle) => {
      if (vehicle.vehicle_code === vehicle_code) {
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
      .post("/api/v4/alert-management/alert-summary-export", data)
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
    <div className="pb-6">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-primaryText text-lg md:text-[32px] font-bold ">
          Alert Summary
        </h1>

        <button
          onClick={handleExport}
          disabled={!selectedVehicles.length}
          className={`fill-primaryText flex items-center justify-center gap-3 sm:py-3.5 sm:px-5 p-2 text-sm bg-primary text-primaryText rounded-lg primary-shadow hover:shadow-xl hover:shadow-primary/60 duration-300 font-medium mr-20 lg:mr-16 xl:mr-0  ${
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
        <div className="relative p-[15px] bg-white overflow-x-auto  rounded-[20px] h-[75vh]">
          <ToastContainer
            style={{
              position: "absolute",
              top: 10,
              left: 0,
              right: 0,
              margin: "0 auto",
            }}
          />

          {isLoading ? (
            <div className="w-full">{skeletonDiv}</div>
          ) : (
            <table {...getTableProps()} className="md:min-w-[1400px] w-full ">
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

                      {/* ======= vehicle Code ======= */}
                      <th className="text-left text-lg font-bold  px-3  text-primaryText whitespace-nowrap">
                        {headerGroup.headers[1].Header}
                      </th>

                      {/* ======= disconnect ======= */}
                      <th className="text-left text-lg font-bold  px-3  text-primaryText whitespace-nowrap">
                        {headerGroup.headers[2].Header}
                      </th>

                      {/* ======= engine On ======= */}
                      <th className="text-left text-lg font-bold px-3  text-primaryText whitespace-nowrap">
                        {headerGroup.headers[3].Header}
                      </th>

                      {/* ======= engine Off ======= */}
                      <th className="text-left text-lg font-bold px-3  text-primaryText  whitespace-nowrap ">
                        {headerGroup.headers[4].Header}
                      </th>

                      {/* ======= panic ======= */}
                      <th className="text-left text-lg font-bold  px-3  text-primaryText whitespace-nowrap">
                        {headerGroup.headers[5].Header}
                      </th>

                      {/* ======= overspeed ======= */}
                      <th className="text-left text-lg font-bold  px-3  text-primaryText whitespace-nowrap">
                        {headerGroup.headers[6].Header}
                      </th>

                      {/* ======= harshBrake ======= */}
                      <th className="text-left text-lg font-bold  px-3  text-primaryText whitespace-nowrap">
                        {headerGroup.headers[7].Header}
                      </th>

                      {/* ======= parkingExit ======= */}
                      <th className="text-left text-lg font-bold  px-3  text-primaryText whitespace-nowrap">
                        {headerGroup.headers[8].Header}
                      </th>

                      {/* ======= fenceEntry ======= */}
                      <th className="text-left text-lg font-bold  px-3  text-primaryText whitespace-nowrap">
                        {headerGroup.headers[9].Header}
                      </th>

                      {/* ======= fenceExist ======= */}
                      <th className="text-left text-lg font-bold  px-3  text-primaryText whitespace-nowrap">
                        {headerGroup.headers[10].Header}
                      </th>

                      {/* ======= total ======= */}
                      <th className="text-left text-lg font-bold  px-3  text-primaryText whitespace-nowrap">
                        {headerGroup.headers[11].Header}
                      </th>

                      {/* ======= dots ======= */}
                      <th className="w-6 text-center rounded-r-[10px] text-lg font-bold  px-3  text-primaryText whitespace-nowrap sticky -right-4 bg-[#FFFAE6]">
                        Actions
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
                      style={{ zIndex: offset - index }}
                      {...row.getRowProps()}
                      className={`relative rounded-xl h-[50px] md:h-[81px] ${
                        index % 2 === 0 ? "bg-white" : "bg-[#F8FBFF]"
                      } `}
                    >
                      {/* ======== SI ======== */}
                      <td className="rounded-l-[10px] px-3  text-tmvDarkGray hidden md:table-cell">
                        {row.cells[0].value}
                      </td>

                      {/* ======== vehicle Code ======== */}
                      <td
                        className={`p-2 md:px-3 md:py-0 text-tmvDarkGray rounded-[10px] md:rounded-none cursor-pointer`}
                      >
                        {row.cells[1].value ? (
                          <div>
                            <div
                              onClick={() =>
                                handleDropDownData(row.cells[1].value)
                              }
                              className="flex items-center mt-1"
                            >
                              <p className="text-[12px] font-bold text-[#6A7077] md:text-base md:hidden">
                                Vehicle Code:&nbsp;
                              </p>
                              <p className="text-[12px] font-bold md:font-normal text-[#6A7077] md:text-base">
                                {row.cells[1].value}
                              </p>
                            </div>
                            {/* TABLE DETAILS FOR SMALL DEVICE */}
                            <div
                              className={`${
                                row.cells[14].value === true
                                  ? "h-[220px]"
                                  : "h-0"
                              } duration-500 ease-in-out overflow-hidden md:hidden`}
                            >
                              {/* DISCONNECT */}
                              <div className="flex items-center mt-1">
                                <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                                  Disconnect:&nbsp;
                                </p>
                                <p className="text-[12px] text-[#6A7077] md:text-base">
                                  {row.cells[2].value}
                                </p>
                              </div>
                              {/* ENGINE ON */}
                              <div className="flex items-center mt-1">
                                <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                                  Engine On:&nbsp;
                                </p>
                                <p className="text-[12px] text-[#6A7077] md:text-base">
                                  {row.cells[3].value}
                                </p>
                              </div>
                              {/* ENGINE OFF */}
                              <div className="flex items-center mt-1">
                                <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                                  Engine Off:&nbsp;
                                </p>
                                <p className="text-[12px] text-[#6A7077] md:text-base">
                                  {row.cells[4].value}
                                </p>
                              </div>
                              {/* PANIC */}
                              <div className="flex items-center mt-1">
                                <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                                  Panic:&nbsp;
                                </p>
                                <p className="text-[12px] text-[#6A7077] md:text-base">
                                  {row.cells[5].value}
                                </p>
                              </div>
                              {/* OVERSPEED */}
                              <div className="flex items-center mt-1">
                                <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                                  Overspeed:&nbsp;
                                </p>
                                <p className="text-[12px] text-[#6A7077] md:text-base">
                                  {row.cells[6].value}
                                </p>
                              </div>
                              {/* HARSH BRAKE */}
                              <div className="flex items-center mt-1">
                                <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                                  Harsh Brake:&nbsp;
                                </p>
                                <p className="text-[12px] text-[#6A7077] md:text-base">
                                  {row.cells[7].value}
                                </p>
                              </div>
                              {/* PARKING EXIT */}
                              <div className="flex items-center mt-1">
                                <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                                  Parking Exit:&nbsp;
                                </p>
                                <p className="text-[12px] text-[#6A7077] md:text-base">
                                  {row.cells[8].value}
                                </p>
                              </div>
                              {/* FENCE ENTRY */}
                              <div className="flex items-center mt-1">
                                <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                                  Fence Entry:&nbsp;
                                </p>
                                <p className="text-[12px] text-[#6A7077] md:text-base">
                                  {row.cells[9].value}
                                </p>
                              </div>
                              {/* FENCE EXIST */}
                              <div className="flex items-center mt-1">
                                <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                                  Fence Exist:&nbsp;
                                </p>
                                <p className="text-[12px] text-[#6A7077] md:text-base">
                                  {row.cells[10].value}
                                </p>
                              </div>
                              {/* TOTAL */}
                              <div className="flex items-center mt-1">
                                <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                                  Total:&nbsp;
                                </p>
                                <p className="text-[12px] text-[#6A7077] md:text-base">
                                  {row.cells[11].value}
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </td>

                      {/* ======== disconnect ======== */}
                      <td
                        className={` px-3 text-tmvDarkGray whitespace-nowrap hidden md:table-cell`}
                      >
                        {row.cells[2].value}
                      </td>

                      {/* ======== engine On ======== */}
                      <td
                        className={` px-3 text-tmvDarkGray whitespace-nowrap hidden md:table-cell`}
                      >
                        {row.cells[3].value}
                      </td>

                      {/* ======== engine Off ======== */}
                      <td
                        className={` px-3 text-tmvDarkGray whitespace-nowrap hidden md:table-cell`}
                      >
                        {row.cells[4].value}
                      </td>

                      {/* ======== panic ======== */}
                      <td
                        className={` px-3 text-tmvDarkGray whitespace-nowrap hidden md:table-cell`}
                      >
                        {row.cells[5].value}
                      </td>

                      {/* ======== overspeed ======== */}
                      <td
                        className={` px-3 text-tmvDarkGray whitespace-nowrap hidden md:table-cell`}
                      >
                        {row.cells[6].value}
                      </td>

                      {/* ======== harsh Brake ======== */}
                      <td
                        className={` px-3 text-tmvDarkGray whitespace-nowrap hidden md:table-cell`}
                      >
                        {row.cells[7].value}
                      </td>

                      {/* ======== parking Exit ======== */}
                      <td
                        className={` px-3 text-tmvDarkGray whitespace-nowrap hidden md:table-cell`}
                      >
                        {row.cells[8].value}
                      </td>

                      {/* ======== fence Entry ======== */}
                      <td
                        className={` px-3 text-tmvDarkGray whitespace-nowrap hidden md:table-cell`}
                      >
                        {row.cells[9].value}
                      </td>

                      {/* ======== fenceExist ======== */}
                      <td
                        className={` px-3 text-tmvDarkGray whitespace-nowrap hidden md:table-cell`}
                      >
                        {row.cells[10].value}
                      </td>

                      {/* ======== total ======== */}
                      <td
                        className={` px-3 text-tmvDarkGray whitespace-nowrap hidden md:table-cell`}
                      >
                        {row.cells[11].value}
                      </td>

                      {/* ======== dots ======== */}
                      <td
                        className={`rounded-r-[10px] px-3 text-tmvDarkGray whitespace-nowrap sticky -right-4 hidden md:table-cell ${
                          index % 2 === 0 ? "bg-white" : "bg-[#F8FBFF]"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1  ">
                          {/* ======== current location ======= */}
                          <div>
                            <CustomToolTip
                              id={`action-distance-${row.cells[13].value}`}
                              title={`Current Location`}
                              containerClass="action default-tooltip middle-tooltip tooltipStyleChange"
                            >
                              <Link
                                href={`/location/current-location?identifier=${row.cells[13].value}`}
                                id={`action-distance-${row.cells[13].value}`}
                                className="group group-hover:bg-[#FAFAFA]  rounded w-[31px] h-[31px] flex items-center justify-center  "
                              >
                                <LocationSVG />
                              </Link>
                            </CustomToolTip>
                          </div>

                          {/* ======== distance link ======= */}
                          <div>
                            <CustomToolTip
                              id={`action-distance-${row.cells[13].value}`}
                              title={`Hourly Distance Report`}
                              containerClass="action default-tooltip middle-tooltip tooltipStyleChange"
                            >
                              <Link
                                href="/alert-summary"
                                id={`action-distance-${row.cells[13].value}`}
                                className="group group-hover:bg-[#FAFAFA]  rounded w-[31px] h-[31px] flex items-center justify-center  "
                              >
                                <ClockSVG />
                              </Link>
                            </CustomToolTip>
                          </div>

                          {/* ======== calender link ======= */}
                          <div>
                            <CustomToolTip
                              id={`action-calendar-${row.cells[13].value}`}
                              title={`Daily Distance Report`}
                              containerClass="action default-tooltip middle-tooltip tooltipStyleChange"
                            >
                              <Link
                                href="/alert-summary"
                                id={`action-calendar-${row.cells[13].value}`}
                                className="group group-hover:bg-[#FAFAFA]  rounded w-[31px] h-[31px] flex items-center justify-center  "
                              >
                                <CalendarSVG />
                              </Link>
                            </CustomToolTip>
                          </div>

                          {/* ======== messenger link ======= */}
                          <div>
                            <CustomToolTip
                              id={`action-messenger-${row.cells[13].value}`}
                              title={`Engine Report`}
                              containerClass="action default-tooltip right-tooltip tooltipStyleChange"
                            >
                              <Link
                                href="/alert-summary"
                                id={`action-messenger-${row.cells[13].value}`}
                                className="group group-hover:bg-[#FAFAFA]  rounded w-[31px] h-[31px] flex items-center justify-center  "
                              >
                                <EngineReportSVG />
                              </Link>
                            </CustomToolTip>
                          </div>

                          {/* ======== location 2 link ======= */}
                          <div>
                            <CustomToolTip
                              id={`action-location2-${row.cells[13].value}`}
                              title={`Vehicle Route`}
                              containerClass="action default-tooltip right-tooltip tooltipStyleChange"
                            >
                              <Link
                                href={`/location/vehicle-route?identifier=${row.cells[13].value}`}
                                id={`action-location2-${row.cells[13].value}`}
                                className="group group-hover:bg-[#FAFAFA]  rounded w-[31px] h-[31px] flex items-center justify-center  "
                              >
                                <RouteVSG />
                              </Link>
                            </CustomToolTip>
                          </div>

                          {/* ======== actions tooltips ========  */}

                          {/* ======== actions tooltips end ========  */}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {!isLoading && (
                  <tr className="rounded-xl h-[50px] md:h-[81px] bg-[#E7ECF3]">
                    {/* ======== total ======== */}
                    <td
                      onClick={() => setTotalDataShow(!totalDataShow)}
                      className="rounded-xl md:rounded-l-[10px] md:rounded-r-[0px] px-3 py-2 font-bold text-tmvDarkGray"
                    >
                      Total
                      <div
                        className={`${
                          totalDataShow === true ? "h-[220px]" : "h-0"
                        } duration-500 ease-in-out overflow-hidden md:hidden`}
                      >
                        {/* TOTAL VEHICLE */}
                        <div className="flex items-center mt-1">
                          <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                            Vehicle:&nbsp;
                          </p>
                          <p className="text-[12px] text-[#6A7077] md:text-base">
                            {tableSummary.totalVehicle}
                          </p>
                        </div>
                        {/* DISCONNECT */}
                        <div className="flex items-center mt-1">
                          <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                            Disconnect:&nbsp;
                          </p>
                          <p className="text-[12px] text-[#6A7077] md:text-base">
                            {tableSummary.disconnect}
                          </p>
                        </div>
                        {/* ENGINE ON */}
                        <div className="flex items-center mt-1">
                          <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                            Engine On:&nbsp;
                          </p>
                          <p className="text-[12px] text-[#6A7077] md:text-base">
                            {tableSummary.engine_on}
                          </p>
                        </div>
                        {/* ENGINE OFF */}
                        <div className="flex items-center mt-1">
                          <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                            Engine On:&nbsp;
                          </p>
                          <p className="text-[12px] text-[#6A7077] md:text-base">
                            {tableSummary.engine_off}
                          </p>
                        </div>
                        {/* PANIC */}
                        <div className="flex items-center mt-1">
                          <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                            Panic:&nbsp;
                          </p>
                          <p className="text-[12px] text-[#6A7077] md:text-base">
                            {tableSummary.panic}
                          </p>
                        </div>
                        {/* HARSH BRAKE */}
                        <div className="flex items-center mt-1">
                          <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                            Harsh Brake:&nbsp;
                          </p>
                          <p className="text-[12px] text-[#6A7077] md:text-base">
                            {tableSummary.harsh_break}
                          </p>
                        </div>
                        {/* PARKING EXIT */}
                        <div className="flex items-center mt-1">
                          <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                            Parking Exit:&nbsp;
                          </p>
                          <p className="text-[12px] text-[#6A7077] md:text-base">
                            {tableSummary.parking_exit}
                          </p>
                        </div>
                        {/* FENCE ENTRY */}
                        <div className="flex items-center mt-1">
                          <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                            Fence Entry:&nbsp;
                          </p>
                          <p className="text-[12px] text-[#6A7077] md:text-base">
                            {tableSummary.fence_entry}
                          </p>
                        </div>
                        {/* FENCE EXIST */}
                        <div className="flex items-center mt-1">
                          <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                            Fence Exist:&nbsp;
                          </p>
                          <p className="text-[12px] text-[#6A7077] md:text-base">
                            {tableSummary.fence_exist}
                          </p>
                        </div>
                        {/* TOTAL */}
                        <div className="flex items-center mt-1">
                          <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                            Total:&nbsp;
                          </p>
                          <p className="text-[12px] text-[#6A7077] md:text-base">
                            {tableSummary.total}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* ======== vehicle ======== */}
                    <td
                      className={` px-3 font-bold text-tmvDarkGray hidden md:table-cell`}
                    >
                      {tableSummary.totalVehicle} vehicle
                    </td>

                    {/* ======== Disconnect ======== */}
                    <td
                      className={` px-3 font-bold text-tmvDarkGray hidden md:table-cell`}
                    >
                      {tableSummary.disconnect}
                    </td>
                    {/* ======== Engine On ======== */}
                    <td
                      className={` px-3 font-bold text-tmvDarkGray hidden md:table-cell`}
                    >
                      {tableSummary.engine_on}
                    </td>
                    {/* ======== Engine Off ======== */}
                    <td
                      className={` px-3 font-bold text-tmvDarkGray hidden md:table-cell`}
                    >
                      {tableSummary.engine_off}
                    </td>
                    {/* ======== Panic ======== */}
                    <td
                      className={` px-3 font-bold text-tmvDarkGray hidden md:table-cell`}
                    >
                      {tableSummary.panic}
                    </td>
                    {/* ======== Overspeed ======== */}
                    <td
                      className={` px-3 font-bold text-tmvDarkGray hidden md:table-cell`}
                    >
                      {tableSummary.overspeed}
                    </td>
                    {/* ======== Harsh Brake ======== */}
                    <td
                      className={` px-3 font-bold text-tmvDarkGray hidden md:table-cell`}
                    >
                      {tableSummary.harsh_break}
                    </td>
                    {/* ======== Parking Exit ======== */}
                    <td
                      className={` px-3 font-bold text-tmvDarkGray hidden md:table-cell`}
                    >
                      {tableSummary.parking_exit}
                    </td>
                    {/* ======== Fence Entry ======== */}
                    <td
                      className={` px-3 font-bold text-tmvDarkGray hidden md:table-cell`}
                    >
                      {tableSummary.fence_entry}
                    </td>
                    {/* ======== Fence Exist ======== */}
                    <td
                      className={` px-3 font-bold text-tmvDarkGray hidden md:table-cell`}
                    >
                      {tableSummary.fence_exist}
                    </td>
                    {/* ======== Total ======== */}
                    <td
                      className={` px-3 font-bold text-tmvDarkGray hidden md:table-cell`}
                    >
                      {tableSummary.total}
                    </td>
                    <td
                      className={`rounded-r-[10px] px-3 text-tmvDarkGray hidden md:table-cell`}
                    ></td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertSummaryTable;
