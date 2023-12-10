import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Loader } from "@googlemaps/js-api-loader";

//=====custom css
import "../../styles/pages/Home.css";
import "../../styles/components/currentLocationMap.css";

//========toast notification
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//============SVG
import GreenFlagSVG from "../SVG/mapMarkerSVG/GreenFlagSVG";
import RedFlagSVG from "../SVG/mapMarkerSVG/RedFlagSVG";
import ParkingSVG from "../SVG/mapMarkerButton/ParkingSVG";
import SpeedSVG from "../SVG/mapMarkerButton/SpeedSVG";
import PowerSVG from "../SVG/mapMarkerButton/PowerSVG";
import BrakeSVG from "../SVG/mapMarkerButton/BrakeSVG";
import WatchmanSVG from "../SVG/WatchmanSVG";
import ShareSVG from "../SVG/ShareSVG";
import PrinterSVG from "../SVG/PrinterSVG";

// custom tooltip
import CustomToolTip from "../CustomToolTip";

// marker img import
import parkingMarkerImg from "../../public/markers/parking.png";
import speedMarkerImg from "../../public/markers/speed.png";
import brakeMarkerImg from "../../public/markers/brake.png";
import powerMarkerImg from "../../public/markers/power.png";
import pointerMarkerImg from "../../public/markers/carPointerMarker.png";
import PlaySVG from "../SVG/PlaySVG";
import PauseSVG from "../SVG/PauseSVG";

// range slider
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

// table
import VehicleRoutesDetailsTable from "../VehicleRoutesDetailsTable";

// chart
import VehicleRoutePathsChart from "../charts/VehicleRoutePathsChart";

//=========info window
import VehicleRouteVehicleInfoWindow from "../infoWindows/VehicleRouteVehicleInfoWindow";
import VehicleRouteVehicleInfoWindowOld from "../infoWindows/VehicleRouteVehicleInfoWindowOld";

//=======utils
import { clientBaseUrl } from "@/utils/clientBaseUrl";
import { infoWindowDateTime } from "@/utils/dateTimeConverter";

//=====print map
import { useReactToPrint } from "react-to-print";

import dotenv from "dotenv";
import { renderToString } from "react-dom/server";

import ShareVehicleRouteModal from "../modals/ShareVehicleRouteModal";
import overspeed from "@/pages/activity/alerts/overspeed";
import { he } from "date-fns/locale";
import { handleRouteVehicleType } from "@/utils/vehicleTypeCheck";

dotenv.config();

const VehicleRouteMap = ({
  height,
  title,
  paths,
  parking,
  speed,
  brake,
  power,
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
  const [shareVehicleRouteModalIsOpen, setShareVehicleRouteModalIsOpen] =
    useState(false);

  // const selectedVehicles = useRef([]);
  //=====map style
  const containerStyle = {
    width: "100%",
    // height: '100%',
  };

  //====print map
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // =======set map key
  const loader = new Loader({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["drawing", "visualization"],
  });

  //===visited path
  const [visitedPath, setVisitedPath] = useState([]);
  const visitedPolylineRef = useRef(null);

  //======map
  const mapContainerRef = useRef();
  const mapRef = useRef(null);
  const [mapCenter, setMapCenter] = useState({
    lat: 23.8103,
    lng: 90.4125,
  });
  const [isMapLoading, setIsMapLoading] = useState(false);

  // const pointLayer = useRef(false);
  const [pointLayer, setPointLayer] = useState(false);
  const toggleClass = " transform translate-x-16";
  const [heatMapLayer, setHeatMapLayer] = useState(false);

  const polylineRef = useRef(null);
  const lastVisitedIndex = useRef(0);

  const heatMapRef = useRef(null);
  const heatPoints = useRef([]);

  // ==========marker
  const overLayMarkerRef = useRef(null);

  const markerRef = useRef(null);
  const markerObjectRef = useRef(null);
  const markerIdentifier = useRef(null);
  const markerContainerIdentifier = useRef(null);
  const carPointerMarkers = useRef([]);
  const parkingPointMarkers = useRef([]);
  const powerPointMarkers = useRef([]);
  const speedPointMarkers = useRef([]);
  const brakePointMarkers = useRef([]);

  //======info window
  const overLayInfoWindowRef = useRef(null);

  const infoWindowRef = useRef(null);
  const infoWindowObjectRef = useRef(null);
  const infoWindowIdentifier = useRef(null);
  const carPointInfoWindows = useRef([]);
  const parkingPointInfoWindows = useRef([]);
  const speedPointInfoWindows = useRef([]);
  const brakePointInfoWindows = useRef([]);
  const powerPointInfoWindows = useRef([]);

  //======marker flag
  const startFlagRef = useRef(null);
  const endFlagRef = useRef(null);

  const [isInfoShowing, setIsInfoShowing] = useState(false);
  // const isInfoShowing = useRef(false);

  //=======other marker toggle
  const [isParkingMarkerActive, setIsParkingMarkerActive] = useState(false);
  // const isParkingMarkerActive = useRef(false)
  const [isSpeedMarkerActive, setIsSpeedMarkerActive] = useState(false);
  const [isBrakeMarkerActive, setIsBrakeMarkerActive] = useState(false);
  const [isPowerMarkerActive, setIsPowerMarkerActive] = useState(false);

  const markerInterval = useRef(null);
  const [isMarkerPaused, setIsMarkerPaused] = useState(true);
  const [markerDraggervalue, setMarkerDraggervalue] = useState([0, 0]);
  const markerMovementSpeed = useRef(500);
  const markerAngle = useRef(0);

  // Modal
  const [isBack, setIsBack] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(null);

  const carInfoWindowContent = (
    <VehicleRouteVehicleInfoWindow
      path={paths[lastVisitedIndex.current]}
      setIsInfoShowing={setIsInfoShowing}
      vehicleDetails={vehicleDetails}
      isMapSharing={false}
    />
  );

  //========start and end marker
  const createOverlay = (Component, latLng, flag) => {
    const overlay = new window.google.maps.OverlayView();
    overlay.onAdd = function () {
      const div = document.createElement("div");
      div.style.position = "absolute";
      div.style.width = "41px";
      div.style.height = "58px";
      div.style.zIndex = "99";
      div.style.transform = "translate(-50%, -100%)";
      createRoot(div).render(<Component />);
      this.div = div;
      this.getPanes().overlayLayer.appendChild(div);
    };

    overlay.onRemove = function () {
      this.div.parentNode.removeChild(this.div);
    };

    overlay.draw = function () {
      const overlayProjection = this.getProjection();
      const position = overlayProjection.fromLatLngToDivPixel(latLng);
      const div = this.div;
      div.style.left = position.x + "px";
      div.style.top = position.y + div.offsetHeight / 2 + "px";
      // div.style.left = (position.x - div.offsetWidth / 2) + "px";
      // div.style.top = (position.y - div.offsetHeight / 2) + "px";
    };

    overlay.setMap(mapRef.current);

    //====set flag ref
    if (flag === "start") {
      startFlagRef.current = overlay;
    } else if (flag === "end") {
      endFlagRef.current = overlay;
    }
  };

  //========map bounds
  const handleMapBounds = () => {
    const bounds = new window.google.maps.LatLngBounds();

    for (const path of paths) {
      bounds.extend(path);
    }

    mapRef.current.fitBounds(bounds);
  };

  //=======primary polyLine
  const primaryPolyline = () => {
    const polyline = new google.maps.Polyline({
      path: paths,
      geodesic: true,
      strokeColor: "#e31b25",
      strokeOpacity: 1.0,
      strokeWeight: 4,
    });

    console.log(
      (polylineRef.current = polyline),
      "Paths==============================="
    );

    polyline.setMap(mapRef.current);
    polylineRef.current = polyline;
  };

  //=======visited polyLine
  const visitedPolyline = () => {
    const polyline = new google.maps.Polyline({
      path: [],
      geodesic: true,
      strokeColor: "#00ae65",
      strokeOpacity: 1.0,
      strokeWeight: 4,
    });

    polyline.setMap(mapRef.current);
    visitedPolylineRef.current = polyline;
  };

  //=======overlay car marker
  const carOverlayMarker = () => {
    const overlay = new window.google.maps.OverlayView();
    // let overlayContainer = null
    overlay.onAdd = function () {
      const div = document.createElement("div");
      div.style.position = "absolute";

      const carMarkerContent = (
        <>
          <button className="" onClick={() => setIsInfoShowing(!isInfoShowing)}>
            <img
              style={{
                transform: `rotate(${markerAngle.current}deg)`,
                transition: "all 1s ease",
              }}
              className="h-12 w-12"
              src={handleRouteVehicleType(
                vehicleDetails && vehicleDetails.vehicle_type
                  ? vehicleDetails.vehicle_type.toLowerCase()
                  : ""
              )}
              alt=""
            />
          </button>
        </>
      );

      createRoot(div).render(carMarkerContent);

      overlay.div = div;
      const panes = overlay.getPanes();
      panes.overlayMouseTarget.appendChild(div);
    };
    overlay.draw = () => {
      const div = overlay.div;
      const projection = overlay.getProjection();
      const position = projection.fromLatLngToDivPixel(
        paths[lastVisitedIndex.current]
      );
      div.style.left = position.x - div.offsetWidth / 2 + "px";
      div.style.top = position.y - div.offsetHeight / 2 + "px";
    };
    overlay.onRemove = () => {
      overlay.div.parentNode.removeChild(overlay.div);
      overlay.div = null;
    };

    overlay.setMap(mapRef.current);

    overLayMarkerRef.current = overlay;
  };

  //=======overlay car info window
  const carOverlayInfoWindow = () => {
    const overlay = new window.google.maps.OverlayView();
    // let overlayContainer = null
    overlay.onAdd = function () {
      const div = document.createElement("div");
      div.style.position = "absolute";
      const root = createRoot(div);
      root.render(carInfoWindowContent);

      overlay.root = root;
      overlay.div = div;
      const panes = overlay.getPanes();
      panes.floatPane.appendChild(div);
    };
    overlay.draw = () => {
      const div = overlay.div;
      const projection = overlay.getProjection();
      const position = projection.fromLatLngToDivPixel(
        paths[lastVisitedIndex.current]
      );
      div.style.left = position.x - div.offsetWidth / 2 + "px";
      div.style.top = position.y - div.offsetHeight / 2 + "px";
    };
    overlay.onRemove = () => {
      overlay.div.parentNode.removeChild(overlay.div);
      overlay.div = null;
    };

    // overlay.setMap(mapRef.current);

    overLayInfoWindowRef.current = overlay;
  };

  // **********car point marker start**********
  const carPointMarkerSet = (position) => {
    const carPoint = new window.google.maps.Marker({
      position: position,
      map: mapRef.current,
      icon: {
        url: pointerMarkerImg.src,
        scaledSize: { width: 42, height: 42 },
        // anchor: { x: 20, y: 20 },
        scale: 0.2,
      },
      title: "Car Point",
      zIndex: 10,
    });
    carPointerMarkers.current.push(carPoint);

    const carPointInfowindow = new google.maps.InfoWindow({
      zIndex: 20,
      // content: content
    });
    carPointInfoWindows.current.push(carPointInfowindow);
    // carPoint.setMap(mapRef.current);
  };

  // show car pointer marker
  const showCarPointerMarker = () => {
    carPointerMarkers.current.map((marker, index) => {
      const content = document.createElement("div");
      const infoWindowContent = `
      <div style="width: 144px">
        <p><span style="font-weight: 700">Event: </span> Data Point</p>
        <p><span style="font-weight: 700">Lat: </span> ${paths[index].lat}</p>
        <p><span style="font-weight: 700">Lng: </span> ${paths[index].lng}</p>
        <p><span style="font-weight: 700">Location: </span> ${
          paths[index].location
        }(${
        paths[index].landmark_distance &&
        paths[index].landmark_distance.toFixed(2)
      }Km)</p>
        <p><span style="font-weight: 700">Speed: </span> ${
          paths[index].speed
        } Kmh</p>
        <p><span style="font-weight: 700">Date: </span> ${infoWindowDateTime(
          paths[index].dateTime
        )}</p>
      </div>
    `;
      content.innerHTML = infoWindowContent;
      // content: renderToString(
      //   <VehicleRouteVehicleInfoWindowNew
      //     path={paths[index]}
      //     vehicleDetails={vehicleDetails}
      //   />
      // ),
      // carPointInfowindow.current = new google.maps.InfoWindow({
      //   zIndex: 20,
      //   content: content
      // });
      carPointInfoWindows.current[index].setContent(content);
      marker.addListener("click", function () {
        carPointInfoWindows.current[index].open(mapRef.current, marker);
      });
      marker.setMap(mapRef.current);
    });
  };
  // hide car pointer marker
  const hideCarPointerMarker = () => {
    carPointerMarkers.current.map((marker) => {
      marker.setMap(null);
    });
  };

  // handle point Layer
  const handlePointLayer = () => {
    // pointLayer.current = !pointLayer.current;
    // console.log(pointLayer.current);
    setPointLayer(!pointLayer);
    if (!pointLayer) {
      showCarPointerMarker();
    } else {
      hideCarPointerMarker();
    }
  };

  // ****************heat map start****************
  const heatMapPointSet = (position) => {
    const heatPoint = new window.google.maps.LatLng(position.lat, position.lng);
    heatPoints.current.push(heatPoint);
  };
  const showHeatMapLayer = () => {
    heatMapRef.current = new google.maps.visualization.HeatmapLayer({
      data: heatPoints.current,
    });
    //===set radius
    heatMapRef.current.set(
      "radius",
      heatMapRef.current.get("radius") ? null : 20
    );
    heatMapRef.current.setMap(mapRef.current);

    // hide other component
    polylineRef.current.setMap(null);
    visitedPolylineRef.current.setMap(null);
    hideParkingMarker();
    hidePowerMarker();
    hideBrakeMarker();
    hideSpeedMarker();
    hideCarPointerMarker();

    overLayMarkerRef.current.setMap(null);
    overLayInfoWindowRef.current.setMap(null);

    // pause movement
    setIsMarkerPaused(true);
    pauseMarkerMovement();
    lastVisitedIndex.current = 0;
    markerAngle.current = 0;
    markerMovementSpeed.current = 500;
    setMarkerDraggervalue([0, 0]);
    handleMapBounds();

    // hide flags
    startFlagRef.current.setMap(null);
    endFlagRef.current.setMap(null);
  };
  const hideHeatMapLayer = () => {
    heatMapRef.current.setMap(null);

    // show other component
    polylineRef.current.setMap(mapRef.current);
    visitedPolylineRef.current.setMap(mapRef.current);
    // showParkingMarker()
    // showPowerMarker()
    // showBrakeMarker()
    // showSpeedMarker()
    // showCarPointerMarker()

    // car marker and infowindow
    overLayMarkerRef.current.setMap(mapRef.current);
    overLayInfoWindowRef.current.setMap(mapRef.current);

    // show flags
    startFlagRef.current.setMap(mapRef.current);
    endFlagRef.current.setMap(mapRef.current);
  };
  // ****************heat map end****************

  // handle point Layer
  const handleHeatMapLayer = () => {
    // pointLayer.current = !pointLayer.current;
    // console.log(pointLayer.current);
    setHeatMapLayer(!heatMapLayer);
    if (!heatMapLayer) {
      showHeatMapLayer();
    } else {
      hideHeatMapLayer();
    }
  };

  // **********car point marker end**********

  //**************parking marker start**************
  const parkingMarkerSet = (position) => {
    const parkingPoint = new window.google.maps.Marker({
      position: position,
      map: mapRef.current,
      icon: {
        url: parkingMarkerImg.src,
        scaledSize: { width: 32, height: 42 },
        // anchor: { x: 20, y: 20 },
        scale: 0.2,
      },
      title: "Parking",
      zIndex: 10,
    });
    parkingPointMarkers.current.push(parkingPoint);

    const parkingPointInfowindow = new google.maps.InfoWindow({
      zIndex: 20,
      // content: content
    });
    parkingPointInfoWindows.current.push(parkingPointInfowindow);
  };

  // show parking pointer marker
  const showParkingMarker = () => {
    parkingPointMarkers.current.map((marker, index) => {
      const content = document.createElement("div");
      const infoWindowContent = `
      <div style="width: 144px">
        <p><span style="font-weight: 700">Event: </span> Parking</p>
        <p><span style="font-weight: 700">Lat: </span> ${parking[index].lat}</p>
        <p><span style="font-weight: 700">Lng: </span> ${parking[index].lng}</p>
        <p><span style="font-weight: 700">Location: </span> ${
          parking[index].landmark
        }(${
        parking[index].landmark_distance &&
        parking[index].landmark_distance.toFixed(2)
      }Km)</p>
        <p><span style="font-weight: 700">Date: </span> ${infoWindowDateTime(
          parking[index].dateTime
        )}</p>
        <p><span style="font-weight: 700">Duration: </span> ${
          parking[index].duration
        }</p>
      </div>
    `;
      content.innerHTML = infoWindowContent;

      parkingPointInfoWindows.current[index].setContent(content);
      marker.addListener("click", function () {
        parkingPointInfoWindows.current[index].open(mapRef.current, marker);
      });

      marker.setMap(mapRef.current);
    });
  };
  const hideParkingMarker = () => {
    parkingPointMarkers.current.map((marker, index) => {
      marker.setMap(null);
    });
  };
  const handleIsParkingMarkerActive = () => {
    setIsParkingMarkerActive(!isParkingMarkerActive);
    if (!isParkingMarkerActive) {
      showParkingMarker();
    } else {
      hideParkingMarker();
    }
  };
  //**************parking marker end**************

  //**************engine-status marker start**************
  const powerMarkerSet = (position) => {
    const powerPoint = new window.google.maps.Marker({
      position: position,
      map: mapRef.current,
      icon: {
        url: powerMarkerImg.src,
        scaledSize: { width: 32, height: 42 },
        // anchor: { x: 20, y: 20 },
        scale: 0.2,
      },
      title: "Engine Status",
      zIndex: 10,
    });
    powerPointMarkers.current.push(powerPoint);

    const powerPointInfowindow = new google.maps.InfoWindow({
      zIndex: 20,
      // content: content
    });
    powerPointInfoWindows.current.push(powerPointInfowindow);
  };
  const showPowerMarker = () => {
    powerPointMarkers.current.map((marker, index) => {
      const content = document.createElement("div");
      const infoWindowContent = `
      <div style="width: 144px">
        <p><span style="font-weight: 700">Event: </span> Engine ${
          power[index].engine_status ? " On" : " Off"
        }</p>
        <p><span style="font-weight: 700">Lat: </span> ${power[index].lat}</p>
        <p><span style="font-weight: 700">Lng: </span> ${power[index].lng}</p>
        <p><span style="font-weight: 700">Location: </span> ${
          power[index].landmark
        }(${
        power[index].landmark_distance &&
        power[index].landmark_distance.toFixed(2)
      }Km)</p>
        <p><span style="font-weight: 700">Date: </span> ${infoWindowDateTime(
          power[index].dateTime
        )}</p>
      </div>
    `;
      content.innerHTML = infoWindowContent;

      powerPointInfoWindows.current[index].setContent(content);
      marker.addListener("click", function () {
        powerPointInfoWindows.current[index].open(mapRef.current, marker);
      });

      marker.setMap(mapRef.current);
    });
  };
  const hidePowerMarker = () => {
    powerPointMarkers.current.map((marker, index) => {
      marker.setMap(null);
    });
  };
  const handleIsPowerMarkerActive = () => {
    setIsPowerMarkerActive(!isPowerMarkerActive);
    if (!isPowerMarkerActive) {
      showPowerMarker();
    } else {
      hidePowerMarker();
    }
  };
  //**************engine-status marker end**************

  //**************harsh-brake marker start**************
  const brakeMarkerSet = (position) => {
    const brakePoint = new window.google.maps.Marker({
      position: position,
      map: mapRef.current,
      icon: {
        url: brakeMarkerImg.src,
        scaledSize: { width: 32, height: 42 },
        // anchor: { x: 20, y: 20 },
        scale: 0.2,
      },
      title: "Brake",
      zIndex: 10,
    });
    brakePointMarkers.current.push(brakePoint);

    const brakePointInfowindow = new google.maps.InfoWindow({
      zIndex: 20,
      // content: content
    });
    brakePointInfoWindows.current.push(brakePointInfowindow);
  };
  const showBrakeMarker = () => {
    brakePointMarkers.current.map((marker, index) => {
      const content = document.createElement("div");
      const infoWindowContent = `
      <div style="width: 144px">
        <p><span style="font-weight: 700">Event: </span> Harsh Brake</p>
        <p><span style="font-weight: 700">Lat: </span> ${brake[index].lat}</p>
        <p><span style="font-weight: 700">Lng: </span> ${brake[index].lng}</p>
        <p><span style="font-weight: 700">Location: </span> ${
          brake[index].landmark
        }(${
        brake[index].landmark_distance &&
        brake[index].landmark_distance.toFixed(2)
      }Km)</p>
        <p><span style="font-weight: 700">Speed: </span> ${
          brake[index].speed
        } Kmh</p>
        <p><span style="font-weight: 700">Date: </span> ${infoWindowDateTime(
          brake[index].dateTime
        )}</p>
      </div>
    `;
      content.innerHTML = infoWindowContent;

      brakePointInfoWindows.current[index].setContent(content);
      marker.addListener("click", function () {
        brakePointInfoWindows.current[index].open(mapRef.current, marker);
      });

      marker.setMap(mapRef.current);
    });
  };
  const hideBrakeMarker = () => {
    brakePointMarkers.current.map((marker, index) => {
      marker.setMap(null);
    });
  };
  const handleIsBrakeMarkerActive = () => {
    setIsBrakeMarkerActive(!isBrakeMarkerActive);
    if (!isBrakeMarkerActive) {
      showBrakeMarker();
    } else {
      hideBrakeMarker();
    }
  };
  //**************harsh-brake marker end**************

  //**************overspeed marker start**************
  const speedMarkerSet = (position) => {
    const speedPoint = new window.google.maps.Marker({
      position: position,
      map: mapRef.current,
      icon: {
        url: speedMarkerImg.src,
        scaledSize: { width: 32, height: 42 },
        // anchor: { x: 20, y: 20 },
        scale: 0.2,
      },
      title: "Overspeed",
      zIndex: 10,
    });
    speedPointMarkers.current.push(speedPoint);

    const speedPointInfowindow = new google.maps.InfoWindow({
      zIndex: 20,
      // content: content
    });
    speedPointInfoWindows.current.push(speedPointInfowindow);
  };
  const showSpeedMarker = () => {
    speedPointMarkers.current.map((marker, index) => {
      const content = document.createElement("div");
      const infoWindowContent = `
      <div style="width: 144px">
        <p><span style="font-weight: 700">Event: </span> Overspeed</p>
        <p><span style="font-weight: 700">Lat: </span> ${speed[index].lat}</p>
        <p><span style="font-weight: 700">Lng: </span> ${speed[index].lng}</p>
        <p><span style="font-weight: 700">Location: </span> ${
          speed[index].landmark
        }(${
        speed[index].landmark_distance &&
        speed[index].landmark_distance.toFixed(2)
      }Km)</p>
        <p><span style="font-weight: 700">Speed: </span> ${
          speed[index].speed
        } Kmh</p>
        <p><span style="font-weight: 700">Date: </span> ${infoWindowDateTime(
          speed[index].dateTime
        )}</p>
      </div>
    `;
      content.innerHTML = infoWindowContent;

      speedPointInfoWindows.current[index].setContent(content);
      marker.addListener("click", function () {
        speedPointInfoWindows.current[index].open(mapRef.current, marker);
      });

      marker.setMap(mapRef.current);
    });
  };
  const hideSpeedMarker = () => {
    speedPointMarkers.current.map((marker, index) => {
      marker.setMap(null);
    });
  };
  const handleIsSpeedMarkerActive = () => {
    setIsSpeedMarkerActive(!isSpeedMarkerActive);
    if (!isSpeedMarkerActive) {
      showSpeedMarker();
    } else {
      hideSpeedMarker();
    }
  };
  //**************overspeed marker end**************

  const initMap = () => {
    if (paths && paths.length > 0) {
      const greenFlagLatLng = new window.google.maps.LatLng(paths[0]); // Change the coordinates to your desired location
      createOverlay(GreenFlagSVG, greenFlagLatLng, "start");

      const redFlagLatLng = new window.google.maps.LatLng(
        paths[paths.length - 1]
      ); // Change the coordinates to your desired location
      createOverlay(RedFlagSVG, redFlagLatLng, "end");

      const initialLatLng = {
        lat: paths[0].lat,
        lng: paths[0].lng,
      };

      mapRef.current && mapRef.current.setCenter(initialLatLng);
      // handleMapCenter()
      handleMapBounds();
      primaryPolyline();
      visitedPolyline();
      carOverlayMarker();
      carOverlayInfoWindow();
    }
  };

  const animatedMove = async (marker, moveFrom, moveTo, t, delta = 100) => {
    return new Promise((resolve) => {
      const deltalat = (moveTo.lat - moveFrom.lat) / delta;
      const deltalng = (moveTo.lng - moveFrom.lng) / delta;
      let count = 0;
      for (let i = 0; i < delta; i++) {
        setTimeout(() => {
          let lat = marker.getPosition().lat();
          let lng = marker.getPosition().lng();
          lat += deltalat;
          lng += deltalng;
          marker.setPosition({ lat, lng });
          count++;
          if (count === delta) {
            resolve(marker);
          }
        }, t * i);
      }
    });
  };

  //========handle marker angel start
  const normalizeAngle = (angle) => {
    if (angle >= 0) {
      return angle % 360;
    } else {
      return (angle % 360) + 360;
    }
  };
  const calculateShortestRotation = (previousAngle, currentAngle) => {
    const normalizedPreviousAngle = normalizeAngle(previousAngle);
    const normalizedCurrentAngle = normalizeAngle(currentAngle);

    const difference = normalizedCurrentAngle - normalizedPreviousAngle;
    const shortestRotation = ((((difference + 180) % 360) + 360) % 360) - 180;

    return shortestRotation;
  };
  //========handle marker angel end

  const moveMarkerAlongPath = () => {
    const marker = overLayMarkerRef.current;
    const infoWindow = overLayInfoWindowRef.current;

    if (paths && paths.length > 0 && marker) {
      if (marker.index < paths.length) {
        const newPosition = paths[marker.index];
        const overlayProjection = overLayMarkerRef.current.getProjection();
        const position = overlayProjection.fromLatLngToDivPixel(
          new window.google.maps.LatLng(newPosition)
        );

        //======marker
        if (marker.div) {
          marker.div.style.transition = `all ${
            markerMovementSpeed.current / 1000
          }s ease`;
          marker.div.style.left =
            position.x - marker.div.offsetWidth / 2 + "px";
          marker.div.style.top =
            position.y - marker.div.offsetHeight / 2 + "px";
        }
        //=======info window
        if (infoWindow.div) {
          infoWindow.div.style.transition = `all ${
            markerMovementSpeed.current / 1000
          }s ease`;
          infoWindow.div.style.left =
            position.x - marker.div.offsetWidth / 2 + "px";
          infoWindow.div.style.top =
            position.y - marker.div.offsetHeight / 2 + "px";
        }

        if (marker.index < paths.length - 1) {
          const nextPosition = paths[marker.index + 1];
          const heading = google.maps.geometry.spherical.computeHeading(
            new google.maps.LatLng(newPosition),
            new google.maps.LatLng(nextPosition)
          );
          // console.log("heading----", heading);
          // markerAngle.current = heading - 90;

          // Normalize the heading to be between -180 and 180
          // const normalizedHeading = (heading + 360) % 360;
          // console.log('normalized----', normalizedHeading)

          // // Calculate the shortest rotation path
          // const rotation = normalizedHeading - 90;
          // const shortestRotation = rotation > 180 ? rotation - 360 : rotation;

          // markerAngle.current = shortestRotation;
          const rotation = calculateShortestRotation(
            markerAngle.current + 90,
            heading
          );
          markerAngle.current += rotation;

          marker.div.style.transform = `rotate(${markerAngle.current}deg)`;

          // animatedMove(marker, newPosition, nextPosition, 3);
        }

        let steps = 5;

        if (markerMovementSpeed.current < 251) {
          steps = 2;
          //========zoom map
          mapRef.current.setZoom(13);
        } else {
          steps = 5;
          //========zoom map
          mapRef.current.setZoom(15);
        }

        // handle pan every 5 steps
        if ((marker.index + 1) % steps === 0) {
          handlePanTo(newPosition);
        }

        // set drag ranger value
        markerDraggervalue[1] = marker.index;
        setMarkerDraggervalue([...markerDraggervalue]);

        // ======visited path
        // visitedPolylineRef.current
        //   .getPath()
        //   .push(new google.maps.LatLng(newPosition));
        const visited = paths.slice(0, marker.index + 1);
        visitedPolylineRef.current.setPath(visited);

        // if (marker.index > paths.length) {
        //   console.log("Finished");
        //   stopMarkerMovement();
        // } else {
        //   lastVisitedIndex.current = marker.index;
        // }

        // track last visited index
        lastVisitedIndex.current = marker.index;
        console.log("current index----", marker.index);
      } else {
        console.log("Finished");
        stopMarkerMovement();
      }
      marker.index++;
    }
  };

  const smoothZoom = (map, max, cnt) => {
    if (cnt >= max) {
      return;
    } else {
      const z = window.google.maps.event.addListener(
        map,
        "zoom_changed",
        function (event) {
          window.google.maps.event.removeListener(z);
          smoothZoom(map, max, cnt + 1);
        }
      );
      setTimeout(function () {
        map.setZoom(cnt);
      }, 80); // 80ms is what I found to work well on my system -- it might not work well on all systems
    }
  };

  //========previous methods start
  const startMarkerMovement = () => {
    if (overLayMarkerRef.current.index > paths.length) {
      lastVisitedIndex.current = 0;
    }
    //========zoom map
    // mapRef.current.setZoom(15);
    smoothZoom(mapRef.current, 15, mapRef.current.getZoom());
    //========center map
    // mapRef.current.setCenter(paths[lastVisitedIndex.current]);
    handlePanTo(paths[lastVisitedIndex.current]);

    markerInfoWindowStyleDisable();

    // markerRef.current.index = lastVisitedIndex.current;
    overLayMarkerRef.current.index = lastVisitedIndex.current;
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
    handlePanTo(paths[lastVisitedIndex.current]);
    // markerRef.current.index = markerDraggervalue[1];
    //=======custom marker
    overLayMarkerRef.current.index = markerDraggervalue[1];
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
    lastVisitedIndex.current = data.activeTooltipIndex;
    handlePanTo(paths[lastVisitedIndex.current]);
    // markerRef.current.index = data.activeTooltipIndex;
    //=======custom marker
    overLayMarkerRef.current.index = data.activeTooltipIndex;
    moveMarkerAlongPath();
    // console.log('Clicked on area', data.activeTooltipIndex);
  };

  const handleShareVehicleRoute = () => {
    setIsBack(false);
    setSelectedDuration(null);
    setShareVehicleRouteModalIsOpen(true);
  };

  const clearPreviousState = () => {
    // ==========marker
    markerRef.current = null;
    markerObjectRef.current = null;
    markerIdentifier.current = null;
    markerContainerIdentifier.current = null;
    carPointerMarkers.current = [];
    parkingPointMarkers.current = [];
    powerPointMarkers.current = [];
    speedPointMarkers.current = [];
    brakePointMarkers.current = [];
    overLayMarkerRef.current = null;

    //======info window
    infoWindowRef.current = null;
    infoWindowObjectRef.current = null;
    infoWindowIdentifier.current = null;
    carPointInfoWindows.current = [];
    parkingPointInfoWindows.current = [];
    speedPointInfoWindows.current = [];
    brakePointInfoWindows.current = [];
    powerPointInfoWindows.current = [];
    setIsInfoShowing(false);
    overLayInfoWindowRef.current = null;

    //=======other marker toggle
    setIsParkingMarkerActive(false);
    setIsSpeedMarkerActive(false);
    setIsBrakeMarkerActive(false);
    setIsPowerMarkerActive(false);

    setIsMarkerPaused(true);
    setMarkerDraggervalue([0, 0]);
    markerMovementSpeed.current = 500;

    lastVisitedIndex.current = 0;
    polylineRef.current = null;
    setPointLayer(false);
    markerAngle.current = 0;

    //===visited path
    setVisitedPath([]);
    visitedPolylineRef.current = null;

    // ========clear Interval
    clearInterval(markerInterval.current);
    markerInterval.current = null;

    //=====heatmap
    setHeatMapLayer(false);
    heatMapRef.current = null;
    heatPoints.current = [];

    //=====flag
    startFlagRef.current = null;
    endFlagRef.current = null;
  };
  //========previous methods end

  //======map pan to center
  const handlePanTo = (newPos) => {
    markerInfoWindowStyleDisable();
    //=====here adding '0.002' for adjusting the map center according to view full info window
    if (mapRef.current) {
      mapRef.current.panTo({ lat: newPos.lat + 0.002, lng: newPos.lng });
    }
  };

  // handle map drag
  const handleMapDrag = () => {
    markerInfoWindowStyleDisable();
  };

  //========handle map center
  const handleMapCenter = () => {
    const initialLatLng = {
      lat: paths[0].lat,
      lng: paths[0].lng,
    };

    mapRef.current && mapRef.current.setCenter(initialLatLng);
  };

  const markerInfoWindowStyleDisable = () => {
    // custom overlay start
    overLayMarkerRef.current.div &&
      (overLayMarkerRef.current.div.style.transition = "none");
    overLayInfoWindowRef.current.div &&
      (overLayInfoWindowRef.current.div.style.transition = "none");
    // custom overlay end

    // markerIdentifier.current
    //   ? (markerIdentifier.current.style.transition = "none")
    //   : "";
    // markerContainerIdentifier.current
    //   ? (markerContainerIdentifier.current.style.transition = "none")
    //   : "";

    // infoWindowIdentifier.current
    //   ? (infoWindowIdentifier.current.style.transition = "none")
    //   : "";
  };

  //====check hit map active

  // create a function that return true or false value base on startDate and current date gap is three days
  const checkHitMapActive = () => {
    const currentDate = new Date();
    const startDateObj = new Date(startDate);
    const diff = currentDate.getTime() - startDateObj.getTime();
    const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
    console.log("diff-------", diffDays);
    return diffDays >= 3;
  };

  useEffect(() => {
    // set load map
    setIsMapLoading(true);
    loader
      .importLibrary("maps")
      .then(async () => {
        const { google } = window;
        mapRef.current = new google.maps.Map(mapContainerRef.current, {
          center: mapCenter,
          zoom: 12,
        });
        mapRef.current.addListener("drag", (e) => {
          handleMapDrag();
        });

        initMap();
        // setIsInfoShowing(true);
        setIsParkingMarkerActive(true);
      })
      .catch((err) => {
        console.log("map error", err);
      })
      .finally(() => setIsMapLoading(false));
  }, [paths]);

  useEffect(() => {
    if (lastVisitedIndex.current > 0) {
      //=====custom overlay info window
      const root = overLayInfoWindowRef.current.root;
      root && root.render(carInfoWindowContent);
    }
  }, [lastVisitedIndex.current]);

  useEffect(() => {
    if (!isMapLoading) {
      paths.map((path) => carPointMarkerSet(path));
      paths.map((path) => heatMapPointSet(path));
      parking.map((path) => parkingMarkerSet(path));
      speed.map((path) => speedMarkerSet(path));
      brake.map((path) => brakeMarkerSet(path));
      power.map((path) => powerMarkerSet(path));
    }
  }, [paths]);

  useEffect(() => {
    if (paths.length) {
      handleMapCenter();
    }
    if (isLoading) {
      clearPreviousState();
    }
  }, [isLoading]);

  useEffect(() => {
    console.log("infowindow---->", isInfoShowing);
    console.log("click----", overLayInfoWindowRef.current);
    if (paths.length && overLayInfoWindowRef.current) {
      if (isInfoShowing) {
        overLayInfoWindowRef.current.setMap(mapRef.current);
      } else {
        overLayInfoWindowRef.current.setMap(null);
      }
    }
  }, [isInfoShowing]);

  // parking show
  useEffect(() => {
    if (isParkingMarkerActive) {
      showParkingMarker();
    } else {
      hideParkingMarker();
    }
  }, [isParkingMarkerActive]);

  useEffect(() => {
    if (vehicleDetails) {
      const newArray = [];
      vehicleDetails.v_identifier = vehicleDetails.identifier;
      vehicleDetails.v_vrn = vehicleDetails.vrn;
      newArray.push(vehicleDetails);
      // selectedVehicles.current = newArray;
    }
  }, [vehicleDetails]);

  return (
    <div className="vehicle-route">
      <ShareVehicleRouteModal
        selectedVehicle={vehicleDetails}
        startDate={startDate}
        endDate={endDate}
        setShareVehicleRouteModalIsOpen={setShareVehicleRouteModalIsOpen}
        shareVehicleRouteModalIsOpen={shareVehicleRouteModalIsOpen}
        isBack={isBack}
        setIsBack={setIsBack}
        selectedDuration={selectedDuration}
        setSelectedDuration={setSelectedDuration}
      />
      {/* =======title========= */}
      {title ? (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0 mb-3 lg:mb-3 mt-5 lg:mt-0">
          <h1 className="text-xl md:text-[26px] text-primaryText font-bold">
            {title}
          </h1>
          <div className="h-9 sm:mr-6 lg:mr-0">
            {/* toggle button start */}
            {paths.length && !isLoading ? (
              <div className="flex items-center justify-between sm:justify-start space-x-4">
                <div
                  className={`w-32 h-8 md:h-9 flex items-center bg-white rounded-lg md:rounded-[10px] tmv-shadow relative z-10 text-sm font-normal ${
                    heatMapLayer ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
                  onClick={() => !heatMapLayer && handlePointLayer()}
                >
                  {/* Switch */}
                  <div className="w-32 h-8 md:h-9 flex justify-center items-center absolute top-0 left-0 px-3 text-tertiaryText">
                    <p className="w-full text-left text-xs md:text-base">
                      Vehicle
                    </p>
                    <p className="w-full text-center text-xs md:text-base">
                      Point
                    </p>
                  </div>
                  <div
                    className={
                      "bg-primary primary-shadow z-10 w-16 h-8 md:h-9 flex justify-center items-center rounded-lg md:rounded-[10px] shadow-md transform duration-300 ease-in-out" +
                      (!pointLayer ? null : toggleClass)
                    }
                  >
                    <p className="text-xs md:text-base">
                      {pointLayer ? "Point" : "Vehicle"}
                    </p>
                  </div>
                </div>

                {/* hea map switch  */}
                <div
                  className={`w-32 md:w-40 h-8 md:h-9 flex items-center bg-white rounded-lg md:rounded-[10px] tmv-shadow relative z-10 text-sm font-normal ${
                    checkHitMapActive()
                      ? "cursor-pointer"
                      : "cursor-not-allowed"
                  }`}
                  onClick={() => checkHitMapActive() && handleHeatMapLayer()}
                >
                  {/* Switch */}
                  <div className="w-32 md:w-40 h-8 md:h-9 flex justify-center items-center absolute top-0 left-0 px-2 text-tertiaryText">
                    <p className="w-full text-left text-xs md:text-base ml-2">
                      Route
                    </p>
                    <p className="w-full text-right text-xs md:text-base">
                      Heatmap
                    </p>
                  </div>
                  <div
                    className={
                      "bg-primary primary-shadow z-10 w-16 md:w-20 h-8 md:h-9 flex justify-center items-center rounded-lg md:rounded-[10px] shadow-md transform duration-300 ease-in-out" +
                      (!heatMapLayer
                        ? null
                        : "transform translate-x-16 md:translate-x-20")
                    }
                  >
                    <p className="text-xs md:text-base">
                      {heatMapLayer ? "Heatmap" : "Route"}
                    </p>
                  </div>
                </div>
                {/* === toggle button end === */}
              </div>
            ) : (
              ""
            )}
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
        <div ref={componentRef} className="min-h-400px">
          {/* ===== map ==== */}
          <div className="relative bg-white rounded-xl p-2">
            <ToastContainer
              style={{
                position: "absolute",
                top: 10,
                left: 0,
                right: 0,
                margin: "0 auto",
              }}
            />

            {/* {!isMapLoading ? ( */}
            <div className="vehicle-route-map min-h-[400px]">
              {/* =========main map========= */}
              <div ref={mapContainerRef} style={containerStyle}></div>
              {/* marker button */}
              {paths.length ? (
                <>
                  {!heatMapLayer ? (
                    <div className="bg-white w-[45px] flex flex-col items-center py-6 rounded-lg space-y-6 absolute left-4 top-28">
                      <CustomToolTip
                        id={`car-parking-1`}
                        title={`View Parking Event`}
                        containerClass="car-marker default-tooltip  tooltipStyleChange"
                      >
                        <button
                          onClick={handleIsParkingMarkerActive}
                          className={`fill-[#8D96A1] hover:fill-[#F36B24] ${
                            isParkingMarkerActive && "fill-[#F36B24]"
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
                          onClick={handleIsSpeedMarkerActive}
                          className={`fill-[#8D96A1] hover:fill-[#F36B24] ${
                            isSpeedMarkerActive && "fill-[#F36B24]"
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
                          onClick={handleIsBrakeMarkerActive}
                          className={`fill-[#8D96A1] hover:fill-[#F36B24] ${
                            isBrakeMarkerActive && "fill-[#F36B24]"
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
                          onClick={handleIsPowerMarkerActive}
                          className={`fill-[#8D96A1] hover:fill-[#F36B24] ${
                            isPowerMarkerActive && "fill-[#F36B24]"
                          }`}
                        >
                          <PowerSVG />
                        </button>
                      </CustomToolTip>
                    </div>
                  ) : (
                    ""
                  )}
                </>
              ) : (
                ""
              )}

              {/* map options */}
              <div className="flex items-center absolute bottom-8 right-16 mr-2 space-x-4 xs:space-x-6">
                {/* <button className="flex items-center space-x-4 bg-secondary rounded-lg px-3 py-2 tmv-shadow">
                  <WatchmanSVG />
                  <p className="text-xs hidden md:block lg:hidden xl:block">
                    Virtual Watchman
                  </p>
                </button> */}

                {vehicleDetails && (
                  <button
                    onClick={handleShareVehicleRoute}
                    className="flex items-center space-x-4 bg-secondary rounded-lg px-3 py-2 tmv-shadow"
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
              {paths.length ? (
                <>
                  {!heatMapLayer ? (
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
                  ) : (
                    ""
                  )}
                </>
              ) : (
                ""
              )}
            </div>
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
          <div className="relative">
            {heatMapLayer ? (
              <div className="z-10 absolute top-0 right-0 h-full w-full cursor-not-allowed"></div>
            ) : (
              ""
            )}
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
              <div className="h-8 w-full absolute bottom-9 left-0"></div>
              <div className="h-[120px] w-[84px] absolute bottom-9 left-0"></div>
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
                disabled={!paths.length}
                min={0}
                max={paths.length - 1}
                onThumbDragEnd={handleSliderDrag}
                value={markerDraggervalue}
                onInput={setMarkerDraggervalue}
                thumbsDisabled={[true, false]}
                rangeSlideDisabled={true}
              />
            </div>
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
      {paths.length ? (
        <>
          {!heatMapLayer ? (
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
          ) : (
            ""
          )}
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default VehicleRouteMap;
