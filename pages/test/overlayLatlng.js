import React, { useEffect, useRef } from 'react';

const Map = () => {
    const mapRef = useRef(null);
    const overlayRef = useRef(null);
    const polylineRef = useRef(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC4s5fkJjVPRUjA-8Zr_q5hGBwT4og4y60&callback=initMap`;
        script.defer = true;
        script.async = true;
        window.initMap = initMap;
        document.body.appendChild(script);

        return () => {
            // Clean up the Google Maps API script
            document.body.removeChild(script);
        };
    }, []);

    const initMap = () => {
        const map = new window.google.maps.Map(mapRef.current, {
            center: { lat: 40.7749, lng: -122.4194 },
            zoom: 12,
        });

        // drag
        map.addListener("drag", (e) => {
            console.log('dragging......');
        });

        const coordinates = [
            { lat: 40.7749, lng: -122.4194 },
            { lat: 37.7749, lng: -122.4194 },
            { lat: 37.7749, lng: -122.4305 },
            { lat: 37.7749, lng: -122.4355 },
            { lat: 37.7749, lng: -122.4405 },
            { lat: 37.7749, lng: -122.4455 },
            { lat: 37.7749, lng: -122.4505 },
            { lat: 37.7749, lng: -122.4555 },
            { lat: 37.7749, lng: -122.4605 },
            // Add more coordinates here...
        ];

        const bounds = new window.google.maps.LatLngBounds();

        for (const coordinate of coordinates) {
            bounds.extend(coordinate);
        }

        map.fitBounds(bounds)

        const polyline = new window.google.maps.Polyline({
            path: coordinates,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2,
        });

        polyline.setMap(map);
        polylineRef.current = polyline;

        const CustomOverlay = function (position, map) {
            this.position = position;
            this.map = map;
            this.div = null;
            this.setMap(map);
        };

        CustomOverlay.prototype = new window.google.maps.OverlayView();

        CustomOverlay.prototype.onAdd = function () {
            const div = document.createElement('div');
            div.style.borderStyle = 'none';
            div.style.borderWidth = '0px';
            div.style.position = 'absolute';
            div.style.zIndex = '999';
            // div.style.transform = "rotate(180deg)"
            div.style.transition = 'all ease 1s'
            div.innerHTML = '<img width="50" src="https://i.ibb.co/Njg208f/Group.png" />';
            this.div = div;
            const panes = this.getPanes();
            panes.overlayLayer.appendChild(div);
        };

        CustomOverlay.prototype.draw = function () {
            const overlayProjection = this.getProjection();
            const position = overlayProjection.fromLatLngToDivPixel(this.position);
            const div = this.div;
            div.style.left = (position.x - div.offsetWidth / 2) + 'px';
            div.style.top = (position.y - div.offsetHeight / 2) + 'px';
        };

        CustomOverlay.prototype.onRemove = function () {
            this.div.parentNode.removeChild(this.div);
            this.div = null;
        };

        const overlay = new CustomOverlay({ lat: 40.7749, lng: -122.4194 }, map);
        overlayRef.current = overlay;

        const moveOverlay = () => {
            const path = polylineRef.current.getPath();
            console.log(path);
            let index = 0;

            const interval = setInterval(() => {
                const position = path.getAt(index);
                const nextPosition = path.getAt(index + 1);

                const overlayDiv = overlayRef.current.div;
                const overlayProjection = overlayRef.current.getProjection();
                const pixelPosition = overlayProjection.fromLatLngToDivPixel(position);
                const pixelNextPosition = overlayProjection.fromLatLngToDivPixel(nextPosition);

                const heading = google.maps.geometry.spherical.computeHeading(
                    position, nextPosition
                );

                overlayDiv.style.transform = `rotate(${-90 + heading}deg)`;

                overlayDiv.style.left = (pixelPosition.x - overlayDiv.offsetWidth / 2) + 'px';
                overlayDiv.style.top = (pixelPosition.y - overlayDiv.offsetWidth / 2) + 'px';
                // Change polyline color to green when the overlay is visited
                // if (index < path.getLength() - 1) {
                //     polylineRef.current.setOptions({ strokeColor: '#00FF00' });
                // }

                index++;

                console.log("i:", index, 'path len:', path.getLength() - 1);

                if (index === path.getLength() - 1) {
                    clearInterval(interval);
                }
            }, 1000);
        };

        const button = document.getElementById('moveButton');
        button.addEventListener('click', moveOverlay);
    };

    return (
        <div>
            <div id="map" ref={mapRef} style={{ width: '100%', height: '400px' }}></div>
            <button id="moveButton">Move Overlay</button>
        </div>
    );
};

export default Map;
