"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTable, usePagination, useSortBy } from "react-table";

import Link from "next/link";
import CustomToolTip from "../CustomToolTip";
import RouteVSG from "../SVG/dashboard/RouteVSG";
import { CSVLink } from "react-csv";

// ======= SVG
import DownloadSVG from "../SVG/DownloadSVG";
import LocationSVG from "../SVG/dashboard/LocationSVG";
import ClockSVG from "../SVG/dashboard/ClockSVG";
import CalendarSVG from "../SVG/dashboard/CalendarSVG";
import EngineReportSVG from "../SVG/dashboard/EngineReportSVG";
import DownArrowSVG from "../SVG/table/DownArrowSVG";
import UpArrowSVG from "../SVG/table/UpArrowSVG";
import LocationSVGMobile from "../SVG/dashboard/LocationSVGMobile";
import OffSpeedSVG from "../SVG/speed/OffSpeedSVG";
import HighSpeedSVG from "../SVG/speed/HighSpeedSVG";
import NormalSpeedSVG from "../SVG/speed/NormalSpeedSVG";
import OnSpeedSVG from "../SVG/speed/OnSpeedSVG";
import ReloadSVG from "../SVG/modal/ReloadSVG";

// ====== svg for mobile
import ClockSVGMobile from "../SVG/dashboard/ClockSVGMobile";
import CalendarSVGMobile from "../SVG/dashboard/CalendarSVGMobile";
import EngineReportSVGMobile from "../SVG/dashboard/EngineReportSVGMobile";
import RouteVSGMobile from "../SVG/dashboard/RouteVSGMobile";

//========= utils
import { dashboardDate, dashboardTime } from "@/utils/dateTimeConverter";
import SupportSVG from "../SVG/SupportSVG";
import axios from "@/plugins/axios";

import Modal from "react-modal";
import { async } from "regenerator-runtime";
import SpinSVG from "../SVG/SpinSVG";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "20px",
    height: "45vh",
    width: "300px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px",
  },
  overlay: {
    background: "rgba(0, 0, 0, 0.1)",
    zIndex: "5000",
  },
};

const DashboardTable = ({
  selectedVehicles,
  speedLimitData,
  isLoading,
  offset,
  handleReload,
}) => {
  const columns = useMemo(
    () => [
      // ==== o index
      {
        Header: "User",
        accessor: "v_username",
      },
      // ==== 1 index
      {
        Header: "Vehicle no.",
        accessor: "v_vrn",
      },
      // ==== 2 index
      {
        Header: "Nearby Landmark",
        accessor: "nearby_l_name",
      },
      // ==== 3 index
      {
        Header: "Speed Status",
        accessor: "speed_status",
      },
      // ==== 4 index
      {
        Header: "Date | Time",
        accessor: "time_inserted",
      },
      // ==== 5 index
      {
        Header: "Device Status",
        accessor: "device_status",
      },
      // ==== 6 index
      {
        Header: "",
        accessor: "displayDropdown",
      },
      // ==== 7 index
      {
        Header: "",
        accessor: "engine_status",
      },
      // ==== 8 index
      {
        Header: "",
        accessor: "v_identifier",
      },
      // ==== 9 index
      {
        Header: "",
        accessor: "bst_id",
      },
      // ==== 10 index
      {
        Header: "",
        accessor: "displayDropdownInfo",
      },
      // ==== 11 index
      {
        Header: "",
        accessor: "is_speeding",
      },
      // ==== 12 index
      {
        Header: "",
        accessor: "landmark_distance",
      },
      // ==== 13 index
      {
        Header: "",
        accessor: "lat",
      },
      // ==== 14 index
      {
        Header: "",
        accessor: "lng",
      },
      // ==== 15 index
      {
        Header: "",
        accessor: "deviceDetails",
      },
      // ==== 16 index
      {
        Header: "",
        accessor: "isParking",
      },
      // ==== 17 index
      {
        Header: "",
        accessor: "isInGarage",
      },
      // ==== 18 index
      {
        Header: "",
        accessor: "showParking",
      },
      // ==== 19 index
      {
        Header: "",
        accessor: "showGarage",
      },
      // ==== 20 index
      {
        Header: "Customer Name",
        accessor: "customer_name",
      },
    ],
    []
  );

  //=======header for csv
  const headers = [
    { label: "User", key: "v_username" },
    { label: "BSTID", key: "bst_id" },
    { label: "VRN", key: "v_vrn" },
    { label: "Nearby Landmark", key: "nearby_l_name" },
    { label: "Nearby Distance", key: "landmark_distance" },
    { label: "Lat", key: "lat" },
    { label: "Lng", key: "lng" },
    { label: "Speed Status", key: "speed_status" },
    { label: "Engine Status", key: "engine_status" },
    { label: "Date | Time", key: "time_inserted" },
    { label: "Device Status", key: "device_status" },
  ];

  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [dropDownsTracker, setDropDownsTracker] = useState([]);
  const [clickDropdownInfoTracker, setClickDropdownInfoTracker] = useState([]);
  const clickCount = useRef(0);
  const activeSortColumn = useRef("");
  const [isExporting, setIsExporting] = useState(false);

  // ===== click outside ref
  const dropdownsRef = useRef([]);

  const initData = () => {
    setDropDownsTracker(
      selectedVehicles.map((item, index) => ({
        identifier: item.v_identifier,
        displayDropdown: false,
        displayDropdownInfo: false,
        deviceDetails: false,
        isParking: false,
        isInGarage: false,
        showParking: false,
        showGarage: false,
      }))
    );
    setClickDropdownInfoTracker(
      selectedVehicles.map((item, index) => ({
        identifier: item.v_identifier,
        displayDropdown: false,
        displayDropdownInfo: false,
        deviceDetails: false,
        isParking: false,
        isInGarage: false,
        showParking: false,
        showGarage: false,
      }))
    );
  };

  const searchVehicleByIdentifierInfo = (id) => {
    return clickDropdownInfoTracker.find(
      (vehicle) => vehicle.identifier === id
    );
  };

  // FIND VEHICLE FOR DEVICE STATUS ===========================================
  const searchVehicleByIdentifier = (id) => {
    return dropDownsTracker.find((vehicle) => vehicle.identifier === id);
  };

  // SHOW DROPDOWN DATA FOR DEVICE STATUS ====================================
  const clickDropdown = (item) => {
    const newState = dropDownsTracker.map((vehicle) => {
      if (vehicle.identifier === item.v_identifier) {
        return {
          ...vehicle,
          deviceDetails: !vehicle.deviceDetails,
        };
      }
      return vehicle;
    });
    setDropDownsTracker(newState);
  };

  // CHNAGE PARKING TYPE FOR DEVICE STATUS =================================
  const handleParking = (item) => {
    const newState = dropDownsTracker.map((vehicle) => {
      if (vehicle.identifier === item.v_identifier) {
        return { ...vehicle, showParking: !vehicle.showParking };
      }
      return vehicle;
    });
    setDropDownsTracker(newState);
  };

  // CHNAGE GARAGE TYPE FOR DEVICE STATUS =================================
  const handleInGarage = (item) => {
    const newState = dropDownsTracker.map((vehicle) => {
      if (vehicle.identifier === item.v_identifier) {
        return { ...vehicle, showGarage: !vehicle.showGarage };
      }
      return vehicle;
    });
    setDropDownsTracker(newState);
  };

  // Showing Details For Mobile Devices
  const clickDropdownInfo = (item) => {
    console.log(item);
    const newState = clickDropdownInfoTracker.map((vehicle) => {
      if (vehicle.identifier === item.v_identifier) {
        return {
          ...vehicle,
          displayDropdownInfo: !vehicle.displayDropdownInfo,
        };
      }
      return vehicle;
    });
    setClickDropdownInfoTracker(newState);
  };

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

  function handleOutsideClickForInfo(e) {
    dropdownsRef.current.forEach((dropdownRef, index) => {
      if (dropdownRef && !dropdownRef.contains(e.target)) {
        setClickDropdownInfoTracker((prevState) => {
          const updatedState = [...prevState];
          updatedState[index].displayDropdownInfo = false;
          return updatedState;
        });
      }
    });
  }

  function descendingBstId(fieldName) {
    return [...data].sort(function (a, b) {
      var numA = parseInt(a[fieldName].split(" ")[1]);
      var numB = parseInt(b[fieldName].split(" ")[1]);
      return numB - numA;
    });
  }

  function ascendingBstId(fieldName) {
    return [...data].sort(function (a, b) {
      var numA = parseInt(a[fieldName].split(" ")[1]);
      var numB = parseInt(b[fieldName].split(" ")[1]);
      return numA - numB;
    });
  }

  const handleSorting = (fieldName, count) => {
    activeSortColumn.current = fieldName;
    clickCount.current += count;

    if (clickCount.current === 0) {
      // reset sort
      setData([...allData]);
    } else if (clickCount.current === 1) {
      // descending sort
      if (data.find((x) => typeof x[fieldName] !== "number")) {
        if (fieldName === "bst_id") {
          setData(descendingBstId(fieldName));
        } else {
          setData(
            [...data].sort((a, b) => b[fieldName].localeCompare(a[fieldName]))
          );
        }
      } else {
        setData([...data].sort((a, b) => b[fieldName] - a[fieldName]));
      }
    } else if (clickCount.current === 2) {
      // ascending sort
      if (data.find((x) => typeof x[fieldName] !== "number")) {
        if (fieldName === "bst_id") {
          setData(ascendingBstId(fieldName));
        } else {
          setData(
            [...data].sort((a, b) => a[fieldName].localeCompare(b[fieldName]))
          );
        }
      } else {
        setData([...data].sort((a, b) => a[fieldName] - b[fieldName]));
      }
    } else {
      // reset sort
      setData([...allData]);
      clickCount.current = 0;
    }
    console.log(clickCount.current);
  };

  useEffect(() => {
    // selectedVehicles.map((item, index) => {
    //   if (index == 0) {
    //     item.v_username = "abc";
    //   }
    //   if (index == 1) {
    //     item.v_username = "cbc";
    //   }
    //   if (index == 2) {
    //     item.v_username = "bbc";
    //   }
    // });
    setData(selectedVehicles);
    setAllData(selectedVehicles);

    initData();
  }, [selectedVehicles]);

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick, true);
    document.addEventListener("click", handleOutsideClickForInfo, true);

    return () => {
      document.removeEventListener("click", handleOutsideClick, true);
      document.removeEventListener("click", handleOutsideClickForInfo, true);
    };
  }, []);
  // ===== click outside end

  //  ====== react table func ======

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } =
    useTable({
      columns,
      data,
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

  const formatFloatValue = (number) => {
    const value = parseFloat(number);
    return value.toFixed(3);
  };

  //  UPDATE OFFLINE TYPE =====================================
  const updateOfflineType = async (id, type) => {
    let data = {
      identifier: id,
    };
    type === "parking" ? (data.parking = true) : (data.workshop = true);

    console.log("Offline Type ", data);

    await axios
      .post("/api/v4/offline-type-update", data)
      .then((res) => {
        console.log("offline type res------", res);
      })
      .catch((err) => {
        console.log("offline type error :", err);
      });

    if (type === "parking") {
      const newState = dropDownsTracker.map((vehicle) => {
        if (vehicle.identifier === id) {
          return { ...vehicle, isParking: true, deviceDetails: false };
        }
        return vehicle;
      });
      setDropDownsTracker(newState);
    } else {
      const newState = dropDownsTracker.map((vehicle) => {
        if (vehicle.identifier === id) {
          return { ...vehicle, isInGarage: true, deviceDetails: false };
        }
        return vehicle;
      });
      setDropDownsTracker(newState);
    }
    setIsOpen(false);
  };

  const handleRaiseSupportTicket = () => {
    console.log("raising.......");
  };

  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal(item) {
    setIsOpen(true);
    const newState = dropDownsTracker.map((vehicle) => {
      if (vehicle.identifier === item.v_identifier) {
        return {
          ...vehicle,
          deviceDetails: !vehicle.deviceDetails,
        };
      }
      return vehicle;
    });
    setDropDownsTracker(newState);
  }

  const handleDownloadFile = (dataUrl) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    // link.download = filename;
    link.click();
  };

  const handleExport = async () => {
    setIsExporting(true);
    const identifier = selectedVehicles
      .map((item) => item.v_identifier)
      .join(",");
    const data = {
      identifier,
    };
    await axios
      .post("/api/v4/dashboard-export", data)
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
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div className="pb-6">
      <div className="flex items-center justify-between pb-2 md:pb-5">
        <h1 className="text-primaryText text-lg md:text-[22px] font-bold">
          Dashboard
        </h1>

        {/* ====== Buttons ====== */}
        <div className="flex items-end lg:items-center justify-end gap-2 xs:gap-4 mr-20 lg:mr-0">
          <button
            type="submit"
            onClick={handleReload}
            className="flex justify-center items-center space-x-2 rounded-lg w-[32px] sm:w-[42px] md:w-[110px] h-[32px] sm:h-[42px] md:h-[48px] bg-[#e7ecf3] group hover:bg-[#1E1E1E] tmv-shadow hover:shadow-xl"
          >
            <div className=" group-hover:fill-[#e7ecf3] fill-[#1E1E1E] group-hover:animate-spinLeftOne">
              <ReloadSVG />
            </div>
            <span className="group-hover:text-[#e7ecf3] text-[#1E1E1E] hidden md:block text-base">
              Reload
            </span>
          </button>

          {/* <CSVLink
            data={data}
            headers={headers}
            filename={"Dashboard Table Data.csv"}
          >
            <button
              className={`fill-primaryText flex items-center justify-center gap-3 text-sm bg-primary text-primaryText rounded-lg w-[32px] sm:w-[42px] md:w-[110px] h-[32px] sm:h-[42px] md:h-[48px] primary-shadow hover:shadow-xl hover:shadow-primary/60 duration-300`}
            >
              <DownloadSVG />
              <p className="hidden md:block text-base">Export</p>
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
      <div className="rounded-[20px] overflow-hidden pt-2">
        <div className="p-[15px] bg-white overflow-x-auto h-[75vh] rounded-[20px] ">
          {isLoading ? (
            <div className="w-full">{skeletonDiv}</div>
          ) : (
            <table {...getTableProps()} className="w-full  ">
              <thead className="bg-[#FFFAE6] h-[70px] rounded-md hidden md:table-header-group">
                {
                  // Loop over the header rows
                  headerGroups.map((headerGroup, index) => (
                    // Apply the header row props

                    <tr key={index} className="">
                      {/* ======= User. ======= */}
                      <th
                        onClick={() => handleSorting("customer_name", 1)}
                        className="text-left text-lg font-bold px-3 rounded-l-[10px]  text-primaryText min-w-[200px] cursor-pointer "
                      >
                        <div className="flex items-center">
                          {clickCount.current === 1 &&
                          activeSortColumn.current === "customer_name" ? (
                            <UpArrowSVG />
                          ) : clickCount.current === 2 &&
                            activeSortColumn.current === "customer_name" ? (
                            <DownArrowSVG />
                          ) : (
                            ""
                          )}
                          {headerGroup.headers[20].Header}
                        </div>
                      </th>

                      {/* ======= Vehicle no. ======= */}
                      <th
                        onClick={() => handleSorting("bst_id", 1)}
                        className="text-left text-lg font-bold px-3 text-primaryText whitespace-nowrap cursor-pointer"
                      >
                        <div className="flex items-center">
                          <div>
                            {clickCount.current === 1 &&
                            activeSortColumn.current === "bst_id" ? (
                              <UpArrowSVG />
                            ) : clickCount.current === 2 &&
                              activeSortColumn.current === "bst_id" ? (
                              <DownArrowSVG />
                            ) : (
                              ""
                            )}
                          </div>
                          {headerGroup.headers[1].Header}
                        </div>
                      </th>

                      {/* ======= Nearby Landmark	 ======= */}
                      <th className="text-left text-lg font-bold px-3 text-primaryText whitespace-nowrap">
                        {headerGroup.headers[2].Header}
                      </th>

                      {/* ======= Speed Status || engine status ======= */}
                      <th
                        onClick={() => handleSorting("speed_status", 1)}
                        className="text-left text-lg font-bold px-3  text-primaryText whitespace-nowrap cursor-pointer"
                      >
                        <div className="flex items-center">
                          <div>
                            {clickCount.current === 1 &&
                            activeSortColumn.current === "speed_status" ? (
                              <UpArrowSVG />
                            ) : clickCount.current === 2 &&
                              activeSortColumn.current === "speed_status" ? (
                              <DownArrowSVG />
                            ) : (
                              ""
                            )}
                          </div>
                          {headerGroup.headers[3].Header}
                        </div>
                      </th>

                      {/* ======= Date | Time ======= */}
                      <th
                        onClick={() => handleSorting("time_inserted", 1)}
                        className="text-left text-lg font-bold px-3  text-primaryText whitespace-nowrap cursor-pointer"
                      >
                        <div className="flex items-center">
                          <div>
                            {clickCount.current === 1 &&
                            activeSortColumn.current === "time_inserted" ? (
                              <UpArrowSVG />
                            ) : clickCount.current === 2 &&
                              activeSortColumn.current === "time_inserted" ? (
                              <DownArrowSVG />
                            ) : (
                              ""
                            )}
                          </div>
                          {headerGroup.headers[4].Header}
                        </div>
                      </th>

                      {/* ======= Device Status	 ======= */}
                      <th
                        onClick={() => handleSorting("device_status", 1)}
                        className="text-left text-lg font-bold  px-3  text-primaryText whitespace-nowrap cursor-pointer"
                      >
                        <div className="flex items-center">
                          <div>
                            {clickCount.current === 1 &&
                            activeSortColumn.current === "device_status" ? (
                              <UpArrowSVG />
                            ) : clickCount.current === 2 &&
                              activeSortColumn.current === "device_status" ? (
                              <DownArrowSVG />
                            ) : (
                              ""
                            )}
                          </div>
                          {headerGroup.headers[5].Header}
                        </div>
                      </th>

                      {/* ======= dots ======= */}
                      <th className="text-center rounded-r-[10px] text-lg font-bold text-primaryText sticky -right-4 bg-[#FFFAE6]">
                        Actions
                      </th>
                    </tr>
                  ))
                }
              </thead>

              <tbody {...getTableBodyProps()} className="rounded-xl">
                {rows.map((row, index) => {
                  prepareRow(row);
                  return (
                    <tr
                      style={{ zIndex: offset - index }}
                      ref={(el) => (dropdownsRef.current[index] = el)}
                      {...row.getRowProps()}
                      className={`relative rounded-xl h-[81px]  ${
                        index % 2 === 0 ? "bg-white" : "bg-[#F8FBFF]"
                      } `}
                    >
                      {/* ======== User ======== */}
                      <td className="text-base rounded-l-[10px] px-3 whitespace-nowrap text-[#48525C] hidden md:table-cell">
                        {row.cells[20].value ? (
                          row.cells[20].value
                        ) : (
                          <p
                            className={`text-xs xl:text-sm text-[#6A7077] `}
                          ></p>
                        )}
                      </td>

                      {/* ======== Vehicle no  ======== */}
                      <td className={`px-2 py-3 md:px-3 text-[#48525C] `}>
                        {row.cells[1].value ? (
                          <div>
                            <p
                              onClick={() => clickDropdownInfo(row.values)}
                              className="text-sm lg:text-base font-bold min-w-[180px]"
                            >
                              {row.cells[9].value}
                            </p>

                            {/* VEHICLE NO FOR SMALL DEVICES */}
                            <div className="flex items-center mt-1">
                              <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                                Vehicle No:&nbsp;
                              </p>
                              <p className="text-xs text-[#6A7077] lg:text-base">
                                {row.cells[1].value}
                              </p>
                            </div>
                            <div
                              className={`${
                                searchVehicleByIdentifierInfo(
                                  row.cells[8].value
                                ).displayDropdownInfo
                                  ? "h-[220px] xs:h-[190px]"
                                  : "h-0"
                              } duration-500 ease-in-out overflow-hidden md:hidden`}
                            >
                              <div className="flex items-center mt-1">
                                <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                                  Customer Name:&nbsp;
                                </p>
                                <p className="text-[12px] text-[#6A7077] md:text-base">
                                  {row.cells[20].value}
                                </p>
                              </div>
                              {/* LANDMARK FOR SMALL DEVICES */}
                              <div className="flex items-center mt-1 w-full">
                                <p className="text-[12px] text-[#6A7077] md:text-base">
                                  Landmark:&nbsp;
                                </p>
                                {/* {row.cells[2].value ? (
                                  <div
                                    className={`text-sm  ${
                                      row.cells[2].value ===
                                        "Subscription Expired" ||
                                      row.cells[2].value ===
                                        "Renew Subscription"
                                        ? "max-w-[157px] h-[34px] text-[#FF6B6B] p-2 bg-[#FF6B6B]/10 rounded-[10px] flex items-center justify-center "
                                        : row.cells[2].value ===
                                          "Need Maintenance"
                                        ? "max-w-[145px] text-[#FFAA58] p-2 bg-[#FFAA58]/10 rounded-[10px] flex items-center justify-center"
                                        : "text-[#6A7077] "
                                    } `}
                                  >
                                    <p className="text-[12px] md:text-base text-[#6A7077] ">
                                      {row.cells[2].value}(
                                      {formatFloatValue(row.cells[12].value)}
                                      {" km"})
                                      <br />
                                      {row.cells[13].value
                                        ? row.cells[13].value
                                        : ""}
                                      ,
                                      {row.cells[14].value
                                        ? row.cells[14].value
                                        : ""}
                                    </p>
                                  </div>
                                ) : (
                                  <p
                                    className={`text-[12px] md:text-base text-[#6A7077]`}
                                  >
                                    None
                                  </p>
                                )} */}

                                {row.cells[2].value ? (
                                  <div
                                    className={` text-sm  ${
                                      row.cells[2].value ===
                                        "Subscription Expired" ||
                                      row.cells[2].value ===
                                        "Renew Subscription"
                                        ? "max-w-[157px] h-[34px] text-[#FF6B6B] p-2 bg-[#FF6B6B]/10 rounded-[10px] flex items-center justify-center "
                                        : row.cells[2].value ===
                                          "Need Maintenance"
                                        ? "max-w-[145px] text-[#FFAA58] p-2 bg-[#FFAA58]/10 rounded-[10px] flex items-center justify-center"
                                        : "text-[#6A7077] "
                                    } `}
                                  >
                                    {row.cells[2].value ===
                                      "Subscription Expired" ||
                                    row.cells[2].value ===
                                      "Renew Subscription" ||
                                    row.cells[2].value ===
                                      "Need Maintenance" ? (
                                      <p className="text-[12px]">
                                        {row.cells[2].value}
                                      </p>
                                    ) : (
                                      <Link
                                        href={`https://www.google.com/maps/search/?api=1&query=${row.cells[13].value},${row.cells[14].value}`}
                                        target="_blank"
                                      >
                                        <div>
                                          <p>
                                            {row.cells[2].value} (
                                            {formatFloatValue(
                                              row.cells[12].value
                                            )}
                                            {" km"})
                                          </p>
                                          <p className="text-xs">
                                            {row.cells[13].value ? (
                                              <span>
                                                {row.cells[13].value},{" "}
                                              </span>
                                            ) : (
                                              ""
                                            )}
                                            {row.cells[14].value
                                              ? row.cells[14].value
                                              : ""}
                                          </p>
                                        </div>
                                      </Link>
                                    )}
                                  </div>
                                ) : (
                                  <p className={`text-sm text-[#6A7077]  `}>
                                    None
                                  </p>
                                )}
                              </div>
                              {/* SPEED STATUS FOR SMALL DEVICES */}
                              <div>
                                {row.cells[7].value === true ? ( // row.cells[7].value = engine status
                                  <div className="flex items-center mt-1">
                                    <p className="text-[12px] md:text-base">
                                      Speed Status:&nbsp;
                                    </p>
                                    <p className="text-[#F36B24] text-[12px] md:text-base ">
                                      {row.cells[3].value
                                        ? row.cells[3].value
                                        : 0}{" "}
                                      K/H
                                    </p>
                                  </div>
                                ) : (
                                  <p className="text-[#F36B24] text-[12px] md:text-base ">
                                    Engine. off
                                  </p>
                                )}
                              </div>
                              {/* DATE & TIME FOR SMALL DEVICES */}
                              <div className="flex items-center mt-1">
                                <p className="text-[12px] md:text-base">
                                  Date | Time:&nbsp;
                                </p>
                                {row.cells[4].value ? (
                                  <p className="text-[12px] md:text-base">
                                    {dashboardDate(row.cells[4].value) +
                                      " " +
                                      dashboardTime(row.cells[4].value)}
                                  </p>
                                ) : (
                                  <p className="text-[12px] md:text-base">
                                    None
                                  </p>
                                )}
                              </div>
                              {/* DEVICE STATUS FOR SMALL DEVICES */}
                              <div className="flex items-center mt-1">
                                <p className="text-[12px] md:text-base">
                                  Device Status:&nbsp;
                                </p>
                                {row.cells[5].value ? (
                                  <div
                                    className={`rounded-r-xl font-bold capitalize ${
                                      row.cells[5].value === "Suspended"
                                        ? "text-[#FF6B6B]"
                                        : row.cells[5].value === "Offline"
                                        ? "text-[#8D96A1]"
                                        : "text-[#1DD1A1]"
                                    }`}
                                  >
                                    <p className="text-[12px] md:text-base">
                                      {row.cells[5].value}
                                    </p>
                                  </div>
                                ) : (
                                  <p className="text-center text-[12px] md:text-base ">
                                    None
                                  </p>
                                )}
                              </div>
                              {/* ACTIONS */}
                              <div className="flex items-center pt-1">
                                <p className="text-[12px] md:text-base mb-0">
                                  Actions:&nbsp;
                                </p>
                                <div className="flex items-center justify-between w-[145px] h-[36px] md:h-[50px] rounded-lg">
                                  {/* CURRENT LOCATION */}
                                  <div>
                                    <Link
                                      href={`/location/current-location?identifier=${row.values.v_identifier}`}
                                      id={`action-distance-${row.cells[0].value}`}
                                      className="group group-hover:bg-[#FAFAFA]  rounded w-[20px] h-[20px] flex items-center justify-center"
                                    >
                                      <LocationSVGMobile />
                                    </Link>
                                  </div>
                                  {/* DISTANCE */}
                                  <div>
                                    <Link
                                      href="/alert-summary"
                                      id={`action-distance-${row.cells[0].value}`}
                                      className="group group-hover:bg-[#FAFAFA]  rounded w-[20px] h-[20px] flex items-center justify-center  "
                                    >
                                      <ClockSVGMobile />
                                    </Link>
                                  </div>
                                  {/* CALENDER */}
                                  <div>
                                    <Link
                                      href="/alert-summary"
                                      id={`action-calendar-${row.cells[0].value}`}
                                      className="group group-hover:bg-[#FAFAFA]  rounded w-[20px] h-[20px] flex items-center justify-center  "
                                    >
                                      <CalendarSVGMobile />
                                    </Link>
                                  </div>
                                  {/* MESSENGER */}
                                  <div>
                                    <Link
                                      href="/alert-summary"
                                      id={`action-messenger-${row.cells[0].value}`}
                                      className="group group-hover:bg-[#FAFAFA]  rounded w-[20px] h-[20px] flex items-center justify-center  "
                                    >
                                      <EngineReportSVGMobile />
                                    </Link>
                                  </div>
                                  {/* VEHICE ROUTE LINK */}
                                  <div>
                                    <Link
                                      href={`/location/vehicle-route?identifier=${row.values.v_identifier}`}
                                      id={`action-location2-${row.cells[0].value}`}
                                      className="group group-hover:bg-[#FAFAFA]  rounded w-[20px] h-[20px] flex items-center justify-center"
                                    >
                                      <RouteVSGMobile />
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className={` text-sm text-[#6A7077] `}>None</p>
                        )}
                      </td>

                      {/* ======== 	Nearby Landmark ======== */}
                      <td
                        className={`px-3 text-[#48525C] hidden md:table-cell `}
                      >
                        {row.cells[2].value ? (
                          <div
                            className={` text-base  ${
                              row.cells[2].value === "Subscription Expired" ||
                              row.cells[2].value === "Renew Subscription"
                                ? "max-w-[157px] h-[34px] text-[#FF6B6B] p-2 bg-[#FF6B6B]/10 rounded-[10px] flex items-center justify-center "
                                : row.cells[2].value === "Need Maintenance"
                                ? "max-w-[145px] text-[#FFAA58] p-2 bg-[#FFAA58]/10 rounded-[10px] flex items-center justify-center"
                                : "text-[#6A7077] "
                            } `}
                          >
                            {row.cells[2].value === "Subscription Expired" ||
                            row.cells[2].value === "Renew Subscription" ||
                            row.cells[2].value === "Need Maintenance" ? (
                              <p className="text-xs"> {row.cells[2].value}</p>
                            ) : (
                              <Link
                                href={`https://www.google.com/maps/search/?api=1&query=${row.cells[13].value},${row.cells[14].value}`}
                                target="_blank"
                              >
                                <div>
                                  <p>
                                    {row.cells[2].value} (
                                    {formatFloatValue(row.cells[12].value)}
                                    {" km"})
                                  </p>
                                  <p>
                                    {row.cells[13].value ? (
                                      <span>{row.cells[13].value}, </span>
                                    ) : (
                                      ""
                                    )}
                                    {row.cells[14].value
                                      ? row.cells[14].value
                                      : ""}
                                  </p>
                                </div>
                              </Link>
                            )}
                          </div>
                        ) : (
                          <p className={` text-sm text-[#6A7077]  `}>None</p>
                        )}
                      </td>

                      {/* ======== Speed Status || engine status ======== */}
                      <td
                        className={` px-3 text-[#48525C] hidden md:table-cell`}
                      >
                        <div className="flex flex-col items-center">
                          {row.cells[7].value ? ( // engine status
                            <>
                              {row.cells[3].value ? (
                                <>
                                  {speedLimitData[row.cells[8].value] <
                                  row.cells[3].value ? (
                                    <>
                                      <HighSpeedSVG />
                                      <p className="text-[#F36B24] ">
                                        {row.cells[3].value} K/H
                                      </p>
                                    </>
                                  ) : (
                                    <>
                                      <NormalSpeedSVG />
                                      <p className="text-[#1DD1A1] ">
                                        {row.cells[3].value} K/H
                                      </p>
                                    </>
                                  )}
                                </>
                              ) : (
                                <>
                                  <OnSpeedSVG />
                                  <p className="text-[#F36B24]">0 K/H</p>
                                </>
                              )}
                            </>
                          ) : (
                            <>
                              <OffSpeedSVG />
                              <p className="text-gray-500">Engine off</p>
                            </>
                          )}
                        </div>
                      </td>

                      {/* ======== Date | Time ======== */}
                      <td
                        className={`text-base px-3 text-[#48525C] hidden md:table-cell whitespace-nowrap `}
                      >
                        {row.cells[4].value ? (
                          <>
                            <p>{dashboardDate(row.cells[4].value)}</p>
                            <p>{dashboardTime(row.cells[4].value)}</p>
                          </>
                        ) : (
                          <p>None</p>
                        )}
                      </td>

                      {/* ======== Device Status	 ======== */}
                      <td
                        className={`px-3 hidden md:table-cell relative device-status`}
                      >
                        {row.cells[5].value ? (
                          <div
                            // onClick={() => clickDropdown(row.values)}
                            className={`rounded-r-xl px-3 text-center text-base font-bold capitalize relative select-none ${
                              row.cells[5].value === "Offline"
                                ? "cursor-pointer"
                                : ""
                            } ${
                              row.cells[5].value === "Suspended"
                                ? "text-[#FF6B6B]"
                                : row.cells[5].value === "Offline" ||
                                  row.cells[5].value === "Offline-Parking" ||
                                  row.cells[5].value === "Offline-Workshop"
                                ? "text-[#8D96A1]"
                                : "text-[#1DD1A1]"
                            }`}
                          >
                            <p
                              className="device-status"
                              onClick={() =>
                                clickDropdown(
                                  row.cells[5].value === "Offline"
                                    ? row.values
                                    : ""
                                )
                              }
                            >
                              {searchVehicleByIdentifier(row.cells[8].value)
                                .isParking === true
                                ? "Offline-Parking"
                                : searchVehicleByIdentifier(row.cells[8].value)
                                    .isInGarage === true
                                ? "Offline-Workshop"
                                : row.cells[5].value}
                            </p>
                            {searchVehicleByIdentifier(row.cells[8].value)
                              .deviceDetails === true ? (
                              <div
                                className={`bg-secondary rounded-lg w-[180px] absolute left-[-30px] top-[31px] z-10 tooltip text-black font-normal ${
                                  searchVehicleByIdentifier(row.cells[8].value)
                                    .deviceDetails === true
                                    ? "p-2"
                                    : "p-0"
                                }`}
                              >
                                {row.cells[5].value === "Offline" ? (
                                  <div className="h-full">
                                    <div className="tooltip-arrows absolute -top-[12px] left-[44%]"></div>
                                    {searchVehicleByIdentifier(
                                      row.cells[8].value
                                    ).showParking === false ? (
                                      <div className="flex flex-col justify-between h-full">
                                        <p className="text-xs">
                                          This car's tracker appears to be
                                          offline. Is it inside a shaded
                                          parking?
                                        </p>
                                        <div className="flex items-center space-x-3 mt-1">
                                          <button
                                            onClick={() =>
                                              updateOfflineType(
                                                row.cells[8].value,
                                                "parking"
                                              )
                                            }
                                            className="w-full bg-primary rounded py-1 text-xs"
                                          >
                                            Yes
                                          </button>
                                          <button
                                            onClick={() =>
                                              handleParking(row.values)
                                            }
                                            className="w-full bg-white rounded py-1 text-xs"
                                          >
                                            No
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="h-full">
                                        {searchVehicleByIdentifier(
                                          row.cells[8].value
                                        ).showGarage === false ? (
                                          <div className="flex flex-col justify-between h-full">
                                            <p className="text-xs">
                                              Is it in a garage for maintenance?
                                            </p>
                                            <div className="flex items-center space-x-3 mt-2">
                                              <button
                                                onClick={() =>
                                                  updateOfflineType(
                                                    row.cells[8].value,
                                                    "workshop"
                                                  )
                                                }
                                                className="w-full bg-primary rounded py-1 text-xs"
                                              >
                                                Yes
                                              </button>
                                              <button
                                                onClick={() =>
                                                  handleInGarage(row.values)
                                                }
                                                className="w-full bg-white rounded py-1 text-xs"
                                              >
                                                No
                                              </button>
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="flex flex-col justify-between h-full">
                                            <p className="text-xs">
                                              This car's tracker appears to be
                                              offline. Please raise a support
                                              ticket.
                                            </p>
                                            <button
                                              onClick={handleRaiseSupportTicket}
                                              className="w-full bg-primary rounded py-1 flex items-center space-x-2 mt-1.5 px-2.5 text-xs"
                                            >
                                              <SupportSVG />
                                              <span className="font-normal text-xs">
                                                Raise Support Ticket
                                              </span>
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  ""
                                )}
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        ) : (
                          <p className="text-center text-sm">None</p>
                        )}
                      </td>

                      {/* ======== dots ======== */}
                      <td
                        className={`rounded-r-[10px] px-3 text-[#48525C] whitespace-nowrap hidden md:table-cell  sticky -right-4 ${
                          index % 2 === 0 ? "bg-white" : "bg-[#F8FBFF]"
                        }`}
                      >
                        <div className=" flex items-center justify-center gap-1 ">
                          {/* ======== current location ======= */}
                          <div>
                            <CustomToolTip
                              id={`action-distance-${row.cells[0].value}`}
                              title={`Current Location`}
                              containerClass="action default-tooltip middle-tooltip tooltipStyleChange"
                            >
                              <Link
                                href={`/location/current-location?identifier=${row.values.v_identifier}`}
                                id={`action-distance-${row.cells[0].value}`}
                                className="group group-hover:bg-[#FAFAFA]  rounded w-[31px] h-[31px] flex items-center justify-center  "
                              >
                                <LocationSVG />
                              </Link>
                            </CustomToolTip>
                          </div>

                          {/* ======== distance link ======= */}
                          <div>
                            <CustomToolTip
                              id={`action-distance-${row.cells[0].value}`}
                              title={`Hourly Distance Report`}
                              containerClass="action default-tooltip middle-tooltip tooltipStyleChange"
                            >
                              <Link
                                href={`/reports/distance-report/hourly?identifier=${row.values.v_identifier}`}
                                id={`action-distance-${row.cells[0].value}`}
                                className="group group-hover:bg-[#FAFAFA]  rounded w-[31px] h-[31px] flex items-center justify-center  "
                              >
                                <ClockSVG />
                              </Link>
                            </CustomToolTip>
                          </div>

                          {/* ======== calender link ======= */}
                          <div>
                            <CustomToolTip
                              id={`action-calendar-${row.cells[0].value}`}
                              title={`Daily Distance Report`}
                              containerClass="action default-tooltip middle-tooltip tooltipStyleChange"
                            >
                              <Link
                                href={`/reports/distance-report/daily?identifier=${row.values.v_identifier}`}
                                id={`action-calendar-${row.cells[0].value}`}
                                className="group group-hover:bg-[#FAFAFA]  rounded w-[31px] h-[31px] flex items-center justify-center  "
                              >
                                <CalendarSVG />
                              </Link>
                            </CustomToolTip>
                          </div>

                          {/* ======== messenger link ======= */}
                          <div>
                            <CustomToolTip
                              id={`action-messenger-${row.cells[0].value}`}
                              title={`Engine Report`}
                              containerClass="action default-tooltip right-tooltip tooltipStyleChange"
                            >
                              <Link
                                href={`/reports/engine?identifier=${row.values.v_identifier}`}
                                id={`action-messenger-${row.cells[0].value}`}
                                className="group group-hover:bg-[#FAFAFA]  rounded w-[31px] h-[31px] flex items-center justify-center  "
                              >
                                <EngineReportSVG />
                              </Link>
                            </CustomToolTip>
                          </div>

                          {/* ======== Vehicle Route ======= */}
                          <div>
                            <CustomToolTip
                              id={`action-location2-${row.cells[0].value}`}
                              title={`Vehicle Route`}
                              containerClass="action default-tooltip right-tooltip tooltipStyleChange"
                            >
                              {/* {console.log("row.values", row.values)} */}
                              <Link
                                href={`/location/vehicle-route?identifier=${row.values.v_identifier}`}
                                id={`action-location2-${row.cells[0].value}`}
                                className="group group-hover:bg-[#FAFAFA]  rounded w-[31px] h-[31px] flex items-center justify-center"
                              >
                                <RouteVSG />
                              </Link>
                            </CustomToolTip>
                          </div>
                        </div>
                      </td>

                      {/* DEVICE STATUS & DOTS FOR MOBILE */}
                      <td className={`md:hidden z-[9] pr-2`}>
                        {/* DEVICE STATUS  */}
                        {searchVehicleByIdentifierInfo(row.cells[8].value)
                          .displayDropdownInfo === true ? (
                          ""
                        ) : (
                          <div
                            className={`rounded-r-xl md:px-3 text-center text-sm font-bold capitalize device-status ${
                              row.cells[5].value === "Suspended"
                                ? "text-[#FF6B6B]"
                                : row.cells[5].value === "Offline" ||
                                  row.cells[5].value === "Offline-Parking" ||
                                  row.cells[5].value === "Offline-Workshop"
                                ? "text-[#8D96A1]"
                                : "text-[#1DD1A1]"
                            }`}
                          >
                            <p
                              onClick={() =>
                                openModal(
                                  row.cells[5].value === "Offline"
                                    ? row.values
                                    : ""
                                )
                              }
                            >
                              {searchVehicleByIdentifier(row.cells[8].value)
                                .isParking === true
                                ? "Offline-Parking"
                                : searchVehicleByIdentifier(row.cells[8].value)
                                    .isParking === true &&
                                  searchVehicleByIdentifier(row.cells[8].value)
                                    .isInGarage === true
                                ? "Offline-Workshop"
                                : row.cells[5].value}
                            </p>
                          </div>
                        )}
                        {/* MODAL */}
                        <Modal
                          isOpen={modalIsOpen}
                          onRequestClose={closeModal}
                          style={customStyles}
                          ariaHideApp={false}
                          contentLabel="Example Modal"

                          // className={`h-[45vh] flex justify-center items-center p-[30px] bg-white w-[300px] m-auto mt-[150px] rounded-[20px] md:hidden`}
                        >
                          <div
                            className={`rounded-lg w-full z-10 tooltip text-black font-normal ${
                              searchVehicleByIdentifier(row.cells[8].value)
                                .deviceDetails === true
                                ? "p-2"
                                : "p-0"
                            }`}
                          >
                            {row.cells[5].value === "Offline" ? (
                              <div className="h-full">
                                {searchVehicleByIdentifier(row.cells[8].value)
                                  .showParking === false ? (
                                  <div className="flex flex-col justify-between h-full">
                                    <p className="text-sm text-center">
                                      This car's tracker appears to be offline.
                                      Is it inside a shaded parking?
                                    </p>
                                    <div className="flex items-center space-x-3 mt-4">
                                      <button
                                        onClick={() =>
                                          updateOfflineType(
                                            row.cells[8].value,
                                            "parking"
                                          )
                                        }
                                        className="w-full bg-primary rounded-lg py-2 shadow-md text-sm"
                                      >
                                        Yes
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleParking(row.values)
                                        }
                                        className="w-full rounded-lg py-2 text-sm shadow-md bg-[#FFFAE6]"
                                      >
                                        No
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="h-full">
                                    {searchVehicleByIdentifier(
                                      row.cells[8].value
                                    ).showGarage === false ? (
                                      <div className="flex flex-col justify-between h-full">
                                        <p className="text-sm text-center">
                                          Is it in a garage for maintenance?
                                        </p>
                                        <div className="flex items-center space-x-3 mt-3">
                                          <button
                                            onClick={() =>
                                              updateOfflineType(
                                                row.cells[8].value,
                                                "workshop"
                                              )
                                            }
                                            className="w-full bg-primary rounded-lg py-2 shadow-md text-sm"
                                          >
                                            Yes
                                          </button>
                                          <button
                                            onClick={() =>
                                              handleInGarage(row.values)
                                            }
                                            className="w-full rounded-lg py-2 text-sm shadow-md bg-[#FFFAE6]"
                                          >
                                            No
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex flex-col justify-between h-full">
                                        <p className="text-sm text-center">
                                          This car's tracker appears to be
                                          offline. Please raise a support
                                          ticket.
                                        </p>
                                        <button
                                          onClick={handleRaiseSupportTicket}
                                          className="w-full flex items-center space-x-2 mt-3 px-2.5 bg-primary rounded-lg py-2.5 shadow-md text-sm"
                                        >
                                          <SupportSVG />
                                          <span className="font-normal text-xs">
                                            Raise Support Ticket
                                          </span>
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </Modal>
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

export default DashboardTable;
