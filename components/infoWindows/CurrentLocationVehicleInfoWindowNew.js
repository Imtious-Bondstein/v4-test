import Link from "next/link";
import React, { useState } from "react";
import car_1 from "../../public/cars/carT-1.png";
import map_markers from "../../public/info/mapMarkers.png";
import CustomToolTip from "../CustomToolTip";
import ClockSVG from "../SVG/mapInfoSvg/ClockSVG";
import EngineOnSVG from "../SVG/EngineOnSVG";
import EngineReportSVG from "../SVG/mapInfoSvg/EngineReportSVG";
import LocationSVG from "../SVG/mapInfoSvg/LocationSVG";
import RouteSVG from "../SVG/mapInfoSvg/RouteSVG";
import SpeedMeterSVG from "../SVG/mapInfoSvg/SpeedMeterSVG";
import TimeSVG from "../SVG/TimeSVG";
import SpeedMeter from "../SpeedMeter";
import SupportSVG from "@/svg/menu/SupportSVG";
import {
  infoWindowDateTime,
  vehicleDateTime,
} from "@/utils/dateTimeConverter";
import Speedometer from "../Speedometer";

import "../../styles/components/currentLocationMap.css";
import CloseSVG from "../SVG/CloseSVG";
import TriangleSVG from "../SVG/TriangleSVG";

const CurrentLocationVehicleInfoWindowNew = ({
  vehicle,
  handleCloseInfoWindow,
}) => {
  console.log("props vehicle:", vehicle);
  const [isParking, setIsParking] = useState(false);
  const [isInGarage, setIsInGarage] = useState(false);

  const handleParking = () => {
    setIsParking(true);
  };

  const handleInGarage = () => {
    setIsInGarage(true);
  };

  const handleRaiseSupportTicket = () => {
    console.log("raising.......");
  };

  return (
    <div className="w-96 absolute bottom-20 -right-36">
      <div className="px-2 pb-2 pt-6 rounded-xl text-xs flex-col bg-white z-[100]">
        <button
          className=" fill-[#C9D1DA] hover:fill-quaternary absolute top-1 right-1"
          onClick={() => handleCloseInfoWindow(vehicle)}
        >
          <CloseSVG />
        </button>
        {/* header */}
        <div className="flex items-center justify-center space-x-2 rounded p-1 bg-primary mb-1.5">
          <div className="text-right">
            <p className="font-bold">{vehicle.bst_id}</p>
            <p>{vehicle.v_vrn}</p>
          </div>
          <img src={vehicle.popup_image} className="w-[39px] h-[39px]" alt="" />
          <div className="text-left">
            <p className="font-bold">{vehicle.vehicle_name}</p>
            <p>{vehicle.v_username}</p>
          </div>
        </div>
        {/* body */}
        <div className="grid grid-cols-2 gap-1.5 mb-1.5">
          <div className="bg-secondary rounded p-2">
            {vehicle?.device_status === "offline" ? (
              <div className="h-full">
                {!isParking ? (
                  <div className="flex flex-col justify-between h-full">
                    <p>
                      This car's tracker appears to be offline. Is it inside a
                      shaded parking?
                    </p>
                    <div className="flex items-center space-x-3">
                      <button className="w-full bg-primary rounded py-1">
                        Yes
                      </button>
                      <button
                        onClick={handleParking}
                        className="w-full bg-white rounded py-1"
                      >
                        No
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-full">
                    {!isInGarage ? (
                      <div className="flex flex-col justify-between h-full">
                        <p>Is it in a garage for maintenance?</p>
                        <div className="flex items-center space-x-3 mt-2">
                          <button className="w-full bg-primary rounded py-1">
                            Yes
                          </button>
                          <button
                            onClick={handleInGarage}
                            className="w-full bg-white rounded py-1"
                          >
                            No
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col justify-between h-full">
                        <p>
                          This car's tracker appears to be offline. Please raise
                          a support ticket.
                        </p>
                        <button
                          onClick={handleRaiseSupportTicket}
                          className="w-full bg-primary rounded py-1 flex items-center space-x-2 mt-1.5 px-2.5"
                        >
                          <SupportSVG />
                          <span className="font-normal">
                            Raise Support Ticket
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <Speedometer
                value={vehicle.speed_status ? vehicle.speed_status : 0}
              />
            )}
          </div>

          <div className="bg-secondary rounded p-2 flex flex-col justify-between">
            <div>
              <p className="">
                {vehicle.nearby_l_name} ({vehicle.landmark_distance} Km){" "}
              </p>
              <div className="text-[10px]">
                <span>{vehicle.lat}, </span>
                <span>{vehicle.lng}</span>
              </div>
            </div>

            <img src={map_markers.src} className="" alt="" />
          </div>
        </div>
        {/* status  */}
        <div className="grid grid-cols-2 gap-2 mb-1.5">
          <div
            className={`p-2 rounded flex items-center space-x-2 ${vehicle?.engine_status ? "bg-[#50BFA514]" : "bg-[#ff000021]"
              }`}
          >
            <div
              className={
                vehicle?.engine_status ? "fill-[#1DD1A1]" : "fill-[#d11d3b]"
              }
            >
              <EngineOnSVG />
            </div>
            <p>Engine Status: {vehicle.engine_status ? "On" : "Off"}</p>
          </div>
          <div className="bg-secondary p-2 rounded flex items-center space-x-2">
            <TimeSVG />
            <p>{infoWindowDateTime(vehicle.time_inserted)}</p>
          </div>
        </div>

        {/* status link */}
        <div className="grid grid-cols-5 gap-1.5 relative">
          <CustomToolTip
            id={`map-location-report-${vehicle.v_identifier}`}
            title={`Location Report`}
            containerClass="map-window map-left default-tooltip tooltipStyleChange"
          >
            <LocationSVG />
          </CustomToolTip>

          <CustomToolTip
            id={`map-hourly-report-${vehicle.v_identifier}`}
            title={`Hourly Distance Report`}
            containerClass="map-window map-middle default-tooltip tooltipStyleChange"
          >
            <ClockSVG />
          </CustomToolTip>

          <CustomToolTip
            id={`map-speed-report-${vehicle.v_identifier}`}
            title={`Engine Report`}
            containerClass="map-window map-middle default-tooltip tooltipStyleChange "
          >
            <EngineReportSVG />
          </CustomToolTip>

          <CustomToolTip
            id={`map-Engine-report-${vehicle.v_identifier}`}
            title={`Over Speed Report`}
            containerClass="map-window map-middle default-tooltip  tooltipStyleChange "
          >
            <SpeedMeterSVG />
          </CustomToolTip>

          <CustomToolTip
            id={`map-Vehicle-report-${vehicle.v_identifier}`}
            title={`Vehicle Route`}
            containerClass="map-window map-right  default-tooltip tooltipStyleChange "
          >
            <RouteSVG />
          </CustomToolTip>
        </div>

        <div className="mt-1">
          <p className="text-right text-[10px] text-gray-400">
            <span>Last Engine On: </span>
            {vehicle.last_engine_on
              ? vehicleDateTime(vehicle.last_engine_on)
              : ""}
          </p>
        </div>
      </div>
      <div className="w-full absolute -bottom-6">
        <div className="rotate-180 flex justify-center">
          <TriangleSVG height={33} width={25} />
        </div>
      </div>
    </div>
  );
};

export default CurrentLocationVehicleInfoWindowNew;
