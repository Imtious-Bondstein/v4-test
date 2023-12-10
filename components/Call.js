import CallSVG from "@/svg/CallSVG";
import React from "react";

const Call = () => {
  return (
    <div className="flex justify-center">
        <button className="tmv-shadow rounded-xl p-3 bg-gradient flex justify-center items-center text-primaryText text-sm font-bold">
            <CallSVG /> &nbsp; &nbsp;
            Call
        </button>
    </div>
  );
};

export default Call;
