import React, { useEffect, useRef, useState } from "react";
import { useTable } from "react-table";
import { useReactToPrint } from "react-to-print";

const PrintTable = ({ data, columns, componentRef, getPageMargins }) => {
  // const componentRef = useRef();

  // const handlePrint = () => {
  //   useReactToPrint({
  //     content: () => componentRef.current,
  //   });
  // };

  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } =
    useTable({
      columns,
      data,
    });

  useEffect(() => {
    // componentRef
  }, []);

  return (
    <div className="">
      {/* ===== table ====  */}
      <div className="relative hidden">
        <table
          ref={componentRef}
          {...getTableProps()}
          className="w-full   "
          cellPadding="0"
        >
          <thead className=" rounded-2xl ">
            {headerGroups.map((headerGroup) => (
              <tr
                {...headerGroup.getHeaderGroupProps()}
                className="bg-gray-100"
              >
                {headerGroup.headers.map((column, index) => (
                  <th
                    {...column.getHeaderProps()}
                    className="border border-gray-200 p-2"
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()} className="">
            {rows.map((row, index) => {
              prepareRow(row);
              return (
                <tr className="border" {...row.getRowProps()}>
                  {row.cells.map((cell, i) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        className="border border-gray-200 p-2 whitespace-nowrap "
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrintTable;
