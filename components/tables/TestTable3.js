import React, { useMemo, useState } from "react";
import { useTable, useSortBy } from "react-table";
import SortingSVG from "../SVG/table/SortingSVG";

function TestTable3() {
  const [employees, setEmployees] = useState([
    { id: 4, name: "Dean", country: "Denmark", defaultSort: 1 },
    { id: 3, name: "Carl", country: "Canada", defaultSort: 2 },
    { id: 2, name: "Bob", country: "Belgium", defaultSort: 3 },
    { id: 1, name: "Alice", country: "Austria", defaultSort: 4 },
    { id: 5, name: "Ethan", country: "Egypt", defaultSort: 5 },
  ]);

  const [sortCount, setSortCount] = useState(0);
  const [activeSortColumn, setActiveSortColumn] = useState(0);

  const handleSort = (sortBy, count) => {
    setActiveSortColumn(sortBy);
    let newCount = sortCount + count;
    setSortCount(newCount);
    console.log(sortBy);

    if (sortCount === 0) {
      employees.sort((a, b) => {
        if (a[sortBy] > b[sortBy]) {
          return 1;
        } else if (a[sortBy] < b[sortBy]) {
          return -1;
        }
        return 0;
      });
    } else if (sortCount === 1) {
      employees.sort((a, b) => {
        if (a[sortBy] > b[sortBy]) {
          return -1;
        } else if (a[sortBy] < b[sortBy]) {
          return 1;
        }
        return 0;
      });
    } else if (sortCount === 2) {
      setSortCount(0);
      employees.sort((a, b) => {
        return a.defaultSort - b.defaultSort;
      });
    }

    setEmployees(employees);
  };

  return (
    <div>
      <div>
        <h1>Employee List</h1>
        <button
          className="bg-red-300 mr-2"
          onClick={() => handleSort("name", 1)}
        >
          Sort by Name
          <p>
            {sortCount === 1 && activeSortColumn === "name" ? (
              <span>&uarr;</span>
            ) : sortCount === 2 && activeSortColumn === "name" ? (
              <span>&darr;</span>
            ) : (
              <div>&uarr; &darr;</div>
            )}
          </p>
        </button>

        <button className="bg-red-300" onClick={() => handleSort("country", 1)}>
          Sort by country
          <p>
            {sortCount === 1 && activeSortColumn === "country" ? (
              <span>&uarr;</span>
            ) : sortCount === 2 && activeSortColumn === "country" ? (
              <span>&darr;</span>
            ) : (
              <span>&uarr; &darr;</span>
            )}
          </p>
        </button>

        <ul>
          {employees.map((employee) => (
            <li key={employee.id}>
              {employee.id}--{employee.name}--{employee.country}
            </li>
          ))}
        </ul>
      </div>

      <br />
    </div>
  );
}

export default TestTable3;
