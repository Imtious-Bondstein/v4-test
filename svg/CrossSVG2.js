import React from "react";

const CrossSVG2 = () => {
  return (
    <div>
      <svg
        width="20"
        height="20"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.75 5.25L5.25 12.75"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.25 5.25L12.75 12.75"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="0.5" y="0.5" width="17" height="17" rx="8.5" stroke="white" />
      </svg>
    </div>
  );
};

export default CrossSVG2;
