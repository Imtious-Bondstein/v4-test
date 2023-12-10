"use client";
import "regenerator-runtime";
import { useEffect, useMemo, useState } from "react";
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  usePagination,
} from "react-table";
import LeftArrowPaginateSVG from "../SVG/pagination/LeftArrowPaginateSVG";
import RightArrowPaginateSVG from "../SVG/pagination/RightArrowPaginateSVG";

import ThreeDotSVG from "../SVG/dashboard/ThreeDotSVG";
import DownArrowSVG from "../SVG/dashboard/DownArrowSVG";
import matchSorter from "match-sorter";
import SearchSVG from "../SVG/SearchSVG";
import DownloadSVG from "../SVG/DownloadSVG";
import SearchCarSVG from "../../components/SVG/SearchCarSVG";

// ========= images
import Car from "../../public/cars/table/realCar.png";
import Bike from "../../public/cars/table/realBike.png";
import Jeep from "../../public/cars/table/realJeep.png";
import PlusSVG from "../SVG/PlusSVG";
import AuthorizationModal from "../modals/AuthorizationModal";
import DriverAssignmentModal from "../modals/DriverAssignmentModal";

// ===== click out side
import { useDetectClickOutside } from "react-detect-click-outside";
import EditVehicleAlertModal from "../modals/EditVehicleAlertModal";
import GasolineConsumption from "../modals/GasolineConsumption";
import { useRef } from "react";
import Tik from "@/svg/TikSVG";

// excel generate
import { CSVLink } from "react-csv";
import SubAdminSVG from "../SVG/table/SubAdminSVG";
import { checkColor } from "@/utils/vehicleProfileColorMode";
import ThreeDotSVG2 from "../SVG/dashboard/ThreeDotSVG2";
import VehicleProfileDriverSVG from "../SVG/table/VehicleProfileDriverSVG";
import VehicleProfileVerifySVG from "../SVG/table/VehicleProfileVerifySVG";
import VehicleProfileGasSVG from "../SVG/table/VehicleProfileGasSVG";
import VehicleProfileEditSVG from "../SVG/table/VehicleProfileEditSVG";
import AddNewVehicleModal from "../modals/AddNewVehicleModal";
import Link from "next/link";
import { handleSelectorVehicleType } from "@/utils/vehicleTypeCheck";

// ======== styles

// ======= filter
// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <div
      className={`group fill-[#F36B24] bg-white px-5  w-full lg:w-[387px] flex items-center  rounded-lg searchbox-shadow relative lg:static bottom-16`}
    >
      <SearchCarSVG />

      <input
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder="Search your vehicle "
        className="py-3.5 grow px-3 outline-none text-[#8D96A1] text-sm"
      />

      <SearchSVG />
    </div>
  );
}

// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  );
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

// ==== main function ====
const VehicleProfileTable = ({
  profileData,
  allProfileData,
  isLoading,
  setAddNewVehicleModalIsOpen,
  addNewVehicleModalIsOpen,
}) => {
  const columns = useMemo(
    () => [
      // ====== index 0 sl
      {
        Header: "Sl",
        accessor: "sl",
      },

      // ====== index 1
      {
        Header: "Vehicle No",
        accessor: "vehicleNo",
      },

      // ====== index 2
      {
        Header: "Brand",
        accessor: "brand",
      },

      // ====== index 3
      {
        Header: "Model",
        accessor: "model",
      },

      // ====== index 4
      {
        Header: "Type",
        accessor: "type",
      },

      // ====== index 5
      {
        Header: "Colour",
        accessor: "color",
      },

      // ====== index 6
      {
        Header: "Engine No",
        accessor: "engineNo",
      },

      // ====== index 7
      {
        Header: "Chassis No",
        accessor: "chassisNo",
      },

      // ====== index 8
      {
        Header: "Fuel Capacity",
        accessor: "fuelCapacity",
      },

      // ====== index 9
      {
        Header: "Load Capacity",
        accessor: "loadCapacity",
      },

      // ====== index 10
      {
        Header: "Group",
        accessor: "group",
      },

      // ====== index 11
      {
        Header: "Driver",
        accessor: "driver",
      },

      // ====== index 12
      {
        Header: "Owner",
        accessor: "owner",
      },

      // ====== index 13
      {
        Header: "Vendor",
        accessor: "vendor",
      },

      // ====== index 14
      {
        Header: "Status",
        accessor: "status",
      },

      // ====== index 15
      {
        Header: "",
        accessor: "image",
      },

      // ====== index 16 isDropdown
      {
        Header: "",
        accessor: "isDropdown",
      },

      // ====== index 17 isRowSelected
      {
        Header: "",
        accessor: "isRowSelected",
      },

      // ====== index 18 isRowSelected
      {
        Header: "",
        accessor: "isAllRowSelected",
      },

      // ====== index 19 identifier
      {
        Header: "",
        accessor: "identifier",
      },
      // ====== 20 displayDropdownInfos
      {
        Header: "",
        accessor: "displayDropdownInfo",
      },
      // ====== 21 bst_id
      {
        Header: "",
        accessor: "bst_id",
      },
    ],
    []
  );

  //=======header for csv
  const headers = [
    { label: "Sl", key: "sl" },
    { label: "BSTID", key: "bst_id" },
    { label: "Vehicle No", key: "vehicleNo" },
    { label: "Brand", key: "brand" },
    { label: "Model", key: "model" },
    { label: "Type", key: "type" },
    { label: "Color", key: "color" },
    { label: "Engine No", key: "engineNo" },
    { label: "Chassis No", key: "chassisNo" },
    { label: "Fuel Capacity", key: "fuelCapacity" },
    { label: "Load Capacity", key: "loadCapacity" },
    { label: "Group", key: "group" },
    { label: "Driver", key: "driver" },
    { label: "Owner", key: "owner" },
    { label: "Vendor", key: "vendor" },
    { label: "Status", key: "status" },
  ];

  //  {
  //     sl: 1,
  //     vehicleNo: "TMV 28281 DM LA 118-4479",
  //     image: "bike",
  //     brand: "suzuki",
  //     model: "gixxer",
  //     type: "bike",
  //     color: "Red",
  //     engineNo: "1234567890",
  //     chassisNo: "1234567890",
  //     fuelCapacity: "15.00 Ltr",
  //     loadCapacity: "2 Ton",
  //     group: "HR & Studio",
  //     driver: "Anis Mia",
  //     owner: "Fazle Rabbi",
  //     vendor: "Fazle Rabbi",
  //     status: "red",
  //   },
  const [data, setData] = useState([]);
  const [dropDownsTracker, setDropDownsTracker] = useState([]);
  const [clickDropdownInfoTracker, setClickDropdownInfoTracker] = useState([]);

  const [selectedVehicle, setSelectedVehicle] = useState({});
  const [driverModalIsOpen, setDriverModalIsOpen] = useState(false);
  const [authorizationModalIsOpen, setAuthorizationModalIsOpen] =
    useState(false);
  const [gasolineModalIsOpen, setGasolineModalIsOpen] = useState(false);

  const displaySelectedModal = (vehicle, modalName) => {
    console.log(vehicle);
    setSelectedVehicle(vehicle);
    if (modalName === "driver") {
      setDriverModalIsOpen(true);
      setAuthorizationModalIsOpen(false);
      setGasolineModalIsOpen(false);
    } else if (modalName === "authorization") {
      setAuthorizationModalIsOpen(true);

      setDriverModalIsOpen(false);
      setGasolineModalIsOpen(false);
    } else if (modalName === "gasoline") {
      setGasolineModalIsOpen(true);

      setAuthorizationModalIsOpen(false);
      setDriverModalIsOpen(false);
    }
  };

  // const clickDropdown = (item) => {
  //   const newState = data.map((obj) => {
  //     if (obj.sl === item.sl) {
  //       return { ...obj, isDropdown: !item.isDropdown };
  //     }
  //     return obj;
  //   });
  //   setData(newState);
  // };

  const initData = () => {
    setDropDownsTracker(
      profileData.map((item) => ({
        identifier: item.identifier,
        isDropdown: false,
        isRowSelected: false,
        isAllRowSelected: false,
        displayDropdownInfo: false,
      }))
    );
    setClickDropdownInfoTracker(
      profileData.map((item, index) => ({
        identifier: item.identifier,
        isDropdown: false,
        isRowSelected: false,
        isAllRowSelected: false,
        displayDropdownInfo: false,
      }))
    );
  };

  // search by identifier
  const searchVehicleByIdentifier = (id) => {
    return dropDownsTracker.find((profile) => profile.identifier === id);
  };
  const searchVehicleByIdentifierInfo = (id) => {
    return clickDropdownInfoTracker.find(
      (profile) => profile.identifier === id
    );
  };

  const clickDropdown = (item) => {
    console.log(" Tracker item:---", item);
    console.log("dropDownsTracker:---", dropDownsTracker);
    const newState = dropDownsTracker.map((vehicle) => {
      if (vehicle.identifier === item.identifier) {
        return { ...vehicle, isDropdown: !vehicle.isDropdown };
      }
      return vehicle;
    });
    setDropDownsTracker(newState);
  };

  // Showing Details For Mobile Devices
  const clickDropdownInfo = (item) => {
    const newState = clickDropdownInfoTracker.map((vehicle) => {
      if (vehicle.identifier === item.identifier) {
        return {
          ...vehicle,
          displayDropdownInfo: !vehicle.displayDropdownInfo,
        };
      }
      return vehicle;
    });
    setClickDropdownInfoTracker(newState);
    // console.log(setClickDropdownInfoTracker , "dataaaaaaaaaaaaaaaaaaaaaaaaaa" )
  };
  const dropdownsRef = useRef([]);

  function handleOutsideClick(e) {
    dropdownsRef.current.forEach((dropdownRef, index) => {
      if (dropdownRef && !dropdownRef.contains(e.target)) {
        setClickDropdownInfoTracker((prevState) => {
          const updatedState = [...prevState];
          updatedState[index].displayDropdownInfo = false;
          return updatedState;
        });
      }
    });
    // console.log("dropdown ref:", dropdownsRef.current);
    dropdownsRef.current.forEach((dropdownRef, index) => {
      if (dropdownRef && !dropdownRef.contains(e.target)) {
        setDropDownsTracker((prevState) => {
          const updatedState = [...prevState];
          updatedState[index].isDropdown = false;
          return updatedState;
        });
      }
    });
  }

  // const initData = () => {
  //   setData(
  //     profileData.map((item) => ({
  //       ...item,
  //       isDropdown: false,
  //       isRowSelected: false,
  //       isAllRowSelected: false,
  //     }))
  //   );
  // };

  // ===== click outside ref

  // function handleOutsideClick(e) {
  //   dropdownsRef.current.forEach((dropdownRef, index) => {
  //     if (dropdownRef && !dropdownRef.contains(e.target)) {
  //       setData((prevState) => {
  //         const updatedState = [...prevState];
  //         updatedState[index].isDropdown = false;
  //         return updatedState;
  //       });
  //     }
  //   });
  // }

  useEffect(() => {
    setData(profileData);
    initData();
  }, [profileData]);

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick, true);

    return () => {
      document.removeEventListener("click", handleOutsideClick, true);
    };
  }, []);

  const clickRowSelect = (row) => {
    console.log("row", row);

    const newState = data.map((vehicle) => {
      if (vehicle.sl === row.sl) {
        return { ...vehicle, isRowSelected: !row.isRowSelected };
      }
      return vehicle;
    });
    setData(newState);
  };

  const [isAllRowSelected, setIsAllRowSelected] = useState(false);

  const clickAllRowSelect = () => {
    setIsAllRowSelected(!isAllRowSelected);
    const newState = data.map((vehicle) => {
      if (!isAllRowSelected) {
        return { ...vehicle, isRowSelected: true };
      } else {
        return { ...vehicle, isRowSelected: false };
      }
    });
    setData(newState);
  };

  useEffect(() => {
    const allSelected = data.every((vehicle) => vehicle.isRowSelected);
    allSelected ? setIsAllRowSelected(true) : setIsAllRowSelected(false);
  }, [data]);

  // ====== table func
  const filterTypes = useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const defaultColumn = useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
    state,
    original,
  } = useTable(
    {
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
    },
    useFilters, // useFilters!
    useGlobalFilter // useGlobalFilter!
  );

  // ==== skeleton
  const divCount = 10;
  const skeletonDiv = [];

  for (let i = 0; i < divCount; i++) {
    skeletonDiv.push(
      <div
        key={i}
        className="h-[80px] w-full border-4 skeleton-border rounded-xl p-2 mt-3"
      >
        <div className="h-full skeleton rounded-xl"></div>
      </div>
    );
  }

  const handleAddNewVehicle = () => {
    setAddNewVehicleModalIsOpen(true);
  };

  return (
    <div>
      <div>
        <AuthorizationModal
          authorizationModalIsOpen={authorizationModalIsOpen}
          setAuthorizationModalIsOpen={setAuthorizationModalIsOpen}
          selectedVehicle={selectedVehicle}
        />

        <DriverAssignmentModal
          driverModalIsOpen={driverModalIsOpen}
          setDriverModalIsOpen={setDriverModalIsOpen}
          selectedVehicle={selectedVehicle}
        />

        <GasolineConsumption
          gasolineModalIsOpen={gasolineModalIsOpen}
          setGasolineModalIsOpen={setGasolineModalIsOpen}
          selectedVehicle={selectedVehicle}
        />
      </div>
      <div>
        <AddNewVehicleModal
          addNewVehicleModalIsOpen={addNewVehicleModalIsOpen}
          setAddNewVehicleModalIsOpen={setAddNewVehicleModalIsOpen}
          selectedVehicle={selectedVehicle}
        />
      </div>
      <div className="pb-6 mt-2">
        <div className="flex items-center justify-between pb-7 md:pb-7">
          <h1 className="text-[#1E1E1E] text-lg md:text-[32px] font-bold mt-0 md:mt-0">
            Vehicle Profile
          </h1>
        </div>
        <div className="flex flex-col-reverse lg:flex-row items-end lg:items-center justify-center md:justify-between lg:pb-6 -mb-10 lg:mb-0 lg:gap-4">
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
          />

          <div className="flex items-end lg:items-center justify-end gap-2 xs:gap-4 mb-6 lg:mb-0 relative lg:static -top-16 lg:-top-20 xl:top-0 mt-1.5 xs:mt-1 md:mt-0">
            <CSVLink
              data={allProfileData}
              headers={headers}
              filename={"TMV-Support-Device-Profile.csv"}
            >
              <button
                className={`fill-primaryText flex items-center justify-center gap-3 p-2 md:py-3.5 md:px-4 text-sm bg-primary text-primaryText rounded-lg primary-shadow hover:shadow-xl hover:shadow-primary/60 duration-300`}
              >
                <DownloadSVG />
                <p className="hidden lg:block">Export</p>
              </button>
            </CSVLink>

            <button
              className={`fill-primaryText flex items-center justify-center gap-3 text-sm bg-primary text-primaryText rounded-lg p-2 md:py-3.5 md:px-4 primary-shadow hover:shadow-xl hover:shadow-primary/60 duration-300`}
            >
              <SubAdminSVG />
              <p className="hidden lg:block"> Assign To Subadmin </p>
            </button>

            {/* <button
              className={`fill-primaryText flex items-center justify-center gap-3 text-sm  bg-primary text-primaryText rounded-lg p-2 md:py-3.5 md:px-4 primary-shadow hover:shadow-xl hover:shadow-primary/60 duration-300`}
            >
              <div className="rotate-180">
                <DownloadSVG />
              </div>
              <p className="hidden lg:block"> Import </p>
            </button> */}
            {/* <button
              onClick={() => handleAddNewVehicle()}
              className={`fill-primaryText flex items-center justify-center gap-3 text-sm  bg-primary text-primaryText rounded-lg p-2 md:py-3.5 md:px-4 primary-shadow hover:shadow-xl hover:shadow-primary/60 duration-300`}
            >
              <div className="hidden lg:block">
                <SearchCarSVG />
              </div>
              <p className="hidden lg:block"> Add New Vehicle </p>
              <PlusSVG />
            </button> */}
          </div>
        </div>
        <div className="rounded-[20px] overflow-hidden">
          <div className="p-2 sm:p-[15px] overflow-x-auto bg-white  rounded-[20px] h-[65vh]">
            {isLoading ? (
              <div className="w-full">{skeletonDiv}</div>
            ) : (
              <table {...getTableProps()} className="md:min-w-[1400px] w-full">
                <thead className="bg-[#FFFAE6] h-[70px] w-full rounded-md">
                  {
                    // Loop over the header rows
                    headerGroups.map((headerGroup) => (
                      // Apply the header row props

                      <tr
                        {...headerGroup.getHeaderGroupProps()}
                        className="select-none"
                      >
                        {/* ======= Sl ======= */}
                        <th className="text-left px-3 rounded-l-[10px] text-primaryText text-sm font-bold hidden md:table-cell">
                          {headerGroup.headers[0].Header}
                        </th>

                        {/* ======= checkbox index 17 ======= */}
                        <th className="text-left px-3 text-primaryText text-sm font-bold select-none rounded-l-[10px] md:rounded-none">
                          <div className="flex relative">
                            <div
                              onClick={() => clickAllRowSelect()}
                              className="w-5 md:w-6 h-5 md:h-6 rounded tmv-shadow bg-white flex justify-center items-center z-10 cursor-pointer"
                            >
                              {isAllRowSelected ? <Tik /> : ""}
                            </div>

                            <p className="pb-0 mb-0 md:hidden">
                              &nbsp; &nbsp; Select All
                            </p>
                            {isAllRowSelected ? (
                              <span className="animate-pingOne absolute inline-flex w-5 md:w-6 h-5 md:h-6 rounded bg-primary opacity-75"></span>
                            ) : (
                              ""
                            )}
                          </div>
                        </th>

                        {/* ======= vehicle no ======= */}
                        <th className="select-none text-left w-[180px] px-3 text-primaryText text-sm font-bold hidden md:table-cell">
                          {headerGroup.headers[1].Header}.
                        </th>

                        {/* ======= brand ======= */}
                        <th className="select-none text-left  px-3 text-primaryText text-sm font-bold hidden md:table-cell">
                          {headerGroup.headers[2].Header}
                        </th>

                        {/* ======= Model ======= */}
                        <th className="select-none text-left  px-3 text-primaryText text-sm font-bold hidden md:table-cell">
                          {headerGroup.headers[3].Header}
                        </th>

                        {/* ======= Type ======= */}
                        <th className="text-left px-3 text-primaryText text-sm font-bold hidden md:table-cell">
                          {headerGroup.headers[4].Header}
                        </th>

                        {/* ======= Colour ======= */}
                        <th className="select-none text-left px-3 text-primaryText text-sm font-bold hidden md:table-cell">
                          {headerGroup.headers[5].Header}
                        </th>

                        {/* ======= Engine No ======= */}
                        <th className="select-none text-left px-3  text-primaryText text-sm font-bold whitespace-nowrap hidden md:table-cell">
                          {headerGroup.headers[6].Header}.
                        </th>

                        {/* ======= Chessis No ======= */}
                        <th className="select-none text-left px-3  text-primaryText text-sm font-bold whitespace-nowrap hidden md:table-cell">
                          {headerGroup.headers[7].Header}.
                        </th>

                        {/* ======= Fuel Capacity ======= */}
                        <th className="select-none text-left px-3  text-primaryText text-sm font-bold hidden md:table-cell">
                          {headerGroup.headers[8].Header}
                        </th>

                        {/* ======= Load Capacity ======= */}
                        <th className="select-none text-left px-3  text-primaryText text-sm font-bold hidden md:table-cell">
                          {headerGroup.headers[9].Header}
                        </th>

                        {/* ======= Group ======= */}
                        <th className="text-left px-3  text-primaryText text-sm font-bold hidden md:table-cell">
                          {headerGroup.headers[10].Header}
                        </th>

                        {/* ======= Driver ======= */}
                        <th className="select-none text-left px-3  text-primaryText text-sm font-bold hidden md:table-cell">
                          {headerGroup.headers[11].Header}
                        </th>

                        {/* ======= Owner ======= */}
                        <th className="select-none text-left px-3  text-primaryText text-sm font-bold hidden md:table-cell">
                          {headerGroup.headers[12].Header}
                        </th>

                        {/* ======= Vendor ======= */}
                        <th className="select-none text-left px-3  text-primaryText text-sm font-bold hidden md:table-cell">
                          {headerGroup.headers[13].Header}
                        </th>

                        {/* ======= Status ======= */}
                        <th className="select-none text-left px-3  text-primaryText text-sm font-bold hidden md:table-cell">
                          {headerGroup.headers[14].Header}
                        </th>

                        {/* ======= three dots ======= */}
                        <th className="select-none text-left px-3 w-10 text-primaryText text-sm font-bold rounded-r-[10px]"></th>
                      </tr>
                    ))
                  }
                </thead>

                <tbody {...getTableBodyProps()} className="rounded-xl">
                  {rows.map((row, index) => {
                    prepareRow(row);
                    return (
                      <tr
                        ref={(el) => (dropdownsRef.current[index] = el)}
                        {...row.getRowProps()}
                        className={`relative rounded-xl h-[90px] md:h-[81px] ${
                          index % 2 === 0 ? "bg-white" : "bg-[#F8FBFF]"
                        } `}
                      >
                        {/* ======== Sl ======== */}
                        <td className="rounded-l-[10px] px-3 text-sm text-[#48525C] hidden md:table-cell">
                          {row.cells[0].value ? row.cells[0].value : ""}
                        </td>

                        {/* ======== checkbox index 17 ======== */}
                        <td className=" px-3 text-sm text-[#48525C] hidden md:table-cell">
                          <div className="flex relative">
                            <div
                              onClick={() => clickRowSelect(row.values)}
                              className="w-6 h-6 rounded tmv-shadow bg-white flex justify-center items-center z-10 cursor-pointer"
                            >
                              {row.cells[17].value ? <Tik /> : ""}
                            </div>
                            {row.cells[17].value ? (
                              <span className="animate-pingOne absolute inline-flex h-5 w-6 rounded bg-primary opacity-75"></span>
                            ) : (
                              ""
                            )}
                          </div>
                        </td>

                        {/* ======== Vehicle No ======== */}
                        <td className="p-3 md:py-0 text-sm  text-[#48525C]">
                          <div className="flex items-center gap-1.5">
                            {/* CHECKBOX */}
                            <div className="flex relative md:hidden">
                              <div
                                onClick={() => clickRowSelect(row.values)}
                                className="w-5 md:w-6 h-5 md:h-6 rounded tmv-shadow bg-white flex justify-center items-center z-10 cursor-pointer"
                              >
                                {row.cells[17].value ? <Tik /> : ""}
                              </div>
                              {row.cells[17].value ? (
                                <span className="animate-pingOne absolute inline-flex w-5 md:w-6 h-5 md:h-6 rounded bg-primary opacity-75"></span>
                              ) : (
                                ""
                              )}
                            </div>
                            {/* IMAGE */}
                            <div className="flex items-center space-x-2">
                              <div className=" p-1 w-[44px] h-[44px] rounded-md flex items-center justify-center ">
                                <img
                                  src={
                                    row.cells[15].value === null
                                      ? handleSelectorVehicleType(
                                          row.cells[4].value
                                            ? row.cells[4].value.toLowerCase()
                                            : ""
                                        )
                                      : row.cells[15].value
                                  }
                                  alt=""
                                  className="w-full"
                                />
                              </div>
                            </div>
                            <div onClick={() => clickDropdownInfo(row.values)}>
                              <p className="text-[#6A7077] font-bold">
                                <span className="md:hidden">BSTID: </span>
                                <span>
                                  {row.cells[21].value
                                    ? row.cells[21].value
                                    : ""}
                                </span>
                              </p>
                              <p className="text-[#6A7077] font-medium">
                                <span className="md:hidden">Vehicle No: </span>
                                <span>
                                  {row.cells[1].value ? row.cells[1].value : ""}
                                </span>
                              </p>
                              {/* DROPDOWN DETAILS FOR SMALL DEVICES */}
                              <div
                                className={`${
                                  searchVehicleByIdentifierInfo(
                                    row.cells[19].value
                                  ).displayDropdownInfo
                                    ? "h-[100px] sm:h-[100px]"
                                    : "h-0"
                                } duration-500 ease-in-out overflow-hidden md:hidden`}
                              >
                                {/* =========== BRAND FOR SMALL DEVICES =========== */}
                                <div className="flex items-center mt-1">
                                  <p className="text-[12px] text-[#6A7077] md:text-base">
                                    Brand:&nbsp;
                                  </p>
                                  <p className="text-[12px] text-[#6A7077] md:text-base">
                                    {row.cells[2].value
                                      ? row.cells[2].value
                                      : ""}
                                  </p>
                                </div>
                                {/* =========== ENGINE NO FOR SMALL DEVICES =========== */}
                                <div className="flex items-center mt-1">
                                  <p className="text-[12px] text-[#6A7077] md:text-base">
                                    Engine No:&nbsp;
                                  </p>
                                  <p className="text-[12px] text-[#6A7077] md:text-base">
                                    {row.cells[6].value
                                      ? row.cells[6].value
                                      : ""}
                                  </p>
                                </div>
                                {/* =========== CHASSIS NO FOR SMALL DEVICES =========== */}
                                <div className="flex items-center mt-1">
                                  <p className="text-[12px] text-[#6A7077] md:text-base">
                                    Chassis No:&nbsp;
                                  </p>
                                  <p className="text-[12px] text-[#6A7077] md:text-base">
                                    {row.cells[7].value
                                      ? row.cells[7].value
                                      : ""}
                                  </p>
                                </div>
                                {/* =========== STATUS FOR SMALL DEVICES =========== */}
                                <div className="flex items-center mt-1">
                                  <p className="text-[12px] text-[#6A7077] md:text-base">
                                    Status:&nbsp;
                                  </p>
                                  <p
                                    className={`text-[12px] ${
                                      row.cells[14].value === "Active"
                                        ? "text-[#1DD1A1]"
                                        : "text-[#FF6B6B]"
                                    }`}
                                  >
                                    {row.cells[14].value === "Active"
                                      ? "Live"
                                      : "Suspended"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* ======== brand ======== */}
                        <td className="px-3 text-sm  text-[#48525C] hidden md:table-cell">
                          {row.cells[2].value ? row.cells[2].value : ""}
                        </td>

                        {/* ======== Model	======== */}
                        <td className="px-3 text-sm  text-[#48525C] hidden md:table-cell">
                          {row.cells[3].value ? row.cells[3].value : ""}
                        </td>

                        {/* ========  Type ======== */}
                        <td className="px-3 text-sm  text-[#48525C] hidden md:table-cell">
                          {row.cells[4].value ? row.cells[4].value : ""}
                        </td>

                        {/* ======== Color  ======== */}
                        <td className="px-3  text-sm text-[#48525C] hidden md:table-cell">
                          <div className="flex items-center gap-1 ">
                            {row.cells[5].value && (
                              <p
                                style={{
                                  backgroundColor: checkColor(
                                    row.cells[5].value
                                  ),
                                }}
                                className={` w-4 h-4 rounded-full`}
                              ></p>
                            )}
                            <p>
                              {row.cells[5].value ? row.cells[5].value : ""}
                            </p>
                          </div>
                        </td>

                        {/* ========  Engine No	 ======== */}
                        <td className="px-3 text-sm text-[#48525C] hidden md:table-cell">
                          {row.cells[6].value ? row.cells[6].value : ""}
                        </td>

                        {/* ========  Chassis No ======== */}
                        <td className="px-3 text-sm text-[#48525C] hidden md:table-cell">
                          {row.cells[7].value ? row.cells[7].value : ""}
                        </td>

                        {/* ========  Fuel Capacity ======== */}
                        <td className="px-3 text-sm text-[#48525C] hidden md:table-cell">
                          {row.cells[8].value ? row.cells[8].value : ""}
                        </td>

                        {/* ========  Load Capacity ======== */}
                        <td className="px-3 text-sm text-[#48525C] hidden md:table-cell">
                          {row.cells[9].value ? row.cells[9].value : ""}
                        </td>

                        {/* ======== Group  ======== */}
                        <td className="px-3 text-sm text-[#48525C] hidden md:table-cell">
                          {row.cells[10].value ? row.cells[10].value : ""}
                        </td>

                        {/* ======== Driver  ======== */}
                        <td className="px-3 text-sm text-[#48525C] hidden md:table-cell">
                          {row.cells[11].value ? row.cells[11].value : ""}
                        </td>

                        {/* ======== Owner  ======== */}
                        <td className="px-3 text-sm text-[#48525C] hidden md:table-cell">
                          {row.cells[12].value ? row.cells[12].value : ""}
                        </td>

                        {/* ========  Vendor ======== */}
                        <td className="px-3 text-sm text-[#48525C] hidden md:table-cell">
                          {row.cells[13].value ? row.cells[13].value : ""}
                        </td>

                        {/* ========  Status ======== */}
                        <td className="px-3 text-sm text-[#48525C] hidden md:table-cell">
                          <p
                            className={` w-4 h-4 rounded-full ${
                              row.cells[14].value === "Active"
                                ? "bg-[#1DD1A1]"
                                : "bg-[#FF6B6B]"
                            }`}
                          ></p>
                        </td>

                        {/* ======== dots  ======== */}
                        <td className=" text-[#48525C] rounded-r-[10px] pr-2">
                          <div
                            className={`flex items-center flex-col justify-center duration-300 ease-in-out ${
                              searchVehicleByIdentifierInfo(row.cells[19].value)
                                .displayDropdownInfo === true
                                ? "relative md:static -top-12 md:top-0 -mt-2 md:mt-0"
                                : ""
                            }`}
                          >
                            <div
                              ref={(el) => (dropdownsRef.current[index] = el)}
                            >
                              <div
                                // onClick={() => displaySelectedModal(row.values)}
                                onClick={() => clickDropdown(row.values)}
                                className="flex items-center justify-center cursor-pointer p-3 md:p-0"
                              >
                                <span className="hidden md:block">
                                  <ThreeDotSVG />
                                </span>
                                <span className="md:hidden">
                                  <ThreeDotSVG2 />
                                </span>
                              </div>
                              {searchVehicleByIdentifier(row.cells[19].value)
                                .isDropdown && (
                                <div
                                  className={`${
                                    searchVehicleByIdentifierInfo(
                                      row.cells[19].value
                                    ).displayDropdownInfo === true
                                      ? "top-5 md:top-0"
                                      : "top-10 md:top-0"
                                  } absolute right-0 xs:right-2 sm:right-5 md:right-8 bg-white tmv-shadow z-[100] rounded-lg overflow-hidden flex md:flex-col `}
                                >
                                  {/* <div
                                    onClick={() =>
                                      displaySelectedModal(row.values, "driver")
                                    }
                                    className="group flex items-center p-2 hover:bg-gray-200 cursor-pointer"
                                  >
                                    <div className="flex items-center">
                                      <VehicleProfileDriverSVG />
                                    </div>
                                    <p className="py-1.5 px-3 text-sm font-bold select-none hidden md:block">
                                      New driver assignment
                                    </p>
                                  </div> */}
                                  <div
                                    onClick={() =>
                                      displaySelectedModal(
                                        row.values,
                                        "authorization"
                                      )
                                    }
                                    className="group cursor-pointer flex items-center p-2 hover:bg-gray-200"
                                  >
                                    <div className="group flex items-center">
                                      <VehicleProfileVerifySVG />
                                    </div>
                                    <p className="py-1.5 px-3 text-sm font-bold select-none hidden md:block">
                                      Authorization
                                    </p>
                                  </div>
                                  <div
                                    onClick={() =>
                                      displaySelectedModal(
                                        row.values,
                                        "gasoline"
                                      )
                                    }
                                    className="group cursor-pointer flex items-center p-2 hover:bg-gray-200"
                                  >
                                    <div>
                                      <VehicleProfileGasSVG />
                                    </div>
                                    <p className="py-1.5 px-3 text-sm font-bold select-none hidden md:block">
                                      Gasoline Consumption
                                    </p>
                                  </div>
                                  <Link
                                    href={`/support/edit-vehicle-profile?id=${row.cells[19].value}`}
                                  >
                                    <div className="group cursor-pointer flex items-center p-2 hover:bg-gray-200">
                                      <div>
                                        <VehicleProfileEditSVG />
                                      </div>
                                      <p className="cursor-pointer py-1.5 px-3 text-sm font-bold select-none hidden md:block">
                                        Edit
                                      </p>
                                    </div>
                                  </Link>
                                </div>
                              )}
                              {/* {console.log("row.cells[16]", row.cells[16].value)} */}
                            </div>
                            {/* =========== RIGHT SIDE STATUS FOR SMALL DEVICES =========== */}
                            {searchVehicleByIdentifierInfo(row.cells[19].value)
                              .displayDropdownInfo === true ? (
                              ""
                            ) : (
                              <div className="md:hidden">
                                <p
                                  className={`text-[12px] sm:text-base ${
                                    row.cells[14].value === "Active"
                                      ? "text-[#1DD1A1]"
                                      : "text-[#FF6B6B]"
                                  }`}
                                >
                                  {row.cells[14].value === "Active"
                                    ? "Live"
                                    : "Suspended"}
                                </p>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleProfileTable;
