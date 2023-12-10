import React, { useEffect, useRef, useState } from "react";

import Advertisement from "@/components/Advertisement";
import CurrentLocationMap from "@/components/maps/CurrentLocationMapOld";
import Layout from "@/components/layouts/Layout";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import DownArrowSVG from "@/components/SVG/DownArrowSVG";
import UpArrowSVG from "@/components/SVG/UpArrowSVG";

import { useSelector } from "react-redux";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";

import baseUrl from "@/plugins/baseUrl";
import CurrentLocationMultipleVehicleSelector from "@/components/vehicleSelectors/CurrentLocationMultipleVehicleSelector";
import axios from "@/plugins/axios";

const currentLocation = () => {
    const [selectedVehicles, setSelectedVehicles] = useState([]);
    const [allSelectedVehicles, setAllSelectedVehicles] = useState([]);
    const [allSelectedVehiclesClick, setAllSelectedVehiclesClick] =
        useState(false);
    const [visibleSelectedVehicles, setVisibleSelectedVehicles] = useState([]);
    const [showVehicleSelector, setShowVehicleSelector] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const timeInterval = useRef(null);
    const [clicked, setClicked] = useState(false);
    const [xlScreen, setXlScreen] = useState(false);

    const token = useSelector((state) => state.reducer.auth.token);

    const getSingleSelectedVehicle = (vehicle) => {
        // clear interval
        clearInterval(timeInterval.current);

        console.log("getSingleSelectedVehicle", vehicle);
        if (vehicle.selected) {
            searchSingleVehicle(vehicle.v_identifier);
            // setSelectedVehicles([...selectedVehicles, vehicle]);
        } else {
            setSelectedVehicles(
                selectedVehicles.filter(
                    (selectedVehicle) =>
                        selectedVehicle.v_identifier !== vehicle.v_identifier
                )
            );
        }
    };

    const getMultipleSelectedVehicles = (allVehicles) => {
        // clear interval
        clearInterval(timeInterval.current);
        console.log("all vehicle", allVehicles);

        if (allVehicles.length) {
            const concatenatedIdentifiers = allVehicles
                .map((vehicle) => vehicle.v_identifier)
                .join(",");
            // console.log("concatenatedIdentifiers:", concatenatedIdentifiers);
            searchMultipleVehicles(concatenatedIdentifiers);
        } else {
            setSelectedVehicles([]);
        }
        setAllSelectedVehicles(allVehicles.length);
        setAllSelectedVehiclesClick(true);
    };

    // const removeUnselectedVehicles = (vehicles) => {
    //   console.log("selected vehicle***", selectedVehicles);
    //   return selectedVehicles.filter(
    //     (vehicle) =>
    //       !vehicles.find(
    //         ({ v_identifier }) => vehicle.v_identifier === v_identifier
    //       )
    //   );
    // };

    // init vehicle isInfoShowing
    const initVehicles = (vehicles) => {
        // vehicles object array assign new field isInfoShowing = false and return array of vehicles
        return vehicles.map((vehicle) => {
            vehicle.isInfoShowing = false;
            return vehicle;
        });
    };

    // search multiple vehicle
    const searchMultipleVehicles = async (id) => {
        setIsLoading(true);

        const data = {
            identifier: id,
        };
        await axios
            .post("/api/v4/current-location", data)
            .then((res) => {
                const vehicle_marker_list = res.data.data;
                setSelectedVehicles(initVehicles(vehicle_marker_list));
                // setSelectedVehicles([...selectedVehicles, ...vehicle_marker_list]);
                console.log("multi res------", vehicle_marker_list);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => setIsLoading(false));
    };

    // search single vehicle
    const searchSingleVehicle = async (id) => {
        setIsLoading(true);

        const data = {
            identifier: id,
        };
        await axios
            .post("/api/v4/current-location", data)
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
            })
            .finally(() => setIsLoading(false));
    };

    // long pulling
    const longPullingSearchVehicle = async (id) => {
        const data = {
            identifier: id,
        };
        await axios
            .post("/api/v4/current-location", data)
            .then((res) => {
                const vehicle_marker_list = res.data.data;
                console.log("long pulling res------", vehicle_marker_list);
                console.log("long pulling sVeh------", selectedVehicles);
                // vehicle_marker_list.forEach((updateVehicle) => {
                //   const updatedVehiclesData = selectedVehicles.map((vehicle) => {
                //     if (updateVehicle.v_identifier === vehicle.v_identifier) {
                //       return {
                //         ...vehicle,
                //         lat: updateVehicle.lat,
                //         lng: updateVehicle.lng,
                //         device_status: updateVehicle.device_status,
                //         engine_status: updateVehicle.engine_status,
                //         nearby_l_name: updateVehicle.nearby_l_name,
                //         speed_status: updateVehicle.speed_status,
                //         time_inserted: updateVehicle.time_inserted,
                //       };
                //     }
                //   });
                //   console.log("long pulling date:-----", updatedVehiclesData);
                //   // setSelectedVehicles(updatedVehiclesData);
                // });

                // ===========new code
                setSelectedVehicles((prevSelectedVehicles) => {
                    return prevSelectedVehicles.map((vehicle) => {
                        const updateVehicle = vehicle_marker_list.find((marker) => {
                            return marker.v_identifier === vehicle.v_identifier;
                        });

                        if (updateVehicle) {
                            return {
                                ...vehicle,
                                lat: updateVehicle.lat,
                                lng: updateVehicle.lng,
                                device_status: updateVehicle.device_status,
                                engine_status: updateVehicle.engine_status,
                                nearby_l_name: updateVehicle.nearby_l_name,
                                speed_status: updateVehicle.speed_status,
                                time_inserted: updateVehicle.time_inserted,
                            };
                        } else {
                            return vehicle;
                        }
                    });
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const selectedVehiclesIdentifier = (vehicles) => {
        return vehicles.map((vehicle) => vehicle.v_identifier).join(",");
    };

    //===========get vehicles from map bounds==========
    const getMapBoundVehicles = (vehicles) => {
        setVisibleSelectedVehicles(vehicles);
        // console.log("vehicles in map bounds", vehicles);
    };

    // CHECK FOR OUTSIDE CLICK FOR SELECTOR
    const handleOutsideSelectorClick = () => {
        setClicked(false);
    };

    useEffect(() => {
        // create 10 sec interval and call searchMultipleVehicles function
        timeInterval.current = setInterval(() => {
            // selectedVehicles (previous 2)
            visibleSelectedVehicles.length &&
                longPullingSearchVehicle(
                    selectedVehiclesIdentifier(visibleSelectedVehicles)
                );
            console.log("calling after 10 sec.....");
        }, 10000);
        return () => clearInterval(timeInterval.current);
        // selectedVehicles
    }, [visibleSelectedVehicles]);

    // Search button click check for mobile
    const handleSearch = () => {
        !clicked ? setClicked(true) : setClicked(false);
    };

    return (
        <div className="current-location overflow-hidden">
            <div className="flex justify-between items-center">
                <div className="flex justify-end">
                    <div
                        onClick={() => setShowVehicleSelector(!showVehicleSelector)}
                        className="hidden cursor-pointer"
                    >
                        {showVehicleSelector ? <DownArrowSVG /> : <UpArrowSVG />}
                    </div>
                </div>
            </div>
            <div className="flex">
                <div className="grow overflow-hidden ">
                    <CurrentLocationMap
                        isShareMap={false}
                        height={"77.5vh"}
                        title="Current Location"
                        selectedVehicles={selectedVehicles}
                        setSelectedVehicles={setSelectedVehicles}
                        getMapBoundVehicles={getMapBoundVehicles}
                        xlScreen={xlScreen}
                    />
                </div>
                <div
                    className={`${clicked === true ? "right-0" : "-right-96"} ${xlScreen === true
                        ? "xl:z-40 xl:right-10 xl:shadow-none xl:flex-none xl:block xl:static xl:ml-4"
                        : "lg:z-40 lg:right-10 lg:shadow-none lg:static lg:ml-4"
                        } flex-none fixed top-16 lg:top-40 ml-0 ease-in-out duration-700 rounded-3xl z-[3004] lg:mt-8`}
                >
                    <div className={!showVehicleSelector ? "hidden" : ""}>
                        <CurrentLocationMultipleVehicleSelector
                            isSelected={false}
                            isRequesting={isLoading}
                            getMultipleSelectedVehicles={getMultipleSelectedVehicles}
                            getSingleSelectedVehicle={getSingleSelectedVehicle}
                            clicked={clicked}
                            setClicked={setClicked}
                            top={true}
                            height={530}
                            xlScreen={xlScreen}
                        />
                        {/* <DateRangeMultipleVehicleSelect
                getSelectedVehicle={getSelectedVehicle}
                getAllVehicles={getAllVehicles}
                height={530}
              /> */}
                    </div>
                </div>
            </div>

            {/* ========== advertisement ========  */}
            <div className="py-5 xs:py-10">
                <Advertisement />
            </div>
            {/* ============ vehicle status coloe ========== */}
            {/* <VehicleStatusColor /> */}
            {/* =========== Blur filter =========== */}
            {!clicked ? (
                ""
            ) : (
                <div
                    onClick={() => handleOutsideSelectorClick()}
                    className="lg:hidden blur-filter"
                ></div>
            )}
        </div>
    );
};

export default currentLocation;

currentLocation.getLayout = function getLayout(page) {
    return (
        <ProtectedRoute>
            <Layout>
                <DashboardLayout>{page}</DashboardLayout>
            </Layout>
        </ProtectedRoute>
    );
};
