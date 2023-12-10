import React, { useEffect, useRef, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import SingleVehicleSelector from "@/components/vehicleSelectors/SingleVehicleSelector";
import Layout from "@/components/layouts/Layout";
import dynamic from "next/dynamic";
const VehicleRouteMap = dynamic(
  () => import("@/components/maps/VehicleRouteMap"),
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
import VehicleRouteMapNew2 from "@/components/maps/VehicleRouteMapNew2";
import ShareVehicleRouteMap from "@/components/maps/ShareVehicleRouteMap";
import Unauthorized401 from "@/components/Unauthorized401";
// import VehicleRouteMap from "@/components/maps/VehicleRouteMap";

const shareVehicleRoute = () => {
  const [selectedVehicle, setSelectedVehicle] = useState({});
  const [showVehicleSelector, setShowVehicleSelector] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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

  const [isTokenExpire, setIsTokenExpire] = useState(false);
  const accessToken = useRef(null)
  const router = useRouter()

  //==========vehicle information end===========

  // const getSingleSelectedVehicle = async (vehicle, startDate, endDate) => {
  //   setSelectedVehicle(vehicle);
  //   await fetchSingleVehicleRoute(vehicle, startDate, endDate);
  // };

  // ======== selected vehicle api call
  const fetchSingleVehicleRoute = async () => {
    setIsLoading(true);

    const data = {
      token: accessToken.current
    };

    await axios
      .post("/api/v4/share-vehicle-route", data)
      .then((res) => {
        console.log("vehicle route ::", res.data);
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

        vehicleData.paths.length === 0 && emptyPathsNotify();
        // successNotify();
      })
      .catch((err) => {
        console.log("err.response", err);
        // console.log(err.response.statusText);
        errorNotify(err.response.statusText);
        if (err.response.status === 401) {
          setIsTokenExpire(true)
        }
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
    const token = router.asPath.split(/\?access=/)[1];
    console.log('call effect', token);
    accessToken.current = token;
    if (accessToken.current) {
      fetchSingleVehicleRoute()
    }
  }, [])


  return (
    <div>
      {isTokenExpire ?
        <Unauthorized401 />
        // <div className="mx-w-4xl mx-auto p-6 mt-4">
        //   <div className='flex flex-col items-center justify-center bg-gray-200 h-60 rounded-2xl text-center p-4'>
        //     <p className='text-lg mb-4 '>We are sorry, your token has expired or is invalid.</p>
        //     <h4 className='text-center text-4xl font-bold text-quaternary'>401</h4>
        //   </div>
        // </div>
        :
        <ShareVehicleRouteMap
          // height={"82.5vh"}
          paths={paths}
          parking={parkingMarker}
          speed={speedMarker}
          brake={brakeMarker}
          power={powerMarker}
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
      }
    </div>
  );
};

export default shareVehicleRoute;
