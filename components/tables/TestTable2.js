"use client";
import "regenerator-runtime";
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
} from "react-table";
// A great library for fuzzy filtering/sorting items
import matchSorter from "match-sorter";
import { useMemo, useState } from "react";

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
    <span>
      Search:{" "}
      <input
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
        style={{
          fontSize: "1.1rem",
          border: "0",
        }}
      />
    </span>
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

// Our table component
function Table({ columns, data }) {
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

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
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

  // We don't want to render all of the rows for this example, so cap
  // it for this use case
  const firstPageRows = rows.slice(0, 10);

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>
                  {column.render("Header")}
                  {/* Render the columns filter UI */}
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
                </th>
              ))}
            </tr>
          ))}
          <tr>
            <th
              colSpan={visibleColumns.length}
              style={{
                textAlign: "left",
              }}
            >
              <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={state.globalFilter}
                setGlobalFilter={setGlobalFilter}
              />
            </th>
          </tr>
        </thead>
        <tbody {...getTableBodyProps()}>
          {firstPageRows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <br />
      <div>Showing the first 20 results of {rows.length} rows</div>
      <div>
        <pre>
          <code>{JSON.stringify(state.filters, null, 2)}</code>
        </pre>
      </div>
    </>
  );
}

function TestTable2() {
  const columns = useMemo(
    () => [
      {
        Header: "Name",
        columns: [
          {
            Header: "First Name",
            accessor: "firstName",
          },
          {
            Header: "Last Name",
            accessor: "lastName",
          },
        ],
      },
      {
        Header: "Info",
        columns: [
          {
            Header: "Age",
            accessor: "age",
            filter: "equals",
          },
          {
            Header: "Visits",
            accessor: "visits",
            filter: "between",
          },
          {
            Header: "Status",
            accessor: "status",
            filter: "includes",
          },
          {
            Header: "Profile Progress",
            accessor: "progress",
          },
        ],
      },
    ],
    []
  );

  const data = [
    { firstName: "lift", lastName: "can", age: 2, visits: 75, progress: 16 },
    { firstName: "vase", lastName: "boot", age: 8, visits: 38, progress: 50 },
    {
      firstName: "underwear",
      lastName: "board",
      age: 11,
      visits: 42,
      progress: 97,
    },
    {
      firstName: "chest",
      lastName: "approval",
      age: 0,
      visits: 47,
      progress: 60,
    },
    {
      firstName: "shock",
      lastName: "administration",
      age: 23,
      visits: 54,
      progress: 1,
    },
    {
      firstName: "poison",
      lastName: "attack",
      age: 8,
      visits: 80,
      progress: 27,
    },
    { firstName: "week", lastName: "hat", age: 19, visits: 14, progress: 57 },
    { firstName: "quilt", lastName: "jeans", age: 13, visits: 76, progress: 4 },
    { firstName: "cause", lastName: "base", age: 26, visits: 49, progress: 66 },
    {
      firstName: "mice",
      lastName: "plough",
      age: 26,
      visits: 98,
      progress: 34,
    },
    { firstName: "beam", lastName: "work", age: 24, visits: 9, progress: 47 },
    {
      firstName: "celebration",
      lastName: "psychology",
      age: 19,
      visits: 34,
      progress: 72,
    },
    {
      firstName: "umbrella",
      lastName: "library",
      age: 1,
      visits: 43,
      progress: 35,
    },
    {
      firstName: "volume",
      lastName: "rock",
      age: 25,
      visits: 75,
      progress: 67,
    },
    {
      firstName: "acoustics",
      lastName: "atmosphere",
      age: 8,
      visits: 74,
      progress: 97,
    },
    {
      firstName: "fish",
      lastName: "republic",
      age: 0,
      visits: 21,
      progress: 52,
    },
    { firstName: "straw", lastName: "hope", age: 12, visits: 97, progress: 25 },
    {
      firstName: "question",
      lastName: "cap",
      age: 17,
      visits: 52,
      progress: 70,
    },
    {
      firstName: "charity",
      lastName: "acoustics",
      age: 5,
      visits: 84,
      progress: 61,
    },
    { firstName: "cracker", lastName: "fog", age: 9, visits: 6, progress: 70 },
    { firstName: "coat", lastName: "note", age: 29, visits: 61, progress: 87 },
    {
      firstName: "tray",
      lastName: "guidance",
      age: 17,
      visits: 43,
      progress: 52,
    },
    {
      firstName: "tiger",
      lastName: "frame",
      age: 25,
      visits: 65,
      progress: 41,
    },
  ];

  return <Table columns={columns} data={data} />;
}

export default TestTable2;
