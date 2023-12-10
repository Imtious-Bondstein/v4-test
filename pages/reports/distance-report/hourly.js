import DownloadSVG from "@/components/SVG/DownloadSVG";
import PrinterSVG from "@/components/SVG/PrinterSVG";
import LeftArrowPagination from "@/components/SVG/pagination/LeftArrowPaginateSVG";
import RightArrowPaginateSVG from "@/components/SVG/pagination/RightArrowPaginateSVG";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import HourlyDistanceChart from "@/components/charts/HourlyDistanceChart";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Layout from "@/components/layouts/Layout";
import HourlyDistanceTable from "@/components/tables/HourlyDistanceTable";
import ReportSingleVehicleSelector from "@/components/vehicleSelectors/ReportSingleVehicleSelector";
import axios from "@/plugins/axios";
import {
  hourlyDistanceDateTimePicker,
  hourlyDistanceTableDate,
  hourlyDistanceTableTime,
} from "@/utils/dateTimeConverter";
import React, { useEffect, useRef, useState } from "react";
import { CSVLink } from "react-csv";
import { useReactToPrint } from "react-to-print";

//====== toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const hourly_distance = () => {
  // STATE
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [chartContent, setChartContent] = useState({});

  const [selectedVehicle, setSelectedVehicle] = useState({});

  const previousDay = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(
      previousDay.getFullYear(),
      previousDay.getMonth(),
      previousDay.getDate(),
      0,
      0,
      0,
      0
    ),
    endDate: new Date(
      previousDay.getFullYear(),
      previousDay.getMonth(),
      previousDay.getDate(),
      23,
      59,
      59,
      999
    ),
  });

  // STATE FOR PAGINATION
  const [offset, setOffset] = useState(50);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // STATE FOR SELECTOR
  const [clicked, setClicked] = useState(false);
  const [fetched, setFetched] = useState(false);

  // SELECTOR =====================================
  const getSingleSelectedVehicle = async (vehicle) => {
    console.log("selected vehicle :", vehicle);
    setSelectedVehicle(vehicle);
    await fetchHourlyDistanceData(vehicle, 1);
  };

  // FETCHING API ==================================
  const fetchHourlyDistanceData = async (vehicle, pageNumber) => {
    setIsLoading(true);

    const data = {
      start_date_time: hourlyDistanceDateTimePicker(dateRange.startDate),
      end_date_time: hourlyDistanceDateTimePicker(dateRange.endDate),
      identifier: vehicle.v_identifier,
    };
    console.log("data", data);
    console.log("vehicle", vehicle);

    await axios
      .post("/api/v4/report/hourly-distance-report", data)
      .then((res) => {
        const hourlyDistance = res.data.hourlyDistanceReport;
        console.log("hourly res : ", hourlyDistance);
        setTotalItems(hourlyDistance.length);

        const calculatePages = Math.ceil(hourlyDistance.length / offset);
        setTotalPages(calculatePages);

        // if (hourlyDistance.total !== totalItems) {
        //   setTotalItems(hourlyDistance.total);
        // }
        hourlyDistance.map((item, index) => {
          item.sl = index + 1;
          item.bst_id = vehicle.bst_id;
        });

        setTableData(hourlyDistance.slice(0, offset));
        setAllData(hourlyDistance);
        setChartData(hourlyDistance);
        setChartContent(res.data.vehicle);
        setFetched(true);

        !hourlyDistance.length ? emptyPathsNotify() : null;
      })
      .catch((err) => {
        console.log("err.response", err.response);
        errorNotify(err.response.data.user_message);
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

  // HEADERS FOR CSV ===========================================
  const headers = [
    { label: "SL", key: "sl" },
    { label: "BSTID", key: "bst_id" },
    { label: "Date", key: "date" },
    { label: "Hour Start", key: "hour_start" },
    { label: "Hourt End", key: "hour_end" },
    { label: "Maximum Time", key: "maximum_speed" },
    { label: "Minimum Time", key: "minimum_speed" },
    { label: "Distance", key: "distance" },
  ];

  // PAGINATION

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
    console.log(calculatePages);
    console.log(totalItems);
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

  // PRINT CHART & TABLE =============================================================
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // CHECK FOR OUTSIDE CLICK FOR SELECTOR =============================================
  const handleOutsideSelectorClick = () => {
    setClicked(false);
  };

  return (
    <>
      <ToastContainer />
      <div className="flex">
        <div className="grow overflow-hidden md:mt-4">
          {/* PAGE TITLE */}
          <div className="flex items-center justify-between pb-3 md:pb-7">
            <h1 className="text-[#1E1E1E] text-lg md:text-[32px] font-bold">
              Hourly Distance Report
            </h1>
            {/* BUTTONS */}
            <div className="flex items-center space-x-2 md:space-x-6 mr-5 lg:mr-0">
              <button
                onClick={handlePrint}
                className={`fill-[#1E1E1E] flex items-center justify-center gap-3 px-4text-sm bg-[#FFFAE6] text-[#1E1E1E] rounded-lg w-[35px] sm:w-[48px] md:w-[110px] h-[35px] sm:h-[48px] shadow-md hover:shadow-xl duration-300`}
              >
                <PrinterSVG />
                <p className="hidden md:block">Print</p>
              </button>
              <CSVLink
                data={allData.map((item, index) => ({
                  ...item,
                  date: hourlyDistanceTableDate(item.date),
                  hour_start: hourlyDistanceTableTime(item.hour_start),
                  hour_end: hourlyDistanceTableTime(item.hour_end),
                  maximum_speed: Number(item.maximum_speed).toFixed(2),
                  minimum_speed: Number(item.minimum_speed).toFixed(2),
                  distance: item.distance.toFixed(2),
                }))}
                headers={headers}
                filename={"Hourly Distance Table Data.csv"}
              >
                <button
                  className={`fill-[#1E1E1E] flex items-center justify-center gap-3 px-4text-sm bg-[#FDD10E] text-[#1E1E1E] rounded-lg w-[35px] sm:w-[48px] md:w-[110px] h-[35px] sm:h-[48px] shadow-primary duration-300 hover:shadow-xl hover:shadow-primary/60`}
                >
                  <DownloadSVG />
                  <p className="hidden md:block">Export</p>
                </button>
              </CSVLink>
            </div>
          </div>
          {/* TABLE & CHART */}
          <div ref={componentRef}>
            <HourlyDistanceChart
              chartContent={chartContent}
              chartData={chartData}
              isLoading={isLoading}
              fetched={fetched}
            />
            <HourlyDistanceTable
              isLoading={isLoading}
              tableData={tableData}
              fetched={fetched}
            />
          </div>

          {/* ====== PAGINATION ====== */}
          <div className="pagination flex items-center justify-center md:justify-between pb-20">
            <div className="hidden md:flex items-center gap-4">
              <div>
                <label className="text-[#48525C] mr-2">Rows visible</label>
                <select
                  value={offset}
                  onChange={(e) => {
                    console.log(e.target.value, "Page offset is this");
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
        {/* SINGLE VEHICLE SELECTOR */}
        <div
          className={`${
            clicked === true ? "right-0" : "-right-96"
          } flex-none fixed lg:static lg:ml-4 lg:right-10 top-16 lg:shadow-none ease-in-out duration-700 rounded-3xl z-[3004] lg:z-40`}
        >
          <ReportSingleVehicleSelector
            isRequesting={isLoading}
            getSingleSelectedVehicle={getSingleSelectedVehicle}
            clicked={clicked}
            setClicked={setClicked}
            setDateRange={setDateRange}
            dateRange={dateRange}
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

export default hourly_distance;

hourly_distance.getLayout = function getLayout(page) {
  return (
    <ProtectedRoute>
      <Layout>
        <DashboardLayout>{page} </DashboardLayout>
      </Layout>
    </ProtectedRoute>
  );
};
