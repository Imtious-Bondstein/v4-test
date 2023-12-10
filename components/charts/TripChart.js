import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  Dot,
  ResponsiveContainer,
} from "recharts";
import "../../styles/components/charts.css";

//=======utils
import { analyticsTripsNumberDate } from "@/utils/dateTimeConverter";

const xFormatter = (value) => `${analyticsTripsNumberDate(value)}`;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <p
        className={`w-[96px] h-[38px] text-center bg-white pt-1 border-white text-[#1E1E1E] rounded-[13px] barTooltipShadow`}
      >
        {/* ========= distance =========  */}
        <span className="text-[#F36B24] mr-1 text-xl font-bold ">{`${payload[0].value}`}</span>
        Trips
      </p>
    );
  }

  return null;
};

const TripChart = ({ totalTrips, isLoadingTrips }) => {
  // console.log("totalTrips----------", totalTrips);

  return (
    <div className="p-4">
      {isLoadingTrips ? (
        <div className="w-full h-full min-h-[350px] min-w-[400px] skeleton rounded-lg"></div>
      ) : (
        <div>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart
              // width={505}
              // height={350}
              data={totalTrips}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F57E20" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#FDD10E" stopOpacity={0.1} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="date"
                tickFormatter={xFormatter}
                tick={{ fill: "#8D96A1", fontSize: 14 }}
                dy={10}
              />
              <YAxis tick={{ fill: "#8D96A1", fontSize: 18 }} dx={-10} />
              <Tooltip
                content={<CustomTooltip />}
                wrapperStyle={{ outline: "none" }}
              />

              <Area
                dot={{
                  stroke: "#f36c2481",
                  fill: "#F36B24",
                  strokeWidth: 5,
                  r: 4,
                }}
                activeDot={{
                  stroke: "#f36c2481",
                  fill: "white",
                  strokeWidth: 5,
                  r: 4,
                }}
                type="monotone"
                dataKey="trips"
                stroke="#f4901ed6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorUv)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default TripChart;
