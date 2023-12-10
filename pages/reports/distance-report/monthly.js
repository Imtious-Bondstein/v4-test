import React, { useEffect, useRef, useState } from "react";

// layout
import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Layout from "@/components/layouts/Layout";

// plugin & util
import axios from "@/plugins/axios";
import { monthlyDistanceMonth } from "@/utils/dateTimeConverter";

// table
import MonthlyDistanceReportTable from "@/components/tables/MonthlyDistanceReportTable";
import MonthlyMultipleVehicleSelector from "@/components/vehicleSelectors/MonthlyMultipleVehicleSelector";

// svg
import RightArrowPaginateSVG from "@/components/SVG/pagination/RightArrowPaginateSVG";
import LeftArrowPaginateSVG from "@/components/SVG/pagination/LeftArrowPaginateSVG";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

const monthly_distance = () => {
  const [selectedVehicles, setSelectedVehicles] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedItems, setSelectedItems] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [vehicleLists, setVehicleLists] = useState([]);
  const [totalDays, setTotalDays] = useState([]);

  // ===== states for pagination =====
  const selectedIdentifiers = useRef([]);
  const [offset, setOffset] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(1);
  const [clicked, setClicked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const getSingleSelectedVehicle = (vehicle) => {
    console.log("single my selected", vehicle);
    if (vehicle.selected) {
      const currentId = selectedIdentifiers.current;
      const updateId = [...currentId, vehicle];
      selectedIdentifiers.current = updateId;

      setTotalItems(selectedIdentifiers.current.length);

      if (selectedIdentifiers.current.length <= offset) {
        searchSingleVehicle(vehicle.v_identifier);
      } else {
        const calculatePages = Math.ceil(
          selectedIdentifiers.current.length / offset
        );

        console.log(">> calculatePages", calculatePages);

        setCurrentPage(calculatePages);

        const id = selectedIdentifiers.current
          .map((item) => item.v_identifier)
          .join(",");

        searchMultipleVehicles(id, calculatePages);
      }
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

      const calculatePages = Math.ceil(
        selectedIdentifiers.current.length / offset
      );

      setTotalItems(selectedIdentifiers.current.length);

      // example : 2<3 than button 3 will auto remove and 2 will be active button
      if (calculatePages < currentPage && selectedIdentifiers.current.length) {
        setCurrentPage(calculatePages);
        const id = selectedIdentifiers.current
          .map((item) => item.v_identifier)
          .join(",");

        searchMultipleVehicles(id, calculatePages);
      }
    }
  };

  const getMultipleSelectedVehicles = (allVehicles) => {
    if (allVehicles.length) {
      const id = allVehicles.map((vehicle) => vehicle.v_identifier).join(",");

      setCurrentPage(1);

      searchMultipleVehicles(id, 1);

      selectedIdentifiers.current = allVehicles;
      // console.log("-- checkNumber multi add", selectedIdentifiers.current);
    } else {
      setSelectedVehicles([]);

      selectedIdentifiers.current = [];
    }
  };

  const searchMultipleVehicles = (id, pageNumber) => {
    setIsLoading(true);

    const data = {
      identifier: id,
      month: monthlyDistanceMonth(selectedMonth),
      page: pageNumber ? pageNumber : currentPage,
      offset: offset,
    };
    console.log("--- data : ", data);
    axios
      .post("/api/v4/report/monthly-distance-report", data)
      .then((res) => {
        const vehicle_list = res.data.distanceReport.data;
        const current_page = res.data.distanceReport.current_page;
        const per_page = res.data.distanceReport.per_page;

        vehicle_list.map((item, index) => {
          item.sl = per_page * (current_page - 1) + index + 1;
          item.data_array = JSON.parse(item.data_array);
          item.fullMonth = createFullMonthArray();
        });

        if (res.data.distanceReport.total !== totalItems) {
          setTotalItems(res.data.distanceReport.total);
        }

        setSelectedVehicles(vehicle_list);

        console.log("-- multi res------", res.data);
      })
      .catch((err) => {
        console.log("monthly distance error : ", err.response);
      })
      .finally(() => setIsLoading(false));
  };

  const searchSingleVehicle = async (id, pageNumber) => {
    setIsLoading(true);

    const data = {
      identifier: id,
      month: monthlyDistanceMonth(selectedMonth),
      page: pageNumber ? pageNumber : currentPage,
      offset: offset,
    };
    console.log("--- data ---", data);
    await axios
      .post("/api/v4/report/monthly-distance-report", data)
      .then((res) => {
        const vehicle_list = res.data.distanceReport.data;
        const current_page = res.data.distanceReport.current_page;
        const per_page = res.data.distanceReport.per_page;

        vehicle_list.map((item, index) => {
          item.sl = per_page * (current_page - 1) + index + 1;
          item.data_array = JSON.parse(item.data_array);
          item.fullMonth = createFullMonthArray();
        });

        setSelectedVehicles([...selectedVehicles, ...vehicle_list]);

        setTotalItems(totalItems + 1);

        console.log("-- single res--", res.data.distanceReport);
      })
      .catch((err) => {
        console.log(err);
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

  // get number of days in a month
  const getNumberOfDays = () => {
    const date = new Date(selectedMonth);
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // generate an array of a days with 0 value
  const createFullMonthArray = () => {
    const monthLength = getNumberOfDays();

    const newArrayForValue = [];

    for (let i = 1; i <= monthLength; i++) {
      newArrayForValue.push(0);
    }
    return newArrayForValue;
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

  // update if month changes
  useEffect(() => {
    const id = selectedIdentifiers.current
      .map((vehicle) => vehicle.v_identifier)
      .join(",");
    if (selectedIdentifiers.current.length) {
      searchMultipleVehicles(id);
    }
    console.log("call api", selectedIdentifiers.current);
  }, [selectedMonth]);

  console.log(selectedMonth);

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
    <div className="flex">
      <div className="grow pt-1.5 overflow-hidden ">
        <MonthlyDistanceReportTable
          isLoading={isLoading}
          selectedVehicles={selectedVehicles}
          selectedMonth={selectedMonth}
          offset={offset}
          getNumberOfDays={getNumberOfDays}
          createFullMonthArray={createFullMonthArray}
        />

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
                className="p-[10px] rounded-md text-[#48525C] text-sm w-[65px] outline-quaternary"
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
        } flex-none fixed lg:static lg:ml-4 lg:right-10 top-16 lg:shadow-none ease-in-out duration-700 rounded-3xl z-[3004] lg:z-40`}
      >
        <div className="flex-none ml-4 md:pt-20">
          <MonthlyMultipleVehicleSelector
            isSelected={true}
            isRequesting={isLoading}
            getMultipleSelectedVehicles={getMultipleSelectedVehicles}
            getSingleSelectedVehicle={getSingleSelectedVehicle}
            setSelectedMonth={setSelectedMonth}
            selectedMonth={selectedMonth}
            height={700}
            setTableData={setTableData}
            tableData={tableData}
            setSelectedItems={setSelectedItems}
            selectedItems={selectedItems}
            setVehicleLists={setVehicleLists}
            vehicleLists={vehicleLists}
            clicked={clicked}
            setClicked={setClicked}
          />
        </div>
      </div>
      {/* BLUR FILTER */}
      {!clicked ? (
        ""
      ) : (
        <div
          // onClick={() => handleOutsideSelectorClick()}
          className="lg:hidden blur-filter"
        ></div>
      )}
    </div>
  );
};

export default monthly_distance;
monthly_distance.getLayout = function getLayout(page) {
  return (
    <ProtectedRoute>
      <Layout>
        <DashboardLayout>{page}</DashboardLayout>
      </Layout>
    </ProtectedRoute>
  );
};
