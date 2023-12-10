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
  vehicleTime,
  vehicleTime2,
  vehicleTimeAgo,
} from "@/utils/dateTimeConverter";
import Speedometer from "../Speedometer";

import "../../styles/components/currentLocationMap.css";
import CloseSVG from "../SVG/CloseSVG";
import TriangleSVG from "../SVG/TriangleSVG";
import axios from "@/plugins/axios";
import {
  handleRouteVehicleType,
  handleSelectorVehicleType,
  handleVehicleType,
} from "@/utils/vehicleTypeCheck";

const CurrentLocationVehicleInfoWindow = ({
  path,
  vehicleDetails,
  handleCloseInfoWindow,
  isMapSharing,
  last_engine_on,
}) => {
  const [isParking, setIsParking] = useState(false);
  const [isInGarage, setIsInGarage] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const updateOfflineType = async (id, type) => {
    let data = {
      identifier: id,
    };
    type === "parking" ? (data.parking = true) : (data.workshop = true);

    console.log("Offline Type ", data);

    await axios
      .post("/api/v4/offline-type-update", data)
      .then((res) => {
        console.log("offline type res------", res);
      })
      .catch((err) => {
        console.log("offline type error :", err);
      });
  };

  const handleInGarage = () => {
    // setIsInGarage(true);
  };

  const handleRaiseSupportTicket = () => {
    console.log("raising.......");
  };

  const handleBSTIDCopy = (bst_id) => {
    navigator.clipboard.writeText(bst_id), setIsCopied(true);
  };

  setTimeout(() => {
    setIsCopied(false);
  }, [3000]);

  return (
    <div className="w-96 absolute bottom-20 -right-40 z-50">
      <div className="px-2 pb-2 pt-6 rounded-xl text-xs flex-col bg-white z-[100]">
        <button
          className=" fill-[#C9D1DA] hover:fill-quaternary absolute top-1 right-1"
          onClick={() => handleCloseInfoWindow(vehicleDetails)}
        >
          <CloseSVG />
        </button>
        {/* header */}
        <div className="flex items-center justify-center space-x-2 rounded p-1 bg-primary mb-1.5">
          <div className="text-right">
            <CustomToolTip
              id={`current-location-${vehicleDetails.bst_id}`}
              title={`${isCopied === true ? "Copied!" : "Click to copy"}`}
              containerClass="map-window map-middle current bst_id shadow-xl"
            >
              <p
                onClick={() => handleBSTIDCopy(vehicleDetails.bst_id)}
                className="font-bold cursor-pointer hover:text-gray-700"
              >
                {vehicleDetails.bst_id}
              </p>
            </CustomToolTip>

            <p>{vehicleDetails.v_vrn}</p>
          </div>
          <img
            src={
              vehicleDetails.popup_image === null
                ? handleRouteVehicleType(
                    vehicleDetails && vehicleDetails.vehicle_type
                      ? vehicleDetails.vehicle_type.toLowerCase()
                      : ""
                  )
                : vehicleDetails.popup_image
            }
            className="w-[39px] h-[39px]"
            alt=""
          />
          <div className="text-left">
            <p className="font-bold">{vehicleDetails.customer_name}</p>
            {/* <p>{vehicleDetails.v_username}</p> */}
          </div>
        </div>
        {/* body */}
        <div className="grid grid-cols-2 gap-1.5 mb-1.5">
          <div className="bg-secondary rounded p-2">
            {path?.device_status === "Offline" ? (
              <div className="h-full">
                {!isParking ? (
                  <div className="flex flex-col justify-between h-full">
                    <p>
                      This car's tracker appears to be offline. Is it inside a
                      shaded parking?
                    </p>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() =>
                          updateOfflineType(
                            vehicleDetails.v_identifier,
                            "parking"
                          )
                        }
                        className="w-full bg-primary rounded py-1"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setIsParking(true)}
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
                          <button
                            onClick={() =>
                              updateOfflineType(
                                vehicleDetails.v_identifier,
                                "workshop"
                              )
                            }
                            className="w-full bg-primary rounded py-1"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setIsInGarage(true)}
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
              <Speedometer value={path.speed_status ? path.speed_status : 0} />
            )}
          </div>

          <div className="bg-secondary rounded p-2 flex flex-col justify-between">
            <Link
              href={`https://www.google.com/maps/search/?api=1&query=${path.lat},${path.lng}`}
              target="_blank"
            >
              <p className="">
                {path.nearby_l_name} ({path.landmark_distance} Km){" "}
              </p>
              <div className="text-[10px]">
                <span>{path.lat}, </span>
                <span>{path.lng}</span>
              </div>
            </Link>

            <img src={map_markers.src} className="" alt="" />
          </div>
        </div>
        {/* status  */}
        <div className="grid grid-cols-2 gap-2 mb-1.5">
          <div
            className={`p-2 rounded flex items-center space-x-2 ${
              path?.engine_status ? "bg-[#50BFA514]" : "bg-[#ff000021]"
            }`}
          >
            <div
              className={
                path?.engine_status ? "fill-[#1DD1A1]" : "fill-[#d11d3b]"
              }
            >
              <EngineOnSVG />
            </div>
            <p>Engine Status: {path.engine_status ? "On" : "Off"}</p>
          </div>
          <div className="bg-secondary p-2 rounded flex items-center space-x-2">
            <TimeSVG />
            <p>
              {infoWindowDateTime(path.time_inserted)} &#40;
              {vehicleTimeAgo(path.time_inserted)}&#41;
            </p>
          </div>
        </div>

        {/* status link */}
        {!isMapSharing && (
          <div className="grid grid-cols-5 gap-1.5 relative">
            <CustomToolTip
              id={`map-location-report-${vehicleDetails.v_identifier}`}
              title={`Location Report`}
              containerClass="map-window map-left default-tooltip tooltipStyleChange"
            >
              <Link
                href={`/reports/location?identifier=${vehicleDetails.v_identifier}`}
                id={`action-messenger-${vehicleDetails.v_identifier}`}
                className=""
              >
                <LocationSVG />
              </Link>
            </CustomToolTip>

            <CustomToolTip
              id={`map-hourly-report-${vehicleDetails.v_identifier}`}
              title={`Hourly Distance Report`}
              containerClass="map-window map-middle default-tooltip tooltipStyleChange"
            >
              <Link
                href={`/reports/distance-report/hourly?identifier=${vehicleDetails.v_identifier}`}
                id={`action-messenger-${vehicleDetails.v_identifier}`}
                className=""
              >
                <ClockSVG />
              </Link>
            </CustomToolTip>

            <CustomToolTip
              id={`map-speed-report-${vehicleDetails.v_identifier}`}
              title={`Engine Report`}
              containerClass="map-window map-middle default-tooltip tooltipStyleChange "
            >
              <Link
                href={`/reports/engine?identifier=${vehicleDetails.v_identifier}`}
                id={`action-messenger-${vehicleDetails.v_identifier}`}
                className=""
              >
                <EngineReportSVG />
              </Link>
            </CustomToolTip>

            <CustomToolTip
              id={`map-Engine-report-${vehicleDetails.v_identifier}`}
              title={`Over Speed Report`}
              containerClass="map-window map-middle default-tooltip  tooltipStyleChange "
            >
              <Link
                href={`/activity/alerts/overspeed?identifier=${vehicleDetails.v_identifier}`}
                id={`action-messenger-${vehicleDetails.v_identifier}`}
                className=""
              >
                <SpeedMeterSVG />
              </Link>
            </CustomToolTip>

            <CustomToolTip
              id={`map-Vehicle-report-${vehicleDetails.v_identifier}`}
              title={`Vehicle Route`}
              containerClass="map-window map-right  default-tooltip tooltipStyleChange "
            >
              <Link
                href={`/location/vehicle-route?identifier=${vehicleDetails.v_identifier}`}
                id={`action-messenger-${vehicleDetails.v_identifier}`}
                className=" "
              >
                <RouteSVG />
              </Link>
            </CustomToolTip>
          </div>
        )}

        <div className="mt-1">
          <p className="text-right text-[10px] text-gray-400">
            <span>Last Engine On: </span>
            {vehicleDetails.last_engine_on
              ? vehicleDateTime(vehicleDetails.last_engine_on) +
                " | " +
                vehicleTime(vehicleDetails.last_engine_on)
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

export default CurrentLocationVehicleInfoWindow;
