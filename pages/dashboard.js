import MultipleVehicleSelector from "@/components/vehicleSelectors/MultipleVehicleSelector";
import React, { useState, useRef, useEffect } from "react";

import { useRouter } from "next/router";

import ProtectedRoute from "@/components/authentication/ProtectedRoute";

import axios from "@/plugins/axios";
import { async } from "regenerator-runtime";

// ====== Images =========
import Advertisement from "@/components/Advertisement";

// ====== Layout =========
import Layout from "@/components/layouts/Layout";
import DashboardLayout from "@/components/layouts/DashboardLayout";

// ======= table
import DashboardTable from "@/components/tables/DashboardTable";

// ======= SVG
import RightArrowPaginateSVG from "@/components/SVG/pagination/RightArrowPaginateSVG";
import LeftArrowPaginateSVG from "@/components/SVG/pagination/LeftArrowPaginateSVG";

//==========store=========
import { useDispatch, useSelector } from "react-redux";
import { fetchSpeedLimit } from "@/store/slices/speedLimitSlice";

// ======= styles
import "../styles/globals.css";

//====== toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PaginationMobile from "@/components/pagination/PaginationMobile";

const dashboard = () => {

  // const [sortCount, setSortCount] = useState(0);
  const sortCount = useRef(0);
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [speedLimitData, setSpeedLimitData] = useState({});
  const [isSpeedLimitLoaded, setIsSpeedLimitLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isSpeedLimitDispatched = useRef(false);

  // ===== paginate states =====
  const selectedIdentifiers = useRef([]);
  const [backendLastPage, setBackendLastPage] = useState(10);
  const [offset, setOffset] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(1);
  const [clicked, setClicked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  //=========store========
  const dispatch = useDispatch();
  const { storeSpeedLimit, isSpeedLimitStoreLoading } = useSelector(
    (state) => state.reducer.speedLimit
  );

  const getSingleSelectedVehicle = async (vehicle) => {
    console.log("-- my selected", vehicle);

    if (vehicle.selected) {
      const currentId = selectedIdentifiers.current;
      const updateId = [...currentId, vehicle];
      selectedIdentifiers.current = updateId;

      const id = selectedIdentifiers.current
        .map((item) => item.v_identifier)
        .join(",");
      searchMultipleVehicles(id);
    } else {
      // unselect vehicles
      setSelectedVehicles(
        selectedVehicles.filter(
          (selectedVehicle) =>
            selectedVehicle.v_identifier !== vehicle.v_identifier
        )
      );
      // selected vehicles
      selectedIdentifiers.current = selectedIdentifiers.current.filter(
        (item) => item.v_identifier !== vehicle.v_identifier
      );
      const id = selectedIdentifiers.current
        .map((item) => item.v_identifier)
        .join(",");

      searchMultipleVehicles(id);
    }
  };

  const getMultipleSelectedVehicles = async (
    selectedVehicles,
    totalVehicles
  ) => {
    if (selectedVehicles.length) {
      const totalVehiclesLength = totalVehicles.flatMap(
        (item) => item.vehicles
      ).length;
      console.log("totalVehiclesLength : ", totalVehiclesLength);
      console.log("get all vehicles", selectedVehicles.length);
      if (selectedVehicles.length === totalVehiclesLength) {
        setCurrentPage(1);
        getAllVehicles();
      } else {
        const id = selectedVehicles.map((item) => item.v_identifier).join(",");
        searchMultipleVehicles(id, 1);
      }

      selectedIdentifiers.current = selectedVehicles;
    } else {
      setSelectedVehicles([]);
      selectedIdentifiers.current = [];
    }
  };

  // search multiple vehicle
  const getAllVehicles = async () => {
    setIsLoading(true);

    await axios
      .post(`/api/v4/dashboard-list?offset=${offset}&page=1`)
      .then((res) => {
        const dashboard_list = res.data.dashboard_list.data;

        if (res.data.dashboard_list.total !== totalItems) {
          setTotalItems(res.data.dashboard_list.total);
          console.log(
            "-- last_page res------",
            res.data.dashboard_list.last_page
          );
        }

        setSelectedVehicles(dashboard_list);

        console.log("-- all vehicle res------", res.data.dashboard_list);
      })
      .catch((err) => {
        console.log("get all vehicle :: ", err);
        errorNotify(err.response.data?.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // search multiple vehicle
  const searchMultipleVehicles = async (id, pageNumber) => {
    setIsLoading(true);

    const data = {
      identifier: id,
      page: pageNumber ? pageNumber : currentPage,
      offset: offset,
    };
    console.log("---> multi data : ", data);

    await axios
      .post(`/api/v4/dashboard-search`, data)
      .then((res) => {
        const dashboard_list = res.data.dashboard_list.data;

        if (res.data.dashboard_list.total !== totalItems) {
          setTotalItems(res.data.dashboard_list.total);
        }
        setCurrentPage(res.data.dashboard_list.current_page);
        setSelectedVehicles(dashboard_list);

        console.log("-- multi res------", res.data.dashboard_list);
      })
      .catch((err) => {
        console.log(err);
        errorNotify(err.response.data?.user_message);
      })
      .finally(() => setIsLoading(false));
  };

  // search single vehicle
  const searchSingleVehicle = async (id, pageNumber) => {
    setIsLoading(true);

    const data = {
      identifier: id,
      // param: "all",
      page: pageNumber ? pageNumber : currentPage,
      offset: offset,
    };
    console.log("---> single data ---", data);
    await axios
      .post("/api/v4/dashboard-search", data)
      .then((res) => {
        const dashboard_list = res.data.dashboard_list.data;

        setSelectedVehicles([...selectedVehicles, ...dashboard_list]);

        setTotalItems(totalItems + 1);
        console.log("-- single res--", res.data.dashboard_list);
      })
      .catch((err) => {
        console.log(err);
        errorNotify(err.response.data?.user_message);
      })
      .finally(() => setIsLoading(false));
  };

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

  // paginate button clicks
  const handlePageClick = (page) => {
    setCurrentPage(page);
    const id = selectedIdentifiers.current
      .map((item) => item.v_identifier)
      .join(",");
    searchMultipleVehicles(id, page);
  };

  const handleReload = () => {
    console.log("reload");
    if (selectedIdentifiers.current.length) {
      const id = selectedIdentifiers.current
        .map((item) => item.v_identifier)
        .join(",");
      searchMultipleVehicles(id, currentPage);
    }
  };

  // update if visible rows changes
  useEffect(() => {
    setCurrentPage(1);

    setOffset(offset);
    const calculatePages = Math.ceil(totalItems / offset);
    setTotalPages(calculatePages);

    if (selectedIdentifiers.current.length) {
      const id = selectedIdentifiers.current
        .map((item) => item.v_identifier)
        .join(",");
      searchMultipleVehicles(id, 1);
    }
  }, [offset]);

  // CHECK FOR OUTSIDE CLICK FOR SELECTOR
  const handleOutsideSelectorClick = () => {
    setClicked(false);
  };

  // update if total item changes
  useEffect(() => {
    let calculatePages = Math.ceil(totalItems / offset);
    setTotalPages(calculatePages);
  }, [totalItems]);

  // update if selected cars changes
  useEffect(() => {
    if (!selectedIdentifiers.current.length) {
      setTotalItems(0);
    }
  }, [selectedIdentifiers.current]);

  //======get data from store========
  useEffect(() => {
    if (
      !storeSpeedLimit &&
      !isSpeedLimitStoreLoading &&
      !isSpeedLimitDispatched.current
    ) {
      isSpeedLimitDispatched.current = true;
      dispatch(fetchSpeedLimit());
    }
    if (!isSpeedLimitStoreLoading && storeSpeedLimit) {
      console.log("storeSpeedLimit from page : ", storeSpeedLimit["82"]);
      setSpeedLimitData(JSON.parse(JSON.stringify(storeSpeedLimit)));
      // setIsLoading(isSpeedLimitStoreLoading);
    }
  }, [isSpeedLimitStoreLoading]);

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

  return (
    <div className="">
      <ToastContainer />
      <div className="flex">
        <div className="grow md:pt-1 overflow-hidden">
          <DashboardTable
            selectedVehicles={selectedVehicles}
            speedLimitData={speedLimitData}
            isLoading={isLoading}
            offset={offset}
            handleReload={handleReload}
          />
          {/* <PaginationMobile /> */}
          {/* ====== pagination ====== */}
          <div className="pagination flex items-center justify-center md:justify-between pb-6">
            <div className="hidden md:flex items-center gap-4">
              <div>
                <label className="text-[#48525C] mr-2">Rows visible</label>
                <select
                  value={offset}
                  onChange={(e) => {
                    setOffset(Number(e.target.value));
                  }}
                  className="p-[10px] rounded-md text-[#48525C] text-sm w-[65px]"
                >
                  {[10, 20, 30, 40, 50, 75, 100].map((pageNumber) => (
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
                  <LeftArrowPaginateSVG />
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
        <div
          className={`${
            clicked === true ? "right-0" : "-right-96"
          } flex-none lg:static fixed lg:ml-4 lg:right-10 top-16 lg:top-40 ml-0 lg:mt-3 ease-in-out duration-700 rounded-3xl z-[3004] lg:z-40`}
        >
          <MultipleVehicleSelector
            isSelected={true}
            isRequesting={isLoading}
            getMultipleSelectedVehicles={getMultipleSelectedVehicles}
            getSingleSelectedVehicle={getSingleSelectedVehicle}
            clicked={clicked}
            setClicked={setClicked}
            selectedVehicleList={selectedIdentifiers.current.length}
            top={false}
          />
        </div>
      </div>
      {/* <div className="pb-5 xs:pb-10">
        <Advertisement />
      </div> */}
      {!clicked ? (
        ""
      ) : (
        <div
          onClick={() => handleOutsideSelectorClick()}
          className="lg:hidden blur-filter"
        ></div>
      )}
    </div>
  );
};

export default dashboard;

dashboard.getLayout = function getLayout(page) {
  return (
    <ProtectedRoute>
      <Layout>
        <DashboardLayout>{page}</DashboardLayout>
      </Layout>
    </ProtectedRoute>
  );
};
