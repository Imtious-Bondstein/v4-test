import React from "react";

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center h-[665px] ">
      <div className="w-16 h-16 border-4 border-dashed rounded-full border-primary animate-spin"></div>
    </div>
  );
};

export default LoadingScreen;
