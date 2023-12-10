"use client";
import Search from "@/svg/SearchSVG";
import React, { useEffect, useRef, useState } from "react";
import DownloadSVG from "../SVG/DownloadSVG";
import { CSVLink } from "react-csv";

import Tik from "@/svg/TikSVG";

import EditTableSVG from "../SVG/table/EditTableSVG";
import DeleteTableSVG2 from "../SVG/table/DeleteTableSVG2";

import Link from "next/link";

import LeftArrowPagination from "@/components/SVG/pagination/LeftArrowPaginateSVG";
import RightArrowPaginateSVG from "@/components/SVG/pagination/RightArrowPaginateSVG";
import CreateNewGroupModal from "../modals/CreateNewGroupModal";
import { toast } from "react-toastify";
import axios from "@/plugins/axios";
import PlusSVG from "../SVG/PlusSVG";
import EditTableMobileSVG from "../SVG/table/EditTableMobileSVG";
import DeleteTableMobileSVG from "../SVG/table/DeleteTableMobileSVG";

const VehicleGroupTable = ({
  isLoading,
  groupData,
  setGroupData,
  fetchGroupData,
}) => {
  const [createGroupModalIsOpen, setCreateGroupModalIsOpen] = useState(false);

  const [date, setDate] = useState(new Date());
  const [data, setData] = useState([]);

  const [searchData, setSearchData] = useState([]);
  const [isAllRowSelected, setIsAllRowSelected] = useState(false);

  // ==================================================================================
  // PAGINATION
  const [offset, setOffset] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [clickOutside, setclickOutside] = useState(false);
  const myRef = useRef();

  // paginate button clicks
  const handlePageClick = (page) => {
    setCurrentPage(page);
    updateData(page);
  };
  // update pagination data
  const updateData = (page) => {
    const startIndex = (page - 1) * offset;
    const endIndex = startIndex + offset;

    setData(groupData.slice(startIndex, endIndex));
  };

  // ===== custom pagination =====
  const visiblePages = 5; //visible pagination buttons

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

  // ALL ROW SELECTION ==============
  const clickAllRowSelect = () => {
    setIsAllRowSelected(!isAllRowSelected);
    const newState = data.map((vehicle) => {
      if (!isAllRowSelected) {
        return { ...vehicle, checkbox: true };
      } else {
        return { ...vehicle, checkbox: false };
      }
    });
    setData(newState);
  };

  // ============ SINGLE ROW SELECTION =================
  const handleSingleRowSelect = (id) => {
    const singleSelectRow = data.find((item) => item.id === id);
    singleSelectRow.checkbox === true
      ? (singleSelectRow.checkbox = false)
      : (singleSelectRow.checkbox = true);
    setData([...data]);
  };

  // =============== SEARCH FUNCTIONALITY ================
  const handleGroupSearch = (e) => {
    const inputValue = e.target.value.toLowerCase();
    if (!inputValue) {
      const calculatePages = Math.ceil(groupData.length / offset);
      setTotalPages(calculatePages);
      setData(groupData.slice(0, 10));
    } else {
      setCurrentPage(1);
      setTotalPages(1);
      const matchedFence = groupData.filter((matched) =>
        matched.group.toLowerCase().includes(inputValue)
      );
      setData(matchedFence);
    }
  };

  // ============ MULTIPLE FENCE REMOVE FUNCTION =========
  const handleMultipleFenceRemove = () => {
    const selectedFence = data.filter((item) => item.checkbox === false);
    setData(selectedFence);
  };

  // ============ SINGLE FENCE DELETE ==============
  const handleSingleFenceDelete = (id) => {
    const singleSelectFence = data.filter((item) => item.id !== id);
    setData(singleSelectFence);
  };

  // ============ STATUS TOGGLE FUNCTIONALITY ============
  const handleStatus = (id) => {
    const singleSelectItem = data.find((item) => item.id === id);
    singleSelectItem.status === true
      ? (singleSelectItem.status = false)
      : (singleSelectItem.status = true);
    setData([...data]);
  };

  // ====== create a new group
  const handleDeleteGroup = async (id) => {
    const requestData = { group_id: id };
    console.log("requestData", requestData);
    await axios
      .post("/api/v4/vehicle-group/delete", requestData)
      .then((res) => {
        console.log("-- delete grp res--", res.data);
        toast.success(res.data.user_message);
        fetchGroupData();
      })
      .catch((err) => {
        console.log("delete grp error : ", err.response);
        toast.error(err.response.data.user_message);
      });
  };

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

  useEffect(() => {
    const allSelected = data.every((vehicle) => vehicle.checkbox);
    allSelected ? setIsAllRowSelected(true) : setIsAllRowSelected(false);

    console.log("-- > data", data);
  }, [data]);

  useEffect(() => {
    const calculatePages = Math.ceil(groupData.length / offset);
    setTotalPages(calculatePages);
    setTotalItems(groupData.length);
    console.log("-- > groupData", groupData);
    setData(
      groupData.slice(0, 10).map((item, index) => ({
        ...item,
        sl: index + 1,
        displayDropdownInfo: false,
      }))
    );
  }, [groupData]);

  return (
    <div className="pb-10">
      <CreateNewGroupModal
        setCreateGroupModalIsOpen={setCreateGroupModalIsOpen}
        createGroupModalIsOpen={createGroupModalIsOpen}
        fetchGroupData={fetchGroupData}
      />
      {/* ====== PAGE TITLE ====== */}
      <div className="flex items-center justify-between pb-7 md:pb-7">
        <h1 className="text-primaryText text-lg md:text-[32px] font-bold mt-2 sm:mt-6 md:mt-0 md:pt-5">
          Vehicle Group
        </h1>
      </div>

      {/* ====== SEARCH-BAR & BUTTONS ====== */}
      <div className="flex flex-col-reverse sm:flex-row items-end sm:items-center justify-center sm:justify-between sm:pb-6 -mb-10 sm:mb-0 sm:gap-4">
        {/* Search-bar */}
        <div className="relative flex justify-between items-center w-full sm:w-[387px] h-[48px] bg-white r rounded-xl -mt-[50px] mb-[50px] sm:my-0">
          <input
            onChange={(e) => handleGroupSearch(e)}
            className="w-full h-full text-sm text-tmvGray font-normal outline-quaternary rounded-xl px-3"
            type="text"
            placeholder="Search"
          />
          <div className="absolute right-4">
            <Search />
          </div>
        </div>

        {/* ====== Buttons ====== */}
        <div className="flex items-end sm:items-center justify-end gap-2 xs:gap-4 lg:mb-0 relative sm:static -top-16 sm:-top-20 xl:top-0 mt-1">
          <button
            onClick={() => setCreateGroupModalIsOpen(true)}
            className={`fill-primaryText flex items-center justify-center gap-3 text-sm bg-primary text-primaryText rounded-lg w-[36px] sm:w-[42px] md:w-[187px] h-[36px] sm:h-[42px] md:h-[48px] primary-shadow hover:shadow-xl hover:shadow-primary/60 duration-300`}
          >
            {/* <DownloadSVG /> */}
            <PlusSVG />
            <p className="hidden md:block">Create New Group</p>
          </button>
        </div>
      </div>

      {/* ====== TABLE ====== */}
      <div className="rounded-[20px] overflow-hidden">
        <div className="p-2 sm:p-[15px] overflow-x-auto bg-white  rounded-[20px] h-[65vh]">
          <table className="w-full">
            <thead className="h-[70px] w-full rounded-md">
              <tr className="bg-secondary">
                {/* ======= Sl ======= */}
                <th className="text-left px-3 text-primaryText text-base font-bold rounded-l-xl hidden md:table-cell">
                  Sl.
                </th>

                {/* ======= Checkbox ======= */}
                <th className="text-left px-3 text-primaryText text-sm font-bold select-none rounded-l-[10px] md:rounded-none">
                  <div className="flex relative items-center">
                    <div
                      onClick={() => clickAllRowSelect()}
                      className="w-6 h-6 rounded tmv-shadow bg-white flex justify-center items-center z-10 cursor-pointer"
                    >
                      {isAllRowSelected === true ? <Tik /> : ""}
                    </div>
                    &nbsp; &nbsp;
                    <p className="pb-0 mb-0 md:hidden">Select All</p>
                  </div>
                </th>

                {/* ======= Vehicle Group ======= */}
                <th className="text-left  px-3 text-primaryText text-base font-bold hidden md:table-cell">
                  Vehicle Group
                </th>

                {/* =======  Total Vehicles ======= */}
                <th className="text-left px-3 text-primaryText text-base font-bold hidden md:table-cell">
                  Total Vehicles
                </th>

                {/* ======= Online ======= */}
                <th className="text-left px-3 text-primaryText text-base font-bold hidden md:table-cell">
                  Online
                </th>

                {/* ======= Offline ======= */}
                <th className="text-left px-3 text-primaryText text-base font-bold hidden md:table-cell">
                  Offline
                </th>

                {/* ===== edit/delete ==== */}
                <th className="text-center px-3 text-primaryText text-base font-bold rounded-r-xl hidden md:table-cell"></th>
              </tr>
            </thead>

            <tbody ref={myRef}>
              {data.map(
                (
                  {
                    sl,
                    id,
                    checkbox,
                    group,
                    t_vehicles,
                    online_vehicles,
                    offline_vehicles,
                    displayDropdownInfo,
                  },
                  index
                ) => {
                  return (
                    <tr
                      key={index}
                      className={`relative h-[48px] md:h-[81px] ${
                        index % 2 === 0 ? "bg-white" : "bg-tableRow"
                      }`}
                    >
                      {/* ======== Sl ======== */}
                      <td className="px-3 text-base text-tmvDarkGray hidden md:table-cell rounded-l-xl ">
                        {sl}
                      </td>

                      {/* ======== Checkbox ======== */}
                      <td className="px-3 text-base text-tmvDarkGray hidden md:table-cell">
                        <div className="flex relative">
                          <div
                            onClick={() => handleSingleRowSelect(id)}
                            className="w-6 h-6 rounded tmv-shadow bg-white flex justify-center items-center z-10 cursor-pointer"
                          >
                            {checkbox === true ? <Tik /> : ""}
                          </div>
                        </div>
                      </td>

                      {/* ======== group ======== */}
                      <td className="px-3 text-base text-tmvDarkGray hidden md:table-cell whitespace-nowrap">
                        {group}
                      </td>

                      {/* ======== t_vehicles	======== */}
                      <td className="px-3 text-base text-left text-tmvDarkGray hidden md:table-cell whitespace-nowrap">
                        {t_vehicles}
                      </td>

                      {/* ========  online_vehicles ======== */}
                      <td className="px-3 text-base text-left text-tmvDarkGray hidden md:table-cell whitespace-nowrap">
                        {online_vehicles}
                      </td>

                      {/* ======== offline_vehicles  ======== */}
                      <td className="px-3 text-base text-tmvDarkGray hidden md:table-cell whitespace-nowrap">
                        {offline_vehicles}
                      </td>

                      {/* ========  location ======== */}
                      <td className="px-3 hidden md:table-cell rounded-r-xl">
                        <div className="flex items-center justify-center space-x-1">
                          <Link
                            href={`/support/vehicle-group/id=${id}`}
                            id={`vehicle-group-${id}`}
                            className="group rounded w-[31px] h-[31px] flex items-center justify-center"
                          >
                            <EditTableSVG />
                          </Link>
                          <button
                            onClick={() => handleDeleteGroup(id)}
                            className="group rounded w-[31px] h-[31px] flex items-center justify-center"
                          >
                            <DeleteTableSVG2 />
                          </button>
                        </div>
                      </td>
                      {/* TABLE DETAILS FOR SMALL SCREEN */}
                      <div
                        className={`md:hidden flex flex-col space-y-2 duration-300 ease-in-out rounded-[10px] md:rounded-none p-3 ${
                          displayDropdownInfo === true
                            ? "h-[160px]"
                            : "h-[25px]"
                        } `}
                      >
                        <div className="flex items-center space-x-3">
                          {/* CHECKBOX */}
                          <div className="flex relative">
                            <div
                              onClick={() => handleSingleRowSelect(id)}
                              className="w-5 md:w-6 h-5 md:h-6 rounded tmv-shadow bg-white flex justify-center items-center z-10 cursor-pointer"
                            >
                              {checkbox === true ? <Tik /> : ""}
                            </div>
                          </div>
                          {/* GROUP */}
                          <div
                            onClick={() => handleDropDownData(sl)}
                            className="flex items-center text-tertiaryText text-sm font-bold"
                          >
                            <p>Vehicle Group:&nbsp;</p>
                            <p>{group}</p>
                          </div>
                        </div>

                        {displayDropdownInfo === true ? (
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center text-tertiaryText text-sm font-medium">
                              <p>Total Vehicles:&nbsp;</p>
                              <p>{t_vehicles}</p>
                            </div>
                            <div className="flex items-center text-tertiaryText text-sm font-medium">
                              <p>Online:&nbsp;</p>
                              <p> {online_vehicles}</p>
                            </div>
                            <div className="flex items-center text-tertiaryText text-sm font-medium">
                              <p>Offline:&nbsp;</p>
                              <p>{offline_vehicles}</p>
                            </div>
                            <div className="flex items-center text-tertiaryText text-sm font-medium">
                              <p>Actions:&nbsp;</p>
                              <div className="flex items-center justify-center space-x-1">
                                <Link
                                  href={`/support/vehicle-group/id=${id}`}
                                  id={`vehicle-group-${id}`}
                                  className="group rounded w-[31px] h-[31px] flex items-center justify-center"
                                >
                                  <EditTableMobileSVG />
                                </Link>
                                <button
                                  onClick={() => handleDeleteGroup(id)}
                                  className="group rounded w-[31px] h-[31px] flex items-center justify-center"
                                >
                                  <DeleteTableMobileSVG />
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </tr>
                  );
                }
              )}
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

      {/* ====== PAGINATION ====== */}
      <div className="pagination flex items-center justify-center md:justify-between pb-6">
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
              {[2, 5, 10, 20, 30, 40, 50, 75, 100].map((pageNumber) => (
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

export default VehicleGroupTable;
