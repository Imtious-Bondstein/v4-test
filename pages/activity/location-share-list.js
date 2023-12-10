import React, { useEffect, useRef, useState } from "react";

//=====layouts
import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Layout from "@/components/layouts/Layout";
import LocationShareListTable from "@/components/tables/LocationShareListTable";
import LeftArrowPagination from "@/components/SVG/pagination/LeftArrowPaginateSVG";
import RightArrowPaginateSVG from "@/components/SVG/pagination/RightArrowPaginateSVG";
import axios from "@/plugins/axios";

// const demo_data = [
//   {
//     sl: 1,
//     identifier: "785555",
//     vrn: "785555",
//     bst_id: "TMV 5245",
//     vehicle_name: "BMW w3",
//     startDateTime: "5 Jan 2023 | 2:33 pm",
//     expiryDateTime: "5 Jan 2023 | 2:33 pm",
//     activeStatus: true,
//   },
//   {
//     sl: 2,
//     identifier: "123456",
//     vrn: "123456",
//     bst_id: "TMV 7890",
//     vehicle_name: "Mercedes-Benz E-Class",
//     startDateTime: "10 Feb 2023 | 10:00 am",
//     expiryDateTime: "10 Feb 2023 | 6:00 pm",
//     activeStatus: false,
//   },
//   {
//     sl: 3,
//     identifier: "987654",
//     vrn: "987654",
//     bst_id: "TMV 1357",
//     vehicle_name: "Tesla Model S",
//     startDateTime: "15 Mar 2023 | 3:30 pm",
//     expiryDateTime: "15 Mar 2023 | 9:45 pm",
//     activeStatus: true,
//   },
//   {
//     sl: 4,
//     identifier: "456789",
//     vrn: "456789",
//     bst_id: "TMV 2468",
//     vehicle_name: "Audi A4",
//     startDateTime: "20 Apr 2023 | 1:15 pm",
//     expiryDateTime: "20 Apr 2023 | 7:00 pm",
//     activeStatus: true,
//   },
//   {
//     sl: 5,
//     identifier: "135792",
//     vrn: "135792",
//     bst_id: "TMV 3579",
//     vehicle_name: "Ford Mustang",
//     startDateTime: "25 May 2023 | 9:30 am",
//     expiryDateTime: "25 May 2023 | 5:45 pm",
//     activeStatus: false,
//   },
//   {
//     sl: 6,
//     identifier: "246813",
//     vrn: "246813",
//     bst_id: "TMV 4680",
//     vehicle_name: "Toyota Camry",
//     startDateTime: "30 Jun 2023 | 11:45 am",
//     expiryDateTime: "30 Jun 2023 | 8:30 pm",
//     activeStatus: true,
//   },
//   {
//     sl: 7,
//     identifier: "579135",
//     vrn: "579135",
//     bst_id: "TMV 7025",
//     vehicle_name: "Honda Civic",
//     startDateTime: "5 Jul 2023 | 4:00 pm",
//     expiryDateTime: "5 Jul 2023 | 9:15 pm",
//     activeStatus: false,
//   },
//   {
//     sl: 8,
//     identifier: "802468",
//     vrn: "802468",
//     bst_id: "TMV 9246",
//     vehicle_name: "Lexus RX 350",
//     startDateTime: "10 Aug 2023 | 12:30 pm",
//     expiryDateTime: "10 Aug 2023 | 6:45 pm",
//     activeStatus: true,
//   },
//   {
//     sl: 9,
//     identifier: "246802",
//     vrn: "246802",
//     bst_id: "TMV 6802",
//     vehicle_name: "Subaru Outback",
//     startDateTime: "15 Sep 2023 | 8:15 am",
//     expiryDateTime: "15 Sep 2023 | 4:30 pm",
//     activeStatus: true,
//   },
//   {
//     sl: 10,
//     identifier: "135791",
//     vrn: "135791",
//     bst_id: "TMV 7913",
//     vehicle_name: "Nissan Altima",
//     startDateTime: "20 Oct 2023 | 2:00 pm",
//     expiryDateTime: "20 Oct 2023 | 7:30 pm",
//     activeStatus: false,
//   },
// ];

const locationShareList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState([]);
  const [locationShareData, setLocationShareData] = useState([]);
  const [searchKey, setSearchKey] = useState("");

  // PAGINATION HOOKS
  const selectedIdentifiers = useRef([]);
  const [offset, setOffset] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [initialTotal, setInitialTotal] = useState(1);
  const [totalItems, setTotalItems] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // LOCATION SHARE DATA INIT FUNCTION (HANDLE SL NUMBER) ====================
  const initLocationShareData = (notification, current_page, per_page) => {
    const updatedData = notification.map((items, index) => ({
      ...items,
      checkbox: false,
      sl: per_page * (current_page - 1) + index + 1,
    }));
    setLocationShareData(updatedData);
  };

  // SEARCH ==================================================================
  const handleSearch = async (pageNumber) => {
    setIsLoading(true);

    const body = {
      search_param: searchKey,
      type: "currentLocation",
      page: pageNumber ? pageNumber : currentPage,
      offset: offset,
    };
    console.log("Body Data", body);

    await axios
      .post(`/api/v4/shared-token/search`, body)
      .then((res) => {
        if (res.data.data.total !== totalItems) {
          setTotalItems(res.data.data.total);
        }
        const current_page = res.data.data.current_page;
        const per_page = parseInt(res.data.data.per_page);
        const calculatePages = Math.ceil(res.data.data.total / offset);

        setTotalPages(calculatePages);
        setCurrentPage(current_page);

        initLocationShareData(res.data.data.data, current_page, per_page);

        console.log("API Response", res.data.data.data);
      })
      .catch((err) => {
        setLocationShareData(locationShareData);
        setIsLoading(false);
        console.log(err);
        // errorNotify(err.response.data?.user_message);
      })
      .finally(() => setIsLoading(false));
  };

  // FETCH LOCATION SHARE LIST ================================================
  const fetchLocationShareList = async (pageNumber) => {
    setIsLoading(true);
    await axios
      .get(
        `/api/v4/shared-token/list?token_type=${"currentLocation"}&offset=${offset}&page=${
          pageNumber ? pageNumber : currentPage
        }`
      )
      .then((res) => {
        const allData = res.data.data.data;
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
        initLocationShareData(res.data.data.data, current_page, per_page);
        const newData = allData.data.map((item, index) => ({
          ...item,
          sl: (current_page - 1) * offset + index + 1,
        }));
        setLocationShareData(newData);
        // setGeoFenceData(newData);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  };

  // PAGINATION STARTS ========================================================
  const visiblePages = 3; // Total page buttons to show.

  // RANGE OF VISIBLE PAGES
  const rangeStart = Math.max(currentPage - Math.floor(visiblePages / 2), 1);
  const rangeEnd = Math.min(rangeStart + visiblePages - 1, totalPages);

  // GENERATE PAGES
  const pages = [];
  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i);
  }

  // HANDLE PAGE CLICK
  const handlePageClick = (page) => {
    setCurrentPage(page);
    searchKey.length === 0 ? fetchLocationShareList(page) : handleSearch(page);
  };

  // HANDLE & UPDATE ROW CHANGES
  useEffect(() => {
    setCurrentPage(1);
    setOffset(offset);

    const calculatePages = Math.ceil(totalItems / offset);
    setTotalPages(calculatePages);

    searchKey.length === 0 ? fetchLocationShareList(1) : handleSearch(1);
  }, [offset]);

  // UPDATE BASED ON TOTAL ITEM CHANGES
  useEffect(() => {
    let calculatePages = Math.ceil(totalItems / offset);
    setTotalPages(calculatePages);
  }, [totalItems]);
  // PAGINATION ENDS =============================================================

  // SEARCH KEY DETAILS ==========================================================
  useEffect(() => {
    console.log("search key", searchKey.length, searchKey);
    //call search notification if search key is not empty but call in a set time out 2 sec
    if (searchKey && searchKey.length > 0) {
      setIsLoading(true);
      const delayDebounceFn = setTimeout(() => {
        handleSearch(1);
      }, 2000);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setIsLoading(false);
      setLocationShareData(initialData);
      initLocationShareData(initialData, 1, offset);
      setTotalItems(initialTotal);
    }
  }, [searchKey]);

  // FETCH API FUNTION ===========================================================
  useEffect(() => {
    fetchLocationShareList();
  }, []);

  return (
    <div className="md:p-5 rounded-[20px]">
      <LocationShareListTable
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSearchKey={setSearchKey}
        searchKey={searchKey}
        locationShareData={locationShareData}
        offset={offset}
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

export default locationShareList;

locationShareList.getLayout = function getLayout(page) {
  return (
    <ProtectedRoute>
      <Layout>
        <DashboardLayout>{page}</DashboardLayout>
      </Layout>
    </ProtectedRoute>
  );
};
