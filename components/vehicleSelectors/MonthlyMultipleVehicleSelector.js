"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

// date-time-picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

//======= svg & img
import car_1 from "../../public/cars/car-1.png";

import Calender from "@/svg/CalenderSVG";
import SearchCarSVG from "../SVG/SearchCarSVG";
import Search from "@/svg/SearchSVG";
import Tik from "@/svg/TikSVG";
import CrossSVG from "@/svg/CrossSVG";

//======= css
import "../../styles/pages/Home.css";
import "../../styles/components/sidebarSelectors.css";

//==========store=========
import { useDispatch, useSelector } from "react-redux";
import { fetchVehicleLists } from "@/store/slices/vehicleSlice";
import SelectedVehicleCount from "./SelectedVehicleCount";
import moment from "moment";
import { handleSelectorVehicleType } from "@/utils/vehicleTypeCheck";

const MonthlyMultipleVehicleSelector = ({
  isSelected,
  isRequesting,
  getMultipleSelectedVehicles,
  getSingleSelectedVehicle,
  setSelectedMonth,
  selectedMonth,
  height,
  vehicleLists,
  setVehicleLists,
  setTableData,
  tableData,
  clicked,
  setClicked,
}) => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchKey, setSearchKey] = useState("");
  const [isSelectedAll, setIsSelectedAll] = useState(false);
  // const [vehicleLists, setVehicleLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isDispatched = useRef(false);

  const router = useRouter();

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

    getSingleSelectedVehicle({
      ...selectedVehicle,
      selected: !selectedVehicle.selected,
    });
    // setTableData([]);
  };
  // tableData.length ? console.log(tableData, "After click") : "";

  const getCurrentSelectedVehicle = (allVehiclesArray) => {
    console.log("allVehiclesArray", allVehiclesArray);
    return allVehiclesArray.filter((vehicle) => vehicle.selected === true);
  };

  const handleMultipleSelectVehicles = () => {
    initVehicles(filteredVehicle, !isSelectedAll ? true : false);
    setIsSelectedAll(!isSelectedAll);

    // convert to flat map
    const allVehiclesArray = vehicleLists.flatMap((group) => group.vehicles);

    getMultipleSelectedVehicles(getCurrentSelectedVehicle(allVehiclesArray));
    setTableData([]);
  };

  const checkAllSelected = () => {
    // convert to flat map
    const allVehiclesArray = filteredVehicle.flatMap((group) => group.vehicles);

    return allVehiclesArray.length &&
      allVehiclesArray.every((vehicle) => vehicle.selected === true)
      ? setIsSelectedAll(true)
      : setIsSelectedAll(false);
  };

  // CURRENT SELECTED VEHICLES LENGTH =====================================
  const getCurrentSelectedVehicleLength = () => {
    const allVehiclesArray = vehicleLists.flatMap((group) => group.vehicles);
    return getCurrentSelectedVehicle(allVehiclesArray).length;
  };

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

  useEffect(() => {
    checkAllSelected();
  }, [vehicleLists, selectedStatus, searchKey]);

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
    }
  }, [router, isLoading]);

  return (
    <div className="relative w-[327px] rounded-xl bg-white  p-4 h-[75vh] overflow-hidden">
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

      <div className="h-[120px]">
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

        {/* ========== DATE RANGE ========= */}
        <div className="w-full relative tmv-shadow rounded-xl mt-2">
          <div className="h-[45px] flex items-center">
            <DatePicker
              selected={selectedMonth}
              onChange={(date) => setSelectedMonth(date)}
              dateFormat="MMMM"
              showMonthYearPicker
              className="w-[295px] p-2 rounded-xl z-40 outline-quaternary"
              placeholderText="Start Date"
              minDate={minDate}
            />
          </div>
          <div className="absolute right-2 top-3.5">
            <Calender />
          </div>
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
        <div className="flex flex-col min-h-[200px] calc-height">
          {/* ======= vehicle details ======= */}
          <div className="flex justify-between my-4 text-tertiaryText text-sm select-none ">
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
          <div className="overflow-y-auto scrollGray h-[100%] select-none pr-3.5">
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
          </div>
        </div>
      )}
      <SelectedVehicleCount
        clicked={clicked}
        setClicked={setClicked}
        getCurrentSelectedVehicleLength={getCurrentSelectedVehicleLength}
      />
    </div>
  );
};

export default MonthlyMultipleVehicleSelector;
