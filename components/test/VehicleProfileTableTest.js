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
      className={`group fill-[#F36B24] bg-white w-[387px] flex items-center px-5 rounded-xl searchbox-shadow `}
    >
      <SearchCarSVG />

      <input
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder="Search your vehicle "
        className="py-5 grow px-3 outline-none text-[#8D96A1] text-sm"
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
const VehicleProfileTableTest = ({ profileData, isLoading }) => {
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
    ],
    []
  );

  //=======header for csv
  const headers = [
    { label: "Identifier", key: "identifier" },
    { label: "SL", key: "sl" },
    { label: "Vehicle No", key: "vehicleNo" },
    { label: "BSTID", key: "bst_id" },
    { label: "Brand", key: "brand" },
    { label: "Type", key: "vehicle_type" },
    { label: "Chassis No", key: "chassisNo" },
    { label: "Color", key: "color" },
    { label: "Driver", key: "driver" },
    { label: "Engine No", key: "engineNo" },
    { label: "Fuel Capacity", key: "fuelCapacity" },
    { label: "Load Capacity", key: "loadCapacity" },
    { label: "Model", key: "model" },
    { label: "Owner", key: "owner" },
    { label: "Status", key: "status" },
    { label: "Vendor", key: "vendor" },
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
  const [allData, setAllData] = useState([]);
  const [dropDownsTracker, setDropDownsTracker] = useState([]);

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
      }))
    );
  };

  // search by identifier
  const searchVehicleByIdentifier = (id) => {
    return dropDownsTracker.find((profile) => profile.identifier === id);
  };

  const clickDropdown = (item) => {
    console.log("item:---", item);
    console.log("dropDownsTracker:---", dropDownsTracker);
    const newState = dropDownsTracker.map((vehicle) => {
      if (vehicle.identifier === item.vehicleNo) {
        return { ...vehicle, isDropdown: !vehicle.isDropdown };
      }
      return vehicle;
    });
    setDropDownsTracker(newState);
  };

  function handleOutsideClick(e) {
    console.log("dropdown ref:", dropdownsRef.current);
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
  const dropdownsRef = useRef([]);

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
    initData();
    setData(profileData);
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
        <div className="flex items-center justify-between pb-6">
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
          />

          <div className="flex items-center justify-end gap-4">
            <CSVLink
              data={data}
              headers={headers}
              filename={"TMV-Support-Device-Profile.csv"}
            >
              <button
                className={`fill-[#1E1E1E] flex items-center justify-center gap-3 px-4 text-sm  bg-[#FDD10E] text-[#1E1E1E] rounded-[12px]  h-[56px] primary-shadow`}
              >
                <DownloadSVG /> Export
              </button>
            </CSVLink>
            <button
              className={`fill-[#1E1E1E] flex items-center justify-center gap-3 px-4 text-sm  bg-[#FDD10E] text-[#1E1E1E] rounded-[12px]  h-[56px] primary-shadow`}
            >
              <SubAdminSVG /> Assign To Subadmin
            </button>

            <button
              className={`fill-[#1E1E1E] flex items-center justify-center gap-3 px-4 text-sm  bg-[#FDD10E] text-[#1E1E1E] rounded-[12px]  h-[56px] primary-shadow`}
            >
              <div className="rotate-180">
                <DownloadSVG />
              </div>
              Import
            </button>
            <button
              className={`fill-[#1E1E1E] flex items-center justify-center gap-3 px-4 text-sm  bg-[#FDD10E] text-[#1E1E1E] rounded-[12px]  h-[56px] primary-shadow`}
            >
              <SearchCarSVG className="" /> Add new vehicle <PlusSVG />
            </button>
          </div>
        </div>
        <div className=" ">
          <div className="p-[15px] overflow-x-auto bg-white  rounded-[20px] h-[65vh]">
            <table {...getTableProps()} className="min-w-[1400px] w-full">
              <thead className="bg-[#FFFAE6] h-[70px] rounded-md">
                {
                  // Loop over the header rows
                  headerGroups.map((headerGroup) => (
                    // Apply the header row props

                    <tr {...headerGroup.getHeaderGroupProps()} className="">
                      {/* ======= Sl ======= */}
                      <th className="text-left px-3 rounded-l-[10px] text-[#1E1E1E] text-sm font-bold ">
                        {headerGroup.headers[0].Header}
                      </th>

                      {/* ======= checkbox index 17 ======= */}
                      <th className="text-left px-3  text-[#1E1E1E] text-sm font-bold ">
                        <div className="flex relative">
                          <div
                            onClick={() => clickAllRowSelect()}
                            className="w-6 h-6 rounded tmv-shadow bg-white flex justify-center items-center z-10 cursor-pointer"
                          >
                            {isAllRowSelected ? <Tik /> : ""}
                          </div>
                          {isAllRowSelected ? (
                            <span className="animate-pingOne absolute inline-flex h-5 w-6 rounded bg-primary opacity-75"></span>
                          ) : (
                            ""
                          )}
                        </div>
                      </th>

                      {/* ======= vehicle no ======= */}
                      <th className="text-left w-[180px] px-3 text-[#1E1E1E] text-sm font-bold  ">
                        {headerGroup.headers[1].Header}
                      </th>

                      {/* ======= brand ======= */}
                      <th className="text-left  px-3 text-[#1E1E1E] text-sm font-bold ">
                        {headerGroup.headers[2].Header}
                      </th>

                      {/* ======= Model ======= */}
                      <th className="text-left  px-3 text-[#1E1E1E] text-sm font-bold">
                        {headerGroup.headers[3].Header}
                      </th>

                      {/* ======= Type ======= */}
                      <th className="text-left px-3 text-[#1E1E1E] text-sm font-bold">
                        {headerGroup.headers[4].Header}
                      </th>

                      {/* ======= Colour ======= */}
                      <th className="text-left px-3 text-[#1E1E1E] text-sm font-bold">
                        {headerGroup.headers[5].Header}
                      </th>

                      {/* ======= Engine No ======= */}
                      <th className="text-left px-3  text-[#1E1E1E] text-sm font-bold">
                        {headerGroup.headers[6].Header}
                      </th>

                      {/* ======= Chessis No ======= */}
                      <th className="text-left px-3  text-[#1E1E1E] text-sm font-bold">
                        {headerGroup.headers[7].Header}
                      </th>

                      {/* ======= Fuel Capacity ======= */}
                      <th className="text-left px-3  text-[#1E1E1E] text-sm font-bold">
                        {headerGroup.headers[8].Header}
                      </th>

                      {/* ======= Load Capacity ======= */}
                      <th className="text-left px-3  text-[#1E1E1E] text-sm font-bold">
                        {headerGroup.headers[9].Header}
                      </th>

                      {/* ======= Group ======= */}
                      <th className="text-left px-3  text-[#1E1E1E] text-sm font-bold">
                        {headerGroup.headers[10].Header}
                      </th>

                      {/* ======= Driver ======= */}
                      <th className="text-left px-3  text-[#1E1E1E] text-sm font-bold">
                        {headerGroup.headers[11].Header}
                      </th>

                      {/* ======= Owner ======= */}
                      <th className="text-left px-3  text-[#1E1E1E] text-sm font-bold">
                        {headerGroup.headers[12].Header}
                      </th>

                      {/* ======= Vendor ======= */}
                      <th className="text-left px-3  text-[#1E1E1E] text-sm font-bold">
                        {headerGroup.headers[13].Header}
                      </th>

                      {/* ======= Status ======= */}
                      <th className="text-left px-3  text-[#1E1E1E] text-sm font-bold">
                        {headerGroup.headers[14].Header}
                      </th>

                      {/* ======= three dots ======= */}
                      <th className="text-left px-3 w-10 text-[#1E1E1E] text-sm font-bold rounded-r-[10px]"></th>
                    </tr>
                  ))
                }
              </thead>

              <tbody {...getTableBodyProps()} className="rounded-xl">
                {rows.map((row, index) => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps()}
                      className={`relative rounded-xl h-[81px] ${index % 2 === 0 ? "bg-white" : "bg-[#F8FBFF]"
                        } `}
                    >
                      {/* ======== Sl ======== */}
                      <td className="rounded-l-[10px] px-3 text-sm text-[#48525C]">
                        {row.cells[0].value ? row.cells[0].value : ""}
                      </td>

                      {/* ======== checkbox index 17 ======== */}
                      <td className=" px-3 text-sm text-[#48525C]">
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
                      <td className="px-3 text-sm  text-[#48525C]">
                        <div className="flex items-center gap-1.5">
                          <div className="bg-white p-1 w-[44px] h-[44px] rounded-md flex items-center justify-center ">
                            {row.cells[15].value ? (
                              <img
                                src={row.cells[15].value}
                                alt=""
                                className="w-full"
                              />
                            ) : (
                              ""
                            )}
                          </div>
                          <div>
                            <p>
                              {row.cells[1].value ? row.cells[1].value : ""}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* ======== brand ======== */}
                      <td className="px-3 text-sm  text-[#48525C]">
                        {row.cells[2].value ? row.cells[2].value : ""}
                      </td>

                      {/* ======== Model	======== */}
                      <td className="px-3 text-sm  text-[#48525C]">
                        {row.cells[3].value ? row.cells[3].value : ""}
                      </td>

                      {/* ========  Type ======== */}
                      <td className="px-3 text-sm  text-[#48525C]">
                        {row.cells[4].value ? row.cells[4].value : ""}
                      </td>

                      {/* ======== Color  ======== */}
                      <td className="px-3  text-sm text-[#48525C]">
                        <div className="flex items-center gap-1 ">
                          {row.cells[5].value && (
                            <p
                              style={{
                                backgroundColor: checkColor(row.cells[5].value),
                              }}
                              className={` w-4 h-4 rounded-full`}
                            ></p>
                          )}
                          <p>{row.cells[5].value ? row.cells[5].value : ""}</p>
                        </div>
                      </td>

                      {/* ========  Engine No	 ======== */}
                      <td className="px-3 text-sm text-[#48525C] ">
                        {row.cells[6].value ? row.cells[6].value : ""}
                      </td>

                      {/* ========  Chassis No ======== */}
                      <td className="px-3 text-sm text-[#48525C] ">
                        {row.cells[7].value ? row.cells[7].value : ""}
                      </td>

                      {/* ========  Fuel Capacity ======== */}
                      <td className="px-3 text-sm text-[#48525C] ">
                        {row.cells[8].value ? row.cells[8].value : ""}
                      </td>

                      {/* ========  Load Capacity ======== */}
                      <td className="px-3 text-sm text-[#48525C] ">
                        {row.cells[9].value ? row.cells[9].value : ""}
                      </td>

                      {/* ======== Group  ======== */}
                      <td className="px-3 text-sm text-[#48525C] ">
                        {row.cells[10].value ? row.cells[10].value : ""}
                      </td>

                      {/* ======== Driver  ======== */}
                      <td className="px-3 text-sm text-[#48525C] ">
                        {row.cells[11].value ? row.cells[11].value : ""}
                      </td>

                      {/* ======== Owner  ======== */}
                      <td className="px-3 text-sm text-[#48525C] ">
                        {row.cells[12].value ? row.cells[12].value : ""}
                      </td>

                      {/* ========  Vendor ======== */}
                      <td className="px-3 text-sm text-[#48525C] ">
                        {row.cells[13].value ? row.cells[13].value : ""}
                      </td>

                      {/* ========  Status ======== */}
                      <td className="px-3 text-sm text-[#48525C] ">
                        <p
                          className={` w-4 h-4 rounded-full ${row.cells[14].value === "Active"
                              ? "bg-[#1DD1A1]"
                              : "bg-[#FF6B6B]"
                            }`}
                        ></p>
                      </td>

                      {/* ======== dots  ======== */}
                      <td className=" text-[#48525C] rounded-r-[10px] ">
                        <div
                          ref={(el) => (dropdownsRef.current[index] = el)}
                          className=" "
                        >
                          <div
                            // onClick={() => displaySelectedModal(row.values)}
                            onClick={() => clickDropdown(row.values)}
                            className=" flex items-center justify-center cursor-pointer"
                          >
                            <ThreeDotSVG />
                          </div>
                          {searchVehicleByIdentifier(row.cells[1].value)
                            .isDropdown && (
                              <div className="absolute top-0 right-8 bg-white tmv-shadow z-[100] rounded-lg overflow-hidden">
                                <p
                                  onClick={() =>
                                    displaySelectedModal(row.values, "driver")
                                  }
                                  className="cursor-pointer py-1.5 px-3 text-sm font-bold select-none hover:bg-gray-200"
                                >
                                  New driver assignment
                                </p>

                                <p
                                  onClick={() =>
                                    displaySelectedModal(
                                      row.values,
                                      "authorization"
                                    )
                                  }
                                  className="cursor-pointer py-1.5 px-3 text-sm font-bold select-none hover:bg-gray-200"
                                >
                                  Authorization
                                </p>

                                <p
                                  onClick={() =>
                                    displaySelectedModal(row.values, "gasoline")
                                  }
                                  className="cursor-pointer py-1.5 px-3 text-sm font-bold select-none hover:bg-gray-200"
                                >
                                  Gasoline Consumption
                                </p>

                                <p className="cursor-pointer py-1.5 px-3 text-sm font-bold select-none hover:bg-gray-200">
                                  Edit
                                </p>
                              </div>
                            )}

                          {/* {console.log("row.cells[16]", row.cells[16].value)} */}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {isLoading && (
              <div className="w-full">
                <div className="h-[80px] w-full border-4 skeleton-border rounded-xl p-2 mt-3">
                  <div className="h-full skeleton rounded-xl"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleProfileTableTest;
