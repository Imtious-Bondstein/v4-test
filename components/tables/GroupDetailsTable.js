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

import CustomToolTip from "../CustomToolTip";
import Link from "next/link";
import ClockSVG from "../SVG/dashboard/ClockSVG";
import LocationSVG from "../SVG/dashboard/LocationSVG";

import LeftArrowPagination from "@/components/SVG/pagination/LeftArrowPaginateSVG";
import RightArrowPaginateSVG from "@/components/SVG/pagination/RightArrowPaginateSVG";
import CreateNewGroupModal from "../modals/CreateNewGroupModal";
import SwitchSVG from "../SVG/SwitchSVG";
import PlusSVG from "../SVG/PlusSVG";
import MoveToGroupModal from "../modals/MoveToGroupModal";
import axios from "@/plugins/axios";
import AddNewVehicleModal from "../modals/AddNewVehicleModal";
import AddNewVehicleGroupModal from "../modals/AddNewVehicleGroupModal";
import { toast } from "react-toastify";
import DeleteTableMobileSVG from "../SVG/table/DeleteTableMobileSVG";
import { handleSelectorVehicleType } from "@/utils/vehicleTypeCheck";

const GroupDetailsTable = ({
  isLoading,
  groupName,
  groupId,
  profileData,
  setProfileData,
  getGroupDetail,
}) => {
  const [isMoveToModal, setIsMoveToModal] = useState(false);
  const [isAddNewVehicleModal, setIsAddNewVehicleModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState([]);

  const [date, setDate] = useState(new Date());
  const [data, setData] = useState([]);

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

    setData(profileData.slice(startIndex, endIndex));
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
  const handleSingleRowSelect = (identifier) => {
    const singleSelectRow = data.find((item) => item.identifier === identifier);
    singleSelectRow.checkbox === true
      ? (singleSelectRow.checkbox = false)
      : (singleSelectRow.checkbox = true);
    setData([...data]);
  };

  // =============== SEARCH FUNCTIONALITY ================
  const handleGroupSearch = (e) => {
    const inputValue = e.target.value.toLowerCase();
    if (!inputValue) {
      const calculatePages = Math.ceil(profileData.length / offset);
      setTotalPages(calculatePages);
      setData(profileData.slice(0, 10));
    } else {
      setCurrentPage(1);
      setTotalPages(1);
      const matchedFence = profileData.filter((matched) =>
        matched.bst_id.toLowerCase().includes(inputValue)
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

  const handleDeleteVehicle = async (rowIdentifier) => {
    const selectedItems = data.filter((item) => item.checkbox === true);
    const vehicleId = rowIdentifier
      ? rowIdentifier
      : selectedItems.map((item) => item.identifier).join(",");

    const requestData = {
      group_id: groupId,
      identifier: vehicleId,
    };

    console.log("requestData : ", requestData);

    if (vehicleId) {
      await axios
        .post(`/api/v4/vehicle-group/remove`, requestData)
        .then((res) => {
          console.log(" delete vehicle res--", res);
          toast.success(res.data.user_message);
          getGroupDetail(groupId);
          setCurrentPage(1);
        })
        .catch((err) => {
          console.log("delete vehicle err : ", err.response);
          if (err.response) {
            toast.error(err.response.data.user_message);
          }
        });
    }
  };

  const addOrMoveVehicleFetch = async (requestData) => {
    console.log("requestData : ", requestData);
    await axios
      .post(`/api/v4/vehicle-group/add-or-move`, requestData)
      .then((res) => {
        console.log(" add Or Move res--", res);
        toast.success(res.data.user_message);
        setIsAddNewVehicleModal(false);
        setIsMoveToModal(false);
        getGroupDetail(groupId);
        setCurrentPage(1);
      })
      .catch((err) => {
        console.log("add Or Move error : ", err.response);
        if (err.response) {
          toast.error(err.response.data.user_message);
        }
      });
  };

  // move to  ---------
  const handleMoveTo = async (groupId) => {
    const selectedItems = data.filter((item) => item.checkbox === true);
    const vehicleId = selectedItems.map((item) => item.identifier).join(",");

    const requestData = {
      group_id: groupId,
      identifier: vehicleId,
    };

    addOrMoveVehicleFetch(requestData);
  };

  // add new vehicle ---------
  const handleAddNewVehicle = async (vehicles) => {
    const vehicleId = vehicles.map((item) => item.value).join(",");

    const requestData = {
      group_id: groupId,
      identifier: vehicleId,
    };

    addOrMoveVehicleFetch(requestData);
  };

  // add new vehicle ---------
  const openMoveToModal = () => {
    const selectedItems = data.filter((item) => item.checkbox === true);
    selectedItems.length && setIsMoveToModal(true);
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
    const calculatePages = Math.ceil(profileData.length / offset);
    setTotalPages(calculatePages);
    setTotalItems(profileData.length);

    setData(
      profileData.slice(0, 10).map((item, index) => ({
        ...item,
        sl: index + 1,
        displayDropdownInfo: false,
      }))
    );
  }, [profileData]);

  return (
    <div className="pb-10">
      <MoveToGroupModal
        setIsMoveToModal={setIsMoveToModal}
        isMoveToModal={isMoveToModal}
        handleMoveTo={handleMoveTo}
        groupId={groupId}
      />

      <AddNewVehicleGroupModal
        isAddNewVehicleModal={isAddNewVehicleModal}
        setIsAddNewVehicleModal={setIsAddNewVehicleModal}
        groupName={groupName}
        groupId={groupId}
        handleAddNewVehicle={handleAddNewVehicle}
      />
      {/* ====== PAGE TITLE ====== */}
      <div className="flex items-center justify-between pb-7 md:pb-7">
        <h1 className="text-primaryText text-xl md:text-[32px] font-bold mt-2 sm:mt-6 md:mt-0 md:pt-5">
          {groupName}
        </h1>
      </div>

      {/* ====== SEARCH-BAR & BUTTONS ====== */}
      <div className="flex flex-col-reverse md:flex-row items-end md:items-center justify-center md:justify-between md:pb-6 -mb-10 md:mb-0 md:space-x-2 lg:space-x-4">
        {/* Search-bar */}
        <div className="relative flex justify-between items-center w-full md:w-[387px] h-[48px] bg-white r rounded-xl -mt-[50px] mb-[50px] md:my-0">
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
        <div className="flex items-end sm:items-center justify-end gap-2 lg:space-x-4 lg:mb-0 relative md:static -top-16 md:-top-20 xl:top-0 mt-1 sm:mt-0">
          <button
            onClick={() => openMoveToModal()}
            className={`fill-primaryText flex items-center justify-center gap-3 text-sm bg-secondary hover:bg-primary text-primaryText rounded-lg w-[32px] h-[32px] sm:w-[42px] md:w-[220px] sm:h-[42px] md:h-[48px] shadow-lg hover:shadow-xl hover:shadow-primary/60 duration-300`}
          >
            <SwitchSVG />
            <p className="hidden md:block">Move to another Group</p>
          </button>
          <button
            onClick={() => setIsAddNewVehicleModal(true)}
            className={`fill-primaryText flex items-center justify-center gap-3 text-sm bg-secondary hover:bg-primary text-primaryText rounded-lg w-[32px] h-[32px] sm:w-[42px] md:w-[175px] sm:h-[42px] md:h-[48px] shadow-lg hover:primary-shadow hover:shadow-xl hover:shadow-primary/60 duration-300`}
          >
            <PlusSVG />
            <p className="hidden md:block">Add new Vehicle</p>
          </button>
          <button
            onClick={() => handleDeleteVehicle()}
            className={`fill-primaryText flex items-center justify-center gap-3 text-sm bg-secondary hover:bg-primary text-primaryText rounded-lg w-[32px] h-[32px] sm:w-[42px] md:w-[125px] sm:h-[42px] md:h-[48px] shadow-lg hover:primary-shadow hover:shadow-xl hover:shadow-primary/60 duration-300`}
          >
            <DeleteSVG />
            <p className="hidden md:block">Delete</p>
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
                <th className="text-left px-3  text-primaryText text-base font-bold ">
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

                {/* ======= BSTID ======= */}
                <th className="text-left  px-3 text-primaryText text-base font-bold hidden md:table-cell">
                  BSTID
                </th>

                {/* ======= Vehicle Group ======= */}
                <th className="text-left  px-3 text-primaryText text-base font-bold hidden md:table-cell">
                  Vehicle Group
                </th>

                {/* =======  Status ======= */}
                <th className="text-left px-3 text-primaryText text-base font-bold hidden md:table-cell">
                  Status
                </th>

                {/* ======= Type ======= */}
                <th className="text-left px-3 text-primaryText text-base font-bold hidden md:table-cell">
                  Type
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
                    identifier,
                    checkbox,
                    bst_id,
                    vrn,
                    vehicle_name,
                    vehicle_status,
                    vehicle_type,
                    group,
                    image,
                    displayDropdownInfo,
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
                        {sl}
                      </td>

                      {/* ======== Checkbox ======== */}
                      <td className="px-3 text-base text-tmvDarkGray hidden md:table-cell">
                        <div className="flex relative">
                          <div
                            onClick={() => handleSingleRowSelect(identifier)}
                            className="w-6 h-6 rounded tmv-shadow bg-white flex justify-center items-center z-10 cursor-pointer"
                          >
                            {checkbox === true ? <Tik /> : ""}
                          </div>
                        </div>
                      </td>

                      {/* ======== bstid ======== */}
                      <td className="px-3 text-base text-tmvDarkGray hidden md:table-cell whitespace-nowrap">
                        {bst_id}
                      </td>

                      {/* ======== vrn	======== */}
                      <td className="px-3 text-base text-left text-tmvDarkGray hidden md:table-cell whitespace-nowrap">
                        {vrn}
                      </td>

                      {/* ========  vehicle_status ======== */}
                      <td className="px-3 text-base text-left text-tmvDarkGray hidden md:table-cell whitespace-nowrap">
                        {vehicle_status}
                      </td>

                      {/* ======== type  ======== */}
                      <td className=" px-3 text-base text-tmvDarkGray hidden md:table-cell whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <img
                            src={
                              image
                                ? image
                                : vehicle_type
                                ? handleSelectorVehicleType(
                                    vehicle_type.toLowerCase()
                                  )
                                : ""
                            }
                            className="w-[35px]"
                            alt=""
                          />
                          <span> {vehicle_type}</span>
                        </div>
                      </td>

                      {/* ========  location ======== */}
                      <td className="px-3 hidden md:table-cell rounded-r-xl">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() => handleDeleteVehicle(identifier)}
                            className="group rounded w-[31px] h-[31px] flex items-center justify-center"
                          >
                            <DeleteTableSVG2 />
                          </button>
                        </div>
                      </td>
                      {/* TABLE DETAILS FOR SMALL SCREEN */}
                      <td
                        className={`md:hidden flex flex-col space-y-2 duration-300 ease-in-out rounded-[10px] md:rounded-none p-3 ${
                          displayDropdownInfo === true
                            ? "h-[200px] xs:h-[180px]"
                            : "h-[25px]"
                        } `}
                      >
                        <div className="flex items-center space-x-3">
                          {/* CHECKBOX */}
                          <div className="flex relative">
                            <div
                              onClick={() => handleSingleRowSelect(identifier)}
                              className="w-5 md:w-6 h-5 md:h-6 rounded tmv-shadow bg-white flex justify-center items-center z-10 cursor-pointer"
                            >
                              {checkbox === true ? <Tik /> : ""}
                            </div>
                          </div>
                          {/* BSTID */}
                          <div
                            onClick={() => handleDropDownData(sl)}
                            className="flex items-center text-tertiaryText text-sm font-bold"
                          >
                            <p>BSTID:&nbsp;</p>
                            <p>{bst_id}</p>
                          </div>
                        </div>

                        {displayDropdownInfo === true ? (
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center text-tertiaryText text-sm font-medium">
                              <p>Vehicle Group:&nbsp;</p>
                              <p>{vrn}</p>
                            </div>
                            <div className="flex items-center text-tertiaryText text-sm font-medium">
                              <p>Status:&nbsp;</p>
                              <p> {vehicle_status}</p>
                            </div>
                            <div className="flex items-center text-tertiaryText text-sm font-medium">
                              <p>Type:&nbsp;</p>
                              <div className="flex items-center space-x-2">
                                <img src={image} className="w-[35px]" />
                                <span> {vehicle_type}</span>
                              </div>
                            </div>
                            <div className="flex items-center text-tertiaryText text-sm font-medium">
                              <p>Actions:&nbsp;</p>
                              <div className="flex items-center justify-center space-x-1">
                                <button
                                  onClick={() =>
                                    handleDeleteVehicle(identifier)
                                  }
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
                      </td>
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

export default GroupDetailsTable;
