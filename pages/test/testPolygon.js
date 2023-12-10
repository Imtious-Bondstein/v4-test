import React, { useState, useRef } from 'react';
import { GoogleMap, LoadScript, DrawingManager, Polygon } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '400px',
};

const Map = () => {
    const mapRef = useRef(null);
    const mapCenterRef = useRef({
        lat: 37.7749, // Initial latitude
        lng: -122.4194, // Initial longitude
    });
    const [mapCenter, setMapCenter] = useState({
        lat: 37.7749, // Initial latitude
        lng: -122.4194, // Initial longitude
    });
    const polygonRefs = useRef([]);
    const [polygonPaths, setPolygonPaths] = useState([]);
    const [activePolygonIndex, setActivePolygonIndex] = useState(-1);


    const handleOnLoad = map => {
        mapRef.current = (map);
    };

    const handlePolygonComplete = (polygon) => {
        const paths = polygon.getPath().getArray();
        const coordinates = paths.map((path) => ({
            lat: path.lat(),
            lng: path.lng(),
        }));
        setPolygonPaths([...polygonPaths, { name: '', coordinates }]);

        // setPolygonPaths([...polygonPaths, coordinates]);
        setActivePolygonIndex(polygonPaths.length); // Set the new polygon as active
        polygon.setMap(null); // Clear the drawn polygon
        // Center the map according to the polygon
        const polygonCenter = getPolygonCenter(coordinates);
        setMapCenter(polygonCenter);
    };

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



    const handlePolygonClick = (index) => {
        setActivePolygonIndex(index);
    };

    const handlePolygonChanged = (index, paths) => {
        const updatedPaths = paths.map((path) => ({
            lat: path.lat(),
            lng: path.lng(),
        }));

        const updatedPolygonPaths = [...polygonPaths];
        updatedPolygonPaths[index].coordinates = updatedPaths;

        setPolygonPaths(updatedPolygonPaths);
    };
    const handleInputChange = (event, index) => {
        const value = event.target.value;

        const updatedPolygonPaths = [...polygonPaths];
        updatedPolygonPaths[index].name = value;

        setPolygonPaths(updatedPolygonPaths);
    };

    const handleSave = () => {
        console.log(polygonPaths);
    }

    const handleCreateSquare = () => {
        const size = 0.01; // Adjust the size as needed
        const squareCoordinates = [
            { lat: mapCenterRef.current.lat + size, lng: mapCenterRef.current.lng - size },
            { lat: mapCenterRef.current.lat + size, lng: mapCenterRef.current.lng + size },
            { lat: mapCenterRef.current.lat - size, lng: mapCenterRef.current.lng + size },
            { lat: mapCenterRef.current.lat - size, lng: mapCenterRef.current.lng - size },
        ];

        // setShouldCreateSquare(true);
        setPolygonPaths([...polygonPaths, { name: 'Square', coordinates: squareCoordinates }]);
        setActivePolygonIndex(polygonPaths.length); // Set the new polygon as active
    };

    const handleBoundsChanged = () => {
        if (mapRef.current) {
            const newCenter = mapRef.current.getCenter();
            mapCenterRef.current = { lat: newCenter.lat(), lng: newCenter.lng() };
        }
    }

    function onEdit(index) {
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
    function onLoad(polygon, index) {
        polygonRefs.current[index] = polygon;
    }

    // Clean up refs
    function onUnmount(index) {
        polygonRefs.current[index] = null;
    }

    console.log("The Polygon paths state is", polygonPaths);

    return (
        <>
            <GoogleMap
                onLoad={handleOnLoad}
                mapContainerStyle={containerStyle}
                onBoundsChanged={handleBoundsChanged}
                center={mapCenter}
                zoom={12}
                onClick={() => setActivePolygonIndex(-1)} // Deselect polygons when clicking on the map
            >
                <DrawingManager
                    onPolygonComplete={handlePolygonComplete}
                    options={{
                        drawingControl: true,
                        drawingControlOptions: {
                            position: window.google.maps.ControlPosition.TOP_CENTER,
                        },
                        polygonOptions: {
                            fillColor: '#FF0000',
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
                            strokeColor: activePolygonIndex === index ? '#FF0000' : '#000000',
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                            fillColor: activePolygonIndex === index ? '#FF0000' : '#000000',
                            fillOpacity: 0.35,
                            clickable: true,
                            draggable: activePolygonIndex === index,
                            editable: activePolygonIndex === index,
                        }}
                        onClick={() => handlePolygonClick(index)}
                        onMouseUp={onEdit(index)}
                        // Event used when dragging the whole Polygon
                        onDragEnd={onEdit(index)}
                        onLoad={(polygon) => onLoad(polygon, index)}
                        onUnmount={() => onUnmount(index)}
                    />
                ))}
            </GoogleMap>
            <div className='w-48 space-y-3'>
                {polygonPaths.map((polygon, index) => (
                    <input
                        key={index}
                        onClick={() => handlePolygonClick(index)}
                        className='border block'
                        type="text"
                        value={polygon.name}
                        onChange={(event) => handleInputChange(event, index)}
                        placeholder="Enter polygon name"
                    />
                ))}
            </div>
            <button onClick={handleCreateSquare}>Create Square|</button>
            <button onClick={handleSave}>Save</button>
        </>
    );
};

const App = () => {
    return (
        <div>
            <h1>Draw Polygons</h1>
            <LoadScript googleMapsApiKey="AIzaSyC4s5fkJjVPRUjA-8Zr_q5hGBwT4og4y60" libraries={['drawing']}>
                <Map />
            </LoadScript>
        </div>
    );
};

export default App;
