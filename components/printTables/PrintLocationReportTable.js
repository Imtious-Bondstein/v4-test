const PrintLocationReportTable = ({ data, componentRef }) => {
  // [selectedVehicles]

  return (
    <div className="">
      {/* ===== table ====  */}
      <div className="relative hidden">
        <div className="p-[15px]  bg-white overflow-x-auto h-[75vh] relative rounded-[20px]">
          <table ref={componentRef} className=" w-full">
            <thead className="bg-[#FFFAE6] h-[70px] rounded-md hidden md:table-header-group">
              <tr className="">
                {/* SL */}
                <th className="text-left px-3 rounded-l-[10px] text-[#1E1E1E] text-base font-bold">
                  Sl.
                </th>

                {/* CHECKBOX */}
                <th className="text-left px-3  text-[#1E1E1E] text-base font-bold ">
                  Vehicle No.
                </th>

                {/* FENCE NAME */}
                <th className="text-left w-[180px] px-3 text-[#1E1E1E] text-base font-bold  ">
                  Date
                </th>

                {/* AREA NAME*/}
                <th className="text-left  px-3 text-[#1E1E1E] text-base font-bold ">
                  Clock Time
                </th>

                {/* FROM */}
                <th className="text-left px-3 text-[#1E1E1E] text-base font-bold">
                  Device Time
                </th>

                {/*TO */}
                <th className="text-left px-3 text-[#1E1E1E] text-base font-bold">
                  Near By
                </th>

                {/* EVENTS */}
                <th className="text-left px-3 text-[#1E1E1E] text-base font-bold">
                  Speed (Km/h)
                </th>

                <th className="text-left px-3 text-[#1E1E1E] text-base font-bold"></th>
              </tr>
            </thead>

            <tbody className="rounded-xl">
              {data.map((item, index) => {
                return (
                  <tr
                    key={index}
                    className={`relative rounded-xl h-[20px] md:h-[81px] ${
                      index % 2 === 0 ? "bg-white" : "bg-[#F8FBFF]"
                    }`}
                  >
                    {/* SL */}
                    <td className="rounded-l-[10px] px-3 text-base text-[#48525C] hidden md:table-cell">
                      {item.sl}
                    </td>

                    {/* Vehicle No. */}
                    <td className="px-3 text-base text-[#48525C] hidden md:table-cell">
                      {item.vehicle_name}
                    </td>

                    {/* Date */}
                    <td className="p-3 md:py-0 text-base text-[#48525C] hidden md:table-cell">
                      {item.date}
                    </td>

                    {/* 	Clock Time */}
                    <td className="px-3 text-base text-[#48525C] hidden md:table-cell">
                      {item.clock_time}
                    </td>

                    {/* Device Time	 */}
                    <td className="px-3 text-base  text-[#48525C] hidden md:table-cell">
                      {item.device_time}
                    </td>

                    {/* Near By	 */}
                    <td className="px-3 text-base  text-[#48525C] hidden md:table-cell max-w-[200px]">
                      {item.landmark} ({item.landmark_distance} km)
                    </td>

                    {/* Speed (Km/h) */}
                    <td className="px-3 text-base text-[#48525C] hidden md:table-cell">
                      {item.speed} KM
                    </td>

                    {/* ACTIONS */}
                    <td className="px-3 text-base text-[#48525C] hidden md:table-cell"></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PrintLocationReportTable;
