import React, { memo, use, useEffect, useRef, useState } from "react";
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

//=======SVG
import VehicleMarker from "../VehicleMarker";
import CustomToolTip from "../CustomToolTip";

//========info window
import CurrentLocationVehicleInfoWindow from "../infoWindows/CurrentLocationVehicleInfoWindow";

//========utils
import { vehiclePingAnimation } from "@/utils/vehiclePingAnimation";

//========css
import "../../styles/components/currentLocationMap.css";
import "../../styles/globals.css";

//======vehicle type
import { handleVehicleType } from "@/utils/vehicleTypeCheck";

const ShareCurrentLocationMap = ({
  isLoading,
  height,
  selectedVehicles,
  setSelectedVehicles,
}) => {
  const containerStyle = {
    width: "100%",
    height: height,
  };

  const componentRef = useRef();

  const [map, setMap] = useState(null);
  const [mapCenter, setMapCenter] = useState({
    lat: 23.8103,
    lng: 90.4125,
  });
  const [mapZoom, setMapZoom] = useState(14);
  const [trafficLayer, setTrafficLayer] = useState(false);
  const toggleClass = "transform translate-x-10";
  const [refreshMap, setRefreshMap] = useState(false);
  const [isOverLayActive, setIsOverlayActive] = useState(true);

  const overlayMarkersRef = useRef([]);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    libraries: ["drawing", "visualization"],
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  //=============info window start
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

  const handleCloseInfoWindow = (currentVehicle) => {
    const updatedVehicles = selectedVehicles.map((vehicle) => {
      if (vehicle.v_identifier === currentVehicle.v_identifier) {
        return { ...vehicle, isInfoShowing: false };
      }
      return vehicle;
    });
    setSelectedVehicles(updatedVehicles);
  };

  //=======traffic layer active
  const handleSetTrafficLayer = () => {
    setTrafficLayer(!trafficLayer);
    setRefreshMap(true);
    setTimeout(function () {
      setRefreshMap(false);
    }, 200);
  };

  const handleBoundsChanged = () => {
    if (map && selectedVehicles.length) {
      // console.log("map~~bound:", map.getBounds());
      // setBounds(map.getBounds());
      resetStyleToOverlay();
    }
  };

  const handleZoomChange = () => {
    // if (map && map.zoom < 13) {
    //     setIsOverlayActive(false);
    // } else {
    //     setIsOverlayActive(true);
    // }
    if (selectedVehicles.length) {
      resetStyleToOverlay();
    }
  };

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

  const handleMapDrag = () => {
    resetStyleToOverlay();
  };

  // const handleMapZoomAndPan = (location) => {
  //     if (map) {
  //         map.panTo({
  //             lat: location.path[location.path.length - 1].lat,
  //             lng: location.path[location.path.length - 1].lng,
  //         });
  //         // map.setZoom(14)
  //         smoothZoom(map, 14, map.getZoom());
  //     }
  // };

  // const smoothZoom = (map, max, cnt) => {
  //     if (cnt >= max) {
  //         return;
  //     } else {
  //         const z = window?.google?.maps?.event.addListener(
  //             map,
  //             "zoom_changed",
  //             function (event) {
  //                 window?.google?.maps?.event.removeListener(z);
  //                 smoothZoom(map, max, cnt + 1);
  //             }
  //         );
  //         setTimeout(function () {
  //             map.setZoom(cnt);
  //         }, 80); // 80ms is what I found to work well on my system -- it might not work well on all systems
  //     }
  // };

  //=======style add to the visible vehicle
  const setStyleToOverlay = () => {
    overlayMarkersRef.current = [];
    setTimeout(() => {
      const markers = document.getElementsByClassName("overlay-view");
      console.log("markers", markers);
      const markersArray = Array.from(markers);
      markersArray.map((marker) => {
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
      // set style
      setStyleToOverlay();
    }
    // console.log(document.getElementById(latestSelectedVehicle));
  }, [selectedVehicles.length]);

  // change map center
  useEffect(() => {
    if (map) {
      if (
        selectedVehicles.length &&
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
      // reset marker style
      // handleMapDrag()
    }
  }, [selectedVehicles]);

  // style visible vehicles
  // useEffect(() => {
  //     setStyleToOverlay();
  // }, [visibleSelectedVehicles.length]);

  return (
    <div>
      {isLoading ? (
        <div className="h-[78vh] rounded-lg bg-white p-2">
          <div className="w-full h-full skeleton rounded-lg"></div>
        </div>
      ) : (
        <div className="relative">
          <div className="flex justify-end absolute top-3 right-10 text-sm">
            <div className="traffic-filter rounded-lg bg-white flex items-center space-x-2 mr-4 px-2 z-10">
              <p className="text-base">Traffic</p>
              <div>
                {/* toggle button start */}
                <div
                  className="w-20 h-9  flex items-center bg-white rounded-[10px] cursor-pointer relative z-0  font-normal"
                  onClick={handleSetTrafficLayer}
                >
                  {/* Switch */}
                  <div className="w-20 h-9  flex justify-center items-center absolute top-0 left-0 px-3 text-tertiaryText">
                    <p className="w-full text-left ">Off</p>
                    <p className="w-full text-right ">On</p>
                  </div>
                  <div
                    className={
                      "bg-primary primary-shadow z-10 w-10 h-7 flex justify-center items-center rounded-[10px] shadow-md transform duration-300 ease-in-out" +
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

          <div className="relative bg-white rounded-xl">
            {isLoaded & !refreshMap ? (
              <div className="">
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  onBoundsChanged={handleBoundsChanged}
                  onZoomChanged={handleZoomChange}
                  onDrag={handleMapDrag}
                  center={mapCenter}
                  zoom={mapZoom}
                  ref={componentRef}
                  onLoad={onLoad}
                >
                  {trafficLayer && <TrafficLayerF />}

                  {selectedVehicles.map((vehicle, index) => (
                    <div key={vehicle.v_identifier}>
                      <Polyline
                        path={vehicle.path}
                        options={{
                          strokeColor: "#e31b25",
                          strokeOpacity: 1.0,
                          strokeWeight: 4,
                        }}
                      />

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
                            isMapSharing={true}
                          />
                        )}
                      </OverlayViewF>
                    </div>
                  ))}
                </GoogleMap>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[620px]">
                <div className="w-16 h-16 border-4 border-dashed rounded-full border-primary animate-spin"></div>
              </div>
            )}
            {/* ======== speed option ======== */}
            <div className="bg-white flex flex-col gap-2 items-center justify-evenly p-2 rounded-lg absolute left-4 bottom-8">
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
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(ShareCurrentLocationMap);
