import React, { memo, useEffect, useRef, useState } from "react";
import dotenv from "dotenv";
import {
    GoogleMap,
    InfoWindowF,
    LoadScript,
    MarkerF,
    OverlayView,
    OverlayViewF,
    TrafficLayerF,
    useJsApiLoader,
} from "@react-google-maps/api";
import VehicleMarker from "../VehicleMarker";
import CurrentLocationVehicleInfoWindow from "../infoWindows/CurrentLocationVehicleInfoWindowOld";
import CustomToolTip from "../CustomToolTip";
import WatchmanSVG from "../SVG/WatchmanSVG";
import ShareSVG from "../SVG/ShareSVG";
import PrinterSVG from "../SVG/PrinterSVG";
import { vehiclePingAnimation } from "@/utils/vehiclePingAnimationOld";

import { useReactToPrint } from "react-to-print";
import "../../styles/components/currentLocationMap.css";

import Link from "next/link";
import baseUrl from "@/plugins/baseUrl";
import { clientBaseUrl } from "@/utils/clientBaseUrl";

dotenv.config();

const CurrentLocationMap = ({
    isShareMap,
    height,
    title,
    selectedVehicles,
    setSelectedVehicles,
    getMapBoundVehicles,
    xlScreen,
}) => {
    const containerStyle = {
        width: "100%",
        height: height,
    };

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const [mapCenter, setMapCenter] = useState({
        lat: 23.8103,
        lng: 90.4125,
    });
    const [trafficLayer, setTrafficLayer] = useState(false);
    const toggleClass = " transform translate-x-10";
    // const forceUpdate = useForceUpdate();

    const [refreshMap, setRefreshMap] = useState(false);

    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        // googleMapsApiKey: "AIzaSyDGCiFRpeVsZEiztcpjt-h_dlEg5tsUZLQ",
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        // googleMapsApiKey: "AIzaSyC4s5fkJjVPRUjA-8Zr_q5hGBwT4og4y60",
    });

    const [map, setMap] = useState(null);
    const [bounds, setBounds] = useState(null);
    const clientBaseURL = clientBaseUrl(window.location.hostname);

    const handleOpenInfoWindow = (currentVehicle) => {
        console.log("handleOpenInfoWindow=======", currentVehicle);
        const updatedVehicles = selectedVehicles.map((vehicle) => {
            if (vehicle.v_identifier === currentVehicle.v_identifier) {
                return { ...vehicle, isInfoShowing: !currentVehicle.isInfoShowing };
            }
            return vehicle;
        });
        setSelectedVehicles(updatedVehicles);
    };

    const handleSetTrafficLayer = () => {
        setTrafficLayer(!trafficLayer);
        // forceUpdate();
        setRefreshMap(true);
        setTimeout(function () {
            setRefreshMap(false);
        }, 200);
    };
    const handleCloseInfoWindow = (currentVehicle) => {
        const updatedVehicles = selectedVehicles.map((vehicle) => {
            if (vehicle.v_identifier === currentVehicle.v_identifier) {
                return { ...vehicle, isInfoShowing: false };
            }
            return vehicle;
        });
        setSelectedVehicles(updatedVehicles);
    };

    const handleBoundsChanged = () => {
        if (map) {
            // console.log("map~~bound:", map.getBounds());
            setBounds(map.getBounds());
        }
    };

    // new code test start
    const onLoad = (map) => {
        setMap(map);
        // console.log("map---", map);
    };
    const getMapBounds = () => {
        const visibleMarkers = selectedVehicles.filter((vehicleMarker) =>
            bounds.contains({
                lat: parseFloat(vehicleMarker.lat),
                lng: parseFloat(vehicleMarker.lng),
            })
        );
        // console.log("visibleMarkers:-", visibleMarkers);
        return visibleMarkers;
    };

    //=========make identifier comma separated string=============
    const selectedVehiclesIdentifier = (vehicles) => {
        // console.log('call', vehicles);
        return vehicles.map((vehicle) => vehicle.v_identifier).join(",");
    };

    const handleShareCurrentLocation = () => {
        // const clientBaseURL = 'http://localhost:3000';
        // const clientBaseURL = "https://sg-tmv.netlify.app";
        const url = `${clientBaseURL}/location/share-current-location?vehicles=${selectedVehiclesIdentifier(
            selectedVehicles
        )}`;
        const newWindow = window.open(url, "_blank", "noopener,noreferrer");
        if (newWindow) newWindow.opener = null;
    };

    useEffect(() => {
        if (selectedVehicles?.length) {
            getMapBoundVehicles(getMapBounds());
        }
    }, [bounds]);
    // new code test end

    useEffect(() => {
        // selectedVehicles.map((vehicle) => {
        //   // vehicle["isInfoShowing"] = false;
        // });
        // if (selectedVehicles?.length) {
        // const visibleMarkers = bounds ? selectedVehicles.filter(marker =>
        //   bounds.contains(marker.getPosition())
        // ) : [];
        // console.log('visibleMarkers', visibleMarkers);
        // getMapBounds(selectedVehicles)
        // }
        // assign map center
        if (selectedVehicles.length) {
            // test code..
            // getMapBounds()
            // test code..
            const latestSelectedVehicle =
                selectedVehicles[selectedVehicles.length - 1];
            console.log("latestSelectedVehicle", latestSelectedVehicle);
            setMapCenter({
                lat: parseFloat(latestSelectedVehicle?.lat),
                lng: parseFloat(latestSelectedVehicle?.lng),
            });
        }
    }, [selectedVehicles.length]);

    // console.log("selectedVehicles", selectedVehicles);
    return (
        <div>
            {title ? (
                <div className="md:flex justify-between items-center md:mb-3">
                    <h1 className="text-xl md:text-[26px] text-primaryText font-bold mt-6 lg:mt-10 md:mb-5 lg:mb-0">
                        {title}
                    </h1>
                    <div className="flex justify-end relative lg:static top-14 md:top-16 lg:top-0 md:pt-12 lg:pt-10 right-14 lg:right-0">
                        <div className="traffic-filter rounded-full mb-0.5 py-0.5 bg-white lg:bg-transparent flex items-center space-x-2 mr-4 px-2 z-10">
                            <p className="text-sm">Traffic</p>
                            <div>
                                {/* toggle button start */}
                                <div
                                    className="w-20 h-7 lg:h-9 flex items-center bg-white rounded-[10px] cursor-pointer lg:tmv-shadow relative z-0 text-sm font-normal"
                                    onClick={handleSetTrafficLayer}
                                >
                                    {/* Switch */}
                                    <div className="w-20 h-7 lg:h-9 flex justify-center items-center absolute top-0 left-0 px-3 text-tertiaryText">
                                        <p className="w-full text-left text-sm">Off</p>
                                        <p className="w-full text-right text-sm">On</p>
                                    </div>
                                    <div
                                        className={
                                            "bg-primary primary-shadow z-10 w-10 h-7 lg:h-9 flex justify-center items-center rounded-[10px] shadow-md transform duration-300 ease-in-out" +
                                            (!trafficLayer ? null : toggleClass)
                                        }
                                    >
                                        <p>{trafficLayer ? "On" : "Off"}</p>
                                    </div>
                                </div>
                                {/* toggle button end */}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                ""
            )}
            <div
                className={`relative bg-white rounded-xl ${!isShareMap ? "p-2" : ""}`}
            >
                {isLoaded & !refreshMap ? (
                    <div className="">
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            onBoundsChanged={handleBoundsChanged}
                            center={mapCenter}
                            zoom={14}
                            ref={componentRef}
                            onLoad={onLoad}
                        >
                            {trafficLayer && <TrafficLayerF />}
                            {/* <MarkerF
                        icon={{
                            url: (require('../../public/markers/car.svg'))
                        }}
                        onLoad={onLoad}
                        position={position}
                    /> */}

                            {selectedVehicles.map((vehicle, index) => (
                                <div key={index}>
                                    <OverlayViewF
                                        position={{ lat: vehicle?.lat, lng: vehicle?.lng }}
                                        mapPaneName={OverlayView.FLOAT_PANE}
                                        getPixelPositionOffset={(width, height) => ({
                                            x: -(width / 2),
                                            y: -(height / 2),
                                        })}
                                    >
                                        <div className="relative flex h-[100px] w-[100px] ">
                                            <span
                                                style={{
                                                    backgroundColor: vehiclePingAnimation(vehicle),
                                                }}
                                                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75`}
                                            >
                                                {/* {console.log(vehiclePingAnimation(vehicle))} */}
                                            </span>
                                            <button
                                                onClick={() => handleOpenInfoWindow(vehicle)}
                                                style={{
                                                    backgroundColor: vehiclePingAnimation(vehicle),
                                                }}
                                                className={`relative flex justify-center items-center rounded-full h-[100px] w-[100px] cursor-pointer `}
                                            >
                                                <VehicleMarker />
                                                {/* <img src={} alt="" /> */}
                                            </button>
                                        </div>
                                        {vehicle.isInfoShowing && (
                                            <CurrentLocationVehicleInfoWindow
                                                vehicle={vehicle}
                                                handleCloseInfoWindow={handleCloseInfoWindow}
                                            />
                                        )}
                                    </OverlayViewF>
                                    {/* {vehicle.isInfoShowing ? (
                    <InfoWindowF
                      position={{
                        lat: parseFloat(vehicle.lat),
                        lng: parseFloat(vehicle.lng),
                      }}
                      zIndex={40}
                      onCloseClick={() => handleCloseInfoWindow(vehicle)}
                    >
                      <div>
                  
                        <CurrentLocationVehicleInfoWindow vehicle={vehicle} />
                      </div>
                    </InfoWindowF>
                  ) : (
                    ""
                  )} */}
                                </div>
                            ))}
                            {/* <InfoWindowF
                        position={position_1}
                        zIndex={40}
                    >
                        <div>
                            <OfflineInfo />
                        </div>
                    </InfoWindowF> */}

                            {/* <OverlayViewF
                        position={position_2}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    >
                        <div className="relative flex h-[100px] w-[100px]">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F36B24]/20 opacity-75"></span>
                            <span className="relative flex justify-center items-center rounded-full h-[100px] w-[100px] bg-[#F36B24]/20">
                                <CarMarker />
                            </span>
                        </div>
                    </OverlayViewF> */}
                        </GoogleMap>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-[620px]">
                        <div className="w-16 h-16 border-4 border-dashed rounded-full border-primary animate-spin"></div>
                    </div>
                )}
                {/* ======== speed option ======== */}
                <div className="hidden bg-white md:flex flex-col gap-2 items-center justify-evenly p-2 rounded-lg absolute left-4 bottom-8">
                    <CustomToolTip
                        id={`map-speed-1`}
                        title={`Mobile (Vehicle speed is greater than or equal to 5KM/H)`}
                        containerClass="current-location default-tooltip tooltipStyleChange"
                    >
                        <div className="bg-vehicleGreaterThanFive/20 p-1 rounded-full">
                            <div className="w-5 h-5 rounded-full bg-vehicleGreaterThanFive"></div>
                        </div>
                    </CustomToolTip>

                    <CustomToolTip
                        id={`map-speed-2`}
                        title={`Slow (Vehicle speed is less than 5 KM/H)`}
                        containerClass="current-location default-tooltip tooltipStyleChange"
                    >
                        <div className="bg-vehicleLessThanFive/20 p-1 rounded-full">
                            <div className="w-5 h-5 rounded-full bg-vehicleLessThanFive/20"></div>
                        </div>
                    </CustomToolTip>

                    <CustomToolTip
                        id={`map-speed-3`}
                        title={`Engine has been turned off recently`}
                        containerClass="current-location default-tooltip tooltipStyleChange"
                    >
                        <div className="bg-vehicleRecentlyOff/20 p-1 rounded-full">
                            <div className="w-5 h-5 rounded-full bg-vehicleRecentlyOff/20"></div>
                        </div>
                    </CustomToolTip>

                    <CustomToolTip
                        id={`map-speed-2`}
                        title={`Off (Engine is currently at the moment turned off)`}
                        containerClass="current-location default-tooltip tooltipStyleChange"
                    >
                        <div className="bg-vehicleOff/20 p-1 rounded-full">
                            <div className="w-5 h-5 rounded-full bg-vehicleOff"></div>
                        </div>
                    </CustomToolTip>

                    <CustomToolTip
                        id={`map-speed-2`}
                        title={`Offline (Vehicle is offline and data was received more than 24 hrs ago)`}
                        containerClass="current-location default-tooltip tooltipStyleChange"
                    >
                        <div className="bg-vehicleOffline/20 p-1 rounded-full">
                            <div className="w-5 h-5 rounded-full bg-vehicleOffline"></div>
                        </div>
                    </CustomToolTip>
                </div>

                {/* map options */}
                <div className="flex items-center absolute bottom-8 right-16 space-x-4 xs:space-x-6 mr-2">
                    <button className="flex items-center space-x-4 bg-secondary rounded-lg px-3 py-2 tmv-shadow">
                        <WatchmanSVG />
                        <p
                            className={`${xlScreen === true ? "2xl:block" : "lg:block"
                                } hidden text-xs`}
                        >
                            Virtual Watchman
                        </p>
                    </button>

                    {!isShareMap && (
                        <button
                            onClick={handleShareCurrentLocation}
                            className="flex items-center space-x-4 bg-secondary rounded-lg px-3 py-2 tmv-shadow"
                            disabled={!selectedVehicles.length && isLoaded}
                        >
                            <ShareSVG />
                            <p
                                className={`${xlScreen === true ? "2xl:block" : "lg:block"
                                    } hidden text-xs`}
                            >
                                Share
                            </p>
                        </button>
                    )}

                    <button
                        onClick={handlePrint}
                        className="flex items-center space-x-4 bg-secondary rounded-lg px-3 py-2 tmv-shadow"
                    >
                        <PrinterSVG />
                        <p
                            className={`${xlScreen === true ? "2xl:block" : "lg:block"
                                } hidden text-xs`}
                        >
                            Print
                        </p>
                    </button>
                </div>
            </div>

            {/* ======== speed option tooltip for mobile ======== */}
            <div className="w-full flex md:hidden items-center justify-center py-4 rounded-lg">
                <div className="current-location default-tooltip tooltipStyleChange bg-white speed-toltip">
                    <div className="flex flex-col justify-center items-center">
                        <div className="bg-vehicleGreaterThanFive/20 p-1 rounded-full">
                            <div className="w-3 xs:w-4 h-3 xs:h-4 rounded-full bg-vehicleGreaterThanFive"></div>
                        </div>
                        <p className="mt-2">On</p>
                    </div>
                </div>

                <div className="current-location default-tooltip tooltipStyleChange bg-white speed-toltip">
                    <div className="flex flex-col justify-center items-center">
                        <div className="bg-vehicleLessThanFive/20 p-1 rounded-full">
                            <div className="w-3 xs:w-4 h-3 xs:h-4 rounded-full bg-vehicleLessThanFive/20"></div>
                        </div>
                        <p className="mt-2">Slow</p>
                    </div>
                </div>

                <div className="current-location default-tooltip tooltipStyleChange bg-white speed-toltip">
                    <div className="flex flex-col justify-center items-center">
                        <div className="bg-vehicleRecentlyOff/20 p-1 rounded-full">
                            <div className="w-3 xs:w-4 h-3 xs:h-4 rounded-full bg-vehicleRecentlyOff/20"></div>
                        </div>
                        <p className="mt-2">Off</p>
                    </div>
                </div>

                <div className="current-location default-tooltip tooltipStyleChange bg-white speed-toltip">
                    <div className="flex flex-col justify-center items-center">
                        <div className="bg-vehicleOffline/20 p-1 rounded-full">
                            <div className="w-3 xs:w-4 h-3 xs:h-4 rounded-full bg-vehicleOffline"></div>
                        </div>
                        <p className="mt-2">Offline</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(CurrentLocationMap);
