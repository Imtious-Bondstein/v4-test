import React, { useEffect, useMemo, useRef, useState } from "react";
import "../../styles/pages/Home.css";
import car_1 from "../../public/cars/car-1.png";
import AddVehicle from "@/svg/AddVehicleSVG";

import Search from "@/svg/SearchSVG";
import Tik from "@/svg/TikSVG";
import VehicleStatusSelector from "../VehicleStatusSelector";
import CrossSVG from "@/svg/CrossSVG";
import axios from "@/plugins/axios";
import baseUrl from "@/plugins/baseUrl";
// import axios from "axios";
// date-time-picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Calender from "@/svg/CalenderSVG";
import SearchCarSVG from "../SVG/SearchCarSVG";

import "../../styles/components/sidebarSelectors.css";

//==========store=========
import { useDispatch, useSelector } from "react-redux";
import { fetchVehicleLists } from "@/store/slices/vehicleSlice";
import SelectedVehicleCount from "./SelectedVehicleCount";
import {
  handleSelectorVehicleType,
  handleVehicleType,
} from "@/utils/vehicleTypeCheck";

const AlertMultipleVehicleSelector = ({
  isSelected,
  isRequesting,
  getCurrentSelectedVehicleAndSettings,
  height,
  clicked,
  setClicked,
  top,
  xlScreen,
}) => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchKey, setSearchKey] = useState("");
  const [isSelectedAll, setIsSelectedAll] = useState(false);
  const [vehicleLists, setVehicleLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isDispatched = useRef(false);

  const [type, setType] = useState("");
  const [event, setEvent] = useState("all_event");
  const [alert, setAlert] = useState("no_alert");

  //=========store========
  const dispatch = useDispatch();
  const { storeVehicleLists, isStoreLoading } = useSelector(
    (state) => state.reducer.vehicle
  );

  const token = useSelector((state) => state.reducer.auth.token);

  const initVehicles = (vehicleLists, value) => {
    console.log("init value", value);
    vehicleLists.map((group) => {
      group.vehicles.map((vehicle) => {
        vehicle["selected"] = value;
      });
    });
  };

  const handleSingleSelectVehicle = (selectedVehicle) => {
    // ========update local state
    const updatedData = vehicleLists.map((group) => {
      return {
        group: group.group,
        vehicles: group.vehicles.map((vehicle) => {
          if (vehicle.v_identifier === selectedVehicle.v_identifier) {
            return { ...vehicle, selected: !vehicle.selected };
          }
          return vehicle;
        }),
      };
    });

    setVehicleLists(updatedData);

    // getSingleSelectedVehicle({
    //   ...selectedVehicle,
    //   selected: !selectedVehicle.selected,
    // });
  };

  const handleGetCurrentSelectedVehicle = () => {
    const allVehiclesArray = vehicleLists.flatMap((group) => group.vehicles);
    const currentSelectedVehicles = allVehiclesArray.filter(
      (vehicle) => vehicle.selected === true
    );
    // console.log("currentSelectedVehicles-----------:::", currentSelectedVehicles);
    getCurrentSelectedVehicleAndSettings(currentSelectedVehicles, event, alert);
  };

  const handleMultipleSelectVehicles = () => {
    initVehicles(filteredVehicle, !isSelectedAll ? true : false);
    setIsSelectedAll(!isSelectedAll);

    // convert to flat map
    // const allVehiclesArray = vehicleLists.flatMap((group) => group.vehicles);

    // getMultipleSelectedVehicles(handleGetCurrentSelectedVehicle(allVehiclesArray));
  };

  const checkAllSelected = () => {
    // convert to flat map
    const allVehiclesArray = filteredVehicle.flatMap((group) => group.vehicles);

    return allVehiclesArray.length &&
      allVehiclesArray.every((vehicle) => vehicle.selected === true)
      ? setIsSelectedAll(true)
      : setIsSelectedAll(false);
  };

  // CURRENT SELECTED VEHICLE ====================================================
  const getCurrentSelectedVehicle = (allVehiclesArray) => {
    // console.log("allVehiclesArray", allVehiclesArray);
    return allVehiclesArray.filter((vehicle) => vehicle.selected === true);
  };
  // CURRENT SELECTED VEHICLE LENGTH ============================================
  const getCurrentSelectedVehicleLength = () => {
    const allVehiclesArray = vehicleLists.flatMap((group) => group.vehicles);
    return getCurrentSelectedVehicle(allVehiclesArray).length;
  };

  // ========== handle time picker ========
  // const handleStartTime = (date, fieldName) => {
  //   if (fieldName === "startDate") {
  //     setDateRange({
  //       ...dateRange,
  //       startDate: date,
  //     });
  //   } else if (fieldName === "endDate") {
  //     setDateRange({
  //       ...dateRange,
  //       endDate: date,
  //     });
  //   }

  //   console.log(fieldName, "==== date ====", date);
  // };

  // search and filter start
  const filteredVehicle = useMemo(() => {
    // if (selectedStatus.toLowerCase() === 'all' && !searchKey) {
    //     return vehicleLists
    // }

    return vehicleLists
      .map((group) => {
        return {
          group: group.group,
          vehicles: group.vehicles.filter((vehicle) => {
            return (
              (vehicle.bst_id !== null && vehicle.v_identifier !== null
                ? vehicle?.bst_id
                    .toString()
                    .toLowerCase()
                    .includes(searchKey.toLowerCase()) ||
                  vehicle?.v_identifier
                    .toString()
                    .toLowerCase()
                    .includes(searchKey.toLowerCase()) ||
                  (vehicle?.v_vrn &&
                    vehicle.v_vrn
                      .toString()
                      .toLowerCase()
                      .includes(searchKey.toLowerCase()))
                : "") &&
              (selectedStatus.toLowerCase() === "all" ||
                vehicle.v_status.toLowerCase() === selectedStatus.toLowerCase())
            );
          }),
        };
      })
      .filter((group) => group.vehicles.length > 0);
  }, [selectedStatus, searchKey, vehicleLists]);
  // search and filter end

  const totalVehicleCount = filteredVehicle.reduce((count, group) => {
    return count + group.vehicles.length;
  }, 0);

  // useEffect(() => {
  //   if (isFirstCall) {
  //     if (isSelected) {
  //       initVehicles(vehicleLists, true);
  //       setIsSelectedAll(true);
  //       selectAllVehicles();
  //     } else {
  //       initVehicles(vehicleLists, false);
  //       setIsSelectedAll(false);
  //     }
  //     setIsFirstCall(false);
  //   } else {
  //     checkAllSelected();
  //   }
  // }, [filteredVehicle]);

  useEffect(() => {
    if (!isLoading) {
      console.log("call use effect");
      if (isSelected) {
        initVehicles(vehicleLists, true);
        setIsSelectedAll(true);
        handleMultipleSelectVehicles();
      } else {
        initVehicles(vehicleLists, false);
        setIsSelectedAll(false);
      }
      // setIsFirstCall(false);
    } else {
      checkAllSelected();
    }
  }, [isLoading]);

  // useEffect(() => {
  //   fetchData();
  // }, []);

  //======get data from store========
  useEffect(() => {
    if (!storeVehicleLists && !isStoreLoading && !isDispatched.current) {
      isDispatched.current = true;
      dispatch(fetchVehicleLists());
    }
    if (!isStoreLoading && storeVehicleLists) {
      setVehicleLists(JSON.parse(JSON.stringify(storeVehicleLists)));
      setIsLoading(isStoreLoading);
    }
  }, [isStoreLoading]);

  const getCurrentSelectedVehicleAndSettings2 = (vehicles, event, alert) => {
    let data = {};
    if (event !== "all_event") {
      if (alert === "both") {
        data = {};

        data[event.concat("_", "email")] = true;
        data[event.concat("_", "sms")] = true;
        // console.log("data--", data);
      } else if (alert === "no_alert") {
        data = {};

        data[event.concat("_", "email")] = false;
        data[event.concat("_", "sms")] = false;
        // console.log("data--", data);
      } else {
        data = {};
        let fieldName = event.concat("_", alert);
        data[fieldName] = true;
        // console.log("data = ", data);
      }
    } else {
      if (alert === "both") {
        data = {
          engine_on_email: true,
          engine_on_sms: true,
          engine_off_email: true,
          engine_off_sms: true,
          overspeed_email: true,
          overspeed_sms: true,
          panic_email: true,
          panic_sms: true,
          offline_email: true,
          offline_sms: true,
          disconnect_email: true,
          disconnect_sms: true,
        };

        // console.log("data--", data);
      } else if (alert === "no_alert") {
        data = {};

        data = {
          engine_on_email: false,
          engine_on_sms: false,
          engine_off_email: false,
          engine_off_sms: false,
          overspeed_email: false,
          overspeed_sms: false,
          panic_email: false,
          panic_sms: false,
          offline_email: false,
          offline_sms: false,
          disconnect_email: false,
          disconnect_sms: false,
        };

        // console.log("data--", data);
      } else {
        data = {};
        data = {
          ["engine_on".concat("_", alert)]: true,
          ["engine_off".concat("_", alert)]: true,
          ["overspeed".concat("_", alert)]: true,
          ["panic".concat("_", alert)]: true,
          ["offline".concat("_", alert)]: true,
          ["disconnect".concat("_", alert)]: true,
        };

        // let fieldName = event.concat("_", alert);
        // data[fieldName] = true;
      }
    }

    console.log("final data = ", data);
    vehicles.map((vehicle, index) => {
      console.log("0--- vehicle", vehicle);
      Object.keys(data).length &&
        updateAlertManagement(vehicle.v_identifier, data);
    });
  };

  const updateAlertManagement = async (identifier, data) => {
    console.log(">>>identifier", identifier);

    await axios
      .post(
        `/api/v4/alert-management/alert-settings-update?identifier=${identifier}`,
        data
      )
      .then((res) => {
        console.log(" Data updated ", res);

        // fetchTableData();
      })
      .catch((err) => {
        console.log(err.response.statusText);
        // errorNotify(err.response.statusText);
        // fetchTableData();
      });
  };

  return (
    <div className="relative w-[327px] h-[74.6vh] rounded-xl bg-white p-4 overflow-hidden">
      {/* <div className="flex items-center justify-between text-sm text-tertiaryText">
        {vehicleStatus.map((status, index) => (
          <div
            onClick={() => setSelectedStatus(status.toLowerCase())}
            className={`${selectedStatus === status.toLowerCase()
              ? "bg-primary shadow-md shadow-primary/50 text-primaryText"
              : ""
              } p-[10px] rounded-[10px] cursor-pointer hover:bg-primary hover:shadow-md hover:shadow-primary/50 hover:text-primaryText`}
            key={index}
          >
            {status}
          </div>
        ))}

      </div> */}
      {/* <VehicleStatusSelector setSelectedStatus={setSelectedStatus} /> */}
      <div className="h-[190px]">
        {/* ======= search ======= */}
        <div className="relative ">
          <div className=" fill-quaternary absolute top-4 left-4">
            <SearchCarSVG />
          </div>
          <div className="absolute top-4 right-4">
            {searchKey ? (
              <span onClick={() => setSearchKey("")} className="cursor-pointer">
                <CrossSVG />
              </span>
            ) : (
              <Search />
            )}
          </div>
          <input
            onChange={(e) => setSearchKey(e.target.value)}
            value={searchKey}
            className="py-[18px] px-14 text-sm rounded-lg w-full  tmv-shadow placeholder:text-tertiaryText outline-quaternary"
            placeholder="Search vehicle"
            type="text"
          />
        </div>

        {/* ==========filter========= */}
        <div className="mt-4 text-tertiaryText">
          {/* <div>
            <select
              onChange={(e) => setType(e.target.value)}
              className="py-[16px] text-sm rounded-lg w-full  tmv-shadow placeholder:text-tertiaryText outline-quaternary"
            >
              <option value="">Type</option>
            </select>
          </div> */}
          <div className="flex items-center space-x-4 mt-4">
            <select
              onChange={(e) => setEvent(e.target.value)}
              className="py-[16px] text-sm rounded-lg w-full  tmv-shadow placeholder:text-tertiaryText outline-quaternary"
            >
              <option value="all_event">All Event</option>
              <option value="engine_on">Engine On</option>
              <option value="engine_off">Engine Off</option>
              <option value="overspeed">Overspeed</option>
              <option value="panic">Panic</option>
              <option value="offline">Offline</option>
              <option value="disconnect">Disconnect</option>
            </select>

            <select
              onChange={(e) => setAlert(e.target.value)}
              className="py-[16px] text-sm rounded-lg w-full  tmv-shadow placeholder:text-tertiaryText outline-quaternary"
            >
              <option value="no_alert">No Alert</option>
              <option value="email">Email</option>
              <option value="sms">Sms</option>
              <option value="both">Both</option>
            </select>
          </div>
        </div>

        {/* ==== add vehicle ==== */}
        <div className="pt-4">
          <button
            disabled={isRequesting}
            onClick={handleGetCurrentSelectedVehicle}
            className="flex items-center justify-center w-full rounded-xl bg-primary py-3 shadow-md shadow-primary/50 hover:shadow-xl hover:shadow-primary/60 duration-300"
          >
            <p className="text-sm font-bold">
              {isRequesting ? "Loading..." : "Update Alerts"}
            </p>
          </button>
        </div>
      </div>
      {/* =========== skeleton loader =========== */}
      {isLoading ? (
        <div className={`h-[440px] overflow-hidden mt-5`}>
          <div className="flex items-center justify-between mb-4">
            <p className="w-24 h-7 skeleton rounded"></p>
            <p className="w-28 h-7 skeleton rounded"></p>
          </div>
          <div className="w-full h-20 border-[3px] skeleton-border rounded-2xl p-1 mb-3">
            <div className="w-full h-full skeleton rounded-2xl "></div>
          </div>
          <div className="w-full h-20 border-[3px] skeleton-border rounded-2xl p-1 mb-3">
            <div className="w-full h-full skeleton rounded-2xl "></div>
          </div>
          <div className="w-full h-20 border-[3px] skeleton-border rounded-2xl p-1 mb-3">
            <div className="w-full h-full skeleton rounded-2xl "></div>
          </div>
          <div className="w-full h-20 border-[3px] skeleton-border rounded-2xl p-1 mb-3">
            <div className="w-full h-full skeleton rounded-2xl "></div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col min-h-[200px] calc-height-190">
          {/* ======= vehicle details ======= */}
          <div className="flex justify-between my-4 text-tertiaryText text-sm select-none">
            <div className="flex items-center relative">
              <div
                onClick={() => !isRequesting && handleMultipleSelectVehicles()}
                className="w-6 h-6 rounded tmv-shadow bg-white flex justify-center items-center cursor-pointer z-10"
              >
                {isSelectedAll ? <Tik /> : ""}
              </div>
              {isSelectedAll ? (
                <span className="animate-pingOne absolute inline-flex h-6 w-6 rounded bg-primary opacity-75"></span>
              ) : (
                ""
              )}

              <p className="ml-2.5">Select All</p>
            </div>
            <p>
              Total Vehicles{" "}
              <span className="font-bold">{totalVehicleCount}</span>
            </p>
          </div>

          {/* ======= vehicle list ======= */}
          <div
            className={`overflow-y-auto pr-3.5 select-none scrollGray h-[100%]`}
          >
            {filteredVehicle.map((group, index) => (
              <div key={index}>
                <p>Group: {group.group}</p>
                {group.vehicles.map((vehicle, index) => (
                  <div
                    onClick={() =>
                      !isRequesting && handleSingleSelectVehicle(vehicle)
                    }
                    // onClick={() => vehicle.selected = true}
                    className="flex justify-between bg-[#FAFAFA] mb-2 rounded-xl p-4 cursor-pointer"
                    key={index}
                  >
                    <div className="flex items-center">
                      <img
                        className="w-10 h-10"
                        src={handleSelectorVehicleType(
                          vehicle && vehicle.vehicle_type
                            ? vehicle.vehicle_type.toLowerCase()
                            : ""
                        )}
                        alt=""
                      />
                      <div className="ml-5 ">
                        <p className="font-bold text-primaryText">
                          {vehicle.bst_id}
                        </p>
                        <p className="font-light text-tertiaryText">
                          {vehicle.v_vrn}
                        </p>
                      </div>
                    </div>
                    <div className="flex relative">
                      <div className="w-6 h-6 rounded tmv-shadow bg-white flex justify-center items-center z-10">
                        {vehicle.selected ? <Tik /> : ""}
                      </div>
                      {vehicle.selected ? (
                        <span className="animate-pingOne absolute inline-flex h-6 w-6 rounded bg-primary opacity-75"></span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
            {/* empty space */}
            <div className=" h-6 "></div>
          </div>
        </div>
      )}
      {/* SELECTED VEHICLE COUNT UI */}
      <SelectedVehicleCount
        clicked={clicked}
        setClicked={setClicked}
        getCurrentSelectedVehicleLength={getCurrentSelectedVehicleLength}
        xlScreen={xlScreen}
      />
    </div>
  );
};

export default AlertMultipleVehicleSelector;
