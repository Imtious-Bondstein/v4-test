import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const Map = () => {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const overlayInstanceRef = useRef(null);
    const [mapCenter, setMapCenter] = useState({
        lat: 23.8103,
        lng: 90.4125,
    });

    useEffect(() => {
        const loader = new Loader({
            apiKey: 'AIzaSyC4s5fkJjVPRUjA-8Zr_q5hGBwT4og4y60',
            version: 'weekly',
        });

        loader.load().then(() => {
            const mapOptions = {
                center: mapCenter, // Set the initial center of the map
                zoom: 12, // Set the initial zoom level
            };

            mapInstanceRef.current = new google.maps.Map(
                mapContainerRef.current,
                mapOptions
            );

            // Create your custom overlay
            const overlay = new google.maps.OverlayView();
            overlay.onAdd = () => {
                const div = document.createElement('div');
                div.style.border = '1px solid red';
                div.style.backgroundColor = 'red';
                div.style.opacity = '0.5';
                div.style.position = 'absolute';
                div.style.width = '20px';
                div.style.height = '20px';
                overlay.div = div;
                const panes = overlay.getPanes();
                panes.overlayLayer.appendChild(div);
            };

            overlay.draw = () => {
                // Customize your overlay's appearance
                const div = overlay.div;
                const projection = overlay.getProjection();
                const position = projection.fromLatLngToDivPixel(mapCenter);

                div.style.left = position.x + 'px';
                div.style.top = position.y + 'px';

            };

            overlay.onRemove = () => {
                overlay.div.parentNode.removeChild(
                    overlay.div
                );
                overlay.div = null;
            };

            // Add the overlay to the map
            overlay.setMap(mapInstanceRef.current);
            overlayInstanceRef.current = overlay;
        });

        // Cleanup function to remove the map and overlay
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.setMap(null);
            }

            overlayInstanceRef.current = null;
        };
    }, []);

    const showOverlay = () => {
        if (overlayInstanceRef.current) {
            overlayInstanceRef.current.setMap(mapInstanceRef.current);
        }
    };

    const hideOverlay = () => {
        if (overlayInstanceRef.current) {
            overlayInstanceRef.current.setMap(null);
        }
    };

    return (
        <div>
            <div ref={mapContainerRef} style={{ width: '100%', height: '400px' }} />
            <button onClick={showOverlay}>Show Overlay</button>
            <button onClick={hideOverlay}>Hide Overlay</button>
        </div>
    );
};

export default Map;
