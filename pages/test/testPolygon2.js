import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";
import { LoadScript, GoogleMap, Polygon } from "@react-google-maps/api";

const containerStyle = {
    width: "100%",
    height: "400px",
};

const TestPolygon2 = () => {
    // Store Polygon paths in state
    const [paths, setPaths] = useState([
        [
            { lat: 52.52549080781086, lng: 13.398118538856465 },
            { lat: 52.48578559055679, lng: 13.36653284549709 },
            { lat: 52.48871246221608, lng: 13.44618372440334 },
        ],
        [
            { lat: 52.530731, lng: 13.394587 },
            { lat: 52.530431, lng: 13.394187 },
            { lat: 52.530131, lng: 13.393787 },
        ],
    ]);

    // Store the index of the polygon currently being edited (or -1 if none)
    const [activePolygonIndex, setActivePolygonIndex] = useState(-1);

    // Define refs for Polygon instances and listeners
    const polygonRefs = useRef([]);

    // Call setPaths with new edited path
    function onEdit(index) {
        return () => {
            setActivePolygonIndex(index); // Set the active polygon index
            if (polygonRefs.current[index]) {
                const nextPath = polygonRefs.current[index]
                    .getPath()
                    .getArray()
                    .map((latLng) => {
                        return { lat: latLng.lat(), lng: latLng.lng() };
                    });
                setPaths((prevPaths) => {
                    const updatedPaths = [...prevPaths];
                    updatedPaths[index] = nextPath;
                    return updatedPaths;
                });
            }
        };
    }

    // Bind refs to current Polygon instances and listeners
    function onLoad(polygon, index) {
        polygonRefs.current[index] = polygon;
    }

    // Clean up refs
    function onUnmount(index) {
        polygonRefs.current[index] = null;
    }

    console.log("The paths state is", paths);

    return (
        <div className="App">
            <LoadScript
                id="script-loader"
                googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                language="en"
                region="us"
            >
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={{ lat: 52.52047739093263, lng: 13.36653284549709 }}
                    zoom={12}
                    version="weekly"
                >
                    {paths.map((path, index) => (
                        <Polygon
                            key={index}
                            // Make the Polygon editable / draggable based on activePolygonIndex
                            editable={activePolygonIndex === index}
                            draggable={activePolygonIndex === index}
                            path={path}
                            // Event used when manipulating and adding points
                            onMouseUp={onEdit(index)}
                            // Event used when dragging the whole Polygon
                            onDragEnd={onEdit(index)}
                            onLoad={(polygon) => onLoad(polygon, index)}
                            onUnmount={() => onUnmount(index)}
                        />
                    ))}
                </GoogleMap>
            </LoadScript>
        </div>
    );
};

export default TestPolygon2;
