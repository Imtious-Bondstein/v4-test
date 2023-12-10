import Link from "next/link";
import React, { useEffect, useState } from "react";
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
import { infoWindowDateTime } from "@/utils/dateTimeConverter";
import CloseSVG from "../SVG/CloseSVG";
import TriangleSVG from "../SVG/TriangleSVG";
// import  from "../Speedometer";

import dynamic from "next/dynamic";
const Speedometer = dynamic(() => import("../Speedometer"), { ssr: false });

import "../../styles/components/currentLocationMap.css";
import MapSVG from "../SVG/MapSVG";
import { renderToString } from "react-dom/server";
// import { useRouter } from "next/router";

const VehicleRouteVehicleInfoWindowOld = ({ path, vehicleDetails }) => {
  const [isParking, setIsParking] = useState(false);
  const [isInGarage, setIsInGarage] = useState(false);

  // const currentRoute = useRouter();

  const handleParking = () => {
    setIsParking(true);
  };

  const handleInGarage = () => {
    setIsInGarage(true);
  };

  const handleRaiseSupportTicket = () => {
    console.log("raising.......");
  };
  console.log("path::", path);
  console.log("vehicleDetails::", vehicleDetails);
  return (
    <div className="px-2 pb-2 pt-6 rounded-xl text-xs flex-col bg-white z-[100]">
      {/* <button
          className=" fill-[#C9D1DA] hover:fill-quaternary absolute top-1 right-1"
          onClick={() => setIsInfoShowing(false)}
        >
          <CloseSVG />
        </button> */}
      {/* header */}
      <div className="flex items-center justify-center space-x-2 rounded p-1 bg-primary mb-1.5">
        <div className="text-right">
          <p className="font-bold">{vehicleDetails.bst_id}</p>
          <p>{vehicleDetails.vrn}</p>
        </div>
        <img
          src={vehicleDetails.popup_image}
          className="w-[39px] h-[39px]"
          alt=""
        />
        <div className="text-left">
          <p className="font-bold">{vehicleDetails.vehicle_name}</p>
          <p>{vehicleDetails.username}</p>
        </div>
      </div>
      {/* body */}
      <div className="grid grid-cols-2 gap-1.5 mb-1.5">
        <div className="bg-secondary rounded p-2">
          <Speedometer value={path.speed} />
        </div>

        <div className="bg-secondary rounded p-2 flex flex-col justify-between">
          <Link
            href={`https://www.google.com/maps/search/?api=1&query=${path.lat},${path.lng}`}
            target="_blank"
            className="w-36 text-[11px]"
          >
            <p>
              {path.location} ({path.landmark_distance} Km)
            </p>
            <p>
              {path.lat}, {path.lng}
            </p>
          </Link>
          {/* <img src={map_markers.src} className="" alt="" /> */}
          <MapSVG />
        </div>
      </div>
      {/* status  */}
      <div className="grid grid-cols-2 gap-2 mb-1.5">
        <div
          className={`p-2 rounded flex items-center space-x-2 ${path.engine_status ? "bg-[#50BFA514]" : "bg-[#ff000021]"
            }`}
        >
          <div
            className={path.engine_status ? "fill-[#1DD1A1]" : "fill-[#d11d3b]"}
          >
            <EngineOnSVG />
          </div>
          <p>Engine Status : {path.engine_status ? "On" : "Off"}</p>
        </div>
        <div className="bg-secondary p-2 rounded flex items-center space-x-2">
          <TimeSVG />
          <p>{infoWindowDateTime(path.dateTime)}</p>
        </div>
      </div>

      {/* status link */}
      <div className="grid grid-cols-5 gap-1.5">
        <CustomToolTip
          id={`map-location-report-1`}
          title={`Location Report`}
          containerClass="map-window map-left default-tooltip tooltipStyleChange"
        >
          <Link
            href={`/reports/location?identifier=${vehicleDetails.identifier}`}
            id={`action-messenger-${vehicleDetails.identifier}`}
            className=""
          >
            <LocationSVG />
          </Link>
        </CustomToolTip>

        <CustomToolTip
          id={`map-hourly-report-1`}
          title={`Hourly Distance Report`}
          containerClass="map-window map-middle default-tooltip tooltipStyleChange"
        >
          <Link
            href={`/reports/distance-report/hourly?identifier=${vehicleDetails.identifier}`}
            id={`action-messenger-${vehicleDetails.identifier}`}
            className=""
          >
            <ClockSVG />
          </Link>
        </CustomToolTip>

        <CustomToolTip
          id={`map-speed-report-1`}
          title={`Engine Report`}
          containerClass="map-window map-middle default-tooltip tooltipStyleChange "
        >
          <Link
            href={`/reports/engine?identifier=${vehicleDetails.identifier}`}
            id={`action-messenger-${vehicleDetails.identifier}`}
            className=""
          >
            <EngineReportSVG />
          </Link>
        </CustomToolTip>

        <CustomToolTip
          id={`map-Engine-report-1`}
          title={`Over Speed Report`}
          containerClass="map-window map-middle default-tooltip  tooltipStyleChange "
        >
          <Link
            href={`/activity/alerts/overspeed?identifier=${vehicleDetails.identifier}`}
            id={`action-messenger-${vehicleDetails.identifier}`}
            className=""
          >
            <SpeedMeterSVG />
          </Link>
        </CustomToolTip>

        <CustomToolTip
          id={`map-Vehicle-report-1`}
          title={`Current Location`}
          containerClass="map-window map-right  default-tooltip tooltipStyleChange "
        >
          <Link
            href={`/location/current-location?identifier=${vehicleDetails.identifier}`}
            id={`action-messenger-${vehicleDetails.identifier}`}
            className=" "
          >
            <RouteSVG />
          </Link>
        </CustomToolTip>
      </div>

      <div className="mt-1">
        {/* {currentRoute.asPath === "/location/current-location" ? (
            <p className="text-right text-[10px] text-gray-400">
              last engine on: 31 Dec, 2023, 2:12 PM
            </p>
          ) : (
            <p className="h-2.5"></p>
          )} */}
      </div>
    </div>
  );
};

export default VehicleRouteVehicleInfoWindowOld;
