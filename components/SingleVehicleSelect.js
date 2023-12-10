import React, { useEffect, useMemo, useRef, useState } from "react";
import "../styles/pages/Home.css";
import car_1 from "../public/cars/car-1.png";
import AddVehicle from "@/svg/AddVehicleSVG";
import SearchCar from "@/svg/SearchCarSVG";
import Search from "@/svg/SearchSVG";

// date-time-picker

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import format from "date-fns/format"
// import momentGenerateConfig from 'rc-picker/lib/generate/moment';
import dateFnsGenerateConfig from "rc-picker/lib/generate/dateFns";
import enUS from "rc-picker/lib/locale/en_US";
import Calender from "@/svg/CalenderSVG";
import Timer from "@/svg/TimerSVG";
import VehicleStatusSelector from "./VehicleStatusSelector";
import CrossSVG from "@/svg/CrossSVG";
import Link from "next/link";

const SingleVehicleSelect = ({
  dateRange,
  setDateRange,
  getSelectedVehicle,
  getAllVehicles,
}) => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [seacrchKey, setSearchKey] = useState("");
  const [allVehicles, setAllVehicles] = useState([
    {
      group: "A",
      vehicles: [
        {
          id: 1,
          image: "car-1",
          name: "TMV 28281",
          reg: "Dhk-D-11-9999",
          status: "offline",
        },
        {
          id: 2,
          image: "car-2",
          name: "TMV 28282",
          reg: "Dhk-D-11-9998",
          status: "online",
        },
      ],
    },
    {
      group: "B",
      vehicles: [
        {
          id: 3,
          image: "car-3",
          name: "TMV 28283",
          reg: "Dhk-D-11-9997",
          status: "suspended",
        },
        {
          id: 4,
          image: "car-4",
          name: "TMV 28284",
          reg: "Dhk-D-11-9998",
          status: "suspended",
        },
      ],
    },
  ]);

  const initVehicles = (vehicles, value) => {
    vehicles.map((group) => {
      group.vehicles.map((vehicle) => {
        vehicle["selected"] = value;
      });
    });
  };

  const selectVehicle = (vehicle) => {
    // console.log(vehicle);
    initVehicles(allVehicles, false);
    vehicle.selected = !vehicle.selected;
    getSelectedVehicle(vehicle);
  };

  // search and filter start
  const filteredVehicle = useMemo(() => {
    // if (selectedStatus.toLowerCase() === 'all' && !seacrchKey) {
    //     return allVehicles
    // }

    return allVehicles
      .map((group) => {
        return {
          group: group.group,
          vehicles: group.vehicles.filter((vehicle) => {
            return (
              (vehicle.name.toLowerCase().includes(seacrchKey.toLowerCase()) ||
                vehicle.reg.toLowerCase().includes(seacrchKey.toLowerCase())) &&
              (selectedStatus.toLowerCase() === "all" ||
                vehicle.status.toLowerCase() === selectedStatus.toLowerCase())
            );
          }),
        };
      })
      .filter((group) => group.vehicles.length > 0);
  }, [selectedStatus, seacrchKey, allVehicles]);
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

  useEffect(() => {
    initVehicles(allVehicles, false);
  }, []);
  useEffect(() => {
    console.log(selectedStatus);
  }, [selectedStatus]);

  // ========== handle time picker ========
  const handleStartTime = (date, fieldName) => {
    if (fieldName === "startDate") {
      setDateRange({
        ...dateRange,
        startDate: date,
        startTime: date,
      });
    }
    if (fieldName === "startTime") {
      setDateRange({
        ...dateRange,
        startDate: date,
        startTime: date,
      });
    }
    if (fieldName === "endDate") {
      setDateRange({
        ...dateRange,
        endDate: date,
        endTime: date,
      });
    }
    if (fieldName === "endTime") {
      setDateRange({
        ...dateRange,
        endDate: date,
        endTime: date,
      });
    }

    console.log(fieldName, "==== date ====", date);
  };

  return (
    <div className="relative w-[327px] rounded-xl bg-white p-4">
      {/* <div className="flex items-center justify-between text-sm text-tertiaryText">
                {
                    vehicleStatus.map((status, index) => (
                        <div onClick={() => setSelectedStatus(status.toLowerCase())} className={`${selectedStatus === status.toLowerCase() ? 'bg-primary shadow-md shadow-primary/50 text-primaryText' : ''} p-[10px] rounded-[10px] cursor-pointer hover:bg-primary hover:shadow-md hover:shadow-primary/50 hover:text-primaryText`} key={index}>{status}</div>
                    ))
                }
            </div> */}
      <VehicleStatusSelector setSelectedStatus={setSelectedStatus} />
      {/* search */}
      <div className="mt-4 relative ">
        <div className="absolute top-4 left-4">
          <SearchCar />
        </div>
        <div className="absolute top-4 right-4">
          {seacrchKey ? (
            <span onClick={() => setSearchKey("")} className="cursor-pointer">
              <CrossSVG />
            </span>
          ) : (
            <Search />
          )}
        </div>
        <input
          value={seacrchKey}
          onChange={(e) => setSearchKey(e.target.value)}
          className="py-[18px] px-14 text-sm rounded-lg w-full tmv-shadow placeholder:text-tertiaryText outline-quaternary"
          placeholder="Search vehicle"
          type="text"
        />
      </div>

      {/* ======== start date and timepicker ======== */}
      <div className="flex justify-between items-center my-4 ">
        <div className="relative tmv-shadow rounded-xl w-40">
          <div className="h-[45px] flex items-center">
            <DatePicker
              selected={dateRange.startDate}
              onChange={(date) => handleStartTime(date, "startDate")}
              dateFormat="dd/MM/yyyy"
              showTimeInput
              className="w-40 p-2 rounded-xl z-40 outline-quaternary"
              placeholderText="Start Date"
            />
          </div>
          <div className="absolute right-2 top-3.5">
            <Calender />
          </div>
        </div>

        <div className="relative tmv-shadow rounded-xl w-32">
          <div className="h-[45px] flex items-center">
            <DatePicker
              selected={dateRange.startTime}
              onChange={(date) => handleStartTime(date, "startTime")}
              showTimeInput
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="h:mm aa"
              className="w-32 p-2 rounded-xl z-40 outline-quaternary"
              placeholderText="Start Time"
            />
          </div>
          <div className="absolute right-2 top-3.5">
            <Timer />
          </div>
        </div>
      </div>

      {/* ======== end date and time picker ======== */}
      <div className="flex justify-between items-center my-4 ">
        <div className="relative tmv-shadow rounded-xl w-40">
          <div className="h-[45px] flex items-center">
            <DatePicker
              selected={dateRange.endDate}
              onChange={(date) => handleStartTime(date, "endDate")}
              dateFormat="dd/MM/yyyy"
              showTimeInput
              className="w-40 p-2 rounded-xl z-40 outline-quaternary"
              placeholderText="End Date"
            />
          </div>
          <div className="absolute right-2 top-3.5">
            <Calender />
          </div>
        </div>

        <div className="relative tmv-shadow rounded-xl w-32">
          <div className="h-[45px] flex items-center">
            <DatePicker
              selected={dateRange.endTime}
              onChange={(date) => handleStartTime(date, "endTime")}
              showTimeInput
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="h:mm aa"
              className="w-32 p-2 rounded-xl z-40 outline-quaternary"
              placeholderText="End Time"
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

      {/* vehicle list */}
      <div className="h-[350px] overflow-y-scroll pr-3.5 select-none scrollGray">
        {filteredVehicle.map((group, index) => (
          <div key={index}>
            <p>Group: {group.group}</p>
            {group.vehicles.map((vehicle, index) => (
              <div
                onClick={() => selectVehicle(vehicle)}
                className="flex justify-between bg-[#FAFAFA] mb-2 rounded-xl p-4 cursor-pointer group"
                key={index}
              >
                <div className="flex items-center">
                  <img src={car_1.src} className="" alt="" />
                  <div className="ml-5 ">
                    <p className="font-bold text-primaryText">{vehicle.name}</p>
                    <p className="font-light text-tertiaryText">
                      {vehicle.reg}
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
      </div>

      {/* empty space */}
      <div className="h-10"></div>

      {/* add vehicle */}
      {/* <div className="w-full absolute bottom-6 left-0 flex justify-center pb-0 pt-20 bg-gradient-to-t from-white rounded-b-xl z-10">
        <Link href={`/support/vehicle-profile?addNewVehicle=true`}>
          <button className="flex items-center justify-center w-48 rounded-xl bg-primary py-4 shadow-md shadow-primary/50 hover:shadow-xl hover:shadow-primary/60 duration-300">
            <AddVehicle />
            <p className="ml-2.5 text-sm font-bold">Add New Vehicle</p>
          </button>
        </Link>
      </div> */}
    </div>
  );
};

export default SingleVehicleSelect;
