import React, { useEffect, useMemo, useRef, useState } from "react";
import "../../styles/pages/Home.css";
import car_1 from "../../public/cars/car-1.png";
import AddVehicle from "@/svg/AddVehicleSVG";
import SearchCarSVG from "../SVG/SearchCarSVG";
import Search from "@/svg/SearchSVG";
import Tik from "@/svg/TikSVG";
import VehicleStatusSelector from "../VehicleStatusSelector";
import CrossSVG from "@/svg/CrossSVG";
import axios from "@/plugins/axios";
import baseUrl from "@/plugins/baseUrl";
import Link from "next/link";

import "../../styles/components/sidebarSelectors.css";
import "../../styles/pages/Home.css";

// import axios from "axios";

//==========store=========
import { useDispatch, useSelector } from "react-redux";
import { fetchVehicleLists } from "@/store/slices/vehicleSlice";
import SelectedVehicleCount from "./SelectedVehicleCount";
import { handleSelectorVehicleType } from "@/utils/vehicleTypeCheck";

// getSelectedVehicles,
// getSingleVehicle,

const GeoFenceMultipleVehicleSelector = ({
  isSelected,
  isRequesting,
  getMultipleSelectedVehicles,
  getSingleSelectedVehicle,
  vehicleLists,
  setVehicleLists,
  clicked,
  setClicked,
  xlScreen,
  height,
}) => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchKey, setSearchKey] = useState("");
  const [isSelectedAll, setIsSelectedAll] = useState(false);
  // const [vehicleLists, setVehicleLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isDispatched = useRef(false);

  //=========store========
  const dispatch = useDispatch();
  const { storeVehicleLists, isStoreLoading } = useSelector(
    (state) => state.reducer.vehicle
  );

  const initVehicles = (vehicleLists, value) => {
    // console.log("init value", value);
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
  };

  const filterSelectedVehicles = async (updatedData) => {
    const selectedVehicles = updatedData.reduce((acc, group) => {
      return [...acc, ...group.vehicles.filter((vehicle) => vehicle.selected)];
    }, []);
    // return selectedVehicles;
    getMultipleSelectedVehicles(selectedVehicles);
  };

  const getCurrentSelectedVehicle = (allVehiclesArray) => {
    // console.log("allVehiclesArray", allVehiclesArray);
    return allVehiclesArray.filter((vehicle) => vehicle.selected === true);
  };

  const handleMultipleSelectVehicles = () => {
    initVehicles(filteredVehicle, !isSelectedAll ? true : false);
    setIsSelectedAll(!isSelectedAll);

    // convert to flat map
    const allVehiclesArray = vehicleLists.flatMap((group) => group.vehicles);

    getMultipleSelectedVehicles(getCurrentSelectedVehicle(allVehiclesArray));
  };

  const checkAllSelected = () => {
    // convert to flat map
    const allVehiclesArray = filteredVehicle.flatMap((group) => group.vehicles);

    return allVehiclesArray.length &&
      allVehiclesArray.every((vehicle) => vehicle.selected === true)
      ? setIsSelectedAll(true)
      : setIsSelectedAll(false);
  };

  // Getting current selected vehicle
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
                vehicle?.v_status?.toLowerCase() ===
                  selectedStatus?.toLowerCase())
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
        initVehicles(vehicleLists, true); // check
        setIsSelectedAll(true);
        handleMultipleSelectVehicles();
      } else {
        initVehicles(vehicleLists, false);
        setIsSelectedAll(false);
      }
    } else {
      checkAllSelected(); // check
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

  return (
    <div className="relative">
      <div className="multiple-vehicle-selector-sidebar relative w-[327px] h-[77vh] rounded-xl bg-white p-4 overflow-hidden">
        <div className="h-[80px]">
          {/* <VehicleStatusSelector setSelectedStatus={setSelectedStatus} /> */}
          {/* ======= search ======= */}
          <div className=" relative ">
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
              onChange={(e) => setSearchKey(e.target.value)}
              value={searchKey}
              className="py-[18px] px-14 text-sm rounded-lg w-full  tmv-shadow placeholder:text-tertiaryText outline-quaternary"
              placeholder="Search vehicle"
              type="text"
            />
          </div>
        </div>
        {/* =========== skeleton loader =========== */}
        {isLoading ? (
          <div className={`h-[440px] overflow-hidden mt-5`}>
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
          </div>
        ) : (
          <div className="flex flex-col min-h-[200px] calc-height">
            {/* ======= vehicle details ======= */}
            {/* <div className="flex justify-between my-5 text-tertiaryText text-sm select-none">
                            <div className="flex items-center relative">
                                <div
                                    onClick={() =>
                                        !isRequesting && handleMultipleSelectVehicles()
                                    }
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
                                Total Vehicles
                                <span className="font-bold"> {totalVehicleCount}</span>
                            </p>
                        </div> */}

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
              {/* empty space */}
              {/* <div className=" h-[100px]"></div> */}
            </div>
          </div>
        )}

        {/* add vehicle */}
        {/* <div className="w-full absolute bottom-0 left-0 flex justify-center pb-0 pt-20 bg-gradient-to-t from-white rounded-b-xl z-10">

                    <button className="mb-4 flex items-center justify-center w-32 rounded-xl bg-primary py-3 shadow-md shadow-primary/50 hover:shadow-xl hover:shadow-primary/60 duration-300">
                        <p className="ml-2.5 text-sm font-bold">Assign</p>
                    </button>

                </div> */}
      </div>
      <SelectedVehicleCount
        clicked={clicked}
        setClicked={setClicked}
        xlScreen={xlScreen}
        getCurrentSelectedVehicleLength={getCurrentSelectedVehicleLength}
      />
    </div>
  );
};

export default GeoFenceMultipleVehicleSelector;
