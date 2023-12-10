import React, { useEffect, useMemo, useState } from "react";
import "../../styles/pages/Home.css";
import car_1 from "../../public/cars/car-1.png";
import AddVehicle from "@/svg/AddVehicleSVG";
import SearchCarSVG from "../../components/SVG/SearchCarSVG";
import Search from "@/svg/SearchSVG";
import Tik from "@/svg/TikSVG";
import VehicleStatusSelector from "../VehicleStatusSelector";
import CrossSVG from "@/svg/CrossSVG";
// import axios from "@/plugins/axios";
import baseUrl from "@/plugins/baseUrl";
import axios from "axios";
import { useSelector } from "react-redux";
import Link from "next/link";

const MultipleVehicleSelect = ({
  getSelectedVehicle,
  getAllVehicles,
  isSelected,
  height,
}) => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [seacrchKey, setSearchKey] = useState("");
  const [isSelectedAll, setIsSelectedAll] = useState(false);
  const [allVehicles, setAllVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isFirstCall, setIsFirstCall] = useState(true);

  const token = useSelector((state) => state.reducer.auth.token);

  const initVehicles = (allVehicles, value) => {
    console.log("init value", value);
    allVehicles.map((group) => {
      group.vehicles.map((vehicle) => {
        vehicle["selected"] = value;
      });
    });
  };

  const selectVehicle = (vehicle) => {
    // console.log('clicked before------------', vehicle);
    vehicle.selected = !vehicle.selected;
    // console.log('clicked after------------', vehicle);
    checkAllSelected();
    getSelectedVehicle(vehicle);
  };

  const getCurrentSelectedVehicle = (allVehiclesArray) => {
    return allVehiclesArray.filter((vehicle) => vehicle.selected === true);
  };

  const selectAllVehicles = () => {
    initVehicles(filteredVehicle, !isSelectedAll ? true : false);
    setIsSelectedAll(!isSelectedAll);

    // convert to flat map
    const allVehiclesArray = allVehicles.flatMap((group) => group.vehicles);
    // console.log('alll vehicles compoent', allVehiclesArray);
    // console.log("my array:", getCurrentSelectedVehicle(allVehiclesArray));
    getAllVehicles(getCurrentSelectedVehicle(allVehiclesArray));
    // !isSelectedAll ? getAllVehicles(allVehiclesArray) : getAllVehicles([])
  };

  const checkAllSelected = () => {
    // convert to flat map
    const allVehiclesArray = filteredVehicle.flatMap((group) => group.vehicles);

    return allVehiclesArray.length &&
      allVehiclesArray.every((vehicle) => vehicle.selected === true)
      ? setIsSelectedAll(true)
      : setIsSelectedAll(false);
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
              (vehicle.v_identifier !== null && vehicle.v_vrn !== null
                ? vehicle.v_identifier
                    .toLowerCase()
                    .includes(seacrchKey.toLowerCase()) ||
                  vehicle.v_vrn.toLowerCase().includes(seacrchKey.toLowerCase())
                : "") &&
              (selectedStatus.toLowerCase() === "all" ||
                vehicle.v_status.toLowerCase() === selectedStatus.toLowerCase())
            );
          }),
        };
      })
      .filter((group) => group.vehicles.length > 0);
  }, [selectedStatus, seacrchKey, allVehicles]);
  // search and filter end

  const totalVehicleCount = filteredVehicle.reduce((count, group) => {
    return count + group.vehicles.length;
  }, 0);

  const fetchVehicles = async () => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    console.log("baseUrl-----", baseUrl);
    await axios
      .get(baseUrl + "/api/v4/vehicle-list", config)
      .then((res) => {
        console.log("vehicle route", res.data.data);
        setAllVehicles(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  };

  // useEffect(() => {
  //   if (isFirstCall) {
  //     if (isSelected) {
  //       initVehicles(allVehicles, true);
  //       setIsSelectedAll(true);
  //       selectAllVehicles();
  //     } else {
  //       initVehicles(allVehicles, false);
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
        initVehicles(allVehicles, true);
        setIsSelectedAll(true);
        selectAllVehicles();
      } else {
        initVehicles(allVehicles, false);
        setIsSelectedAll(false);
      }
      setIsFirstCall(false);
    } else {
      checkAllSelected();
    }
  }, [allVehicles]);

  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <div className="relative w-[327px] rounded-xl bg-white  p-4">
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
      <VehicleStatusSelector setSelectedStatus={setSelectedStatus} />
      {/* ======= search ======= */}
      <div className="mt-4 relative ">
        <div className="fill-quaternary absolute top-4 left-4">
          <SearchCarSVG />
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
          onChange={(e) => setSearchKey(e.target.value)}
          value={seacrchKey}
          className="py-[18px] px-14 text-sm rounded-lg w-full  tmv-shadow placeholder:text-tertiaryText outline-quaternary"
          placeholder="Search vehicle"
          type="text"
        />
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
        <div>
          {/* ======= vehicle details ======= */}
          <div className="flex justify-between my-5 text-tertiaryText text-sm select-none">
            <div className="flex items-center relative">
              <div
                onClick={selectAllVehicles}
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
            style={{ height: "400px" }}
            className={`overflow-y-scroll pr-3.5 select-none scrollGray`}
          >
            {filteredVehicle.map((group, index) => (
              <div key={index}>
                <p>Group: {group.group}</p>
                {group.vehicles.map((vehicle, index) => (
                  <div
                    onClick={() => selectVehicle(vehicle)}
                    // onClick={() => vehicle.selected = true}
                    className="flex justify-between bg-[#FAFAFA] mb-2 rounded-xl p-4 cursor-pointer"
                    key={index}
                  >
                    <div className="flex items-center">
                      <img
                        className="w-10 h-10"
                        src={vehicle.v_image ? vehicle.v_image : car_1.src}
                        alt=""
                      />
                      <div className="ml-5 ">
                        <p className="font-bold text-primaryText">
                          {vehicle.v_identifier}
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

export default MultipleVehicleSelect;
