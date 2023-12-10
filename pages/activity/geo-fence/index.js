import React, { useEffect, useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import Layout from "@/components/layouts/Layout";
import DashboardLayout from "@/components/layouts/DashboardLayout";

import LeftArrowPagination from "@/components/SVG/pagination/LeftArrowPaginateSVG";
import RightArrowPaginateSVG from "@/components/SVG/pagination/RightArrowPaginateSVG";
import GeoFenceTable from "@/components/tables/GeoFenceTable";
import axios from "@/plugins/axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [geoFenceData, setGeoFenceData] = useState([]);

  // PAGINATION
  const [offset, setOffset] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // paginate button clicks
  const handlePageClick = (page) => {
    setCurrentPage(page);
    fetchGeoFenceData(page);
  };

  // ===== custom pagination =====
  const visiblePages = 5; //visible pagination buttons

  // Calculate range of visible page numbers
  const rangeStart = Math.max(currentPage - Math.floor(visiblePages / 2), 1);
  const rangeEnd = Math.min(rangeStart + visiblePages - 1, totalPages);

  // Generate page numbers to display
  const pages = [];
  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i);
  }

  // update if visible rows changes
  useEffect(() => {
    setCurrentPage(1);
    setOffset(offset);
    const calculatePages = Math.ceil(totalItems / offset);
    setTotalPages(calculatePages);
    fetchGeoFenceData(1);
  }, [offset]);

  // FETCHING DATA FROM API
  const fetchGeoFenceData = async (selectedPage) => {
    setIsLoading(true);
    await axios
      .get(
        `/api/v4/virtual-fence/list?offset=${offset}&page=${
          selectedPage ? selectedPage : currentPage
        }`
      )
      .then((res) => {
        const allData = res.data.data;
        console.log("-- get geo-fence res--", allData);

        const current_page = parseInt(allData.current_page);
        setTotalItems(allData.total);

        const newData = allData.data.map((item, index) => ({
          ...item,
          sl: (current_page - 1) * offset + index + 1,
          checkbox: false,
        }));
        setGeoFenceData(newData);
      })
      .catch((err) => {
        console.log("geo-fence error : ", err.response);
        toast.error(err.response.data?.user_message);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchGeoFenceData();
  }, []);

  return (
    <div className="pb-16">
      <ToastContainer />

      <div className="sm:p-5 rounded-[20px]">
        <GeoFenceTable
          isLoading={isLoading}
          fetchGeoFenceData={fetchGeoFenceData}
          geoFenceData={geoFenceData}
          setGeoFenceData={setGeoFenceData}
          currentPage={currentPage}
          offset={offset}
        />

        {/* ====== PAGINATION ====== */}
        <div className="pagination flex items-center justify-center md:justify-between pb-6">
          <div className="hidden md:flex items-center gap-4">
            <div>
              <label className="text-[#48525C] mr-2">Rows visible</label>
              <select
                value={offset}
                onChange={(e) => {
                  setOffset(Number(e.target.value));
                }}
                className="p-[10px] rounded-md text-[#48525C] text-sm w-[65px] outline-quaternary"
              >
                {[5, 10, 20, 30, 40, 50, 75, 100].map((pageNumber) => (
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
              </li>
              {/*  before dots  */}
              {rangeStart >= 2 && (
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
              {/* after dots  */}
              {rangeEnd < totalPages && (
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
        </div>
      </div>
    </div>
  );
};

export default index;

index.getLayout = function getLayout(page) {
  return (
    <ProtectedRoute>
      <Layout>
        <DashboardLayout>{page}</DashboardLayout>
      </Layout>
    </ProtectedRoute>
  );
};
