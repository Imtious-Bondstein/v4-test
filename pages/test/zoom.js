import React, { useRef } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
const MapContainer = () => {
    const mapRef = useRef(null);
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyDGCiFRpeVsZEiztcpjt-h_dlEg5tsUZLQ',
    });
    const handleSmoothZoom = () => {
        const map = mapRef.current;
        const zoomLevel = 12; // Example zoom level
        if (map) {
            const currentZoom = map.getZoom();
            const step = Math.abs(currentZoom - zoomLevel) / 10; // Number of steps for the smooth effect
            const smoothZoom = () => {
                const currentStep = Math.abs(currentZoom - map.getZoom());
                if (currentStep < step) {
                    map.setZoom(zoomLevel);
                } else if (currentZoom < zoomLevel) {
                    map.setZoom(map.getZoom() + step);
                    requestAnimationFrame(smoothZoom);
                } else if (currentZoom > zoomLevel) {
                    map.setZoom(map.getZoom() - step);
                    requestAnimationFrame(smoothZoom);
                }
            };
            smoothZoom();
        }
    };
    return (
        <div>
            {isLoaded ? (
                <>
                    <GoogleMap
                        id="map"
                        mapContainerStyle={{ height: '400px', width: '100%' }}
                        zoom={8}
                        center={{ lat: 37.0902, lng: -95.7129 }} // Initial center (United States)
                        onLoad={map => {
                            mapRef.current = map;
                        }}
                    >
                    </GoogleMap>
                    <button onClick={handleSmoothZoom}>Smooth Zoom</button>
                </>
            ) : (
                <div>Loading Map...</div>
            )}
        </div>
    );
};
export default MapContainer;