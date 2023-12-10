import SortingSVG from "@/components/SVG/table/SortingSVG";
import React from "react";

const dashboard2 = () => {
  return (
    <div className=" ">
      <h1 className="text-[32px] text-primaryText font-bold mb-6">Dashboard</h1>

      <div className="lg:flex">
        <div className="lg:hidden block mb-8">
          <MultipleVehicleSelect
            isSelected={true}
            getSelectedVehicles={getSelectedVehicles}
            height={700}
          />
        </div>

        <div className="grow overflow-hidden">
          <div className="">
            <div className="bg-white  p-4 rounded-xl overflow-auto ">
              {/* ======== data table ======== */}
              <div className="min-w-[1045px] relative">
                {/* ======== table heading ======== */}
                <div className="grid items-center grid-cols-7 gap-2 bg-[#FFFAE6]  text-[#1E1E1E] rounded-[10px] px-3.5 py-6 sticky top-0 z-20">
                  <div className="flex items-center gap-3">
                    <p className=" font-bold ">User</p>
                    <button onClick={() => handleSort("user", 1)}>
                      <SortingSVG />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className=" font-bold ">Vehicle no.</p>
                    <button onClick={() => handleSort("name", 1)}>
                      <SortingSVG />
                    </button>
                  </div>
                  {/* <p className=" font-bold ">Vehicle no.</p> */}
                  <p className=" font-bold ">Nearby Landmark</p>
                  <p className=" font-bold text-center">Speed Status</p>

                  <div className="flex items-center gap-3">
                    <p className=" font-bold ">Date and Time</p>
                    <button onClick={() => handleSort("date", 1)}>
                      <SortingSVG />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className=" font-bold ">Device Status</p>
                    <button onClick={() => handleSort("status", 1)}>
                      <SortingSVG />
                    </button>
                  </div>

                  <div className=" flex gap-1 justify-between items-center">
                    <span className="font-bold">Action</span>
                  </div>
                </div>

                {/* ======== table data ======== */}
                <div className="h-[530px]">
                  {selectedVehicles.map((item, index) => (
                    <div
                      key={index}
                      className={`grid grid-cols-7 gap-2 items-center  rounded-[10px] px-3.5 py-5  ${
                        index % 2 === 0 ? "bg-white  " : "bg-[#F8FBFF] "
                      }`}
                    >
                      {/* ======== User ======== */}
                      <p className="  text-[#6A7077]  text-sm">
                        {item.v_username}
                      </p>

                      {/* ======== Vehicle no.  ======== */}
                      <p className="  text-[#6A7077]  text-sm">{item.v_vrn}</p>

                      {/* ======== Nearby Landmark  ======== */}
                      <p
                        className={`  ${
                          item.nearby_l_name === "Renew Subscription"
                            ? "max-w-[157px] text-[#FF6B6B] text-[13px] p-2 bg-[#FF6B6B]/10 rounded-[10px] flex items-center justify-center"
                            : item.nearby_l_name === "Need Maintenance"
                            ? "max-w-[145px] text-[#FFAA58] text-[13px] p-2 bg-[#FFAA58]/10 rounded-[10px] flex items-center justify-center"
                            : "text-[#6A7077] text-sm "
                        } `}
                      >
                        {item.nearby_l_name}
                      </p>

                      {/* ======== Speed Status  ======== */}
                      <div className="">
                        <div className="flex justify-center">
                          {item.speed_status === null ? (
                            <SpeedIconOff className="mx-auto" />
                          ) : (
                            <SpeedIconOn />
                          )}
                        </div>

                        {item.speed_status === null ? (
                          <p className="text-[#FF6B6B] text-center text-sm pt-1">
                            Engine. off
                          </p>
                        ) : (
                          <p className="text-[#F36B24] text-center text-sm pt-1">
                            {item.speed_status} K/H
                          </p>
                        )}
                      </div>

                      {/* ======== Date and Time  ======== */}
                      <p className=" text-[#6A7077]  text-sm">
                        {vehicleDateTime(item.time_inserted)}
                      </p>

                      {/* ======== Device Status  ======== */}
                      <div className="relative ">
                        <CustomToolTip
                          id={`device-${item.identifier}`}
                          title={`Vehicle is ${item.status} and data was
                          received more than 24 hrs ago`}
                          containerClass="status default-tooltip tooltipStyleChange"
                        >
                          <p
                            id={`device-${item.id}`}
                            className={`${
                              item?.device_status?.toLowerCase() === "online"
                                ? "text-[#1DD1A1]"
                                : item?.device_status?.toLowerCase() ===
                                  "offline"
                                ? "text-[#8D96A1] "
                                : "text-[#FF6B6B]"
                            }  text-sm  font-bold capitalize`}
                          >
                            {item?.device_status?.toLowerCase() == "online"
                              ? "live"
                              : item.device_status}
                          </p>
                        </CustomToolTip>
                      </div>

                      {/* ======== Action start ========  */}
                      <div>
                        <div className="flex items-center justify-start pr-3 ">
                          {/* ======== location link ======= */}
                          <div className="">
                            <CustomToolTip
                              id={`action-location1-${item.identifier}`}
                              title={`Current Location`}
                              containerClass="action default-tooltip middle-tooltip tooltipStyleChange"
                            >
                              <Link
                                href="/dashboard"
                                id={`action-location1-${item.identifier}`}
                                className="group group-hover:bg-[#FAFAFA] hover:shadow-md rounded w-[31px] h-[31px] flex items-center justify-center hover:fill-[url(#paint0_linear_1361_1254)] fill-[#8D96A1] "
                              >
                                <LocationSVG />
                              </Link>
                            </CustomToolTip>
                          </div>

                          {/* ======== distance link ======= */}
                          <div>
                            <CustomToolTip
                              id={`action-distance-${item.identifier}`}
                              title={`Hourly Distance Report`}
                              containerClass="action default-tooltip middle-tooltip tooltipStyleChange"
                            >
                              <Link
                                href="/dashboard"
                                id={`action-distance-${item.identifier}`}
                                className="group group-hover:bg-[#FAFAFA] hover:shadow-md rounded w-[31px] h-[31px] flex items-center justify-center  "
                              >
                                <ClockSVG />
                              </Link>
                            </CustomToolTip>
                          </div>

                          {/* ======== calender link ======= */}
                          <div>
                            <CustomToolTip
                              id={`action-calendar-${item.identifier}`}
                              title={`Daily Distance Report`}
                              containerClass="action default-tooltip middle-tooltip tooltipStyleChange"
                            >
                              <Link
                                href="/dashboard"
                                id={`action-calendar-${item.identifier}`}
                                className="group group-hover:bg-[#FAFAFA] hover:shadow-md rounded w-[31px] h-[31px] flex items-center justify-center  "
                              >
                                <CalendarSVG />
                              </Link>
                            </CustomToolTip>
                          </div>

                          {/* ======== messenger link ======= */}
                          <div>
                            <CustomToolTip
                              id={`action-messenger-${item.identifier}`}
                              title={`Engine Report`}
                              containerClass="action default-tooltip right-tooltip tooltipStyleChange"
                            >
                              <Link
                                href="/dashboard"
                                id={`action-messenger-${item.identifier}`}
                                className="group group-hover:bg-[#FAFAFA] hover:shadow-md rounded w-[31px] h-[31px] flex items-center justify-center  "
                              >
                                <EngineReportSVG />
                              </Link>
                            </CustomToolTip>
                          </div>

                          {/* ======== location 2 link ======= */}
                          <div>
                            <CustomToolTip
                              id={`action-location2-${item.identifier}`}
                              title={`Vehicle Route`}
                              containerClass="action default-tooltip right-tooltip tooltipStyleChange"
                            >
                              <Link
                                href="/dashboard"
                                id={`action-location2-${item.identifier}`}
                                className="group group-hover:bg-[#FAFAFA] hover:shadow-md rounded w-[31px] h-[31px] flex items-center justify-center  "
                              >
                                <RouteVSG />
                              </Link>
                            </CustomToolTip>
                          </div>

                          {/* ======== actions tooltips ========  */}

                          {/* ======== actions tooltips end ========  */}
                        </div>
                      </div>
                      {/* ======== Actions end ========  */}
                    </div>
                  ))}

                  {/* {isLoading && (
                  <div className="h-[80px] w-full border-4 skeleton-border rounded-xl p-2 mt-3">
                    <p className="h-full skeleton rounded-xl"></p>
                  </div>
                )} */}
                </div>
              </div>
            </div>
            {/* ======= pagination ======= */}
            {/* <div className="mt-6">
            <Pagination
              className="pagination-bar"
              currentPage={currentPage}
              totalCount={selectedVehicles.length}
              pageSize={PageSize}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div> */}
          </div>
        </div>

        <div className="flex-none ml-4 lg:block hidden">
          <MultipleVehicleSelect
            isSelected={true}
            getSelectedVehicles={getSelectedVehicles}
            height={700}
          />
        </div>
      </div>

      {/* ========== advertisement ========  */}
      <Advertisement />
    </div>
  );
};

export default dashboard2;
