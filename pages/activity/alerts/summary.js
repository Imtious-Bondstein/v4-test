import DashboardLayout from "@/components/layouts/DashboardLayout";
import Layout from "@/components/layouts/Layout";
import AlertSummaryTable from "@/components/tables/AlertSummaryTable";
import DateRangeMultipleVehicleSelector from "@/components/vehicleSelectors/DateRangeMultipleVehicleSelector";
import axios from "@/plugins/axios";
import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";

import RightArrowPaginateSVG from "@/components/SVG/pagination/RightArrowPaginateSVG";
import LeftArrowPaginateSVG from "@/components/SVG/pagination/LeftArrowPaginateSVG";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";

const summary = () => {
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [allSelectedVehicles, setAllSelectedVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
    endDate: new Date(),
  });

  // ===== shakil =====

  const selectedIdentifiers = useRef([]);
  const [offset, setOffset] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(1);

  const [currentPage, setCurrentPage] = useState(1);

  const [clicked, setClicked] = useState(false);
  const [xlScreen, setXlScreen] = useState(true);

  // const getSingleSelectedVehicle = (vehicle) => {
  //   if (vehicle.selected) {
  //     searchSingleVehicle(vehicle.v_identifier);
  //   } else {
  //     setSelectedVehicles(
  //       selectedVehicles.filter(
  //         (selectedVehicle) =>
  //           selectedVehicle.identifier !== vehicle.v_identifier
  //       )
  //     );
  //   }
  // };

  const getSingleSelectedVehicle = (vehicle) => {
    console.log("my selected", vehicle);

    if (vehicle.selected) {
      // selectedIdentifiers.current = [...selectedIdentifiers.current, vehicle];

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
        // setTotalPages(calculatePages);

        setCurrentPage(calculatePages);

        const id = selectedIdentifiers.current
          .map((item) => item.v_identifier)
          .join(",");

        searchMultipleVehicles(id, calculatePages);
      }

      console.log("-- checkNumber single select", selectedIdentifiers.current);
      // setSelectedVehicles([...selectedVehicles, vehicle]);
    } else {
      // unselect vehicles
      setSelectedVehicles(
        selectedVehicles.filter(
          (selectedVehicle) =>
            selectedVehicle.identifier !== vehicle.v_identifier
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

  // const getMultipleSelectedVehicles = (allVehicles) => {
  //   if (allVehicles.length) {
  //     const concatenatedIdentifiers = allVehicles
  //       .map((vehicle) => vehicle.v_identifier)
  //       .join(",");
  //     searchMultipleVehicles(concatenatedIdentifiers);
  //   } else {
  //     setSelectedVehicles([]);
  //     setAllSelectedVehicles([]);
  //   }
  // };

  const getMultipleSelectedVehicles = (allVehicles) => {
    if (allVehicles.length) {
      const concatenatedIdentifiers = allVehicles
        .map((vehicle) => vehicle.v_identifier)
        .join(",");

      setCurrentPage(1);

      searchMultipleVehicles(concatenatedIdentifiers, 1);

      selectedIdentifiers.current = allVehicles;
      console.log("-- checkNumber multi add", selectedIdentifiers.current);
    } else {
      setSelectedVehicles([]);
      setAllSelectedVehicles([]);

      selectedIdentifiers.current = [];
    }
  };

  // search multiple vehicle
  // const searchMultipleVehicles = (id) => {
  //   console.log("date chnge--", id);
  //   setIsLoading(true);
  //   const data = {
  //     identifier: id,
  //     // start_date: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
  //     start_date: dateRange.startDate,
  //     end_date: dateRange.endDate,
  //   };

  //   axios
  //     .post("/api/v4/alert-management/alert-summary", data)
  //     .then((res) => {
  //       const vehicleList = res.data.data.data;
  //       vehicleList.map((item, index) => {
  //         item.sl = index + 1;
  //       });
  //       setSelectedVehicles(vehicleList);
  //       setAllSelectedVehicles(vehicleList);
  //       console.log("Multiple res------", vehicleList);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       errorNotify(err.response.statusText);
  //     })
  //     .finally(() => setIsLoading(false));
  // };

  // search multiple vehicle
  const searchMultipleVehicles = (id, pageNumber) => {
    setIsLoading(true);

    const data = {
      identifier: id,
      start_date: dateRange.startDate,
      end_date: dateRange.endDate,
      page: pageNumber ? pageNumber : currentPage,
      offset: offset,
    };
    console.log("--- data ---", data);
    axios
      .post("/api/v4/alert-management/alert-summary", data)
      .then((res) => {
        const vehicle_list = res.data.data;
        const current_page = vehicle_list.current_page;
        const per_page = vehicle_list.per_page;

        if (vehicle_list.total !== totalItems) {
          setTotalItems(vehicle_list.total);
        }

        vehicle_list.data.map((item, index) => {
          item.sl = per_page * (current_page - 1) + index + 1;
        });

        setSelectedVehicles(vehicle_list.data);
        setAllSelectedVehicles(vehicle_list.data);
        console.log("-- multi res------", res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  };

  // search single vehicle
  // const searchSingleVehicle = async (id) => {
  //   setIsLoading(true);

  //   const data = {
  //     identifier: id,
  //     start_date: dateRange.startDate,
  //     end_date: dateRange.endDate,
  //   };

  //   await axios
  //     .post("/api/v4/alert-management/alert-summary", data)
  //     .then((res) => {
  //       const vehicleList = res.data.data.data;
  //       vehicleList.map((item, index) => {
  //         item.sl = index + 1;
  //       });
  //       setSelectedVehicles([...selectedVehicles, ...vehicleList]);
  //       setAllSelectedVehicles([...selectedVehicles, ...vehicleList]);
  //       console.log("single res------", vehicleList);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       errorNotify(err.response.statusText);
  //     })
  //     .finally(() => setIsLoading(false));
  // };

  // search single vehicle
  const searchSingleVehicle = async (id, pageNumber) => {
    setIsLoading(true);

    const data = {
      identifier: id,
      start_date: dateRange.startDate,
      end_date: dateRange.endDate,
      page: pageNumber ? pageNumber : currentPage,
      offset: offset,
    };
    console.log("--- data ---", data);
    await axios
      .post("/api/v4/alert-management/alert-summary", data)
      .then((res) => {
        const vehicle_list = res.data.data;

        setSelectedVehicles([...selectedVehicles, ...vehicle_list.data]);
        setAllSelectedVehicles([...selectedVehicles, ...vehicle_list.data]);

        setTotalItems(totalItems + 1);
        console.log("-- single res--", vehicle_list);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  };

  // CHECK FOR OUTSIDE CLICK FOR SELECTOR =============================================
  const handleOutsideSelectorClick = () => {
    setClicked(false);
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

  const emptyArrayNotify = () => {
    toast.warning("Empty array.", {
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

  const selectedVehiclesIdentifier = (vehicles) => {
    return vehicles.map((vehicle) => vehicle.identifier).join(",");
  };

  useEffect(() => {
    if (
      dateRange.startDate &&
      dateRange.endDate &&
      selectedIdentifiers.current.length
    ) {
      const id = selectedIdentifiers.current
        .map((item) => item.v_identifier)
        .join(",");
      searchMultipleVehicles(id);
    }
  }, [dateRange.startDate, dateRange.endDate]);

  return (
    <div className="flex">
      <div className="grow pt-1 overflow-hidden">
        <AlertSummaryTable
          isLoading={isLoading}
          selectedVehicles={selectedVehicles}
          errorNotify={errorNotify}
          emptyArrayNotify={emptyArrayNotify}
          offset={offset}
          dateRange={dateRange}
          setDateRange={setDateRange}
          selectedIdentifiers={selectedIdentifiers.current}
        />

        {/* ====== pagination ====== */}
        <div className="pagination flex items-center justify-center md:justify-between pb-6">
          <div className="hidden md:flex items-center gap-4 ">
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
      {/* MULTIPLE VEHICLE SELECTOR (DateRangeMultipleVehicleSelector) */}
      <div
        className={`${
          clicked === true ? "right-0 top-0" : "-right-96 top-0 xl:top-20"
        } ${
          xlScreen === true
            ? "xl:z-40 xl:right-10 xl:shadow-none xl:flex-none xl:block xl:static xl:ml-4"
            : "lg:z-40 lg:right-10 lg:shadow-none lg:flex-none lg:block lg:static lg:ml-4"
        } flex-none fixed ease-in-out duration-700 rounded-3xl z-[3004]`}
      >
        <div className="flex-none ml-4  pt-20">
          <DateRangeMultipleVehicleSelector
            isSelected={true}
            isRequesting={isLoading}
            getMultipleSelectedVehicles={getMultipleSelectedVehicles}
            getSingleSelectedVehicle={getSingleSelectedVehicle}
            setDateRange={setDateRange}
            dateRange={dateRange}
            clicked={clicked}
            setClicked={setClicked}
            top={false}
            xlScreen={xlScreen}
            height={700}
          />
        </div>
      </div>
      {/* BLUR FILTER */}
      {!clicked ? (
        ""
      ) : (
        <div
          onClick={() => handleOutsideSelectorClick()}
          className="xl:hidden blur-filter"
        ></div>
      )}
    </div>
  );
};

export default summary;

summary.getLayout = function getLayout(pages) {
  return (
    <ProtectedRoute>
      <Layout>
        <DashboardLayout>{pages} </DashboardLayout>
      </Layout>
    </ProtectedRoute>
  );
};
