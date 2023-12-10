import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Search from "@/svg/SearchSVG";
import DownloadSVG from "../SVG/DownloadSVG";
import { CSVLink } from "react-csv";
import DeleteSVG from "../SVG/table/DeleteSVG";
import Tik from "@/svg/TikSVG";
import MapTableSVG from "../SVG/table/MapTableSVG";
import CarTableSVG2 from "../SVG/table/CarTableSVG2";
import EditTableSVG from "../SVG/table/EditTableSVG";
import DeleteTableSVG2 from "../SVG/table/DeleteTableSVG2";
import CustomToolTip from "../CustomToolTip";

import "../../styles/globals.css";
import CarTableMobileSVG from "../SVG/table/CarTableMobileSVG";
import MapTableMobileSVG from "../SVG/table/MapTableMobileSVG";
import EditTableMobileSVG from "../SVG/table/EditTableMobileSVG";
import DeleteTableMobileSVG from "../SVG/table/DeleteTableMobileSVG";
import { convertTimeOnly, notificationTime } from "@/utils/dateTimeConverter";
import axios from "@/plugins/axios";
import { toast } from "react-toastify";
import GeoFenceAssignedVehiclesModal from "../modals/GeoFenceAssignedVehiclesModal";
import { formatAreaName } from "@/utils/areaNames";

const GeoFenceTableRecent = ({
  isLoadingTable,
  fetchGeoFenceTableData,
  geoFenceTableData,
}) => {
  const [data, setData] = useState([]);
  const [isAllRowSelected, setIsAllRowSelected] = useState(false);
  const [assignedVehiclesModalIsOpen, setAssignedVehiclesModalIsOpen] =
    useState(false);

  const [assignedVehicles, setAssignedVehicles] = useState([]);
  const myRef = useRef();

  // const modal open
  const handleAssignedVehicle = (id) => {
    const selectedFence = data.find((item) => item.id === id);
    console.log("selected:", selectedFence);
    setAssignedVehicles(selectedFence.vehicles);
    setAssignedVehiclesModalIsOpen(true);
  };

  const getCsvData = () => {
    const selectedItems = data.filter((item) => item.checkbox);
    return selectedItems;
  };

  // ALL ROW SELECTION ==============================================
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

  // SINGLE ROW SELECTION ==================================================
  const handleSingleRowSelect = (id) => {
    const singleSelectRow = data.find((item) => item.id === id);
    singleSelectRow.checkbox === true
      ? (singleSelectRow.checkbox = false)
      : (singleSelectRow.checkbox = true);
    setData([...data]);
  };

  // SEARCH FUNCTIONALITY ==================================================
  const handleFenceSearch = (e) => {
    const inputValue = e.target.value.toLowerCase();
    if (!inputValue) return setData(geoFenceTableData);

    // Matching Items. [This search bar is case-sensetive(lower-case)]
    const matchedFence = data.filter((matched) =>
      matched.name.toLowerCase().includes(inputValue)
    );
    setData(matchedFence);
  };

  // MULTIPLE FENCE REMOVE FUNCTION ========================================
  const handleMultipleFenceDelete = () => {
    const selectedItems = data.filter((vehicle) => vehicle.checkbox);

    // Create an array to store all the promises from axios.delete
    const deletePromises = selectedItems.map((item) => {
      return axios
        .delete(`/api/v4/virtual-fence/delete/${item.id}`)
        .then((res) => {
          console.log("-- delete multi res--", res.data);
          return res.data; // If you want to return some data from each request
        })
        .catch((err) => {
          console.log("delete multi error : ", err.response);
          throw err; // If you want to propagate the error further
        });
    });

    // Use Promise.all to wait for all promises to resolve
    Promise.all(deletePromises)
      .then((results) => {
        console.log("All delete requests completed successfully!");
        console.log("Results from each request:", results);

        toast.success("Geo fence deleted successfully");
        fetchGeoFenceTableData();
      })
      .catch((err) => {
        toast.success("Error occurred during delete requests");
        console.log("Error occurred during delete requests:", err);
      });
  };

  // SINGLE FENCE DELETE ==============================================
  const handleSingleFenceDelete = async (id) => {
    await axios
      .delete(`/api/v4/virtual-fence/delete/${id}`)
      .then((res) => {
        console.log("-- delete single res--", res.data);
        toast.success(res.data.user_message);
        fetchGeoFenceTableData();
      })
      .catch((err) => {
        console.log("delete single error : ", err.response);
        toast.error(err.response.data.user_message);
      });
  };

  // SINGLE FENCE DELETE ==============================================
  const handleFenceActive = async (id) => {
    await axios
      .get(`/api/v4/virtual-fence/status-update/${id}`)
      .then((res) => {
        console.log("-- Fence Active res--", res.data);
        toast.success(res.data.user_message);

        const singleSelectItem = data.find((item) => item.id === id);
        singleSelectItem.isActive = !singleSelectItem.isActive;
        setData([...data]);
      })
      .catch((err) => {
        console.log("Fence Active error : ", err.response);
        toast.error(err.response?.data?.user_message);
      });
  };

  // CLICK DATA SHOW FOR MOBILE ============================================
  const handleClick = (id) => {
    console.log(id);
    const newState = data.map((fence) => {
      if (fence.id === id) {
        return { ...fence, displayDropdownInfo: !fence.displayDropdownInfo };
      }
      return fence;
    });
    setData(newState);
  };

  // USE-EFFECT =========================
  useEffect(() => {
    const allSelected = data.every((fence) => fence.checkbox);
    allSelected ? setIsAllRowSelected(true) : setIsAllRowSelected(false);
  }, [data]);

  useEffect(() => {
    console.log("table data : ", geoFenceTableData);
    setData(geoFenceTableData);
  }, [geoFenceTableData]);

  // ==== skeleton

  const skeletonDiv = [];

  for (let i = 0; i < 5; i++) {
    skeletonDiv.push(
      <div
        key={i}
        className="h-[80px] w-full border-4 skeleton-border rounded-xl p-2 mt-3"
      >
        <div className="h-full skeleton rounded-xl"></div>
      </div>
    );
  }

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

  return (
    <div className="geofence-table pb-20">
      <GeoFenceAssignedVehiclesModal
        assignedVehiclesModalIsOpen={assignedVehiclesModalIsOpen}
        setAssignedVehiclesModalIsOpen={setAssignedVehiclesModalIsOpen}
        assignedVehicles={assignedVehicles}
      />
      {/* PAGE TITLE */}
      <div className="flex items-center justify-between pb-3 sm:pb-7 md:pb-7">
        <h1 className="text-[#1E1E1E] text-xl md:text-[32px] font-bold md:pt-5">
          Geofence
        </h1>
      </div>

      {/* SEARCH-BAR & BUTTONS */}
      <div className="flex items-center justify-between pb-3 sm:pb-6 space-x-4">
        {/* Search-bar */}
        <div className="flex justify-between items-center w-[387px] h-[42px] sm:h-[48px] bg-white r rounded-xl px-5">
          <input
            onChange={(e) => handleFenceSearch(e)}
            className="w-full h-full text-sm text-[#8D96A1] font-normal outline-none"
            type="text"
            placeholder="Search"
          />
          <Search />
        </div>
        {/* Buttons */}
        <div className="flex items-center space-x-4">
          <CSVLink data={getCsvData()} filename={"Geofence Table Data.csv"}>
            <button
              className={`fill-[#1E1E1E] flex items-center justify-center gap-3 px-4text-sm bg-[#FDD10E] text-[#1E1E1E] rounded-[12px] w-[32px] h-[32px] xs:w-[42px] md:w-[142px] xs:h-[40px] md:h-[48px] primary-shadow`}
            >
              <DownloadSVG />
              <p className="hidden md:block">Export</p>
            </button>
          </CSVLink>
          <button
            onClick={() => handleMultipleFenceDelete()}
            className={`fill-[#1E1E1E] flex items-center justify-center gap-3 px-4text-sm bg-[#FFFAE6] text-[#1E1E1E] rounded-[12px] w-[32px] h-[32px] xs:w-[42px] md:w-[142px] xs:h-[40px] md:h-[48px] shadow-md`}
          >
            <DeleteSVG />
            <p className="hidden md:block">Remove</p>
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-[20px] overflow-hidden pb-10">
        <div className="p-2 sm:p-[15px] overflow-x-auto bg-white  rounded-[20px]">
          {isLoadingTable ? (
            <div className="w-full">{skeletonDiv}</div>
          ) : (
            <table className="md:min-w-[1400px] w-full">
              <thead className="bg-[#FFFAE6] h-[70px] rounded-md">
                <tr className="">
                  {/* SL */}
                  <th className="text-left px-3 rounded-l-[10px] text-[#1E1E1E] text-base font-bold hidden md:table-cell">
                    Sl.
                  </th>

                  {/* CHECKBOX */}
                  <th className="text-left px-3  text-[#1E1E1E] text-base font-bold rounded-l-xl md:rounded-l-none">
                    <div className="flex relative space-x-2">
                      <div
                        onClick={() => clickAllRowSelect()}
                        className="w-5 h-5 md:w-6 md:h-6 rounded tmv-shadow bg-white flex justify-center items-center z-10 cursor-pointer"
                      >
                        {isAllRowSelected === true ? <Tik /> : ""}
                      </div>
                      <p className="pb-0 mb-0 md:hidden">Select All</p> &nbsp;
                    </div>
                  </th>

                  {/* FENCE NAME */}
                  <th className="text-left w-[180px] px-3 text-[#1E1E1E] text-base font-bold hidden md:table-cell">
                    Fence Name
                  </th>

                  {/* AREA NAME*/}
                  <th className="text-left  px-3 text-[#1E1E1E] text-base font-bold hidden md:table-cell">
                    Area Name
                  </th>

                  {/* FROM */}
                  <th className="text-center px-3 text-[#1E1E1E] text-base font-bold hidden md:table-cell">
                    From
                  </th>

                  {/*TO */}
                  <th className="text-center px-3 text-[#1E1E1E] text-base font-bold hidden md:table-cell">
                    To
                  </th>

                  {/* EVENTS */}
                  <th className="text-center px-3 text-[#1E1E1E] text-base font-bold hidden md:table-cell">
                    Events
                  </th>

                  {/* ACTIONS */}
                  <th className="text-left px-3 text-[#1E1E1E] text-base font-bold hidden md:table-cell">
                    Action
                  </th>
                  <th className="rounded-r-[10px] text-left px-3 text-[#1E1E1E] text-base font-bold"></th>
                </tr>
              </thead>

              <tbody ref={myRef} className="rounded-xl">
                {data.map(
                  (
                    {
                      id,
                      sl,
                      name,
                      checkbox,
                      start_time,
                      end_time,
                      areas,
                      event,
                      vehicles,
                      isActive,
                      displayDropdownInfo,
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

                        {/* CHECKBOX */}
                        <td className="px-3 text-base text-[#48525C] hidden md:table-cell">
                          <div className="flex relative">
                            <div
                              onClick={() => handleSingleRowSelect(id)}
                              className="w-6 h-6 rounded tmv-shadow bg-white flex justify-center items-center z-10 cursor-pointer"
                            >
                              {checkbox === true ? <Tik /> : ""}
                            </div>
                          </div>
                        </td>

                        {/* FENCE NAME */}
                        <td className="p-3 md:py-0 text-base text-[#48525C] hidden md:table-cell">
                          {name}
                        </td>

                        {/* AREA NAME */}
                        <td className="px-3 text-base text-[#48525C] hidden md:table-cell">
                          {formatAreaName(areas)}
                        </td>

                        {/* FROM */}
                        <td className="px-3 text-base text-center text-[#48525C] hidden md:table-cell">
                          {convertTimeOnly(start_time)}
                        </td>

                        {/* TO */}
                        <td className="px-3 text-base text-center text-[#48525C] hidden md:table-cell">
                          {convertTimeOnly(end_time)}
                        </td>

                        {/* EVENTS */}
                        <td className="px-3 text-base text-[#48525C] hidden md:table-cell">
                          <div className="flex items-center justify-center gap-1 ">
                            {event.entry.active && (
                              <p className="text-base text-[#1DD1A1] mt-1">
                                Entry
                              </p>
                            )}
                            {event.entry.active && event.exit.active && (
                              <span className="text-xl">&nbsp;|&nbsp;</span>
                            )}
                            {event.exit.active && (
                              <p className="text-base text-[#FF6B6B] mt-1">
                                Exit
                              </p>
                            )}
                          </div>
                        </td>

                        {/* ACTIONS */}
                        <td className="px-3 text-base text-[#48525C] hidden md:table-cell">
                          <div className="flex items-center space-x-4 cursor-pointer">
                            <CustomToolTip
                              id={`map-speed-1`}
                              title={`View assigned vehicles`}
                              containerClass="tooltip default-tooltip group"
                            >
                              <div onClick={() => handleAssignedVehicle(id)}>
                                <CarTableSVG2 />
                              </div>
                            </CustomToolTip>
                            <div className="group">
                              <Link
                                href={`/activity/geo-fence/event?fence=${id}`}
                              >
                                <MapTableSVG />
                              </Link>
                            </div>
                            <div className="group">
                              <Link
                                href={`/activity/geo-fence/update?fence=${id}`}
                              >
                                <EditTableSVG />
                              </Link>
                            </div>
                            <div
                              className="group"
                              onClick={() => handleSingleFenceDelete(id)}
                            >
                              <DeleteTableSVG2 />
                            </div>
                          </div>
                        </td>

                        {/* STATUS */}
                        <td className="rounded-r-[10px] px-3 text-base text-[#48525C] hidden md:table-cell">
                          <button
                            onClick={() => handleFenceActive(id)}
                            className={`${
                              isActive ? "bg-[#FDD10E]" : "bg-[#E7ECF3]"
                            } w-[96px] h-[35px] rounded-lg`}
                          >
                            {isActive ? "Active" : "Inactive"}
                          </button>
                        </td>
                        {/* TABLE DETAILS FOR SMALL SCREEN */}
                        <td
                          className={`p-3 md:hidden flex flex-col space-y-2 duration-300 ease-in-out ${
                            displayDropdownInfo === true
                              ? "  h-[260px]"
                              : "h-[50px]"
                          } `}
                        >
                          <div className="flex items-center space-x-2">
                            {/* CHECKBOX */}
                            <div className="flex relative">
                              <div
                                onClick={() => handleSingleRowSelect(id)}
                                className="w-5 h-5 md:w-6 md:h-6 rounded tmv-shadow bg-white flex justify-center items-center z-10 cursor-pointer"
                              >
                                {checkbox === true ? <Tik /> : ""}
                              </div>
                            </div>
                            {/* FENCE NAME */}
                            <div
                              onClick={() => handleClick(id)}
                              className="flex items-center text-tertiaryText text-sm"
                            >
                              <p className="font-bold md:font-medium">
                                Fence Name:&nbsp;
                              </p>
                              <p className="font-bold md:font-medium">{name}</p>
                            </div>
                          </div>

                          {displayDropdownInfo === true ? (
                            <div className="flex flex-col space-y-2">
                              <div className="flex items-center text-tertiaryText text-sm font-medium">
                                <p>Area Name:&nbsp;</p>
                                <p>{formatAreaName(areas)}</p>
                              </div>
                              <div className="flex items-center text-tertiaryText text-sm font-medium">
                                <p>From:&nbsp;</p>
                                <p> {convertTimeOnly(start_time)}</p>
                              </div>
                              <div className="flex items-center text-tertiaryText text-sm font-medium">
                                <p>To:&nbsp;</p>
                                <p> {convertTimeOnly(end_time)}</p>
                              </div>
                              <div className="flex items-center text-tertiaryText text-sm font-medium">
                                <p>Events:&nbsp;</p>
                                <div className="flex items-center justify-center gap-1 ">
                                  <p className="text-[#1DD1A1]">Entry</p>
                                  <span className="text-sm">&nbsp;|&nbsp;</span>
                                  <p className="text-[#FF6B6B]">Exit</p>
                                </div>
                              </div>
                              <div className="flex items-center text-tertiaryText text-sm font-medium">
                                <p>Action:&nbsp;</p>
                                <div className="flex items-center space-x-4 cursor-pointer">
                                  <CustomToolTip
                                    id={`map-speed-1`}
                                    title={`View assigned vehicles`}
                                    containerClass="tooltip default-tooltip group"
                                  >
                                    <div className="group group-hover:bg-[#FAFAFA] ">
                                      <CarTableMobileSVG />
                                    </div>
                                  </CustomToolTip>
                                  <div className="group">
                                    <MapTableMobileSVG />
                                  </div>
                                  <div className="group">
                                    <EditTableMobileSVG />
                                  </div>
                                  <div
                                    className="group"
                                    onClick={() => handleSingleFenceDelete(id)}
                                  >
                                    <DeleteTableMobileSVG />
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center text-tertiaryText text-sm font-medium">
                                <p>Status:&nbsp;</p>
                                <button
                                  onClick={() => handleFenceActive(id)}
                                  className={`${
                                    isActive ? "bg-[#FDD10E]" : "bg-[#E7ECF3]"
                                  } w-[60px] h-[25px] rounded-lg`}
                                >
                                  {isActive ? "Active" : "Inactive"}
                                </button>
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

      <div className="text-end">
        <Link
          href={`/activity/geo-fence`}
          className="text-tmvDarkGray hover:underline "
        >
          See All
        </Link>
      </div>
    </div>
  );
};

export default GeoFenceTableRecent;
