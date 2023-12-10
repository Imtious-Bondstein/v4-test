import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

// ==== layout
import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Layout from "@/components/layouts/Layout";
import Topbar from "@/components/Topbar";

// ======= styles
import "@/styles/pages/vehicleProfile.css";

import DriverAssignmentModal from "@/components/modals/DriverAssignmentModal";
import AuthorizationModal from "@/components/modals/AuthorizationModal";
import GasolineConsumption from "@/components/modals/GasolineConsumption";
import EditVehicleAlertModal from "@/components/modals/EditVehicleAlertModal";
import VehicleProfileTable from "@/components/tables/VehicleProfileTable";

// ===== toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axios from "@/plugins/axios";
import VehicleProfileTableTest from "@/components/test/VehicleProfileTableTest";

// ===== svg
import RightArrowPaginateSVG from "@/components/SVG/pagination/RightArrowPaginateSVG";
import LeftArrowPaginateSVG from "@/components/SVG/pagination/LeftArrowPaginateSVG";

// ======= others
import MultipleVehicleSelect from "@/components/vehicleSelectors/MultipleVehicleSelector";
import Advertisement from "@/components/Advertisement";

const Vehicle_Profile = () => {
  const [open, setOpen] = useState(true);
  const [currentPath, setCurrentPath] = useState("/analytics-summary");

  const [profileData, setProfileData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ==== shakil ====
  const [offset, setOffset] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(1);

  const [currentPage, setCurrentPage] = useState(1);

  const [addNewVehicleModalIsOpen, setAddNewVehicleModalIsOpen] =
    useState(false);

  const fetchData = () => {
    setIsLoading(true);
    axios
      .get("/api/v4/vehicle-profile")
      .then((res) => {
        const vehicle_list = res.data.vehicleProfile;

        setTotalItems(vehicle_list.length);

        const calculatePages = Math.ceil(vehicle_list.length / offset);
        setTotalPages(calculatePages);

        vehicle_list.map((item, index) => {
          item.sl = index + 1;
        });

        setAllData(vehicle_list);
        setProfileData(vehicle_list.slice(0, offset));
        console.log("------res", res.data);
      })
      .catch((err) => {
        console.log("error response", err);
        if (err.response) {
          errorNotify(
            err.response.statusText
              ? err.response.statusText
              : err.response.user_message
          );
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const { query } = useRouter();

  useEffect(() => {
    setAddNewVehicleModalIsOpen(query.addNewVehicle);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

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

  const updateData = (page) => {
    const startIndex = (page - 1) * offset;
    const endIndex = startIndex + offset;
    setProfileData(allData.slice(startIndex, endIndex));
  };

  // paginate button clicks
  const handlePageClick = (page) => {
    setCurrentPage(page);
    updateData(page);
  };

  // update if visible rows changes
  useEffect(() => {
    setCurrentPage(1);
    setOffset(offset);

    const calculatePages = Math.ceil(totalItems / offset);
    setTotalPages(calculatePages);
    updateData(1);
  }, [offset]);

  return (
    <div className="relative lg:pr-8 pb-20 ">
      {/* modal */}
      {/* <DriverAssignmentModal />
      <DriverAssignmentModal />
      <AuthorizationModal />
      <GasolineConsumption />
      <EditVehicleAlertModal /> */}

      <div className="">
        <ToastContainer />
        <div className="overflow-hidden">
          <VehicleProfileTable
            profileData={profileData}
            allProfileData={allData}
            isLoading={isLoading}
            addNewVehicleModalIsOpen={addNewVehicleModalIsOpen}
            setAddNewVehicleModalIsOpen={setAddNewVehicleModalIsOpen}
          />
        </div>

        {/* <VehicleProfileTableTest
          profileData={profileData}
          isLoading={isLoading}
        /> */}

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
      {/* ========== ADVERTISEMENT ========  */}
      <div className="py-5 xs:py-10">
        <Advertisement />
      </div>
    </div>
  );
};

export default Vehicle_Profile;

Vehicle_Profile.getLayout = function getLayout(page) {
  return (
    <ProtectedRoute>
      <Layout>
        <DashboardLayout>{page}</DashboardLayout>
      </Layout>
    </ProtectedRoute>
  );
};
