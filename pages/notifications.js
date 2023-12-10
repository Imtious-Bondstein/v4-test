import LeftArrowPagination from "@/components/SVG/pagination/LeftArrowPaginateSVG";
import RightArrowPaginateSVG from "@/components/SVG/pagination/RightArrowPaginateSVG";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Layout from "@/components/layouts/Layout";
import NotificationTable from "@/components/tables/NotificationTable";
import axios from "@/plugins/axios";
import { notificationTableData } from "@/utils/notificationTableData";
import React, { useEffect, useRef, useState } from "react";

const Notifications = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState([]);
  const [notificationData, setNotificationData] = useState([]);
  const [archiveNotifications, setArchiveNotifications] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  // ==================================================================================
  // PAGINATION
  // ===== paginate states =====
  const selectedIdentifiers = useRef([]);
  const [offset, setOffset] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [initialTotal, setInitialTotal] = useState(1);
  const [totalItems, setTotalItems] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // ===== custom pagination =====
  const visiblePages = 3; //visible pagination buttons

  // Calculate range of visible page numbers
  const rangeStart = Math.max(currentPage - Math.floor(visiblePages / 2), 1);
  const rangeEnd = Math.min(rangeStart + visiblePages - 1, totalPages);

  // Generate page numbers to display
  const pages = [];
  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i);
  }

  //=========init notification data
  const initNotificationData = (notification, current_page, per_page) => {
    const updatedData = notification.map((items, index) => ({
      ...items,
      checkbox: false,
      sl: per_page * (current_page - 1) + index + 1,
    }));
    setNotificationData(updatedData);
  };

  // ===== search notification =====
  const searchNotifications = async (pageNumber) => {
    setIsLoading(true);
    await axios
      .get(
        `/api/v4/alert/search-alert?param=0&offset=${offset}&page=${
          pageNumber ? pageNumber : currentPage
        }&search_param=${searchKey}`
      )
      .then((res) => {
        if (res.data.data.total !== totalItems) {
          setTotalItems(res.data.data.total);
        }
        const current_page = res.data.data.current_page;
        const per_page = parseInt(res.data.data.per_page);
        const calculatePages = Math.ceil(res.data.data.total / offset);

        setTotalPages(calculatePages);
        setCurrentPage(current_page);

        console.log("search data", res.data.data);
        initNotificationData(res.data.data.data, current_page, per_page);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // ======= fetch notification data ========
  const fetchNotificationData = async (pageNumber) => {
    setIsLoading(true);
    await axios
      .get(
        `/api/v4/alert/get-alert?param=0&offset=${offset}&page=${
          pageNumber ? pageNumber : currentPage
        }`
      )
      .then((res) => {
        if (res.data.data.total !== totalItems) {
          setTotalItems(res.data.data.total);
        }
        const current_page = res.data.data.current_page;

        if (current_page === 1) {
          setInitialData(res.data.data.data);
          setInitialTotal(res.data.data.total);
        }

        const per_page = parseInt(res.data.data.per_page);

        const calculatePages = Math.ceil(res.data.data.total / offset);
        setTotalPages(calculatePages);

        console.log("notification data", res.data.data);
        initNotificationData(res.data.data.data, current_page, per_page);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  };

  // ======== reload page =====
  const handleReload = () => {
    console.log("reload");
    searchKey.length === 0 ? fetchNotificationData() : searchNotifications();
  };

  // ====== paginate button clicks
  const handlePageClick = (page) => {
    setCurrentPage(page);
    searchKey.length === 0
      ? fetchNotificationData(page)
      : searchNotifications(page);
  };

  // ====== update if visible rows changes
  useEffect(() => {
    setCurrentPage(1);
    setOffset(offset);

    const calculatePages = Math.ceil(totalItems / offset);
    setTotalPages(calculatePages);

    searchKey.length === 0 ? fetchNotificationData(1) : searchNotifications(1);
  }, [offset]);

  // ====== update if total item changes
  useEffect(() => {
    let calculatePages = Math.ceil(totalItems / offset);
    setTotalPages(calculatePages);
  }, [totalItems]);

  useEffect(() => {
    console.log("search key", searchKey.length);
    //call search notification if search key is not empty but call in a set time out 2 sec
    if (searchKey && searchKey.length > 0) {
      setIsLoading(true);
      const delayDebounceFn = setTimeout(() => {
        searchNotifications(1);
      }, 2000);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setIsLoading(false);
      // setNotificationData(initialData);
      initNotificationData(initialData, 1, offset);
      setTotalItems(initialTotal);
    }
  }, [searchKey]);

  useEffect(() => {
    fetchNotificationData();
  }, []);

  return (
    <div className="md:p-5 rounded-[20px]">
      <NotificationTable
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSearchKey={setSearchKey}
        searchKey={searchKey}
        notificationData={notificationData}
        offset={offset}
        handleReload={handleReload}
      />

      {/* ====== PAGINATION ====== */}
      <div className="pagination flex items-center justify-center md:justify-between pb-10">
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
  );
};

export default Notifications;

Notifications.getLayout = function getLayout(page) {
  return (
    <ProtectedRoute>
      <Layout>
        <DashboardLayout>{page}</DashboardLayout>
      </Layout>
    </ProtectedRoute>
  );
};
