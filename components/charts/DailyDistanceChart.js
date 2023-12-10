import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ColumnTableSVG from "../SVG/table/ColumnTableSVG";
import GraphTableSVG from "../SVG/table/GraphTableSVG";

import "../../styles/globals.css";
import {
  dailyDistanceChartDate,
  hourlyDistanceTableDate,
} from "@/utils/dateTimeConverter";
import LineGraphSkl from "../skeleton/LineGraphSkl";
import LineGraphSklHourlyDistance from "../skeleton/LineGraphSklHourlyDistance";

const DailyDistanceChart = ({ isLoading, dailyReportData }) => {
  const [chartData, setChartData] = useState([]);
  // CHART Y AXIS TEXT
  const yFormatter = (distance) => `${parseFloat(distance)} km`;
  // CHART X AXIS TEXT
  const CustomizedXAxisTick = ({ x, y, stroke, payload, date }) => (
    <g transform={`translate(${x + 5},${y}) rotate(-90)`}>
      <text
        className="text-sm"
        x={0}
        y={0}
        dx={20}
        dy={0}
        textAnchor="end"
        fill="#8D96A1"
      >
        {dailyDistanceChartDate(payload.value)}
      </text>
    </g>
  );
  // TOOLTIP ========================================================================
  const Tooltips = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
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

  // useEffect(() => {
  //   // FINDING MAXIMUM DISTANCE
  //   // const valuesArray = chartData.map((obj) => Number(obj.distance));
  //   // setMaxDistance(Math.max(...valuesArray));
  //   setChartData(
  //     dailyReportData.map(data => {
  //       return { ...data, distance: parseFloat(data.distance) }
  //     })
  //   )
  // }, [dailyReportData])

  return (
    <div id="daily-distance-report">
      <div className="grow ">
        {/* CHART */}
        <div className="charts h-[65.3vh]">
          {isLoading ? (
            <div className="py-10 h-[100%]">
              <LineGraphSklHourlyDistance />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyReportData}>
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
                  dataKey="date"
                  tick={<CustomizedXAxisTick />}
                // padding={{ left: 10 }}
                />
                <YAxis
                  tickFormatter={yFormatter}
                  dataKey="distance"
                  tickCount={8}
                  tick={{ fill: "#8D96A1", fontSize: 14, borderRadius: "20px" }}
                // domain={[0, maxDistance]}
                // padding={{ top: 25 }}
                />
                <Tooltip
                  content={<Tooltips />}
                  wrapperStyle={{ outline: "none" }}
                  cursor={{ fill: "transparent" }}
                />
                <Bar
                  barSize={7}
                  dataKey="distance"
                  // fill="#FDD007"
                  background={{ fill: "#F0F5FB", radius: [5, 5, 0, 0] }}
                  radius={[5, 5, 0, 0]}
                >
                  {dailyReportData.map((e, index) => (
                    <Cell key={index} fill={`url(#colorUv)`} />
                  ))}
                </Bar>
                {/* <Bar dataKey="uv" fill="#82ca9d" /> */}
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyDistanceChart;
