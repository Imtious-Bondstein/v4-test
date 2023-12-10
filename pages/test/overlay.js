import GreenFlagSVG from "@/components/SVG/mapMarkerSVG/GreenFlagSVG";
import RedFlagSVG from "@/components/SVG/mapMarkerSVG/RedFlagSVG";
import React, { useRef, useEffect, useState } from "react";
import ReactDOM from 'react-dom'

function Map() {
    const mapRef = useRef(null);
    const [isInfoShowing, setIsInfoShowing] = useState(false);

    useEffect(() => {
        const googleMapScript = document.createElement("script");
        googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC4s5fkJjVPRUjA-8Zr_q5hGBwT4og4y60&libraries=places`;
        googleMapScript.async = true;
        googleMapScript.defer = true;
        window.document.body.appendChild(googleMapScript);
        googleMapScript.addEventListener("load", initMap);

        return () => {
            googleMapScript.removeEventListener("load", initMap);
        };
    }, []);

    useEffect(() => {
        console.log('value of', isInfoShowing);
    }, [isInfoShowing])

    const initMap = () => {
        const mapOptions = {
            center: { lat: 37.7749, lng: -122.4194 }, // Set the initial center of the map
            zoom: 12, // Set the initial zoom level
        };

        const map = new window.google.maps.Map(mapRef.current, mapOptions);

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

            overlay.setMap(map);
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

            overlay.setMap(map);
        };

        const carMarkerLatLng = new window.google.maps.LatLng(23.8103, 90.4125); // Change the coordinates to your desired location
        carOverlayMarker(carMarkerLatLng);

        const greenFlagLatLng = new window.google.maps.LatLng(37.7749, -122.4194); // Change the coordinates to your desired location
        createOverlay(GreenFlagSVG, greenFlagLatLng);

        const redFlagLatLng = new window.google.maps.LatLng(40.7749, -22.4194); // Change the coordinates to your desired location
        createOverlay(RedFlagSVG, redFlagLatLng);
    };

    return <div ref={mapRef} style={{ width: "100%", height: "500px" }} />;
}



function App() {
    return (
        <div className="App">
            <Map />
        </div>
    );
}

export default App;
