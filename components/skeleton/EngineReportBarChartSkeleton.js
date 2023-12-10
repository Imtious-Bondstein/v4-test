import React from "react";

const EngineReportBarChartSkeleton = () => {
  return (
    <div className="h-[300px] w-full">
      <div className="bg-white p-5 h-[100%] w-full">
        <div className="flex justify-between w-full mt-5">
          <div className="w-[100px] h-[30px] skeleton rounded"></div>
          <div className="w-[100px] h-[30px] skeleton rounded"></div>
        </div>
        <div className="w-2/3 h-[20px] skeleton rounded mt-10"></div>
        <div className="flex w-full mt-10 mb-5">
          <div className="w-1/3 h-[50px] skeleton rounded"></div>
          <div className="w-1/3 h-[50px] skeleton rounded"></div>
          <div className="w-1/3 h-[50px] skeleton rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default EngineReportBarChartSkeleton;
