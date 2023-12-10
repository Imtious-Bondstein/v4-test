import React from "react";

const LineGraphSkl = () => {
  return (
    <div className="">
      <div className="bg-white flex justify-between items-baseline px-2 border-l-4 border-b-4 skeleton-border ">
        <div className="w-8 h-[80px] skeleton rounded-t"></div>
        <div className="w-8 h-[150px] skeleton rounded-t"></div>
        <div className="w-8 h-[300px] skeleton rounded-t"></div>
        <div className="w-8 h-[190px] skeleton rounded-t"></div>
        <div className="w-8 h-[260px] skeleton rounded-t"></div>
        <div className="w-8 h-[60px] skeleton rounded-t"></div>
        <div className="w-8 h-[140px] skeleton rounded-t"></div>
      </div>
    </div>
  );
};

export default LineGraphSkl;
