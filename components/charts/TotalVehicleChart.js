import React from "react";
import ReactECharts from "echarts-for-react";
import { vehicle } from "faker/lib/locales/ar";
import PieChartSkl from "../skeleton/PieChartSkl";
import { useRouter } from "next/router";

const TotalVehicleChart = ({ totalVehiclesData, isLoadingPieChart }) => {
  const router = useRouter();
  const pieOption = {
    tooltip: {
      trigger: "item",
    },
    color: ["#FF6B6B", "#1DD1A1", "#C9D1DA", "#00A3FF", "#FFAA58"],
    // legend: {
    //   bottom: "0",
    //   left: "center",
    //   itemWidth: 21,
    //   itemHeight: 21,
    //   textStyle: { color: "#8D96A1" },
    //   padding: 0,
    // },

    series: [
      {
        type: "pie",
        radius: ["45%", "75%"],
        avoidLabelOverlap: false,

        label: {
          show: false,
          position: "center",
        },
        // emphasis: {
        //   label: {
        //     show: true,
        //     fontSize: 40,
        //     fontWeight: "bold",
        //   },
        // },
        labelLine: {
          show: false,
        },
        data: totalVehiclesData,
      },
    ],
  };
  const handleVehicleStatusSelect = (e) => {
    const status = e.name.toLowerCase() === 'parking' || e.name.toLowerCase() === 'workshop' ? 'offline' : e.name.toLowerCase();
    router.push(`/dashboard?status=${status}`);
  }



  return (
    <div className="pt-20">
      {isLoadingPieChart ? (
        <PieChartSkl />
      ) : (
        <div>
          <ReactECharts
            style={{ height: "270px", width: "100%" }}
            className=""
            option={pieOption}
            onEvents={{
              click: handleVehicleStatusSelect,
            }}
          />
          <div className="flex items-center flex-wrap space-x-4 justify-center">
            {totalVehiclesData &&
              totalVehiclesData.map((status) => (
                <div className="flex items-center gap-[10px]" key={status.name}>
                  <div
                    className={`h-[21px] w-[21px] rounded-[6px] 
            ${status?.name?.toLowerCase() === "suspended"
                        ? "bg-[#FF6B6B]"
                        : status?.name?.toLowerCase() === "online"
                          ? "bg-[#1DD1A1]"
                          : status?.name?.toLowerCase() === "offline"
                            ? "bg-[#C9D1DA]"
                            : status?.name?.toLowerCase() === "parking"
                              ? "bg-[#00A3FF]"
                              : status?.name?.toLowerCase() === "workshop"
                                ? "bg-[#FFAA58]"
                                : "bg-[#C9D1DA]"
                      }`}
                  ></div>
                  <p className="text-[#8D96A1]">{status.name}</p>
                </div>
              ))}
            {/* <div className="flex items-center gap-[10px]">
          <div className="h-[21px] w-[21px] bg-[#1DD1A1] rounded-[6px]"></div>
          <p className="text-[#8D96A1]">Live</p>
        </div>

        <div className="flex items-center gap-[10px]">
          <div className="h-[21px] w-[21px] bg-[#FF6B6B] rounded-[6px]"></div>
          <p className="text-[#8D96A1]">Suspended</p>
        </div>

        <div className="flex items-center gap-[10px]">
          <div className="h-[21px] w-[21px] bg-[#C9D1DA] rounded-[6px]"></div>
          <p className="text-[#8D96A1]">Offline</p>
        </div>

        <div className="flex items-center gap-[10px]">
          <div className="h-[21px] w-[21px] bg-[#00A3FF] rounded-[6px]"></div>
          <p className="text-[#8D96A1]">Parking</p>
        </div>

        <div className="flex items-center gap-[10px]">
          <div className="h-[21px] w-[21px] bg-[#FFAA58] rounded-[6px]"></div>
          <p className="text-[#8D96A1]">Workshop</p>
        </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default TotalVehicleChart;
