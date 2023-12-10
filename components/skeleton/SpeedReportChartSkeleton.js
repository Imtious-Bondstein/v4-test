import React from "react";

const SpeedReportChartSkeleton = () => {
  return (
    <div className="h-[79.5vh] w-full pb-10 rounded-[20px]">
      <div className="bg-white px-5 py-2 sm:p-5 h-[100%] w-full rounded-[20px]">
        <div className="flex items-center justify-center sm:justify-between my-5">
          <div className="hidden sm:block w-full sm:w-[250px] h-[22px] skeleton rounded"></div>
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <div className="w-1/3 sm:w-[100px] h-[32px] skeleton rounded"></div>
            <div className="w-1/3 sm:w-[100px] h-[32px] skeleton rounded"></div>
            <div className="w-1/3 sm:w-[100px] h-[32px] skeleton rounded"></div>
          </div>
        </div>
        <div className="w-[100%] h-[35vh] sm:h-[47vh] skeleton rounded"></div>
        <div className="flex items-center justify-end space-x-1 mt-5">
          <div className="w-[40px] h-[24px] skeleton rounded"></div>
          <div className="w-[40px] h-[24px] skeleton rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default SpeedReportChartSkeleton;
