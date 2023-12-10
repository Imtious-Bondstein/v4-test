//========SVG
import Timer from "@/svg/TimerSVG";
import GeoFenceSettingsSVG from "@/components/SVG/GeoFenceSettingsSVG";
import SearchCarSVG from "@/components/SVG/SearchCarSVG";
import LeftArrowPagination from "@/components/SVG/pagination/LeftArrowPaginateSVG";
import RightArrowPaginateSVG from "@/components/SVG/pagination/RightArrowPaginateSVG";

import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Layout from "@/components/layouts/Layout";

import GeoFenceMultipleVehicleSelector from "@/components/vehicleSelectors/GeoFenceMultipleVehicleSelector";

import { geofenceTableData } from "@/utils/geofenceTableData";
import React, { useEffect, useRef, useState } from "react";

// date-time-picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import GeoFenceMap from "@/components/maps/GeoFenceMap";
import { set } from "date-fns";
import GeoFenceTable from "@/components/tables/GeoFenceTable";
import GeoFenceSettingsModal from "@/components/modals/GeoFenceSettingsModal";

import { useRouter } from "next/router";
import axios from "@/plugins/axios";
import { ro, tr } from "date-fns/locale";
import LoadingScreen from "@/components/LoadingScreen";
import { vehicle } from "faker/lib/locales/ar";
import { geoFenceTime24 } from "@/utils/dateTimeConverter";

//====== toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const update = () => {
  // this exceptional vehicle selector
  const [vehicleLists, setVehicleLists] = useState([]);

  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const isFetchCalledRef = useRef(false);
  const [preGeoFenceData, setPreGeoFenceData] = useState({});
  const [profileData, setProfileData] = useState([]);

  const [fenceName, setFenceName] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [polygonPaths, setPolygonPaths] = useState([]);
  const [eventData, setEventData] = useState({
    entry: {
      message: "",
      active: true,
    },
    exit: {
      message: "",
      active: true,
    },
  });

  const [clicked, setClicked] = useState(false);
  const [xlScreen, setXlScreen] = useState(false);
  const router = useRouter();

  //=====modal
  const [settingsModalIsOpen, setSettingsModalIsOpen] = useState(false);

  //=========new code start
  const getSingleSelectedVehicle = (vehicle) => {
    console.log("getSingleSelectedVehicle", vehicle);
    if (vehicle.selected) {
      setSelectedVehicles([...selectedVehicles, vehicle]);
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
    console.log("all vehicle", allVehicles);
    if (allVehicles.length) {
      setSelectedVehicles([...selectedVehicles, ...allVehicles]);
    } else {
      setSelectedVehicles([]);
    }
  };

  //
  //=========new code end

  const formatDateWithTime = (timeString) => {
    const [hour, minute, second] = timeString.split(":").map(Number);
    const now = new Date(); // Get the current date
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour,
      minute,
      second
    );
  };

  // CHECK FOR OUTSIDE CLICK FOR SELECTOR
  const handleOutsideSelectorClick = () => {
    setClicked(false);
  };

  // fence save and reset start
  const handleSaveFence = () => {
    const errorMgs = checkRequiredFields();
    if (errorMgs) {
      errorNotify(errorMgs);
    } else if (!isStartTimeLessThanEndTime(startTime, endTime)) {
      errorNotify("Start Time must be less than End Time");
    } else {
      const data = {
        name: fenceName,
        start_time: geoFenceTime24(startTime),
        end_time: geoFenceTime24(endTime),
        areas: convertToStringData(polygonPaths),
        vehicles: vehicleObjectToIdentifierArray(selectedVehicles),
        // vehicles: selectedVehicles,
        isActive: true,
        event: eventData,
      };
      console.log("fence data", JSON.stringify(data));
      updateFenceByIdentifier(data);
      // successNotify()
    }
  };

  const handleResetFence = () => {
    // setFenceName("");
    // setStartTime(null);
    // setEndTime(null);
    // setPolygonPaths([]);
    // handleDeselectAll();
    handleSetPreviousData();
  };

  const checkRequiredFields = () => {
    const emptyFields = [];
    if (fenceName === "") {
      emptyFields.push("Fence Name");
    }
    if (startTime === null) {
      emptyFields.push("Start Time");
    }
    if (endTime === null) {
      emptyFields.push("End Time");
    }
    // if (startTime && endTime && isStartTimeLessThanEndTime(startTime, endTime)) {
    //   emptyFields.push('Start Time must be less than End Time')
    // }
    if (polygonPaths.length === 0) {
      emptyFields.push("Area List");
    }
    if (selectedVehicles.length === 0) {
      emptyFields.push("Vehicle List");
    }
    if (polygonPaths.length) {
      //if polygon paths name is at least one empty push to empty and stop loop

      polygonPaths.forEach((path, index) => {
        if (path.name === "") {
          emptyFields.push(`Enter Area Name ${index + 1}`);
        }
      });
    }
    if (emptyFields.length > 0) {
      const errorMessage = `The following fields are required: ${emptyFields.join(
        ", "
      )}`;
      console.log(errorMessage);
      return errorMessage;
    } else {
      console.log("null");
      return null;
    }
  };

  // time validation
  function isStartTimeLessThanEndTime(startTime, endTime) {
    // Splitting time strings to extract hours and minutes
    const [startHour, startMinute] = geoFenceTime24(startTime)
      .split(":")
      .map(Number);
    const [endHour, endMinute] = geoFenceTime24(endTime).split(":").map(Number);
    console.log(startHour + " " + startMinute);
    console.log(endHour + " " + endMinute);

    // Comparing hours and minutes to determine if startTime is less than endTime
    if (startHour < endHour) {
      return true;
    } else if (startHour === endHour) {
      return startMinute < endMinute;
    }

    return false;
  }

  // vehicle object to identifier array
  const vehicleObjectToIdentifierArray = (vehicleObject) => {
    return vehicleObject.map(
      (vehicle) => vehicle.v_identifier || vehicle.identifier
    );
  };

  // deselect all vehicle from vehicleList
  const handleDeselectAll = () => {
    vehicleLists.map((group) => {
      group.vehicles.map((vehicle) => {
        vehicle["selected"] = false;
      });
    });
    setSelectedVehicles([]);
  };
  // fence save and reset end

  // geo json to map data start
  const convertToGeoData = (data) => {
    return data.map(({ name, coordinates }) => ({
      name,
      coordinates: [coordinates.map(({ lat, lng }) => [lat, lng])],
    }));
  };

  const convertToMapData = (data) => {
    return data.map(({ name, coordinates }) => ({
      name,
      coordinates: coordinates[0].map(([lat, lng]) => ({ lat, lng })),
    }));
  };
  function convertCoordinates(data) {
    const newData = data.map((item) => {
      const coordinates = item.coordinates.split(";").map((coord) => {
        const [lat, lng] = coord.split(",").map(parseFloat);
        return { lat, lng };
      });

      return { name: item.name, coordinates };
    });

    return newData;
  }
  const convertToStringData = (data) => {
    // return data.map(({ name, coordinates }) => ({
    //   name,
    //   coordinates: [coordinates.map(({ lat, lng }) => [lat, lng])],
    // }));
    const newData = data.map((item) => {
      const coordinates = item.coordinates
        .map((coord) => {
          return `${coord.lat},${coord.lng}`;
        })
        .join(";");

      return { name: item.name, coordinates };
    });

    return newData;
  };
  // geo json to map data end

  //===========API call
  const getSingleFenceByIdentifier = async (identifier) => {
    setIsLoading(true);
    await axios
      .get(`/api/v4/virtual-fence/edit/${identifier}`)
      .then((res) => {
        console.log("geo fence single res---", res.data.data);
        console.log(
          "geo fence area data---",
          convertCoordinates(res.data.data.areas)
        );
        //=======set data
        setPreGeoFenceData(res.data.data);
      })
      .catch((err) => {
        setIsNotFound(true);
        console.log("geo fence error : ", err.response);
        errorNotify("No Fence Found");
        // toast.error("err.response.data?.user_message");
      })
      .finally(() => setIsLoading(false));
  };

  const updateFenceByIdentifier = async (data) => {
    setIsUpdating(true);
    const identifier = router.asPath.split("fence=")[1];
    await axios
      .put(`/api/v4/virtual-fence/update/${identifier}`, data)
      .then((res) => {
        console.log("geo fence update res---", res.data);
        successNotify();
        setTimeout(() => {
          router.push("/activity/geo-fence");
        }, 2000);
      })
      .catch((err) => {
        console.log("geo fence error : ", err.response);
        errorNotify("Something went wrong");
        // toast.error("err.response.data?.user_message");
      })
      .finally(() => setIsUpdating(false));
  };

  //=======toast message
  const successNotify = () => {
    toast.success("Successfully Updated.", {
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
    toast.warning("Not sufficient data to render.", {
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

  const handleSetPreviousData = () => {
    setFenceName(preGeoFenceData.name);
    setStartTime(formatDateWithTime(preGeoFenceData.start_time));
    setEndTime(formatDateWithTime(preGeoFenceData.end_time));
    setSelectedVehicles(preGeoFenceData.vehicles);
    setEventData(preGeoFenceData.event);
    setPolygonPaths(convertCoordinates(preGeoFenceData.areas));
    // console.log('List of vehicle', vehicleLists);
    const updatedLists = vehicleLists.map((groupItem) => {
      const updatedVehicles = groupItem.vehicles.map((vehicle) => {
        if (
          preGeoFenceData.vehicles.some(
            (v) => v.identifier === vehicle.v_identifier
          )
        ) {
          return { ...vehicle, selected: true };
        }
        return vehicle;
      });

      return { ...groupItem, vehicles: updatedVehicles };
    });
    // console.log('only vehicles', updatedLists);

    setVehicleLists(updatedLists);
  };

  // get fence id from route
  useEffect(() => {
    const queryFenceIdentifier = router.asPath.split("fence=")[1];
    if (!isFetchCalledRef.current && queryFenceIdentifier) {
      isFetchCalledRef.current = true;
      getSingleFenceByIdentifier(queryFenceIdentifier);
    }
  }, [router]);

  useEffect(() => {
    if (!isNotFound && !isLoading && vehicleLists.length) {
      console.log("my data", preGeoFenceData);
      handleSetPreviousData();
    }
  }, [vehicleLists.length, isLoading]);

  return (
    <>
      <ToastContainer />
      <GeoFenceSettingsModal
        isUpdating={true}
        settingsModalIsOpen={settingsModalIsOpen}
        setSettingsModalIsOpen={setSettingsModalIsOpen}
        eventData={eventData}
        setEventData={setEventData}
      />
      <div className="overflow-hidden">
        {isLoading ? (
          <LoadingScreen />
        ) : isNotFound ? (
          <div className="flex items-center justify-center w-full h-48  bg-white rounded-xl   ">
            <p className="text-[#1E1E1E] text-xl mt-6 md:mt-0 md:pt-5">
              No Fence Found
            </p>
          </div>
        ) : (
          <>
            <section className="geofence-update">
              {/* PAGE TITLE */}
              <div className="flex items-center justify-between pb-7 md:pb-7">
                <h1 className="text-[#1E1E1E] text-xl md:text-[32px] font-bold mt-6 md:mt-0 md:pt-5">
                  Update Geofence
                </h1>
              </div>
              {/* SEARCH, TIME, & BUTTONS */}
              <div className="flex flex-col lg:flex-row justify-between space-y-3 lg:space-y-0">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-2 xl:space-x-4">
                  {/* Search */}
                  <input
                    onChange={(e) => setFenceName(e.target.value)}
                    value={fenceName}
                    className="h-[48px] rounded-xl px-4 w-full sm:w-[320px] xl:w-[350px] text-sm outline-quaternary searchbox-shadow"
                    type="text"
                    placeholder="Enter Name of the Fence"
                  />
                  {/* Time */}
                  <div className="flex space-x-3 sm:space-x-4">
                    {/* from */}
                    <div className="relative bg-white searchbox-shadow rounded-xl w-1/2 sm:w-32 ">
                      <div className=" flex items-center">
                        <DatePicker
                          selected={startTime}
                          onChange={(date) => setStartTime(date)}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="Time"
                          dateFormat="h:mm aa"
                          className="h-[48px] w-full sm:w-32 py-2 px-4 rounded-xl z-40 outline-quaternary"
                          placeholderText="From"
                        />
                      </div>
                      <div className="absolute right-2 top-[18px]">
                        <Timer />
                      </div>
                    </div>

                    {/* to */}
                    <div className="relative searchbox-shadow rounded-xl w-1/2 sm:w-32 bg-white">
                      <div className="flex items-center w-full">
                        <DatePicker
                          selected={endTime}
                          onChange={(date) => setEndTime(date)}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="Time"
                          dateFormat="h:mm aa"
                          className="h-[48px] w-[100%] sm:w-32 py-2 px-4 rounded-xl z-40 outline-quaternary"
                          placeholderText="To"
                        />
                      </div>
                      <div className="absolute right-2 top-[18px]">
                        <Timer />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 xl:space-x-4">
                  <button
                    onClick={() => setSettingsModalIsOpen(true)}
                    className="flex justify-center items-center space-x-3 w-1/3 sm:w-[143px] lg:w-[48px] xl:w-[143px] h-[48px] rounded-xl text-sm bg-primary primary-shadow"
                  >
                    <GeoFenceSettingsSVG />
                    <p className="primaryText block lg:hidden xl:block">
                      Settings
                    </p>
                  </button>
                  <button
                    onClick={handleResetFence}
                    className="flex justify-center items-center h-[48px] w-1/3 sm:w-[93px] rounded-xl text-sm bg-primary primary-shadow"
                  >
                    <p>Reset</p>
                  </button>
                  <button
                    onClick={handleSaveFence}
                    disabled={isUpdating}
                    className="flex justify-center items-center h-[48px] w-1/3 sm:w-[93px] rounded-xl text-sm bg-primary primary-shadow"
                  >
                    <p>{isUpdating ? "Updating..." : "Update"}</p>
                  </button>
                </div>
              </div>
            </section>
            {/* GEOFENCE MAP SECTION */}
            <section className="flex pb-6">
              <div className="grow overflow-hidden ">
                <GeoFenceMap
                  isLoading={false}
                  isShareMap={false}
                  isUpdating={true}
                  height="75vh"
                  polygonPaths={polygonPaths}
                  setPolygonPaths={setPolygonPaths}
                  selectedVehicles={selectedVehicles}
                  setSelectedVehicles={setSelectedVehicles}
                  xlScreen={false}
                />
              </div>
              <div
                className={`${clicked === true ? "right-0" : "-right-96"} ${
                  xlScreen === true
                    ? "xl:z-40 xl:right-10 xl:shadow-none xl:flex-none xl:block xl:static xl:ml-4"
                    : "lg:z-40 lg:right-10 lg:shadow-none lg:static lg:ml-4"
                } flex-none fixed top-16 lg:top-40 ml-0 ease-in-out duration-700 rounded-3xl z-[3004] lg:mt-8`}
              >
                <GeoFenceMultipleVehicleSelector
                  vehicleLists={vehicleLists}
                  setVehicleLists={setVehicleLists}
                  isSelected={false}
                  getMultipleSelectedVehicles={getMultipleSelectedVehicles}
                  getSingleSelectedVehicle={getSingleSelectedVehicle}
                  clicked={clicked}
                  setClicked={setClicked}
                  top={true}
                  height={530}
                  xlScreen={xlScreen}
                />
              </div>
            </section>
            {/* =========== Blur filter =========== */}
            {!clicked ? (
              ""
            ) : (
              <div
                onClick={() => handleOutsideSelectorClick()}
                className="lg:hidden blur-filter"
              ></div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default update;

update.getLayout = function getLayout(page) {
  return (
    <ProtectedRoute>
      <Layout>
        <DashboardLayout>{page}</DashboardLayout>
      </Layout>
    </ProtectedRoute>
  );
};
