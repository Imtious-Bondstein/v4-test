import React from "react";
import "../../styles/components/charts.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

//=======utils
import { analyticsTraveledDistanceDate } from "@/utils/dateTimeConverter";
import LineGraphSkl from "../skeleton/LineGraphSkl";

const data = [
  {
    date: "Sun 18 jan",
    distance: 50,
    vehicle: 2,
  },
  {
    date: "Mon 19 jan",
    distance: 400,
    vehicle: 3,
  },
  {
    date: "Tue 20 jan",
    distance: 100,
    vehicle: 4,
  },
  {
    date: "Wed 21 jan",
    distance: 300,
    vehicle: 5,
  },
  {
    date: "Thu 22 jan",
    distance: 80,
    vehicle: 6,
  },
  {
    date: "Fri 23 jan",
    distance: 250,
    vehicle: 7,
  },
  {
    date: "Sat 24 jan",
    distance: 200,
    vehicle: 8,
  },
];
// const yFormatter = (value) => `${value}\u00A0km`;
const yFormatter = (value) => `${value} km`;
const xFormatter = (value) => analyticsTraveledDistanceDate(value);

const CustomTooltip = ({ active, payload, label }) => {
  // console.log('payload---*', payload);
  if (active && payload && payload.length) {
    return (
      <div
        className={`bg-white p-2 border-white flex items-center gap-1 rounded-[13px] barTooltipShadow`}
      >
        {/* ========= vehicle number ========= */}
        <p className="text-[#1E1E1E] flex items-center">
          <span className="text-[#1DD1A1] text-[20px] font-bold mr-1">
            {payload[0].payload.vehicle}
          </span>
          vehicle
        </p>

        {/* ====== seperator SVG ======= */}
        <svg
          width="2"
          height="20"
          viewBox="0 0 2 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="0.0214844"
            y="0.272461"
            width="1.35336"
            height="18.947"
            fill="#C9D1DA"
          />
        </svg>

        {/* ========= distance =========  */}
        <p className="text-[#1E1E1E] mr-1">{`${payload[0].value}`} km</p>
      </div>
    );
  }
  return null;
};

const TraveledDistanceChart = ({
  traveledDistance,
  isLoadingTravelDistance,
}) => {
  return (
    <div>
      {isLoadingTravelDistance ? (
        <div className=" py-10">
          <LineGraphSkl />
        </div>
      ) : (
        <div className="flex items-center py-8 sm:py-10 rounded-lg bg-white w-full">
          <ResponsiveContainer width={"100%"} height={300}>
            <BarChart
              // width={700}
              // height={400}
              data={traveledDistance}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              {/* <CartesianGrid strokeDasharray="0 0" /> */}
              <XAxis
                tickFormatter={xFormatter}
                dataKey="date"
                tick={{ fill: "#8D96A1", fontSize: 11 }}
                dy={10}
              />
              <YAxis
                tickFormatter={yFormatter}
                tick={{ fill: "#8E8E8E", fontSize: 11 }}
                dx={-10}
                padding={{ top: 5 }}
              />
              <Tooltip
                content={<CustomTooltip />}
                wrapperStyle={{ outline: "none" }}
                cursor={{ fill: "#FEF9E7" }}
              />
              {/* <Legend /> */}

              <Bar
                dataKey="distance"
                fill="#FDD10E"
                name="vehicle"
                barSize={27}
                background={{ fill: "#F0F5FB", radius: [5, 5, 0, 0] }}
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default TraveledDistanceChart;
