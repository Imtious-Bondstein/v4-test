"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

// ===== toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ==== SVG
import PrinterSVG from "../SVG/PrinterSVG";
import MapTableSVG from "../SVG/table/MapTableSVG";

// ===== pdf
import { useReactToPrint } from "react-to-print";
import PrintLocationReportTable from "../printTables/PrintLocationReportTable";

// ===== css
import "../../styles/components/printPortraitTable.css";
import MapTableMobileSVG from "../SVG/table/MapTableMobileSVG";
import DownloadSVG from "../SVG/DownloadSVG";
import SpinSVG from "../SVG/SpinSVG";
import axios from "@/plugins/axios";
import { getYearMonthDay } from "@/utils/dateTimeConverter";
import LeftArrowPagination from "../SVG/pagination/LeftArrowPaginateSVG";
import RightArrowPaginateSVG from "../SVG/pagination/RightArrowPaginateSVG";
const LocationReportTable = ({
  selectedVehicles,
  isLoading,
  selectedIdentifier,
  dateRange,
  setDateRange,
  interval,
  fetched,
}) => {
  const componentRef = useRef();

  const [data, setData] = useState([]);
  const [clickOutside, setclickOutside] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // PAGINATION
  const [offset, setOffset] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // paginate button clicks
  const handlePageClick = (page) => {
    setCurrentPage(page);
    updateData(page);
  };
  // update pagination data
  const updateData = (page) => {
    const startIndex = (page - 1) * offset;
    const endIndex = startIndex + offset;

    setData(selectedVehicles.slice(startIndex, endIndex));
  };

  // ===== custom pagination =====
  const visiblePages = 3; //visible pagination buttons

  // Calculate range of visible page numbers
  const rangeStart = Math.max(currentPage - Math.floor(visiblePages / 2), 1);
  const rangeEnd = Math.min(rangeStart + visiblePages - 1, totalPages);

  // Generate page numbers to display
  const pages = [];
  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i);
  }

  // update if visible rows changes
  useEffect(() => {
    setCurrentPage(1);
    setOffset(offset);

    const calculatePages = Math.ceil(totalItems / offset);
    setTotalPages(calculatePages);
    updateData(1);
  }, [offset]);

  useEffect(() => {
    const calculatePages = Math.ceil(selectedVehicles.length / offset);
    setTotalPages(calculatePages);
    setTotalItems(selectedVehicles.length);

    setData(
      selectedVehicles.slice(0, offset).map((item, index) => ({
        ...item,
        sl: index + 1,
        displayDropdownInfo: false,
      }))
    );
    // setAllData(selectedVehicles);
  }, [selectedVehicles]);

  // ========== handle time picker ========
  const handleStartTime = (date, fieldName) => {
    if (fieldName === "date") {
      setDateRange({
        ...dateRange,
        date: date,
      });
    } else if (fieldName === "endDate") {
      setDateRange({
        ...dateRange,
        endDate: date,
      });
    }
  };

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

  const handleDownloadFile = (dataUrl) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    // link.download = filename;
    link.click();
  };

  const handleExport = async () => {
    setIsExporting(true);
    const data = {
      identifier: selectedIdentifier.current.v_identifier,
      start_date: getYearMonthDay(dateRange.date),
      end_date: getYearMonthDay(dateRange.endDate),
      interval: parseInt(interval),
    };
    console.log("request data", data);
    await axios
      .post("/api/v4/report/location-report-export", data)
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

  return (
    <div className="md:pt-6">
      {/*  ==== Table name and buttons  ====  */}
      <div className="flex items-center justify-between pb-6">
        <h1 className="text-primaryText text-lg md:text-[32px] font-bold ">
          Location Report
        </h1>

        {/* ====== Buttons ====== */}
        <div className="flex items-end lg:items-center justify-end sm:space-x-2 xs:gap-4 mr-10 lg:mr-0">
          <div>
            <button
              onClick={handlePrintTable}
              className={` flex items-center justify-center gap-3  text-sm bg-white text-tertiaryText  rounded-lg w-[32px] h-[32px] xs:w-[42px] md:w-[110px] xs:h-[42px] md:h-[48px] shadow-md hover:shadow-xl fill-[#8D96A1] mr-5 lg:mr-0`}
            >
              <PrinterSVG />
              <p className="hidden md:block">Print</p>
            </button>
            {/* ==== table for print ===  */}
            <PrintLocationReportTable data={data} componentRef={componentRef} />
          </div>

          <button
            onClick={handleExport}
            disabled={!selectedVehicles.length}
            className={`fill-primaryText flex items-center justify-center gap-3 text-sm bg-primary text-primaryText rounded-lg w-[32px] xs:w-[42px] md:w-[110px] h-[32px] xs:h-[42px] md:h-[48px] primary-shadow hover:shadow-xl hover:shadow-primary/60 duration-300 ${
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

      {/* ===== table ====  */}
      <div className=" ">
        <div className="p-[15px]  bg-white overflow-x-auto h-[75vh] relative rounded-[20px]">
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
            <table className="md:min-w-[1400px] w-full">
              {fetched === true && data.length > 0 ? (
                <thead className="bg-[#FFFAE6] h-[70px] rounded-md hidden md:table-header-group">
                  <tr className="">
                    {/* SL */}
                    <th className="text-left px-3 rounded-l-[10px] text-[#1E1E1E] text-base font-bold">
                      Sl.
                    </th>

                    {/* CHECKBOX */}
                    <th className="text-left px-3  text-[#1E1E1E] text-base font-bold ">
                      Vehicle
                    </th>

                    {/* FENCE NAME */}
                    <th className="text-left w-[180px] px-3 text-[#1E1E1E] text-base font-bold  ">
                      Date
                    </th>

                    {/* AREA NAME*/}
                    <th className="text-left  px-3 text-[#1E1E1E] text-base font-bold ">
                      Clock Time
                    </th>

                    {/* FROM */}
                    <th className="text-left px-3 text-[#1E1E1E] text-base font-bold">
                      Device Time
                    </th>

                    {/*TO */}
                    <th className="text-left px-3 text-[#1E1E1E] text-base font-bold">
                      Near By
                    </th>

                    {/* EVENTS */}
                    <th className="text-left px-3 text-[#1E1E1E] text-base font-bold">
                      Speed (Km/h)
                    </th>

                    <th className="text-left px-3 text-[#1E1E1E] text-base font-bold">
                      Location
                    </th>
                  </tr>
                </thead>
              ) : (
                ""
              )}
              <tbody className="rounded-xl">
                {data.map(
                  (
                    {
                      sl,
                      vehicle_name,
                      date,
                      clock_time,
                      device_time,
                      landmark,
                      landmark_distance,
                      speed,
                      latitude,
                      longitude,
                      displayDropdownInfo,
                      vrn,
                    },
                    index
                  ) => {
                    return (
                      <tr
                        key={index}
                        className={`relative rounded-xl h-[20px] md:h-[81px] ${
                          index % 2 === 0 ? "bg-white" : "bg-[#F8FBFF]"
                        }`}
                      >
                        {/* SL */}
                        <td className="rounded-l-[10px] px-3 text-base text-[#48525C] hidden md:table-cell">
                          {sl}
                        </td>

                        {/* Vehicle */}
                        <td className="px-3 text-base text-[#48525C] hidden md:table-cell">
                          {vrn}
                        </td>

                        {/* Date */}
                        <td className="p-3 md:py-0 text-base text-[#48525C] hidden md:table-cell">
                          {date}
                        </td>

                        {/* 	Clock Time */}
                        <td className="px-3 text-base text-[#48525C] hidden md:table-cell">
                          {clock_time}
                        </td>

                        {/* Device Time	 */}
                        <td className="px-3 text-base  text-[#48525C] hidden md:table-cell">
                          {device_time}
                        </td>

                        {/* Near By	 */}
                        <td className="px-3 text-base  text-[#48525C] hidden md:table-cell max-w-[200px]">
                          {landmark} ({landmark_distance} km)
                        </td>

                        {/* Speed (Km/h) */}
                        <td className="px-3 text-base text-[#48525C] hidden md:table-cell">
                          {speed} KM
                        </td>

                        {/* ACTIONS */}
                        <td className="px-3 text-base text-[#48525C] hidden md:table-cell">
                          <Link
                            href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
                            target="_blank"
                            className="group hover:bg-white hover:tmv-shadow rounded w-[31px] h-[31px] flex items-center justify-center cursor-pointer"
                          >
                            <MapTableSVG />
                          </Link>
                        </td>

                        {/* TABLE DETAILS FOR SMALL SCREEN */}
                        <td
                          onClick={() => handleDropDownData(sl)}
                          className={`p-3 md:hidden flex flex-col space-y-2 duration-300 ease-in-out rounded-[20px] md:rounded-none ${
                            displayDropdownInfo === true
                              ? "h-[285px] sm:h-[220px]"
                              : "h-[50px]"
                          } `}
                        >
                          <div className="flex items-center text-tertiaryText text-sm font-bold">
                            <p>Vehicle:&nbsp;</p>
                            <p> {vrn}</p>
                          </div>
                          {displayDropdownInfo === true ? (
                            <div className="flex flex-col space-y-2">
                              <div className="flex items-center text-tertiaryText text-sm font-medium">
                                <p>Date:&nbsp;</p>
                                <p>{date}</p>
                              </div>
                              <div className="flex items-center text-tertiaryText text-sm font-medium">
                                <p>Clock Time:&nbsp;</p>
                                <p>{clock_time}</p>
                              </div>
                              <div className="flex items-center text-tertiaryText text-sm font-medium">
                                <p>Device Time:&nbsp;</p>
                                <p>{device_time}</p>
                              </div>
                              <div className="flex items-center text-tertiaryText text-sm font-medium">
                                <p>Near By:&nbsp;</p>
                                <p>
                                  {landmark} ({landmark_distance} km)
                                </p>
                              </div>
                              <div className="flex items-center text-tertiaryText text-sm font-medium">
                                <p>Speed (Km/h):&nbsp;</p>
                                <p>{speed} KM</p>
                              </div>
                              <div className="flex items-center text-tertiaryText text-sm font-medium m-0">
                                <p>Location:&nbsp;</p>
                                <Link
                                  href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
                                  target="_blank"
                                  className="group hover:bg-white hover:tmv-shadow rounded w-[31px] h-[31px] flex items-center justify-center cursor-pointer"
                                >
                                  <MapTableMobileSVG />
                                </Link>
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
          {fetched === true && data.length <= 0 && isLoading === false ? (
            <p className="w-full h-full flex justify-center items-center text-primaryText text-center">
              Not Sufficient Data to Render.
            </p>
          ) : data.length <= 0 && isLoading === false ? (
            <p className="w-full h-full flex justify-center items-center text-primaryText text-center">
              Please Select A Vehicle
            </p>
          ) : (
            ""
          )}
        </div>
      </div>

      {/* ====== PAGINATION ====== */}
      <div className="pagination flex items-center justify-center md:justify-between py-6">
        <div className="hidden md:flex items-center gap-4">
          <div>
            <label className="text-[#48525C] mr-2">Rows visible</label>
            <select
              value={offset}
              onChange={(e) => {
                setOffset(Number(e.target.value));
              }}
              className="p-[10px] rounded-md text-[#48525C] text-sm w-[65px] outline-quaternary"
            >
              {[5, 10, 20, 30, 40, 50, 75, 100].map((pageNumber) => (
                <option key={pageNumber} value={pageNumber}>
                  {pageNumber}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className="text-[#48525C]">
              Showing {currentPage} of {totalPages}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 my-3">
          <ul className="pagination flex items-center gap-2">
            <li
              className="rounded-lg w-10 h-10 flex items-center justify-center bg-white dark-shadow hover:bg-[#FDD10E] hover:primary-shadow cursor-pointer"
              onClick={() =>
                currentPage > 1 && handlePageClick(currentPage - 1)
              }
            >
              <LeftArrowPagination />
            </li>
            {/*  before dots  */}
            {rangeStart >= 2 && (
              <>
                <li
                  className="rounded-lg w-10 h-10 flex items-center justify-center bg-white disabled cursor-pointer hover:bg-[#FDD10E] hover:primary-shadow"
                  onClick={() => handlePageClick(1)}
                >
                  1
                </li>
                {currentPage > 4 && (
                  <li className="rounded-lg w-10 h-10 flex items-center justify-center bg-white disabled">
                    ...
                  </li>
                )}
              </>
            )}
            {/* Generate page buttons */}
            {pages.map((page) => (
              <li
                key={page}
                className={`rounded-lg w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-[#FDD10E] hover:primary-shadow ${
                  page === currentPage
                    ? " bg-[#FDD10E] primary-shadow"
                    : "bg-white dark-shadow"
                }`}
                onClick={() => handlePageClick(page)}
              >
                {page}
              </li>
            ))}
            {/* after dots  */}
            {rangeEnd < totalPages && (
              <>
                {totalPages - currentPage > 3 && (
                  <li className="rounded-lg w-10 h-10 flex items-center justify-center bg-white disabled">
                    ...
                  </li>
                )}
                <li
                  className="rounded-lg w-10 h-10 flex items-center justify-center bg-white cursor-pointer hover:bg-[#FDD10E] hover:primary-shadow"
                  onClick={() => handlePageClick(totalPages)}
                >
                  {totalPages}
                </li>
              </>
            )}

            <li
              className="cursor-pointer rounded-lg w-10 h-10 flex items-center justify-center bg-white dark-shadow hover:bg-[#FDD10E] hover:primary-shadow"
              onClick={() =>
                currentPage < totalPages && handlePageClick(currentPage + 1)
              }
            >
              <RightArrowPaginateSVG />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LocationReportTable;
