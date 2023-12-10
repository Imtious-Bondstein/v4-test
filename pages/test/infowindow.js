import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import VehicleInfoWindow from '@/components/VehicleInfoWindow';

// Custom InfoWindow component
function InfoWindowContent(props) {
    return (
        <div>
            <h1>{props.title}</h1>
            <p>{props.description}</p>
        </div>
    );
}

function Map() {
    const [infoWindow, setInfoWindow] = useState(null);
    const [currentPathIndex, setCurrentPathIndex] = useState(0);
    const markerRef = useRef(null);
    const infowindowRef = useRef(null);

    const markerObjectRef = useRef(null)
    const infowindowObjectRef = useRef(null)
    const markerIdentifier = useRef(null);

    const carIcon = {
        url: "https://i.ibb.co/Njg208f/Group.png",
        scaledSize: { width: 50, height: 50 },
        anchor: { x: 25, y: 25 },
        scale: 0.2,
        id: 123
    };

    const paths = [
        { id: 1, lat: 37.7749, lng: -122.4194, speed: 10 },
        { id: 2, lat: 37.7749, lng: -122.4305, speed: 40 },
        { id: 3, lat: 37.7749, lng: -122.4355, speed: 53 },
        { id: 4, lat: 37.7749, lng: -122.4405, speed: 60 },
        { id: 5, lat: 37.7749, lng: -122.4455, speed: 65 },
        { id: 6, lat: 37.7749, lng: -122.4505, speed: 72 },
        { id: 7, lat: 37.7749, lng: -122.4555, speed: 10 },
        { id: 8, lat: 37.7749, lng: -122.4605, speed: 0 },
    ];

    const contentComponent = (
        <VehicleInfoWindow speed={paths[currentPathIndex]?.speed} />
    );

    useEffect(() => {
        const loader = new Loader({
            apiKey: 'AIzaSyC4s5fkJjVPRUjA-8Zr_q5hGBwT4og4y60',
            version: 'weekly', // Use the weekly version of the Google Maps JavaScript API
        });

        loader.load().then(() => {
            const initialLatLng = {
                lat: paths[0].lat,
                lng: paths[0].lng,
            };

            const map = new window.google.maps.Map(document.getElementById('map'), {
                zoom: 4,
                center: initialLatLng,
            });

            //======polyline
            if (paths && paths.length > 0) {
                const polyline = new window.google.maps.Polyline({
                    path: paths,
                    geodesic: true,
                    strokeColor: '#FF0000',
                    strokeOpacity: 1.0,
                    strokeWeight: 2,
                });

                polyline.setMap(map);
            }

            infowindowRef.current = new window.google.maps.InfoWindow({
                content: renderToString(contentComponent),
                ariaLabel: '123',
            });

            markerObjectRef.current = carIcon.url
            infowindowObjectRef.content = '123'


            markerRef.current = new window.google.maps.Marker({
                position: initialLatLng,
                map,
                icon: carIcon,
                title: 'Uluru (Ayers Rock)',
                id: '123',
                ariaLabel: '123'
            });
            markerRef.current.tooltipContent = 'Hello';
            markerRef.current.setMap(map);

            markerRef.current.addListener('click', () => {
                infowindowRef.current.open(map, markerRef.current);
                // if (infoWindow) {
                //     infoWindow.close();
                // }

                // if (infoWindow !== infowindow) {
                //     setInfoWindow(infowindow);
                // } else {
                //     setInfoWindow(null);
                // }
            });


        });
    }, []);

    useEffect(() => {
        console.log('calling...', contentComponent);

        if (currentPathIndex > 0) {
            infowindowRef.current.setContent(renderToString(contentComponent))
        }

    }, [currentPathIndex])

    const moveMarkerAlongPath = () => {
        if (paths && paths.length > 0 && markerRef.current) {
            const pathCoordinates = paths.map((path) => ({
                lat: path.lat,
                lng: path.lng,
            }));
            console.log('marker', markerRef.current);
            let index = 0;
            const interval = setInterval(() => {
                if (index < pathCoordinates.length) {
                    const newPosition = pathCoordinates[index];
                    markerRef.current.setPosition(newPosition);

                    setCurrentPathIndex(index);

                    if (index < pathCoordinates.length - 1) {
                        const nextPosition = pathCoordinates[index + 1];
                        const heading = google.maps.geometry.spherical.computeHeading(
                            new google.maps.LatLng(newPosition),
                            new google.maps.LatLng(nextPosition)
                        );
                        let markerStyle = document.querySelector(
                            `img[src="${markerObjectRef.current}"]`
                        );
                        let markerContainerStyle = markerStyle.closest("div");
                        // console.log('markerRef:::', markerContainerStyle);
                        // set marker container style
                        markerIdentifier.current = markerContainerStyle;

                        markerStyle.style.transform = `rotate(${heading - 90}deg)`;
                        // markerStyle.style.transform = `rotate(${heading ? heading - 90 : 90}deg)`;
                        markerContainerStyle.style.transition = `all 1s ease`;
                        markerStyle.style.transition = heading && `all 1s ease`;
                        markerStyle.style.transition = `all 1s ease`;


                        // .................infowindow
                        // let infowindowStyle = document.querySelector(
                        //     '[aria-label="123"]'
                        // )
                        let infowindowStyle = document.querySelector(
                            '.gm-style-iw-a'
                        )
                        let infowindowContainerStyle = infowindowStyle.closest('div');
                        infowindowStyle.style.transition = 'all 1s ease';


                        // markerRef.current.setIcon({
                        //     ...svgMarkerRef.current,
                        //     rotation: heading
                        // });
                    }
                    index++;
                } else {
                    clearInterval(interval);
                }
            }, 1000);
        }
    };

    return (
        <div>
            <div id="map" style={{ height: '400px', width: '100%' }}></div>
            <button className="rounded-lg border mt-4 p-2 text-black" onClick={moveMarkerAlongPath}>
                START
            </button>
        </div>
    );
}

export default Map;
