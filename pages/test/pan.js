import React, { useRef } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
const MapContainer = () => {
    const mapRef = useRef(null);
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyDGCiFRpeVsZEiztcpjt-h_dlEg5tsUZLQ',
    });
    const handlePanTo = () => {
        const map = mapRef.current;
        const newPos = { lat: 37.7749, lng: -122.4194 }; // Example coordinates (San Francisco)
        if (map) {
            map.panTo(newPos);
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
                    <button className='bg-red-500' onClick={handlePanTo}>Pan to San Francisco</button>
                </>
            ) : (
                <div>Loading Map...</div>
            )}
        </div>
    );
};
export default MapContainer;