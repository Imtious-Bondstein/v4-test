import React, { useEffect, useState } from "react";
import { Bar, BarChart, Cell, ResponsiveContainer, XAxis } from "recharts";
import "../../styles/globals.css";
import {
  engineReportChartTime,
  speedReportChartTime,
} from "@/utils/dateTimeConverter";
import EngineReportBarChartSkeleton from "../skeleton/EngineReportBarChartSkeleton";

const EngineReportChart = ({ vehicleData, chartData, isLoading }) => {
  const [detailsClicked, setDetailsClicked] = useState(false);
  const [data, setData] = useState([]);

  // CHART DATA
  // const chartData = [
  //   {
  //     min: "01 am",
  //     speed: 0,
  //     height: 60,
  //     fill: offFill,
  //   },
  //   {
  //     min: "02 am",
  //     speed: 40,
  //     height: 60,
  //     fill: onFill,
  //   },
  //   {
  //     min: "03 am",
  //     speed: 20,
  //     height: 60,
  //     fill: lowFill,
  //   },
  //   {
  //     min: "04 am",
  //     speed: 20,
  //     height: 60,
  //     fill: lowFill,
  //   },
  //   {
  //     min: "05 am",
  //     speed: 20,
  //     height: 60,
  //     fill: lowFill,
  //   },
  //   {
  //     min: "06 am",
  //     speed: 20,
  //     height: 60,
  //     fill: lowFill,
  //   },
  //   {
  //     min: "07 am",
  //     speed: 20,
  //     height: 60,
  //     fill: lowFill,
  //   },
  //   {
  //     min: "08 am",
  //     speed: 10,
  //     height: 60,
  //     fill: idleFill,
  //   },
  //   {
  //     min: "09 am",
  //     speed: 10,
  //     height: 60,
  //     fill: idleFill,
  //   },
  //   {
  //     min: "10 am",
  //     speed: 80,
  //     height: 60,
  //     fill: onFill,
  //   },
  //   {
  //     min: "11 am",
  //     speed: 0,
  //     height: 60,
  //     fill: offFill,
  //   },
  //   {
  //     min: "12 pm",
  //     speed: 0,
  //     height: 60,
  //     fill: offFill,
  //   },
  //   {
  //     min: "13 pm",
  //     speed: 0,
  //     height: 60,
  //     fill: offFill,
  //   },
  //   {
  //     min: "14 pm",
  //     speed: 60,
  //     height: 60,
  //     fill: onFill,
  //   },
  //   {
  //     min: "15 pm",
  //     speed: 0,
  //     height: 60,
  //     fill: offFill,
  //   },
  //   {
  //     min: "16 pm",
  //     speed: 0,
  //     height: 60,
  //     fill: offFill,
  //   },
  //   {
  //     min: "17 pm",
  //     speed: 120,
  //     height: 60,
  //     fill: onFill,
  //   },
  //   {
  //     min: "18 pm",
  //     speed: 0,
  //     height: 60,
  //     fill: offFill,
  //   },
  //   {
  //     min: "19 pm",
  //     speed: 0,
  //     height: 60,
  //     fill: offFill,
  //   },
  //   {
  //     min: "20 pm",
  //     speed: 0,
  //     height: 60,
  //     fill: offFill,
  //   },
  //   {
  //     min: "21 pm",
  //     speed: 0,
  //     height: 60,
  //     fill: offFill,
  //   },
  //   {
  //     min: "22 pm",
  //     speed: 7,
  //     height: 60,
  //     fill: idleFill,
  //   },
  //   {
  //     min: "23 pm",
  //     speed: 90,
  //     height: 60,
  //     fill: onFill,
  //   },
  // ];

  const CustomizedXAxisTick = ({ x, y, payload }) => (
    <g transform={`translate(${x},${y}) rotate(-92)`}>
      <text
        className="text-sm"
        x={0}
        y={0}
        dx={15}
        dy={0}
        textAnchor="end"
        fill="#8D96A1"
      >
        {engineReportChartTime(payload.value)}
      </text>
    </g>
  );

  const showDetailsChart = () => {
    setDetailsClicked(!detailsClicked);
  };

  useEffect(() => {
    setData(
      chartData.map((item, index) => ({
        ...item,
        height: 60,
      }))
    );
  }, [chartData]);

  return (
    <>
      {isLoading === true ? (
        <EngineReportBarChartSkeleton />
      ) : data.length > 0 ? (
        <section
          id="engine-report"
          className={`bg-white rounded-[20px] p-4 sm:p-8 w-full ${
            detailsClicked === false
              ? "2xl:h-[300px] h-[300px]"
              : "min-h-[500px]"
          }`}
        >
          <div className="flex items-center justify-between pb-3">
            <p className="text-primaryText font-bold lg:font-medium text-sm sm:text-base lg:text-xl">
              {vehicleData.vehicle.bst_id}: {vehicleData.vehicle.vehicle_name}
            </p>

            <button
              onClick={() => showDetailsChart()}
              className="bg-primary w-[80px] sm:w-[122px] h-[30px] sm:h-[37px] rounded-lg text-[12px] sm:text-sm text-primaryText duration-300 hover:shadow-xl hover:shadow-primary/60"
            >
              View Details
            </button>
          </div>
          <div className="flex items-center mb-5">
            <p className="text-lg font-medium hidden xl:block mr-2">
              Total Duration:
            </p>
            <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row lg:items-center sm:space-x-5 md:space-x-0 lg:space-x-5">
              {vehicleData.allDuration?.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="flex items-center space-x-1 xl:space-x-2 mr-2 xl:mr-4"
                  >
                    {item.engine_status.toLowerCase() === "idle" && (
                      <div
                        className={`h-[12px] xl:h-[18px] w-[12px] xl:w-[18px] rounded-full bg-[#FFAA58]`}
                      ></div>
                    )}
                    {item.engine_status.toLowerCase() === "low" && (
                      <div
                        className={`h-[12px] xl:h-[18px] w-[12px] xl:w-[18px] rounded-full bg-[#C9D1DA]`}
                      ></div>
                    )}
                    {item.engine_status.toLowerCase() === "on" && (
                      <div
                        className={`h-[12px] xl:h-[18px] w-[12px] xl:w-[18px] rounded-full bg-tmvGreen`}
                      ></div>
                    )}
                    {item.engine_status.toLowerCase() === "off" && (
                      <div
                        className={`h-[12px] xl:h-[18px] w-[12px] xl:w-[18px] rounded-full bg-tmvRed`}
                      ></div>
                    )}

                    <p className="text-sm xl:text-base capitalize">
                      {item.engine_status}: {item.total_duration}
                    </p>
                  </div>
                );
              })}
              {/* <div className="flex items-center space-x-5 lg:space-x-0">
                <div className="flex items-center space-x-1 xl:space-x-2 mr-2 xl:mr-4">
                  <div
                    className={`h-[12px] xl:h-[18px] w-[12px] xl:w-[18px] rounded-full bg-[#FFAA58]`}
                  ></div>
                  <p className="text-sm xl:text-base">Idle: 09:33:00</p>
                </div>
                <div className="flex items-center space-x-1 xl:space-x-2 mr-2 xl:mr-4">
                  <div
                    className={`h-[12px] xl:h-[18px] w-[12px] xl:w-[18px] rounded-full bg-[#C9D1DA]`}
                  ></div>
                  <p className="text-sm xl:text-base">Low: 09:33:00</p>
                </div>
              </div>
              <div className="flex items-center  space-x-6 lg:space-x-0">
                <div className="flex items-center space-x-1 xl:space-x-2 mr-2 xl:mr-4">
                  <div
                    className={`h-[12px] xl:h-[18px] w-[12px] xl:w-[18px] rounded-full bg-tmvGreen `}
                  ></div>
                  <p className="text-sm xl:text-base">On: 09:33:00</p>
                </div>
                <div className="flex items-center space-x-1 xl:space-x-2 mr-2 xl:mr-4">
                  <div
                    className={`h-[12px] xl:h-[18px] w-[12px] xl:w-[18px] rounded-full bg-tmvRed`}
                  ></div>
                  <p className="text-sm xl:text-base">Off: 09:33:00</p>
                </div>
              </div> */}
            </div>
          </div>
          {/* CHART */}
          {detailsClicked === true ? (
            <div>
              {/* IDLE */}
              <div id="idle" className="h-[110px] flex items-center">
                <div className="flex items-center space-x-2 -mt-8 mr-4">
                  <div
                    className={`h-[18px] w-[18px] rounded-full bg-[#FFAA58] `}
                  ></div>
                  <p>Idle</p>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    width={100}
                    height={100}
                    data={data}
                    barCategoryGap={-1}
                  >
                    <Bar dataKey="height">
                      {data.map(({ engine_status }, index) => (
                        <Cell
                          fill={
                            engine_status.toLowerCase() === "idle"
                              ? "#FFAA58"
                              : "#fff"
                          }
                          key={index}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {/* LOW */}
              <div className="h-[110px] flex items-center -mt-9">
                <div className="flex items-center space-x-2 -mt-8 mr-3">
                  <div
                    className={`h-[18px] w-[18px] rounded-full bg-[#C9D1DA]`}
                  ></div>
                  <p>Low</p>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    width={100}
                    height={100}
                    data={data}
                    barCategoryGap={-1}
                  >
                    <Bar dataKey="height">
                      {chartData.map(({ engine_status }, index) => (
                        <Cell
                          fill={
                            engine_status.toLowerCase() === "low"
                              ? "#C9D1DA"
                              : "#fff"
                          }
                          key={index}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {/* ON */}
              <div className="h-[110px] flex items-center -mt-9">
                <div className="flex items-center space-x-2 -mt-8 mr-5">
                  <div
                    className={`h-[18px] w-[18px] rounded-full bg-tmvGreen`}
                  ></div>
                  <p>On</p>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    width={100}
                    height={100}
                    data={data}
                    barCategoryGap={-1}
                  >
                    <Bar dataKey="height">
                      {chartData.map(({ engine_status }, index) => (
                        <Cell
                          key={index}
                          fill={
                            engine_status.toLowerCase() === "on"
                              ? "#1DD1A1"
                              : "#fff"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {/* OFF */}
              <div className="h-[140px] flex items-center -mt-9">
                <div className="flex items-center space-x-2 -mt-8 mr-5">
                  <div
                    className={`h-[18px] w-[18px] rounded-full bg-tmvRed`}
                  ></div>
                  <p>Off</p>
                </div>{" "}
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                  // className={`border-t`}
                >
                  <BarChart
                    width={100}
                    height={100}
                    data={data}
                    barCategoryGap={-1}
                  >
                    <Bar
                      dataKey="height"
                      // stroke="#000"
                      // strokeWidth={0.2}
                      // strokeOpacity={0.4}
                    >
                      {chartData.map(({ engine_status }, index) => (
                        <Cell
                          fill={
                            engine_status.toLowerCase() === "off"
                              ? "#FF6B6B"
                              : "#fff"
                          }
                          key={index}
                        />
                      ))}
                    </Bar>
                    <XAxis dataKey="from_time" tick={<CustomizedXAxisTick />} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="h-[120px] md:h-[140px] flex items-center">
              <p className="mb-16 mr-5 text-tmvGray">Report</p>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  width={100}
                  height={100}
                  data={data}
                  barCategoryGap={-1}
                >
                  <XAxis dataKey="from_time" tick={<CustomizedXAxisTick />} />
                  <Bar dataKey="height">
                    {data.map(({ engine_status }, index) => (
                      <Cell
                        fill={
                          engine_status.toLowerCase() === "off"
                            ? "#FF6B6B"
                            : engine_status.toLowerCase() === "low"
                            ? "#C9D1DA"
                            : engine_status.toLowerCase() === "idle"
                            ? "#FFAA58"
                            : engine_status.toLowerCase() === "on"
                            ? "#1DD1A1"
                            : ""
                        }
                        key={`cell-${index}`}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>
      ) : (
        <p className="bg-white flex justify-center items-center rounded-[20px] p-8 w-full h-[75vh]">
          No Data To Found. Please Select A Vehicle
        </p>
      )}
    </>
  );
};

export default EngineReportChart;
