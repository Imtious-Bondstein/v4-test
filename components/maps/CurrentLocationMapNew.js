import React, { memo, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Loader } from "@googlemaps/js-api-loader";
import dotenv from "dotenv";

//=====custom css
import "../../styles/pages/Home.css";
import "../../styles/components/currentLocationMap.css";

//========toast notification
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//=========over map tools 
import CustomToolTip from "../CustomToolTip";
import WatchmanSVG from "../SVG/WatchmanSVG";
import ShareSVG from "../SVG/ShareSVG";
import PrinterSVG from "../SVG/PrinterSVG";

//========utils
import { vehiclePingAnimation } from "@/utils/vehiclePingAnimationOld";

//=========info window
import CurrentLocationVehicleInfoWindowNew from "../infoWindows/CurrentLocationVehicleInfoWindowNew";
import { useReactToPrint } from "react-to-print";
import VehicleMarker from "../VehicleMarker";
import CurrentLocationVehicleInfoWindow from "../infoWindows/CurrentLocationVehicleInfoWindowOld";


dotenv.config();

const CurrentLocationMapNew = ({
  isLoading,
  isShareMap,
  height,
  title,
  selectedVehicles,
  setSelectedVehicles,
  getMapBoundVehicles,
  xlScreen,
}) => {
  //=====map style
  const containerStyle = {
    width: "100%",
    height: height,
  };

  //========print map
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // =======set map key
  const loader = new Loader({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  //======map
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [mapCenter, setMapCenter] = useState({
    lat: 23.8103,
    lng: 90.4125,
  });
  const [isMapLoading, setIsMapLoading] = useState(false);

  const [trafficLayer, setTrafficLayer] = useState(false);
  const toggleClass = " transform translate-x-10";

  const overlayRef = useRef(null);
  const overlayCarRef = useRef(null);

  const [bounds, setBounds] = useState(null);

  //======info window
  const [isInfoShowing, setIsInfoShowing] = useState(false);

  const [isMapLoaded, setIsMapLoaded] = useState(false)

  const overLayMarkers = useRef([])


  //======car marker
  const carMarker = (initPosition, pingColor) => {
    console.log("init pos", initPosition);
    const CustomOverlay = function (position) {
      this.position = position;
      this.map = mapRef.current;
      this.div = null;
      this.setMap(mapRef.current);
    };

    CustomOverlay.prototype = new window.google.maps.OverlayView();

    const style = document.createElement("style");
    style.innerHTML = `
    @keyframes pulse {
      75%, 100% {
        transform: scale(2);
        opacity: 0;
      }
    }
  `;
    document.head.appendChild(style);

    CustomOverlay.prototype.onAdd = function () {
      const div = document.createElement("div");
      div.style.borderStyle = "none";
      div.style.borderWidth = "0px";
      div.style.position = "absolute";
      div.style.zIndex = "999";

      // div.style.background = "red";
      div.style.padding = "10px";
      div.style.transform = "rotate(-90deg)";
      // div.style.transition = "all ease 1s";

      div.innerHTML =
        '<img width="50" src="https://i.ibb.co/Njg208f/Group.png" />';

      const span = document.createElement("span");
      span.style.height = "70px";
      span.style.width = "70px";
      span.style.position = "absolute";
      span.style.zIndex = "-1";
      span.style.top = "2px";
      span.style.left = "2px";
      span.style.borderRadius = "50%";
      span.style.backgroundColor = pingColor;

      const p = document.createElement("p");
      p.style.height = "70px";
      p.style.width = "70px";
      p.style.position = "absolute";
      p.style.zIndex = "-1";
      p.style.top = "2px";
      p.style.left = "2px";
      p.style.borderRadius = "50%";
      p.style.backgroundColor = pingColor;
      p.style.animation = "ping 1s ease-out infinite"; // Add the animation property to the span

      div.appendChild(span);
      div.appendChild(p);

      this.div = div;

      div.onclick = () => {
        setIsInfoShowing(!isInfoShowing);
      };

      // createRoot(div).render(
      //     <VehicleRouteVehicleInfoWindow
      //         path={paths[lastVisitedIndex.current]}
      //         setIsInfoShowing={setIsInfoShowing}
      //         vehicleDetails={vehicleDetails}
      //     />
      // );

      const panes = this.getPanes();
      panes.floatPane.appendChild(div);
    };

    CustomOverlay.prototype.draw = function () {
      const overlayProjection = this.getProjection();
      const position = overlayProjection.fromLatLngToDivPixel(this.position);
      const div = this.div;
      div.style.left = position.x - div.offsetWidth / 2 + "px";
      div.style.top = position.y - div.offsetHeight / 2 + "px";
    };

    CustomOverlay.prototype.onRemove = function () {
      this.div.parentNode.removeChild(this.div);
      this.div = null;
    };

    const overlay = new CustomOverlay(initPosition);
    overlayRef.current = overlay;
  };


  //======car infoWindow
  // const carOverlayMarker = (initPosition) => {
  //   console.log("init pos", initPosition);
  //   const CustomOverlay = function (position) {
  //     this.position = position;
  //     this.map = mapRef.current;
  //     this.div = null;
  //     this.setMap(mapRef.current);
  //   };

  //   CustomOverlay.prototype = new window.google.maps.OverlayView();

  //   CustomOverlay.prototype.onAdd = function () {
  //     const div = document.createElement("div");
  //     div.style.borderStyle = "none";
  //     div.style.borderWidth = "0px";
  //     div.style.position = "absolute";
  //     div.style.zIndex = "999";
  //     // div.style.background = 'red'
  //     // div.style.padding = '10px'
  //     // div.style.transform = "rotate(180deg)"
  //     div.style.transition = "all ease 1s";

  //     // === info window

  //     // createRoot(div).render(
  //     //   <CurrentLocationVehicleInfoWindowNew
  //     //     vehicle={selectedVehicles[lastVisitedIndex.current]}
  //     //     handleCloseInfoWindow={handleCloseInfoWindow}
  //     //   />
  //     // );
  //     this.div = div;
  //     const panes = this.getPanes();
  //     panes.floatPane.appendChild(div);
  //   };

  //   CustomOverlay.prototype.draw = function () {
  //     const overlayProjection = this.getProjection();
  //     const position = overlayProjection.fromLatLngToDivPixel(this.position);
  //     const div = this.div;
  //     div.style.left = position.x - div.offsetWidth / 2 + "px";
  //     div.style.top = position.y - div.offsetHeight / 2 + "px";
  //     console.log("test pos");
  //   };

  //   CustomOverlay.prototype.onRemove = function () {
  //     this.div.parentNode.removeChild(this.div);
  //     this.div = null;
  //   };

  //   const overlay = new CustomOverlay(initPosition);
  //   overlayCarRef.current = overlay;
  // };

  const handleBoundsChanged = () => {
    if (mapRef.current) {
      // console.log("map~~bound:", mapRef.current.getBounds());
      setBounds(mapRef.current.getBounds());
    }
  };


  const getMapBounds = () => {
    const visibleMarkers = selectedVehicles.filter((vehicleMarker) =>
      bounds.contains({
        lat: parseFloat(vehicleMarker.lat),
        lng: parseFloat(vehicleMarker.lng),
      })
    );
    console.log("visibleMarkers:-", visibleMarkers);
    return visibleMarkers;
  };

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

  const carOverlayMarker = (vehicle) => {
    const overlay = new window.google.maps.OverlayView();
    // let overlayContainer = null
    overlay.onAdd = function () {
      const div = document.createElement('div');
      div.style.position = 'absolute';
      // div.style.width = '41px';
      // div.style.height = '58px';
      // div.style.transform = 'translate(-50%, -100%)';
      // const img = document.createElement('img');
      // img.src = 'https://i.ibb.co/Njg208f/Group.png';
      // img.style.width = '50px';
      // img.style.height = '50px';
      // img.style.zIndex = '9999';
      // div.appendChild(img);


      const carMarkerContent = (
        <>
          <div className="relative flex h-[100px] w-[100px]">
            <span
              style={{
                backgroundColor: vehiclePingAnimation(vehicle),
              }}
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            >
            </span>
            <button
              onClick={() => handleOpenInfoWindow(vehicle)}
              style={{
                backgroundColor: vehiclePingAnimation(vehicle),
              }}
              className="relative flex justify-center items-center rounded-full h-[100px] w-[100px] cursor-pointer"
            >
              <VehicleMarker />
            </button>
          </div>
          {
            vehicle.isInfoShowing && (
              <CurrentLocationVehicleInfoWindow
                vehicle={vehicle}
                handleCloseInfoWindow={handleCloseInfoWindow}
              />
            )
          }
        </>
      );

      createRoot(div).render(carMarkerContent);

      overlay.div = div
      const panes = overlay.getPanes();
      panes.overlayMouseTarget.appendChild(div);
    };
    overlay.draw = () => {

      const div = overlay.div;
      const projection = overlay.getProjection();
      const position = projection.fromLatLngToDivPixel(vehicle);
      div.style.left = position.x + 'px';
      div.style.top = position.y + 'px';
    };
    overlay.onRemove = () => {
      overlay.div.parentNode.removeChild(
        overlay.div
      );
      overlay.div = null;
    };

    overlay.setMap(mapRef.current);

    overLayMarkers.current.push(overlay)
  }

  const removeOverlayMarkers = () => {
    // Remove all overlay markers from the map
    overLayMarkers.current.forEach((overlay) => {
      overlay.setMap(null)
    });

    // // Clear the overlay markers array
    overLayMarkers.current.length = 0;
    // console.log('total', overLayMarkers.current);
  };


  const initMap = () => {
    removeOverlayMarkers()
    if (selectedVehicles && selectedVehicles.length > 0) {
      // const initialLatLng = {
      //   lat: selectedVehicles[0].lat,
      //   lng: selectedVehicles[0].lng,
      // };


      selectedVehicles.map((vehicle, index) => {
        // mapRef.current.setCenter(vehicle);
        // let pingColor = vehiclePingAnimation(vehicle);
        // carMarker(initialLatLng, pingColor);
        carOverlayMarker(vehicle);
      });


    }
  };



  useEffect(() => {
    // set load map
    loader
      .load()
      .then(async () => {
        const { google } = window;
        mapRef.current = new google.maps.Map(mapContainerRef.current, {
          // center: mapCenter,
          zoom: 15,
        });
        mapRef.current.addListener("bounds_changed", () => {
          handleBoundsChanged()
        });
        setIsMapLoaded(true)
        // initMap();
      })
      .catch((err) => {
        console.log("map error", err);
      });
  }, []);


  useEffect(() => {
    initMap()
  }, [selectedVehicles])

  //======select map center by latest marker
  useEffect(() => {
    if (isMapLoaded) {
      if (selectedVehicles.length) {
        const latestSelectedVehicle =
          selectedVehicles[selectedVehicles.length - 1];
        console.log("latestSelectedVehicle", latestSelectedVehicle);
        // setMapCenter({
        //   lat: parseFloat(latestSelectedVehicle?.lat),
        //   lng: parseFloat(latestSelectedVehicle?.lng),
        // });

        mapRef.current.setCenter(latestSelectedVehicle);
      } else {
        mapRef.current.setCenter(mapCenter);
      }
    }
  }, [selectedVehicles.length, isMapLoaded]);

  useEffect(() => {
    if (selectedVehicles?.length) {
      getMapBoundVehicles(getMapBounds());
    }
  }, [bounds]);

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
                // onClick={handleSetTrafficLayer}
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

      {isLoading ? (
        <div className="h-[78vh] rounded-lg bg-white p-2">
          <div className="w-full h-full skeleton rounded-lg"></div>
        </div>
      ) : (
        <div>
          <div
            className={`relative bg-white rounded-xl ${!isShareMap ? "p-2" : ""
              }`}
          >
            {/* =========main map========= */}
            {/* {!isMapLoading ? ( */}
            <div
              ref={mapContainerRef}
              className="vehicle-route-map"
              style={containerStyle}
            ></div>
            {/* ) : null} */}

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
                  // onClick={handleShareCurrentLocation}
                  className="flex items-center space-x-4 bg-secondary rounded-lg px-3 py-2 tmv-shadow"
                // disabled={!selectedVehicles.length && isLoaded}
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
      )}
    </div>
  );
};

export default CurrentLocationMapNew;
