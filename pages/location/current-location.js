import React, { useEffect, useRef, useState } from "react";

import Advertisement from "@/components/Advertisement";

import CurrentLocationMap from "@/components/maps/CurrentLocationMap";

import Layout from "@/components/layouts/Layout";
import DashboardLayout from "@/components/layouts/DashboardLayout";

import { useSelector } from "react-redux";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";

import baseUrl from "@/plugins/baseUrl";
import CurrentLocationMultipleVehicleSelector from "@/components/vehicleSelectors/CurrentLocationMultipleVehicleSelector";
import axios from "@/plugins/axios";

const currentLocation = () => {
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [visibleSelectedVehicles, setVisibleSelectedVehicles] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const timeInterval = useRef(null);

  const [clicked, setClicked] = useState(false);
  const [xlScreen, setXlScreen] = useState(false);

  const [isSelectMultiple, setIsSelectMultiple] = useState(null);

  const currentMapBoundsRef = useRef(null);

  const token = useSelector((state) => state.reducer.auth.token);
  const [showMap, setShowMap] = useState(false);

  const getSingleSelectedVehicle = (vehicle) => {
    setIsSelectMultiple(false);

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
    } else {
      setSelectedVehicles([]);

      //==========visible vehicle
      setVisibleSelectedVehicles([]);
    }
  };

  // init vehicle isInfoShowing
  const initVehicles = (vehicles) => {
    console.log("initVehicle", vehicles);
    // Filter out vehicles that do not have lat and lng properties
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
            if (vehicle.path.length > 0) {
              const heading = google?.maps?.geometry?.spherical?.computeHeading(
                new google.maps.LatLng(vehicle.path[vehicle.path.length - 1]),
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

  //========handle marker angel end

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
    }
    // console.log("vehicles in map bounds", vehicles);
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

  // Search button click check for mobile
  const handleSearch = () => {
    !clicked ? setClicked(true) : setClicked(false);
  };

  return (
    <div className="current-location overflow-hidden">
      <div className="flex">
        <div className="grow overflow-hidden ">
          <CurrentLocationMap
            isLoading={isLoading}
            isShareMap={false}
            height={"77.5vh"}
            title="Current Location"
            isSelectMultiple={isSelectMultiple}
            selectedVehicles={selectedVehicles}
            setSelectedVehicles={setSelectedVehicles}
            visibleSelectedVehicles={visibleSelectedVehicles}
            setVisibleSelectedVehicles={setVisibleSelectedVehicles}
            getMapBounds={getMapBounds}
            xlScreen={xlScreen}
            showMap={showMap}
            setShowMap={setShowMap}
          />
        </div>
        <div
          className={`${clicked === true ? "right-0" : "-right-96"} ${
            xlScreen === true
              ? "xl:z-40 xl:right-10 xl:shadow-none xl:flex-none xl:block xl:static xl:ml-4"
              : "lg:z-40 lg:right-10 lg:shadow-none lg:static lg:ml-4"
          } flex-none fixed top-16 lg:top-40 ml-0 ease-in-out duration-700 rounded-3xl z-[3004] lg:mt-8`}
        >
          <div>
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
              showMap={showMap}
              setShowMap={setShowMap}
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
