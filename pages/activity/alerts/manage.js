import DashboardLayout from "@/components/layouts/DashboardLayout";
import Layout from "@/components/layouts/Layout";
import AlertManagementTable from "@/components/tables/AlertManagementTable";
import AlertMultipleVehicleSelector from "@/components/vehicleSelectors/AlertMultipleVehicleSelector";
import DateRangeMultipleVehicleSelector from "@/components/vehicleSelectors/DateRangeMultipleVehicleSelector";
import axios from "@/plugins/axios";
import React, { useEffect, useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { async } from "regenerator-runtime";

import RightArrowPaginateSVG from "@/components/SVG/pagination/RightArrowPaginateSVG";
import LeftArrowPaginateSVG from "@/components/SVG/pagination/LeftArrowPaginateSVG";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";

const manage = () => {
  // const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [vehiclesList, setVehiclesList] = useState([]);
  const [allSelectedVehicles, setAllSelectedVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);

  // ===== shakil =====
  const [offset, setOffset] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  // const [totalItems, setTotalItems] = useState(1);

  const [currentPage, setCurrentPage] = useState(1);
  const [clicked, setClicked] = useState(false);
  const [xlScreen, setXlScreen] = useState(true);

  //========bulk setting update========
  const getCurrentSelectedVehicleAndSettings = async (
    vehicles,
    event,
    alert
  ) => {
    console.log(event);
    console.log(alert);

    setIsUpdateLoading(true);

    let data = {};
    if (event !== "all_event") {
      if (alert === "both") {
        data = {};

        data[event.concat("_", "email")] = true;
        data[event.concat("_", "sms")] = true;
        // console.log("data--", data);
      } else if (alert === "no_alert") {
        data = {};

        data[event.concat("_", "email")] = false;
        data[event.concat("_", "sms")] = false;
        // console.log("data--", data);
      } else {
        data = {};
        let fieldName = event.concat("_", alert);
        data[fieldName] = true;
        // console.log("data = ", data);
      }
    } else {
      if (alert === "both") {
        data = {
          engine_on_email: true,
          engine_on_sms: true,
          engine_off_email: true,
          engine_off_sms: true,
          overspeed_email: true,
          overspeed_sms: true,
          panic_email: true,
          panic_sms: true,
          offline_email: true,
          offline_sms: true,
          disconnect_email: true,
          disconnect_sms: true,
        };

        // console.log("data--", data);
      } else if (alert === "no_alert") {
        data = {};

        data = {
          engine_on_email: false,
          engine_on_sms: false,
          engine_off_email: false,
          engine_off_sms: false,
          overspeed_email: false,
          overspeed_sms: false,
          panic_email: false,
          panic_sms: false,
          offline_email: false,
          offline_sms: false,
          disconnect_email: false,
          disconnect_sms: false,
        };

        // console.log("data--", data);
      } else {
        data = {};
        data = {
          ["engine_on".concat("_", alert)]: true,
          ["engine_off".concat("_", alert)]: true,
          ["overspeed".concat("_", alert)]: true,
          ["panic".concat("_", alert)]: true,
          ["offline".concat("_", alert)]: true,
          ["disconnect".concat("_", alert)]: true,
        };

        // let fieldName = event.concat("_", alert);
        // data[fieldName] = true;
      }
    }

    await handleBulkUpdate(vehicles, data).then(() => {
      console.log("promise loading...");
      setIsUpdateLoading(false);
      fetchTableData();
    });
  };

  const handleBulkUpdate = async (vehicles, data) => {
    for (let index = 0; index < vehicles.length; index++) {
      Object.keys(data).length &&
        (await updateAlertManagement(vehicles[index].v_identifier, data));
      // (await updateAlertManagement("357789642816728994", data));

      console.log("-- > id", vehicles[index].v_identifier);
    }
  };

  const updateAlertManagement = async (identifier, data) => {
    await axios
      .post(
        `/api/v4/alert-management/alert-settings-update?identifier=${identifier}`,
        data
      )
      .then((res) => {
        console.log(" Data updated ", res);

        // fetchTableData();
      })
      .catch((err) => {
        console.log("err.response", err);
        if (err.response) {
          errorNotify(
            err.response.statusText
              ? err.response.statusText
              : err.response.user_message
          );
        }

        // fetchTableData();
      });
  };

  const fetchTableData = async (page) => {
    setIsLoading(true);
    await axios
      .get(
        `/api/v4/alert-management/alert-settings?offset=${offset}&page=${
          page ? page : currentPage
        }`
      )
      .then((res) => {
        const vehicles = res.data.alertManagement;

        const current_page = vehicles.current_page;
        const per_page = vehicles.per_page;

        const calculatePages = Math.ceil(vehicles.total / offset);
        setTotalPages(calculatePages);

        setVehiclesList(
          vehicles.data.map((item, index) => ({
            ...item,
            sl: per_page * (current_page - 1) + index + 1,
            showEngineOn: false,
            showEngineOff: false,
            showOverspeed: false,
            showPanic: false,
            showOffline: false,
            showDisconnect: false,
          }))
        );

        console.log(" manage res ------", res.data.alertManagement);
      })
      .catch((err) => {
        console.log(err);
        errorNotify(err.response?.statusText);
      })
      .finally(() => setIsLoading(false));
  };

  // CHECK FOR OUTSIDE CLICK FOR SELECTOR ==========================================
  const handleOutsideSelectorClick = () => {
    setClicked(false);
  };

  useEffect(() => {
    fetchTableData();
  }, []);

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
    fetchTableData(page);
  };

  // update if visible rows changes
  useEffect(() => {
    setCurrentPage(1);
    fetchTableData();
  }, [offset]);

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
      <ToastContainer />

      <div className="grow md:pt-1 overflow-hidden">
        <AlertManagementTable
          vehiclesList={vehiclesList}
          isLoading={isLoading}
          fetchTableData={fetchTableData}
          offset={offset}
        />

        {/* ====== pagination ====== */}
        <div className="pagination flex items-center justify-center md:justify-between py-6">
          <div className="hidden md:flex items-center gap-4 ">
            <div>
              <label className="text-[#48525C] mr-2 ">Rows visible</label>
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
      <div
        className={`${
          clicked === true ? "right-0 top-0" : "-right-96 top-0 xl:top-20"
        } ${
          xlScreen === true
            ? "xl:z-40 xl:right-10 xl:shadow-none xl:flex-none xl:block xl:static xl:ml-4"
            : "lg:z-40 lg:right-10 lg:shadow-none lg:flex-none lg:block lg:static lg:ml-4"
        } flex-none fixed ease-in-out duration-700 rounded-3xl z-[3004]`}
      >
        <div className="flex-none ml-4 pt-16">
          <AlertMultipleVehicleSelector
            isSelected={true}
            isRequesting={isUpdateLoading}
            getCurrentSelectedVehicleAndSettings={
              getCurrentSelectedVehicleAndSettings
            }
            height={700}
            clicked={clicked}
            setClicked={setClicked}
            top={false}
            xlScreen={xlScreen}
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

export default manage;
manage.getLayout = function getLayout(pages) {
  return (
    <ProtectedRoute>
      <Layout>
        <DashboardLayout>{pages} </DashboardLayout>
      </Layout>
    </ProtectedRoute>
  );
};
