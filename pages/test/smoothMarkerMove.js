import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const App = () => {
    const markerRef = useRef(null); // Ref for the marker instance
    const mapRef = useRef(null);

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
                { lat: 37.7999, lng: -122.4194 },
                { lat: 37.7749, lng: -122.4194 },
                { lat: 37.7749, lng: -122.4305 },
                { lat: 37.7749, lng: -122.4355 },
                { lat: 37.7749, lng: -122.4405 },
                { lat: 37.7749, lng: -122.4455 },
                { lat: 37.7749, lng: -122.4505 },
                { lat: 37.7749, lng: -122.4555 },
                { lat: 37.7749, lng: -122.4605 },
                { lat: 37.7999, lng: -122.4605 },
            ];

            const polyline = new window.google.maps.Polyline({
                path: coordinates,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2,
            });
            polyline.setMap(map);

            const initialLatLng = {
                lat: coordinates[0].lat,
                lng: coordinates[0].lng,
            };

            markerRef.current = new window.google.maps.Marker({
                position: initialLatLng,
                map: map,
                title: 'Hello World!',
                icon: {
                    url: 'https://i.ibb.co/Njg208f/Group.png',
                    scaledSize: { width: 50, height: 50 },
                    anchor: { x: 25, y: 25 },
                    scale: 0.2,
                },
            });

            const moveMarkerAlongPath = () => {
                const marker = markerRef.current;
                if (marker && coordinates) {
                    let index = 0;
                    const interval = setInterval(() => {
                        if (index < coordinates.length - 1) {
                            const moveFrom = coordinates[index];
                            const moveTo = coordinates[index + 1];
                            const heading = google.maps.geometry.spherical.computeHeading(
                                new google.maps.LatLng(moveFrom),
                                new google.maps.LatLng(moveTo)
                            );
                            animatedMove(marker, moveFrom, moveTo, 3);
                            let markerStyle = document.querySelector(
                                `img[src="https://i.ibb.co/Njg208f/Group.png"]`
                            );
                            let markerContainerStyle = markerStyle.closest("div");
                            // markerIdentifier.current = markerContainerStyle;

                            markerStyle.style.transform = `rotate(${heading - 90}deg)`;
                            markerContainerStyle.style.transition = `all 0.3s ease`;
                            markerStyle.style.transition = `all 0.3s ease`;
                            index++;
                        } else {
                            clearInterval(interval);
                        }
                    }, 300);
                }
            };

            const animatedMove = async (marker, moveFrom, moveTo, t, delta = 100) => {
                return new Promise((resolve) => {
                    const deltalat = (moveTo.lat - moveFrom.lat) / delta;
                    const deltalng = (moveTo.lng - moveFrom.lng) / delta;
                    let count = 0;
                    for (let i = 0; i < delta; i++) {
                        setTimeout(() => {
                            let lat = marker.getPosition().lat();
                            let lng = marker.getPosition().lng();
                            lat += deltalat;
                            lng += deltalng;
                            marker.setPosition({ lat, lng });
                            count++;
                            if (count === delta) {
                                resolve(marker);
                            }
                        }, t * i);
                    }
                });
            };

            const startMoveButton = document.getElementById('start-move-button');
            startMoveButton.addEventListener('click', moveMarkerAlongPath);
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
