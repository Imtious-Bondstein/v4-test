import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const MapOverlay = () => {
    const mapContainerRef = useRef(null);
    const [map, setMap] = useState(null);

    useEffect(() => {
        const loader = new Loader({
            apiKey: 'AIzaSyC4s5fkJjVPRUjA-8Zr_q5hGBwT4og4y60',
            version: 'weekly',
        });

        loader.load().then(() => {
            const google = window.google;

            const mapOptions = {
                center: { lat: 37.7749, lng: -122.4194 }, // Example coordinates (San Francisco)
                zoom: 10,
            };

            const map = new google.maps.Map(mapContainerRef.current, mapOptions);

            // Create an overlay view
            const overlay = new google.maps.OverlayView();
            overlay.setMap(map);

            // Define the content and positioning of the overlay
            overlay.onAdd = function () {
                const div = document.createElement('div');
                div.style.border = '1px solid #000';
                div.style.background = 'rgba(255, 255, 255, 0.5)';
                div.style.padding = '10px';
                div.style.position = 'absolute';
                div.style.top = '50px';
                div.style.left = '50px';
                div.style.cursor = 'pointer'
                div.innerHTML = 'Custom Overlay View';

                div.onclick = () => {
                    console.log('click');
                }

                const panes = overlay.getPanes();
                panes.overlayMouseTarget.appendChild(div)
                // panes.markerLayer.appendChild(div);

            };

            overlay.addListener('click', () => {
                console.log('map click');
            })
            // const marker = new google.maps.Marker({
            //     position: { lat: 37.7749, lng: -122.4194 },
            //     map,

            // });
            // marker.setMap(map)

            setMap(map);
        });
    }, []);

    return <div ref={mapContainerRef} style={{ height: '400px', width: '100%' }} />;
};

export default MapOverlay;
