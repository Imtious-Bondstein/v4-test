import React, { useRef } from 'react';
import { Loader } from "@googlemaps/js-api-loader"

const newMap = () => {
    const map = useRef('');
    const loader = new Loader({
        apiKey: "AIzaSyC4s5fkJjVPRUjA-8Zr_q5hGBwT4og4y60",
    });

    loader.load().then(async () => {
        const { Map } = await google.maps.importLibrary("maps");

        map.current = new Map(document.getElementById("map"), {
            center: { lat: -34.397, lng: 150.644 },
            zoom: 8,
        });
    });

    return (
        <div id="map" className='h-screen'>

        </div>
    );
};

export default newMap;