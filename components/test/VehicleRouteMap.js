"use client";
import dotenv from "dotenv";

import {
    GoogleMap,
    InfoWindowF,
    LoadScript,
    Marker,
    OverlayView,
    OverlayViewF,
    Polyline,
    useJsApiLoader,
} from "@react-google-maps/api";
import React, { useEffect, useRef, useState } from "react";

import { useReactToPrint } from "react-to-print";

// ==== svg
import GreenFlagSVG from "../SVG/mapMarkerSVG/GreenFlagSVG";
import RedFlagSVG from "../SVG/mapMarkerSVG/RedFlagSVG";
import GreenFlag from "../../public/markers/green-flag.png";
import RedFlag from "../../public/markers/red-flag.png";
import ParkingSVG from "../SVG/mapMarkerButton/ParkingSVG";
import SpeedSVG from "../SVG/mapMarkerButton/SpeedSVG";
import PowerSVG from "../SVG/mapMarkerButton/PowerSVG";
import BrakeSVG from "../SVG/mapMarkerButton/BrakeSVG";
import WatchmanSVG from "../SVG/WatchmanSVG";
import ShareSVG from "../SVG/ShareSVG";
import PrinterSVG from "../SVG/PrinterSVG";
import ParkingMarkerSVG from "../SVG/mapMarkerSVG/ParkingMarkerSVG";

// custom tooltip
import CustomToolTip from "../CustomToolTip";

// marker img import
import parkingMarkerImg from "../../public/markers/parking.png";
import speedMarkerImg from "../../public/markers/speed.png";
import brakeMarkerImg from "../../public/markers/brake.png";
import powerMarkerImg from "../../public/markers/power.png";
import PlaySVG from "../SVG/PlaySVG";
import PauseSVG from "../SVG/PauseSVG";

// range slider
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

import "../../styles/pages/Home.css";
import "../../styles/components/currentLocationMap.css";

import VehicleRouteVehicleInfoWindow from "../infoWindows/VehicleRouteVehicleInfoWindowOld";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VehicleRoutePathsChart from "../charts/VehicleRoutePathsChart";
import { clientBaseUrl } from "@/utils/clientBaseUrl";
import VehicleRoutesDetailsTable from "../VehicleRoutesDetailsTable";

dotenv.config();
const VehicleRouteMap = ({
    isShareMap,
    height,
    title,
    paths,
    parkingMarker,
    speedMarker,
    brakeMarker,
    powerMarker,
    startDate,
    endDate,
    averageSpeed,
    maxSpeed,
    vehicleRoute,
    vehicleDetails,
    isLoading,
    emptyPathsNotify,
    errorNotify,
    successNotify,
}) => {
    const containerStyle = {
        width: "100%",
        // minHeight: "440px",
        height: height,
    };

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const markerRef = useRef(null);
    const markerObjectRef = useRef(null);
    const [visitedPath, setVisitedPath] = useState([]);
    const [unvisitedPath, setUnvisitedPath] = useState(paths);

    const [isParkingMarkerActive, setIsParkingMarkerActive] = useState(false);
    const [isSpeedMarkerActive, setIsSpeedMarkerActive] = useState(false);
    const [isBrakeMarkerActive, setIsBrakeMarkerActive] = useState(false);
    const [isPowerMarkerActive, setIsPowerMarkerActive] = useState(false);

    // useEffect(() => {
    //   console.log(selectedVehiclePaths);
    //   selectedVehiclePaths.paths ? setCarPaths(selectedVehiclePaths.paths) : "";
    // }, [selectedVehiclePaths]);
    // const [markerInterval, setMarkerInterval] = useState(null)
    const markerInterval = useRef(null);

    // const [lastVisitedIndex, setLastVisitedIndex] = useState(0)
    const lastVisitedIndex = useRef(0);

    const [isMarkerPaused, setIsMarkerPaused] = useState(true);

    const [markerDraggervalue, setMarkerDraggervalue] = useState([0, 0]);
    // const [markerMovementSpeed, setMarkerMovementSpeed] = useState(1000)
    const markerMovementSpeed = useRef(1000);

    const [pointLayer, setPointLayer] = useState(false);
    const toggleClass = " transform translate-x-16";

    const [mapCenter, setMapCenter] = useState({
        lat: 23.8103,
        lng: 90.4125,
    });

    const markerIdentifier = useRef(null);

    // const mapZoom = useRef(14)
    const [mapZoom, setMapZoom] = useState(14);

    const markerAngle = useRef(null);

    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        // googleMapsApiKey: "AIzaSyDGCiFRpeVsZEiztcpjt-h_dlEg5tsUZLQ",
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        // googleMapsApiKey: "AIzaSyC4s5fkJjVPRUjA-8Zr_q5hGBwT4og4y60",
    });

    const [isInfoShowing, setIsInfoShowing] = useState(false);
    const clientBaseURL = clientBaseUrl(window.location.hostname);

    const carIcon = {
        url: "https://i.ibb.co/Njg208f/Group.png",
        // url: 'https://images.vexels.com/media/users/3/154573/isolated/preview/bd08e000a449288c914d851cb9dae110-hatchback-car-top-view-silhouette-by-vexels.png',
        // scaledSize: window?.google?.maps.Size(40, 40),
        // scaledSize: { width: 54, height: 30 },
        scaledSize: { width: 50, height: 50 },
        // origin: window?.google?.maps.Point(0, 0),
        // anchor: window?.google?.maps.Point(20, 20),
        anchor: { x: 25, y: 25 },
        // anchor: { x: 20, y: 15 },
        // rotation: 0, // Set initial marker rotation

        scale: 0.2,
    };

    // const parkingMarkerIcon = {
    //   url: parkingMarkerImg.src,
    //   scaledSize: { width: 30, height: 40 },
    //   // scaledSize: window?.google?.maps.Size(40, 40),
    // };

    // const speedMarkerIcon = {
    //   url: speedMarkerImg.src,
    //   scaledSize: { width: 30, height: 40 },
    //   // scaledSize: window?.google?.maps.Size(40, 40),
    // };

    // const brakeMarkerIcon = {
    //   url: brakeMarkerImg.src,
    //   scaledSize: { width: 30, height: 40 },
    //   // scaledSize: window?.google?.maps.Size(40, 40),
    // };

    // const powerMarkerIcon = {
    //   url: powerMarkerImg.src,
    //   scaledSize: { width: 30, height: 40 },
    //   // scaledSize: window?.google?.maps.Size(40, 40),
    // };

    const onLoad = (marker) => {
        // console.log("marker----->", marker);
        markerRef.current = marker;
        markerObjectRef.current = carIcon.url;
    };

    const moveMarkerAlongPath = () => {
        const marker = markerRef.current;
        // console.log("marker====", markerRef.current);
        // const path = unvisitedPath;

        if (marker && paths) {
            const newPosition = paths[marker.index + 1];
            if (newPosition) {
                // Calculate rotation angle based on the previous and current positions
                const previousPosition = paths[marker.index];
                const angle = window?.google?.maps.geometry.spherical.computeHeading(
                    previousPosition,
                    newPosition
                );
                // -----my test----
                markerAngle.current = angle - 90;
                marker.setOptions({
                    position: newPosition,
                    // icon: { ...carIcon }, // Rotate the icon based on the angle
                });

                let markerStyle = document.querySelector(
                    `img[src="${markerObjectRef.current}"]`
                );
                let markerContainerStyle = markerStyle.closest("div");

                // set marker container style
                markerIdentifier.current = markerContainerStyle;

                // markerContainerStyle.style.transform = `rotate(${angle - 90}deg)`;
                // console.log('last visited-----', lastVisitedIndex.current);
                // if (lastVisitedIndex.current % 10 === 9) {
                //     markerContainerStyle.style.transition = 'none'
                // } else {
                //     markerContainerStyle.style.transition = 'all 1s ease'
                // }
                // console.log(markerContainerStyle)
                markerContainerStyle.style.transition = `all ${markerMovementSpeed.current / 1000
                    }s ease`;

                // markerStyle.style.transform = `rotate(${angle - 90}deg)`;
                markerContainerStyle.style.zIndex = 100;
                // markerStyle.style.transition = 'left 1s ease, top 1s ease'
                // console.log(markerContainerStyle);
                marker.index++;

                // track last visited index
                if (marker.index === paths.length - 1) {
                    console.log("Finished");
                    // setIsMarkerPaused(true)
                    // pauseMarkerMovement()
                    stopMarkerMovement();
                } else {
                    lastVisitedIndex.current = marker.index;
                }

                // set drag ranger value
                markerDraggervalue[1] = marker.index;
                setMarkerDraggervalue([...markerDraggervalue]);

                // Update visited and unvisited paths
                const visited = paths.slice(0, marker.index + 1);
                // const unvisited = paths.slice(marker.index + 1);
                setVisitedPath(visited);
                // setUnvisitedPath(unvisited);
            }
        }
    };

    const startMarkerMovement = () => {
        // setVisitedPath([])
        setMapZoom(15);
        // console.log('first index', lastVisitedIndex.current);
        markerIdentifier.current
            ? (markerIdentifier.current.style.transition = "none")
            : "";
        if (lastVisitedIndex.current === paths.length - 2) {
            lastVisitedIndex.current = 0;
            setMapCenter({ lat: paths[0].lat, lng: paths[0].lng });
        }
        markerRef.current.index = lastVisitedIndex.current;
        markerInterval.current = setInterval(
            moveMarkerAlongPath,
            markerMovementSpeed.current
        );
    };

    const pauseMarkerMovement = () => {
        clearInterval(markerInterval.current);
    };

    const stopMarkerMovement = () => {
        // setVisitedPath([])
        clearInterval(markerInterval.current);
        // clearInterval(markerInterval)
        setIsMarkerPaused(true);
        // markerRef.current.index = 0;
        // lastVisitedIndex.current = 0
    };

    const handleMarkerMovement = () => {
        setIsMarkerPaused(!isMarkerPaused);
        if (!isMarkerPaused) {
            pauseMarkerMovement();
        } else {
            startMarkerMovement();
        }
    };

    const handleSliderDrag = () => {
        // console.log('last value------>', value[1])
        lastVisitedIndex.current = markerDraggervalue[1];
        handleMapCenter();
        markerRef.current.index = markerDraggervalue[1];
        moveMarkerAlongPath();
    };

    const handleMarkerMovementSpeed = (value) => {
        markerMovementSpeed.current = value;
        // console.log(markerMovementSpeed.current);
        if (!isMarkerPaused) {
            clearInterval(markerInterval.current);
            startMarkerMovement();
        }
    };

    const handleChartClick = (data, index) => {
        console.log("handle chart click:", data);
        lastVisitedIndex.current = data.activeTooltipIndex - 1;
        handleMapCenter();
        markerRef.current.index = data.activeTooltipIndex - 1;
        moveMarkerAlongPath();
        // console.log('Clicked on area', data.activeTooltipIndex);
    };

    const handleMapCenter = () => {
        markerIdentifier.current
            ? (markerIdentifier.current.style.transition = "none")
            : "";
        setMapCenter({
            lat: paths[lastVisitedIndex.current].lat,
            lng: paths[lastVisitedIndex.current].lng,
        });
    };

    const handleMapDrag = () => {
        console.log("draging......");
        markerIdentifier.current
            ? (markerIdentifier.current.style.transition = "none")
            : "";
    };

    const handlePointLayer = () => {
        setPointLayer(!pointLayer);
    };

    const showVehiclePointerMarker = (marker, index) => {
        const newPosition = paths[index + 1];
        // console.log('test..........', newPosition);
        let angle = 0;
        if (newPosition) {
            // Calculate rotation angle based on the previous and current positions
            const previousPosition = paths[index];
            angle = window?.google?.maps.geometry.spherical.computeHeading(
                previousPosition,
                newPosition
            );

            // console.log('angle:---------', angle);
        }
        return (
            <OverlayViewF
                key={index}
                position={marker}
                mapPaneName={OverlayView.MARKER_LAYER}
                getPixelPositionOffset={(width, height) => ({
                    x: -(width / 2),
                    y: -(height / 2),
                })}
            >
                <img
                    style={{ transform: `rotate(${angle - 90}deg)`, zIndex: -999 }}
                    className="h-8 w-8"
                    src="https://i.ibb.co/Njg208f/Group.png"
                    alt=""
                />
            </OverlayViewF>
        );
    };

    const handleShareVehicleRoute = () => {
        // const clientBaseURL = "http://localhost:3000";
        // const clientBaseURL = "https://sg-tmv.netlify.app";
        const url = `${clientBaseURL}/location/share-vehicle-route?vehicle=${vehicleDetails.identifier
            }&start=${new Date(startDate).toISOString()}&end=${new Date(
                endDate
            ).toISOString()}`;
        const newWindow = window.open(url, "_blank", "noopener,noreferrer");
        if (newWindow) newWindow.opener = null;
    };

    const clearPreviousState = () => {
        markerRef.current = null;
        markerObjectRef.current = null;
        setVisitedPath([]);
        setIsParkingMarkerActive(false);
        setIsSpeedMarkerActive(false);
        setIsBrakeMarkerActive(false);
        setIsPowerMarkerActive(false);
        lastVisitedIndex.current = 0;
        setIsMarkerPaused(true);
        setMarkerDraggervalue([0, 0]);
        markerMovementSpeed.current = 1000;
        setPointLayer(false);
        setMapZoom(14);
        markerAngle.current = null;
        setIsInfoShowing(false);

        // ========clear Interval
        clearInterval(markerInterval.current);
        markerInterval.current = null;
    };

    useEffect(() => {
        if (
            lastVisitedIndex.current % 5 === 4 ||
            lastVisitedIndex.current === paths.length - 2
        ) {
            handleMapCenter();
        }
        // console.log(
        //   "center calling...........",
        //   lastVisitedIndex.current,
        //   " ",
        //   paths.length
        // );
    }, [lastVisitedIndex.current]);

    // =========set map center=========
    useEffect(() => {
        if (paths.length) {
            setMapCenter({ lat: paths[0].lat, lng: paths[0].lng });
        }
        clearPreviousState();
    }, [isLoading]);

    // }, [lastVisitedIndex.current % 10 === 9 || lastVisitedIndex.current === path.length - 1])

    return (
        <div className="vehicle-route">
            {title ? (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 lg:mb-3 mt-5 lg:mt-0">
                    <h1 className="text-xl md:text-[26px] text-primaryText font-bold">
                        {title}
                    </h1>
                    {/* toggle button start */}
                    <div className="mr-4 absolute sm:relative left-10 sm:-left-14 top-32 lg:left-0 sm:top-20 lg:top-0 mt-3 lg:mt-0 sm:-ml-16 lg:ml-0">
                        <div
                            className="w-32 h-9 flex items-center bg-white rounded-[10px] cursor-pointer tmv-shadow relative z-10 text-sm font-normal"
                            onClick={handlePointLayer}
                        >
                            {/* Switch */}
                            <div className="w-32 h-9 flex justify-center items-center absolute top-0 left-0 px-3 text-tertiaryText">
                                <p className="w-full text-left">Vehicle</p>
                                <p className="w-full text-right">Point</p>
                            </div>
                            <div
                                className={
                                    "bg-primary primary-shadow z-10 w-16 h-9 flex justify-center items-center rounded-[10px] shadow-md transform duration-300 ease-in-out" +
                                    (!pointLayer ? null : toggleClass)
                                }
                            >
                                <p>{pointLayer ? "Point" : "Vehicle"}</p>
                            </div>
                        </div>
                        {/* === toggle button end === */}
                    </div>
                </div>
            ) : (
                ""
            )}

            {isLoading ? (
                <div className="w-full bg-white p-2 min-h-[440px] h-[60vh] skeleton-border rounded-xl">
                    <div className="w-full h-full skeleton rounded-xl"></div>
                </div>
            ) : (
                <div>
                    {/* ===== map ==== */}
                    <div
                        className={`relative bg-white rounded-xl ${!isShareMap ? "p-2" : ""
                            }`}
                    >
                        <ToastContainer
                            style={{
                                position: "absolute",
                                top: 10,
                                left: 0,
                                right: 0,
                                margin: "0 auto",
                            }}
                        />

                        {isLoaded ? (
                            <div className="vehicle-route-map">
                                <GoogleMap
                                    mapContainerStyle={containerStyle}
                                    center={mapCenter}
                                    zoom={mapZoom}
                                    onDrag={handleMapDrag}
                                    ref={componentRef}
                                >
                                    {paths.length && (
                                        <>
                                            <Polyline
                                                path={paths}
                                                options={{
                                                    strokeColor: "#e31b25",
                                                    strokeOpacity: 1.0,
                                                    strokeWeight: 4,
                                                    zIndex: -100,
                                                }}
                                            />
                                            <Polyline
                                                path={visitedPath}
                                                options={{
                                                    strokeColor: "#00ae65",
                                                    strokeOpacity: 1.0,
                                                    strokeWeight: 4,
                                                }}
                                            />
                                            {/* <Marker onLoad={onLoad} position={path[0]} icon={carIcon} /> */}
                                            <OverlayViewF
                                                onLoad={onLoad}
                                                position={paths[0]}
                                                mapPaneName={OverlayView.FLOAT_PANE}
                                                getPixelPositionOffset={(width, height) => ({
                                                    x: -(width / 2),
                                                    y: -(height / 2),
                                                })}
                                            >
                                                <button
                                                    className=""
                                                    onClick={() => setIsInfoShowing(!isInfoShowing)}
                                                >
                                                    <img
                                                        style={{
                                                            transform: `rotate(${markerAngle.current}deg)`,
                                                            transition: "all 1s ease",
                                                        }}
                                                        className="h-12 w-12"
                                                        src="https://i.ibb.co/Njg208f/Group.png"
                                                        alt=""
                                                    />
                                                </button>
                                                {/* {lastVisitedIndex.current} */}
                                                {isInfoShowing && (
                                                    <VehicleRouteVehicleInfoWindow
                                                        path={paths[lastVisitedIndex.current]}
                                                        setIsInfoShowing={setIsInfoShowing}
                                                        vehicleDetails={vehicleDetails}
                                                    />
                                                )}
                                            </OverlayViewF>

                                            {/* =========info window======= */}
                                            {/* {isInfoShowing ? (
                <InfoWindowF
                  position={paths[0]}
                  zIndex={40}
                  onCloseClick={() => setIsInfoShowing(false)}
                >
                  <div>
                    <VehicleRouteVehicleInfoWindow />
                  </div>
                </InfoWindowF>
              ) : (
                ""
              )} */}

                                            {parkingMarker.map((marker, index) => (
                                                <OverlayViewF
                                                    key={index}
                                                    position={marker}
                                                    mapPaneName={OverlayView.FLOAT_PANE}
                                                    getPixelPositionOffset={(width, height) => ({
                                                        x: -(width / 2),
                                                        y: -(height / 1),
                                                    })}
                                                >
                                                    <img
                                                        className={
                                                            isParkingMarkerActive ? "block" : "hidden"
                                                        }
                                                        src={parkingMarkerImg.src}
                                                        alt=""
                                                    />
                                                </OverlayViewF>
                                            ))}

                                            {speedMarker.map((marker, index) => (
                                                <OverlayViewF
                                                    key={index}
                                                    position={marker}
                                                    mapPaneName={OverlayView.FLOAT_PANE}
                                                    getPixelPositionOffset={(width, height) => ({
                                                        x: -(width / 2),
                                                        y: -(height / 1),
                                                    })}
                                                >
                                                    <img
                                                        className={isSpeedMarkerActive ? "block" : "hidden"}
                                                        src={speedMarkerImg.src}
                                                        alt=""
                                                    />
                                                </OverlayViewF>
                                            ))}

                                            {brakeMarker.map((marker, index) => (
                                                <OverlayViewF
                                                    key={index}
                                                    position={marker}
                                                    mapPaneName={OverlayView.FLOAT_PANE}
                                                    getPixelPositionOffset={(width, height) => ({
                                                        x: -(width / 2),
                                                        y: -(height / 1),
                                                    })}
                                                >
                                                    <img
                                                        className={isBrakeMarkerActive ? "block" : "hidden"}
                                                        src={brakeMarkerImg.src}
                                                        alt=""
                                                    />
                                                </OverlayViewF>
                                            ))}

                                            {powerMarker.map((marker, index) => (
                                                <OverlayViewF
                                                    key={index}
                                                    position={marker}
                                                    mapPaneName={OverlayView.FLOAT_PANE}
                                                    getPixelPositionOffset={(width, height) => ({
                                                        x: -(width / 2),
                                                        y: -(height / 1),
                                                    })}
                                                >
                                                    <img
                                                        className={isPowerMarkerActive ? "block" : "hidden"}
                                                        src={powerMarkerImg.src}
                                                        alt=""
                                                    />
                                                </OverlayViewF>
                                            ))}

                                            {/* ========vehicle point======== */}
                                            {pointLayer &&
                                                paths.map((marker, index) =>
                                                    showVehiclePointerMarker(marker, index)
                                                )}

                                            {/* ========start flag======== */}
                                            <OverlayViewF
                                                position={{ lat: paths[0].lat, lng: paths[0].lng }}
                                                mapPaneName={OverlayView.OVERLAY_LAYER}
                                                getPixelPositionOffset={(width, height) => ({
                                                    x: -(width / 2),
                                                    y: -(height / 1.4),
                                                })}
                                            >
                                                <GreenFlagSVG />
                                                {/* <img src={GreenFlag} alt="green-flag" /> */}
                                            </OverlayViewF>
                                            {/* ========end flag======== */}
                                            <OverlayViewF
                                                position={{
                                                    lat: paths[paths.length - 1].lat,
                                                    lng: paths[paths.length - 1].lng,
                                                }}
                                                mapPaneName={OverlayView.OVERLAY_LAYER}
                                                getPixelPositionOffset={(width, height) => ({
                                                    x: -(width / 2),
                                                    y: -(height / 1.4),
                                                })}
                                            >
                                                <RedFlagSVG />
                                                {/* <img src={RedFlag} alt="red-flag" /> */}
                                            </OverlayViewF>
                                        </>
                                    )}
                                </GoogleMap>

                                {/* marker button */}
                                <div className="bg-white w-[45px] flex flex-col items-center py-6 rounded-lg space-y-6 absolute left-4 top-28">
                                    <CustomToolTip
                                        id={`car-parking-1`}
                                        title={`View Parking Event`}
                                        containerClass="car-marker default-tooltip  tooltipStyleChange"
                                    >
                                        <button
                                            onClick={() =>
                                                setIsParkingMarkerActive(!isParkingMarkerActive)
                                            }
                                            className={`fill-[#8D96A1] hover:fill-[#F36B24] ${isParkingMarkerActive && "fill-[#F36B24]"
                                                }`}
                                        >
                                            <ParkingSVG />
                                        </button>
                                    </CustomToolTip>

                                    <CustomToolTip
                                        id={`car-speed-1`}
                                        title={`View Over Speed`}
                                        containerClass="car-marker default-tooltip  tooltipStyleChange"
                                    >
                                        <button
                                            onClick={() =>
                                                setIsSpeedMarkerActive(!isSpeedMarkerActive)
                                            }
                                            className={`fill-[#8D96A1] hover:fill-[#F36B24] ${isSpeedMarkerActive && "fill-[#F36B24]"
                                                }`}
                                        >
                                            <SpeedSVG />
                                        </button>
                                    </CustomToolTip>

                                    <CustomToolTip
                                        id={`car-brake-1`}
                                        title={`View Brakes`}
                                        containerClass="car-marker default-tooltip  tooltipStyleChange"
                                    >
                                        <button
                                            onClick={() =>
                                                setIsBrakeMarkerActive(!isBrakeMarkerActive)
                                            }
                                            className={`fill-[#8D96A1] hover:fill-[#F36B24] ${isBrakeMarkerActive && "fill-[#F36B24]"
                                                }`}
                                        >
                                            <BrakeSVG />
                                        </button>
                                    </CustomToolTip>

                                    <CustomToolTip
                                        id={`car-off-1`}
                                        title={`View Engine Off`}
                                        containerClass="car-marker default-tooltip tooltipStyleChange"
                                    >
                                        <button
                                            onClick={() =>
                                                setIsPowerMarkerActive(!isPowerMarkerActive)
                                            }
                                            className={`fill-[#8D96A1] hover:fill-[#F36B24] ${isPowerMarkerActive && "fill-[#F36B24]"
                                                }`}
                                        >
                                            <PowerSVG />
                                        </button>
                                    </CustomToolTip>
                                </div>

                                {/* map options */}
                                <div className="flex items-center absolute bottom-8 right-16 mr-2 space-x-4 xs:space-x-6">
                                    <button className="flex items-center space-x-4 bg-secondary rounded-lg px-3 py-2 tmv-shadow">
                                        <WatchmanSVG />
                                        <p className="text-xs hidden md:block lg:hidden xl:block">
                                            Virtual Watchman
                                        </p>
                                    </button>
                                    {!isShareMap && (
                                        <button
                                            onClick={handleShareVehicleRoute}
                                            className="flex items-center space-x-4 bg-secondary rounded-lg px-3 py-2 tmv-shadow"
                                        // disabled={!paths.length && isLoaded}
                                        >
                                            <ShareSVG />
                                            <p className="text-xs hidden md:block lg:hidden xl:block">
                                                Share
                                            </p>
                                        </button>
                                    )}
                                    <button
                                        onClick={handlePrint}
                                        className="flex items-center space-x-4 bg-secondary rounded-lg px-3 py-2 tmv-shadow"
                                    >
                                        <PrinterSVG />
                                        <p className="text-xs hidden md:block lg:hidden xl:block">
                                            Print
                                        </p>
                                    </button>
                                </div>

                                {/* speed option */}
                                <div className="bg-white hidden w-52 md:flex items-center justify-evenly py-2 rounded-lg absolute left-4 bottom-8">
                                    <CustomToolTip
                                        id={`map-speed-1`}
                                        title={`Speeding: 60+Km/h`}
                                        containerClass="speed default-tooltip left-tooltip tooltipStyleChange"
                                    >
                                        <div className="bg-[#fee0e0] p-1 rounded-full">
                                            <div className="w-5 h-5 rounded-full bg-[#ffa5a5]"></div>
                                        </div>
                                    </CustomToolTip>

                                    <CustomToolTip
                                        id={`map-speed-2`}
                                        title={`Normal: 10-16 Km/h`}
                                        containerClass="speed default-tooltip middle-tooltip tooltipStyleChange"
                                    >
                                        <div className="bg-[#fce0d2] p-1 rounded-full">
                                            <div className="w-5 h-5 rounded-full bg-[#f7a57b]"></div>
                                        </div>
                                    </CustomToolTip>

                                    <CustomToolTip
                                        id={`map-speed-3`}
                                        title={`Slow: 3-15 Km/h`}
                                        containerClass="speed default-tooltip middle-tooltip tooltipStyleChange"
                                    >
                                        <div className="bg-[#fef5ce] p-1 rounded-full">
                                            <div className="w-5 h-5 rounded-full bg-[#fde36e]"></div>
                                        </div>
                                    </CustomToolTip>

                                    <CustomToolTip
                                        id={`map-speed-2`}
                                        title={`Idle: 0-2 Km/h`}
                                        containerClass="speed default-tooltip middle-tooltip tooltipStyleChange"
                                    >
                                        <div className="bg-[#e8eaec] p-1 rounded-full">
                                            <div className="w-5 h-5 rounded-full bg-[#bac0c6]"></div>
                                        </div>
                                    </CustomToolTip>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}

            {/* ===== chart ==== */}

            {isLoading ? (
                <div className="w-full bg-white p-2 h-[212px] skeleton-border rounded-xl mt-5">
                    <div className="w-full h-full skeleton rounded-xl"></div>
                </div>
            ) : (
                <div className="bg-white p-4 rounded-xl mt-3 md:h-[260px]">
                    <div className="flex justify-between items-center">
                        <h5 className="text-base font-bold">Movement</h5>
                        {/* <button onClick={() => setMapZoom(15)}>+</button> */}
                        <select
                            defaultValue={"500"}
                            onChange={(e) => handleMarkerMovementSpeed(e.target.value)}
                            className={`p-2 w-28 rounded-lg text-tertiaryText tmv-shadow marker_speed_control `}
                        >
                            {/* <option value="3000">Slow</option>
              <option value="1000">Normal</option>
              <option value="500">Fast</option> */}
                            <option value="1500">Slow</option>
                            <option value="500">Normal</option>
                            <option value="250">Fast</option>
                        </select>
                    </div>
                    <div className="mt-4">
                        <VehicleRoutePathsChart
                            paths={paths}
                            handleChartClick={handleChartClick}
                        />
                        <div className="h-8 w-full absolute bottom-2 left-0"></div>
                        <div className="h-[120px] w-[84px] absolute bottom-2 left-0"></div>
                    </div>
                    <div className="flex items-center space-x-7">
                        <button
                            onClick={() => handleMarkerMovement()}
                            className="w-8 h-8 rounded-lg flex justify-center items-center bg-primary"
                            disabled={paths.length ? false : true}
                        >
                            {!isMarkerPaused ? <PauseSVG /> : <PlaySVG />}
                        </button>
                        <RangeSlider
                            id="range-slider-marker"
                            className="single-thumb"
                            // defaultValue={[0, 53]}
                            min={0}
                            max={paths.length - 1}
                            onThumbDragEnd={handleSliderDrag}
                            value={markerDraggervalue}
                            onInput={setMarkerDraggervalue}
                            thumbsDisabled={[true, false]}
                            rangeSlideDisabled={true}
                        />
                    </div>
                    {/* VehicleRoutesDetailsTable For mobile Devices */}
                    <div className="md:hidden mt-10">
                        <VehicleRoutesDetailsTable
                            startDate={startDate}
                            endDate={endDate}
                            vehicleRoute={vehicleRoute}
                            maxSpeed={maxSpeed}
                            averageSpeed={averageSpeed}
                        />
                    </div>
                </div>
            )}

            {/* ======== SPEED OPTION TOOLTIP FOR MOBILE ======== */}
            <div className="w-full flex md:hidden items-center justify-center py-4 rounded-lg">
                <div className="current-location default-tooltip tooltipStyleChange bg-white speed-toltip-bg speed-toltip">
                    <div className="flex flex-col justify-center items-center">
                        <div className="bg-[#fee0e0] p-1 rounded-full">
                            <div className="w-5 h-5 rounded-full bg-[#ffa5a5]"></div>
                        </div>
                        <p className="mt-2 text-center px-1">60+ Km/h</p>
                    </div>
                </div>
                <div className="current-location default-tooltip tooltipStyleChange bg-white speed-toltip-bg speed-toltip">
                    <div className="flex flex-col justify-center items-center">
                        <div className="bg-[#fce0d2] p-1 rounded-full">
                            <div className="w-5 h-5 rounded-full bg-[#f7a57b]"></div>
                        </div>
                        <p className="mt-2 text-center">10-16 Km/h</p>
                    </div>
                </div>
                <div className="current-location default-tooltip tooltipStyleChange bg-white speed-toltip-bg speed-toltip">
                    <div className="flex flex-col justify-center items-center">
                        <div className="bg-[#fef5ce] p-1 rounded-full">
                            <div className="w-5 h-5 rounded-full bg-[#fde36e]"></div>
                        </div>
                        <p className="mt-2 text-center">3-15 Km/h</p>
                    </div>
                </div>
                <div className="current-location default-tooltip tooltipStyleChange bg-white speed-toltip-bg speed-toltip">
                    <div className="flex flex-col justify-center items-center">
                        <div className="bg-vehicleOffline/20 p-1 rounded-full">
                            <div className="w-5 h-5 rounded-full bg-vehicleOffline"></div>
                        </div>
                        <p className="mt-2 text-center">&nbsp;0-2 Km/h&nbsp;</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleRouteMap;
