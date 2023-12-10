import React from "react";

const PieChartSkl = () => {
  return (
    <div>
      <div className="flex items-center justify-center mb-6">
        <div className="w-56 h-56 skeleton border-8 skelton-border rounded-full flex items-center justify-center">
          <div className="w-32 h-32 bg-white rounded-full"></div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center ">
        <div className="flex items-center space-x-2 p-2">
          <div className="w-5 h-5 skeleton rounded"></div>
          <div className="w-20 h-5 skeleton rounded"></div>
        </div>
        <div className="flex items-center space-x-2 p-2">
          <div className="w-5 h-5 skeleton rounded"></div>
          <div className="w-20 h-5 skeleton rounded"></div>
        </div>
        <div className="flex items-center space-x-2 p-2">
          <div className="w-5 h-5 skeleton rounded"></div>
          <div className="w-20 h-5 skeleton rounded"></div>
        </div>
        <div className="flex items-center space-x-2 p-2">
          <div className="w-5 h-5 skeleton rounded"></div>
          <div className="w-20 h-5 skeleton rounded"></div>
        </div>
        <div className="flex items-center space-x-2 p-2">
          <div className="w-5 h-5 skeleton rounded"></div>
          <div className="w-20 h-5 skeleton rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default PieChartSkl;
