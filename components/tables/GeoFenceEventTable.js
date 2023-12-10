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

import Select from "react-select";

// ====== store =======
import { fetchVehicleLists } from "@/store/slices/vehicleSlice";
import { useDispatch, useSelector } from "react-redux";
import { getYearMonthDay } from "@/utils/dateTimeConverter";
import { useRouter } from "next/router";

const GeoFenceEventTable = ({
  isLoading,
  tableData,
  selectedIdentifier,
  setSelectedIdentifier,
  fenceData,
  setFencedata,
  dateRange,
  setDateRange,
}) => {
  const [date, setDate] = useState(new Date());
  const [data, setData] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [isVehicleListLoading, setIsVehicleListLoading] = useState(true);
  const isDispatched = useRef(false);

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicleOptions, setVehicleOptions] = useState([]);
  const [fenceOptions, setFenceOptions] = useState([]);

  const [searchData, setSearchData] = useState([]);
  const [isAllRowSelected, setIsAllRowSelected] = useState(false);
  const [singleSelectedFence, setSingleSelectedFence] = useState({});

  const router = useRouter();
  const myRef = useRef();

  // =========store========
  const dispatch = useDispatch();
  const { storeVehicleLists, isStoreLoading } = useSelector(
    (state) => state.reducer.vehicle
  );

  const { fence } = router.query;

  // HEADERS FOR CSV ===========================================
  const headers = [
    { label: "BSTID", key: "bst_id" },
    { label: "Vehicle Name", key: "vehicle_name" },
    { label: "Into Location", key: "into" },
    { label: "From Location", key: "from" },
    { label: "Notified", key: "is_read" },
    { label: "Date Time", key: "date" },
    { label: "Latitude", key: "lat" },
    { label: "Longitude", key: "lng" },
  ];

  // ALL ROW SELECTION ==============================================
  const clickAllRowSelect = () => {
    setIsAllRowSelected(!isAllRowSelected);
    const newState = data.map((vehicle) => {
      if (!isAllRowSelected) {
        setExportData(tableData);
        return { ...vehicle, checkbox: true };
      } else {
        setExportData([]);
        return { ...vehicle, checkbox: false };
      }
    });
    setData(newState);
  };

  //=======select style
  const commonSelectStyles = {
    control: (provided, { isFocused }) => ({
      ...provided,
      backgroundColor: "#F8F8FA",
      border: 0,
      padding: "5px 0",
      borderRadius: "8px",
      borderColor: isFocused ? "#f36b24" : "",
      boxShadow: isFocused ? "0 0 0 1.5px #f36b24" : "",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#8D96A1",
      fontSize: "14px",
      fontWeight: 600,
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#8D96A1",
      fontSize: "14px",
      fontWeight: 600,
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: "230px",
      overflowY: "auto",
      width: "100%",
      zIndex: "40",
      overflowX: "hidden",
      padding: "5px",
    }),
    option: (provided, { isFocused }) => {
      return {
        ...provided,
        backgroundColor: isFocused ? "#94e5ff" : "",
        color: "black",
        overflow: "hidden",
        borderRadius: "8px",
      };
    },
  };

  const handleVehicleSelect = (selectedOption) => {
    setSelectedVehicle(selectedOption);
    setSelectedIdentifier(selectedOption.value);
    console.log("Vehicle Select", selectedOption.value);
  };

  const handleSelectedFence = (fence) => {
    const fenceID = parseFloat(fence);
    const selectedFenceData = fenceOptions.find(
      (item) => item.geo_fence_setting_id === fenceID
    );
    setSingleSelectedFence(selectedFenceData);
  };

  useEffect(() => {
    const allSelected = data.every((vehicle) => vehicle.checkbox);
    allSelected ? setIsAllRowSelected(true) : setIsAllRowSelected(false);

    console.log("-- > data", data);
  }, [data]);

  useEffect(() => {
    handleSelectedFence(fence);
  }, [fenceOptions, fence]);

  // useEffect(() => {
  //   const calculatePages = Math.ceil(tableData.length / offset);
  //   setTotalPages(calculatePages);
  //   setTotalItems(tableData.length);

  //   setData(tableData.slice(0, 10));
  // }, [tableData]);

  // SINGLE ROW SELECTION ==================================================
  const handleSingleRowSelect = (sl) => {
    const singleSelectRow = data?.find((item) => item.sl === sl);
    singleSelectRow.checkbox === true
      ? (singleSelectRow.checkbox = false)
      : (singleSelectRow.checkbox = true);
    setData([...data]);
    // SINGLE SELECTED DATA FOR EXPORT ======================================
    const selectedData = data?.find((items) => items.sl === sl);
    setExportData([...exportData, selectedData]);
  };

  // SEARCH FUNCTIONALITY ==================================================
  const handleFenceSearch = (e) => {
    const inputValue = e.target.value.toLowerCase();
    if (!inputValue) {
      const calculatePages = Math.ceil(tableData.length / offset);
      setTotalPages(calculatePages);
      setData(tableData.slice(0, 10));
    } else {
      setCurrentPage(1);
      setTotalPages(1);
      const matchedFence = tableData.filter((matched) =>
        matched.bst_id.toLowerCase().includes(inputValue)
      );
      setData(matchedFence);
    }
  };

  useEffect(() => {
    if (!storeVehicleLists && !isStoreLoading && !isDispatched.current) {
      isDispatched.current = true;
      dispatch(fetchVehicleLists());
    }
    if (!isStoreLoading && storeVehicleLists) {
      // setVehicleOptions(JSON.parse(JSON.stringify(storeVehicleLists)));
      let newVehicleOptions = [];
      const allVehiclesArray = storeVehicleLists.flatMap(
        (group) => group.vehicles
      );
      allVehiclesArray.forEach((element) => {
        const obj = {
          value: element.v_identifier,
          label: element.bst_id + " " + element.v_vrn,
        };
        newVehicleOptions.push(obj);
      });
      setVehicleOptions(newVehicleOptions);
      setIsVehicleListLoading(isStoreLoading);
    }
  }, [isStoreLoading]);

  useEffect(() => {
    setFenceOptions(
      fenceData.map((item, index) => ({
        ...item,
        value: item.geo_fence_setting_id,
        label: item.name,
      }))
    );
  }, [fenceData]);

  // MULTIPLE FENCE REMOVE FUNCTION ========================================
  const handleMultipleFenceRemove = () => {
    const selectedFence = data.filter((item) => item.checkbox === false);
    setData(selectedFence);
  };

  // SINGLE FENCE DELETE ==================================================
  const handleSingleFenceDelete = (id) => {
    const singleSelectFence = data.filter((item) => item.id !== id);
    setData(singleSelectFence);
  };

  // STATUS TOGGLE FUNCTIONALITY ===========================================
  const handleStatus = (id) => {
    const singleSelectItem = data.find((item) => item.id === id);
    singleSelectItem.status === true
      ? (singleSelectItem.status = false)
      : (singleSelectItem.status = true);
    setData([...data]);
  };

  const handleTimeSelect = (date, fieldName) => {
    if (fieldName === "date") {
      setDateRange({
        ...dateRange,
        date: date,
      });
    }
    setSelectedIdentifier(selectedIdentifier);

    console.log(fieldName, "==== date ====", date);
  };

  // ===== format vehicle list for dropdown ====
  // useEffect(() => {
  //   if (storeVehicleLists) {
  //     let newVehicleOptions = [];
  //     const allVehiclesArray = storeVehicleLists.flatMap(
  //       (group) => group.vehicles
  //     );
  //     allVehiclesArray.forEach((element) => {
  //       const obj = {
  //         value: element.v_identifier,
  //         label: element.bst_id + " " + element.v_vrn,
  //       };
  //       newVehicleOptions.push(obj);
  //     });
  //     setVehicleOptions(newVehicleOptions);
  //     console.log("flat-storeVehicleLists", allVehiclesArray);
  //   }
  // }, [storeVehicleLists]);
  //======get data from store========
  // useEffect(() => {
  //   if (!storeVehicleLists && !isStoreLoading && !isDispatched.current) {
  //     isDispatched.current = true;
  //     dispatch(fetchVehicleLists());
  //   }
  //   if (!isStoreLoading && storeVehicleLists) {
  //     // setVehicleOptions(JSON.parse(JSON.stringify(storeVehicleLists)));
  //     let newVehicleOptions = [];
  //     const allVehiclesArray = storeVehicleLists.flatMap(
  //       (group) => group.vehicles
  //     );
  //     allVehiclesArray.forEach((element) => {
  //       const obj = {
  //         value: element.v_identifier,
  //         label: element.bst_id + " " + element.v_vrn,
  //       };
  //       newVehicleOptions.push(obj);
  //     });
  //     setVehicleOptions(newVehicleOptions);
  //     setIsVehicleListLoading(isStoreLoading);
  //   }
  // }, [isStoreLoading]);

  // CLICK DATA SHOW FOR MOBILE ============================================
  const handleClick = (sl) => {
    console.log(sl);
    const newState = data.map((fence) => {
      if (fence.sl === sl) {
        return { ...fence, displayDropdownInfo: !fence.displayDropdownInfo };
      }
      return fence;
    });
    setData(newState);
  };

  // CLICK OUTSIDE =========================================================
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

  // USEEFFECT =============================================================
  useEffect(() => {
    console.log(data, "fetched");
    setData(
      tableData.map((item, index) => ({
        ...item,
        sl: index + 1,
        checkbox: false,
        displayDropdownInfo: false,
      }))
    );
  }, [tableData]);

  return (
    <div className="pb-10">
      {/* ====== PAGE TITLE ====== */}
      <div className="flex items-center justify-between pb-0 md:-pb-5 lg:pb-5">
        <h1 className="text-primaryText text-xl md:text-[32px] font-bold mt-6 md:mt-0 md:pt-5">
          Geofence Events
        </h1>
      </div>

      {/* ====== SEARCH-BAR & BUTTONS ====== */}
      <div className="flex items-center lg:items-baseline justify-between lg:pb-6 lg:mb-0 lg:gap-4 mb-5 md:-mb-5 w-full">
        {/* Search-bar */}
        {/* <div className="flex justify-between items-center w-[387px] h-[56px] bg-white r rounded-xl px-5">
          <input
            onChange={(e) => handleFenceSearch(e)}
            className="w-full h-full text-sm text-tmvGray font-normal outline-none"
            type="text"
            placeholder="Search"
          />
          <Search />
        </div> */}
        <div className="flex flex-col md:flex-row md:space-x-4 mt-5 md:mt-0 space-y-3 md:space-y-0 w-full">
          <div className="flex justify-between space-x-2 md:space-x-4">
            <Select
              id="vehicle"
              onChange={handleVehicleSelect}
              options={vehicleOptions}
              // value={selectedVehicle}
              placeholder="Select Vehicle"
              styles={commonSelectStyles}
              className="shadow-md w-1/2 md:w-[250px] rounded-xl geofence-select"
            />
            <Select
              id="vehicle"
              onChange={handleVehicleSelect}
              options={fenceOptions}
              placeholder={
                singleSelectedFence ? singleSelectedFence.name : "Select Fence"
              }
              styles={commonSelectStyles}
              className="shadow-md w-1/2 md:w-[250px] rounded-xl geofence-select"
            />
          </div>
          <div className="flex justify-between items-center space-x-3">
            <div className="relative shadow-md rounded-xl w-full flex items-center bg-white">
              <div className="w-full h-[45px] flex items-center rounded-md outline-quaternary">
                <DatePicker
                  selected={dateRange.date}
                  onChange={(date) => handleTimeSelect(date, "date")}
                  dateFormat="dd/MM/yyyy"
                  className="w-full md:w-[150px] h-[45px] p-2 z-40  outline-quaternary rounded-xl"
                  // placeholderText="Date"
                  placeholderText={getYearMonthDay(dateRange.date)}
                />
              </div>
              <div className="absolute right-2 top-3.5">
                <Calender />
              </div>
            </div>
          </div>
        </div>
        {/* ====== Buttons ====== */}
        <div className="flex items-end lg:items-center justify-end gap-2 xs:gap-4 mb-16 sm:mb-20 lg:mb-0 -ml-20 relative lg:static -top-8 md:-top-10 lg:-top-20 xl:top-0 mt-1.5 xs:mt-0">
          <CSVLink
            headers={headers}
            data={
              exportData.length > 0
                ? exportData.map((item) => ({
                    ...item,
                    bst_id: item.bst_id,
                    checkbox: item.checkbox,
                    vehicleName: item.vehicle_name,
                    date: item.date,
                    from: item.form,
                    to: item.to,
                    is_read: item.is_read,
                    lat: item.lat,
                    lng: item.lng,
                  }))
                : ""
            }
          >
            <button
              className={`fill-primaryText flex items-center justify-center gap-3 px-4 text-sm bg-primary text-primaryText rounded-[12px] w-[42px] md:w-[120px] h-[42px] md:h-[48px] primary-shadow -mt-5 sm:mt-0`}
            >
              <DownloadSVG />
              <p className="hidden md:block">Export</p>
            </button>
          </CSVLink>
        </div>
      </div>

      {/* ====== TABLE ====== */}
      <div className="rounded-[20px] overflow-hidden">
        <div className="p-2 sm:p-[15px] overflow-x-auto bg-white  rounded-[20px] h-[65vh]">
          {isLoading ? (
            <div className="w-full">
              <div className="h-[80px] w-full border-4 skeleton-border rounded-xl p-2 mt-3">
                <div className="h-full skeleton rounded-xl"></div>
              </div>
              <div className="h-[80px] w-full border-4 skeleton-border rounded-xl p-2 mt-3">
                <div className="h-full skeleton rounded-xl"></div>
              </div>
              <div className="h-[80px] w-full border-4 skeleton-border rounded-xl p-2 mt-3">
                <div className="h-full skeleton rounded-xl"></div>
              </div>
              <div className="h-[80px] w-full border-4 skeleton-border rounded-xl p-2 mt-3">
                <div className="h-full skeleton rounded-xl"></div>
              </div>
              <div className="h-[80px] w-full border-4 skeleton-border rounded-xl p-2 mt-3">
                <div className="h-full skeleton rounded-xl"></div>
              </div>
              <div className="h-[80px] w-full border-4 skeleton-border rounded-xl p-2 mt-3">
                <div className="h-full skeleton rounded-xl"></div>
              </div>
              <div className="h-[80px] w-full border-4 skeleton-border rounded-xl p-2 mt-3">
                <div className="h-full skeleton rounded-xl"></div>
              </div>
            </div>
          ) : (
            <table className="md:min-w-[1400px] w-full">
              <thead className="h-[70px] w-full">
                <tr className="bg-secondary w-full">
                  {/* ======= Sl ======= */}
                  <th className="text-left px-3 text-primaryText text-base font-bold rounded-l-xl hidden md:table-cell">
                    Sl.
                  </th>
                  {/* ======= Checkbox ======= */}
                  <th className="text-left px-3 text-[#1E1E1E] text-base font-bold rounded-md md:rounded-none">
                    <div className="flex items-center space-x-2 relative w-[1005]">
                      <div
                        onClick={() => clickAllRowSelect()}
                        className="w-5 h-5 md:w-6 md:h-6 rounded tmv-shadow bg-white flex justify-center items-center z-10 cursor-pointer"
                      >
                        {isAllRowSelected === true ? <Tik /> : ""}
                      </div>
                      <p className="pb-0 mb-0 md:hidden">Select All</p> &nbsp;
                    </div>
                  </th>
                  {/* ======= BSTID ======= */}
                  <th className="text-left w-[180px] px-3 text-primaryText text-base font-bold hidden md:table-cell">
                    BSTID
                  </th>
                  {/* =======  Vehicle Name ======= */}
                  <th className="text-left  px-3 text-primaryText text-base font-bold hidden md:table-cell">
                    Vehicle Name
                  </th>
                  {/* =======  Date | Time ======= */}
                  <th className="text-left px-3 text-primaryText text-base font-bold hidden md:table-cell">
                    Date | Time
                  </th>
                  {/* ======= From ======= */}
                  <th className="text-left px-3 text-primaryText text-base font-bold hidden md:table-cell">
                    From
                  </th>
                  {/* ======= Into ======= */}
                  <th className="text-left px-3 text-primaryText text-base font-bold hidden md:table-cell">
                    Into
                  </th>
                  {/* ======= Notified ======= */}
                  <th className="text-center px-3 text-primaryText text-base font-bold hidden md:table-cell">
                    Notified
                  </th>
                  {/* ===== Location ==== */}
                  <th className="text-center px-3 text-primaryText text-base font-bold rounded-r-xl hidden md:table-cell">
                    Location
                  </th>
                </tr>
              </thead>

              <tbody ref={myRef} className="">
                {data.map(
                  (
                    {
                      sl,
                      bst_id,
                      date,
                      from,
                      into,
                      is_read,
                      location,
                      vehicle_name,
                      checkbox,
                      displayDropdownInfo,
                    },
                    index
                  ) => {
                    return (
                      <tr
                        key={index}
                        className={`relative h-[20px] md:h-[81px] ${
                          index % 2 === 0 ? "bg-white" : "bg-tableRow"
                        }`}
                      >
                        {/* ======== Sl ======== */}
                        <td className="px-3 text-base text-tmvDarkGray hidden md:table-cell rounded-l-xl">
                          {sl}
                        </td>

                        {/* ======== Checkbox ======== */}
                        <td className="px-3 text-base text-tmvDarkGray hidden md:table-cell">
                          <div className="flex relative">
                            <div
                              onClick={() => handleSingleRowSelect(sl)}
                              className="w-6 h-6 rounded tmv-shadow bg-white flex justify-center items-center z-10 cursor-pointer"
                            >
                              {checkbox === true ? <Tik /> : ""}
                            </div>
                          </div>
                        </td>

                        {/* ======== bstid ======== */}
                        <td className="p-3 md:py-0 text-base text-tmvDarkGray whitespace-nowrap hidden md:table-cell">
                          {bst_id}
                        </td>

                        {/* ======== vehicle Name ======== */}
                        <td className="px-3 text-base text-tmvDarkGray hidden md:table-cell whitespace-nowrap">
                          {vehicle_name}
                        </td>

                        {/* ======== date time	======== */}
                        <td className="px-3 text-base text-left text-tmvDarkGray hidden md:table-cell whitespace-nowrap">
                          {date}
                        </td>

                        {/* ========  from ======== */}
                        <td className="px-3 text-base text-left text-tmvDarkGray hidden md:table-cell whitespace-nowrap">
                          {from}
                        </td>

                        {/* ======== into  ======== */}
                        <td className="px-3 text-base text-tmvDarkGray hidden md:table-cell whitespace-nowrap">
                          {into}
                        </td>

                        {/* ========  notified	 ======== */}
                        <td className="px-3 hidden md:table-cell">
                          <div
                            className={`${
                              is_read ? "bg-tmvRed" : "bg-tmvGreen"
                            } w-[16px] h-[16px] rounded-full mx-auto`}
                          ></div>
                        </td>

                        {/* ========  location ======== */}
                        <td className="px-3 hidden md:table-cell rounded-r-xl">
                          <div className="flex items-center justify-center">
                            <CustomToolTip
                              id={`action-distance-11`}
                              title={`Hourly Distance Report`}
                              containerClass="action default-tooltip right-tooltip tooltipStyleChange"
                            >
                              {/* <Link
                                    href="/alert-summary"
                                    id={`action-distance-${row.cells[0].value}`}
                                    title={`Hourly Distance Report`}
                                    containerClass="action default-tooltip middle-tooltip tooltipStyleChange"
                                  > */}
                              <Link
                                href={`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`}
                                id={`action11`}
                                target="_blank"
                                className="group rounded w-[31px] h-[31px] flex items-center justify-center"
                              >
                                <LocationSVG />
                              </Link>
                            </CustomToolTip>
                          </div>
                        </td>
                        {/* TABLE DETAILS FOR SMALL SCREEN */}
                        <td
                          className={`p-3 md:hidden flex flex-col space-y-2 duration-300 ease-in-out ${
                            displayDropdownInfo === true
                              ? "  h-[250px]"
                              : "h-[50px]"
                          } `}
                        >
                          <div className="flex items-center space-x-2">
                            <div className="flex relative">
                              <div
                                onClick={() => handleSingleRowSelect(sl)}
                                className="w-5 h-5 md:w-6 md:h-6 rounded tmv-shadow bg-white flex justify-center items-center z-10 cursor-pointer"
                              >
                                {checkbox === true ? <Tik /> : ""}
                              </div>
                            </div>
                            <div
                              onClick={() => handleClick(sl)}
                              className="flex items-center text-tertiaryText text-sm"
                            >
                              <p className="font-bold md:font-medium">
                                BSTID:&nbsp;
                              </p>
                              <p className="font-bold md:font-medium">
                                {bst_id}
                              </p>
                            </div>
                          </div>
                          {displayDropdownInfo === true ? (
                            <div className="flex flex-col space-y-2">
                              <div className="flex items-center text-tertiaryText text-sm font-medium">
                                <p>Vehicle Name:&nbsp;</p>
                                <p>{vehicle_name}</p>
                              </div>
                              <div className="flex items-center text-tertiaryText text-sm font-medium">
                                <p>Date | time:&nbsp;</p>
                                <p> {date}</p>
                              </div>
                              <div className="flex items-center text-tertiaryText text-sm font-medium">
                                <p>From:&nbsp;</p>
                                {from}
                              </div>
                              <div className="flex items-center text-tertiaryText text-sm font-medium">
                                <p>Into:&nbsp;</p>
                                {into}
                              </div>
                              <div className="flex items-center justify-start text-tertiaryText text-sm font-medium">
                                <p>Notified:&nbsp;</p>
                                <div>
                                  <div
                                    className={`${
                                      is_read ? "bg-tmvRed" : "bg-tmvGreen"
                                    } w-[16px] h-[16px] rounded-full mx-auto`}
                                  ></div>
                                </div>
                              </div>
                              <div className="flex items-center text-tertiaryText text-sm font-medium">
                                <p>Location:&nbsp;</p>
                                <div className="flex items-center justify-center">
                                  <CustomToolTip
                                    id={`action-distance-11`}
                                    title={`Hourly Distance Report`}
                                    containerClass="action default-tooltip right-tooltip tooltipStyleChange"
                                  >
                                    {/* <Link
                                    href="/alert-summary"
                                    id={`action-distance-${row.cells[0].value}`}
                                    title={`Hourly Distance Report`}
                                    containerClass="action default-tooltip middle-tooltip tooltipStyleChange"
                                  > */}
                                    <Link
                                      href={`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`}
                                      id={`action11`}
                                      target="_blank"
                                      className="group rounded w-[31px] h-[31px] flex items-center justify-center"
                                    >
                                      <LocationSVG />
                                    </Link>
                                  </CustomToolTip>
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

export default GeoFenceEventTable;
