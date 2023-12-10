"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import LocationSVG from "../SVG/dashboard/LocationSVG";
import { useTable, usePagination } from "react-table";
import LeftArrowPaginateSVG from "../SVG/pagination/LeftArrowPaginateSVG";
import RightArrowPaginateSVG from "../SVG/pagination/RightArrowPaginateSVG";

import DownloadSVG from "../SVG/DownloadSVG";
import CarIcon from "../../public/cars/table/car.png";
import BikeIcon from "../../public/cars/table/bike.png";
import CngIcon from "../../public/cars/table/cng.png";
import AmbulanceIcon from "../../public/cars/table/ambulance.png";
import TruckIcon from "../../public/cars/table/truck.png";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { vehicleDateTime } from "@/utils/dateTimeConverter";

// excel generate
import { CSVLink } from "react-csv";
const mapLink =
  "https://www.google.com/maps/place/Bondstein+Technologies+Limited/@23.7623926,90.4041494,17z/data=!3m1!4b1!4m6!3m5!1s0x3755c655f3b844c7:0x15b5e83e709e9618!8m2!3d23.7623877!4d90.4067297!16s%2Fg%2F11cs26b244?entry=ttu";

const OfflineAlertTable = ({
  selectedVehicles,
  isLoading,
  errorNotify,
  emptyArrayNotify,
  offset,
}) => {
  const columns = useMemo(
    () => [
      // ==== index 0 ====
      {
        Header: "SI.",
        accessor: "sl",
      },

      // ==== index 1 ====
      {
        Header: "BSTID",
        accessor: "bst_id",
      },

      // ==== index 2 ====
      {
        Header: "Vehicle Name",
        accessor: "vehicleName",
      },

      // ==== index 3 ====
      {
        Header: "Last Online Time",
        accessor: "lastOnlineTime",
      },

      // ==== index 4 ====
      {
        Header: "Type",
        accessor: "vehicle_type",
      },

      // ==== index 5 ====
      {
        Header: "",
        accessor: "image",
      },

      // ==== index 6 ====
      {
        Header: "Generated at",
        accessor: "generatedAt",
      },
      // ===== index  7
      {
        Header: "Location",
        accessor: "location",
      },
    ],
    []
  );

  //=======header for csv
  const headers = [
    { label: "Sl", key: "sl" },
    { label: "BSTID", key: "bst_id" },
    { label: "Vehicle Name", key: "vehicleName" },
    { label: "Last Online Time", key: "lastOnlineTime" },
    { label: "Generated at", key: "generatedAt" },
    { label: "Type", key: "vehicle_type" },
  ];

  const [data, setData] = useState([]);

  const initData = () => {
    const newState = selectedVehicles.map((item, index) => ({
      ...item,
      sl: index + 1,
    }));

    setData(newState);
  };

  useEffect(() => {
    initData();
  }, [selectedVehicles]);

  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } =
    useTable(
      {
        columns,
        data,
      },
      usePagination
    );

  // ==== skeleton
  const divCount = offset;
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-primaryText text-[32px] font-bold ">
          Offline Alert
        </h1>
        <CSVLink
          data={data}
          headers={headers}
          filename={"TMV-Alert-Offline.csv"}
        >
          <button
            className={`fill-primaryText flex items-center justify-center gap-3 py-3.5 px-4 text-sm bg-primary text-primaryText rounded-lg primary-shadow hover:shadow-xl hover:shadow-primary/60 duration-300 font-medium`}
          >
            <DownloadSVG /> Export
          </button>
        </CSVLink>
      </div>
      <div className=" ">
        <div className="p-[15px] bg-white overflow-x-auto rounded-[20px] h-[75vh]">
          {isLoading ? (
            <div className="w-full">{skeletonDiv}</div>
          ) : (
            <table {...getTableProps()} className="w-full">
              <thead className="bg-secondary h-[70px] rounded-md">
                {
                  // Loop over the header rows
                  headerGroups.map((headerGroup) => (
                    // Apply the header row props

                    <tr {...headerGroup.getHeaderGroupProps()} className="">
                      {/* ======= SI. ======= */}
                      <th className="text-left text-lg font-bold px-3 rounded-l-[10px]  text-primaryText">
                        {headerGroup.headers[0].Header}
                      </th>
                      {/* ======= BSTID ======= */}
                      <th className="text-left text-lg font-bold  px-3  text-primaryText whitespace-nowrap">
                        {headerGroup.headers[1].Header}
                      </th>
                      {/* ======= Vehicle Name ======= */}
                      <th className="text-left text-lg font-bold  px-3  text-primaryText whitespace-nowrap">
                        {headerGroup.headers[2].Header}
                      </th>
                      {/* =======Last Online Time ======= */}
                      <th className="text-left text-lg font-bold px-3  text-primaryText whitespace-nowrap">
                        {headerGroup.headers[3].Header}
                      </th>

                      {/* ======= generated at ======= */}
                      <th className="text-left text-lg font-bold px-3  text-primaryText whitespace-nowrap ">
                        {headerGroup.headers[6].Header}
                      </th>

                      {/* ======= Type ======= */}
                      <th className="text-left text-lg font-bold px-3  text-primaryText">
                        {headerGroup.headers[4].Header}
                      </th>
                      {/* LOCATION */}
                      <th className="text-left text-lg font-bold px-3  text-[#1E1E1E] rounded-r-[10px] ">
                        {headerGroup.headers[7].Header}
                      </th>
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
                      className={`rounded-xl h-[81px] ${index % 2 === 0 ? "bg-white" : "bg-[#F8FBFF]"
                        } `}
                    >
                      {/* ======== SI ======== */}
                      <td className="rounded-l-[10px] px-3  text-[#48525C]">
                        {row.cells[0].value ? row.cells[0].value : ""}
                      </td>

                      {/* ======== BSTID ======== */}
                      <td className="px-3  text-[#48525C]">
                        {row.cells[1].value ? row.cells[1].value : ""}
                      </td>

                      {/* ======== Vehicle Name ======== */}
                      <td className="px-3 text-[#48525C]">
                        {row.cells[2].value ? row.cells[2].value : ""}
                      </td>

                      {/* ======== last Online Time	======== */}
                      <td className="px-3  text-[#48525C] ">
                        <div>
                          {row.cells[3].value
                            ? vehicleDateTime(row.cells[3].value)
                            : ""}
                        </div>
                      </td>

                      {/* ======== Generated at	======== */}
                      <td className="px-3  text-[#48525C] ">
                        <div>
                          {row.cells[6].value
                            ? vehicleDateTime(row.cells[6].value)
                            : ""}
                        </div>
                      </td>

                      {/* ======== Type ======== */}
                      <td className={`px-3 text-[#48525C]  capitalize`}>
                        <div className="flex items-center space-x-2.5 ">
                          <div className="bg-white p-1 w-[44px] rounded-md flex items-center justify-center ">
                            {row.cells[5].value ? (
                              <img src={row.cells[5].value} alt="" />
                            ) : (
                              ""
                            )}
                          </div>
                          {row.cells[4].value ? row.cells[4].value : ""}
                        </div>
                      </td>
                      {/* LOCATION */}
                      <td
                        className={`rounded-r-[10px] px-3 text-[#48525C]`}
                      >
                        <Link
                          href={mapLink}
                          className="group flex items-center space-x-2"
                          target={"_blank"}
                        >
                          <LocationSVG />
                          <p className="text-sm min-w-[200px]">Chawra Rd, Singerbil, Bangladesh (0.2 Km)</p>
                        </Link>
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
  );
};

export default OfflineAlertTable;
