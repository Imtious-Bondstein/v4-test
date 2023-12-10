import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const MapWithMarkers = () => {
    const coordinates = [
        { lat: 37.7749, lng: -122.4194 }, // Example coordinates, replace with your own
        { lat: 34.0522, lng: -118.2437 },
        { lat: 40.7128, lng: -74.0060 },
    ];

    const mapRef = useRef(null);
    const markers = useRef([]);

    useEffect(() => {
        const loader = new Loader({
            apiKey: 'AIzaSyC4s5fkJjVPRUjA-8Zr_q5hGBwT4og4y60',
            version: 'weekly',
        });

        loader.load().then(() => {
            const map = new google.maps.Map(mapRef.current, {
                center: coordinates[0],
                zoom: 10,
            });

            // Create markers and info windows
            coordinates.forEach((coord) => {
                const marker = new google.maps.Marker({
                    position: coord,
                    map,
                });

                const infowindow = new google.maps.InfoWindow({
                    content: 'Marker Info',
                });

                marker.addListener('click', () => {
                    infowindow.open(map, marker);
                });

                markers.current.push({ marker, infowindow });
            });
        });
    }, []);

    return (
        <div>
            <h1>My Map</h1>
            <div ref={mapRef} style={{ width: '100%', height: '400px' }} />
        </div>
    );
};

export default MapWithMarkers;
