import React from 'react';

import { vehicleRouteChartTime, vehicleRouteChartDate, vehicleRouteChartHour } from "@/utils/dateTimeConverter";

// re charts
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area,
} from "recharts";

const yFormatter = (value) => `${value} kmh`;
const xFormatter = (value) => `${vehicleRouteChartHour(value)}`;

const CustomTooltip = ({ active, payload, label }) => {
    // console.log('payload---', payload);
    if (active && payload && payload.length) {
        return (
            <div className="bg-secondary opacity-80 p-2 text-sm">
                <p>
                    <span className='font-bold'>Speed: </span>
                    {payload[0].payload.speed} kmh
                </p>
                <p>
                    <span className='font-bold'>Date: </span>
                    {vehicleRouteChartDate(payload[0].payload.dateTime)}
                </p>
                <p>
                    <span className='font-bold'>Time: </span>
                    {vehicleRouteChartTime(payload[0].payload.dateTime)}
                </p>
            </div>
        );
    }

    return null;
};

// const CustomizedXAxisTick = ({ x, y, stroke, payload }) => (
//   <g transform={`translate(${x},${y})`}>
//     {/* transform="rotate(-35)" */}
//     <text x={0} y={0} dx={16} dy={16} textAnchor="end" fill="#666" >
//       {chartOnlyTime(payload.value)}
//     </text>
//   </g>
// );

const VehicleRoutePathsChart = ({ paths, handleChartClick }) => {
    return (
        <div className='relative'>
            <ResponsiveContainer width="100%" height={120}>
                <AreaChart
                    // width={1200}
                    // height={120}
                    data={paths}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                    onClick={paths.length && handleChartClick}
                >
                    <defs>
                        <linearGradient
                            id="colorFillTime"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop offset="5%" stopColor="#f5eabb" stopOpacity={1} />
                            <stop offset="95%" stopColor="#f5eabb" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient
                            id="colorStrokeTime"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop offset="10%" stopColor="#F36B24" stopOpacity={1} />
                            <stop offset="90%" stopColor="#FDD10E" stopOpacity={1} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        strokeDasharray="3"
                        horizontal="true"
                        vertical=""
                    />
                    <XAxis dataKey="dateTime" tickFormatter={xFormatter} />
                    {/* <XAxis dataKey="dateTime" interval={20} tick={<CustomizedXAxisTick />} /> */}
                    <YAxis tickFormatter={yFormatter} />
                    {/* <Tooltip cursor={{ stroke: "#F36B24", strokeWidth: 2 }} /> */}
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#F36B24", strokeWidth: 2 }} />
                    <Area
                        type="linear"
                        dataKey="speed"
                        stroke="url(#colorStrokeTime)"
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{ stroke: "white", strokeWidth: 2, r: 6 }}
                        fill="url(#colorFillTime)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default VehicleRoutePathsChart;