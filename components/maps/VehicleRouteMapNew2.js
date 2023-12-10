import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Loader } from "@googlemaps/js-api-loader"

//=====custom css
import "../../styles/pages/Home.css";
import "../../styles/components/currentLocationMap.css";

//========toast notification
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//============SVG
import GreenFlagSVG from '../SVG/mapMarkerSVG/GreenFlagSVG';
import RedFlagSVG from '../SVG/mapMarkerSVG/RedFlagSVG';

//=========info window
import VehicleRouteVehicleInfoWindow from "../infoWindows/VehicleRouteVehicleInfoWindowOld";


import dotenv from "dotenv";

dotenv.config();

const VehicleRouteMapNew2 = ({
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
    //=====map style
    const containerStyle = {
        width: "100%",
        // height: '100%',
    };

    // =======set map key
    const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    });

    //======map
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null)
    const [mapCenter, setMapCenter] = useState({
        lat: 23.8103,
        lng: 90.4125,
    });
    const [isMapLoading, setIsMapLoading] = useState(false)

    const [pointLayer, setPointLayer] = useState(false);
    const toggleClass = " transform translate-x-16";

    const overlayRef = useRef(null);
    const overlayCarRef = useRef(null);
    const polylineRef = useRef(null);
    const lastVisitedIndex = useRef(0);

    //======info window
    const [isInfoShowing, setIsInfoShowing] = useState(false);

    //========start and end marker
    const createOverlay = (Component, latLng) => {
        const overlay = new window.google.maps.OverlayView();
        overlay.onAdd = function () {
            const div = document.createElement("div");
            div.style.position = "absolute";
            div.style.width = "41px";
            div.style.height = "58px";
            div.style.zIndex = "99"
            div.style.transform = "translate(-50%, -100%)";
            createRoot(div).render(<Component />);
            this.div = div;
            this.getPanes().overlayLayer.appendChild(div);
        };

        overlay.onRemove = function () {
            this.div.parentNode.removeChild(this.div);
        };

        overlay.draw = function () {
            const overlayProjection = this.getProjection();
            const position = overlayProjection.fromLatLngToDivPixel(latLng);
            const div = this.div;
            div.style.left = (position.x) + "px";
            div.style.top = (position.y + div.offsetHeight / 2) + "px";
            // div.style.left = (position.x - div.offsetWidth / 2) + "px";
            // div.style.top = (position.y - div.offsetHeight / 2) + "px";
        };

        overlay.setMap(mapRef.current);
    };

    //========map bounds
    const handleMapBonds = () => {
        const bounds = new window.google.maps.LatLngBounds();

        for (const path of paths) {
            bounds.extend(path);
        }

        mapRef.current.fitBounds(bounds)
    }

    //=======primary polyLine
    const primaryPolyline = () => {
        const polyline = new google.maps.Polyline({
            path: paths,
            geodesic: true,
            strokeColor: "#e31b25",
            strokeOpacity: 1.0,
            strokeWeight: 4,
        });

        polyline.setMap(mapRef.current);
        polylineRef.current = polyline;
    }

    //======car marker
    const carMarker = (initPosition) => {
        console.log('init pos', initPosition);
        const CustomOverlay = function (position) {
            this.position = position;
            this.map = mapRef.current;
            this.div = null;
            this.setMap(mapRef.current);
        };

        CustomOverlay.prototype = new window.google.maps.OverlayView();

        CustomOverlay.prototype.onAdd = function () {
            const div = document.createElement('div');
            div.style.borderStyle = 'none';
            div.style.borderWidth = '0px';
            div.style.position = 'absolute';
            div.style.zIndex = '999';
            // div.style.background = 'red'
            // div.style.padding = '10px'
            // div.style.transform = "rotate(180deg)"
            div.style.transition = 'all ease 1s'
            div.innerHTML = '<img width="50" src="https://i.ibb.co/Njg208f/Group.png" />';
            this.div = div;

            div.onclick = () => {
                setIsInfoShowing(!isInfoShowing)
            }

            // createRoot(div).render(
            //     <VehicleRouteVehicleInfoWindow
            //         path={paths[lastVisitedIndex.current]}
            //         setIsInfoShowing={setIsInfoShowing}
            //         vehicleDetails={vehicleDetails}
            //     />
            // );

            const panes = this.getPanes();
            panes.floatPane.appendChild(div);
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

        const overlay = new CustomOverlay(initPosition);
        overlayRef.current = overlay;
    }

    //======car infoWindow
    const carInfo = (initPosition) => {
        console.log('init pos', initPosition);
        const CustomOverlay = function (position) {
            this.position = position;
            this.map = mapRef.current;
            this.div = null;
            this.setMap(mapRef.current);
        };

        CustomOverlay.prototype = new window.google.maps.OverlayView();

        CustomOverlay.prototype.onAdd = function () {
            const div = document.createElement('div');
            div.style.borderStyle = 'none';
            div.style.borderWidth = '0px';
            div.style.position = 'absolute';
            div.style.zIndex = '999';
            // div.style.background = 'red'
            // div.style.padding = '10px'
            // div.style.transform = "rotate(180deg)"
            div.style.transition = 'all ease 1s'
            createRoot(div).render(
                <VehicleRouteVehicleInfoWindow
                    path={paths[lastVisitedIndex.current]}
                    setIsInfoShowing={setIsInfoShowing}
                    vehicleDetails={vehicleDetails}
                />
            );
            this.div = div;
            const panes = this.getPanes();
            panes.floatPane.appendChild(div);
        };

        CustomOverlay.prototype.draw = function () {
            const overlayProjection = this.getProjection();
            const position = overlayProjection.fromLatLngToDivPixel(this.position);
            const div = this.div;
            div.style.left = (position.x - div.offsetWidth / 2) + 'px';
            div.style.top = (position.y - div.offsetHeight / 2) + 'px';
            console.log('test pos',);
        };

        CustomOverlay.prototype.onRemove = function () {
            this.div.parentNode.removeChild(this.div);
            this.div = null;
        };

        const overlay = new CustomOverlay(initPosition);
        overlayCarRef.current = overlay;
    }


    const initMap = () => {
        if (paths && paths.length > 0) {
            const greenFlagLatLng = new window.google.maps.LatLng(paths[0]); // Change the coordinates to your desired location
            createOverlay(GreenFlagSVG, greenFlagLatLng);

            const redFlagLatLng = new window.google.maps.LatLng(paths[paths.length - 1]); // Change the coordinates to your desired location
            createOverlay(RedFlagSVG, redFlagLatLng);

            const initialLatLng = {
                lat: paths[0].lat,
                lng: paths[0].lng,
            }

            mapRef.current.setCenter(initialLatLng)

            handleMapBonds()
            primaryPolyline()
            carMarker(initialLatLng)
            carInfo(initialLatLng)

        }
    };

    const moveOverlay = () => {
        //========zoom map 
        mapRef.current.setZoom(15)
        //========center map temp***** 
        mapRef.current.setCenter(paths[0])


        const path = polylineRef.current.getPath();
        console.log(path);
        let index = 0;

        const interval = setInterval(() => {
            const position = path.getAt(index);
            const nextPosition = path.getAt(index + 1);

            const overlayDiv = overlayRef.current.div;
            // for info 
            const overlayInfoDiv = overlayCarRef.current.div

            const overlayProjection = overlayRef.current.getProjection();
            const pixelPosition = overlayProjection.fromLatLngToDivPixel(position);
            const pixelNextPosition = overlayProjection.fromLatLngToDivPixel(nextPosition);

            const heading = google.maps.geometry.spherical.computeHeading(
                position, nextPosition
            );

            overlayDiv.style.transform = `rotate(${-90 + heading}deg)`;

            overlayDiv.style.left = (pixelPosition.x - overlayDiv.offsetWidth / 2) + 'px';
            overlayDiv.style.top = (pixelPosition.y - overlayDiv.offsetWidth / 2) + 'px';

            // for info 
            overlayInfoDiv.style.left = (pixelPosition.x - overlayInfoDiv.offsetWidth / 2) + 'px';
            overlayInfoDiv.style.top = (pixelPosition.y - overlayInfoDiv.offsetWidth / 2) + 'px';


            // Change polyline color to green when the overlay is visited
            // if (index < path.getLength() - 1) {
            //     polylineRef.current.setOptions({ strokeColor: '#00FF00' });
            // }

            // handlePanTo(paths[index])
            lastVisitedIndex.current = index;

            index++;

            // console.log("i:", index, 'path len:', path.getLength() - 1);

            if (index === path.getLength() - 1) {
                clearInterval(interval);
            }
        }, 300);
    };

    //======map pan to center
    const handlePanTo = (newPos) => {
        console.log('new pos', newPos);
        if (mapRef.current) {
            mapRef.current.panTo({ lat: newPos.lat, lng: newPos.lng });
        }
    };

    useEffect(() => {
        // set load map
        setIsMapLoading(true);
        loader.load().then(async () => {
            const { google } = window;
            mapRef.current = new google.maps.Map(mapContainerRef.current, {
                center: mapCenter,
                zoom: 15,
            })
            initMap()
        }).catch(err => {
            console.log('map error', err);
        }).finally(() => setIsMapLoading(false))

    }, [paths]);

    return (
        <div className='vehicle-route'>
            {/* =======title========= */}
            {title ? (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 lg:mb-3 mt-5 lg:mt-0">
                    <h1 className="text-xl md:text-[26px] text-primaryText font-bold">
                        {title}
                    </h1>
                    {/* toggle button start */}
                    <div className="mr-4 absolute sm:relative left-10 sm:-left-14 top-32 lg:left-0 sm:top-20 lg:top-0 mt-3 lg:mt-0 sm:-ml-16 lg:ml-0">
                        <div
                            className="w-32 h-9 flex items-center bg-white rounded-[10px] cursor-pointer tmv-shadow relative z-10 text-sm font-normal"
                        // onClick={handlePointLayer}
                        >
                            {/* Switch */}
                            <div className="w-32 h-9 flex justify-center items-center absolute top-0 left-0 px-3 text-tertiaryText">
                                <p className="w-full text-left">Vehicle</p>
                                <p className="w-full text-right">Point</p>
                            </div>
                            <div
                                className={
                                    "bg-primary primary-shadow z-10 w-16 h-9 flex justify-center items-center rounded-[10px] shadow-md transform duration-300 ease-in-out" +
                                    (!pointLayer ? null : toggleClass)
                                }
                            >
                                <p>{pointLayer ? "Point" : "Vehicle"}</p>
                            </div>
                        </div>
                        {/* === toggle button end === */}
                    </div>
                </div>
            ) : (
                ""
            )}

            {isLoading ? (
                <div className="w-full bg-white p-2 min-h-[440px] h-[60vh] skeleton-border rounded-xl">
                    <div className="w-full h-full skeleton rounded-xl"></div>
                </div>
            ) : (
                <div>
                    {/* ===== map ==== */}
                    <div
                        className={`relative bg-white rounded-xl ${!isShareMap ? "p-2" : ""
                            }`}
                    >
                        <ToastContainer
                            style={{
                                position: "absolute",
                                top: 10,
                                left: 0,
                                right: 0,
                                margin: "0 auto",
                            }}
                        />

                        {/* =========main map========= */}
                        {/* {!isMapLoading ? ( */}
                        <div ref={mapContainerRef} className="vehicle-route-map" style={containerStyle}></div>
                        {/* ) : null} */}
                    </div>
                    <button onClick={moveOverlay}>Move Overlay</button>
                </div>
            )}
        </div>
    );
};

export default VehicleRouteMapNew2;