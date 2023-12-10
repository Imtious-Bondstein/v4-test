"use client";
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

// re charts
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import VehicleRouteVehicleInfoWindow from "../infoWindows/VehicleRouteVehicleInfoWindow";

const yFormatter = (value) => `${value} km`;

const containerStyle = {
  width: "100%",
  minHeight: "440px",
  height: "60vh",
};

const center = {
  lat: 23.808219,
  lng: 90.406026,
};

const paths = [
  { lat: 23.800348, lng: 90.401833, speed: 50, time: "1AM" },
  { lat: 23.799789, lng: 90.401811, speed: 152, time: "2AM" },
  { lat: 23.79921, lng: 90.401726, speed: 123, time: "3AM" },
  { lat: 23.798955, lng: 90.403131, speed: 87, time: "4AM" },
  { lat: 23.798719, lng: 90.404794, speed: 168, time: "5AM" },
  { lat: 23.798356, lng: 90.405727, speed: 79, time: "6AM" },
  { lat: 23.798069, lng: 90.406325, speed: 23, time: "7AM" },
  { lat: 23.798237, lng: 90.406415, speed: 116, time: "8AM" },
  { lat: 23.798422, lng: 90.406501, speed: 93, time: "11AM" },
  { lat: 23.799131, lng: 90.406854, speed: 192, time: "1PM" },
  { lat: 23.799461, lng: 90.407006, speed: 36, time: "2PM" },
  { lat: 23.799696, lng: 90.407113, speed: 85, time: "3PM" },
  { lat: 23.800027, lng: 90.407228, speed: 56, time: "4PM" },
  { lat: 23.800345, lng: 90.407352, speed: 198, time: "1AM" },
  { lat: 23.800438, lng: 90.407479, speed: 150, time: "1AM" },
  { lat: 23.800459, lng: 90.407738, speed: 70, time: "1AM" },
  { lat: 23.800461, lng: 90.407997, speed: 89, time: "1AM" },
  { lat: 23.800699, lng: 90.408005, speed: 23, time: "1AM" },
  { lat: 23.800987, lng: 90.408012, speed: 45, time: "1AM" },
  { lat: 23.80118, lng: 90.40802, speed: 78, time: "1AM" },
  { lat: 23.801466, lng: 90.408025, speed: 36, time: "1AM" },
  { lat: 23.801466, lng: 90.408035, speed: 10, time: "1AM" },
  { lat: 23.801845, lng: 90.40804, speed: 7, time: "1AM" },
  { lat: 23.801981, lng: 90.408056, speed: 9, time: "1AM" },
  { lat: 23.801949, lng: 90.409453, speed: 0, time: "1AM" },
  { lat: 23.80204, lng: 90.410703, speed: 20, time: "1AM" },
  { lat: 23.802175, lng: 90.411412, speed: 26, time: "1AM" },
  { lat: 23.80264, lng: 90.41126, speed: 89, time: "1AM" },
  { lat: 23.803338, lng: 90.41101, speed: 65, time: "1AM" },
  { lat: 23.803808, lng: 90.410852, speed: 23, time: "1AM" },
  { lat: 23.804004, lng: 90.411363, speed: 89, time: "1AM" },
  { lat: 23.804074, lng: 90.411626, speed: 153, time: "1AM" },
  { lat: 23.804086, lng: 90.412404, speed: 90, time: "1AM" },
  { lat: 23.804049, lng: 90.413525, speed: 99, time: "1AM" },
  { lat: 23.804049, lng: 90.413525, speed: 80, time: "1AM" },
  { lat: 23.805363, lng: 90.413897, speed: 78, time: "1AM" },
  { lat: 23.805358, lng: 90.415528, speed: 76, time: "1AM" },
  { lat: 23.806257, lng: 90.415372, speed: 69, time: "1AM" },
  { lat: 23.806588, lng: 90.415679, speed: 50, time: "1AM" },
  { lat: 23.806708, lng: 90.415536, speed: 46, time: "1AM" },
  { lat: 23.806997, lng: 90.415424, speed: 20, time: "1AM" },
  { lat: 23.807192, lng: 90.415342, speed: 10, time: "1AM" },
  { lat: 23.807499, lng: 90.415107, speed: 23, time: "1AM" },
  { lat: 23.807657, lng: 90.414942, speed: 56, time: "1AM" },
  { lat: 23.808066, lng: 90.414411, speed: 69, time: "1AM" },
  { lat: 23.808805, lng: 90.413592, speed: 80, time: "1AM" },
  { lat: 23.809332, lng: 90.413136, speed: 120, time: "1AM" },
  { lat: 23.809786, lng: 90.413088, speed: 100, time: "1AM" },
  { lat: 23.810773, lng: 90.413059, speed: 99, time: "1AM" },
  { lat: 23.812375, lng: 90.412954, speed: 66, time: "1AM" },
  { lat: 23.813744, lng: 90.412884, speed: 50, time: "1AM" },
  { lat: 23.814743, lng: 90.412839, speed: 49, time: "1AM" },
  { lat: 23.815215, lng: 90.412828, speed: 30, time: "1AM" },
  { lat: 23.815221, lng: 90.41293, speed: 20, time: "1AM" },
];

const parkingMarker = [
  { lat: 23.798719, lng: 90.404794 },
  { lat: 23.800438, lng: 90.407479 },
];

const speedMarker = [
  { lat: 23.80204, lng: 90.410703 },
  { lat: 23.804049, lng: 90.413525 },
];

const brakeMarker = [
  { lat: 23.808805, lng: 90.413592 },
  { lat: 23.813744, lng: 90.412884 },
];

const powerMarker = [{ lat: 23.799789, lng: 90.401811 }];

const VehicleRouteMap = ({ title, selectedVehicle, selectedVehiclePaths }) => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // console.log("selectedVehiclePaths 🙌", selectedVehiclePaths);
  // console.log("vehicle route map", selectedVehicle);

  const markerRef = useRef(null);
  const markerObjectRef = useRef(null);
  const [visitedPath, setVisitedPath] = useState([]);
  const [unvisitedPath, setUnvisitedPath] = useState(paths);
  const [carPaths, setCarPaths] = useState([]);

  const [isParkingMarkerActive, setIsParkingMarkerActive] = useState(false);
  const [isSpeedMarkerActive, setIsSpeedMarkerActive] = useState(false);
  const [isBrakeMarkerActive, setIsBrakeMarkerActive] = useState(false);
  const [isPowerMarkerActive, setIsPowerMarkerActive] = useState(false);

  useEffect(() => {
    console.log(selectedVehiclePaths);
    selectedVehiclePaths.paths ? setCarPaths(selectedVehiclePaths.paths) : "";
  }, [selectedVehiclePaths]);
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

  const [centerPoint, setCenterPoint] = useState({
    lat: parseFloat(paths[0].lat),
    lng: parseFloat(paths[0].lng),
  });

  const markerIndentifier = useRef(null);

  // const mapZoom = useRef(14)
  const [mapZoom, setMapZoom] = useState(14);

  const markerAngle = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    // googleMapsApiKey: "AIzaSyDGCiFRpeVsZEiztcpjt-h_dlEg5tsUZLQ",
    googleMapsApiKey: "AIzaSyC4s5fkJjVPRUjA-8Zr_q5hGBwT4og4y60",
  });

  const [isInfoShowing, setIsInfoShowing] = useState(false);

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
        markerIndentifier.current = markerContainerStyle;

        // markerContainerStyle.style.transform = `rotate(${angle - 90}deg)`;
        // console.log('last visited-----', lastVisitedIndex.current);
        // if (lastVisitedIndex.current % 10 === 9) {
        //     markerContainerStyle.style.transition = 'none'
        // } else {
        //     markerContainerStyle.style.transition = 'all 1s ease'
        // }
        // console.log(markerContainerStyle)
        markerContainerStyle.style.transition = "all 1s ease";

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
    markerIndentifier.current
      ? (markerIndentifier.current.style.transition = "none")
      : "";
    if (lastVisitedIndex.current === paths.length - 2) {
      lastVisitedIndex.current = 0;
      setCenterPoint({ lat: paths[0].lat, lng: paths[0].lng });
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
    lastVisitedIndex.current = data.activeTooltipIndex;
    handleMapCenter();
    markerRef.current.index = data.activeTooltipIndex;
    moveMarkerAlongPath();
    // console.log('Clicked on area', data.activeTooltipIndex);
  };

  const handleMapCenter = () => {
    markerIndentifier.current
      ? (markerIndentifier.current.style.transition = "none")
      : "";
    setCenterPoint({
      lat: paths[lastVisitedIndex.current].lat,
      lng: paths[lastVisitedIndex.current].lng,
    });
  };

  const handleMapDrag = () => {
    console.log("draging......");
    markerIndentifier.current
      ? (markerIndentifier.current.style.transition = "none")
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

  useEffect(() => {
    if (
      lastVisitedIndex.current % 10 === 9 ||
      lastVisitedIndex.current === paths.length - 2
    ) {
      handleMapCenter();
    }
    console.log(
      "center calling...........",
      lastVisitedIndex.current,
      " ",
      paths.length
    );
  }, [lastVisitedIndex.current]);

  // }, [lastVisitedIndex.current % 10 === 9 || lastVisitedIndex.current === path.length - 1])

  return (
    <div>
      {title ? (
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-[26px] text-primaryText font-bold">{title}</h1>
          <div className="mr-4">
            {/* toggle button start */}
            <div
              className="w-32 h-9 flex items-center bg-white rounded-[10px] cursor-pointer tmv-shadow relative z-0 text-sm font-normal"
              onClick={handlePointLayer}
            >
              {/* Switch */}
              <div className="w-32 h-9 flex justify-center items-center absolute top-0 left-0 px-3   text-tertiaryText">
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
            {/* toggle button end */}
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="relative bg-white p-2 rounded-xl">
        {isLoaded ? (
          <div>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={centerPoint}
              zoom={mapZoom}
              onDrag={handleMapDrag}
              ref={componentRef}
            >
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
                    className={isParkingMarkerActive ? "block" : "hidden"}
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

              {/* vehicle point */}
              {pointLayer &&
                paths.map((marker, index) =>
                  showVehiclePointerMarker(marker, index)
                )}

              {/* start flag */}
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
              {/* end flag */}
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
                  onClick={() => setIsSpeedMarkerActive(!isSpeedMarkerActive)}
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
                  onClick={() => setIsBrakeMarkerActive(!isBrakeMarkerActive)}
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
                  onClick={() => setIsPowerMarkerActive(!isPowerMarkerActive)}
                  className={`fill-[#8D96A1] hover:fill-[#F36B24] ${isPowerMarkerActive && "fill-[#F36B24]"
                    }`}
                >
                  <PowerSVG />
                </button>
              </CustomToolTip>
            </div>

            {/* map options */}
            <div className="flex items-center absolute bottom-8 right-16 space-x-6">
              <button className="flex items-center space-x-4 bg-secondary rounded-lg px-3 py-2 tmv-shadow">
                <WatchmanSVG />
                <p className="text-xs">Virtual Watchman</p>
              </button>
              <button className="flex items-center space-x-4 bg-secondary rounded-lg px-3 py-2 tmv-shadow">
                <ShareSVG />
                <p className="text-xs">Share</p>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center space-x-4 bg-secondary rounded-lg px-3 py-2 tmv-shadow"
              >
                <PrinterSVG />
                <p className="text-xs">Print</p>
              </button>
            </div>

            {/* speed option */}
            <div className="bg-white w-52 flex items-center justify-evenly py-2 rounded-lg absolute left-4 bottom-8">
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
      <div className="bg-white p-4 rounded-xl mt-5">
        <div className="flex justify-between items-center">
          <h5 className="text-base font-bold">Movement</h5>
          {/* <button onClick={() => setMapZoom(15)}>+</button> */}
          <select
            defaultValue={"1000"}
            onChange={(e) => handleMarkerMovementSpeed(e.target.value)}
            className={`p-2 w-28 rounded-lg text-tertiaryText tmv-shadow marker_speed_control `}
          >
            <option value="3000">Slow</option>
            <option value="1000">Normal</option>
            <option value="500">Fast</option>
          </select>
        </div>
        <div className="mt-4">
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart
              data={paths}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
              onClick={handleChartClick}
            >
              <defs>
                <linearGradient id="colorFillTime" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f5eabb" stopOpacity={1} />
                  <stop offset="95%" stopColor="#f5eabb" stopOpacity={0} />
                </linearGradient>
                <linearGradient
                  id="colorStrokeTime"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="10%" stopColor="#F36B24" stopOpacity={1} />
                  <stop offset="90%" stopColor="#FDD10E" stopOpacity={1} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3"
                horizontal="true"
                vertical=""
              />
              <XAxis dataKey="time" />
              <YAxis tickFormatter={yFormatter} />
              <Tooltip cursor={{ stroke: "#F36B24", strokeWidth: 2 }} />
              <Area
                type="linear"
                dataKey="speed"
                stroke="url(#colorStrokeTime)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ stroke: "white", strokeWidth: 2, r: 6 }}
                fill="url(#colorFillTime)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center space-x-7">
          <button
            onClick={handleMarkerMovement}
            className="w-8 h-8 rounded-lg flex justify-center items-center bg-primary"
          >
            {!isMarkerPaused ? <PauseSVG /> : <PlaySVG />}
          </button>
          <RangeSlider
            id="range-slider-marker"
            className="single-thumb"
            // defaultValue={[0, 53]}
            min={0}
            max={53}
            onThumbDragEnd={handleSliderDrag}
            value={markerDraggervalue}
            onInput={setMarkerDraggervalue}
            thumbsDisabled={[true, false]}
            rangeSlideDisabled={true}
          />
        </div>
      </div>
    </div>
  );
};

export default VehicleRouteMap;
