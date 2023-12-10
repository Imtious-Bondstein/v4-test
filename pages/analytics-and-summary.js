import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

// ===== layout
import Layout from "@/components/layouts/Layout";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";
// ===== charts
import ReactECharts from "echarts-for-react";
const TraveledDistanceChart = dynamic(
  () => import("../components/charts/TraveledDistanceChart"),
  {
    ssr: false,
  }
);
const TripChart = dynamic(() => import("../components/charts/TripChart"), {
  ssr: false,
});
import TotalVehicleChart from "@/components/charts/TotalVehicleChart";

//======= store
import { useSelector } from "react-redux";

// ======= map
import CurrentLocationMap from "@/components/maps/CurrentLocationMap";

// ======= axios
import axios from "@/plugins/axios";

//======= utils
import generateGreetingMgs from "@/utils/greetingMessage";
import { sevenDaysTravelDistance, sevenDaysTrips } from "@/utils/lastSevenDays";

//======= other components
import SelectedVehicles from "@/components/SelectedVehicles";
import Weather from "@/components/Weather";
import FavoriteUrl from "@/components/FavoriteUrl";
import ShortAlertSummaryTable from "@/components/tables/ShortAlertSummaryTable";
// import { useDetectClickOutside } from "react-detect-click-outside";
import AnalyticsSummaryMultipleVehicleSelector from "@/components/vehicleSelectors/AnalyticsSummaryMultipleVehicleSelector";

//====== toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ===== styles
import "../styles/pages/AnalyticsSummary.css";

//========img
import advertisementH from "../public/images/addvertisementH.png";
import advertisementV from "../public/images/addvertisement.png";

// // GA4
import ReactGA from "react-ga4";

const AnalyticsAndSummary = () => {
  const [selectedIdentifiers, setSelectedIdentifiers] = useState([]);
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [visibleSelectedVehicles, setVisibleSelectedVehicles] = useState([]);

  const [isSelectMultiple, setIsSelectMultiple] = useState(false);
  const [isVehicleSelectorLoading, setIsVehicleSelectorLoading] =
    useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTravelDistance, setIsLoadingTravelDistance] = useState(false);
  const [isLoadingPieChart, setIsLoadingPieChart] = useState(false);

  const [isLoadingAlertSummary, setIsLoadingAlertSummary] = useState(false);
  const [isLoadingTrips, setIsLoadingTrips] = useState(false);

  const timeInterval = useRef(null);

  // ========= chart state=========
  const [totalVehicles, setTotalVehicles] = useState({});
  const [totalTrips, setTotalTrips] = useState({});
  const [traveledDistance, setTraveledDistance] = useState({});
  const [alertSummary, setAlertSummary] = useState({});

  const [clicked, setClicked] = useState(false);
  const [xlScreen, setXlScreen] = useState(true);
  // const [isSelectedAll, setIsSelectedAll] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [showZoomINMap, setShowZoomINMap] = useState(false);

  const currentMapBoundsRef = useRef(null);

  // GA4
  const GA4_ID = "G-QGVLE543S7";
  ReactGA.initialize(GA4_ID);
  ReactGA.send({
    hitType: "pageview",
    page: window.location.pathname,
    title: "Dashboard",
  });

  //=========store========
  const loggedInUser = useSelector((state) => state.reducer.auth.user);

  const getSingleSelectedVehicle = (vehicle) => {
    setIsSelectMultiple(false);

    // clear interval
    clearInterval(timeInterval.current);

    console.log("getSingleSelectedVehicle", vehicle);
    if (vehicle.selected) {
      // ============set single identifier
      setSelectedIdentifiers([...selectedIdentifiers, vehicle.v_identifier]);
      searchSingleVehicle(vehicle.v_identifier);
    } else {
      // ============remove single identifier
      setSelectedIdentifiers(
        selectedIdentifiers.filter(
          (identifier) => identifier !== vehicle.v_identifier
        )
      );

      setSelectedVehicles(
        selectedVehicles.filter(
          (selectedVehicle) =>
            selectedVehicle.v_identifier !== vehicle.v_identifier
        )
      );

      //==========visible vehicle
      setVisibleSelectedVehicles(
        selectedVehicles.filter(
          (selectedVehicle) =>
            selectedVehicle.v_identifier !== vehicle.v_identifier
        )
      );
    }
  };

  const getMultipleSelectedVehicles = (allVehicles) => {
    setIsSelectMultiple(true);
    // clear interval
    clearInterval(timeInterval.current);
    console.log("all vehicle", allVehicles);

    if (allVehicles.length) {
      const concatenatedIdentifiers = allVehicles
        .map((vehicle) => vehicle.v_identifier)
        .join(",");
      // console.log("concatenatedIdentifiers:", concatenatedIdentifiers);
      searchMultipleVehicles(concatenatedIdentifiers);

      // ============set multiple identifier
      setSelectedIdentifiers([
        ...allVehicles.map((vehicle) => vehicle.v_identifier),
      ]);
    } else {
      setSelectedVehicles([]);
      // ============remove multiple identifier
      setSelectedIdentifiers([]);
      //==========visible vehicle
      setVisibleSelectedVehicles([]);
    }
  };

  // init vehicle isInfoShowing
  const initVehicles = (vehicles) => {
    // Filter out vehicles that do not have lat and lng properties
    // vehicles = vehicles.filter((vehicle) => vehicle.lat && vehicle.lng);
    vehicles = vehicles.filter(
      (vehicle) =>
        vehicle.path[vehicle.path.length - 1].lat &&
        vehicle.path[vehicle.path.length - 1].lng
    );

    // Assign the new field isInfoShowing = false to each vehicle
    return vehicles.map((vehicle) => {
      vehicle.isInfoShowing = false;
      vehicle.angle = 0;
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
      .post("/api/v4/current-location-new", data)
      .then((res) => {
        const vehicle_marker_list = res.data.data;
        setSelectedVehicles(initVehicles(vehicle_marker_list));
        // setSelectedVehicles([...selectedVehicles, ...vehicle_marker_list]);
        console.log("multi res------", vehicle_marker_list);
      })
      .catch((err) => {
        console.log(err);
        errorNotify(err.response.data?.user_message);
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
      .post("/api/v4/current-location-new", data)
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
        errorNotify(err.response.data?.user_message);
      })
      .finally(() => setIsLoading(false));
  };

  // long pulling
  const longPullingSearchVehicle = async (id) => {
    const data = {
      identifier: id,
    };
    await axios
      .post("/api/v4/current-location-path", data)
      .then((res) => {
        const vehicle_marker_list = res.data.data;
        console.log("long pulling res------", vehicle_marker_list);
        console.log("long pulling sVeh------", visibleSelectedVehicles);

        filteredVisibleVehicle(vehicle_marker_list);

        const updateVehicleData = (vehicle) => {
          const updateVehicle = vehicle_marker_list.find(
            (marker) => marker.v_identifier === vehicle.v_identifier
          );

          if (updateVehicle) {
            //========rotation
            let rotation = vehicle.angle;
            if (vehicle.path.length > 1) {
              const heading = google?.maps?.geometry?.spherical?.computeHeading(
                new google.maps.LatLng(vehicle.path[vehicle.path.length - 1]),
                new google.maps.LatLng(updateVehicle)
              );
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
        };

        setSelectedVehicles((prevSelectedVehicles) =>
          prevSelectedVehicles.map((vehicle) => updateVehicleData(vehicle))
        );

        setVisibleSelectedVehicles((prevVisibleSelectedVehicles) =>
          prevVisibleSelectedVehicles.map((vehicle) =>
            updateVehicleData(vehicle)
          )
        );

        // setSelectedVehicles((prevSelectedVehicles) => {
        //   return prevSelectedVehicles.map((vehicle) => {
        //     // const filteredVisibleVehicles = getFilteredVisibleVehicle(vehicle_marker_list)
        //     const updateVehicle = vehicle_marker_list.find((marker) => {
        //       return marker.v_identifier === vehicle.v_identifier;
        //     });

        //     if (updateVehicle) {
        //       //========rotation
        //       let rotation = vehicle.angle;
        //       if (vehicle.path.length > 1) {
        //         const heading =
        //           google?.maps?.geometry?.spherical?.computeHeading(
        //             new google.maps.LatLng(
        //               vehicle.path[vehicle.path.length - 1]
        //             ),
        //             new google.maps.LatLng(updateVehicle)
        //           );

        //         console.log("heading", heading);

        //         rotation = heading ? heading : rotation;
        //         // rotation = heading ? calculateShortestRotation(vehicle.angle, heading) : rotation;
        //       }
        //       return {
        //         ...vehicle,
        //         angle: rotation,
        //         path: [...vehicle.path, updateVehicle],
        //       };
        //     } else {
        //       return vehicle;
        //     }
        //   });
        // });

        // //==========visible vehicle
        // setVisibleSelectedVehicles((prevVisibleSelectedVehicles) => {
        //   return prevVisibleSelectedVehicles.map((vehicle) => {
        //     const updateVehicle = vehicle_marker_list.find((marker) => {
        //       return marker.v_identifier === vehicle.v_identifier;
        //     });

        //     if (updateVehicle) {
        //       //========rotation
        //       let rotation = vehicle.angle;
        //       if (vehicle.path.length > 1) {
        //         const heading =
        //           google?.maps?.geometry?.spherical?.computeHeading(
        //             new google.maps.LatLng(
        //               vehicle.path[vehicle.path.length - 1]
        //             ),
        //             new google.maps.LatLng(updateVehicle)
        //           );

        //         console.log("heading", heading);

        //         rotation = heading ? heading : rotation;
        //         // rotation = heading ? calculateShortestRotation(vehicle.angle, heading) : rotation;

        //         console.log("rotation", rotation);
        //       }

        //       return {
        //         ...vehicle,
        //         angle: rotation,
        //         path: [...vehicle.path, updateVehicle],
        //       };
        //     } else {
        //       return vehicle;
        //     }
        //   });
        // });
      })
      // .then(async () => await getMapBoundVehicles())
      .catch((err) => {
        console.log(err);
      });
  };
  // const longPullingSearchVehicle = async (id) => {
  //   const data = {
  //     identifier: id,
  //   };
  //   await axios
  //     .post("/api/v4/current-location", data)
  //     .then((res) => {
  //       const vehicle_marker_list = res.data.data;
  //       // console.log("long pulling res------", vehicle_marker_list);
  //       // console.log("long pulling sVeh------", selectedVehicles);
  //       // ===========new code
  //       setSelectedVehicles((prevSelectedVehicles) => {
  //         return prevSelectedVehicles.map((vehicle) => {
  //           const updateVehicle = vehicle_marker_list.find((marker) => {
  //             return marker.v_identifier === vehicle.v_identifier;
  //           });

  //           if (updateVehicle) {
  //             return {
  //               ...vehicle,
  //               lat: updateVehicle.lat,
  //               lng: updateVehicle.lng,
  //               device_status: updateVehicle.device_status,
  //               engine_status: updateVehicle.engine_status,
  //               nearby_l_name: updateVehicle.nearby_l_name,
  //               speed_status: updateVehicle.speed_status,
  //               time_inserted: updateVehicle.time_inserted,
  //             };
  //           } else {
  //             return vehicle;
  //           }
  //         });
  //       });

  //       //==========visible vehicle
  //       setVisibleSelectedVehicles((prevVisibleSelectedVehicles) => {
  //         return prevVisibleSelectedVehicles.map((vehicle) => {
  //           const updateVehicle = vehicle_marker_list.find((marker) => {
  //             return marker.v_identifier === vehicle.v_identifier;
  //           });

  //           if (updateVehicle) {
  //             return {
  //               ...vehicle,
  //               lat: updateVehicle.lat,
  //               lng: updateVehicle.lng,
  //               device_status: updateVehicle.device_status,
  //               engine_status: updateVehicle.engine_status,
  //               nearby_l_name: updateVehicle.nearby_l_name,
  //               speed_status: updateVehicle.speed_status,
  //               time_inserted: updateVehicle.time_inserted,
  //             };
  //           } else {
  //             return vehicle;
  //           }
  //         });
  //       });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  //===========get map bounds==========
  const getMapBounds = async (bounds) => {
    currentMapBoundsRef.current = bounds;
    console.log("bound---", bounds);
    await getMapBoundVehicles();
  };

  const filteredVisibleVehicle = (vehicles) => {
    const visibleVehicles = vehicles.filter((vehicle) =>
      selectedVehicles.length > 1
        ? currentMapBoundsRef.current.contains({
            lat: vehicle.lat,
            lng: vehicle.lng,
          })
        : vehicle
    );

    //======remove marker if lat, lng pass the bounds
    const filteredSelectedVehicles = visibleSelectedVehicles.filter(
      (selectedVehicle) => {
        const { v_identifier } = selectedVehicle;
        return visibleVehicles.some(
          (visibleVehicle) => visibleVehicle.v_identifier === v_identifier
        );
      }
    );

    setVisibleSelectedVehicles(filteredSelectedVehicles);

    // setVisibleVehicles(visibleMarkers)
    console.log("visible Vehicle:-", visibleSelectedVehicles);
    // return visibleVehicles;
  };

  const selectedVehiclesIdentifier = (vehicles) => {
    return vehicles.map((vehicle) => vehicle.v_identifier).join(",");
  };

  //===========get vehicles from map bounds==========
  const getMapBoundVehicles = async () => {
    if (currentMapBoundsRef.current) {
      const visibleVehicles = selectedVehicles.filter((vehicle) =>
        selectedVehicles.length > 1
          ? currentMapBoundsRef.current.contains({
              lat: parseFloat(vehicle.path[vehicle.path.length - 1].lat),
              lng: parseFloat(vehicle.path[vehicle.path.length - 1].lng),
            })
          : vehicle
      );
      // setVisibleVehicles(visibleMarkers)
      console.log("visibleMarkers:-", visibleVehicles);
      // return visibleVehicles;

      setVisibleSelectedVehicles(visibleVehicles);
      visibleVehicles.length === 1 ? setShowZoomINMap(true) : "";
    }
    // console.log("vehicles in map bounds", vehicles);
  };

  //==========init pie chart==========
  const initTotalVehicles = (numberOfVehicles) => {
    const updateNumberOfVehiclesData = numberOfVehicles.data.map((vehicle) => {
      return {
        ...vehicle,
        name: vehicle.name.includes("-")
          ? vehicle.name.split("-")[1]
          : vehicle.name,
      };
    });
    const updateNumberOfVehicles = {
      ...numberOfVehicles,
      data: updateNumberOfVehiclesData,
    };
    setTotalVehicles(updateNumberOfVehicles);
    // console.log('init pie', updateNumberOfVehicles);
  };

  //======== fetch pie chart ==========
  const fetchPieChart = async () => {
    setIsLoadingPieChart(true);
    await axios
      .get("/api/v4/analytics-summary/vehicle-status")
      .then((res) => {
        const numberOfVehicles = res.data;
        initTotalVehicles(numberOfVehicles);
        // setTotalVehicles(numberOfVehicles);
        console.log("pie chart ---", numberOfVehicles);
      })
      .catch((err) => {
        console.log(err);
        errorNotify(err.response?.statusText);
      })
      .finally(() => {
        setIsLoadingPieChart(false);
      });
  };

  //========fetch Traveled Distance ==========
  const fetchTraveledDistance = async () => {
    setIsLoadingTravelDistance(true);
    const data = {
      identifier: selectedIdentifiers.join(","),
    };
    console.log("====TRAVELED DISTANCE REQUEST====", data);
    await axios
      .post("/api/v4/analytics-summary/seven-days-travel-distance", data)
      .then((res) => {
        const travelDistanceData = res.data;
        setTraveledDistance(travelDistanceData);
        console.log("====TRAVELED DISTANCE RESPONSE====", travelDistanceData);
      })
      .catch((err) => {
        console.log(err);
        errorNotify(err?.response?.data?.user_message);
      })
      .finally(() => {
        setIsLoadingTravelDistance(false);
      });
  };

  //======== fetch alert Summary==========
  const fetchAlertSummary = async () => {
    setIsLoadingAlertSummary(true);
    const data = {
      identifier: selectedIdentifiers.join(","),
    };
    console.log("====ALERT SUMMARY REQUEST====", data);
    await axios
      .post("/api/v4/analytics-summary/seven-days-alert-summary", data)
      .then((res) => {
        const alertSummaryData = res.data;
        setAlertSummary(alertSummaryData);
        console.log("==== ALERT SUMMARY RESPONSE ====", alertSummaryData);
      })
      .catch((err) => {
        console.log(err);
        errorNotify(err.response.data?.user_message);
      })
      .finally(() => {
        setIsLoadingAlertSummary(false);
      });
  };

  //======== fetch trip count==========
  const fetchTripCount = async () => {
    setIsLoadingTrips(true);
    const data = {
      identifier: selectedIdentifiers.join(","),
    };
    console.log("====TRIP COUNT REQUEST====", data);
    await axios
      .post("/api/v4/analytics-summary/trip-count", data)
      .then((res) => {
        const numberOfTrips = res.data;
        setTotalTrips(numberOfTrips);
        console.log("====TRIP COUNT RESPONSE====", numberOfTrips);
      })
      .catch((err) => {
        console.log(err);
        errorNotify(err.response.data?.user_message);
      })
      .finally(() => {
        setIsLoadingTrips(false);
      });
  };

  // CHECK FOR OUTSIDE CLICK FOR SELECTOR
  const handleOutsideSelectorClick = () => {
    setClicked(false);
  };

  useEffect(() => {
    const timeDuration = visibleSelectedVehicles.length > 1 ? 30000 : 10000;
    // create 10 | 30 sec interval and call searchMultipleVehicles function
    timeInterval.current = setInterval(() => {
      // selectedVehicles (previous 2)
      visibleSelectedVehicles.length &&
        longPullingSearchVehicle(
          selectedVehiclesIdentifier(visibleSelectedVehicles)
        );
      console.log(`calling after ${timeDuration == 30000 ? 30 : 10} sec....`);
    }, timeDuration);
    return () => clearInterval(timeInterval.current);
    // selectedVehicles
  }, [visibleSelectedVehicles]);

  useEffect(() => {
    fetchPieChart();
  }, []);

  useEffect(() => {
    console.log(
      "========isVehicleSelectorLoaded ------- ",
      isVehicleSelectorLoading
    );
    if (!isVehicleSelectorLoading) {
      if (selectedIdentifiers.length) {
        fetchTripCount();
        fetchTraveledDistance();
        fetchAlertSummary();
      } else {
        setTraveledDistance({
          seven_days_distance: sevenDaysTravelDistance(),
        });
        setTotalTrips({ trips: sevenDaysTrips() });
        setAlertSummary({});
      }
    }
  }, [selectedIdentifiers]);

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

  return (
    <div className="overflow-hidden">
      {/* WEATHER */}
      <div className="flex items-center space-x-2 flex-wrap">
        <h1 className="text-base sm:text-[32px] text-[#1E1E1E] font-bold">
          Hi, <span>{generateGreetingMgs()}!</span>{" "}
          {/* <span>
            {loggedInUser?.first_name} {loggedInUser?.last_name}
          </span> */}
          {/* <span>{loggedInUser?.username}</span> */}
        </h1>
        <Weather />
      </div>

      {/* ==== toast container for error message === */}
      <div className="relative">
        <ToastContainer />
      </div>

      {/* FAVOURITE ROUTES */}
      {/* <div>
        <FavoriteUrl />
      </div> */}

      {/* PAGE TITLE */}
      <h1 className="text-base sm:text-2xl text-tertiaryText sm:text-primaryText font-semibold sm:font-medium mb-4 mt-2 sm:my-6">
        Analytics & Summary
      </h1>
      {/* BAR & PIE CHART, MULTIPLE VEHICLE SELECTOR */}
      <section className="flex justify-center space-x-1 mb-10 ">
        {/* CHARTS */}
        <div className="grow flex w-full flex-col md:flex-row justify-between md:space-x-5 overflow-hidden">
          {/* ====  Bar Chart ====  */}
          <div
            className={`md:w-1/2 bg-white flex  rounded-[27px] px-3 py-5 lg:py-[40px] overflow-hidden chartBoxShadow`}
          >
            <div className="w-full">
              <h1 className="text-[#1E1E1E] text-base sm:text-2xl font-bold pl-3">
                Last 7 Days Traveled Distance
              </h1>
              <div className="">
                <TraveledDistanceChart
                  traveledDistance={traveledDistance.seven_days_distance}
                  isLoadingTravelDistance={isLoadingTravelDistance}
                />
              </div>
            </div>
          </div>

          {/* ====  Pie Chart ====  */}
          <div
            className={`w-full md:w-1/2 bg-white rounded-[27px]  md:mt-0 mt-4 overflow-hidden chartBoxShadow pie-chart flex `}
          >
            <div className="p-[20px] flex  justify-center relative w-full">
              <div className="absolute top-4 px-[20px] w-full flex justify-between items-center">
                <h1 className="text-[#1E1E1E] text-base sm:text-2xl font-bold">
                  Total Number of Vehicles
                </h1>
                <div className="w-[72px] sm:w-[105px] h-[56px] sm:h-[88px] flex items-center justify-center bg-[#FAFAFA] rounded-[10px]">
                  {isLoadingPieChart ? (
                    <div className="w-full h-full skeleton-border border-2 p-2 rounded-[10px]">
                      <div className="w-full h-full skeleton rounded-[10px]"></div>
                    </div>
                  ) : (
                    <div>
                      <h1 className="text-[#F36B24] text-base sm:text-4xl font-bold text-center">
                        {totalVehicles?.total_no_v}
                      </h1>
                      <p className="text-center text-[#8D96A1] text-sm sm:text-lg">
                        Vehicles
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="">
                <TotalVehicleChart
                  totalVehiclesData={totalVehicles.data}
                  isLoadingPieChart={isLoadingPieChart}
                />
              </div>
            </div>
          </div>
        </div>

        {/* MULTIPLE VEHICLE SELECTOR */}
        <div
          className={`${clicked === true ? "right-0" : "-right-96"} ${
            xlScreen === true
              ? "xl:z-40 xl:right-10 xl:shadow-none xl:flex-none xl:block xl:static xl:ml-4"
              : "lg:z-40 lg:right-10 lg:shadow-none lg:flex-none lg:block lg:static lg:ml-4"
          } flex-none fixed top-16 md:top-20 ease-in-out duration-700 rounded-3xl z-[3004]`}
        >
          <div className="xl:flex-none xl:block ml-4 ">
            <AnalyticsSummaryMultipleVehicleSelector
              setIsVehicleSelectorLoading={setIsVehicleSelectorLoading}
              isSelected={true}
              isRequesting={isLoading}
              getMultipleSelectedVehicles={getMultipleSelectedVehicles}
              getSingleSelectedVehicle={getSingleSelectedVehicle}
              height={530}
              clicked={clicked}
              setClicked={setClicked}
              top={false}
              xlScreen={xlScreen}
              showMap={showMap}
              setShowMap={setShowMap}
            />
          </div>
        </div>
      </section>

      {/* ======== map with car ======== */}
      <div className="flex lg:flex-row flex-col lg:space-x-5 space-x-0 lg:space-y-0 space-y-5">
        {/* ====== left car ===== */}
        {/* <div className="lg:flex-none md:mr-4 mb-5 md:mb-0">
          <SelectedVehicles
            selectedVehicles={selectedVehicles}
            isLoading={isLoading}
          /> 
        </div> */}

        {/* advertisement  */}
        <div className="">
          <div className="w-[330px] h-full rounded-xl overflow-hidden hidden lg:flex items-end bg-white">
            <img src={advertisementH.src} className="object-contain" />
          </div>
          <div className="w-full rounded-xl overflow-hidden lg:hidden block bg-white">
            <img src={advertisementV.src} className=" object-contain" />
          </div>
        </div>
        {/* MAP */}
        <div className="grow overflow-hidden">
          {/* <CurrentLocationMap
            isShareMap={false}
            height={"77.5vh"}
            title=""
            isSelectMultiple={isSelectMultiple}
            selectedVehicles={selectedVehicles}
            setSelectedVehicles={setSelectedVehicles}
            visibleSelectedVehicles={visibleSelectedVehicles}
            setVisibleSelectedVehicles={setVisibleSelectedVehicles}
            getMapBoundVehicles={getMapBoundVehicles}
            xlScreen={xlScreen}
          /> */}
          <CurrentLocationMap
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            isShareMap={false}
            height={"77.5vh"}
            title=""
            isSelectMultiple={isSelectMultiple}
            selectedVehicles={selectedVehicles}
            setSelectedVehicles={setSelectedVehicles}
            visibleSelectedVehicles={visibleSelectedVehicles}
            setVisibleSelectedVehicles={setVisibleSelectedVehicles}
            getMapBounds={getMapBounds}
            xlScreen={xlScreen}
            showMap={showMap}
            setShowMap={setShowMap}
            showZoomINMap={showZoomINMap}
          />
        </div>
      </div>

      {/* ========== analytics -> alerts summary & line chart ========  */}
      <div className="grid grid-cols-12 gap-8 mt-8 pb-24 rounded-[27px] overflow-hidden">
        {/* ======= Alert sum ======= */}
        <div className="2xl:col-span-7 xl:col-span-6 col-span-12 overflow-hidden rounded-[27px]">
          <div className="overflow-x-auto bg-white  rounded-[27px] py-[40px] px-[20px] chartBoxShadow h-[495px] ">
            <h1 className="text-[#1E1E1E] text-base sm:text-2xl font-bold mb-[27px] sm:px-[20px]">
              Last 7 Days Alerts, Summary
            </h1>
            {/* ======== summary table =====  */}
            <ShortAlertSummaryTable
              alertSummary={alertSummary.seven_days_alert}
              isLoadingAlertSummary={isLoadingAlertSummary}
            />
          </div>
        </div>

        {/* ======== line chart ======== */}
        <div
          className={`2xl:col-span-5 xl:col-span-6 col-span-12 bg-white  rounded-[27px] lg:mt-0 mt-8 overflow-hidden chartBoxShadow chart-width  xs:mx-0`}
        >
          <div className="py-[20px]">
            <div className="px-[20px] flex items-center justify-between">
              <h1 className="sm:pl-[15px] text-[#1E1E1E] text-base sm:text-2xl font-bold">
                Trips
              </h1>
              <div className="w-[72px] sm:w-[105px] h-[56px] sm:h-[88px] flex items-center justify-center bg-[#FAFAFA] rounded-[10px]">
                <div>
                  <h1 className="text-[#F36B24] text-base sm:text-4xl font-bold text-center">
                    {totalTrips?.all_trips}
                  </h1>
                  <p className="text-center text-sm text-[#8D96A1] sm:text-lg">
                    Trips
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-[-15px]">
              <TripChart
                totalTrips={totalTrips.trips}
                isLoadingTrips={isLoadingTrips}
              />
            </div>
          </div>
        </div>
      </div>

      {/* BLUR FILTER */}
      {!clicked ? (
        ""
      ) : (
        <div
          onClick={() => handleOutsideSelectorClick()}
          className="xl:hidden blur-filter overflow-hidden"
        ></div>
      )}
    </div>
  );
};

export default AnalyticsAndSummary;

AnalyticsAndSummary.getLayout = function getLayout(page) {
  return (
    <ProtectedRoute>
      <Layout>
        <DashboardLayout>{page}</DashboardLayout>
      </Layout>
    </ProtectedRoute>
  );
};
