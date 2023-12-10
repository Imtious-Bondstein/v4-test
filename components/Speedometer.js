import React, { useEffect } from "react";
import cc from "classcat";
import { useGauge } from "use-gauge";
import { motion, MotionConfig, useAnimationFrame } from "framer-motion";

function Speedometer(props) {
  const { value } = props;
  const gauge = useGauge({
    domain: [0, 200],
    startAngle: 90,
    endAngle: 270,
    numTicks: 21,
    diameter: 160,
  });

  const needle = gauge.getNeedleProps({
    value,
    baseRadius: 8,
    tipRadius: 2,
  });
  return (
    <MotionConfig transition={{ type: "tween", ease: "linear" }}>
      <div className=" relative">
        <svg
          className="w-full overflow-visible p-2 relative"
          {...gauge.getSVGProps()}
        >
          <g id="ticks">
            {gauge.ticks.map((angle) => {
              const asValue = gauge.angleToValue(angle);
              const showText = asValue % 30 === 0;

              return (
                <React.Fragment key={`tick-group-${angle}`}>
                  <line
                    className={cc([
                      "stroke-gray-300",
                      {
                        "stroke-green-300": asValue <= 20,
                        "stroke-yellow-300": asValue >= 60 && asValue <= 80,
                        "stroke-red-400": asValue >= 80,
                      },
                    ])}
                    strokeWidth={4}
                    {...gauge.getTickProps({
                      angle,
                      length: 15,
                    })}
                  />
                  {showText && (
                    <text
                      className="text-xs fill-gray-400 font-medium"
                      {...gauge.getLabelProps({ angle, offset: 20 })}
                    >
                      {asValue}
                    </text>
                  )}
                </React.Fragment>
              );
            })}
          </g>
          {/* <g id="needle" style={{ transition: "all 1s ease    " }}>
                    <circle className="fill-gray-300" {...needle.base} r={12} />
                    <circle className="fill-primary" {...needle.base} />
                    <circle className="fill-primary" {...needle.tip} />
                    <polyline style={{ transition: "all 1s ease" }} className="fill-primary" points={needle.points} />
                    <circle className="fill-white" {...needle.base} r={4} />
                </g> */}
          <g id="needle">
            <motion.circle
              className="fill-gray-200"
              animate={{
                cx: needle.base.cx,
                cy: needle.base.cy,
              }}
              r={15}
            />
            <motion.circle
              className="fill-orange-400"
              animate={{
                cx: needle.base.cx,
                cy: needle.base.cy,
              }}
              r={8}
            />
            <motion.line
              className="stroke-orange-400"
              strokeLinecap="round"
              strokeWidth={6}
              animate={{
                x1: needle.base.cx,
                x2: needle.tip.cx,
                y1: needle.base.cy,
                y2: needle.tip.cy,
              }}
            />
          </g>
        </svg>
        {/* speed value */}
        <p className="absolute top-10 left-0 text-center text-xs font-bold w-full z-0">
          {value} kmh
        </p>
      </div>
    </MotionConfig>
  );
}

export default Speedometer;
