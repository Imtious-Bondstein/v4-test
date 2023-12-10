import React, { useRef, useState } from "react";

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

const CreateGeoFenceMap = ({
  isLoading,
  isShareMap,
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
    libraries: ["drawing"],
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

  return (
    <>
      {/* ADD AREA, GEOFENCE MAP, & SELECTOR */}
      <div className="flex items-center space-x-4 pt-8">
        {/* ADD AREA */}
        <div className=" bg-white p-3 h-[77vh] w-[350px] rounded-[20px]">
          <div className="">
            {polygonPaths.map((polygon, index) => (
              <div key={index} className="relative mb-3">
                <input
                  onClick={() => handlePolygonClick(index)}
                  value={polygon.name}
                  onChange={(event) => handleInputChange(event, index)}
                  className="w-full px-5 h-[56px] tmv-shadow rounded-xl outline-quaternary"
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
        {/* MAP */}
        <div className=" grow bg-white rounded-lg ">
          {isLoading ? (
            <div className="p-2">
              <div className=" skeleton rounded-lg"></div>
            </div>
          ) : (
            <div>
              <div
                className={`relative bg-white rounded-xl ${
                  !isShareMap ? "p-2" : ""
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
    </>
  );
};

export default CreateGeoFenceMap;
