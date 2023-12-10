import DownloadSVG from "@/components/SVG/DownloadSVG";
import PrinterSVG from "@/components/SVG/PrinterSVG";
import LeftArrowPagination from "@/components/SVG/pagination/LeftArrowPaginateSVG";
import RightArrowPaginateSVG from "@/components/SVG/pagination/RightArrowPaginateSVG";
import ColumnTableSVG from "@/components/SVG/table/ColumnTableSVG";
import GraphTableSVG from "@/components/SVG/table/GraphTableSVG";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import DailyDistanceChart from "@/components/charts/DailyDistanceChart";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Layout from "@/components/layouts/Layout";
import DailyDistanceTable from "@/components/tables/DailyDistanceTable";
import DailySingleVehicleSelector from "@/components/vehicleSelectors/DailySingleVehicleSelector";
import ReportSingleVehicleSelector from "@/components/vehicleSelectors/ReportSingleVehicleSelector";
import axios from "@/plugins/axios";
import { dailyDistanceTableData } from "@/utils/dailyDistanceTableData";
import React, { useEffect, useRef, useState } from "react";
import { CSVLink } from "react-csv";
import { useReactToPrint } from "react-to-print";
import { async } from "regenerator-runtime";

//====== toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  dailyDistanceTableTime,
  dailyDistanceTableTimes,
  hourlyDistanceTableDate,
} from "@/utils/dateTimeConverter";
import PrintTop from "@/components/print/PrintTop";
import PrintBottom from "@/components/print/PrintBottom";

const daily_distance = () => {
  // STATE
  const [isLoading, setIsLoading] = useState(false);
  const [dailyReportData, setDailyReportData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [currentlySelectedVehicle, setCurrentlySelectedVehicle] =
    useState(null);
  const [isTable, setIsTable] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedVehicleIdentifier, setSelectedVehicleIdentifier] =
    useState(null);
  const toggleClass = "transform translate-x-10";

  // STATE FOR PAGINATION
  const [offset, setOffset] = useState(50);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [csvData, setCsvData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  // STATE FOR SELECTOR
  const [clicked, setClicked] = useState(false);
  const [fetched, setFetched] = useState(false);

  // HEADERS FOR CSV ===========================================
  const headers = [
    { label: "SL", key: "sl" },
    { label: "BSTID", key: "bst_id" },
    { label: "Date", key: "date" },
    { label: "Start Time", key: "start_time" },
    { label: "End Time", key: "end_time" },
    { label: "Duration", key: "duration" },
    { label: "Distance", key: "distance" },
  ];

  // =======print functionality start=======
  const [isPrinting, setIsPrinting] = useState(false);
  const printRef = useRef();
  const promiseResolveRef = useRef(null);

  useEffect(() => {
    if (isPrinting && promiseResolveRef.current) {
      // Resolves the Promise, letting `react-to-print` know that the DOM updates are completed
      setTimeout(() => {
        promiseResolveRef.current();
      }, 10)
    }
  }, [isPrinting]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onBeforeGetContent: () => {
      return new Promise((resolve) => {
        promiseResolveRef.current = resolve;
        setIsPrinting(true);
      });
    },
    onAfterPrint: () => {
      // Reset the Promise resolve so we can print again
      promiseResolveRef.current = null;
      setIsPrinting(false);
    }
  });
  // =======print functionality end=======

  // FETCHING DATA FROM API
  const fetchData = async () => {
    setIsLoading(true);

    const data = {
      identifier: selectedVehicleIdentifier,
      month: selectedDate.getMonth() + 1,
      year: selectedDate.getFullYear(),
    };
    console.log("---> daily data : ", data);

    await axios
      .post("/api/v4/report/daily-distance-report", data)
      .then((res) => {
        console.log("-- daily data res------", res);
        const distance_report = res.data.dailyDistanceReport;

        setTotalItems(distance_report.length);

        const calculatePages = Math.ceil(distance_report.length / offset);
        setTotalPages(calculatePages);

        distance_report.map((item, index) => {
          item.sl = index + 1;
          item.bst_id = res.data.vehicle.bst_id
        });

        setAllData(distance_report);
        setDailyReportData(distance_report.slice(0, offset));
        setCurrentlySelectedVehicle(res.data.vehicle);
        // console.log('currently selected', res.data.vehicle);
        setFetched(true);

        !distance_report.length ? emptyPathsNotify() : null;
      })
      .catch((err) => {
        console.log(err);
        errorNotify(err.response.data?.user_message);
      })
      .finally(() => setIsLoading(false));
    // setTotalItems(dailyDistanceTableData.length);
    // setProfileData(dailyDistanceTableData?.slice(0, offset));
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

  const updateData = (page) => {
    const startIndex = (page - 1) * offset;
    const endIndex = startIndex + offset;

    setDailyReportData(allData.slice(startIndex, endIndex));
  };

  // paginate button clicks
  const handlePageClick = (page) => {
    setCurrentPage(page);
    updateData(page);
  };

  // update if visible rows changes
  useEffect(() => {
    setCurrentPage(1);
    setOffset(offset);

    const calculatePages = Math.ceil(totalItems / offset);
    console.log(calculatePages);
    console.log(totalItems);
    setTotalPages(calculatePages);
    updateData(1);
  }, [offset]);

  //=======toast message
  const emptyPathsNotify = () => {
    toast.warning("Not sufficient data to render.", {
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

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


  // CHECK FOR OUTSIDE CLICK FOR SELECTOR ===============================
  const handleOutsideSelectorClick = () => {
    setClicked(false);
  };

  // SELECTOR ===========================================================
  const getSingleSelectedVehicle = async (vehicle, startDate, endDate) => {
    setSelectedVehicle(vehicle);
    await fetchSingleVehicleRoute(vehicle, startDate, endDate);
  };

  useEffect(() => {
    if (selectedDate && selectedVehicleIdentifier) {
      fetchData();
    }
  }, [selectedDate, selectedVehicleIdentifier]);

  const totalDistance = () => {
    let totalDistance = 0;
    dailyReportData.map((data) => {
      totalDistance += parseFloat(data.distance);
    });
    return totalDistance.toFixed(2);
  };

  return (
    <>
      <ToastContainer />
      <div className="flex">
        <div className="grow overflow-hidden mt-6 xs:mt-4 md:mt-8">
          {/* PAGE TITLE */}
          <div className="flex items-center justify-between pb-7 md:pb-7">
            <h1 className="text-[#1E1E1E] text-xl md:text-[32px] font-bold">
              Daily Distance Report
            </h1>
            {/* BUTTONS */}
            <div className="flex items-center space-x-2 xs:space-x-6 mr-4 lg:mr-0.5 xs:mr-8">
              <button
                onClick={handlePrint}
                className={`fill-[#1E1E1E] flex items-center justify-center gap-3 px-4text-sm bg-[#FFFAE6] text-[#1E1E1E] rounded-[12px] w-[32px] xs:w-[42px] md:w-[120px] h-[32px] xs:h-[42px] md:h-[48px] shadow-md duration-300 hover:shadow-xl`}
              >
                <PrinterSVG />
                <p className="hidden md:block">Print</p>
              </button>
              <CSVLink
                data={allData?.map((item, index) => ({
                  ...item,
                  sl: index + 1,
                  date: hourlyDistanceTableDate(item.date),
                  start_time: dailyDistanceTableTimes(item.start_time),
                  end_time: dailyDistanceTableTime(item.end_time),
                  duration: item.duration,
                  distance: parseFloat(item.distance).toFixed(2),
                }))}
                headers={headers}
                filename={"Daily Distance Table Data.csv"}
              >
                <button
                  className={`fill-[#1E1E1E] flex items-center justify-center gap-3 px-4text-sm bg-[#FDD10E] text-[#1E1E1E] rounded-[12px] w-[32px] xs:w-[42px] md:w-[120px] h-[32px] xs:h-[42px] md:h-[48px] shadow-primary/60 duration-300 hover:shadow-primary/60 shadow-md hover:shadow-xl`}
                >
                  <DownloadSVG />
                  <p className="hidden md:block">Export</p>
                </button>
              </CSVLink>
            </div>
          </div>
          {/* TABLE & CHART */}
          <div ref={printRef} className={`${isPrinting ? 'fixed top-0 left-0 w-full h-full bg-white z-[5000]' : ''}`}>
            {isPrinting && <PrintTop />}
            <div

              className={`${!isTable ? "mb-20" : "mb-4"
                } bg-white p-2 xs:p-6 py-[29px] rounded-2xl`}
            >
              {(fetched === true && dailyReportData.length) || isLoading ? (
                <div>
                  {/* VEHICLE NUMBER & TABLE TOGGLE BUTTON */}
                  {isLoading ? (
                    <div className="flex justify-between items-center mb-4 md:mb-8">
                      <div className="h-10 w-40 border-4 skeleton-border rounded-xl p-2 mt-3">
                        <div className="h-full skeleton rounded-xl"></div>
                      </div>
                      <div className="h-10 w-20 border-4 skeleton-border rounded-xl p-2 mt-3">
                        <div className="h-full skeleton rounded-xl"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center mb-4 md:mb-8">
                      <div className="flex flex-col md:flex-row md:items-center">
                        <h6 className="text-sm xs:text-base md:text-2xl font-bold md:font-medium">
                          {currentlySelectedVehicle.bst_id +
                            ": " +
                            currentlySelectedVehicle.vehicle_name}
                        </h6>
                        <span className="hidden md:block text-sm md:text-2xl font-bold md:font-medium -mt-1">
                          &nbsp; | &nbsp;
                        </span>
                        <p className="text-sm md:text-lg text-tmvDarkGray mt-1.5 md:mt-0">
                          Total: {totalDistance()} km
                        </p>
                      </div>

                      {/* toggle button start */}
                      <div
                        className="w-20 md:w-40 h-7 lg:h-9 flex items-center bg-white rounded-[10px] cursor-pointer tmv-shadow relative z-0 text-sm font-normal"
                        onClick={() => setIsTable(!isTable)}
                      >
                        {/* Switch */}
                        <div className="w-20 md:w-40 h-7 lg:h-9 flex justify-center items-center absolute space-x-4 top-0 left-0  text-tertiaryText">
                          <div className="flex items-center space-x-1">
                            <ColumnTableSVG />
                            <span className="hidden md:block">Table</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <GraphTableSVG />
                            <span className="hidden md:block">Graph</span>
                          </div>
                        </div>
                        <div
                          className={
                            "bg-primary primary-shadow z-10 w-10 md:w-20 h-7 lg:h-9 flex justify-center items-center rounded-[10px] transform duration-300 ease-in-out" +
                            (isTable
                              ? null
                              : "transform translate-x-10 md:translate-x-20")
                          }
                        >
                          {isTable ? (
                            <div className="flex items-center space-x-1">
                              <ColumnTableSVG />
                              <span className="hidden md:block">Table</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1">
                              <GraphTableSVG />
                              <span className="hidden md:block">Graph</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* toggle button end */}
                    </div>
                  )}

                  {isTable === true ? (
                    <DailyDistanceTable
                      isLoading={isLoading}
                      dailyReportData={dailyReportData}
                      fetched={fetched}
                    />
                  ) : (
                    <DailyDistanceChart
                      isLoading={isLoading}
                      dailyReportData={allData}
                      fetched={fetched}
                    />
                  )}
                </div>
              ) : fetched === true ? (
                <div className="w-full h-[73vh] flex justify-center items-center">
                  Not Sufficient Data to Render.
                </div>
              ) : (
                <div className="w-full h-[73vh] flex justify-center items-center">
                  Please Select A vehicle
                </div>
              )}
            </div>
            {isPrinting && <PrintBottom />}
          </div>
          {/* ====== PAGINATION ====== */}
          {isTable && (
            <div className="pagination flex items-center justify-center md:justify-between pb-20">
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
                    {[10, 20, 30, 40, 50, 75, 100].map((pageNumber) => (
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
                      className={`rounded-lg w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-[#FDD10E] hover:primary-shadow ${page === currentPage
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
                      currentPage < totalPages &&
                      handlePageClick(currentPage + 1)
                    }
                  >
                    <RightArrowPaginateSVG />
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
        {/* SINGLE VEHICLE SELECTOR */}
        <div
          className={`${clicked === true ? "right-0" : "-right-96"
            } flex-none fixed lg:static lg:ml-4 lg:right-10 top-16 lg:shadow-none ease-in-out duration-700 rounded-3xl z-[3004] lg:z-40`}
        >
          <DailySingleVehicleSelector
            isRequesting={isLoading}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            setSelectedVehicleIdentifier={setSelectedVehicleIdentifier}
            clicked={clicked}
            setClicked={setClicked}
          />
        </div>
      </div>
      {/* BLUR FILTER */}
      {!clicked ? (
        ""
      ) : (
        <div
          onClick={() => handleOutsideSelectorClick()}
          className="lg:hidden blur-filter"
        ></div>
      )}
    </>
  );
};

export default daily_distance;

daily_distance.getLayout = function getLayout(page) {
  return (
    <ProtectedRoute>
      <Layout>
        <DashboardLayout>{page} </DashboardLayout>
      </Layout>
    </ProtectedRoute>
  );
};
