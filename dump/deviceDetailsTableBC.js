"use client";

import { useEffect, useMemo, useState } from "react";

// import styled from "styled-components";
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  usePagination,
} from "react-table";
import LeftArrowPaginateSVG from "../SVG/pagination/LeftArrowPaginateSVG";
import RightArrowPaginateSVG from "../SVG/pagination/RightArrowPaginateSVG";
import SpeedIconOff from "../SVG/SpeedIconOff";
import SpeedIconOn from "../SVG/SpeedIconOn";
import ThreeDotSVG from "../SVG/dashboard/ThreeDotSVG";
import DownArrowSVG from "../SVG/dashboard/DownArrowSVG";
import matchSorter from "match-sorter";

import DownloadSVG from "../SVG/DownloadSVG";
import { deviceDate, vehicleDateTime } from "@/utils/dateTimeConverter";
import { vehicleRouteChartDate } from "@/utils/dateTimeConverter";

// excel generate
import { CSVLink } from "react-csv";
import SearchSVG from "@/components/SVG/SearchSVG";
import SearchCarSVG from "@/components/SVG/SearchCarSVG";

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
      className={`fill-quaternary bg-white w-[387px] flex items-center px-5 rounded-xl searchbox-shadow `}
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

const deviceDetailsTableBC = ({ deviceDetails, isLoading }) => {
  const columns = useMemo(
    () => [
      {
        Header: "Sl",
        accessor: "sl",
      },
      {
        Header: "BSTID",
        accessor: "bstid",
      },
      {
        Header: "Vehicle Name",
        accessor: "vehicleName",
      },
      {
        Header: "Installed On",
        accessor: "installedOn",
      },
      {
        Header: "Warranty",
        accessor: "warranty",
      },
      {
        Header: "Sim",
        accessor: "sim",
      },
      {
        Header: "Last Seen",
        accessor: "last_seen",
      },
    ],
    []
  );

  //=======header for csv
  const headers = [
    { label: "Identifier", key: "identifier" },
    { label: "SL", key: "sl" },
    { label: "Name", key: "vehicleName" },
    { label: "BSTID", key: "bstid" },
    { label: "last Seen Time", key: "last_seen" },
    { label: "Installed On", key: "installedOn" },
    { label: "Sim", key: "sim" },
    { label: "Warranty", key: "warranty" },
  ];

  const [data, setData] = useState([]);

  useEffect(() => {
    setData(deviceDetails);
  }, [deviceDetails]);

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
    rows,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    state,
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter,

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
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
      initialState: { pageIndex: 0 },
    },
    useFilters, // useFilters!
    useGlobalFilter, // useGlobalFilter!
    usePagination
  );

  const clickPrevPage = () => {
    previousPage();
  };

  const clickNextPage = () => {
    nextPage();
  };

  return (
    <div>
      <div className="flex items-center justify-between pb-6">
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        <CSVLink
          data={data}
          headers={headers}
          filename={"TMV-Support-Device-Details.csv"}
        >
          <button
            className={`fill-[#1E1E1E] flex items-center justify-center gap-3 px-4 text-sm  bg-[#FDD10E] text-[#1E1E1E] rounded-[12px] w-[143px] h-[56px] primary-shadow`}
          >
            <DownloadSVG /> Export
          </button>
        </CSVLink>
      </div>
      <div className=" ">
        <div className="p-[15px] overflow-x-auto bg-white min-w-[1080px] rounded-[20px] h-[65vh]">
          <table {...getTableProps()} className="w-full full">
            <thead className="bg-[#FFFAE6] h-[70px] rounded-md">
              {
                // Loop over the header rows
                headerGroups.map((headerGroup) => (
                  // Apply the header row props

                  <tr {...headerGroup.getHeaderGroupProps()} className="">
                    {/* ======= Sl ======= */}
                    <th className="text-left px-3 rounded-l-[10px] text-[#1E1E1E] text-lg font-bold ">
                      {headerGroup.headers[0].Header}
                    </th>
                    {/* ======= 	BSTID ======= */}
                    <th className="text-left  px-3 text-[#1E1E1E] text-lg font-bold  ">
                      {headerGroup.headers[1].Header}
                    </th>
                    {/* ======= Vehicle Name ======= */}
                    <th className="text-left  px-3 text-[#1E1E1E] text-lg font-bold ">
                      {headerGroup.headers[2].Header}
                    </th>
                    {/* ======= Installed On ======= */}
                    <th className="text-left  px-3 text-[#1E1E1E] text-lg font-bold">
                      {headerGroup.headers[3].Header}
                    </th>
                    {/* ======= Warranty ======= */}
                    <th className="text-left px-3 text-[#1E1E1E] text-lg font-bold">
                      {headerGroup.headers[4].Header}
                    </th>

                    {/* =======Sim======= */}
                    <th className="text-left px-3 text-[#1E1E1E] text-lg font-bold">
                      {headerGroup.headers[5].Header}
                    </th>

                    {/* ======= last seen ======= */}
                    <th className="text-left px-3 rounded-r-[10px] text-[#1E1E1E] text-lg font-bold">
                      {headerGroup.headers[6].Header}
                    </th>
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
                    className={`rounded-xl h-[81px] ${index % 2 === 0 ? "bg-white" : "bg-[#F8FBFF]"
                      } `}
                  >
                    {/* ======== Sl ======== */}
                    <td className="rounded-l-[10px] px-3 text-[#48525C]">
                      {row.cells[0].value ? row.cells[0].value : ""}
                    </td>

                    {/* ======== BSTID ======== */}
                    <td className="px-3  text-[#48525C]">
                      {row.cells[1].value ? row.cells[1].value : ""}
                    </td>

                    {/* ======== Vehicle Name ======== */}
                    <td className="px-3  text-[#48525C]">
                      {row.cells[2].value ? row.cells[2].value : ""}
                    </td>

                    {/* ======== SInstalled On	======== */}
                    <td className="px-3  text-[#48525C]">
                      <div>
                        {row.cells[3].value
                          ? deviceDate(row.cells[3].value)
                          : ""}
                      </div>
                    </td>

                    {/* ======== Warranty ======== */}
                    <td className="px-3  text-[#48525C]">
                      <div>
                        {row.cells[4].value
                          ? deviceDate(row.cells[4].value)
                          : ""}
                      </div>
                    </td>

                    {/* ======== Sim ======== */}
                    <td className="px-3  text-[#48525C]">
                      {row.cells[5].value ? row.cells[5].value : ""}
                    </td>

                    {/* ===== last seen ==== */}
                    <td className="px-3 text-[#48525C] rounded-r-[10px]">
                      <div>
                        {row.cells[6].value
                          ? vehicleDateTime(row.cells[6].value)
                          : ""}
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

      {/*  ===== Pagination ==== */}
      <div className="pagination flex justify-between items-center pb-20 pt-6">
        <div className="flex items-center gap-4 ">
          <div>
            <label className="text-[#48525C] mr-2">Rows visible</label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}
              className="p-[10px] rounded-md"
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
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

        <div className="flex items-center  gap-2 my-3">
          <button
            onClick={() => clickPrevPage()}
            disabled={!canPreviousPage}
            className="bg-white hover:bg-[#FDD10E] w-[40px] h-[40px] rounded-md flex items-center justify-center"
          >
            <LeftArrowPaginateSVG />
          </button>

          {[...Array(pageCount).keys()].map((index) => (
            <button
              key={index}
              className={` hover:bg-[#FDD10E] w-[40px] h-[40px] rounded-md flex items-center justify-center ${index == pageIndex ? "bg-[#FDD10E]" : "bg-white"
                }`}
              onClick={() => gotoPage(index)}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => clickNextPage()}
            disabled={!canNextPage}
            className="bg-white hover:bg-[#FDD10E] w-[40px] h-[40px] rounded-md flex items-center justify-center"
          >
            <RightArrowPaginateSVG />
          </button>
        </div>
      </div>
    </div>
  );
};

export default deviceDetailsTableBC;
