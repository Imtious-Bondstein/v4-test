"use client";
import Search from "@/svg/SearchSVG";
import React, { useEffect, useRef, useState } from "react";
import DownloadSVG from "../SVG/DownloadSVG";
import { CSVLink } from "react-csv";
import DeleteSVG from "../SVG/table/DeleteSVG";
import Tik from "@/svg/TikSVG";
import MapTableSVG from "../SVG/table/MapTableSVG";
import CarTableSVG2 from "../SVG/table/CarTableSVG2";
import EditTableSVG from "../SVG/table/EditTableSVG";
import DeleteTableSVG2 from "../SVG/table/DeleteTableSVG2";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Calender from "@/svg/CalenderSVG";
import CustomToolTip from "../CustomToolTip";
import Link from "next/link";
import ClockSVG from "../SVG/dashboard/ClockSVG";
import LocationSVG from "../SVG/dashboard/LocationSVG";

import LeftArrowPagination from "@/components/SVG/pagination/LeftArrowPaginateSVG";
import RightArrowPaginateSVG from "@/components/SVG/pagination/RightArrowPaginateSVG";
import { vehicleDateTime } from "@/utils/dateTimeConverter";

const DeviceDetailsTable = ({ isLoading, deviceDetailsData }) => {
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);

  const [searchData, setSearchData] = useState([]);
  const [isAllRowSelected, setIsAllRowSelected] = useState(false);

  const [clickOutside, setclickOutside] = useState(false);
  const myRef = useRef();

  // ==================================================================================
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

    setData(deviceDetailsData.slice(startIndex, endIndex));
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
    const calculatePages = Math.ceil(deviceDetailsData.length / offset);
    setTotalPages(calculatePages);
    setTotalItems(deviceDetailsData.length);

    setData(
      deviceDetailsData.slice(0, 50).map((item, index) => ({
        ...item,
        sl: index + 1,
        displayDropdownInfo: false,
      }))
    );
    setAllData(deviceDetailsData);
  }, [deviceDetailsData]);

  // SEARCH FUNCTIONALITY ==================================================
  const handleFenceSearch = (e) => {
    const inputValue = e.target.value.toLowerCase();
    if (!inputValue) {
      const calculatePages = Math.ceil(deviceDetailsData.length / offset);
      setTotalPages(calculatePages);
      setData(deviceDetailsData.slice(0, 50));
    } else {
      setCurrentPage(1);
      setTotalPages(1);
      const matchedFence = deviceDetailsData.filter((matched) =>
        matched.bstid.toLowerCase().includes(inputValue)
      );
      setData(matchedFence);
    }
  };

  //=======header for csv
  const headers = [
    { label: "Sl", key: "sl" },
    { label: "BSTID", key: "bstid" },
    { label: "Vehicle Name", key: "vehicleName" },
    { label: "Installed On", key: "installedOn" },
    { label: "Warranty", key: "warranty" },
    { label: "Sim", key: "sim" },
    { label: "Last Seen", key: "last_seen" },
  ];

  // ==== skeleton
  const divCount = 10;
  const skeletonDiv = [];

  for (let i = 0; i < divCount; i++) {
    skeletonDiv.push(
      <div
        key={Math.random()}
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

  useEffect(() => {
    document.addEventListener("mousedown", handelClickOutside);
    return () => document.removeEventListener("mousedown", handelClickOutside);
  });

  return (
    <div className="pb-10">
      {/* ====== PAGE TITLE ====== */}
      <div className="flex items-center justify-between pb-0 md:pb-7">
        <h1 className="text-primaryText text-lg md:text-[32px] font-bold mt-2 md:mt-0 md:pt-5">
          Device Details
        </h1>
      </div>

      {/* ====== SEARCH-BAR & BUTTONS ====== */}
      <div className="flex flex-col-reverse sm:flex-row items-end sm:items-center justify-center sm:justify-between md:pb-6 -mb-10 sm:my-5 md:my-0 sm:space-x-4">
        {/* Search-bar */}
        <div className="relative flex justify-between items-center w-full sm:w-[387px] h-[48px] bg-white r rounded-xl -mt-[50px] mb-[50px] sm:my-0">
          <input
            onChange={(e) => handleFenceSearch(e)}
            className="w-full h-full text-sm text-tmvGray font-normal outline-quaternary rounded-xl px-3"
            type="text"
            placeholder="Search"
          />
          <div className="absolute right-4">
            <Search />
          </div>
        </div>
        {/* ====== Buttons ====== */}
        <div className="flex items-end sm:items-center justify-end gap-2 xs:gap-4 mb-6 sm:mb-0 relative sm:static -top-10 md:-top-16 lg:-top-20 xl:top-0 mt-1.5 xs:mt-0">
          <CSVLink
            data={allData}
            headers={headers}
            filename={"Device Details Table Data.csv"}
          >
            <button
              className={`fill-primaryText flex items-center justify-center gap-3 py-3 sm:py-3.5 px-3 sm:px-4 text-sm bg-primary text-primaryText rounded-lg primary-shadow hover:shadow-xl hover:shadow-primary/60 duration-300`}
            >
              <DownloadSVG />
              <p className="hidden md:block">Export</p>
            </button>
          </CSVLink>
        </div>
      </div>

      {/* ====== TABLE ====== */}
      <div className="rounded-[20px] overflow-hidden ">
        <div className="p-2 sm:p-[15px] overflow-x-auto bg-white  rounded-[20px] h-[65vh]">
          {isLoading ? (
            <div className="w-full">{skeletonDiv}</div>
          ) : (
            <table className="w-full">
              <thead className=" h-[70px] hidden md:table-header-group">
                <tr className="bg-secondary">
                  {/* ======= Sl ======= */}
                  <th className="text-left px-3 text-primaryText text-base font-bold rounded-l-xl ">
                    Sl.
                  </th>

                  {/* ======= BSTID ======= */}
                  <th className="text-left w-[180px] px-3 text-primaryText text-base font-bold  ">
                    BSTID
                  </th>

                  {/* =======  Vehicle Name ======= */}
                  <th className="text-left  px-3 text-primaryText text-base font-bold whitespace-nowrap ">
                    VRN
                  </th>

                  {/* =======  Installed On ======= */}
                  <th className="text-left px-3 text-primaryText text-base font-bold">
                    Installed On
                  </th>

                  {/* ======= Warranty ======= */}
                  <th className="text-left px-3 text-primaryText text-base font-bold">
                    Warranty
                  </th>

                  {/* ======= Sim ======= */}
                  <th className="text-left px-3 text-primaryText text-base font-bold">
                    Sim
                  </th>

                  {/* ======= Last Seen ======= */}
                  <th className="text-left rounded-r-xl px-3 text-primaryText text-base font-bold">
                    Last Seen
                  </th>
                </tr>
              </thead>

              <tbody ref={myRef}>
                {data.map(
                  (
                    {
                      sl,
                      identifier,
                      bstid,
                      vehicleName,
                      installedOn,
                      warranty,
                      sim,
                      last_seen,
                      displayDropdownInfo,
                      vrn,
                    },
                    index
                  ) => {
                    return (
                      <tr
                        key={index}
                        className={`relative h-[50px] md:h-[81px] ${
                          index % 2 === 0 ? "bg-white" : "bg-tableRow"
                        }`}
                      >
                        {/* ======== Sl ======== */}
                        <td className="px-3 text-base text-tmvDarkGray hidden md:table-cell rounded-l-xl ">
                          {sl ? sl : ""}
                        </td>

                        {/* ======== bstid ======== */}
                        <td className="p-3 md:py-0 text-base text-tmvDarkGray whitespace-nowrap hidden md:table-cell">
                          {bstid ? bstid : ""}
                        </td>

                        {/* ======== vehicle Name ======== */}
                        <td className="px-3 text-base text-tmvDarkGray hidden md:table-cell whitespace-nowrap">
                          {vrn ? vrn : ""}
                        </td>

                        {/* ======== installedOn	======== */}
                        <td className="px-3 text-base text-left text-tmvDarkGray hidden md:table-cell whitespace-nowrap">
                          {installedOn ? installedOn : ""}
                        </td>

                        {/* ========  warranty ======== */}
                        <td className="px-3 text-base text-left text-tmvDarkGray hidden md:table-cell whitespace-nowrap">
                          {warranty ? warranty : ""}
                        </td>

                        {/* ======== sim  ======== */}
                        <td className="px-3 text-base text-tmvDarkGray hidden md:table-cell whitespace-nowrap">
                          {sim ? sim : ""}
                        </td>

                        {/* ========  last_seen	 ======== */}
                        <td className="px-3 hidden md:table-cell rounded-r-xl whitespace-nowrap">
                          {last_seen ? vehicleDateTime(last_seen) : ""}
                        </td>
                        {/* TABLE DETAILS FOR SMALL SCREEN */}
                        <td
                          className={`md:hidden flex flex-col space-y-2 duration-300 ease-in-out rounded-[10px] md:rounded-none p-3 ${
                            displayDropdownInfo === true
                              ? "h-[200px]"
                              : "h-[25px]"
                          } `}
                        >
                          <div
                            onClick={() => handleDropDownData(sl)}
                            className="flex items-center text-tertiaryText text-sm font-bold"
                          >
                            <p>BSTID:&nbsp;</p>
                            <p>{bstid}</p>
                          </div>

                          {displayDropdownInfo === true ? (
                            <div className="flex flex-col space-y-2">
                              <div className="flex items-center text-tertiaryText text-sm font-medium">
                                <p>Vehicle Name:&nbsp;</p>
                                <p>{vehicleName}</p>
                              </div>
                              <div className="flex items-center text-tertiaryText text-sm font-medium">
                                <p>Installed On:&nbsp;</p>
                                <p> {installedOn}</p>
                              </div>
                              <div className="flex items-center text-tertiaryText text-sm font-medium">
                                <p>Warranty:&nbsp;</p>
                                <p>{warranty}</p>
                              </div>
                              <div className="flex items-center text-tertiaryText text-sm font-medium">
                                <p>Sim:&nbsp;</p>
                                <p>{sim}</p>
                              </div>
                              <div className="flex items-center text-tertiaryText text-sm font-medium">
                                <p>Last Seen:&nbsp;</p>
                                <p>{last_seen}</p>
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

export default DeviceDetailsTable;
