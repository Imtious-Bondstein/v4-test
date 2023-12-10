"use client";

import { useEffect, useMemo, useState } from "react";
// import styled from "styled-components";
import { useTable, usePagination } from "react-table";
import LeftArrowPaginateSVG from "../SVG/pagination/LeftArrowPaginateSVG";
import RightArrowPaginateSVG from "../SVG/pagination/RightArrowPaginateSVG";
import SpeedIconOff from "../SVG/SpeedIconOff";
import SpeedIconOn from "../SVG/SpeedIconOn";
import ThreeDotSVG from "../SVG/dashboard/ThreeDotSVG";
import DownArrowSVG from "../SVG/dashboard/DownArrowSVG";
import Pagination from "./Pagination";

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,

    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    usePagination
  );

  const clickPrevPage = () => {
    previousPage();
  };

  const clickNextPage = () => {
    nextPage();
  };

  useEffect(() => {}, [pageSize, pageIndex]);

  // ==== my pagination func ====
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = pageCount;
  const visiblePages = 5;

  // Calculate range of visible page numbers
  const rangeStart = Math.max(currentPage - Math.floor(visiblePages / 2), 1);
  const rangeEnd = Math.min(rangeStart + visiblePages - 1, totalPages);

  // Generate page numbers to display
  const pages = [];
  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i);
  }

  const handlePageClick = (page) => {
    setCurrentPage(page);
    gotoPage(page - 1);
  };

  // ==== my pagination func end ====

  // Render the UI for your table
  return (
    <>
      <pre>
        <code>
          {JSON.stringify(
            {
              pageIndex,
              pageSize,
              pageCount,
              canNextPage,
              canPreviousPage,
            },
            null,
            2
          )}
        </code>
      </pre>

      <div className="overflow-x-auto ">
        <div className="p-[15px] bg-white w-[1080px] rounded-lg">
          <table {...getTableProps()} className="w-full ">
            <thead className="bg-[#FFFAE6] h-[70px] rounded-md">
              {
                // Loop over the header rows
                headerGroups.map((headerGroup) => (
                  // Apply the header row props

                  <tr {...headerGroup.getHeaderGroupProps()} className="">
                    {/* ======= User ======= */}
                    <th className="text-left px-3 rounded-l-xl min-w-[150px]">
                      <div className="flex items-center gap-1 text-base font-bold">
                        <DownArrowSVG />
                        {headerGroup.headers[0].Header}
                      </div>
                    </th>
                    {/* ======= 	Vehicle No ======= */}
                    <th className="text-left  px-3 min-w-[140px] ">
                      <div className="flex items-center gap-1 text-base font-bold">
                        <DownArrowSVG />
                        {headerGroup.headers[1].Header}
                      </div>
                    </th>
                    {/* ======= Nearby Landmark ======= */}
                    <th className="text-left  px-3 min-w-[150px] text-base font-bold ">
                      {headerGroup.headers[2].Header}
                    </th>
                    {/* ======= Speed status ======= */}
                    <th className="text-center  min-w-[140px] ">
                      <div className="flex items-center justify-center gap-1 text-base font-bold">
                        <DownArrowSVG />
                        {headerGroup.headers[3].Header}
                      </div>
                    </th>
                    {/* ======= Date | Time ======= */}
                    <th className="text-left px-3 min-w-[185px] ">
                      <div className="flex items-center gap-1 text-base font-bold">
                        <DownArrowSVG />
                        {headerGroup.headers[4].Header}
                      </div>
                    </th>

                    {/* ======= Device status ======= */}
                    <th className="text-center px-3 min-w-[150px]">
                      <div className="flex items-center gap-1 text-base font-bold">
                        <DownArrowSVG />
                        {headerGroup.headers[5].Header}
                      </div>
                    </th>

                    {/* ======= three dot ======= */}
                    <th className="w-14 rounded-r-xl"></th>
                  </tr>
                ))
              }
            </thead>

            <tbody {...getTableBodyProps()} className="rounded-xl">
              {page.map((row, index) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    className={`rounded-xl h-[81px] ${
                      index % 2 === 0 ? "bg-white" : "bg-[#F8FBFF]"
                    } `}
                  >
                    {/* ======== user ======== */}
                    <td className="rounded-l-xl px-3 text-sm text-[#48525C]">
                      {row.cells[0].value}
                    </td>

                    {/* ======== Vehicle No ======== */}
                    <td className="px-3 text-sm text-[#48525C]">
                      {row.cells[1].value}
                    </td>

                    {/* ======== Nearby Landmark ======== */}
                    <td className="px-3">
                      <div
                        className={` text-sm  ${
                          row.cells[2].value === "Subscription Expired"
                            ? "max-w-[157px] h-[34px] text-[#FF6B6B] p-2 bg-[#FF6B6B]/10 rounded-[10px] flex items-center justify-center "
                            : row.cells[2].value === "Need Maintenance"
                            ? "max-w-[145px] text-[#FFAA58] p-2 bg-[#FFAA58]/10 rounded-[10px] flex items-center justify-center"
                            : "text-[#6A7077] "
                        } `}
                      >
                        {row.cells[2].value}
                      </div>
                    </td>

                    {/* ======== Speed status	======== */}
                    <td className="px-3 text-sm">
                      {row.cells[3].value === "Engine. off" ? (
                        <div className="flex flex-col items-center ">
                          <SpeedIconOff />
                          <p className="text-[#FF6B6B]">{row.cells[3].value}</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center ">
                          <SpeedIconOn />
                          <p className="text-[#F36B24] ">
                            {row.cells[3].value}
                          </p>
                        </div>
                      )}
                    </td>

                    {/* ======== Date | Time ======== */}
                    <td className="px-3 text-sm text-[#48525C]">
                      {row.cells[4].value}
                    </td>

                    {/* ======== Device status ======== */}
                    <td
                      className={`rounded-r-xl px-3 text-center text-sm font-bold capitalize ${
                        row.cells[5].value === "suspended"
                          ? "text-[#FF6B6B]"
                          : row.cells[5].value === "offline"
                          ? "text-[#8D96A1]"
                          : "text-[#1DD1A1]"
                      }`}
                    >
                      {row.cells[5].value}
                    </td>
                    <td className="rounded-r-xl text-center">
                      <div className="flex items-center justify-center  cursor-pointer">
                        <ThreeDotSVG className="cursor-pointer" />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {/* 
          Pagination can be built however you'd like. 
          This is just a very basic UI implementation:
        */}
      <div className="pagination flex items-center justify-between pb-20 pt-10">
        <div className="flex items-center gap-4 ">
          <div>
            <label htmlFor="">Rows visible</label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}
              className="p-[10px] rounded-md"
            >
              {[2, 5, 10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className="text-[#48525C]">
              Showing {pageIndex + 1} of {pageOptions.length}
            </p>
          </div>
        </div>

        {/* ===== my pagination ui ======= */}
        <ul className="pagination flex items-center gap-2">
          {/* Show "Previous" button if not on first page */}
          <li
            className="rounded-lg w-10 h-10 flex items-center justify-center bg-white dark-shadow hover:bg-[#FDD10E] hover:primary-shadow cursor-pointer"
            onClick={() => currentPage > 1 && handlePageClick(currentPage - 1)}
          >
            <LeftArrowPaginateSVG />
          </li>
          {/* Show dots if not on first or last page */}
          {rangeStart >= 2 && (
            <>
              <li
                className="rounded-lg w-10 h-10 flex items-center justify-center bg-white disabled cursor-pointer"
                onClick={() => handlePageClick(1)}
              >
                1
              </li>
              {currentPage > 4 && (
                <li className="rounded-lg w-10 h-10 flex items-center justify-center bg-white disabled">
                  ...
                </li>
              )}
            </>
          )}
          {/* Generate page buttons */}
          {pages.map((page) => (
            <li
              key={page}
              className={`rounded-lg w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-[#FDD10E] hover:primary-shadow ${
                page === currentPage
                  ? " bg-[#FDD10E] primary-shadow"
                  : "bg-white dark-shadow"
              }`}
              onClick={() => handlePageClick(page)}
            >
              {page}
            </li>
          ))}
          {/* Show dots if not on first or last page */}
          {rangeEnd < totalPages && (
            <>
              {totalPages - currentPage > 3 && (
                <li className="rounded-lg w-10 h-10 flex items-center justify-center bg-white disabled">
                  ...
                </li>
              )}
              <li
                className="rounded-lg w-10 h-10 flex items-center justify-center bg-white cursor-pointer"
                onClick={() => handlePageClick(totalPages)}
              >
                {totalPages}
              </li>
            </>
          )}

          {/* Show "Next" button if not on last page */}

          <li
            className="cursor-pointer rounded-lg w-10 h-10 flex items-center justify-center bg-white dark-shadow hover:bg-[#FDD10E] hover:primary-shadow"
            onClick={() =>
              currentPage < totalPages && handlePageClick(currentPage + 1)
            }
          >
            <RightArrowPaginateSVG />
          </li>
        </ul>
        {/* ===== my pagination ui end ======= */}
      </div>
    </>
  );
}

const TestTable = () => {
  const columns = useMemo(
    () => [
      {
        Header: "User",
        accessor: "user",
      },
      {
        Header: "Vehicle No",
        accessor: "vehicleNo",
      },
      {
        Header: "Nearby Landmark",
        accessor: "Landmark",
      },
      {
        Header: "Speed status",
        accessor: "speedStatus",
      },
      {
        Header: "Date | Time",
        accessor: "date",
      },
      {
        Header: "Device status",
        accessor: "status",
      },
    ],
    []
  );

  const data = useMemo(() => [
    {
      id: 1,
      image: "car-1",
      vehicleNo: "TMV 28281",
      reg: "Dhk-D-11-9999",
      status: "offline",
      lat: 23.8221934,
      lng: 90.4219536,
      user: "Fazle Rabbi",
      Landmark: "Uttar Begun Bari Road Tejgaon",
      speedStatus: "10.50 K/H",
      date: "5 Jan 2023 | 2:33 pm",
    },
    {
      id: 2,
      image: "car-2",
      vehicleNo: "TMV 28282",
      reg: "Dhk-D-11-9998",
      status: "online",
      lat: 23.8178986,
      lng: 90.4182171,
      user: "Tushar Khan",
      Landmark: "Uttar Begun Bari Road Tejgaon",
      speedStatus: "00.00 K/H",
      date: "5 Jan 2023 | 2:33 pm",
    },
    {
      id: 3,
      image: "car-3",
      vehicleNo: "TMV 28283",
      reg: "Dhk-D-11-9999",
      status: "offline",
      lat: 23.8199986,
      lng: 90.4382171,
      user: "Tushar Khan pathan",
      Landmark: "Need Maintenance",
      speedStatus: "Engine. off",
      date: "5 Jan 2023 | 2:33 pm",
    },
    {
      id: 4,
      image: "car-4",
      vehicleNo: "TMV 28284",
      reg: "Dhk-D-11-9998",
      status: "online",

      user: "Fazle Rabbi Mango",
      Landmark: "Subscription Expired",
      speedStatus: "10.50 K/H",
      date: "5 Jan 2023 | 2:33 pm",
    },

    {
      id: 6,
      image: "car-5",
      vehicleNo: "TMV 28286",
      reg: "Dhk-D-11-9998",
      status: "suspended",

      user: "Tushar Khan Jackfruit Biriyani",
      Landmark: "Uttar Begun Bari Road Tejgaon",
      speedStatus: "Engine. off",
      date: "5 Jan 2023 | 2:33 pm",
    },
    {
      id: 7,
      image: "car-6",
      vehicleNo: "TMV 28287",
      reg: "Dhk-D-11-9998",
      status: "online",

      user: "Fazle Rabbi",
      Landmark: "Need Maintenance",
      speedStatus: "10.50 K/H",
      date: "5 Jan 2023 | 2:33 pm",
    },
    {
      id: 8,
      image: "car-7",
      vehicleNo: "TMV 28288",
      reg: "Dhk-D-11-9998",
      status: "online",

      user: "Tushar Khan",
      Landmark: "Uttar Begun Bari Road Tejgaon",
      speedStatus: "10.50 K/H",
      date: "5 Jan 2023 | 2:33 pm",
    },
    {
      id: 9,
      image: "car-8",
      vehicleNo: "TMV 28289",
      reg: "Dhk-D-11-9998",
      status: "offline",

      user: "Fazle Rabbi",
      Landmark: "Uttar Begun Bari Road Tejgaon",
      speedStatus: "00.00 K/H",
      date: "5 Jan 2023 | 2:33 pm",
    },
    {
      id: 10,
      image: "car-9",
      vehicleNo: "TMV 28290",
      reg: "Dhk-D-11-9998",
      status: "suspended",

      user: "Tushar Khan",
      Landmark: "Need Maintenance",
      speedStatus: "Engine. off",
      date: "5 Jan 2023 | 2:33 pm",
    },
    {
      id: 11,
      image: "car-10",
      vehicleNo: "TMV 28291",
      reg: "Dhk-D-11-9998",
      status: "online",

      user: "Fazle Rabbi",
      Landmark: "Subscription Expired",
      speedStatus: "00.00 K/H",
      date: "5 Jan 2023 | 2:33 pm",
    },
    {
      id: 12,
      image: "car-11",
      vehicleNo: "TMV 28292",
      reg: "Dhk-D-11-9998",
      status: "offline",

      user: "Tushar Khan",
      Landmark: "Need Maintenance",
      speedStatus: "10.50 K/H",
      date: "5 Jan 2023 | 2:33 pm",
    },
    {
      id: 13,
      image: "car-12",
      vehicleNo: "TMV 28293",
      reg: "Dhk-D-11-9998",
      status: "suspended",

      user: "Fazle Rabbi",
      Landmark: "Subscription Expired",
      speedStatus: "10.50 K/H",
      date: "5 Jan 2023 | 2:33 pm",
    },
    {
      id: 14,
      image: "car-14",
      vehicleNo: "TMV 28285",
      reg: "Dhk-D-11-9998",
      status: "online",

      user: "Tushar Khan",
      Landmark: "Uttar Begun Bari Road Tejgaon",
      speedStatus: "Engine. off",
      date: "5 Jan 2023 | 2:33 pm",
    },
    {
      id: 101,
      image: "car-101",
      vehicleNo: "TMV 28283",
      reg: "Dhk-D-11-9997",
      status: "suspended",

      user: "Fazle Rabbi",
      Landmark: "Uttar Begun Bari Road Tejgaon",
      speedStatus: "10.50 K/H",
      date: "5 Jan 2023 | 2:33 pm",
    },
    {
      id: 102,
      image: "car-102",
      vehicleNo: "TMV 28284",
      reg: "Dhk-D-11-9998",
      status: "suspended",

      user: "Tushar Khan",
      Landmark: "Subscription Expired",
      speedStatus: "00.00 K/H",
      date: "5 Jan 2023 | 2:33 pm",
    },
    {
      id: 103,
      image: "car-103",
      vehicleNo: "TMV 28285",
      reg: "Dhk-D-11-9997",
      status: "suspended",

      user: "Fazle Rabbi",
      Landmark: "Uttar Begun Bari Road Tejgaon",
      speedStatus: "10.50 K/H",
      date: "5 Jan 2023 | 2:33 pm",
    },
    {
      id: 104,
      image: "car-104",
      vehicleNo: "TMV 28284",
      reg: "Dhk-D-11-9998",
      status: "suspended",

      user: "Tushar Khan",
      Landmark: "Need Maintenance",
      speedStatus: "10.50 K/H",
      date: "5 Jan 2023 | 2:33 pm",
    },
    {
      id: 105,
      image: "car-105",
      vehicleNo: "TMV 28284",
      reg: "Dhk-D-11-9998",
      status: "suspended",

      user: "Fazle Rabbi",
      Landmark: "Uttar Begun Bari Road Tejgaon",
      speedStatus: "Engine. off",
      date: "5 Jan 2023 | 2:33 pm",
    },
    {
      id: 106,
      image: "car-106",
      vehicleNo: "TMV 28283",
      reg: "Dhk-D-11-9997",
      status: "suspended",

      user: "Fazle Rabbi",
      Landmark: "Uttar Begun Bari Road Tejgaon",
      speedStatus: "00.00 K/H",
      date: "5 Jan 2023 | 2:33 pm",
    },
    {
      id: 107,
      image: "car-107",
      vehicleNo: "TMV 28284",
      reg: "Dhk-D-11-9998",
      status: "suspended",

      user: "Tushar Khan",
      Landmark: "Subscription Expired",
      speedStatus: "Engine. off",
      date: "5 Jan 2023 | 2:33 pm",
    },

    {
      id: 1011,
      image: "car-101",
      vehicleNo: "TMV 28283",
      reg: "Dhk-D-11-9997",
      status: "suspended",

      user: "Fazle Rabbi",
      Landmark: "Uttar Begun Bari Road Tejgaon",
      speedStatus: "10.50 K/H",
      date: "5 Jan 2023 | 2:33 pm",
    },
    {
      id: 1021,
      image: "car-102",
      vehicleNo: "TMV 28284",
      reg: "Dhk-D-11-9998",
      status: "suspended",

      user: "Tushar Khan",
      Landmark: "Subscription Expired",
      speedStatus: "00.00 K/H",
      date: "5 Jan 2023 | 2:33 pm",
    },
    {
      id: 1031,
      image: "car-103",
      vehicleNo: "TMV 28285",
      reg: "Dhk-D-11-9997",
      status: "suspended",

      user: "Fazle Rabbi",
      Landmark: "Uttar Begun Bari Road Tejgaon",
      speedStatus: "10.50 K/H",
      date: "5 Jan 2023 | 2:33 pm",
    },
    {
      id: 1041,
      image: "car-104",
      vehicleNo: "TMV 28284",
      reg: "Dhk-D-11-9998",
      status: "suspended",

      user: "Tushar Khan",
      Landmark: "Need Maintenance",
      speedStatus: "10.50 K/H",
      date: "5 Jan 2023 | 2:33 pm",
    },
    {
      id: 1051,
      image: "car-105",
      vehicleNo: "TMV 28284",
      reg: "Dhk-D-11-9998",
      status: "suspended",

      user: "Fazle Rabbi",
      Landmark: "Uttar Begun Bari Road Tejgaon",
      speedStatus: "Engine. off",
      date: "5 Jan 2023 | 2:33 pm",
    },
    {
      id: 1061,
      image: "car-106",
      vehicleNo: "TMV 28283",
      reg: "Dhk-D-11-9997",
      status: "suspended",

      user: "Fazle Rabbi",
      Landmark: "Uttar Begun Bari Road Tejgaon",
      speedStatus: "00.00 K/H",
      date: "5 Jan 2023 | 2:33 pm",
    },
    {
      id: 1071,
      image: "car-107",
      vehicleNo: "TMV 28284",
      reg: "Dhk-D-11-9998",
      status: "suspended",

      user: "Tushar Khan",
      Landmark: "Subscription Expired",
      speedStatus: "Engine. off",
      date: "5 Jan 2023 | 2:33 pm",
    },
  ]);
  // console.log("🚀~ data:", data);

  return (
    <div className="">
      <Table columns={columns} data={data} />
    </div>
  );
};

export default TestTable;
