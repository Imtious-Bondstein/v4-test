import React, { useEffect, useRef, useState } from "react";

import CrossSVG2 from "@/svg/CrossSVG2";
import CrossSVG3 from "@/svg/CrossSVG3";
import PlusSVG from "../SVG/PlusSVG";
import {
  DrawingManager,
  GoogleMap,
  LoadScript,
  Polygon,
  Rectangle,
  RectangleF,
  useJsApiLoader,
} from "@react-google-maps/api";
import { set } from "date-fns";
import Search from "@/svg/SearchSVG";

const GeoFenceMap = ({
  isLoading,
  isShareMap,
  isUpdating,
  height,
  polygonPaths,
  setPolygonPaths,
  selectedVehicles,
  setSelectedVehicles,
  xlScreen,
}) => {
  // MAP DATA
  const containerStyle = {
    width: "100%",
    height: height,
  };

  const [clicked, setClicked] = useState(false);

  const mapRef = useRef(null);
  const mapCenterRef = useRef({
    lat: 23.8103,
    lng: 90.4125,
  });
  const [mapCenter, setMapCenter] = useState({
    lat: 23.8103,
    lng: 90.4125,
  });
  const [mapZoom, setMapZoom] = useState(12);

  const polygonRefs = useRef([]);
  const [activePolygonIndex, setActivePolygonIndex] = useState(-1);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    libraries: ["drawing", "visualization"],
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const handleOnLoad = (map) => {
    mapRef.current = map;
  };

  const handleBoundsChanged = () => {
    if (mapRef.current) {
      const newCenter = mapRef.current.getCenter();
      mapCenterRef.current = { lat: newCenter.lat(), lng: newCenter.lng() };
    }
  };

  // create initial polygon
  const handleCreateSquare = () => {
    const size = 0.02; // Adjust the size as needed
    const squareCoordinates = [
      {
        lat: mapCenterRef.current.lat + size,
        lng: mapCenterRef.current.lng - size,
      },
      {
        lat: mapCenterRef.current.lat + size,
        lng: mapCenterRef.current.lng + size,
      },
      {
        lat: mapCenterRef.current.lat - size,
        lng: mapCenterRef.current.lng + size,
      },
      {
        lat: mapCenterRef.current.lat - size,
        lng: mapCenterRef.current.lng - size,
      },
    ];

    // setShouldCreateSquare(true);
    setPolygonPaths([
      ...polygonPaths,
      { name: "", coordinates: squareCoordinates },
    ]);
    setActivePolygonIndex(polygonPaths.length); // Set the new polygon as active
  };

  // polygon center point calculate
  const getPolygonCenter = (coordinates) => {
    let latSum = 0;
    let lngSum = 0;

    for (const { lat, lng } of coordinates) {
      latSum += lat;
      lngSum += lng;
    }

    return {
      lat: latSum / coordinates.length,
      lng: lngSum / coordinates.length,
    };
  };

  // drawing option
  const drawingControlOptions = {
    // 'rectangle'
    drawingModes: ["polygon"], // Specify the desired drawing modes
    position: window.google?.maps?.ControlPosition?.RIGHT_TOP, // Position of the navigation bar
  };

  const handlePolygonComplete = (polygon) => {
    const paths = polygon.getPath().getArray();
    console.log("polygon complete", paths);
    const coordinates = paths.map((path) => ({
      lat: path.lat(),
      lng: path.lng(),
    }));
    setPolygonPaths([...polygonPaths, { name: "", coordinates }]);

    // setPolygonPaths([...polygonPaths, coordinates]);
    setActivePolygonIndex(polygonPaths.length); // Set the new polygon as active
    polygon.setMap(null); // Clear the drawn polygon

    // Center the map according to the polygon
    const polygonCenter = getPolygonCenter(coordinates);
    setMapCenter(polygonCenter);
  };

  //===========polygon function start start==============
  const handlePolygonClick = (index) => {
    setActivePolygonIndex(index);
  };

  function onPolygonEdit(index) {
    return () => {
      if (polygonRefs.current[index]) {
        const nextPolygonPath = polygonRefs.current[index]
          .getPath()
          .getArray()
          .map((latLng) => {
            return { lat: latLng.lat(), lng: latLng.lng() };
          });
        setPolygonPaths((prevPolygonPaths) => {
          const updatedPolygonPaths = [...prevPolygonPaths];
          updatedPolygonPaths[index].coordinates = nextPolygonPath;
          return updatedPolygonPaths;
        });
      }
    };
  }

  // Bind refs to current Polygon instances and listeners
  function onPolygonLoad(polygon, index) {
    polygonRefs.current[index] = polygon;
  }

  // Clean up refs
  function onPolygonUnmount(index) {
    polygonRefs.current[index] = null;
  }

  //===========polygon function start start==============

  const handleInputChange = (event, index) => {
    const value = event.target.value;

    const updatedPolygonPaths = [...polygonPaths];
    updatedPolygonPaths[index].name = value;

    setPolygonPaths(updatedPolygonPaths);
  };

  const removeArea = (index) => {
    // remove polygon
    const updatedPolygonPaths = [...polygonPaths];
    updatedPolygonPaths.splice(index, 1);
    setPolygonPaths(updatedPolygonPaths);
  };

  // CHECK FOR OUTSIDE CLICK FOR SELECTOR
  const handleOutsideSelectorClick = () => {
    setClicked(false);
  };

  // set map center according to polygon first area
  useEffect(() => {
    console.log("update fence", polygonPaths);
    if (isUpdating && polygonPaths.length) {
      if (polygonPaths[0].coordinates) {
        const newCenter = getPolygonCenter(polygonPaths[0].coordinates);
        setMapCenter(newCenter);
      }
    }
  }, [polygonPaths]);

  return (
    <>
      <div className="relative w-full bg-green-600 xl:hidden">
        <div
          onClick={() => setClicked(!clicked)}
          className={`cursor-pointer ${clicked === true
              ? "right-[293px] xs:right-[343px] mr-[7px] h-max-[65px] top-28 z-[3006]"
              : "right-0 h-[40px] top-40 z-[3005]"
            } search-toggle-button ease-in-out duration-700 fixed flex justify-center items-center gap-1 xs:gap-2  xl:z-0 -mt-2.5 p-2 text-white`}
        >
          Areas
        </div>
      </div>

      {/* ADD AREA, GEOFENCE MAP, & SELECTOR */}
      <div className="flex items-center xl:space-x-4 pt-5 md:pt-8">
        {/* ADD AREA */}
        <div
          className={`${clicked === true ? "right-0 z-[3005]" : "-right-96 z-[3004]"
            } ${xlScreen === true
              ? "xl:z-40 xl:right-10 xl:shadow-none xl:flex-none xl:block xl:static xl:ml-4"
              : "xl:z-40 xl:right-10 xl:shadow-none xl:static"
            } flex-none fixed top-16 xl:top-40 ease-in-out duration-700 rounded-3xl lg:mt-0`}
        >
          <div className="bg-white p-3 h-[77vh] w-[300px] xs:w-[350px] rounded-[20px] overflow-y-auto">
            <div className="">
              {polygonPaths.map((polygon, index) => (
                <div key={index} className="relative mb-3">
                  <input
                    onClick={() => handlePolygonClick(index)}
                    value={polygon.name}
                    onChange={(event) => handleInputChange(event, index)}
                    className={`w-full px-5 h-[56px] tmv-shadow rounded-xl outline-quaternary ${index === activePolygonIndex
                        ? "border-2 border-quaternary"
                        : ""
                      }`}
                    type="text"
                    placeholder="Enter Area Name"
                  />
                  <div
                    onClick={() => removeArea(index)}
                    className="absolute top-5 right-3 cursor-pointer"
                  >
                    <CrossSVG3 />
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={handleCreateSquare}
              className="flex justify-center items-center space-x-3 w-full bg-primary h-[56px] rounded-xl mt-3"
            >
              <PlusSVG />
              <p className="primaryText font-bold text-base">Add More Area</p>
            </button>
          </div>
        </div>
        {/* MAP */}
        <div className=" grow bg-white rounded-lg ">
          {isLoading ? (
            <div className="p-2">
              <div className=" skeleton rounded-lg"></div>
            </div>
          ) : (
            <div>
              <div
                className={`relative bg-white rounded-xl ${!isShareMap ? "p-2" : ""
                  }`}
              >
                {isLoaded ? (
                  <div className="">
                    <GoogleMap
                      onLoad={handleOnLoad}
                      mapContainerStyle={containerStyle}
                      onBoundsChanged={handleBoundsChanged}
                      center={mapCenter}
                      zoom={mapZoom}
                      onClick={() => setActivePolygonIndex(-1)}
                    >
                      <DrawingManager
                        onPolygonComplete={handlePolygonComplete}
                        options={{
                          drawingControl: true,
                          drawingControlOptions: drawingControlOptions,
                          polygonOptions: {
                            fillColor: "#FF0000",
                            fillOpacity: 0.4,
                            strokeWeight: 2,
                            clickable: false,
                            editable: true,
                            zIndex: 1,
                          },
                        }}
                      />
                      {polygonPaths.map((paths, index) => (
                        <Polygon
                          key={index}
                          paths={paths.coordinates}
                          options={{
                            strokeColor:
                              activePolygonIndex === index
                                ? "#FF0000"
                                : "#000000",
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                            fillColor:
                              activePolygonIndex === index
                                ? "#FF0000"
                                : "#000000",
                            fillOpacity: 0.35,
                            clickable: true,
                            draggable: activePolygonIndex === index,
                            editable: activePolygonIndex === index,
                          }}
                          onClick={() => handlePolygonClick(index)}
                          onMouseUp={onPolygonEdit(index)}
                          onDragEnd={onPolygonEdit(index)}
                          onLoad={(polygon) => onPolygonLoad(polygon, index)}
                          onUnmount={() => onPolygonUnmount(index)}
                        />
                      ))}
                    </GoogleMap>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[620px]">
                    <div className="w-16 h-16 border-4 border-dashed rounded-full border-primary animate-spin"></div>
                  </div>
                )}

                {/* map options */}
                <div className="flex items-center absolute bottom-8 right-16 space-x-4 xs:space-x-6 mr-2">
                  {/* {!isShareMap && (
                    <button
                      
                      className="flex items-center space-x-4 bg-secondary rounded-lg px-3 py-2 tmv-shadow"
                    >
                      Save
                    </button>
                  )}

                  <button
                    className="flex items-center space-x-4 bg-secondary rounded-lg px-3 py-2 tmv-shadow"
                  >
                    Reset
                  </button> */}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* =========== Blur filter =========== */}
      {!clicked ? (
        ""
      ) : (
        <div
          onClick={() => handleOutsideSelectorClick()}
          className="xl:hidden blur-filter"
        ></div>
      )}
    </>
  );
};

export default GeoFenceMap;
