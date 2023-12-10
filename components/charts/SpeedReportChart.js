import React, { useState } from "react";
// CHART
import {
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Area,
  AreaChart,
  Tooltip,
} from "recharts";

import "../../styles/globals.css";
import ZoomInSVG from "../SVG/chart/ZoomInSVG";
import ZoomOutSVG from "../SVG/chart/ZoomOutSVG";
import { useEffect } from "react";
import LineGraphSklHourlyDistance from "../skeleton/LineGraphSklHourlyDistance";
import LineGraphSkl from "../skeleton/LineGraphSkl";
import EngineReportBarChartSkeleton from "../skeleton/EngineReportBarChartSkeleton";
import SpeedReportChartSkeleton from "../skeleton/SpeedReportChartSkeleton";

// CHART DATA
// const chartData = [
//   {
//     min: "00.62",
//     speed: 120,
//   },
//   {
//     min: "00.62",
//     speed: 81,
//   },
//   {
//     min: "00.62",
//     speed: 30,
//   },
//   {
//     min: "00.62",
//     speed: 0,
//   },
//   {
//     min: "00.62",
//     speed: 18,
//   },
//   {
//     min: "00.62",
//     speed: 40,
//   },
//   {
//     min: "00.62",
//     speed: 0,
//   },
//   {
//     min: "00.62",
//     speed: 10,
//   },
//   {
//     min: "00.62",
//     speed: 120,
//   },
//   {
//     min: "00.62",
//     speed: 55,
//   },
//   {
//     min: "00.62",
//     speed: 0,
//   },
//   {
//     min: "00.62",
//     speed: 40,
//   },
//   {
//     min: "00.62",
//     speed: 23,
//   },
//   {
//     min: "00.62",
//     speed: 12,
//   },
//   {
//     min: "00.62",
//     speed: 100,
//   },
//   {
//     min: "00.62",
//     speed: 17,
//   },
//   {
//     min: "00.62",
//     speed: 90,
//   },
//   {
//     min: "00.62",
//     speed: 10,
//   },
//   {
//     min: "00.62",
//     speed: 129,
//   },
//   {
//     min: "00.62",
//     speed: 110,
//   },
//   {
//     min: "00.62",
//     speed: 15,
//   },
//   {
//     min: "00.62",
//     speed: 103,
//   },
//   {
//     min: "00.62",
//     speed: 90,
//   },
//   {
//     min: "00.62",
//     speed: 126,
//   },
//   {
//     min: "00.62",
//     speed: 3,
//   },
//   {
//     min: "00.62",
//     speed: 56,
//   },
//   {
//     min: "00.62",
//     speed: 33,
//   },
//   {
//     min: "00.62",
//     speed: 56,
//   },
//   {
//     min: "00.62",
//     speed: 120,
//   },
//   {
//     min: "00.62",
//     speed: 56,
//   },
//   {
//     min: "00.62",
//     speed: 33,
//   },
// ];

const SpeedReportChart = ({
  chartData,
  selectedVehicle,
  vehicleData,
  isLoading,
}) => {
  const [data, setData] = useState([]);
  const [zoomAmount, setZoomAmount] = useState(0);
  const [speedType, setSpeedType] = useState("average_speed");
  const CustomizedDot = (props) => {
    const { cx, cy, stroke, payload, value } = props;
    return (
      <circle
        cx={cx - 0}
        cy={cy - 5}
        r={4}
        stroke="#FFAA5840"
        strokeWidth={7}
        fill="#FFAA58"
      ></circle>
    );
  };
  const yFormatter = (speed) => `${speed} km`;

  const CustomizedXAxisTick = ({ x, y, payload }) => (
    <g transform={`translate(${x},${y}) rotate(-92)`}>
      <text
        className="text-sm"
        x={0}
        y={0}
        dx={10}
        dy={0}
        textAnchor="end"
        fill="#8D96A1"
      >
        {payload.value}
      </text>
    </g>
  );

  // MAXIMUM, AVERAGE, MINIMUM DATA HANDLER ===================================
  const handleMaximumChartData = () => {
    setSpeedType("maximum_speed");
  };
  const handleAverageChartData = () => {
    setSpeedType("average_speed");
  };
  const handleMinimumChartData = () => {
    setSpeedType("minimum_speed");
  };

  // HANDLE ZOMM IN ZOMM OUT FUNCTIONALITY =================================
  const handleZoomIn = () => {
    setZoomAmount(zoomAmount + 1200);
  };
  const handleZoomOut = () => {
    zoomAmount < 1200 ? setZoomAmount(0) : setZoomAmount(zoomAmount - 1200);
  };
  // TOOLTIP ========================================================================
  const Tooltips = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`bg-white px-5 py-2 rounded-lg shadow-md`}>
          <p className="text-[#1E1E1E]">{`${payload[0].value} km`}</p>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    setData(chartData);
    console.log(vehicleData);
  }, [chartData]);

  return (
    <>
      {isLoading === true ? (
        <div>
          <SpeedReportChartSkeleton />
        </div>
      ) : data.length > 0 ? (
        <section
          id="speed-report"
          className="bg-white rounded-[20px] p-8 w-full h-[75vh]"
        >
          <div className="xl:flex space-y-4 xl:space-y-0 justify-between items-center pb-9">
            <p className="text-primaryText font-bold md:font-medium text-base md:text-2xl">
              {vehicleData.vehicle.bst_id}: {vehicleData.vehicle.vehicle_name}
            </p>
            {/* BUTTONS */}
            <div className="flex space-x-3">
              <button
                onClick={() => handleMaximumChartData()}
                className={`w-[80px] xs:w-[104px] h-[30px] xs:h-[37px] bg-tmvRed rounded-lg flex justify-center items-center text-[12px] xs:text-sm text-primaryText duration-300 hover:shadow-lg hover:shadow-tmvRed/60 ease-in-out ${
                  speedType === "maximum_speed"
                    ? "shadow-xl shadow-tmvRed/60"
                    : ""
                }`}
              >
                Maximum
              </button>
              <button
                onClick={() => handleAverageChartData()}
                className={`w-[80px] xs:w-[104px] h-[30px] xs:h-[37px] bg-primary rounded-lg flex justify-center items-center text-[12px] xs:text-sm text-primaryText duration-300 hover:shadow-lg hover:shadow-primary/60 ease-in-out ${
                  speedType === "average_speed"
                    ? "shadow-xl shadow-primary/60"
                    : ""
                }`}
              >
                Average
              </button>
              <button
                onClick={() => handleMinimumChartData()}
                className={`w-[80px] xs:w-[104px] h-[30px] xs:h-[37px] bg-tmvGreen rounded-lg flex justify-center items-center text-[12px] xs:text-sm text-primaryText duration-300 hover:shadow-lg hover:shadow-tmvGreen/60 ease-in-out ${
                  speedType === "minimum_speed"
                    ? "shadow-xl shadow-tmvGreen/60"
                    : ""
                }`}
              >
                Minimum
              </button>
            </div>
          </div>
          {/* CHART */}
          <div
            className={`h-[45vh] xl:h-[52vh] pb-5 ${
              zoomAmount >= 1200 ? "overflow-x-scroll" : "overflow-hidden"
            }`}
          >
            <ResponsiveContainer
              width={
                zoomAmount === 0
                  ? "100%"
                  : zoomAmount < 1200
                  ? "100%"
                  : zoomAmount
              }
              height="100%"
            >
              <AreaChart
                width={500}
                height={300}
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  horizontal={true}
                  vertical={false}
                  strokeDasharray="0 
                0"
                  strokeOpacity={0.3}
                />
                <XAxis dataKey="time" tick={<CustomizedXAxisTick />} />
                <YAxis
                  dataKey={speedType}
                  tickFormatter={yFormatter}
                  padding={{ top: 25 }}
                />
                <Tooltip
                  content={<Tooltips />}
                  wrapperStyle={{
                    outline: "none",
                    backgroundColor: "transparent",
                  }}
                  cursor={{ fill: "transparent" }}
                />
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop stopColor="#FFAA58" stopOpacity={0.8} />
                    <stop offset="1" stopColor="white" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  dataKey={speedType}
                  stroke="#FDD10E"
                  fill="url(#colorUv)"
                  dot={<CustomizedDot />}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {/* ZOOM IN & ZOOM OUT BUTTONS */}
          <div className="flex justify-center items-center w-[90px] h-[37px] rounded-lg shadow-sm  ml-auto lg:mt-5">
            <div
              onClick={() => handleZoomIn()}
              className="w-[45px] h-full flex justify-center items-center cursor-pointer rounded-l-lg hover:shadow-lg shadow duration-300 ease-in-out select-none"
            >
              <ZoomInSVG />
            </div>
            <div className="bg-[#DCDDE4] h-full w-[1px]"></div>
            <div
              onClick={() => handleZoomOut()}
              className="w-[45px] h-full flex justify-center items-center cursor-pointer rounded-r-lg hover:shadow-lg shadow duration-300 ease-in-out select-none"
            >
              <ZoomOutSVG />
            </div>
          </div>
        </section>
      ) : (
        <p className="bg-white text-center flex justify-center items-center rounded-[20px] p-8 w-full h-[75vh]">
          No Data To Found. Please Select A Vehicle
        </p>
      )}
      {/* <SpeedReportChartSkeleton /> */}
    </>
  );
};

export default SpeedReportChart;
