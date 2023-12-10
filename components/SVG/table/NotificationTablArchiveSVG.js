import React from "react";

const NotificationTablArchiveSVG = ({ stroke }) => {
  return (
    <div>
      <svg
        className="w-[16px] md:w-[23px] h-[16px] md:h-[23px]"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="2"
          y="3"
          width="20"
          height="6"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></rect>
        <path
          d="M4 9V20C4 20.5523 4.44772 21 5 21H19C19.5523 21 20 20.5523 20 20V9"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
        <path
          d="M10 13H14"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </svg>
    </div>
  );
};

export default NotificationTablArchiveSVG;
