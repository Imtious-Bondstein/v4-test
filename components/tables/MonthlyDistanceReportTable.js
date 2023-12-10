"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

// === utility
import {
  getOnlyDay,
  monthlyDistanceReportExportDateTime,
} from "@/utils/dateTimeConverter";

// excel & pdf
import { CSVLink } from "react-csv";
import { useReactToPrint } from "react-to-print";
import PrintMonthlyDistanceReportTable from "../printTables/PrintMonthlyDistanceReportTable";

// ====== SVG
import DownloadSVG from "../SVG/DownloadSVG";
import PrinterSVG from "../SVG/PrinterSVG";

// ====== toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// css
import "../../styles/components/printLandscapeTable.css";
import axios from "@/plugins/axios";
import SpinSVG from "../SVG/SpinSVG";

const MonthlyDistanceReportTable = ({
  selectedVehicles,
  isLoading,
  selectedMonth,
  offset,
  getNumberOfDays,
  createFullMonthArray,
}) => {
  const [totalDays, setTotalDays] = useState([]);
  const componentRef = useRef();
  const [total, setTotal] = useState([]);
  const [isTotal, setIsTotal] = useState(false);
  const [clickOutside, setclickOutside] = useState(false);

  //=======header for csv
  const headers = [
    { label: "Sl", key: "sl" },
    { label: "Code", key: "bst_id" },
    { label: "VRN", key: "vrn" },
    { label: "Vehicle", key: "vehicle_name" },
    { label: "1", key: "fullMonth[0]" },
    { label: "2", key: "fullMonth[1]" },
    { label: "3", key: "fullMonth[2]" },
    { label: "4", key: "fullMonth[3]" },
    { label: "5", key: "fullMonth[4]" },
    { label: "6", key: "fullMonth[5]" },
    { label: "7", key: "fullMonth[6]" },
    { label: "8", key: "fullMonth[7]" },
    { label: "9", key: "fullMonth[8]" },
    { label: "10", key: "fullMonth[9]" },
    { label: "11", key: "fullMonth[10]" },
    { label: "12", key: "fullMonth[11]" },
    { label: "13", key: "fullMonth[12]" },
    { label: "14", key: "fullMonth[13]" },
    { label: "15", key: "fullMonth[14]" },
    { label: "16", key: "fullMonth[15]" },
    { label: "17", key: "fullMonth[16]" },
    { label: "18", key: "fullMonth[17]" },
    { label: "19", key: "fullMonth[18]" },
    { label: "20", key: "fullMonth[19]" },
    { label: "21", key: "fullMonth[20]" },
    { label: "22", key: "fullMonth[21]" },
    { label: "23", key: "fullMonth[22]" },
    { label: "24", key: "fullMonth[23]" },
    { label: "25", key: "fullMonth[24]" },
    { label: "26", key: "fullMonth[25]" },
    { label: "27", key: "fullMonth[26]" },
    { label: "28", key: "fullMonth[27]" },
    { label: "29", key: "fullMonth[28]" },
    { label: "30", key: "fullMonth[29]" },
    { label: "31", key: "fullMonth[30]" },
  ];

  const [data, setData] = useState([]);
  const [isExporting, setIsExporting] = useState(false);

  const calculateTotal = (vehicles) => {
    const newTotal = createFullMonthArray();

    vehicles.map((item) => {
      item.fullMonth.map((dayValue, index) => {
        newTotal[index] = newTotal[index] + parseFloat(dayValue);
      });
    });
    setTotal(newTotal);
    setData(vehicles);
  };

  // EXPORT FUNCTION ===================================================
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
      identifier: identifier,
      month: monthlyDistanceReportExportDateTime(selectedMonth),
    };
    // console.log("request data", data);

    await axios
      .post("/api/v4/report/monthly-distance-report-export", data)
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
    console.log(selectedVehicles, "fetched");
    setData(
      selectedVehicles.map((item, index) => ({
        ...item,
        displayDropdownInfo: false,
      }))
    );
  }, [selectedVehicles]);

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

  const initData = (selectedVehicles) => {
    selectedVehicles.map((vehicle, index) => {
      vehicle.data_array.map((vehicleDate, index) => {
        vehicle.fullMonth[getOnlyDay(vehicleDate.date) - 1] =
          vehicleDate.distance;
      });
    });
    calculateTotal(selectedVehicles);
  };

  const handlePrintTable = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    initData(selectedVehicles);
  }, [selectedVehicles]);

  useEffect(() => {
    const monthLength = getNumberOfDays();
    const newArrayForDays = [];

    for (let i = 1; i <= monthLength; i++) {
      newArrayForDays.push(i);
    }

    setTotalDays(newArrayForDays);
  }, [selectedMonth]);

  // ==== skeleton
  const divCount = offset;
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

  return (
    <div className="">
      {/*  ==== Table name and buttons  ====  */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-primaryText sm:text-[18px] lg:text-[23px] xl:text-[32px] font-bold ">
          Monthly Distance Report
        </h1>
        <div className="flex space-x-2 md:space-x-4 mr-8 lg:mr-0">
          <div>
            <button
              onClick={handlePrintTable}
              className={`flex items-center justify-center gap-3  text-sm bg-white text-tertiaryText rounded-lg w-[32px] h-[32px] xs:w-[42px] md:w-[110px] xs:h-[42px] md:h-[48px] tmv-shadow hover:shadow-xl fill-tmvGray`}
            >
              <PrinterSVG />
              <p className="hidden md:block">Print</p>
            </button>
          </div>

          {/* ==== table for print ===  */}
          <PrintMonthlyDistanceReportTable
            data={data}
            totalDays={totalDays}
            componentRef={componentRef}
          />

          <div>
            <button
              onClick={handleExport}
              disabled={!selectedVehicles.length}
              className={`fill-primaryText flex items-center justify-center gap-3  text-sm bg-primary text-primaryText rounded-lg w-[32px] h-[32px] xs:w-[42px] md:w-[110px] xs:h-[42px] md:h-[48px] primary-shadow hover:shadow-xl hover:shadow-primary/60 duration-300 ${
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
      </div>
      {/* NEW TABLE */}
      <div className="bg-white p-5 rounded-xl h-[75vh] overflow-auto mt-5">
        {isLoading ? (
          <div className="w-full">{skeletonDiv}</div>
        ) : (
          <table className="bg-white p-5 h-full w-full">
            <thead>
              <tr className="h-[70px] bg-[#FFFAE6] w-fit hidden md:table-header-group">
                {/* SL */}
                <td className="w-[100px] px-3 rounded-l-md font-bold">Sl.</td>
                {/* CODE */}
                <td className="w-[200px] px-3 font-bold ">Code</td>
                {/* VEHICLE */}
                <td className="w-[200px] px-3 font-bold ">Vehicle</td>
                {/* MONTHLY DISTANCE */}
                {totalDays.map((day, index) => {
                  return (
                    <td
                      key={index}
                      className={`w-[140px] px-3 font-bold ${
                        totalDays.length == day ? "rounded-r-md" : ""
                      } `}
                    >
                      {day}
                    </td>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white flex items-center md:h-[81px] w-fit rounded-md">
                {/* SL */}
                <td className="w-[100px] px-3 hidden md:table-cell"></td>
                {/* CODE */}
                <td className="w-[200px] px-3 hidden md:table-cell"></td>
                {/* VEHICLE */}
                <td
                  onClick={() => setIsTotal(!isTotal)}
                  className={`w-full md:w-[200px] px-3 py-2 text-quaternary font-medium duration-300 ease-in-out bg-[#FFFAE6] md:bg-white`}
                >
                  <p
                    className={`${
                      isTotal === true ? "text-center" : "text-start"
                    } md:text-start`}
                  >
                    Total Km
                  </p>
                  {/* TOTAL FOR SMALL DEVICE */}
                  <div
                    className={`${
                      isTotal === true
                        ? "h-[650px] xs:h-[430px] sm:h-[240px]"
                        : "h-[0] overflow-hidden"
                    } flex flex-wrap justify-center md:hidden duration-300 ease-in-out`}
                  >
                    {total.map((day, index) => {
                      return (
                        <div>
                          <p
                            // key={index}
                            className="text-quaternary font-bold border border-collapse w-[80px] text-center text-[12px]"
                          >
                            {index + 1}
                          </p>
                          <p
                            // key={index}
                            className="text-primaryText border border-collapse w-[80px] text-center text-[12px]"
                          >
                            {day ? day.toFixed(2) : day} km
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </td>
                {total.map((day, index) => {
                  return (
                    <td
                      // key={index}
                      className="w-[140px] px-3 text-quaternary font-medium hidden md:table-cell"
                    >
                      {day ? day.toFixed(2) : day}
                    </td>
                  );
                })}
              </tr>

              {data.map(
                (
                  {
                    sl,
                    bst_id,
                    vehicle_name,
                    data_array,
                    fullMonth,
                    displayDropdownInfo,
                  },
                  index
                ) => {
                  return (
                    <tr
                      // key={index}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-tableRow"
                      } flex items-center md:h-[81px] w-full rounded-md`}
                    >
                      {/* SL */}
                      <td className="w-[100px] px-3 hidden md:table-cell">
                        {sl}
                      </td>
                      {/* CODE */}
                      <td className="w-[200px] px-3 hidden md:table-cell">
                        {bst_id}
                      </td>
                      {/* VEHICLE */}
                      <td className="w-[200px] px-3 hidden md:table-cell">
                        {vehicle_name}
                      </td>
                      {fullMonth.map((day, index) => {
                        return (
                          <td
                            // key={index}
                            className="w-[140px] px-3 hidden md:table-cell"
                          >
                            {day ? day.toFixed(2) : day}
                          </td>
                        );
                      })}
                      {/* TABLE DETAILS FOR SMALL SCREEN */}
                      <td
                        onClick={() => handleDropDownData(sl)}
                        className={`p-3 flex flex-col space-y-2 duration-300 ease-in-out rounded-[10px] md:rounded-none md:hidden w-full`}
                      >
                        <div className="flex items-center text-tertiaryText text-sm font-bold">
                          <p>Code:&nbsp;</p>
                          <p>{bst_id}</p>
                        </div>
                        <div
                          className={` ${
                            displayDropdownInfo === true
                              ? "h-[670px] xs:h-[460px] sm:h-[240px]"
                              : "h-[0] overflow-hidden"
                          } flex flex-col space-y-2 duration-300 ease-in-out w-full`}
                        >
                          <div className="flex items-center text-tertiaryText text-sm font-medium">
                            <p>Vehicle name:&nbsp;</p>
                            <p>{vehicle_name}</p>
                          </div>
                          {/* TOTAL FOR SMALL DEVICE */}
                          <div
                            className={` flex flex-wrap justify-start md:hidden duration-300 ease-in-out`}
                          >
                            {fullMonth?.map((item, index) => {
                              return (
                                <div>
                                  <p
                                    // key={index}
                                    className="text-quaternary font-bold border border-collapse w-[80px] text-center text-[12px]"
                                  >
                                    {index + 1}
                                  </p>
                                  <p className="text-primaryText border border-collapse w-[80px] text-center text-[12px]">
                                    {item ? item.toFixed(2) : item} km
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
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
  );
};

export default MonthlyDistanceReportTable;
