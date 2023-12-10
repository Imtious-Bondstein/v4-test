import LeftArrowPagination from "@/components/SVG/pagination/LeftArrowPaginateSVG";
import RightArrowPaginateSVG from "@/components/SVG/pagination/RightArrowPaginateSVG";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Layout from "@/components/layouts/Layout";
import GeoFenceEventTable from "@/components/tables/GeoFenceEventTable";
import axios from "@/plugins/axios";
import { hourlyDistanceDateTimePicker } from "@/utils/dateTimeConverter";
import React, { useEffect, useState } from "react";

const event = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [fenceData, setFencedata] = useState([]);
  const [selectedIdentifier, setSelectedIdentifier] = useState("");

  const [dateRange, setDateRange] = useState({
    date: new Date("2023-07-20"),
  });

  // ==================================================================================
  // PAGINATION
  const [offset, setOffset] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // // paginate button clicks
  // const handlePageClick = (page) => {
  //   setCurrentPage(page);
  //   fetchGeoFenceEventData(page);
  // };

  // // ===== custom pagination =====
  // const visiblePages = 5; //visible pagination buttons

  // // Calculate range of visible page numbers
  // const rangeStart = Math.max(currentPage - Math.floor(visiblePages / 2), 1);
  // const rangeEnd = Math.min(rangeStart + visiblePages - 1, totalPages);

  // // Generate page numbers to display
  // const pages = [];
  // for (let i = rangeStart; i <= rangeEnd; i++) {
  //   pages.push(i);
  // }

  // // update if visible rows changes
  // useEffect(() => {
  //   setCurrentPage(1);
  //   setOffset(offset);
  //   const calculatePages = Math.ceil(totalItems / offset);
  //   setTotalPages(calculatePages);
  //   fetchGeoFenceEventData(1);
  // }, [offset]);

  // FETCHING API ==================================
  const fetchGeoFenceEventData = async (vehicle, pageNumber) => {
    setIsLoading(true);

    const data = {
      date: hourlyDistanceDateTimePicker(dateRange.date),
      identifier: selectedIdentifier,
    };
    console.log("data", data);

    await axios
      .get("/api/v4/geo-fence-event/list")
      .then((res) => {
        const geoFenceEventData = res.data.data;
        setTableData(geoFenceEventData);
        console.log("Geofence Event API Res : ", res);
        // setTotalItems(geoFenceEventData.length);

        // const calculatePages = Math.ceil(geoFenceEventData.length / offset);
        // setTotalPages(calculatePages);

        // geoFenceEventData.map((item, index) => {
        //   item.sl = index + 1;
        // });

        // setTableData(geoFenceEventData.slice(0, offset));
        // setAllData(geoFenceEventData);
        // setChartData(geoFenceEventData);
        // setChartContent(res.data.vehicle);
        // setFetched(true);

        // !geoFenceEventData.length ? emptyPathsNotify() : null;
      })
      .catch((err) => {
        console.log("err.response", err.response.data.message);
        errorNotify(err.response.data.user_message);
      })
      .finally(() => setIsLoading(false));
  };
  const fetchFenceData = async () => {
    setIsLoading(true);

    // const data = {
    //   date: hourlyDistanceDateTimePicker(dateRange.date),
    //   identifier: selectedIdentifier,
    // };
    // console.log("data", data);

    await axios
      .get("/api/v4/virtual-fence/list")
      .then((res) => {
        const geoFenceEventData = res.data.data.data;
        // setTableData(geoFenceEventData);
        geoFenceEventData.length > 0 ? setFencedata(geoFenceEventData) : "";
        // setTotalItems(geoFenceEventData.length);

        // const calculatePages = Math.ceil(geoFenceEventData.length / offset);
        // setTotalPages(calculatePages);

        // geoFenceEventData.map((item, index) => {
        //   item.sl = index + 1;
        // });

        // setTableData(geoFenceEventData.slice(0, offset));
        // setAllData(geoFenceEventData);
        // setChartData(geoFenceEventData);
        // setChartContent(res.data.vehicle);
        // setFetched(true);

        // !geoFenceEventData.length ? emptyPathsNotify() : null;
      })
      .catch((err) => {
        console.log("err.response", err.response.data.message);
        errorNotify(err.response.data.user_message);
      })
      .finally(() => setIsLoading(false));
  };

  const successNotify = () => {
    toast.success("Data loaded!", {
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const emptyPathsNotify = () => {
    toast.warning("Not sufficient data to render.", {
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const errorNotify = (mgs) => {
    toast.error(mgs, {
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  useEffect(() => {
    fetchGeoFenceEventData();
  }, [selectedIdentifier, dateRange]);

  useEffect(() => {
    fetchFenceData();
  }, [selectedIdentifier]);

  return (
    <div>
      <GeoFenceEventTable
        isLoading={isLoading}
        // profileData={profileData}
        // setProfileData={setProfileData}
        tableData={tableData}
        dateRange={dateRange}
        setDateRange={setDateRange}
        selectedIdentifier={selectedIdentifier}
        setSelectedIdentifier={setSelectedIdentifier}
        fenceData={fenceData}
        setFencedata={setFencedata}
      />
      {/* ====== PAGINATION ====== */}
      {/* <div className="pagination flex items-center justify-center md:justify-between pb-6">
        <div className="hidden md:flex items-center gap-4">
          <div>
            <label className="text-[#48525C] mr-2">Rows visible</label>
            <select
              value={offset}
              onChange={(e) => {
                setOffset(Number(e.target.value));
              }}
              className="p-[10px] rounded-md text-[#48525C] text-sm w-16"
            >
              {[5, 10, 20, 30, 40, 50].map((pageNumber) => (
                <option key={pageNumber} value={pageNumber}>
                  {pageNumber}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className="text-[#48525C]">
              Showing {currentPage} of {totalPages}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 my-3">
          <ul className="pagination flex items-center gap-2">
            <li
              className="rounded-lg w-10 h-10 flex items-center justify-center bg-white dark-shadow hover:bg-[#FDD10E] hover:primary-shadow cursor-pointer"
              onClick={() =>
                currentPage > 1 && handlePageClick(currentPage - 1)
              }
            >
              <LeftArrowPagination />
            </li> */}
      {/*  before dots  */}
      {/* {rangeStart >= 2 && (
              <>
                <li
                  className="rounded-lg w-10 h-10 flex items-center justify-center bg-white disabled cursor-pointer hover:bg-[#FDD10E] hover:primary-shadow"
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
            )} */}
      {/* Generate page buttons */}
      {/* {pages.map((page) => (
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
            ))} */}
      {/* after dots  */}
      {/* {rangeEnd < totalPages && (
              <>
                {totalPages - currentPage > 3 && (
                  <li className="rounded-lg w-10 h-10 flex items-center justify-center bg-white disabled">
                    ...
                  </li>
                )}
                <li
                  className="rounded-lg w-10 h-10 flex items-center justify-center bg-white cursor-pointer hover:bg-[#FDD10E] hover:primary-shadow"
                  onClick={() => handlePageClick(totalPages)}
                >
                  {totalPages}
                </li>
              </>
            )}

            <li
              className="cursor-pointer rounded-lg w-10 h-10 flex items-center justify-center bg-white dark-shadow hover:bg-[#FDD10E] hover:primary-shadow"
              onClick={() =>
                currentPage < totalPages && handlePageClick(currentPage + 1)
              }
            >
              <RightArrowPaginateSVG />
            </li>
          </ul>
        </div>
      </div> */}
    </div>
  );
};

export default event;
event.getLayout = function getLayout(pages) {
  return (
    <ProtectedRoute>
      <Layout>
        <DashboardLayout>{pages} </DashboardLayout>
      </Layout>
    </ProtectedRoute>
  );
};
