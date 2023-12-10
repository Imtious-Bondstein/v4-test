import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom'
import { Loader } from "@googlemaps/js-api-loader"
import dotenv from "dotenv";
import GreenFlagSVG from '../SVG/mapMarkerSVG/GreenFlagSVG';
import RedFlagSVG from '../SVG/mapMarkerSVG/RedFlagSVG';

dotenv.config();

const VehicleRouteMapC = ({
    isShareMap,
    height,
    title,
    paths,
    parkingMarker,
    speedMarker,
    brakeMarker,
    powerMarker,
    startDate,
    endDate,
    averageSpeed,
    maxSpeed,
    vehicleRoute,
    vehicleDetails,
    isLoading,
    emptyPathsNotify,
    errorNotify,
    successNotify,
}) => {
    const containerStyle = {
        width: "100%",
        height: height,
    };

    const mapRef = useRef(null);
    const map = useRef(null);
    const carPosition = useRef(null)
    const markerIdentifier = useRef(null);

    const [mapCenter, setMapCenter] = useState({
        lat: 23.8103,
        lng: 90.4125,
    });
    const [currentPathIndex, setCurrentPathIndex] = useState(0); // Track the current path index
    const markerRef = useRef(null); // Ref for the marker instance
    const markerObjectRef = useRef(null)

    const svgMarkerRef = useRef({
        path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
        fillColor: "blue",
        fillOpacity: 0.6,
        strokeWeight: 0,
        rotation: 0,
        scale: 2,
        // anchor: new google.maps.Point(0, 20),
        transition: 'all ease 1s'
    });

    const carIcon = {
        url: "https://i.ibb.co/Njg208f/Group.png",
        scaledSize: { width: 50, height: 50 },
        anchor: { x: 25, y: 25 },
        scale: 0.2,
    };

    useEffect(() => {
        const loader = new Loader({
            apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        });

        loader.load().then(async () => {
            const { google } = window;
            map.current = new google.maps.Map(mapRef.current, {
                center: mapCenter,
                zoom: 15,
            });

            if (paths && paths.length > 0) {
                const greenFlagLatLng = new window.google.maps.LatLng(paths[0]); // Change the coordinates to your desired location
                createOverlay(GreenFlagSVG, greenFlagLatLng);

                const redFlagLatLng = new window.google.maps.LatLng(paths[paths.length - 1]); // Change the coordinates to your desired location
                createOverlay(RedFlagSVG, redFlagLatLng);

                const initialLatLng = {
                    lat: paths[0].lat,
                    lng: paths[0].lng,
                }

                carPosition.current = initialLatLng


                map.current.setCenter(initialLatLng)

                const polyline = new google.maps.Polyline({
                    path: paths,
                    geodesic: true,
                    strokeColor: "#FF0000",
                    strokeOpacity: 1.0,
                    strokeWeight: 2,
                });

                polyline.setMap(map.current);


                // const svgMarker = {
                //     path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
                //     fillColor: "blue",
                //     fillOpacity: 0.6,
                //     strokeWeight: 0,
                //     rotation: 0,
                //     scale: 2,
                //     anchor: new google.maps.Point(0, 20),
                // };
                markerObjectRef.current = carIcon.url
                markerRef.current = new google.maps.Marker({
                    position: initialLatLng,
                    map: map.current,
                    title: "Hello World!",
                    icon: carIcon
                    // icon: {
                    //     url: "https://i.ibb.co/Njg208f/Group.png",
                    //     scaledSize: new google.maps.Size(50, 50),
                    // },
                });

                markerRef.current.setMap(map.current);


            }
        });
    }, [paths]);

    const createOverlay = (Component, latLng) => {
        const overlay = new window.google.maps.OverlayView();
        overlay.onAdd = function () {
            const div = document.createElement("div");
            div.style.position = "absolute";
            div.style.width = "41px";
            div.style.height = "58px";
            div.style.transform = "translate(-50%, -100%)";
            ReactDOM.render(<Component />, div);
            this.div = div;
            this.getPanes().overlayLayer.appendChild(div);
        };

        overlay.onRemove = function () {
            this.div.parentNode.removeChild(this.div);
        };

        overlay.draw = function () {
            const overlayProjection = this.getProjection();
            const position = overlayProjection.fromLatLngToDivPixel(latLng);
            this.div.style.left = position.x + "px";
            this.div.style.top = position.y + "px";
        };

        overlay.setMap(map.current);
    };

    const carOverlayMarker = (loc) => {
        const overlay = new window.google.maps.OverlayView();
        overlay.onAdd = function () {
            const div = document.createElement("div");
            div.style.position = "absolute";
            div.style.width = "41px";
            div.style.height = "58px";
            div.style.transform = "translate(-50%, -100%)";

            // Add the button and info window code here
            // const button = document.createElement("button");
            // button.className = "bg-red-500 h-4 w-4 cursor-pointer"
            // button.onclick = function () {
            //     setIsInfoShowing(!isInfoShowing);
            // };
            // div.appendChild(button)

            const img = document.createElement("img");
            img.src = "https://i.ibb.co/Njg208f/Group.png"; // Replace with the path to your image
            img.style.width = "50px";
            img.style.height = "50px";
            img.style.zIndex = "9999"
            div.appendChild(img);
            this.getPanes().overlayLayer.appendChild(div);
        };

        overlay.onRemove = function () {
            this.getPanes().overlayLayer.removeChild(div);
        };

        overlay.draw = function () {
            const overlayProjection = this.getProjection();
            const position = overlayProjection.fromLatLngToDivPixel(loc);
            const div = overlay.getPanes().overlayLayer.firstChild;
            div.style.left = position.x + "px";
            div.style.top = position.y + "px";
        };

        overlay.setMap(map.current);
    };


    const moveMarkerAlongPath = () => {
        if (paths && paths.length > 0 && markerRef.current) {
            const pathCoordinates = paths.map((path) => ({
                lat: path.lat,
                lng: path.lng,
            }));

            let index = 0;
            const interval = setInterval(() => {
                if (index < pathCoordinates.length) {
                    const newPosition = pathCoordinates[index];
                    markerRef.current.setPosition(newPosition);
                    carPosition.current = newPosition;

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


                        // markerRef.current.setIcon({
                        //     ...svgMarkerRef.current,
                        //     rotation: heading
                        // });
                    }

                    if (index % 5 === 4) {
                        handlePanTo(newPosition);
                    }
                    index++;
                } else {
                    clearInterval(interval);
                }
            }, 300);
        }
    };

    const handlePanTo = (newPos) => {
        markerIdentifier.current
            ? (markerIdentifier.current.style.transition = "none")
            : "";
        if (map.current) {
            map.current.panTo(newPos);
        }
    };

    return (
        <div>
            <div ref={mapRef} style={{ height: '600px' }}></div>
            <button className='bg-white rounded-lg border mt-4 p-2' onClick={moveMarkerAlongPath}>START</button>
        </div>
    );
};

export default VehicleRouteMapC;
