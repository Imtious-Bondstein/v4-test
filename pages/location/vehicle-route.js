import React, { useEffect, useState } from "react";
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
// import VehicleRouteMap from "@/components/maps/VehicleRouteMap";

const vehicleRoute = () => {
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
          <VehicleRouteMap
            // height={"82.5vh"}
            title="Vehicle Route"
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
        </div>
        <div
          className={`${
            clicked === true ? "right-0" : "-right-96"
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
