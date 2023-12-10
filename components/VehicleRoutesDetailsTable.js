import React from "react";
import AverageSpeedSVG from "./SVG/AverageSpeedSVG";
import Calendar_1SVG from "./SVG/Calendar_1SVG";
import Calendar_2SVG from "./SVG/Calendar_2SVG";
import MaxSpeedSVG from "./SVG/MaxSpeedSVG";
import Timer_2SVG from "./SVG/Timer_2SVG";
import VehicleRouteSVG from "./SVG/VehicleRouteSVG";
import moment from "moment/moment";

const VehicleRoutesDetailsTable = ({
  startDate,
  endDate,
  vehicleRoute,
  maxSpeed,
  averageSpeed,
}) => {
  // ========== calculate time diff ==========
  var one_day = 24 * 60 * 60 * 1000; // total milliseconds in one day

  var start_time = startDate
    ? new Date(startDate).getTime()
    : new Date().getTime();
  // time in miliiseconds

  var end_time = endDate ? new Date(endDate).getTime() : new Date().getTime();

  var time_diff = Math.abs(end_time - start_time); //time diff in ms

  var days = Math.floor(time_diff / one_day); // number of days

  var remaining_time = time_diff - days * one_day; // remaining ms

  var hours = Math.floor(remaining_time / (60 * 60 * 1000));
  remaining_time = remaining_time - hours * 60 * 60 * 1000;

  var minutes = Math.floor(remaining_time / (60 * 1000));
  remaining_time = remaining_time - minutes * 60 * 1000;

  var seconds = Math.ceil(remaining_time / 1000);

  return (
    <div className="bg-white md:p-3 lg:h-[260px] rounded-xl w-full md:w-[327px]">
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="py-2.5 px-2.5 md:py-2 md:bg-secondary rounded-md flex flex-col xs:flex-row items-center xs:space-x-2">
          <Calendar_1SVG />
          <div className="mt-2 xs:mt-0">
            <p className="font-bold text-center xs:text-start">From</p>
            <p className="text-sm text-tertiaryText text-center xs:text-start">
              {startDate
                ? moment(startDate).format("ddd, DD MMM, YYYY, hh:mm a")
                : "00:00:00"}
            </p>
          </div>
        </div>

        <div className="py-4 px-2.5 md:py-3 md:bg-secondary rounded-md flex flex-col xs:flex-row items-center xs:space-x-2">
          <Calendar_2SVG />
          <div className="mt-2 xs:mt-0">
            <p className="font-bold text-center xs:text-start">To</p>
            <p className="text-sm text-tertiaryText text-center xs:text-start">
              {endDate
                ? moment(endDate).format("ddd, DD MMM, YYYY, hh:mm a")
                : "00:00:00"}
            </p>
          </div>
        </div>

        <div className="py-4 px-2.5 md:py-3  md:bg-secondary rounded-md flex flex-col xs:flex-row items-center xs:space-x-2">
          <Timer_2SVG />
          <div className="mt-2 xs:mt-0">
            <p className="font-bold text-center xs:text-start">Duration</p>
            <p className="text-sm text-tertiaryText text-center xs:text-start">
              {`${days}d : ${hours}h : ${minutes}m`}
            </p>
          </div>
        </div>

        <div className="py-4 y-2.5 px-2.5 md:py-3 md:bg-secondary rounded-md flex flex-col xs:flex-row items-center xs:space-x-2">
          <VehicleRouteSVG />
          <div className="mt-3 xs:mt-0">
            <p className="font-bold text-center xs:text-start">Vehicle Route</p>
            <p className="text-sm text-tertiaryText text-center xs:text-start">
              {vehicleRoute ? vehicleRoute : 0} Km
            </p>
          </div>
        </div>

        <div className="py-4 px-2.5 md:py-3 bg-secondary rounded-md md:flex items-center space-x-2 hidden">
          <MaxSpeedSVG />
          <div>
            <p className="font-bold">Maximum Speed</p>
            <p className="text-sm text-tertiaryText">
              {maxSpeed ? maxSpeed : 0} Km/H
            </p>
          </div>
        </div>

        <div className="py-4 px-2.5 md:py-3 bg-secondary rounded-md md:flex items-center space-x-2 hidden">
          <AverageSpeedSVG />
          <div>
            <p className="font-bold">Average Speed</p>
            <p className="text-sm text-tertiaryText">
              {averageSpeed ? averageSpeed : 0} Km/H
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleRoutesDetailsTable;
