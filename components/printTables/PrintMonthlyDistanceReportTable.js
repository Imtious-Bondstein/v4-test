import React from "react";

const PrintMonthlyDistanceReportTable = ({ data, totalDays, componentRef }) => {
  return (
    <div className="">
      {/* NEW TABLE */}
      <div className="relative hidden">
        <table ref={componentRef} className=" bg-white p-5 h-full">
          <thead>
            <tr className="h-[70px] bg-[#FFFAE6] w-fit   table-header-group">
              {/* SL */}
              <td className="w-[100px] px-3 rounded-l-md font-bold">Sl.</td>
              {/* CODE */}
              <td className="w-[200px] px-3 font-bold ">Code</td>
              {/* VEHICLE */}
              <td className="w-[200px] px-3 font-bold ">Vehicle</td>
              {/* MONTHLY DISTANCE */}
              {totalDays.map((day, index) => {
                return (
                  <td
                    key={index}
                    className={`w-[140px] px-3 font-bold ${
                      totalDays.length == day ? "rounded-r-md" : ""
                    } `}
                  >
                    {day}
                  </td>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {data.map(
              ({ sl, code, vehicle_name, data_array, fullMonth }, index) => {
                return (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-tableRow"
                    } flex items-center  h-[81px] w-fit rounded-md`}
                  >
                    {/* SL */}
                    <td className="w-[100px] px-3 ">{sl}</td>
                    {/* CODE */}
                    <td className="w-[200px] px-3 ">{code}</td>
                    {/* VEHICLE */}
                    <td className="w-[200px] px-3 ">{vehicle_name}</td>
                    {fullMonth.map((day, index) => {
                      return (
                        <td key={index} className="w-[140px] px-3">
                          {day}
                        </td>
                      );
                    })}
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrintMonthlyDistanceReportTable;
