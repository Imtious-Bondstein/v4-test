import DownloadSVG from "@/components/SVG/DownloadSVG";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import SpeedReportChart from "@/components/charts/SpeedReportChart";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Layout from "@/components/layouts/Layout";
import LocationSingleVehicleSelector from "@/components/vehicleSelectors/LocationSingleVehicleSelector";
import React, { useRef, useState } from "react";
import { CSVLink } from "react-csv";
import { getYearMonthDay } from "@/utils/dateTimeConverter";
import { hourToSecond } from "@/utils/intervalFormatter";
import axios from "@/plugins/axios";
import SpeedReportSingleVehicleSelector from "@/components/vehicleSelectors/SpeedReportSingleVehicleSelector";
import "../../styles/globals.css";

const speed = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [dateRange, setDateRange] = useState({
    date: new Date(),
  });
  const [interval, setInterval] = useState(1);
  const selectedIdentifiers = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [offset, setOffset] = useState(10);
  const [data, setData] = useState([]);
  const [xlScreen, setXlScreen] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState({});
  const [chartData, setChartData] = useState([]);
  const [vehicleData, setVehicleData] = useState({});

  // SELECTED VEHICLE ===============================
  const getSingleSelectedVehicle = async (vehicle) => {
    console.log("selected vehicle :", vehicle);
    setSelectedVehicle(vehicle);
    await fetchSpeedReportData(vehicle);
  };

  // FETCHING API ==================================
  const fetchSpeedReportData = async (vehicle) => {
    setIsLoading(true);

    const data = {
      identifier: vehicle.v_identifier,
      date: getYearMonthDay(dateRange.date),
    };

    console.log("--- data ---", data);

    await axios
      .post("/api/v4/report/speed-report", data)
      .then((res) => {
        const speedReportData = res.data.speedReport;
        console.log("--- data ---", speedReportData);
        setChartData(speedReportData);
        setVehicleData(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  };

  // CHECK FOR OUTSIDE CLICK FOR SELECTOR ==============================
  const handleOutsideSelectorClick = () => {
    setClicked(false);
  };

  // HEADERS FOR CSV ====================================================
  const headers = [
    { label: "SL", key: "sl" },
    { label: "BSTID", key: "bst_id" },
    { label: "Speed", key: "speed" },
    { label: "Minimum Speed", key: "minimum_speed" },
    { label: "Maximum Speed	", key: "maximum_speed" },
    { label: "Average Speed", key: "average_speed" },
    { label: "Time", key: "time" },
  ];

  return (
    <div className="overflow-hidden">
      <div className={`flex justify-between w-full space-x-4 `}>
        {/* CHART */}
        <div className="flex-grow overflow-hidden w-full mb-20">
          {/* PAGE TITLE & BUTTONS */}
          <div className="flex items-center justify-between pb-7 md:pb-7">
            <h1 className="text-[#1E1E1E] text-xl md:text-[32px] font-bold">
              Speed Report
            </h1>
            {/* BUTTONS */}
            <CSVLink
              headers={headers}
              data={chartData.map((item, index) => ({
                ...item,
                sl: index + 1,
                bst_id: selectedVehicle.bst_id,
                date: item.time,
                speed: item.speed,
                minimum_speed: item.minimum_speed,
                maximum_speed: item.maximum_speed,
                average_speed: item.average_speed,
              }))}
              filename={"Speed Report Data.csv"}
              className="shadow-primary"
            >
              <button
                className={`fill-[#1E1E1E] flex items-center justify-center gap-3 px-4 text-sm bg-[#FDD10E] text-[#1E1E1E] rounded-[12px] w-[32px] xs:w-[42px] md:w-[120px] h-[32px] xs:h-[42px] md:h-[48px] duration-300 hover:shadow-xl hover:shadow-primary/60`}
              >
                <DownloadSVG />
                <p className="hidden md:block">Export</p>
              </button>
            </CSVLink>
          </div>
          <SpeedReportChart
            selectedVehicle={selectedVehicle}
            vehicleData={vehicleData}
            chartData={chartData}
            isLoading={isLoading}
          />
        </div>
        {/* SINGLE SELECTOR */}
        <div
          className={`${clicked === true ? "right-0" : "-right-96"} ${xlScreen === true
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
            top={`${clicked === true ? "top-0 lg:top-20" : "lg:top-20"}`}
            margin={"lg:-mt-1"}
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
          className="lg:hidden blur-filter-speed"
        ></div>
      )}
    </div>
  );
};

export default speed;

speed.getLayout = function getLayout(page) {
  return (
    <ProtectedRoute>
      <Layout>
        <DashboardLayout>{page}</DashboardLayout>
      </Layout>
    </ProtectedRoute>
  );
};
