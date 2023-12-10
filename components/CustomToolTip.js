import React from "react";
import PropTypes from "prop-types";

const CustomToolTip = ({
  title,
  children,
  position,
  containerClass,
  theme,
}) => {
  return (
    <div className={`tooltip ${containerClass}`}>
      {children}
      <div
        className={`tooltiptext ${
          theme === "dark" ? `dark` : `light`
        } tooltip-${position}`}
      >
        {title}
        <span className="tooltip-arrow"></span>
      </div>
    </div>
  );
};

export default CustomToolTip;

CustomToolTip.defaultProps = {
  title: "sample",
  children: React.createElement("div"),
  position: "bottom",
  containerClass: "",
  theme: "light",
};

CustomToolTip.propTypes = {
  title: PropTypes.string,
  children: PropTypes.element,
  position: PropTypes.string,
  containerClass: PropTypes.string,
  theme: PropTypes.string,
};
