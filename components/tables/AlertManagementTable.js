"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import EditTableSVG from "../SVG/table/EditTableSVG";

import styles from "../../styles/pages/alertManagement.css";
import CustomToolTip from "../CustomToolTip";
import EditVehicleAlertModal from "../modals/EditVehicleAlertModal";
import SmallDownArrowSVG from "../SVG/table/SmallDownArrowSVG";
import axios from "@/plugins/axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditTableMobileSVG from "../SVG/table/EditTableMobileSVG";

const AlertManagementTable = ({
  vehiclesList,
  isLoading,
  fetchTableData,
  offset,
}) => {
  const columns = useMemo(
    () => [
      //  ==== index 0
      {
        Header: "SI.",
        accessor: "sl",
      },

      //  ==== index 1
      {
        Header: "BSTID",
        accessor: "bst_id",
      },

      //  ==== index 2
      {
        Header: "Vehicle",
        accessor: "vehicleName",
      },

      //  ==== index 3

      {
        Header: "Engine On",
        accessor: "engine_on_email",
      },

      //  ==== index 4
      {
        Header: "",
        accessor: "engine_on_sms",
      },

      //  ==== index 5
      {
        Header: "Engine Off",
        accessor: "engine_off_email",
      },
      //  ==== index 6
      {
        Header: "",
        accessor: "engine_off_sms",
      },

      //  ==== index 7
      {
        Header: "Overspeed",
        accessor: "overspeed_email",
      },
      //  ==== index 8
      {
        Header: "",
        accessor: "overspeed_sms",
      },

      //  ==== index 9
      {
        Header: "KM/H",
        accessor: "speed",
      },

      //  ==== index 10
      {
        Header: "Panic",
        accessor: "panic_email",
      },

      //  ==== index 11
      {
        Header: "",
        accessor: "panic_sms",
      },

      //  ==== index 12
      {
        Header: "Offline",
        accessor: "offline_email",
      },

      //  ==== index 13
      {
        Header: "",
        accessor: "offline_sms",
      },

      //  ==== index 14
      {
        Header: "Disconnect",
        accessor: "disconnect_email",
      },

      //  ==== index 15
      {
        Header: "",
        accessor: "disconnect_sms",
      },

      //  ==== index 16
      {
        Header: "",
        accessor: "showEngineOn",
      },

      //  ==== index 17 showEngineOff
      {
        Header: "",
        accessor: "showEngineOff",
      },

      //  ==== index 18 showOverspeed
      {
        Header: "",
        accessor: "showOverspeed",
      },
      //  ==== index 19 showPanic
      {
        Header: "",
        accessor: "showPanic",
      },

      //  ==== index 20 showOffline
      {
        Header: "",
        accessor: "showOffline",
      },

      //  ==== index 21 showDisconnect
      {
        Header: "",
        accessor: "showDisconnect",
      },
      //  ==== index 22 identifier
      {
        Header: "",
        accessor: "identifier",
      },
      //  ==== index 23 displayDropdownInfo
      {
        Header: "",
        accessor: "displayDropdownInfo",
      },
      //  ==== index 24 displayDropdownInfo
      {
        Header: "",
        accessor: "vrn",
      },
    ],
    []
  );

  // {
  //     sl: 1,
  //     identifier: 1,
  //     bst_id: "TMV 28281",
  //     vehicleName: "DM LA 118-4479 Bikee",

  //     engine_on_email: true,
  //     engine_on_sms: true,

  //     engine_off_email: true,
  //     engine_off_sms: false,

  //     overspeed_email: true,
  //     overspeed_sms: true,

  //     speed: 60,

  //     panic_email: false,
  //     panic_sms: false,

  //     offline_email: false,
  //     offline_sms: true,

  //     disconnect_email: true,
  //     disconnect_sms: false,
  //   },
  const [data, setData] = useState([]);
  const myRef = useRef();

  const [selectedVehicle, setSelectedVehicle] = useState({});
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);

  const displaySelectedModal = (vehicle) => {
    console.log(vehicle);

    setSelectedVehicle(vehicle);
    setEditModalIsOpen(true);
  };

  const clickDropdown = (vehicle, fieldType) => {
    console.log("vehicle", vehicle);
    console.log("fieldType", fieldType);
    console.log("data", data);

    const newState = data.map((obj) => {
      if (obj.identifier === vehicle.identifier) {
        if (fieldType === "showEngineOn") {
          return { ...obj, showEngineOn: !vehicle.showEngineOn };
        } else if (fieldType === "showEngineOff") {
          return { ...obj, showEngineOff: !vehicle.showEngineOff };
        } else if (fieldType === "showOverspeed") {
          return { ...obj, showOverspeed: !vehicle.showOverspeed };
        } else if (fieldType === "showPanic") {
          return { ...obj, showPanic: !vehicle.showPanic };
        } else if (fieldType === "showOffline") {
          return { ...obj, showOffline: !vehicle.showOffline };
        } else if (fieldType === "showDisconnect") {
          return { ...obj, showDisconnect: !vehicle.showDisconnect };
        }
      }
      return obj;
    });
    setData(newState);
  };

  //=========update Alert Management=========
  // const updateAlertManagement = (identifier, data) => {
  //   axios
  //     .post(
  //       `/api/v4/alert-management/alert-settings-update?identifier=${357789642816844}`,
  //       data
  //     )
  //     .then((res) => {
  //       console.log("update Alert Management res------", res);
  //     })
  //     .catch((err) => {
  //       console.log(err.response.statusText);
  //       errorNotify(err.response.statusText);
  //     });
  // };

  // ===== click outside ref
  const dropdownsRef = useRef([]);

  function handleOutsideClick(e) {
    dropdownsRef.current.forEach((dropdownRef, index) => {
      if (dropdownRef && !dropdownRef.contains(e.target)) {
        console.log("click outside");
        setData((prevState) => {
          const updatedState = [...prevState];
          updatedState[index].showEngineOn = false;
          updatedState[index].showEngineOff = false;
          updatedState[index].showOverspeed = false;
          updatedState[index].showPanic = false;
          updatedState[index].showOffline = false;
          updatedState[index].showDisconnect = false;
          return updatedState;
        });
      }
    });
  }

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick, true);

    return () => {
      document.removeEventListener("click", handleOutsideClick, true);
    };
  }, []);

  const clickToggle = (vehicle, key) => {
    const newState = data.map((item) => {
      if (item.identifier === vehicle.identifier) {
        const newData = {
          ...item,
          [key]: !vehicle[key],
        };
        console.log("--- newData", newData);
        updateAlertManagement(newData);
        return newData;
      }

      return item;
    });

    setData(newState);
  };

  const updateAlertManagement = async (newData) => {
    const identifier = newData.identifier;
    const data = {
      engine_on_email: newData.engine_on_email,
      engine_on_sms: newData.engine_on_sms,
      engine_off_email: newData.engine_off_email,
      engine_off_sms: newData.engine_off_sms,
      panic_email: newData.panic_email,
      panic_sms: newData.panic_sms,
      disconnect_email: newData.disconnect_email,
      disconnect_sms: newData.disconnect_sms,
      offline_email: newData.offline_email,
      offline_sms: newData.offline_sms,
      overspeed_email: newData.overspeed_email,
      overspeed_sms: newData.overspeed_sms,
    };

    console.log(">>>update data", data);

    await axios
      .post(
        `/api/v4/alert-management/alert-settings-update?identifier=${identifier}`,
        data
      )
      .then((res) => {
        console.log(" Data updated ", res);

        // fetchTableData();
      })
      .catch((err) => {
        console.log(err.response.statusText);
        errorNotify(err.response.statusText);
        fetchTableData();
      });
  };

  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } =
    useTable({
      columns,
      data,
    });

  const errorNotify = (mgs) => {
    toast.error(mgs, {
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
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

  // Showing Details For Mobile Devices
  const handleDropDownData = (bst_id) => {
    console.log(bst_id);
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

  useEffect(() => {
    setData(
      vehiclesList.map((item, index) => ({
        ...item,
        displayDropdownInfo: false,
      }))
    );
  }, [vehiclesList]);

  return (
    <div>
      <div>
        <ToastContainer />

        <EditVehicleAlertModal
          editModalIsOpen={editModalIsOpen}
          setEditModalIsOpen={setEditModalIsOpen}
          selectedVehicle={selectedVehicle}
          fetchTableData={fetchTableData}
        />
      </div>
      <div>
        <div className="flex items-center justify-between ">
          <h1 className="text-[#1E1E1E] text-lg md:text-[32px] font-bold mb-3 md:mb-6">
            Alert Management
          </h1>
        </div>
        <div className="overflow-hidden rounded-[20px]">
          <div className="p-[15px] overflow-auto bg-white rounded-[20px] h-[75vh]">
            {isLoading ? (
              <div className="w-full">{skeletonDiv}</div>
            ) : (
              <table ref={myRef} {...getTableProps()} className="w-full ">
                <thead className="bg-[#FFFAE6] h-[70px] rounded-md hidden md:table-header-group">
                  {
                    // Loop over the header rows
                    headerGroups.map((headerGroup) => (
                      // Apply the header row props

                      <tr {...headerGroup.getHeaderGroupProps()} className="">
                        {/* ======= SI. ======= */}
                        <th className="text-left text-sm font-bold px-3 rounded-l-[10px]  text-[#1E1E1E]">
                          {headerGroup.headers[0].Header}
                        </th>

                        {/* ======= BSTID ======= */}
                        <th className="text-left text-sm font-bold  px-3  text-[#1E1E1E]">
                          {headerGroup.headers[1].Header}
                        </th>

                        {/* ======= Vehicle Name ======= */}
                        <th className="text-left text-sm font-bold  px-3  text-[#1E1E1E] whitespace-nowrap">
                          {headerGroup.headers[2].Header}
                        </th>

                        {/* ======= engine On ======= */}
                        <th className="text-left text-sm font-bold px-3  text-[#1E1E1E] min-w-[115px]">
                          {headerGroup.headers[3].Header}
                        </th>

                        {/* ======= engine Off ======= */}
                        <th className="text-left text-sm font-bold px-3  text-[#1E1E1E] min-w-[115px]">
                          {headerGroup.headers[5].Header}
                        </th>

                        {/* ======= overspeed ======= */}
                        <th className="text-left text-sm font-bold px-3  text-[#1E1E1E] min-w-[115px]">
                          {headerGroup.headers[7].Header}
                        </th>

                        {/* ======= speed ======= */}
                        <th className="text-left text-sm font-bold px-3  text-[#1E1E1E]">
                          {/* {headerGroup.headers[6].Header} */}
                          {headerGroup.headers[9].Header}
                        </th>

                        {/* ======= Panic ======= */}
                        <th className="text-left text-sm font-bold px-3  text-[#1E1E1E] min-w-[115px]">
                          {headerGroup.headers[10].Header}
                        </th>

                        {/* ======= offline ======= */}
                        <th className="text-left text-sm font-bold px-3  text-[#1E1E1E] min-w-[115px]">
                          {headerGroup.headers[12].Header}
                        </th>

                        {/* ======= disconnect ======= */}
                        <th className="text-left text-sm font-bold px-3  text-[#1E1E1E] min-w-[115px]">
                          {headerGroup.headers[14].Header}
                        </th>

                        {/* ======= edit ======= */}
                        <th className="w-6 rounded-r-[10px] text-left text-lg font-bold px-3  text-[#1E1E1E]"></th>
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
                        className={`relative rounded-xl md:h-[81px] ${
                          index % 2 === 0 ? "bg-white" : "bg-[#F8FBFF]"
                        } `}
                      >
                        {/* ======== SI ======== */}
                        <td className="rounded-l-[10px] px-3 text-sm text-[#48525C] hidden md:table-cell">
                          {row.cells[0].value}
                        </td>

                        {/* ======== BSTID ======== */}
                        <td className="px-3 py-2 text-sm  text-[#48525C] whitespace-nowrap rounded-md md:rounded-none">
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
                                <p className="text-[12px] font-bold text-[#6A7077] md:text-base">
                                  {row.cells[1].value}
                                </p>
                              </div>
                              {/* TABLE DETAILS FOR SMALL DEVICE */}
                              <div
                                className={`${
                                  row.cells[23].value === true
                                    ? "h-[220px]"
                                    : "h-0"
                                } duration-500 ease-in-out overflow-hidden md:hidden`}
                              >
                                {/* VEHICLE NAME */}
                                <div className="flex items-center mt-1">
                                  <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                                    Vehicle:&nbsp;
                                  </p>
                                  <p className="text-[12px] text-[#6A7077] md:text-base">
                                    {row.cells[24].value}
                                  </p>
                                </div>
                                {/* ENGINE ON */}
                                <div className="relative flex items-center mt-1">
                                  <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                                    Engine On:&nbsp;
                                  </p>
                                  <div
                                    onClick={() =>
                                      clickDropdown(row.values, "showEngineOn")
                                    }
                                    className="flex items-center gap-1 cursor-pointer select-none"
                                  >
                                    <div>
                                      {/* === none === */}
                                      {!row.cells[3].value &&
                                        !row.cells[4].value && (
                                          <p className="text-[12px]">None</p>
                                        )}

                                      {/* === email & sms === */}
                                      {row.cells[3].value &&
                                        row.cells[4].value && (
                                          <p className="text-[12px]">
                                            Email | SMS
                                          </p>
                                        )}

                                      {/* === only email === */}
                                      {row.cells[3].value &&
                                        !row.cells[4].value && (
                                          <p className="text-[12px]">Email</p>
                                        )}

                                      {/* === only sms === */}
                                      {!row.cells[3].value &&
                                        row.cells[4].value && (
                                          <p className="text-[12px]">SMS</p>
                                        )}
                                    </div>

                                    <div
                                      className={`duration-300 ${
                                        row.cells[16].value ? "rotate-180" : ""
                                      }`}
                                    >
                                      <SmallDownArrowSVG />
                                    </div>
                                  </div>

                                  {/* ==== showEngineOn -->  row.cells[16] ==== */}
                                  {row.cells[16].value && (
                                    <div className="bg-white dark-shadow p-3 min-w-[96px] rounded-xl absolute bottom-[-75px] left-10 z-[3005] ">
                                      {/* ==== email toggle ====  */}
                                      <div className="flex items-center space-x-4 text-sm text-[#48525C] mb-1.5 ">
                                        <p className="w-8">Email</p>
                                        {/* toggle button start */}
                                        <div
                                          onClick={() =>
                                            clickToggle(
                                              row.values,
                                              "engine_on_email"
                                            )
                                          }
                                          className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                                        >
                                          {/* Switch */}
                                          <div
                                            className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${
                                              !row.cells[3].value
                                                ? "bg-[#C9D1DA]"
                                                : ` transform translate-x-3 bg-primary`
                                            }`}
                                          ></div>
                                        </div>
                                      </div>

                                      {/* ==== sms toggle ====  */}
                                      <div className="flex items-center space-x-4 text-sm text-[#48525C] ">
                                        <p className="w-8">SMS</p>
                                        {/* toggle button start */}
                                        <div
                                          onClick={() =>
                                            clickToggle(
                                              row.values,
                                              "engine_on_sms"
                                            )
                                          }
                                          className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                                        >
                                          {/* Switch */}
                                          <div
                                            className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${
                                              !row.cells[4].value
                                                ? "bg-[#C9D1DA]"
                                                : ` transform translate-x-3 bg-primary`
                                            }`}
                                          ></div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                {/* ENGINE OFF */}
                                <div className="relative flex items-center mt-1">
                                  <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                                    Engine Off:&nbsp;
                                  </p>
                                  <div
                                    onClick={() =>
                                      clickDropdown(row.values, "showEngineOff")
                                    }
                                    className="flex items-center gap-1 cursor-pointer select-none whitespace-nowrap"
                                  >
                                    <div>
                                      {/* === none === */}
                                      {!row.cells[5].value &&
                                        !row.cells[6].value && (
                                          <p className="text-[12px]">None</p>
                                        )}

                                      {/* === email & sms === */}
                                      {row.cells[5].value &&
                                        row.cells[6].value && (
                                          <p className="text-[12px]">
                                            Email | SMS
                                          </p>
                                        )}

                                      {/* === only email === */}
                                      {row.cells[5].value &&
                                        !row.cells[6].value && (
                                          <p className="text-[12px]">Email</p>
                                        )}

                                      {/* === only sms === */}
                                      {!row.cells[5].value &&
                                        row.cells[6].value && (
                                          <p className="text-[12px]">SMS</p>
                                        )}
                                    </div>

                                    <div
                                      className={`duration-300 ${
                                        row.cells[17].value ? "rotate-180" : ""
                                      }`}
                                    >
                                      <SmallDownArrowSVG />
                                    </div>
                                  </div>

                                  {/* ==== showEngineOff -->  row.cells[17] ==== */}
                                  {row.cells[17].value && (
                                    <div
                                      // ref={dropdownRef}
                                      className="bg-white dark-shadow p-3 min-w-[96px] rounded-xl absolute bottom-[-75px] left-10 z-[100] "
                                    >
                                      {/* ==== email toggle ====  */}
                                      <div className="flex items-center space-x-4 text-sm text-[#48525C] mb-1.5 ">
                                        <p className="w-8">Email</p>
                                        {/* toggle button start */}
                                        <div
                                          onClick={() =>
                                            clickToggle(
                                              row.values,
                                              "engine_off_email"
                                            )
                                          }
                                          className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                                        >
                                          {/* Switch */}
                                          <div
                                            className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${
                                              !row.cells[5].value
                                                ? "bg-[#C9D1DA]"
                                                : ` transform translate-x-3 bg-primary`
                                            }`}
                                          ></div>
                                        </div>
                                      </div>

                                      {/* ==== sms toggle ====  */}
                                      <div className="flex items-center space-x-4 text-sm text-[#48525C] ">
                                        <p className="w-8">SMS</p>
                                        {/* toggle button start */}
                                        <div
                                          onClick={() =>
                                            clickToggle(
                                              row.values,
                                              "engine_off_sms"
                                            )
                                          }
                                          className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                                        >
                                          {/* Switch */}
                                          <div
                                            className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${
                                              !row.cells[6].value
                                                ? "bg-[#C9D1DA]"
                                                : ` transform translate-x-3 bg-primary`
                                            }`}
                                          ></div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                {/* OVERSPEED */}
                                <div className="relative flex items-center mt-1">
                                  <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                                    Overspeed:&nbsp;
                                  </p>
                                  <div
                                    onClick={() =>
                                      clickDropdown(row.values, "showOverspeed")
                                    }
                                    className="flex items-center gap-1 cursor-pointer select-none"
                                  >
                                    <div>
                                      {/* === none === */}
                                      {!row.cells[7].value &&
                                        !row.cells[8].value && (
                                          <p className="text-[12px]">None</p>
                                        )}

                                      {/* === email & sms === */}
                                      {row.cells[7].value &&
                                        row.cells[8].value && (
                                          <p className="text-[12px]">
                                            Email | SMS
                                          </p>
                                        )}

                                      {/* === only email === */}
                                      {row.cells[7].value &&
                                        !row.cells[8].value && (
                                          <p className="text-[12px]">Email</p>
                                        )}

                                      {/* === only sms === */}
                                      {!row.cells[7].value &&
                                        row.cells[8].value && (
                                          <p className="text-[12px]">SMS</p>
                                        )}
                                    </div>

                                    <div
                                      className={`duration-300 ${
                                        row.cells[18].value === true
                                          ? "rotate-180"
                                          : ""
                                      }`}
                                    >
                                      <SmallDownArrowSVG />
                                    </div>
                                  </div>

                                  {/* ==== showOverspeed -->  row.cells[18] ==== */}
                                  {row.cells[18].value && (
                                    <div
                                      // ref={dropdownRef}
                                      className="bg-white dark-shadow p-3 min-w-[96px] rounded-xl absolute bottom-[-75px] left-10 z-[100] "
                                    >
                                      {/* ==== email toggle ====  */}
                                      <div className="flex items-center space-x-4 text-sm text-[#48525C] mb-1.5 ">
                                        <p className="w-8">Email</p>
                                        {/* toggle button start */}
                                        <div
                                          onClick={() =>
                                            clickToggle(
                                              row.values,
                                              "overspeed_email"
                                            )
                                          }
                                          className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                                        >
                                          {/* Switch */}
                                          <div
                                            className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${
                                              !row.cells[7].value
                                                ? "bg-[#C9D1DA]"
                                                : ` transform translate-x-3 bg-primary`
                                            }`}
                                          ></div>
                                        </div>
                                      </div>

                                      {/* ==== sms toggle ====  */}
                                      <div className="flex items-center space-x-4 text-sm text-[#48525C] ">
                                        <p className="w-8">SMS</p>
                                        {/* ==== toggle button start ==== */}
                                        <div
                                          onClick={() =>
                                            clickToggle(
                                              row.values,
                                              "overspeed_sms"
                                            )
                                          }
                                          className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                                        >
                                          {/* Switch */}
                                          <div
                                            className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${
                                              !row.cells[8].value
                                                ? "bg-[#C9D1DA]"
                                                : ` transform translate-x-3 bg-primary`
                                            }`}
                                          ></div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                {/* SPEED */}
                                <div className="flex items-center mt-1">
                                  <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                                    Speed:&nbsp;
                                  </p>
                                  <p className="text-[12px] text-[#6A7077] md:text-base">
                                    {row.cells[9].value} km/h
                                  </p>
                                </div>
                                {/* PANIC */}
                                <div className="relative flex items-center mt-1">
                                  <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                                    Panic:&nbsp;
                                  </p>
                                  <div
                                    onClick={() =>
                                      clickDropdown(row.values, "showPanic")
                                    }
                                    className="flex items-center gap-1 cursor-pointer select-none"
                                  >
                                    <div>
                                      {/* === none === */}
                                      {!row.cells[10].value &&
                                        !row.cells[11].value && (
                                          <p className="text-[12px]">None</p>
                                        )}

                                      {/* === email & sms === */}
                                      {row.cells[10].value &&
                                        row.cells[11].value && (
                                          <p className="text-[12px]">
                                            Email | SMS
                                          </p>
                                        )}

                                      {/* === only email === */}
                                      {row.cells[10].value &&
                                        !row.cells[11].value && (
                                          <p className="text-[12px]">Email</p>
                                        )}

                                      {/* === only sms === */}
                                      {!row.cells[10].value &&
                                        row.cells[11].value && (
                                          <p className="text-[12px]">SMS</p>
                                        )}
                                    </div>

                                    <div
                                      className={`duration-300 ${
                                        row.cells[19].value ? "rotate-180" : ""
                                      }`}
                                    >
                                      <SmallDownArrowSVG />
                                    </div>
                                  </div>

                                  {/* ==== showPanic -->  row.cells[19] ==== */}
                                  {row.cells[19].value && (
                                    <div
                                      // ref={dropdownRef}
                                      className="bg-white dark-shadow p-3 min-w-[96px] rounded-xl absolute bottom-[-75px] left-10 z-[100] "
                                    >
                                      {/* ==== email toggle ====  */}
                                      <div className="flex items-center space-x-4 text-sm text-[#48525C] mb-1.5 ">
                                        <p className="w-8">Email</p>
                                        {/* ==== toggle button start ==== */}
                                        <div
                                          onClick={() =>
                                            clickToggle(
                                              row.values,
                                              "panic_email"
                                            )
                                          }
                                          className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                                        >
                                          {/* ==== Switch ==== */}
                                          <div
                                            className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${
                                              !row.cells[10].value
                                                ? "bg-[#C9D1DA]"
                                                : ` transform translate-x-3 bg-primary`
                                            }`}
                                          ></div>
                                        </div>
                                      </div>

                                      {/* ==== sms toggle ====  */}
                                      <div className="flex items-center space-x-4 text-sm text-[#48525C] ">
                                        <p className="w-8">SMS</p>
                                        {/* ==== toggle button start ==== */}
                                        <div
                                          onClick={() =>
                                            clickToggle(row.values, "panic_sms")
                                          }
                                          className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                                        >
                                          {/* ==== Switch ==== */}
                                          <div
                                            className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${
                                              !row.cells[11].value
                                                ? "bg-[#C9D1DA]"
                                                : ` transform translate-x-3 bg-primary`
                                            }`}
                                          ></div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                {/* OFFLINE */}
                                <div className="relative flex items-center mt-1">
                                  <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                                    Offline:&nbsp;
                                  </p>
                                  <div
                                    onClick={() =>
                                      clickDropdown(row.values, "showOffline")
                                    }
                                    className="flex items-center gap-1 cursor-pointer select-none"
                                  >
                                    <div>
                                      {/* === none === */}
                                      {!row.cells[12].value &&
                                        !row.cells[13].value && (
                                          <p className="text-[12px]">None</p>
                                        )}

                                      {/* === email & sms === */}
                                      {row.cells[12].value &&
                                        row.cells[13].value && (
                                          <p className="text-[12px]">
                                            Email | SMS
                                          </p>
                                        )}

                                      {/* === only email === */}
                                      {row.cells[12].value &&
                                        !row.cells[13].value && (
                                          <p className="text-[12px]">Email</p>
                                        )}

                                      {/* === only sms === */}
                                      {!row.cells[12].value &&
                                        row.cells[13].value && (
                                          <p className="text-[12px]">SMS</p>
                                        )}
                                    </div>

                                    <div
                                      className={`duration-300 ${
                                        row.cells[20].value ? "rotate-180" : ""
                                      }`}
                                    >
                                      <SmallDownArrowSVG />
                                    </div>
                                  </div>

                                  {/* ==== showOffline -->  row.cells[20] ==== */}
                                  {row.cells[20].value && (
                                    <div
                                      // ref={dropdownRef}
                                      className="bg-white dark-shadow p-3 min-w-[96px] rounded-xl absolute bottom-[-75px] left-10 z-[100] "
                                    >
                                      {/* ==== email toggle ====  */}
                                      <div className="flex items-center space-x-4 text-sm text-[#48525C] mb-1.5 ">
                                        <p className="w-8">Email</p>
                                        {/* ==== toggle button start ==== */}
                                        <div
                                          onClick={() =>
                                            clickToggle(
                                              row.values,
                                              "offline_email"
                                            )
                                          }
                                          className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                                        >
                                          {/* ==== Switch ==== */}
                                          <div
                                            className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${
                                              !row.cells[12].value
                                                ? "bg-[#C9D1DA]"
                                                : ` transform translate-x-3 bg-primary`
                                            }`}
                                          ></div>
                                        </div>
                                      </div>

                                      {/* ==== sms toggle ====  */}
                                      <div className="flex items-center space-x-4 text-sm text-[#48525C] ">
                                        <p className="w-8">SMS</p>
                                        {/* ==== toggle button start ====  */}
                                        <div
                                          onClick={() =>
                                            clickToggle(
                                              row.values,
                                              "offline_sms"
                                            )
                                          }
                                          className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                                        >
                                          {/* ==== Switch ==== */}
                                          <div
                                            className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${
                                              !row.cells[13].value
                                                ? "bg-[#C9D1DA]"
                                                : ` transform translate-x-3 bg-primary`
                                            }`}
                                          ></div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                {/* DISCONNECT   */}
                                <div className="relative flex items-center mt-1">
                                  <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                                    Disconnect:&nbsp;
                                  </p>
                                  <div
                                    onClick={() =>
                                      clickDropdown(
                                        row.values,
                                        "showDisconnect"
                                      )
                                    }
                                    className="flex items-center gap-1 cursor-pointer select-none"
                                  >
                                    <div>
                                      {/* === none === */}
                                      {!row.cells[14].value &&
                                        !row.cells[15].value && (
                                          <p className="text-[12px]">None</p>
                                        )}

                                      {/* === email & sms === */}
                                      {row.cells[14].value &&
                                        row.cells[15].value && (
                                          <p className="text-[12px]">
                                            Email | SMS
                                          </p>
                                        )}

                                      {/* === only email === */}
                                      {row.cells[14].value &&
                                        !row.cells[15].value && (
                                          <p className="text-[12px]">Email</p>
                                        )}

                                      {/* === only sms === */}
                                      {!row.cells[14].value &&
                                        row.cells[15].value && (
                                          <p className="text-[12px]">SMS</p>
                                        )}
                                    </div>

                                    <div
                                      className={`duration-300 ${
                                        row.cells[21].value ? "rotate-180" : ""
                                      }`}
                                    >
                                      <SmallDownArrowSVG />
                                    </div>
                                  </div>

                                  {/* ==== showDisconnect -->  row.cells[21] ==== */}
                                  {row.cells[21].value && (
                                    <div
                                      // ref={dropdownRef}
                                      className="bg-white dark-shadow p-3 min-w-[96px] rounded-xl absolute top-[-75px] left-10 z-[100] "
                                    >
                                      {/* ==== email toggle ====  */}
                                      <div className="flex items-center space-x-4 text-sm text-[#48525C] mb-1.5 ">
                                        <p className="w-8">Email</p>
                                        {/* ==== toggle button start ==== */}
                                        <div
                                          onClick={() =>
                                            clickToggle(
                                              row.values,
                                              "disconnect_email"
                                            )
                                          }
                                          className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                                        >
                                          {/* Switch */}
                                          <div
                                            className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${
                                              !row.cells[14].value
                                                ? "bg-[#C9D1DA]"
                                                : ` transform translate-x-3 bg-primary`
                                            }`}
                                          ></div>
                                        </div>
                                      </div>

                                      {/* ==== sms toggle ====  */}
                                      <div className="flex items-center space-x-4 text-sm text-[#48525C] ">
                                        <p className="w-8">SMS</p>
                                        {/* ==== toggle button start ==== */}
                                        <div
                                          onClick={() =>
                                            clickToggle(
                                              row.values,
                                              "disconnect_sms"
                                            )
                                          }
                                          className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                                        >
                                          {/* Switch */}
                                          <div
                                            className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${
                                              !row.cells[15].value
                                                ? "bg-[#C9D1DA]"
                                                : ` transform translate-x-3 bg-primary`
                                            }`}
                                          ></div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                {/* EDIT */}
                                <div className="flex items-center mt-1">
                                  <p className="text-[12px] text-[#6A7077] md:text-base md:hidden">
                                    Edit:&nbsp;
                                  </p>
                                  {/* ======== Device Status  ======== */}
                                  <div
                                    onClick={() =>
                                      displaySelectedModal(row.values)
                                    }
                                    className="relative "
                                  >
                                    <CustomToolTip
                                      id={`device-${row.cells[0].value}`}
                                      title={`Edit`}
                                      containerClass="edit default-tooltip tooltipStyleChange"
                                    >
                                      <div className="group hover:bg-white rounded cursor-pointer w-6 h-6 flex items-center justify-center hover:dark-shadow ">
                                        <EditTableMobileSVG />
                                      </div>
                                    </CustomToolTip>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                        </td>

                        {/* ======== Vehicle ======== */}
                        <td className="px-3 text-sm text-[#48525C] hidden md:table-cell">
                          {row.cells[24].value}
                        </td>

                        {/* ======== engine On ======== */}
                        <td className="relative px-3 text-sm text-[#48525C] whitespace-nowrap hidden md:table-cell">
                          <div
                            onClick={() =>
                              clickDropdown(row.values, "showEngineOn")
                            }
                            className="flex items-center gap-1 cursor-pointer select-none"
                          >
                            <div>
                              {/* === none === */}
                              {!row.cells[3].value && !row.cells[4].value && (
                                <p>None</p>
                              )}

                              {/* === email & sms === */}
                              {row.cells[3].value && row.cells[4].value && (
                                <p>Email | SMS</p>
                              )}

                              {/* === only email === */}
                              {row.cells[3].value && !row.cells[4].value && (
                                <p>Email</p>
                              )}

                              {/* === only sms === */}
                              {!row.cells[3].value && row.cells[4].value && (
                                <p>SMS</p>
                              )}
                            </div>

                            <div
                              className={`duration-300 ${
                                row.cells[16].value ? "rotate-180" : ""
                              }`}
                            >
                              <SmallDownArrowSVG />
                            </div>
                          </div>

                          {/* ==== showEngineOn -->  row.cells[16] ==== */}
                          {row.cells[16].value && (
                            <div className="bg-white dark-shadow p-3 min-w-[96px] rounded-xl absolute bottom-[-45px] left-3 z-[100] ">
                              {/* ==== email toggle ====  */}
                              <div className="flex items-center space-x-4 text-sm text-[#48525C] mb-1.5 ">
                                <p className="w-8">Email</p>
                                {/* toggle button start */}
                                <div
                                  onClick={() =>
                                    clickToggle(row.values, "engine_on_email")
                                  }
                                  className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                                >
                                  {/* Switch */}
                                  <div
                                    className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${
                                      !row.cells[3].value
                                        ? "bg-[#C9D1DA]"
                                        : ` transform translate-x-3 bg-primary`
                                    }`}
                                  ></div>
                                </div>
                              </div>

                              {/* ==== sms toggle ====  */}
                              <div className="flex items-center space-x-4 text-sm text-[#48525C] ">
                                <p className="w-8">SMS</p>
                                {/* toggle button start */}
                                <div
                                  onClick={() =>
                                    clickToggle(row.values, "engine_on_sms")
                                  }
                                  className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                                >
                                  {/* Switch */}
                                  <div
                                    className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${
                                      !row.cells[4].value
                                        ? "bg-[#C9D1DA]"
                                        : ` transform translate-x-3 bg-primary`
                                    }`}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          )}
                        </td>

                        {/* ======== engine Off ======== */}
                        <td className="relative px-3 text-sm text-[#48525C] whitespace-nowrap hidden md:table-cell">
                          <div
                            onClick={() =>
                              clickDropdown(row.values, "showEngineOff")
                            }
                            className="flex items-center gap-1 cursor-pointer select-none whitespace-nowrap"
                          >
                            <div>
                              {/* === none === */}
                              {!row.cells[5].value && !row.cells[6].value && (
                                <p>None</p>
                              )}

                              {/* === email & sms === */}
                              {row.cells[5].value && row.cells[6].value && (
                                <p>Email | SMS</p>
                              )}

                              {/* === only email === */}
                              {row.cells[5].value && !row.cells[6].value && (
                                <p>Email</p>
                              )}

                              {/* === only sms === */}
                              {!row.cells[5].value && row.cells[6].value && (
                                <p>SMS</p>
                              )}
                            </div>

                            <div
                              className={`duration-300 ${
                                row.cells[17].value ? "rotate-180" : ""
                              }`}
                            >
                              <SmallDownArrowSVG />
                            </div>
                          </div>

                          {/* ==== showEngineOff -->  row.cells[17] ==== */}
                          {row.cells[17].value && (
                            <div
                              // ref={dropdownRef}
                              className="bg-white dark-shadow p-3 min-w-[96px] rounded-xl absolute bottom-[-45px] left-3 z-[100] "
                            >
                              {/* ==== email toggle ====  */}
                              <div className="flex items-center space-x-4 text-sm text-[#48525C] mb-1.5 ">
                                <p className="w-8">Email</p>
                                {/* toggle button start */}
                                <div
                                  onClick={() =>
                                    clickToggle(row.values, "engine_off_email")
                                  }
                                  className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                                >
                                  {/* Switch */}
                                  <div
                                    className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${
                                      !row.cells[5].value
                                        ? "bg-[#C9D1DA]"
                                        : ` transform translate-x-3 bg-primary`
                                    }`}
                                  ></div>
                                </div>
                              </div>

                              {/* ==== sms toggle ====  */}
                              <div className="flex items-center space-x-4 text-sm text-[#48525C] ">
                                <p className="w-8">SMS</p>
                                {/* toggle button start */}
                                <div
                                  onClick={() =>
                                    clickToggle(row.values, "engine_off_sms")
                                  }
                                  className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                                >
                                  {/* Switch */}
                                  <div
                                    className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${
                                      !row.cells[6].value
                                        ? "bg-[#C9D1DA]"
                                        : ` transform translate-x-3 bg-primary`
                                    }`}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          )}
                        </td>

                        {/* ======== overspeed ======== */}
                        <td className="relative px-3 text-sm text-[#48525C] whitespace-nowrap hidden md:table-cell">
                          <div
                            onClick={() =>
                              clickDropdown(row.values, "showOverspeed")
                            }
                            className="flex items-center gap-1 cursor-pointer select-none"
                          >
                            <div>
                              {/* === none === */}
                              {!row.cells[7].value && !row.cells[8].value && (
                                <p>None</p>
                              )}

                              {/* === email & sms === */}
                              {row.cells[7].value && row.cells[8].value && (
                                <p>Email | SMS</p>
                              )}

                              {/* === only email === */}
                              {row.cells[7].value && !row.cells[8].value && (
                                <p>Email</p>
                              )}

                              {/* === only sms === */}
                              {!row.cells[7].value && row.cells[8].value && (
                                <p>SMS</p>
                              )}
                            </div>

                            <div
                              className={`duration-300 ${
                                row.cells[18].value === true ? "rotate-180" : ""
                              }`}
                            >
                              <SmallDownArrowSVG />
                            </div>
                          </div>

                          {/* ==== showOverspeed -->  row.cells[18] ==== */}
                          {row.cells[18].value && (
                            <div
                              // ref={dropdownRef}
                              className="bg-white dark-shadow p-3 min-w-[96px] rounded-xl absolute bottom-[-45px] left-3 z-[100] "
                            >
                              {/* ==== email toggle ====  */}
                              <div className="flex items-center space-x-4 text-sm text-[#48525C] mb-1.5 ">
                                <p className="w-8">Email</p>
                                {/* toggle button start */}
                                <div
                                  onClick={() =>
                                    clickToggle(row.values, "overspeed_email")
                                  }
                                  className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                                >
                                  {/* Switch */}
                                  <div
                                    className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${
                                      !row.cells[7].value
                                        ? "bg-[#C9D1DA]"
                                        : ` transform translate-x-3 bg-primary`
                                    }`}
                                  ></div>
                                </div>
                              </div>

                              {/* ==== sms toggle ====  */}
                              <div className="flex items-center space-x-4 text-sm text-[#48525C] ">
                                <p className="w-8">SMS</p>
                                {/* ==== toggle button start ==== */}
                                <div
                                  onClick={() =>
                                    clickToggle(row.values, "overspeed_sms")
                                  }
                                  className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                                >
                                  {/* Switch */}
                                  <div
                                    className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${
                                      !row.cells[8].value
                                        ? "bg-[#C9D1DA]"
                                        : ` transform translate-x-3 bg-primary`
                                    }`}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          )}
                        </td>

                        {/* ======== speed ======== */}
                        <td className="px-3 text-sm text-[#48525C] hidden md:table-cell">
                          {row.cells[9].value}
                        </td>

                        {/* ======== Panic ======== */}
                        <td className="relative px-3 text-sm text-[#48525C] whitespace-nowrap hidden md:table-cell">
                          <div
                            onClick={() =>
                              clickDropdown(row.values, "showPanic")
                            }
                            className="flex items-center gap-1 cursor-pointer select-none"
                          >
                            <div>
                              {/* === none === */}
                              {!row.cells[10].value && !row.cells[11].value && (
                                <p>None</p>
                              )}

                              {/* === email & sms === */}
                              {row.cells[10].value && row.cells[11].value && (
                                <p>Email | SMS</p>
                              )}

                              {/* === only email === */}
                              {row.cells[10].value && !row.cells[11].value && (
                                <p>Email</p>
                              )}

                              {/* === only sms === */}
                              {!row.cells[10].value && row.cells[11].value && (
                                <p>SMS</p>
                              )}
                            </div>

                            <div
                              className={`duration-300 ${
                                row.cells[19].value ? "rotate-180" : ""
                              }`}
                            >
                              <SmallDownArrowSVG />
                            </div>
                          </div>

                          {/* ==== showPanic -->  row.cells[19] ==== */}
                          {row.cells[19].value && (
                            <div
                              // ref={dropdownRef}
                              className="bg-white dark-shadow p-3 min-w-[96px] rounded-xl absolute bottom-[-45px] left-3 z-[100] "
                            >
                              {/* ==== email toggle ====  */}
                              <div className="flex items-center space-x-4 text-sm text-[#48525C] mb-1.5 ">
                                <p className="w-8">Email</p>
                                {/* ==== toggle button start ==== */}
                                <div
                                  onClick={() =>
                                    clickToggle(row.values, "panic_email")
                                  }
                                  className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                                >
                                  {/* ==== Switch ==== */}
                                  <div
                                    className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${
                                      !row.cells[10].value
                                        ? "bg-[#C9D1DA]"
                                        : ` transform translate-x-3 bg-primary`
                                    }`}
                                  ></div>
                                </div>
                              </div>

                              {/* ==== sms toggle ====  */}
                              <div className="flex items-center space-x-4 text-sm text-[#48525C] ">
                                <p className="w-8">SMS</p>
                                {/* ==== toggle button start ==== */}
                                <div
                                  onClick={() =>
                                    clickToggle(row.values, "panic_sms")
                                  }
                                  className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                                >
                                  {/* ==== Switch ==== */}
                                  <div
                                    className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${
                                      !row.cells[11].value
                                        ? "bg-[#C9D1DA]"
                                        : ` transform translate-x-3 bg-primary`
                                    }`}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          )}
                        </td>

                        {/* ======== offline ======== */}
                        <td className="relative px-3 text-sm text-[#48525C] whitespace-nowrap hidden md:table-cell">
                          <div
                            onClick={() =>
                              clickDropdown(row.values, "showOffline")
                            }
                            className="flex items-center gap-1 cursor-pointer select-none"
                          >
                            <div>
                              {/* === none === */}
                              {!row.cells[12].value && !row.cells[13].value && (
                                <p>None</p>
                              )}

                              {/* === email & sms === */}
                              {row.cells[12].value && row.cells[13].value && (
                                <p>Email | SMS</p>
                              )}

                              {/* === only email === */}
                              {row.cells[12].value && !row.cells[13].value && (
                                <p>Email</p>
                              )}

                              {/* === only sms === */}
                              {!row.cells[12].value && row.cells[13].value && (
                                <p>SMS</p>
                              )}
                            </div>

                            <div
                              className={`duration-300 ${
                                row.cells[20].value ? "rotate-180" : ""
                              }`}
                            >
                              <SmallDownArrowSVG />
                            </div>
                          </div>

                          {/* ==== showOffline -->  row.cells[20] ==== */}
                          {row.cells[20].value && (
                            <div
                              // ref={dropdownRef}
                              className="bg-white dark-shadow p-3 min-w-[96px] rounded-xl absolute bottom-[-45px] left-3 z-[100] "
                            >
                              {/* ==== email toggle ====  */}
                              <div className="flex items-center space-x-4 text-sm text-[#48525C] mb-1.5 ">
                                <p className="w-8">Email</p>
                                {/* ==== toggle button start ==== */}
                                <div
                                  onClick={() =>
                                    clickToggle(row.values, "offline_email")
                                  }
                                  className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                                >
                                  {/* ==== Switch ==== */}
                                  <div
                                    className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${
                                      !row.cells[12].value
                                        ? "bg-[#C9D1DA]"
                                        : ` transform translate-x-3 bg-primary`
                                    }`}
                                  ></div>
                                </div>
                              </div>

                              {/* ==== sms toggle ====  */}
                              <div className="flex items-center space-x-4 text-sm text-[#48525C] ">
                                <p className="w-8">SMS</p>
                                {/* ==== toggle button start ====  */}
                                <div
                                  onClick={() =>
                                    clickToggle(row.values, "offline_sms")
                                  }
                                  className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                                >
                                  {/* ==== Switch ==== */}
                                  <div
                                    className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${
                                      !row.cells[13].value
                                        ? "bg-[#C9D1DA]"
                                        : ` transform translate-x-3 bg-primary`
                                    }`}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          )}
                        </td>

                        {/* ======== disconnect ======== */}
                        <td className="relative px-3 text-sm text-[#48525C] whitespace-nowrap hidden md:table-cell">
                          <div
                            onClick={() =>
                              clickDropdown(row.values, "showDisconnect")
                            }
                            className="flex items-center gap-1 cursor-pointer select-none"
                          >
                            <div>
                              {/* === none === */}
                              {!row.cells[14].value && !row.cells[15].value && (
                                <p>None</p>
                              )}

                              {/* === email & sms === */}
                              {row.cells[14].value && row.cells[15].value && (
                                <p>Email | SMS</p>
                              )}

                              {/* === only email === */}
                              {row.cells[14].value && !row.cells[15].value && (
                                <p>Email</p>
                              )}

                              {/* === only sms === */}
                              {!row.cells[14].value && row.cells[15].value && (
                                <p>SMS</p>
                              )}
                            </div>

                            <div
                              className={`duration-300 ${
                                row.cells[21].value ? "rotate-180" : ""
                              }`}
                            >
                              <SmallDownArrowSVG />
                            </div>
                          </div>

                          {/* ==== showDisconnect -->  row.cells[21] ==== */}
                          {row.cells[21].value && (
                            <div
                              // ref={dropdownRef}
                              className="bg-white dark-shadow p-3 min-w-[96px] rounded-xl absolute bottom-[-45px] left-3 z-[100] "
                            >
                              {/* ==== email toggle ====  */}
                              <div className="flex items-center space-x-4 text-sm text-[#48525C] mb-1.5 ">
                                <p className="w-8">Email</p>
                                {/* ==== toggle button start ==== */}
                                <div
                                  onClick={() =>
                                    clickToggle(row.values, "disconnect_email")
                                  }
                                  className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                                >
                                  {/* Switch */}
                                  <div
                                    className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${
                                      !row.cells[14].value
                                        ? "bg-[#C9D1DA]"
                                        : ` transform translate-x-3 bg-primary`
                                    }`}
                                  ></div>
                                </div>
                              </div>

                              {/* ==== sms toggle ====  */}
                              <div className="flex items-center space-x-4 text-sm text-[#48525C] ">
                                <p className="w-8">SMS</p>
                                {/* ==== toggle button start ==== */}
                                <div
                                  onClick={() =>
                                    clickToggle(row.values, "disconnect_sms")
                                  }
                                  className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                                >
                                  {/* Switch */}
                                  <div
                                    className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${
                                      !row.cells[15].value
                                        ? "bg-[#C9D1DA]"
                                        : ` transform translate-x-3 bg-primary`
                                    }`}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          )}
                        </td>

                        {/* ======== edit ======== */}
                        <td
                          className={`rounded-r-[10px] px-3  text-[#48525C] hidden md:table-cell sticky -right-4 ${
                            index % 2 === 0 ? "bg-white" : "bg-[#F8FBFF]"
                          } `}
                        >
                          {/* ======== Device Status  ======== */}
                          <div
                            onClick={() => displaySelectedModal(row.values)}
                            className="relative "
                          >
                            <CustomToolTip
                              id={`device-${row.cells[0].value}`}
                              title={`Edit`}
                              containerClass="edit default-tooltip tooltipStyleChange"
                            >
                              <div className="group hover:bg-white rounded cursor-pointer w-8 h-8 flex items-center justify-center hover:dark-shadow ">
                                <EditTableSVG />
                              </div>
                            </CustomToolTip>
                          </div>
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

export default AlertManagementTable;
