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
import axios from "@/plugins/axios";
import baseUrl from "@/plugins/baseUrl";
import Link from "next/link";
// import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment/moment";

//==========store=========
import { useDispatch, useSelector } from "react-redux";
import { fetchVehicleLists } from "@/store/slices/vehicleSlice";
import SelectedVehicleCount from "./SelectedVehicleCount";
import { set, setHours, setMinutes } from "date-fns";
import { useRouter } from "next/router";
import { async } from "regenerator-runtime";
import VehiclePeriodSelector from "../VehiclePeriodSelector";
import { handleSelectorVehicleType } from "@/utils/vehicleTypeCheck";

const SingleVehicleSelector = ({
  isRequesting,
  getSingleSelectedVehicle,
  clicked,
  setClicked,
}) => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [searchKey, setSearchKey] = useState("");
  const [vehicleLists, setVehicleLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const isDispatched = useRef(false);

  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // date time picker
  const currentDay = new Date();
  const [dateRange, setDateRange] = useState({
    startDate: new Date(
      currentDay.getFullYear(),
      currentDay.getMonth(),
      currentDay.getDate(),
      0,
      0,
      0,
      0
    ),
    endDate: new Date(),
  });

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
    if (dateRange.startDate === null && dateRange.endDate === null) {
      console.log("empty date");
      errorNotify("Please select start date and end date");
    } else if (dateRange.startDate !== null && dateRange.endDate === null) {
      console.log("empty startDate");
      errorNotify("Please select end date");
    } else if (dateRange.startDate === null && dateRange.endDate !== null) {
      console.log("empty endDate");
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
        getSingleSelectedVehicle(
          vehicle,
          dateRange.startDate,
          dateRange.endDate
        );
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
    if (
      dateRange.startDate !== null &&
      dateRange.endDate !== null &&
      selectedVehicle !== null
    ) {
      initVehicles(vehicleLists, false);
      selectedVehicle.selected = !selectedVehicle.selected;
      getSingleSelectedVehicle(
        selectedVehicle,
        dateRange.startDate,
        dateRange.endDate
      );
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
    if (fieldName === "startDate") {
      setDateRange({
        ...dateRange,
        startDate: date,
      });
    }

    if (fieldName === "endDate") {
      setDateRange({
        ...dateRange,
        endDate: date,
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

  useEffect(() => {
    if (selectedPeriod === "today") {
      setDateRange({
        startDate: new Date(
          currentDay.getFullYear(),
          currentDay.getMonth(),
          currentDay.getDate(),
          0,
          0,
          0,
          0
        ),
        endDate: new Date(),
      });
    } else if (selectedPeriod === "yesterday") {
      setDateRange({
        startDate: new Date(
          currentDay.getFullYear(),
          currentDay.getMonth(),
          currentDay.getDate() - 1,
          0,
          0,
          0,
          0
        ),
        endDate: new Date(
          currentDay.getFullYear(),
          currentDay.getMonth(),
          currentDay.getDate() - 1,
          23,
          59,
          59,
          59,
          999
        ),
      });
    } else if (selectedPeriod === "last 7 days") {
      setDateRange({
        startDate: new Date(
          currentDay.getFullYear(),
          currentDay.getMonth(),
          currentDay.getDate() - 7,
          0,
          0,
          0,
          0
        ),
        endDate: new Date(
          currentDay.getFullYear(),
          currentDay.getMonth(),
          currentDay.getDate() - 1,
          23,
          59,
          59,
          59,
          999
        ),
      });
    }
  }, [selectedPeriod]);

  return (
    <div className="relative lg:top-16 lg:-mt-3">
      <div className="relative w-[327px] h-[83.5vh] rounded-xl bg-white p-4 overflow-hidden">
        <div className="h-[260px] absolute top-6">
          {/* <div className="flex items-center justify-between text-sm text-tertiaryText">
                {
                    vehicleStatus.map((status, index) => (
                        <div onClick={() => setSelectedStatus(status.toLowerCase())} className={`${selectedStatus === status.toLowerCase() ? 'bg-primary shadow-md shadow-primary/50 text-primaryText' : ''} p-[10px] rounded-[10px] cursor-pointer hover:bg-primary hover:shadow-md hover:shadow-primary/50 hover:text-primaryText`} key={index}>{status}</div>
                    ))
                }
            </div> */}
          {/* <VehicleStatusSelector setSelectedStatus={setSelectedStatus} /> */}

          {/* search */}
          <div className="mb-4 relative ">
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

          {/* period */}
          <VehiclePeriodSelector
            setSelectedPeriod={setSelectedPeriod}
            selectedPeriod={selectedPeriod}
          />

          {/* ======== start date and timepicker ======== */}
          <div className="flex justify-between items-center my-4 space-x-2">
            <div className="relative tmv-shadow rounded-xl w-40">
              <div className="h-[45px] flex items-center">
                <DatePicker
                  selected={dateRange.startDate}
                  onChange={(date) => handleTimeSelect(date, "startDate")}
                  dateFormat="dd/MM/yyyy"
                  className="w-40 p-2 rounded-xl z-40 outline-quaternary"
                  placeholderText="Start Date"
                  minDate={minDate}
                />
              </div>
              <div className="absolute right-2 top-3.5">
                <Calender />
              </div>
            </div>

            <div className="relative tmv-shadow rounded-xl w-32">
              <div className="h-[45px] flex items-center">
                <DatePicker
                  selected={dateRange.startDate}
                  onChange={(date) => handleTimeSelect(date, "startDate")}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  className="w-32 p-2 rounded-xl z-40 outline-quaternary"
                  placeholderText="Start Time"
                  minDate={minDate}
                />
              </div>
              <div className="absolute right-2 top-3.5">
                <Timer />
              </div>
            </div>
          </div>

          {/* ======== end date and time picker ======== */}
          <div className="flex justify-between items-center my-4 space-x-2">
            <div className="relative tmv-shadow rounded-xl w-40">
              <div className="h-[45px] flex items-center">
                <DatePicker
                  selected={dateRange.endDate}
                  onChange={(date) => handleTimeSelect(date, "endDate")}
                  dateFormat="dd/MM/yyyy"
                  className="w-40 p-2 rounded-xl z-40 outline-quaternary"
                  placeholderText="End Date"
                  minDate={minDate}
                />
              </div>
              <div className="absolute right-2 top-3.5">
                <Calender />
              </div>
            </div>

            <div className="relative tmv-shadow rounded-xl w-32">
              <div className="h-[45px] flex items-center">
                <DatePicker
                  selected={dateRange.endDate}
                  onChange={(date) => handleTimeSelect(date, "endDate")}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  className="w-32 p-2 rounded-xl z-40 outline-quaternary"
                  placeholderText="End Time"
                  minDate={minDate}
                />
              </div>
              <div className="absolute right-2 top-3.5">
                <Timer />
              </div>
            </div>
          </div>
          <div>
            {/* <button className="example-custom-input" onClick={handleClick}>
                    {format(startDate, "dd-MM-yyyy")}
                </button> */}
            {/* 
                <DatePicker showTimeInput
                    showTimeSelectOnly
                    timeCaption="Timea"
                    dateFormat="h:mm aa"
                    selected={startDate} onChange={handleChange} className="fixed" inline /> */}
          </div>
        </div>
        {/* =========== skeleton loader =========== */}
        {isLoading ? (
          <div className={`h-[410px] overflow-hidden mt-[260px]`}>
            {/* <div className="flex items-center justify-between mb-4">
            <p className="w-24 h-7 skeleton rounded"></p>
            <p className="w-28 h-7 skeleton rounded"></p>
          </div> */}
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
          <div
            className={`overflow-y-auto pr-3.5 select-none scrollGray calc-height-250 mt-[270px]`}
          >
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
            {/* empty space */}
            <div className=" h-[300px]"></div>
          </div>
        )}

        {/* add vehicle */}
        {/* <div className="w-full absolute bottom-0 left-0 flex justify-center pb-0 pt-20 bg-gradient-to-t from-white rounded-b-xl z-10 -mb-2">
          <Link href={`/support/vehicle-profile?addNewVehicle=true`}>
            <button className="mb-4 flex items-center justify-center w-48 rounded-xl bg-primary py-4 shadow-md shadow-primary/50 hover:shadow-xl hover:shadow-primary/60 duration-300">
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

export default SingleVehicleSelector;
