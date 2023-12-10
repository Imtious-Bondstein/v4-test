import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "../../styles/globals.css";
import {
  hourlyDistanceChartTime,
  hourlyDistanceTableDate,
} from "@/utils/dateTimeConverter";
import LineGraphSkl from "../skeleton/LineGraphSkl";
import LineGraphSklHourlyDistance from "../skeleton/LineGraphSklHourlyDistance";

const HourlyDistanceChart = ({
  chartContent,
  chartData,
  isLoading,
  fetched,
}) => {
  const [data, setData] = useState([]);
  const [totalDistance, setTotalDistance] = useState([]);
  const [maxDistance, setMaxDistance] = useState([]);
  const [hourt, setHourt] = useState("");
  // CHART Y AXIS TEXT ==============================================================
  const yFormatter = (distance) => `${distance.toFixed(0)} km`;
  // CHART X AXIS TEXT ==============================================================
  const CustomizedXAxisTick = ({ x, y, stroke, payload, day }) => (
    <g transform={`translate(${x + 5},${y}) rotate(-92)`}>
      <text
        className="text-sm"
        x={0}
        y={0}
        dx={15}
        dy={0}
        textAnchor="end"
        fill="#8D96A1"
      >
        {payload.value}
      </text>
    </g>
  );

  // TOOLTIP ========================================================================
  const Tooltips = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        // <div className={`bg-white px-5 py-2 rounded-lg shadow-md`}>
        //   <p className="text-[#1E1E1E]">{`${payload[0].value}`} km</p>
        // </div>
        <div className={`bg-white px-5 py-2 rounded-lg shadow-md`}>
          <p className="text-[#1E1E1E]">
            {`${payload[0].value.toFixed(2)}`} km
          </p>
          <p className="text-[#1E1E1E]">{`${hourlyDistanceTableDate(
            payload[0].payload.date
          )}`}</p>
        </div>
      );
    }
    return null;
  };

  const handleChartData = () => {
    const newState = chartData?.map((vehicle) => {
      return {
        ...vehicle,
        hour_start: hourlyDistanceChartTime(vehicle.hour_start),
        distance: parseFloat(vehicle.distance),
      };
    });
    setData(newState);
  };

  useEffect(() => {
    handleChartData();

    const totalDistance = chartData.reduce(
      (total, dataPoint) => total + dataPoint.distance,
      0
    );
    setTotalDistance(totalDistance.toFixed(2));

    // FINDING MAXIMUM DISTANCE
    //   const valuesArray = chartData.map((obj) => parseFloat(obj.distance));
    //   setMaxDistance(Math.max(...valuesArray));
  }, [chartData]);

  return (
    <div id="daily-distance-report">
      <div className="grow overflow-hidden">
        <div className="h-[50vh] sm:h-[65vh] lg:h-[75vh] w-full lg:w-[100%] charts mb-4 bg-white px-3 sm:p-6 py-[29px] rounded-2xl">
          {/* VEHICLE NUMBER & TABLE TOGGLE BUTTON */}
          {isLoading ? (
            <div className="py-10 h-[100%]">
              <LineGraphSklHourlyDistance />
            </div>
          ) : (
            <div className="flex justify-between items-center mb-5 md:mb-10">
              {chartData.length > 0 ? (
                <div className="flex flex-col md:flex-row md:items-center justify-between w-full">
                  <h6 className="text-sm sm:text-2xl font-bold md:font-medium">
                    {chartContent.bst_id}: {chartContent.vehicle_name}
                  </h6>
                  <p className="text-sm sm:text-lg text-tmvDarkGray mt-1.5 md:mt-0">
                    Total: {totalDistance} km
                  </p>
                </div>
              ) : (
                ""
              )}
            </div>
          )}
          {/* CHART */}
          {isLoading ? (
            ""
          ) : fetched === true && chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="82%">
              <BarChart width={70} height={300} data={data}>
                <defs>
                  <linearGradient
                    id={`colorUv`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="100%"
                    spreadMethod="reflect"
                  >
                    <stop offset="0" stopColor="#F3651C" />
                    <stop offset="1" stopColor="#FDD007" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="0 0" opacity={0.2} />
                <XAxis
                  className="border"
                  dataKey="hour_start"
                  tick={<CustomizedXAxisTick />}
                />
                <YAxis
                  tickFormatter={yFormatter}
                  tick={{ fill: "#8D96A1", fontSize: 14, borderRadius: "20px" }}
                  tickCount={6}
                  dataKey="distance"
                  type="number"
                  padding={{ top: 35 }}
                />
                <Tooltip
                  content={<Tooltips />}
                  wrapperStyle={{
                    outline: "none",
                    backgroundColor: "transparent",
                  }}
                  cursor={{ fill: "transparent" }}
                />
                <Bar
                  barSize={7}
                  dataKey="distance"
                  day="vehicle"
                  background={{ fill: "#F0F5FB", radius: [5, 5, 0, 0] }}
                  radius={[5, 5, 0, 0]}
                >
                  {chartData.map((e, index) => (
                    <Cell key={index} fill={`url(#colorUv)`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : fetched === false ? (
            <p className="h-full flex justify-center items-center pb-20 text-primaryText text-center">
              Please Select A Vehicle
            </p>
          ) : (
            <p className="h-full flex justify-center items-center pb-20 text-primaryText text-center">
              Not Sufficient Data to Render.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HourlyDistanceChart;
