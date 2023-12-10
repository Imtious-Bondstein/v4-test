import React, { memo, useEffect, useRef, useState } from "react";
import dotenv from "dotenv";
import {
  GoogleMap,
  InfoWindowF,
  LoadScript,
  Marker,
  MarkerClusterer,
  MarkerF,
  OverlayView,
  OverlayViewF,
  Polyline,
  TrafficLayerF,
  useJsApiLoader,
} from "@react-google-maps/api";

//=======SVGFShare
import VehicleMarker from "../VehicleMarker";
import CustomToolTip from "../CustomToolTip";
import WatchmanSVG from "../SVG/WatchmanSVG";
import ShareSVG from "../SVG/ShareSVG";
import PrinterSVG from "../SVG/PrinterSVG";

//========info window
import CurrentLocationVehicleInfoWindow from "../infoWindows/CurrentLocationVehicleInfoWindow";

//========utils
import { vehiclePingAnimation } from "@/utils/vehiclePingAnimation";

//========print map
import { useReactToPrint } from "react-to-print";

//========css
import "../../styles/components/currentLocationMap.css";
import "../../styles/globals.css";

import { clientBaseUrl } from "@/utils/clientBaseUrl";
import ShareCurrentLocationModal from "../modals/ShareCurrentLocationModal";
import { set } from "date-fns";
import PrintTop from "../print/PrintTop";
import PrintBottom from "../print/PrintBottom";

// =======vehicle type
import { handleVehicleType } from "@/utils/vehicleTypeCheck";

dotenv.config();

const AnalyticsSummaryMap = ({
  isLoading,
  setIsLoading,
  isShareMap,
  isSelectMultiple,
  height,
  title,
  selectedVehicles,
  setSelectedVehicles,
  visibleSelectedVehicles,
  setVisibleSelectedVehicles,
  getMapBounds,
  xlScreen,
  showMap,
  setShowMap,
}) => {
  const containerStyle = {
    width: "100%",
    height: height,
  };

  // =======print functionality start=======
  const [isPrinting, setIsPrinting] = useState(false);
  const printRef = useRef();
  const promiseResolveRef = useRef(null);

  // Modal
  const [isBack, setIsBack] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(null);

  useEffect(() => {
    if (isPrinting && promiseResolveRef.current) {
      // Resolves the Promise, letting `react-to-print` know that the DOM updates are completed
      setTimeout(() => {
        promiseResolveRef.current();
      }, 10);
    }
  }, [isPrinting]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onBeforeGetContent: () => {
      return new Promise((resolve) => {
        promiseResolveRef.current = resolve;
        setIsPrinting(true);
      });
    },
    onAfterPrint: () => {
      // Reset the Promise resolve so we can print again
      promiseResolveRef.current = null;
      setIsPrinting(false);
    },
  });
  // =======print functionality end=======

  const [map, setMap] = useState(null);
  const [bounds, setBounds] = useState(null);
  const [mapCenter, setMapCenter] = useState({
    lat: 23.8103,
    lng: 90.4125,
  });
  const [mapZoom, setMapZoom] = useState(12);
  const [trafficLayer, setTrafficLayer] = useState(false);
  const toggleClass = "transform translate-x-10";
  const [refreshMap, setRefreshMap] = useState(false);
  const [isOverLayActive, setIsOverlayActive] = useState(true);
  const [shareCurrentLocationModalIsOpen, setShareCurrentLocationModalIsOpen] =
    useState(false);

  const overlayMarkersRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    libraries: ["drawing", "visualization"],
    // googleMapsApiKey: "AIzaSyDGCiFRpeVsZEiztcpjt-h_dlEg5tsUZLQ",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    // googleMapsApiKey: "AIzaSyC4s5fkJjVPRUjA-8Zr_q5hGBwT4og4y60",
  });

  const clientBaseURL = clientBaseUrl(window.location.hostname);

  //=============info window start
  const handleOpenInfoWindow = (currentVehicle) => {
    console.log("handleOpenInfoWindow=======", currentVehicle);
    const updatedSelectedVehicles = selectedVehicles.map((vehicle) =>
      vehicle.v_identifier === currentVehicle.v_identifier
        ? { ...vehicle, isInfoShowing: !currentVehicle.isInfoShowing }
        : vehicle
    );
    setSelectedVehicles(updatedSelectedVehicles);

    const updatedVisibleSelectedVehicles = visibleSelectedVehicles.map(
      (vehicle) =>
        vehicle.v_identifier === currentVehicle.v_identifier
          ? { ...vehicle, isInfoShowing: !currentVehicle.isInfoShowing }
          : vehicle
    );
    setVisibleSelectedVehicles(updatedVisibleSelectedVehicles);
  };

  const handleCloseInfoWindow = (currentVehicle) => {
    const updatedSelectedVehicles = selectedVehicles.map((vehicle) =>
      vehicle.v_identifier === currentVehicle.v_identifier
        ? { ...vehicle, isInfoShowing: false }
        : vehicle
    );
    setSelectedVehicles(updatedSelectedVehicles);

    const updatedVisibleSelectedVehicles = visibleSelectedVehicles.map(
      (vehicle) =>
        vehicle.v_identifier === currentVehicle.v_identifier
          ? { ...vehicle, isInfoShowing: false }
          : vehicle
    );
    setVisibleSelectedVehicles(updatedVisibleSelectedVehicles);
  };

  //=====visible vehicle handle start
  const handleOpenVInfoWindow = (currentVehicle) => {
    console.log("handleOpenVInfoWindow=======", currentVehicle);
    const updatedVehicles = visibleSelectedVehicles.map((vehicle) => {
      if (vehicle.v_identifier === currentVehicle.v_identifier) {
        return { ...vehicle, isInfoShowing: !currentVehicle.isInfoShowing };
      }
      return vehicle;
    });
    setVisibleSelectedVehicles(updatedVehicles);
  };

  const handleCloseVInfoWindow = (currentVehicle) => {
    const updatedVehicles = visibleSelectedVehicles.map((vehicle) => {
      if (vehicle.v_identifier === currentVehicle.v_identifier) {
        return { ...vehicle, isInfoShowing: false };
      }
      return vehicle;
    });
    setVisibleSelectedVehicles(updatedVehicles);
  };
  //=====visible vehicle handle end

  //=============info window end

  //=======traffic layer active
  const handleSetTrafficLayer = () => {
    setTrafficLayer(!trafficLayer);
    setRefreshMap(true);
    setTimeout(function () {
      setRefreshMap(false);
    }, 200);
  };

  const handleBoundsChanged = () => {
    if (map) {
      // console.log("map~~bound:", map.getBounds());
      setBounds(map.getBounds());

      //====reset overlay style
      resetStyleToOverlay();
    }
  };

  const handleZoomChange = () => {
    if (map && map.zoom < 13 && selectedVehicles.length > 1) {
      // if (map && map.zoom < 13) {
      setIsOverlayActive(false);
    } else {
      setIsOverlayActive(true);
    }
  };

  const handleMapDrag = () => {
    resetStyleToOverlay();
  };

  const handleMapZoomAndPan = (location) => {
    if (map) {
      map.panTo({
        lat: location.path[location.path.length - 1].lat,
        lng: location.path[location.path.length - 1].lng,
      });
      // map.setZoom(14)
      smoothZoom(map, 14, map.getZoom());
    }
  };

  const smoothZoom = (map, max, cnt) => {
    if (cnt >= max) {
      return;
    } else {
      const z = window?.google?.maps?.event.addListener(
        map,
        "zoom_changed",
        function (event) {
          window?.google?.maps?.event.removeListener(z);
          smoothZoom(map, max, cnt + 1);
        }
      );
      setTimeout(function () {
        map.setZoom(cnt);
      }, 80); // 80ms is what I found to work well on my system -- it might not work well on all systems
    }
  };

  //======reset overlay style
  const resetStyleToOverlay = () => {
    overlayMarkersRef.current.map((marker) => {
      marker.style && (marker.style.transition = "none");
      marker.parentElement && (marker.parentElement.style.transition = "none");
    });

    setTimeout(() => {
      overlayMarkersRef.current.map((marker) => {
        marker.style && (marker.style.transition = "all 0.5s ease");
        marker.parentElement &&
          (marker.parentElement.style.transition = "all 0.5s ease");
      });
    }, 1000);
  };

  //=======style add to the visible vehicle
  const setStyleToOverlay = () => {
    overlayMarkersRef.current = [];
    setTimeout(() => {
      const visibleMarkers = document.getElementsByClassName("overlay-view");
      const visibleMarkersArray = Array.from(visibleMarkers);
      visibleMarkersArray.map((marker) => {
        marker.style.transition = "all 0.5s ease";
        marker.parentElement.style.transition = "all 0.5s ease";
        // console.log(marker.parentElement);

        overlayMarkersRef.current.push(marker);
      });
    }, 100);
  };

  //========initial map load
  const onLoad = (map) => {
    setMap(map);
    // console.log("map---", map);
  };

  //========marker cluster option
  const clusterOptions = {
    imagePath:
      "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
    gridSize: 0,
  };

  //=========make identifier comma separated string
  const selectedVehiclesIdentifier = (vehicles) => {
    // console.log('call', vehicles);
    return vehicles.map((vehicle) => vehicle.v_identifier).join(",");
  };

  const handleShareCurrentLocation = () => {
    setIsBack(false);
    setSelectedDuration(null);
    setShareCurrentLocationModalIsOpen(true);
    // const url = `${clientBaseURL}/location/share-current-location?vehicles=${selectedVehiclesIdentifier(
    //   selectedVehicles
    // )}`;
    // const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    // if (newWindow) newWindow.opener = null;
  };

  useEffect(() => {
    getMapBounds(bounds);
  }, [bounds]);

  // assign map center
  useEffect(() => {
    if (selectedVehicles.length) {
      const latestSelectedVehicle =
        selectedVehicles[selectedVehicles.length - 1];
      console.log("latestSelectedVehicle", latestSelectedVehicle);
      //=====here adding '0.012' | '0.0092' for adjusting the map center according to view full info window
      setMapCenter({
        lat:
          parseFloat(
            latestSelectedVehicle.path[latestSelectedVehicle.path.length - 1]
              ?.lat
          ) + 0.0092,
        lng: parseFloat(
          latestSelectedVehicle.path[latestSelectedVehicle.path.length - 1]?.lng
        ),
      });
    }
    // set overlay active
    // setIsOverlayActive(true);
    handleZoomChange();

    // single vehicle length equal to 1 set info window true
    if (selectedVehicles.length === 1) {
      console.log("one vehicle selected");
      setSelectedVehicles(
        selectedVehicles.map((vehicle) => {
          return { ...vehicle, isInfoShowing: true };
        })
      );
      setVisibleSelectedVehicles(
        visibleSelectedVehicles.map((vehicle) => {
          return { ...vehicle, isInfoShowing: true };
        })
      );
    }
  }, [selectedVehicles.length]);

  // handle map zoom level
  useEffect(() => {
    console.log("multiple---------", isSelectMultiple);
    if (map) {
      if (isSelectMultiple === true) {
        setMapZoom(7);
        map.setZoom(7);
      } else if (isSelectMultiple === false) {
        setMapZoom(14);
        map.setZoom(14);
      }
    }
  }, [map, isSelectMultiple]);

  // style visible vehicles
  useEffect(() => {
    setStyleToOverlay();
  }, [visibleSelectedVehicles.length]);

  // change map center
  useEffect(() => {
    if (map) {
      if (
        selectedVehicles.length === 1 &&
        selectedVehicles[selectedVehicles.length - 1].path.length % 3 === 0
      ) {
        const latestSelectedVehicle =
          selectedVehicles[selectedVehicles.length - 1];
        console.log("latestSelectedVehicle", latestSelectedVehicle);
        //=====here adding '0.012' | '0.0092' for adjusting the map center according to view full info window
        const newCenterPosition = {
          lat:
            parseFloat(
              latestSelectedVehicle.path[latestSelectedVehicle.path.length - 1]
                ?.lat
            ) + 0.0092,
          lng: parseFloat(
            latestSelectedVehicle.path[latestSelectedVehicle.path.length - 1]
              ?.lng
          ),
        };
        map.panTo(newCenterPosition);
        setMapCenter(newCenterPosition);
      }
    }
  }, [selectedVehicles]);

  return (
    <div>
      <ShareCurrentLocationModal
        selectedVehicles={selectedVehicles}
        setShareCurrentLocationModalIsOpen={setShareCurrentLocationModalIsOpen}
        shareCurrentLocationModalIsOpen={shareCurrentLocationModalIsOpen}
        isBack={isBack}
        setIsBack={setIsBack}
        selectedDuration={selectedDuration}
        setSelectedDuration={setSelectedDuration}
      />
      {title ? (
        <div className="md:flex justify-between items-center md:mb-3">
          <h1 className="text-xl md:text-[26px] text-primaryText font-bold mb-2.5 sm:mb-0 lg:mb-0">
            {title}
          </h1>
          {isLoaded & !refreshMap ? (
            <div className="flex justify-end absolute top-28 sm:top-14 md:top-[70px] left-10 sm:-left-12 sm:relative lg:static lg:top-0 lg:left-0 -mt-2 md:mt-0">
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
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}

      {isLoading ? (
        <div className="h-[78vh] rounded-lg bg-white p-2">
          <div className="w-full h-full skeleton rounded-lg"></div>
        </div>
      ) : (
        <div>
          <div
            className={`relative bg-white rounded-xl ${
              !isShareMap ? "p-2" : ""
            }`}
          >
            {isLoaded & !refreshMap ? (
              <div
                ref={printRef}
                className={`${
                  isPrinting
                    ? "fixed top-0 left-0 w-full h-full bg-white z-[5000]"
                    : ""
                }`}
              >
                {isPrinting && <PrintTop />}
                {showMap === true ? (
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    onBoundsChanged={handleBoundsChanged}
                    onZoomChanged={handleZoomChange}
                    onDrag={handleMapDrag}
                    center={mapCenter}
                    zoom={mapZoom}
                    onLoad={onLoad}
                  >
                    {trafficLayer && <TrafficLayerF />}

                    {isOverLayActive ? (
                      visibleSelectedVehicles.map((vehicle, index) => (
                        <div key={vehicle.v_identifier}>
                          <Polyline
                            path={vehicle.path}
                            options={{
                              strokeColor: "#e31b25",
                              strokeOpacity: 1.0,
                              strokeWeight: 4,
                            }}
                          />
                          <div></div>

                          <OverlayViewF
                            position={{
                              lat: vehicle.path[vehicle.path.length - 1].lat,
                              lng: vehicle.path[vehicle.path.length - 1].lng,
                            }}
                            mapPaneName={OverlayView.FLOAT_PANE}
                            getPixelPositionOffset={(width, height) => ({
                              x: -(width / 2),
                              y: -(height / 2),
                            })}
                          >
                            <div
                              id={vehicle.v_identifier}
                              className="overlay-view relative  flex h-[80px] w-[80px] "
                            >
                              <span
                                style={{
                                  backgroundColor:
                                    vehiclePingAnimation(vehicle),
                                }}
                                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75`}
                              >
                                {/* {console.log(vehiclePingAnimation(vehicle))} */}
                              </span>
                              <button
                                onClick={() => handleOpenInfoWindow(vehicle)}
                                style={{
                                  backgroundColor:
                                    vehiclePingAnimation(vehicle),
                                }}
                                className={`relative flex justify-center items-center rounded-full h-[80px] w-[80px] cursor-pointer `}
                              >
                                {/* <VehicleMarker /> */}
                                <img
                                  style={{
                                    transform: `rotate(${vehicle.angle}deg)`,
                                    transition: `transform 0.5s ease`,
                                  }}
                                  width={50}
                                  height={50}
                                  // src="https://i.ibb.co/0rm63wT/car-marker.png"
                                  src={handleVehicleType(
                                    vehicle && vehicle.vehicle_type
                                      ? vehicle.vehicle_type.toLowerCase()
                                      : ""
                                  )}
                                  alt="Vehicle_Image"
                                />
                              </button>
                            </div>
                            {vehicle.isInfoShowing && (
                              <CurrentLocationVehicleInfoWindow
                                vehicleDetails={{
                                  isInfoShowing: vehicle.isInfoShowing,
                                  bst_id: vehicle.bst_id,
                                  v_vrn: vehicle.v_vrn,
                                  popup_image: vehicle.popup_image,
                                  vehicle_name: vehicle.vehicle_name,
                                  v_username: vehicle.v_username,
                                  v_identifier: vehicle.v_identifier,
                                  last_engine_on: vehicle.last_engine_on,
                                }}
                                path={vehicle.path[vehicle.path.length - 1]}
                                handleCloseInfoWindow={handleCloseInfoWindow}
                                isMapSharing={false}
                              />
                            )}
                          </OverlayViewF>
                        </div>
                      ))
                    ) : (
                      <MarkerClusterer options={clusterOptions}>
                        {(clusterer) =>
                          visibleSelectedVehicles.map((vehicle) => (
                            <Marker
                              onClick={() => handleMapZoomAndPan(vehicle)}
                              title={vehicle.bst_id}
                              icon={{
                                // url: "https://i.ibb.co/0rm63wT/car-marker.png",
                                url: handleVehicleType(
                                  vehicle && vehicle.vehicle_type
                                    ? vehicle.vehicle_type.toLowerCase()
                                    : ""
                                ),
                                scaledSize: { width: 50, height: 50 },
                                anchor: { x: 25, y: 25 },
                                scale: 0.2,
                              }}
                              key={vehicle.v_identifier}
                              position={{
                                lat: vehicle.path[vehicle.path.length - 1].lat,
                                lng: vehicle.path[vehicle.path.length - 1].lng,
                              }}
                              clusterer={clusterer}
                            />
                          ))
                        }
                      </MarkerClusterer>
                    )}
                  </GoogleMap>
                ) : (
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    onBoundsChanged={handleBoundsChanged}
                    onZoomChanged={handleZoomChange}
                    onDrag={handleMapDrag}
                    center={mapCenter}
                    zoom={mapZoom}
                    onLoad={onLoad}
                  >
                    {trafficLayer && <TrafficLayerF />}
                  </GoogleMap>
                )}
                {isPrinting && <PrintBottom />}
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
              {/* <button className="flex items-center space-x-4 bg-secondary rounded-lg px-3 py-2 tmv-shadow">
                <WatchmanSVG />
                <p
                  className={`${xlScreen === true ? "2xl:block" : "lg:block"
                    } hidden text-xs`}
                >
                  Virtual Watchman
                </p>
              </button> */}

              {!isShareMap && (
                <button
                  onClick={handleShareCurrentLocation}
                  className="flex items-center space-x-4 bg-secondary rounded-lg px-3 py-2 tmv-shadow"
                  // disabled={!selectedVehicles.length && isLoaded}
                >
                  <ShareSVG />
                  <p
                    className={`${
                      xlScreen === true ? "2xl:block" : "lg:block"
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
                  className={`${
                    xlScreen === true ? "2xl:block" : "lg:block"
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
      )}
    </div>
  );
};

export default memo(AnalyticsSummaryMap);
