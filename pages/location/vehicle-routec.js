import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import SingleVehicleSelector from "@/components/vehicleSelectors/SingleVehicleSelector";
import Layout from "@/components/layouts/Layout";
import dynamic from "next/dynamic";
const VehicleRouteMap = dynamic(
    () => import("@/components/maps/VehicleRouteMapOld"),
    {
        ssr: false,
    }
);
// import VehicleRouteMap from "@/components/maps/VehicleRouteMap";
import DownArrowSVG from "@/components/SVG/DownArrowSVG";
import UpArrowSVG from "@/components/SVG/UpArrowSVG";
import Advertisement from "@/components/Advertisement";
import VehicleStatusColor from "@/components/VehicleStatusColor";
import VehicleRoutesDetailsTable from "@/components/VehicleRoutesDetailsTable";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import baseUrl from "@/plugins/baseUrl";
import axios from "@/plugins/axios";
import { vehicleRouteDateTimePicker } from "@/utils/dateTimeConverter";
import VehicleRouteMapC from "@/components/maps/VehicleRouteMapC";

const vehicleRoute = () => {
    const [selectedVehicle, setSelectedVehicle] = useState({});
    const [showVehicleSelector, setShowVehicleSelector] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    //==========vehicle information start===========
    // const [paths, setPaths] = useState([
    //   { lat: 23.800348, lng: 90.401833, speed: 50, time: "1AM" },
    //   { lat: 23.799789, lng: 90.401811, speed: 152, time: "2AM" },
    //   { lat: 23.79921, lng: 90.401726, speed: 123, time: "3AM" },
    //   { lat: 23.798955, lng: 90.403131, speed: 87, time: "4AM" },
    //   { lat: 23.798719, lng: 90.404794, speed: 168, time: "5AM" },
    //   { lat: 23.798356, lng: 90.405727, speed: 79, time: "6AM" },
    //   { lat: 23.798069, lng: 90.406325, speed: 23, time: "7AM" },
    //   { lat: 23.798237, lng: 90.406415, speed: 116, time: "8AM" },
    //   { lat: 23.798422, lng: 90.406501, speed: 93, time: "11AM" },
    //   { lat: 23.799131, lng: 90.406854, speed: 192, time: "1PM" },
    //   { lat: 23.799461, lng: 90.407006, speed: 36, time: "2PM" },
    //   { lat: 23.799696, lng: 90.407113, speed: 85, time: "3PM" },
    //   { lat: 23.800027, lng: 90.407228, speed: 56, time: "4PM" },
    //   { lat: 23.800345, lng: 90.407352, speed: 198, time: "1AM" },
    //   { lat: 23.800438, lng: 90.407479, speed: 150, time: "1AM" },
    //   { lat: 23.800459, lng: 90.407738, speed: 70, time: "1AM" },
    //   { lat: 23.800461, lng: 90.407997, speed: 89, time: "1AM" },
    //   { lat: 23.800699, lng: 90.408005, speed: 23, time: "1AM" },
    //   { lat: 23.800987, lng: 90.408012, speed: 45, time: "1AM" },
    //   { lat: 23.80118, lng: 90.40802, speed: 78, time: "1AM" },
    //   { lat: 23.801466, lng: 90.408025, speed: 36, time: "1AM" },
    //   { lat: 23.801466, lng: 90.408035, speed: 10, time: "1AM" },
    //   { lat: 23.801845, lng: 90.40804, speed: 7, time: "1AM" },
    //   { lat: 23.801981, lng: 90.408056, speed: 9, time: "1AM" },
    //   { lat: 23.801949, lng: 90.409453, speed: 0, time: "1AM" },
    //   { lat: 23.80204, lng: 90.410703, speed: 20, time: "1AM" },
    //   { lat: 23.802175, lng: 90.411412, speed: 26, time: "1AM" },
    //   { lat: 23.80264, lng: 90.41126, speed: 89, time: "1AM" },
    //   { lat: 23.803338, lng: 90.41101, speed: 65, time: "1AM" },
    //   { lat: 23.803808, lng: 90.410852, speed: 23, time: "1AM" },
    //   { lat: 23.804004, lng: 90.411363, speed: 89, time: "1AM" },
    //   { lat: 23.804074, lng: 90.411626, speed: 153, time: "1AM" },
    //   { lat: 23.804086, lng: 90.412404, speed: 90, time: "1AM" },
    //   { lat: 23.804049, lng: 90.413525, speed: 99, time: "1AM" },
    //   { lat: 23.804049, lng: 90.413525, speed: 80, time: "1AM" },
    //   { lat: 23.805363, lng: 90.413897, speed: 78, time: "1AM" },
    //   { lat: 23.805358, lng: 90.415528, speed: 76, time: "1AM" },
    //   { lat: 23.806257, lng: 90.415372, speed: 69, time: "1AM" },
    //   { lat: 23.806588, lng: 90.415679, speed: 50, time: "1AM" },
    //   { lat: 23.806708, lng: 90.415536, speed: 46, time: "1AM" },
    //   { lat: 23.806997, lng: 90.415424, speed: 20, time: "1AM" },
    //   { lat: 23.807192, lng: 90.415342, speed: 10, time: "1AM" },
    //   { lat: 23.807499, lng: 90.415107, speed: 23, time: "1AM" },
    //   { lat: 23.807657, lng: 90.414942, speed: 56, time: "1AM" },
    //   { lat: 23.808066, lng: 90.414411, speed: 69, time: "1AM" },
    //   { lat: 23.808805, lng: 90.413592, speed: 80, time: "1AM" },
    //   { lat: 23.809332, lng: 90.413136, speed: 120, time: "1AM" },
    //   { lat: 23.809786, lng: 90.413088, speed: 100, time: "1AM" },
    //   { lat: 23.810773, lng: 90.413059, speed: 99, time: "1AM" },
    //   { lat: 23.812375, lng: 90.412954, speed: 66, time: "1AM" },
    //   { lat: 23.813744, lng: 90.412884, speed: 50, time: "1AM" },
    //   { lat: 23.814743, lng: 90.412839, speed: 49, time: "1AM" },
    //   { lat: 23.815215, lng: 90.412828, speed: 30, time: "1AM" },
    //   { lat: 23.815221, lng: 90.41293, speed: 20, time: "1AM" },
    // ]);

    // const [parkingMarker, setParkingMarker] = useState([
    //   { lat: 23.798719, lng: 90.404794 },
    //   { lat: 23.800438, lng: 90.407479 },
    // ]);
    // const [speedMarker, setSpeedMarker] = useState([
    //   { lat: 23.80204, lng: 90.410703 },
    //   { lat: 23.804049, lng: 90.413525 },
    // ]);
    // const [brakeMarker, setBrakeMarker] = useState([
    //   { lat: 23.808805, lng: 90.413592 },
    //   { lat: 23.813744, lng: 90.412884 },
    // ]);
    // const [powerMarker, setPowerMarker] = useState([
    //   { lat: 23.799789, lng: 90.401811 },
    // ]);

    const [paths, setPaths] = useState([]);
    const [parkingMarker, setParkingMarker] = useState([]);
    const [speedMarker, setSpeedMarker] = useState([]);
    const [brakeMarker, setBrakeMarker] = useState([]);
    const [powerMarker, setPowerMarker] = useState([]);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [averageSpeed, setAverageSpeed] = useState("");
    const [maxSpeed, setMaxSpeed] = useState("");
    const [vehicleRoute, setVehicleRoute] = useState("");
    const [vehicleDetails, setVehicleDetails] = useState(null);
    const [clicked, setClicked] = useState(false);

    //==========vehicle information end===========

    const getSingleSelectedVehicle = async (vehicle, startDate, endDate) => {
        setSelectedVehicle(vehicle);
        await fetchSingleVehicleRoute(vehicle, startDate, endDate);
    };

    // ======== selected vehicle api call
    const fetchSingleVehicleRoute = async (vehicle, startDate, endDate) => {
        setIsLoading(true);

        const data = {
            start_date_time: vehicleRouteDateTimePicker(startDate),
            end_date_time: vehicleRouteDateTimePicker(endDate),
            identifier: vehicle.v_identifier,
        };

        await axios
            .post("/api/v4/vehicle-route-search", data)
            .then((res) => {
                const vehicleData = res.data;
                setPaths(vehicleData.paths);
                setParkingMarker(vehicleData.parking);
                setSpeedMarker(vehicleData.overspeed);
                setBrakeMarker(vehicleData.harsh_brake);
                setPowerMarker(vehicleData.engine_status);
                setStartDate(vehicleData.from);
                setEndDate(vehicleData.to);
                setAverageSpeed(vehicleData.average_speed);
                setMaxSpeed(vehicleData.maximum_speed);
                setVehicleRoute(vehicleData.vehicle_route);
                setVehicleDetails(vehicleData.vehicle_details);
                console.log("vehicle route ::", res.data);
                vehicleData.paths.length === 0 && emptyPathsNotify();
                // successNotify();
            })
            .catch((err) => {
                console.log("err.response", err.response);
                console.log(err.response.statusText);
                errorNotify(err.response.statusText);
            })
            .finally(() => setIsLoading(false));
    };

    const successNotify = () => {
        toast.success("Data loaded!", {
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    };

    const emptyPathsNotify = () => {
        toast.warning("Not sufficient data to render the vehicle route.", {
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    };

    const errorNotify = (mgs) => {
        toast.error(mgs, {
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    };

    // CHECK FOR OUTSIDE CLICK FOR SELECTOR
    const handleOutsideSelectorClick = () => {
        setClicked(false);
    };

    useEffect(() => {
        // if (!isLoggedin) {
        //   router.push("/signin");
        // }
        console.log("selected vehicle:---", selectedVehicle);
    }, [selectedVehicle]);

    return (
        <div>
            <div className="flex justify-between items-center ">
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
                <div className="grow overflow-hidden mb-6">
                    <VehicleRouteMapC
                        isShareMap={false}
                        // height={"82.5vh"}
                        title="Vehicle Route"
                        paths={paths}
                        parkingMarker={parkingMarker}
                        speedMarker={speedMarker}
                        brakeMarker={brakeMarker}
                        powerMarker={powerMarker}
                        startDate={startDate}
                        endDate={endDate}
                        averageSpeed={averageSpeed}
                        maxSpeed={maxSpeed}
                        vehicleRoute={vehicleRoute}
                        vehicleDetails={vehicleDetails}
                        isLoading={isLoading}
                        emptyPathsNotify={emptyPathsNotify}
                        errorNotify={errorNotify}
                        successNotify={successNotify}
                    />
                </div>
                <div
                    className={`${clicked === true ? "right-0" : "-right-96"
                        } flex-none fixed lg:static lg:ml-4 lg:right-10 top-16 lg:shadow-none ease-in-out duration-700 rounded-3xl z-[3004] lg:z-40`}
                >
                    {/* <div className="flex-none lg:static fixed right-10 top-32 lg:ml-4 ml-0 lg:shadow-none shadow pt-[50px] "> */}
                    <div className={!showVehicleSelector ? "hidden" : ""}>
                        <SingleVehicleSelector
                            isRequesting={isLoading}
                            getSingleSelectedVehicle={getSingleSelectedVehicle}
                            clicked={clicked}
                            setClicked={setClicked}
                        />
                    </div>
                    <div className="mt-5 lg:mt-20 hidden md:block">
                        <VehicleRoutesDetailsTable
                            startDate={startDate}
                            endDate={endDate}
                            vehicleRoute={vehicleRoute}
                            maxSpeed={maxSpeed}
                            averageSpeed={averageSpeed}
                        />
                    </div>
                </div>
            </div>

            <div className="h-20"></div>
            {/* <ToastContainer /> */}
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

export default vehicleRoute;

vehicleRoute.getLayout = function getLayout(page) {
    return (
        <ProtectedRoute>
            <Layout>
                <DashboardLayout>{page}</DashboardLayout>
            </Layout>
        </ProtectedRoute>
    );
};
