import React, { useState, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Polyline } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '400px'
};

const center = {
    lat: 23.8221934,
    lng: 90.4219536,
};
let path = [
    { lat: 23.825609, lng: 90.423134 },
    { lat: 23.827258, lng: 90.432232 },
    { lat: 23.828828, lng: 90.439699 },
    { lat: 23.829613, lng: 90.445021 },
    { lat: 23.832204, lng: 90.456007 },
];



const TestMap = () => {
    const markerRef = useRef(null);
    const [visitedPath, setVisitedPath] = useState([]);
    const [unvisitedPath, setUnvisitedPath] = useState(path);
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyDGCiFRpeVsZEiztcpjt-h_dlEg5tsUZLQ'
    });

    const carIcon = {
        url: 'https://images.vexels.com/media/users/3/154573/isolated/preview/bd08e000a449288c914d851cb9dae110-hatchback-car-top-view-silhouette-by-vexels.png',
        // scaledSize: window?.google?.maps.Size(40, 40),
        scaledSize: { width: 40, height: 40 },
        // origin: window?.google?.maps.Point(0, 0),
        // anchor: window?.google?.maps.Point(20, 20),
        anchor: { x: 20, y: 20 },
        // rotation: 0, // Set initial marker rotation

        scale: 0.2,
    };

    const onLoad = marker => {
        markerRef.current = marker;
    };

    const moveMarkerAlongPath = () => {
        const marker = markerRef.current;
        const path = unvisitedPath;

        if (marker && path) {
            const newPosition = path[marker.index + 1];
            if (newPosition) {
                // Calculate rotation angle based on the previous and current positions
                const previousPosition = path[marker.index];
                const angle = window?.google?.maps.geometry.spherical.computeHeading(previousPosition, newPosition);
                console.log(angle);
                marker.setOptions({
                    position: newPosition,
                    icon: { ...carIcon }, // Rotate the icon based on the angle
                });

                let markerStyle = document.querySelector(`img[src="https://images.vexels.com/media/users/3/154573/isolated/preview/bd08e000a449288c914d851cb9dae110-hatchback-car-top-view-silhouette-by-vexels.png"]`)

                markerStyle.style.transform = `rotate(${angle - 90}deg)`;
                markerStyle.style.transition = 'left 1s ease, top 1s ease'
                console.log(markerStyle)

                marker.index++;

                // Update visited and unvisited paths
                const visited = path.slice(0, marker.index + 1);
                const unvisited = path.slice(marker.index + 1);
                setVisitedPath(visited);
                setUnvisitedPath(unvisited);
            }
        }
    };

    const startMarkerMovement = () => {
        markerRef.current.index = 0;
        setInterval(moveMarkerAlongPath, 1000);
    };

    return <div>
        {
            isLoaded ? (
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={15}
                >
                    <Polyline
                        path={visitedPath}
                        options={{ strokeColor: '#00FF00', strokeOpacity: 1.0, strokeWeight: 2 }}
                    />
                    <Polyline
                        path={unvisitedPath}
                        options={{ strokeColor: '#FF0000', strokeOpacity: 1.0, strokeWeight: 2 }}
                    />
                    <Marker
                        onLoad={onLoad}
                        position={path[0]}
                        icon={carIcon}
                    />
                </GoogleMap>
            ) : null
        }
        <button onClick={startMarkerMovement}>Start Movement</button>
    </div>
};

export default TestMap;
