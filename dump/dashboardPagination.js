import MultipleVehicleSelector from "@/components/vehicleSelectors/MultipleVehicleSelector";

import React, { useState, useRef, useEffect } from "react";

// ====== Images =========
import Advertisement from "@/components/Advertisement";

// ====== Layout =========
import Layout from "@/components/layouts/Layout";
import DashboardLayout from "@/components/layouts/DashboardLayout";

// ====== Utils =========
import { vehicleDateTime } from "@/utils/dateTimeConverter";

import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import ProtectedRoute from "@/components/authentication/ProtectedRoute";

import DashboardTable from "@/components/tables/DashboardTable";
import axios from "@/plugins/axios";
import RightArrowPaginateSVG from "@/components/SVG/pagination/RightArrowPaginateSVG";
import LeftArrowPaginateSVG from "@/components/SVG/pagination/LeftArrowPaginateSVG";
import TestPagination from "@/components/test/TestPagination";
import TestDashboardTable from "@/components/test/TestDashboardTable";

const dashboard = () => {
  // const [sortCount, setSortCount] = useState(0);
  const sortCount = useRef(0);
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [allSelectedVehicles, setAllSelectedVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ===== shakil =====

  // const [selectedIdentifiers, setSelectedIdentifiers] = useState([]);
  const selectedIdentifiers = useRef([]);
  const [offset, setOffset] = useState(2);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(1);

  const [currentPage, setCurrentPage] = useState(1);

  const getSingleSelectedVehicle = (vehicle) => {
    console.log("my selected", vehicle);

    if (vehicle.selected) {
      setSelectedIdentifiers([...selectedIdentifiers, vehicle]);
      setTotalItems(selectedIdentifiers.length);

      if (selectedIdentifiers.length <= offset) {
        searchSingleVehicle(vehicle.v_identifier);
      }

      console.log("checkNumber", selectedIdentifiers);
      // setSelectedVehicles([...selectedVehicles, vehicle]);
    } else {
      setSelectedVehicles(
        selectedVehicles.filter(
          (selectedVehicle) =>
            selectedVehicle.v_identifier !== vehicle.v_identifier
        )
      );

      setSelectedIdentifiers(
        selectedIdentifiers.filter(
          (item) => item.v_identifier !== vehicle.v_identifier
        )
      );

      const checkNumber = selectedIdentifiers.filter(
        (item) => item.v_identifier !== vehicle.v_identifier
      );
      setTotalItems(checkNumber.length);
      console.log("checkNumber", checkNumber);
    }
  };

  const removeUnselectedVehicles = (vehicles) => {
    return allSelectedVehicles.filter(
      (vehicle) =>
        !vehicles.find(
          ({ v_identifier }) => vehicle.v_identifier === v_identifier
        )
    );
  };

  // array.filter((elem) => !anotherArray.find(({ id }) => elem.id === id) && elem.sub);

  const getMultipleSelectedVehicles = (allVehicles) => {
    // const restOfVehicles = removeUnselectedVehicles(allVehicles);
    // console.log("removed-----", restOfVehicles);

    // console.log("all vehicles", allVehicles);

    // if (!restOfVehicles.length) {
    //   if (allVehicles.length) {
    //     const concatenatedIdentifiers = allVehicles
    //       .map((vehicle) => vehicle.v_identifier)
    //       .join(",");
    //     searchVehicle(concatenatedIdentifiers);
    //   } else {
    //     setSelectedVehicles([]);
    //     setAllSelectedVehicles([]);
    //   }
    // } else {
    //   setSelectedVehicles(restOfVehicles);
    //   setAllSelectedVehicles(restOfVehicles);
    // }

    if (allVehicles.length) {
      const concatenatedIdentifiers = allVehicles
        .map((vehicle) => vehicle.v_identifier)
        .join(",");

      setCurrentPage(1);

      searchMultipleVehicles(concatenatedIdentifiers, 1);
      setSelectedIdentifiers(allVehicles);
    } else {
      // setCurrentPage(1);

      setSelectedVehicles([]);
      setAllSelectedVehicles([]);
      setSelectedIdentifiers([]);
    }
  };

  // const handleSort = (sortBy, count) => {
  //   // setSortCount(sortCount + count)
  //   sortCount.current = sortCount.current + count;

  //   if (sortCount.current === 0) {
  //     setSelectedVehicles([...allSelectedVehicles]);
  //   } else if (sortCount.current === 1) {
  //     setSelectedVehicles([
  //       ...selectedVehicles.sort((a, b) =>
  //         a[sortBy].toLowerCase() > b[sortBy].toLowerCase() ? 1 : -1
  //       ),
  //     ]);
  //   } else if (sortCount.current === 2) {
  //     setSelectedVehicles([
  //       ...selectedVehicles.sort((a, b) =>
  //         a[sortBy].toLowerCase() < b[sortBy].toLowerCase() ? 1 : -1
  //       ),
  //     ]);
  //   } else {
  //     setSelectedVehicles([...allSelectedVehicles]);
  //     sortCount.current = 0;
  //   }

  //   console.log(">>>>>>>", selectedVehicles);
  // };

  // search multiple vehicle
  const searchMultipleVehicles = (id, pageNumber) => {
    setIsLoading(true);

    const data = {
      identifier: id,
      // param: "all",
      page: pageNumber ? pageNumber : currentPage,
      offset: offset,
    };
    console.log(data);
    axios
      .post("/api/v4/dashboard-search", data)
      .then((res) => {
        const dashboard_list = res.data.dashboard_list.data;

        if (res.data.dashboard_list.total !== totalItems) {
          setTotalItems(res.data.dashboard_list.total);
          console.log("multi call total --", res.data.dashboard_list.total);
        }

        setSelectedVehicles(dashboard_list);
        setAllSelectedVehicles(dashboard_list);
        console.log("multi res------", res.data.dashboard_list);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  };

  // searchVehicle
  // search single vehicle
  const searchSingleVehicle = async (id) => {
    setIsLoading(true);

    const data = {
      identifier: id,
      param: "all",
      offset: offset,
    };
    console.log("--- data ---", data);
    await axios
      .post("/api/v4/dashboard-search", data)
      .then((res) => {
        const dashboard_list = res.data.dashboard_list.data;
        // setSelectedVehicles(dashboard_list);
        // setSelectedVehicles(dashboard_list);
        // i have to check current size of list and take action
        setSelectedVehicles([...selectedVehicles, ...dashboard_list]);
        setAllSelectedVehicles([...selectedVehicles, ...dashboard_list]);
        console.log("single res------", res.data.dashboard_list);

        setTotalItems(totalItems + 1);
        console.log("single call total --", totalItems);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  };

  const selectedVehiclesIdentifier = (vehicles) => {
    return vehicles.map((vehicle) => vehicle.v_identifier).join(",");
  };

  // my pagination

  const visiblePages = 5;

  // Calculate range of visible page numbers
  const rangeStart = Math.max(currentPage - Math.floor(visiblePages / 2), 1);
  const rangeEnd = Math.min(rangeStart + visiblePages - 1, totalPages);

  // Generate page numbers to display
  const pages = [];
  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i);
  }

  const handlePageClick = (page) => {
    setCurrentPage(page);
    // gotoPage(page - 1);
    const id = selectedIdentifiers.map((item) => item.v_identifier).join(",");
    searchMultipleVehicles(id, page);
  };

  useEffect(() => {
    setCurrentPage(1);

    console.log("-- offset selectedIdentifiers --", selectedIdentifiers);
    console.log("offset new", offset);

    setOffset(offset);
    const calculatePages = Math.ceil(totalItems / offset);
    setTotalPages(calculatePages);

    if (selectedIdentifiers.length) {
      const id = selectedIdentifiers.map((item) => item.v_identifier).join(",");
      searchMultipleVehicles(id, 1);
    }
  }, [offset]);

  // useEffect(() => {
  //   const id =
  //     "357789642810979,357789642822420,357789642816844,357789642817032,357789642815903,357789642816729";
  //   const data = {
  //     identifier: id,
  //     param: "all",
  //     offset: offset,
  //     page: currentPage,
  //   };
  //   console.log(data);

  //   setIsLoading(true);
  //   axios
  //     .post("/api/v4/dashboard-search", data)
  //     .then((res) => {
  //       const dashboard_list = res.data.dashboard_list;
  //       setTotalItems(res.data.dashboard_list.total);

  //       setSelectedVehicles(dashboard_list.data);

  //       console.log("-- paginate list------", dashboard_list);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     })
  //     .finally(() => {
  //       setIsLoading(false);
  //     });
  // }, [currentPage]);

  useEffect(() => {
    let calculatePages = Math.ceil(totalItems / offset);
    setTotalPages(calculatePages);
  }, [totalItems]);

  useEffect(() => {
    console.log("--setSelectedIdentifiers--", selectedIdentifiers);
    if (!selectedIdentifiers.length) {
      setTotalItems(0);
    }
  }, [selectedIdentifiers]);

  return (
    <div className="">
      <div className="flex">
        <div className="grow pt-1 overflow-hidden">
          {/* <DashboardTable
            selectedVehicles={selectedVehicles}
            isLoading={isLoading}
          /> */}

          {/* <TestPagination
            setIsLoading={setIsLoading}
            setSelectedVehicles={setSelectedVehicles}
            selectedVehicles={selectedVehicles}
          /> */}

          <TestDashboardTable
            selectedVehicles={selectedVehicles}
            isLoading={isLoading}
          />

          {/* ====== pagination ====== */}
          <div className="pagination flex items-center justify-between ">
            <div className="flex items-center gap-4 ">
              <div>
                <label className="text-[#48525C] mr-2">Rows visible</label>
                <select
                  value={offset}
                  onChange={(e) => {
                    setOffset(Number(e.target.value));
                  }}
                  className="p-[10px] rounded-md text-[#48525C] text-sm"
                >
                  {[2, 5, 10, 20, 30, 40, 50].map((pageNumber) => (
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
                      className="rounded-lg w-10 h-10 flex items-center justify-center bg-white disabled cursor-pointer"
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
                    className={`rounded-lg w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-[#FDD10E] hover:primary-shadow ${page === currentPage
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
                      className="rounded-lg w-10 h-10 flex items-center justify-center bg-white cursor-pointer"
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
        <div className="flex-none ml-4  pt-20">
          <MultipleVehicleSelector
            isSelected={true}
            isRequesting={isLoading}
            getMultipleSelectedVehicles={getMultipleSelectedVehicles}
            getSingleSelectedVehicle={getSingleSelectedVehicle}
            height={700}
          />
        </div>
      </div>
      <Advertisement />
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
