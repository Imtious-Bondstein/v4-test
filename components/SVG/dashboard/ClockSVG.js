import React from "react";

const ClockSVG = () => {
  return (
    <div>
      <svg
        width="21"
        height="20"
        viewBox="0 0 21 20"
        className="group-hover:fill-[url(#paint0_linear_1361_1253)] fill-[#8D96A1]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M10.6748 20C5.1518 20 0.674805 15.523 0.674805 10C0.674805 4.477 5.1518 0 10.6748 0C16.1978 0 20.6748 4.477 20.6748 10C20.6748 15.523 16.1978 20 10.6748 20ZM11.6748 10V5H9.6748V12H15.6748V10H11.6748Z" />
        <defs>
          <linearGradient
            id="paint0_linear_1361_1253"
            x1="20.6748"
            y1="9.81814"
            x2="0.674805"
            y2="9.81814"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.0104167" stopColor="#F36B24" />
            <stop offset="1" stopColor="#FDD10E" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default ClockSVG;
