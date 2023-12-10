import React, { useEffect, useMemo, useRef, useState } from "react";
import "../../styles/pages/Home.css";
import car_1 from "../../public/cars/car-1.png";
import AddVehicle from "@/svg/AddVehicleSVG";
// import SearchCarSVG from "@/SVG/SearchCarSVG";
import Search from "@/svg/SearchSVG";

// date-time-picker

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Calender from "@/svg/CalenderSVG";
import Timer from "@/svg/TimerSVG";
import VehicleStatusSelector from "../VehicleStatusSelector";
import CrossSVG from "@/svg/CrossSVG";
import SearchCarSVG from "../SVG/SearchCarSVG";
import Link from "next/link";
// import axios from "axios";
import { toast } from "react-toastify";

import "../../styles/components/sidebarSelectors.css";
import "../../styles/pages/Home.css";

//==========store=========
import { useDispatch, useSelector } from "react-redux";
import { fetchVehicleLists } from "@/store/slices/vehicleSlice";
import SelectedVehicleCount from "./SelectedVehicleCount";
import { useRouter } from "next/router";
import { getYearMonthDay } from "@/utils/dateTimeConverter";
import moment from "moment";
import { handleSelectorVehicleType } from "@/utils/vehicleTypeCheck";

// ====THIS UI IS CLONE OF LOCATION REPORT SINGLE SELECTOR====

const SpeedReportSingleVehicleSelector = ({
  isRequesting,
  getSingleSelectedVehicle,
  clicked,
  setClicked,
  setDateRange,
  dateRange,
  setInterval,
  interval,
  top,
  height,
  margin,
}) => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchKey, setSearchKey] = useState("");
  const [vehicleLists, setVehicleLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const isDispatched = useRef(false);

  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const previousDay = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);

  //=========store========
  const dispatch = useDispatch();
  const { storeVehicleLists, isStoreLoading } = useSelector(
    (state) => state.reducer.vehicle
  );

  // DATA RETENTION (MINIMUM DATE USER CAN ACCESS) ===========================================
  const user = useSelector((state) => state.reducer.auth.user);
  const minDate =
    user.data_retention !== null
      ? moment()
          .subtract(user.data_retention - 1, "months")
          .toDate()
      : moment().subtract(1, "months").toDate();

  const initVehicles = (vehicles, value) => {
    vehicles.map((group) => {
      group.vehicles.map((vehicle) => {
        vehicle["selected"] = value;
      });
    });
  };

  const handleSingleSelectVehicle = (vehicle) => {
    // console.log(selectedVehicle);
    if (dateRange.date === null && dateRange.date === null) {
      console.log("empty date");
      errorNotify("Please select start date and end date");
    } else if (dateRange.date !== null && dateRange.date === null) {
      console.log("empty date");
      errorNotify("Please select end date");
    } else if (dateRange.date === null && dateRange.date !== null) {
      console.log("empty date");
      errorNotify("Please select start date");
    } else {
      if (
        selectedVehicle === null ||
        selectedVehicle.v_identifier !== vehicle.v_identifier
      ) {
        setClicked(false);
        setSelectedVehicle(vehicle);
        initVehicles(vehicleLists, false);
        vehicle.selected = !vehicle.selected;
        getSingleSelectedVehicle(vehicle, dateRange.date);
      }
    }
  };

  //=========search vehicle by identifier==========
  const searchVehicleByIdentifier = (identifier) => {
    const allVehiclesArray = vehicleLists.flatMap((group) => group.vehicles);
    console.log("search-1=======", identifier.toString());
    console.log("search-2=======", allVehiclesArray);
    const foundVehicle = allVehiclesArray.find(
      (vehicle) => vehicle.v_identifier === identifier.toString()
    );
    return foundVehicle;
  };

  const getCurrentSelectedVehicleLength = () => {
    return 0;
  };

  useEffect(() => {
    if (dateRange.date !== null && selectedVehicle !== null) {
      initVehicles(vehicleLists, false);
      selectedVehicle.selected = !selectedVehicle.selected;
      getSingleSelectedVehicle(selectedVehicle, dateRange.date);
    }
  }, [dateRange]);

  // search and filter start
  const filteredVehicle = useMemo(() => {
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
                vehicle.v_status?.toLowerCase() ===
                  selectedStatus.toLowerCase())
            );
          }),
        };
      })
      .filter((group) => group.vehicles.length > 0);
  }, [selectedStatus, searchKey, vehicleLists]);
  // search and filter end

  // const [isOpen, setIsOpen] = useState(false);
  // const handleChange = (e) => {
  //     setIsOpen(!isOpen);
  //     setStartDate(e);
  // };
  // const handleClick = (e) => {
  //     e.preventDefault();
  //     setIsOpen(!isOpen);
  // };

  const errorNotify = (mgs) => {
    toast.error(mgs, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  // ========== handle time picker ========
  const handleTimeSelect = (date, fieldName) => {
    if (fieldName === "date") {
      setDateRange({
        ...dateRange,
        date: date,
      });
    }
    console.log(fieldName, "==== date ====", date);
  };

  useEffect(() => {
    if (!isLoading) {
      initVehicles(vehicleLists, false);
    }
  }, [isLoading]);

  // useEffect(() => {
  //   console.log(selectedStatus);
  // }, [selectedStatus]);

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

  // =====select vehicle identifier from query string=====
  useEffect(() => {
    const queryStringIdentifier = router.asPath.split("identifier=")[1];
    if (queryStringIdentifier && !isLoading) {
      const result = searchVehicleByIdentifier(queryStringIdentifier);
      // console.log('url-----------', result);
      result && handleSingleSelectVehicle(result);
      // scroll to the v_identifier
      const element = document.getElementById(queryStringIdentifier);
      element &&
        element.scrollIntoView({
          block: "start",
          inline: "nearest",
        });
    }
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, [100]);
  }, [router, isLoading]);

  return (
    <div className="relative">
      <div
        className={`relative ${top} w-[327px] ${height} ${margin} rounded-xl bg-white p-4 overflow-hidden`}
      >
        <div className="h-[140px] absolute top-5 left-0 w-full px-4">
          {/* <VehicleStatusSelector setSelectedStatus={setSelectedStatus} /> */}
          {/* search */}
          <div className="relative ">
            <div className="fill-quaternary absolute top-4 left-4">
              <SearchCarSVG />
            </div>
            <div className="absolute top-4 right-4">
              {searchKey ? (
                <span
                  onClick={() => setSearchKey("")}
                  className="cursor-pointer"
                >
                  <CrossSVG />
                </span>
              ) : (
                <Search />
              )}
            </div>
            <input
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              className="py-[18px] px-14 text-sm rounded-lg w-full tmv-shadow placeholder:text-tertiaryText outline-quaternary"
              placeholder="Search vehicle"
              type="text"
            />
          </div>

          {/* ====== time interval ==== 
          <div className="pt-4">
            <p className="text-primaryText">Interval</p>
            <select
              selected={interval}
              onChange={(e) => setInterval(e.target.value)}
              className="px-3 tmv-shadow bg-white text-tertiaryText rounded-xl py-[15px] w-full outline-quaternary"
            >
              <option value="1">1 minute</option>
              <option value="5">5 minute</option>
              <option value="10">10 minute</option>
              <option value="20">20 minute</option>
              <option value="30">Half an hour</option>
              <option value="60">An hour </option>
            </select>
          </div> */}

          {/* ======== start date and timepicker ======== */}
          <div className="flex justify-between items-center my-4 space-x-3">
            <div className="relative tmv-shadow rounded-lg w-full flex items-center">
              <div className="h-[45px] flex items-center">
                <DatePicker
                  selected={dateRange.date}
                  onChange={(date) => handleTimeSelect(date, "date")}
                  dateFormat="dd/MM/yyyy"
                  className="w-full p-2 rounded-xl z-40 outline-none"
                  // placeholderText="Start Date"
                  placeholderText={getYearMonthDay(dateRange.date)}
                  minDate={minDate}
                />
              </div>
              <div className="absolute right-2 top-3.5">
                <Calender />
              </div>
            </div>
            {/* <div className="relative tmv-shadow rounded-xl w-full">
              <div className="h-[45px] flex items-center">
                <DatePicker
                  selected={dateRange.endDate}
                  onChange={(date) => handleTimeSelect(date, "endDate")}
                  dateFormat="dd/MM/yyyy"
                  className="w-full p-2 rounded-xl z-40 outline-quaternary"
                  placeholderText="End Date"
                />
              </div>
              <div className="absolute right-2 top-3.5">
                <Calender />
              </div>
            </div> */}
          </div>
        </div>
        {isLoading ? (
          <div className={`h-[440px] mt-[140px] overflow-hidden`}>
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
          <div className="flex flex-col calc-height-140 mt-[140px]">
            {/* ======= vehicle list ======= */}
            <div className="h-[83.5vh] overflow-y-scroll pr-3.5 select-none scrollGray">
              {filteredVehicle.map((group, index) => (
                <div key={index}>
                  <p>Group: {group.group}</p>
                  {group.vehicles.map((vehicle, index) => (
                    <div
                      onClick={() =>
                        !isRequesting && handleSingleSelectVehicle(vehicle)
                      }
                      className="flex justify-between bg-[#FAFAFA] mb-2 rounded-xl p-4 cursor-pointer group"
                      key={index}
                      id={vehicle.v_identifier}
                    >
                      <div className="flex items-center">
                        <img
                          className="w-12 h-12"
                          src={
                            vehicle.v_image === null
                              ? handleSelectorVehicleType(
                                  vehicle && vehicle.v_type
                                    ? vehicle.v_type.toLowerCase()
                                    : ""
                                )
                              : vehicle.v_image
                          }
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
                        <div className="w-6 h-6 rounded-full border-2 border-[#C9D1DA] group-hover:border-primary bg-[#FAFAFA] z-10 flex justify-center items-center">
                          {vehicle.selected ? (
                            <div className="w-3 h-3 bg-primary rounded-full"></div>
                          ) : (
                            ""
                          )}
                        </div>
                        {vehicle.selected ? (
                          <span className="animate-pingOne absolute inline-flex h-6 w-6 rounded-full bg-primary opacity-75"></span>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {/* ==== empty div for last items visibility ==== */}
              <div className="h-20"></div>
            </div>
          </div>
        )}

        {/* add vehicle */}
        {/* <div className="w-full absolute bottom-0 left-0 flex justify-center pb-6 pt-20 bg-gradient-to-t from-white rounded-b-xl z-10">
          <Link href={`/support/vehicle-profile?addNewVehicle=true`}>
            <button className="flex items-center justify-center w-48 rounded-xl bg-primary py-4 shadow-md shadow-primary/50 hover:shadow-xl hover:shadow-primary/60 duration-300">
              <AddVehicle />
              <p className="ml-2.5 text-sm font-bold">Add New Vehicle</p>
            </button>
          </Link>
        </div> */}
      </div>
      <SelectedVehicleCount
        clicked={clicked}
        setClicked={setClicked}
        getCurrentSelectedVehicleLength={getCurrentSelectedVehicleLength}
      />
    </div>
  );
};

export default SpeedReportSingleVehicleSelector;
