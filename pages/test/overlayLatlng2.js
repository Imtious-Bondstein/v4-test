import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const App = () => {
    const mapRef = useRef(null);
    const overlayRef = useRef(null);
    const markerInterval = useRef(null);
    const animationIndex = useRef(0);
    const visitedPolyline = useRef(null); // Added variable for visited polyline

    useEffect(() => {
        const loader = new Loader({
            apiKey: 'AIzaSyC4s5fkJjVPRUjA-8Zr_q5hGBwT4og4y60',
            version: 'weekly',
        });
        loader.load().then(() => {
            const map = new window.google.maps.Map(mapRef.current, {
                center: { lat: 37.7749, lng: -122.4194 },
                zoom: 13,
            });
            const coordinates = [
                { lat: 37.7749, lng: -122.4194 },
                { lat: 37.7749, lng: -122.4305 },
                { lat: 37.7749, lng: -122.4355 },
                { lat: 37.7749, lng: -122.4405 },
                { lat: 37.7749, lng: -122.4455 },
                { lat: 37.7749, lng: -122.4505 },
                { lat: 37.7749, lng: -122.4555 },
                { lat: 37.7749, lng: -122.4605 },
            ];
            const polyline = new window.google.maps.Polyline({
                path: coordinates,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2,
            });
            polyline.setMap(map);


            const overlay = new window.google.maps.OverlayView();
            overlay.onAdd = function () {
                const div = document.createElement('div');
                div.style.position = 'absolute';
                div.style.width = '41px';
                div.style.height = '58px';
                div.style.transform = 'translate(-50%, -100%)';
                const img = document.createElement('img');
                img.src = 'https://i.ibb.co/Njg208f/Group.png';
                img.style.width = '50px';
                img.style.height = '50px';
                img.style.zIndex = '9999';
                div.appendChild(img);
                this.getPanes().overlayLayer.appendChild(div);
                overlayRef.current = div;
            };
            overlay.onRemove = function () {
                this.getPanes().overlayLayer.removeChild(overlayRef.current);
            };
            overlay.draw = function () {
                const overlayProjection = this.getProjection();
                const position =
                    animationIndex.current > 0
                        ? overlayProjection.fromLatLngToDivPixel(new window.google.maps.LatLng(coordinates[animationIndex.current]))
                        : overlayProjection.fromLatLngToDivPixel({ lat: 37.7749, lng: -122.4194 });

                overlayRef.current.style.left = position.x + 'px';
                overlayRef.current.style.top = position.y + 'px';

                if (!visitedPolyline.current) {
                    visitedPolyline.current = new window.google.maps.Polyline({
                        path: [],
                        geodesic: true,
                        strokeColor: '#00FF00', // Green color
                        strokeOpacity: 1.0,
                        strokeWeight: 2,
                    });
                }

                visitedPolyline.current.setMap(map); // Add visited polyline to the map
            };
            overlay.setMap(map);

            const startMarkerMovement = () => {
                markerInterval.current = setInterval(moveMarkerAlongPath, 1000);
            };

            const moveMarkerAlongPath = () => {
                const marker = overlayRef.current;
                if (marker && coordinates) {
                    const newPosition = coordinates[animationIndex.current + 1];
                    if (newPosition) {
                        const overlayProjection = overlay.getProjection();

                        // const position = overlayProjection.fromLatLngToDivPixel({ lat: 37.7749, lng: -122.4194 });

                        const position = overlayProjection.fromLatLngToDivPixel(new window.google.maps.LatLng(newPosition));

                        marker.style.left = position.x + 'px';
                        marker.style.top = position.y + 'px';

                        handlePanTo(coordinates[animationIndex.current + 1])
                        animationIndex.current += 1;

                        // Add visited coordinates to the visited polyline's path
                        visitedPolyline.current.getPath().push(new window.google.maps.LatLng(newPosition));
                    } else {
                        clearInterval(markerInterval.current);
                    }
                }
            };

            const handlePanTo = (newPos) => {
                if (map) {
                    map.panTo({ lat: newPos.lat, lng: newPos.lng });
                }
            };

            const startMoveButton = document.getElementById('start-move-button');
            startMoveButton.addEventListener('click', startMarkerMovement);
        });
    }, []);

    return (
        <>
            <div ref={mapRef} style={{ width: '100%', height: '400px' }} />
            <button id="start-move-button">Start Move</button>
        </>
    );
};

export default App;
