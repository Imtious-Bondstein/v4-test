import React from "react";

const RightArrowSVG = ({ fillColor }) => {
  return (
    <div>
      <svg
        className={fillColor ? fillColor : "#1E1E1E"}
        width="7"
        height="10"
        viewBox="0 0 7 10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M3.24329 5.17106L0.414289 2.34306L1.82829 0.928063L6.07129 5.17106L1.82829 9.41406L0.414289 7.99906L3.24329 5.17106Z" />
      </svg>
    </div>
  );
};

export default RightArrowSVG;
