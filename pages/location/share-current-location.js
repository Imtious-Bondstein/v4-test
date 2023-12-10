import ShareCurrentLocationMap from '@/components/maps/ShareCurrentLocationMap';
import axios from '@/plugins/axios';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router'
import Link from "next/link";
import Unauthorized401 from '@/components/Unauthorized401';

const shareCurrentLocation = () => {
    const [selectedVehicles, setSelectedVehicles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const timeInterval = useRef(null)

    const [isTokenExpire, setIsTokenExpire] = useState(false);

    const accessToken = useRef(null)


    const router = useRouter()

    // init vehicle isInfoShowing
    const initVehicles = (vehicles) => {
        console.log("initVehicle", vehicles);
        // Filter out vehicles that do not have lat and lng properties
        vehicles = vehicles.filter(
            (vehicle) =>
                vehicle.path[vehicle.path.length - 1].lat &&
                vehicle.path[vehicle.path.length - 1].lng
        );

        // share location
        // Assign the new field isInfoShowing = true to each vehicle
        return vehicles.map((vehicle) => {
            vehicle.isInfoShowing = true;
            vehicle.angle = 0;
            return vehicle;
        });
    }

    // search single vehicle
    const searchSingleVehicle = async () => {
        setIsLoading(true);
        const data = {
            token: accessToken.current

        }
        await axios
            .post("/api/v4/share-current-location-new", data)
            .then((res) => {
                const vehicle_marker_list = res.data.data;
                // setSelectedVehicles(vehicle_marker_list);

                setSelectedVehicles([
                    ...selectedVehicles,
                    ...initVehicles(vehicle_marker_list),
                ]);

                console.log("single res------", vehicle_marker_list);
            })
            .catch((err) => {
                console.log(err);
                if (err.response.status === 401) {
                    setIsTokenExpire(true)
                }
            })
            .finally(() => setIsLoading(false));
    };

    // long pulling
    const longPullingSearchVehicle = async () => {
        const data = {
            token: accessToken.current

        }
        await axios
            .post("/api/v4/share-current-location-path", data)
            .then((res) => {
                const vehicle_marker_list = res.data.data;
                console.log("long pulling res------", vehicle_marker_list);
                console.log("long pulling sVeh------", selectedVehicles);


                setSelectedVehicles((prevSelectedVehicles) => {
                    return prevSelectedVehicles.map((vehicle) => {
                        // const filteredVisibleVehicles = getFilteredVisibleVehicle(vehicle_marker_list)
                        const updateVehicle = vehicle_marker_list.find((marker) => {
                            return marker.v_identifier === vehicle.v_identifier;
                        });

                        if (updateVehicle) {
                            //========rotation
                            let rotation = vehicle.angle;
                            if (vehicle.path.length > 0) {
                                const heading =
                                    google?.maps?.geometry?.spherical?.computeHeading(
                                        new google.maps.LatLng(
                                            vehicle.path[vehicle.path.length - 1]
                                        ),
                                        new google.maps.LatLng(updateVehicle)
                                    );

                                console.log("heading", heading);

                                rotation = heading ? heading : rotation;
                                // rotation = heading ? calculateShortestRotation(vehicle.angle, heading) : rotation;
                            }
                            return {
                                ...vehicle,
                                angle: rotation,
                                path: [...vehicle.path, updateVehicle],
                            };
                        } else {
                            return vehicle;
                        }
                    });
                });
            })
            .catch((err) => {
                console.log(err);
                if (err.response.status === 401) {
                    setIsTokenExpire(true)
                }
            });
    };



    useEffect(() => {
        // create 10 sec interval and call searchMultipleVehicles function
        timeInterval.current = setInterval(() => {
            // selectedVehicles (previous 2)
            selectedVehicles.length && longPullingSearchVehicle();
            console.log('calling after 10 sec.....');
        }, 10000)
        return () => clearInterval(timeInterval.current)
        // selectedVehicles
    }, [selectedVehicles]);

    useEffect(() => {
        const token = router.asPath.split(/\?access=/)[1];
        console.log('call effect', token);
        accessToken.current = token;
        if (accessToken.current) {
            searchSingleVehicle()
        }
    }, [])

    // reset setTimeOut 
    useEffect(() => {
        if (isTokenExpire) {
            clearInterval(timeInterval.current)
            timeInterval.current = null
        }
    }, [isTokenExpire]);

    return (
        <div>
            {isTokenExpire ?
                <Unauthorized401 />
                // <div className="mx-w-4xl mx-auto p-6 mt-4">
                //     <div className='flex flex-col items-center justify-center bg-gray-200 h-60 rounded-2xl text-center p-4'>
                //         <p className='text-lg mb-4 '>We are sorry, your token has expired or is invalid.</p>
                //         <h4 className='text-center text-4xl font-bold text-quaternary'>401</h4>
                //     </div>
                // </div>
                :
                <ShareCurrentLocationMap
                    isLoading={isLoading}
                    height={"100vh"}
                    selectedVehicles={selectedVehicles}
                    setSelectedVehicles={setSelectedVehicles}
                />
            }
        </div>
    );
};

export default shareCurrentLocation;