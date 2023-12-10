import React, { useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";

function Map() {
    useEffect(() => {
        const loader = new Loader({
            apiKey: "AIzaSyC4s5fkJjVPRUjA-8Zr_q5hGBwT4og4y60", // Replace with your actual API key
            version: "weekly",
        });

        loader.load().then(() => {
            initMap();
        });
    }, []);

    function initMap() {
        const map = new google.maps.Map(document.getElementById("map"), {
            center: { lat: 40.7749, lng: -122.4194 },
            zoom: 6,
            mapTypeId: "terrain",
        });

        const lineSymbol = {
            path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
            scale: 2,
            strokeColor: "#393",
        };

        const line = new google.maps.Polyline({
            path: [
                { lat: 40.7749, lng: -122.4194 },
                { lat: 37.7749, lng: -122.4194 },
                { lat: 37.7749, lng: -122.4305 },
                { lat: 37.7749, lng: -122.4355 },
                { lat: 37.7749, lng: -122.4405 },
                { lat: 37.7749, lng: -122.4455 },
                { lat: 37.7749, lng: -122.4505 },
                { lat: 37.7749, lng: -122.4555 },
                { lat: 37.7749, lng: -122.4605 },
            ],
            icons: [
                {
                    icon: lineSymbol,
                    offset: "100%",
                },
            ],
            map: map,
        });

        animateCircle(line);
    }

    function animateCircle(line) {
        let count = 0;

        window.setInterval(() => {
            count = (count + 1) % 200;

            const icons = line.get("icons");

            icons[0].offset = count / 2 + "%";
            line.set("icons", icons);
        }, 200);
    }

    return <div id="map" style={{ height: "400px" }}></div>;
}

export default Map;
