import React from "react";

const TriangleSVG = ({ height, width }) => {
  return (
    <div>
      <svg
        width={width}
        height={height}
        viewBox="0 0 49 43"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22.7679 1C23.5377 -0.333329 25.4622 -0.333333 26.2321 1L48.3157 39.25C49.0855 40.5833 48.1232 42.25 46.5836 42.25H2.41635C0.876754 42.25 -0.0854983 40.5833 0.684302 39.25L22.7679 1Z"
          fill="white"
        />
      </svg>
    </div>
  );
};

export default TriangleSVG;
