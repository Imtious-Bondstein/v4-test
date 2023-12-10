import DownloadSVG from "@/components/SVG/DownloadSVG";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import SpeedReportChart from "@/components/charts/SpeedReportChart";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Layout from "@/components/layouts/Layout";
import LocationSingleVehicleSelector from "@/components/vehicleSelectors/LocationSingleVehicleSelector";
import React, { useEffect, useRef, useState } from "react";
import { CSVLink } from "react-csv";
// 9
import {
  getYearMonthDay,
  hourlyDistanceDateTimePicker,
  hourlyDistanceTableTime,
  speedReportTableDate,
} from "@/utils/dateTimeConverter";
import { hourToSecond } from "@/utils/intervalFormatter";
import axios from "@/plugins/axios";
import SpeedReportSingleVehicleSelector from "@/components/vehicleSelectors/SpeedReportSingleVehicleSelector";
import PrinterSVG from "@/components/SVG/PrinterSVG";
import { useReactToPrint } from "react-to-print";
import DailyDistanceTable from "@/components/tables/DailyDistanceTable";
import { engineReportTableData } from "@/utils/engineReportTableData";
import EngineReportChart from "@/components/charts/EngineReportChart";
import EngineReportTable from "@/components/tables/EngineReportTable";
import LeftArrowPagination from "@/components/SVG/pagination/LeftArrowPaginateSVG";
import RightArrowPaginateSVG from "@/components/SVG/pagination/RightArrowPaginateSVG";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EngineReportBarChartSkeleton from "@/components/skeleton/EngineReportBarChartSkeleton";

const engine = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [dateRange, setDateRange] = useState({
    date: new Date(),
  });
  const [interval, setInterval] = useState(1);
  const selectedIdentifiers = useRef(null);
  const [data, setData] = useState([]);
  const [profileData, setProfileData] = useState([]);
  const [isTable, setIsTable] = useState(true);
  const [xlScreen, setXlScreen] = useState(true);
  // STATE
  const [tableData, setTableData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [chartContent, setChartContent] = useState({});

  const [selectedVehicle, setSelectedVehicle] = useState({});
  const [vehicleData, setVehicleData] = useState({});

  // STATE FOR PAGINATION ==============================================
  const [offset, setOffset] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // STATE FOR SELECTOR
  const [fetched, setFetched] = useState(false);

  // SELECTOR =====================================
  const getSingleSelectedVehicle = async (vehicle) => {
    console.log("selected vehicle :", vehicle);
    setSelectedVehicle(vehicle);
    await fetchEngineReportdata(vehicle, 1);
  };

  // FETCHING API ==================================
  const fetchEngineReportdata = async (vehicle, pageNumber) => {
    setIsLoading(true);
    setChartData([]);
    setTableData([]);

    const data = {
      date: getYearMonthDay(dateRange.date),
      identifier: vehicle.v_identifier,
    };
    console.log("data", data);

    await axios
      .post("/api/v4/report/engine-report", data)
      .then((res) => {
        const engineReport = res.data.engineReport;
        console.log("engine report : ", engineReport);
        console.log("engine report 2 : ", res.data);
        setTotalItems(engineReport.length);

        const calculatePages = Math.ceil(engineReport.length / offset);
        setTotalPages(calculatePages);

        // if (hourlyDistance.total !== totalItems) {
        //   setTotalItems(hourlyDistance.total);
        // }
        engineReport.map((item, index) => {
          item.sl = index + 1;
        });

        setTableData(engineReport.slice(0, offset));
        setAllData(engineReport);
        setChartData(engineReport);
        setVehicleData(res.data);
        setChartContent(res.data.vehicle);
        setFetched(true);

        !engineReport.length ? emptyPathsNotify() : null;
      })
      .catch((err) => {
        console.log("err.response", err.response);
        errorNotify(err.response.data?.user_message);
      })
      .finally(() => setIsLoading(false));
  };

  const successNotify = () => {
    toast.success("Data loaded!", {
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

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

  // HEADERS FOR CSV ====================================================
  const headers = [
    { label: "Identifier", key: "terminal_data_identifier" },
    { label: "BSTID", key: "bst_id" },
    { label: "Engine Status", key: "engine_status" },
    { label: "From Time", key: "from_time" },
    { label: "To Time", key: "to_time" },
    { label: "Duration	", key: "duration" },
  ];

  // PRINT ==============================================================
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // CHECK FOR OUTSIDE CLICK FOR SELECTOR ===============================
  const handleOutsideSelectorClick = () => {
    setClicked(false);
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

    setTableData(allData.slice(startIndex, endIndex));
  };

  // paginate button clicks
  const handlePageClick = (page) => {
    setCurrentPage(page);
    updateData(page);
  };

  useEffect(() => {
    setCurrentPage(1);
    setOffset(offset);

    const calculatePages = Math.ceil(totalItems / offset);
    setTotalPages(calculatePages);
    // console.log(calculatePages);
    // console.log(totalItems);
    updateData(1);
  }, [offset]);

  // update if total item changes
  // useEffect(() => {
  //   let calculatePages = Math.ceil(totalItems / offset);
  //   setTotalPages(calculatePages);
  // }, [totalItems]);

  // update if selected cars changes
  useEffect(() => {
    console.log("selectedVehicle", selectedVehicle);
    if (!selectedVehicle.bst_id) {
      setTotalItems(0);
    }
  }, [selectedVehicle]);

  return (
    <>
      <ToastContainer />
      <div className="flex justify-between w-full space-x-4">
        <div className="flex-grow overflow-hidden w-full">
          {/* PAGE TITLE & BUTTONS */}
          <div className="flex items-center justify-between pb-5 md:pb-7">
            <h1 className="text-[#1E1E1E] text-xl md:text-[32px] font-bold">
              Engine Report
            </h1>
            {/* BUTTONS */}
            <div className="flex space-x-5">
              <button
                onClick={handlePrint}
                className="flex items-center justify-center space-x-4 bg-secondary px-4 text-sm tmv-shadow hover:shadow-xl rounded-[12px] w-[32px] xs:w-[42px] lg:w-[120px] h-[32px] xs:h-[42px] lg:h-[48px] duration-300"
              >
                <PrinterSVG />
                <p className={`lg:block hidden text-xs`}>Print</p>
              </button>
              <CSVLink
                headers={headers}
                data={allData.map((item) => ({
                  ...item,
                  terminal_data_identifier: item.terminal_data_identifier,
                  bst_id: selectedVehicle.bst_id,
                  engine_status: item.engine_status,
                  from_time: speedReportTableDate(item.from_time),
                  to_time: speedReportTableDate(item.to_time),
                  hour_start: hourlyDistanceTableTime(item.hour_start),
                  hour_end: hourlyDistanceTableTime(item.hour_end),
                  duration: item.duration,
                }))}
                filename={"Engine Report Data.csv"}
                // className="shadow-primary"
              >
                <button
                  className={`fill-[#1E1E1E] flex items-center justify-center gap-3 px-4 text-sm bg-[#FDD10E] text-[#1E1E1E] rounded-[12px] w-[32px] xs:w-[42px] lg:w-[120px] h-[32px] xs:h-[42px] lg:h-[48px] duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/60`}
                >
                  <DownloadSVG />
                  <p className="hidden lg:block">Export</p>
                </button>
              </CSVLink>
            </div>
          </div>
          <div ref={componentRef}>
            {/* CHART */}
            <div>
              <EngineReportChart
                chartData={chartData}
                vehicleData={vehicleData}
                isLoading={isLoading}
              />
            </div>
            {/* TABLE */}
            <div className="my-5">
              <EngineReportTable
                isLoading={isLoading}
                tableData={tableData}
                setProfileData={setProfileData}
                isTable={isTable}
                setIsTable={setIsTable}
                fetched={fetched}
              />
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
        {/* SINGLE SELECTOR */}
        <div
          className={`${clicked === true ? "right-0" : "-right-96"} ${
            xlScreen === true
              ? "xl:z-40 xl:right-10 xl:shadow-none xl:flex-none lg:block lg:static xl:ml-4"
              : "lg:z-40 lg:right-10 lg:shadow-none lg:flex-none lg:block lg:static lg:ml-4"
          } flex-none fixed top-20 ease-in-out duration-700 rounded-3xl z-[3004]`}
        >
          <SpeedReportSingleVehicleSelector
            isRequesting={isLoading}
            getSingleSelectedVehicle={getSingleSelectedVehicle}
            clicked={clicked}
            setClicked={setClicked}
            setDateRange={setDateRange}
            dateRange={dateRange}
            setInterval={setInterval}
            interval={interval}
            // top={"top-20 lg:top-20"}
            top={`${clicked === true ? "top-0 lg:top-20" : "lg:top-20"}`}
            margin={"-mt-3 lg:-mt-1"}
            height={"min-h-[450px] h-[75vh]"}
          />
        </div>
      </div>

      {/* BLUR FILTER FOR SMALL DEVICES */}
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

export default engine;

engine.getLayout = function getLayout(page) {
  return (
    <ProtectedRoute>
      <Layout>
        <DashboardLayout>{page}</DashboardLayout>
      </Layout>
    </ProtectedRoute>
  );
};
