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

// router
import { useRouter } from "next/router";

// date-time-picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import GeoFenceMap from "@/components/maps/GeoFenceMap";
import { set } from "date-fns";
import GeoFenceTable from "@/components/tables/GeoFenceTable";
import GeoFenceSettingsModal from "@/components/modals/GeoFenceSettingsModal";
import GeoFenceAssignedVehiclesModal from "@/components/modals/GeoFenceAssignedVehiclesModal";

//====== toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "@/plugins/axios";
import { geoFenceTime24 } from "@/utils/dateTimeConverter";
import GeoFenceTableRecent from "@/components/tables/GeoFenceTableRecent";

const create = () => {
  // this exceptional vehicle selector
  const [vehicleLists, setVehicleLists] = useState([]);

  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [geoFenceTableData, setGeoFenceTableData] = useState([]);

  const [fenceName, setFenceName] = useState("");

  const previousDay = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
  const [startTime, setStartTime] = useState(
    new Date(
      previousDay.getFullYear(),
      previousDay.getMonth(),
      previousDay.getDate(),
      0,
      0,
      0,
      0
    )
  );
  const [endTime, setEndTime] = useState(
    new Date(
      previousDay.getFullYear(),
      previousDay.getMonth(),
      previousDay.getDate(),
      23,
      59,
      59,
      999
    )
  );

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
  const [openAreas, setOpenAreas] = useState(false);
  const [xlScreen, setXlScreen] = useState(false);
  const router = useRouter();

  //=====modal
  const [settingsModalIsOpen, setSettingsModalIsOpen] = useState(false);
  const [assignedVehiclesModalIsOpen, setAssignedVehiclesModalIsOpen] =
    useState(false);

  // const modal open
  const handleAssignedVehiclesModalOpen = (fence) => {
    console.log(fence);
    setAssignedVehiclesModalIsOpen(true);
  };

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

  // CHECK FOR OUTSIDE CLICK FOR SELECTOR
  const handleOutsideSelectorClick = () => {
    setClicked(false);
  };

  // call api
  const postFence = async (data) => {
    setIsLoading(true);
    await axios
      .post("/api/v4/virtual-fence/store", data)
      .then((res) => {
        console.log("geo fence create res---", res.data);
        successNotify();
        setTimeout(() => {
          router.push("/activity/geo-fence");
        }, 2000);
      })
      .catch((err) => {
        console.log("geo fence error : ", err.response);
        errorNotify(err.response.data.message);
        // toast.error("err.response.data?.user_message");
      })
      .finally(() => setIsLoading(false));
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
        isActive: true,
        event: eventData,
      };
      console.log("fence data", data);
      postFence(data);
      // successNotify()
    }
  };
  const handleResetFence = () => {
    setFenceName("");
    setStartTime(null);
    setEndTime(null);
    setPolygonPaths([]);
    handleDeselectAll();
    setEventData({
      entry: {
        message: "",
        active: true,
      },
      exit: {
        message: "",
        active: true,
      },
    });
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
    return vehicleObject.map((vehicle) => vehicle.v_identifier);
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

  const convertToMapData = (data) => {
    return data.map(({ name, coordinates }) => ({
      name,
      coordinates: coordinates[0].map(([lat, lng]) => ({ lat, lng })),
    }));
  };
  // geo json to map data end

  //=======toast message
  const successNotify = () => {
    toast.success("Successfully Added.", {
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

  const fetchGeoFenceTableData = async () => {
    setIsLoadingTable(true);
    await axios
      .get(`/api/v4/virtual-fence/list`)
      .then((res) => {
        const allData = res.data.data.data.slice(0, 5);
        console.log("-- get geo-fence res--", allData);

        const newData = allData.map((item, index) => ({
          ...item,
          sl: index + 1,
          checkbox: false,
          displayDropdownInfo: false,
        }));
        setGeoFenceTableData(newData);
      })
      .catch((err) => {
        console.log("geo-fence error : ", err.response);
        toast.error(err.response?.data?.user_message);
      })
      .finally(() => setIsLoadingTable(false));
  };
  // --------- 02
  useEffect(() => {
    fetchGeoFenceTableData();
  }, []);

  return (
    <>
      <ToastContainer />
      <GeoFenceSettingsModal
        isUpdating={false}
        settingsModalIsOpen={settingsModalIsOpen}
        setSettingsModalIsOpen={setSettingsModalIsOpen}
        eventData={eventData}
        setEventData={setEventData}
      />
      {/* <GeoFenceAssignedVehiclesModal
        assignedVehiclesModalIsOpen={assignedVehiclesModalIsOpen}
        setAssignedVehiclesModalIsOpen={setAssignedVehiclesModalIsOpen}
      /> */}
      <div className="overflow-hidden">
        <section>
          {/* PAGE TITLE */}
          <div className="flex items-center justify-between pb-4 md:pb-7">
            <h1 className="text-[#1E1E1E] text-xl md:text-[32px] font-bold md:pt-5">
              Create Geofence
            </h1>
          </div>
          {/* SEARCH, TIME, & BUTTONS */}
          <div className="flex flex-col lg:flex-row justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-2 xl:space-x-4 md:mr-2">
              {/* Search */}
              <input
                onChange={(e) => setFenceName(e.target.value)}
                value={fenceName}
                className="h-[48px] rounded-xl px-4 w-full smw-[250px] md:w-[380px] lg:w-[250px] xl:w-[380px] text-sm outline-quaternary searchbox-shadow"
                type="text"
                placeholder="Enter Name of the Fence"
              />
              {/* Time */}
              <div className="flex space-x-4 w-full md:w-1/2">
                {/* from */}
                <div className="relative bg-white searchbox-shadow rounded-xl w-[50%] md:w-32">
                  <div className="flex items-center w-full">
                    <DatePicker
                      selected={startTime}
                      onChange={(date) => setStartTime(date)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeCaption="Time"
                      dateFormat="h:mm aa"
                      className="h-[48px] w-full md:w-32 py-2 px-4 rounded-xl z-40 outline-quaternary"
                      placeholderText="From"
                    />
                  </div>
                  <div className="absolute right-2 top-[18px]">
                    <Timer />
                  </div>
                </div>

                {/* to */}
                <div className="relative searchbox-shadow rounded-xl w-[50%] md:w-32 bg-white">
                  <div className="flex items-center w-full">
                    <DatePicker
                      selected={endTime}
                      onChange={(date) => setEndTime(date)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeCaption="Time"
                      dateFormat="h:mm aa"
                      className="h-[48px] w-full md:w-32 py-2 px-4 rounded-xl z-40 outline-quaternary"
                      placeholderText="To"
                    />
                  </div>
                  <div className="absolute right-2 top-[18px]">
                    <Timer />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center lg:justify-end space-x-4 md:space-x-2 xl:space-x-4 w-full">
              <button
                onClick={() => setSettingsModalIsOpen(true)}
                className="flex justify-center items-center space-x-3 w-1/2 sm:w-[143px] md:w-[120px] h-[48px] rounded-xl text-sm duration-300 bg-primary primary-shadow hover:shadow-xl hover:shadow-primary/60"
              >
                <GeoFenceSettingsSVG />
                <p className="primaryText">Settings</p>
              </button>
              <button
                onClick={handleResetFence}
                className="flex justify-center items-center h-[48px] w-1/3 sm:w-[93px] rounded-xl text-sm duration-300 bg-primary primary-shadow hover:shadow-xl hover:shadow-primary/60"
              >
                <p>Reset</p>
              </button>
              <button
                onClick={handleSaveFence}
                disabled={isLoading}
                className="flex justify-center items-center h-[48px] w-1/3 sm:w-[93px] rounded-xl text-sm duration-300 bg-primary primary-shadow hover:shadow-xl hover:shadow-primary/60"
              >
                <p>{!isLoading ? "Save" : "Saving..."}</p>
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
              isUpdating={false}
              height="75vh"
              polygonPaths={polygonPaths}
              setPolygonPaths={setPolygonPaths}
              selectedVehicles={selectedVehicles}
              setSelectedVehicles={setSelectedVehicles}
              xlScreen={false}
              openAreas={openAreas}
              setOpenAreas={setOpenAreas}
            />
          </div>
          <div
            className={`${
              clicked === true ? "right-0 z-[3005]" : "-right-96 z-[3004]"
            } ${
              xlScreen === true
                ? "xl:z-40 xl:right-10 xl:shadow-none xl:flex-none xl:block xl:static xl:ml-4"
                : "xl:z-40 xl:right-10 xl:shadow-none xl:static xl:ml-4"
            } flex-none fixed top-16 lg:top-10 xl:top-40 ml-0 ease-in-out duration-700 rounded-3xl lg:mt-8`}
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
              xlScreen={true}
            />
          </div>
        </section>
        {/* GEOFENCE TABLE SECTION */}
        <div>
          <GeoFenceTableRecent
            isLoadingTable={isLoadingTable}
            fetchGeoFenceTableData={fetchGeoFenceTableData}
            geoFenceTableData={geoFenceTableData}
          />
        </div>
        {/* =========== Blur filter =========== */}
        {!clicked ? (
          ""
        ) : (
          <div
            onClick={() => handleOutsideSelectorClick()}
            className="xl:hidden blur-filter"
          ></div>
        )}
      </div>
    </>
  );
};

export default create;

create.getLayout = function getLayout(page) {
  return (
    <ProtectedRoute>
      <Layout>
        <DashboardLayout>{page}</DashboardLayout>
      </Layout>
    </ProtectedRoute>
  );
};
