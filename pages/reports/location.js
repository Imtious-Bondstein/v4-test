import React, { useEffect, useRef, useState } from "react";
// ===== layout
import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Layout from "@/components/layouts/Layout";

// ===== table & selector
import LocationReportTable from "@/components/tables/LocationReportTable";
import LocationSingleVehicleSelector from "@/components/vehicleSelectors/LocationSingleVehicleSelector";

import axios from "@/plugins/axios";
import { getYearMonthDay, locationDates } from "@/utils/dateTimeConverter";

const location = () => {
  const selectedIdentifiers = useRef(null);
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [allSelectedVehicles, setAllSelectedVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [interval, setInterval] = useState("60");

  const previousDay = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
  const [dateRange, setDateRange] = useState({
    date: new Date().setHours(0, 0, 0, 0),
    start_time: new Date().setHours(0, 0, 0, 0),
    end_time: new Date().setHours(23, 59, 0, 0),
  });

  // pagination states
  const [clicked, setClicked] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [fetched, setFetched] = useState(false);

  const getSingleSelectedVehicle = (vehicle) => {
    console.log("single my selected", vehicle);

    if (vehicle.selected) {
      selectedIdentifiers.current = vehicle;
      setCurrentPage(1);
      console.log("clicked vehicle", vehicle);
      console.log("selected Identifier ref", selectedIdentifiers.current);

      searchSingleVehicle(vehicle.v_identifier, 1);
    } else {
      // unselect vehicles
      setSelectedVehicles(
        selectedVehicles.filter(
          (selectedVehicle) =>
            selectedVehicle.identifier !== vehicle.v_identifier
        )
      );

      // selected vehicles
      selectedIdentifiers.current = null;
    }
  };

  const searchSingleVehicle = async (id, pageNumber) => {
    setIsLoading(true);
    setSelectedVehicles([]);

    const data = {
      identifier: id,
      date: getYearMonthDay(dateRange.date),
      start_time: locationDates(dateRange.start_time),
      end_time: locationDates(dateRange.end_time),
      interval: parseInt(interval),
    };

    console.log("--- data ---", data);

    await axios
      .post(`/api/v4/report/location-report-test`, data)
      .then((res) => {
        const vehicle_list = res.data.locationReport;
        // const current_page = res.data.locationReport.current_page;
        // const per_page = res.data.locationReport.per_page;
        // setTotalItems(res.data.locationReport.total);

        // vehicle_list.map((item, index) => {
        //   item.sl = per_page * (current_page - 1) + index + 1;
        // });
        vehicle_list.map((item, index) => {
          item.sl = index + 1;
        });
        setSelectedVehicles(vehicle_list);
        // setAllSelectedVehicles([...selectedVehicles, ...vehicle_list]);
        setFetched(true);

        console.log(
          "Response Data====================================",
          res.data.locationReport
        );
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  };

  // CHECK FOR OUTSIDE CLICK FOR SELECTOR
  const handleOutsideSelectorClick = () => {
    setClicked(false);
  };

  useEffect(() => {
    if (selectedIdentifiers.current) {
      const id = selectedIdentifiers.current.v_identifier;

      searchSingleVehicle(id);
    }
    console.log("call api", selectedIdentifiers.current);
  }, [dateRange, interval]);

  return (
    <div className="flex">
      <div className="grow pt-1 overflow-hidden ">
        <LocationReportTable
          isLoading={isLoading}
          selectedVehicles={selectedVehicles}
          selectedIdentifier={selectedIdentifiers}
          setDateRange={setDateRange}
          dateRange={dateRange}
          interval={interval}
          fetched={fetched}
        />
      </div>
      <div
        className={`${
          clicked === true ? "right-0" : "-right-96"
        } flex-none fixed lg:static lg:ml-4 lg:right-10 top-16 lg:top-0 lg:pt-[60px] lg:shadow-none ease-in-out duration-700 rounded-3xl z-[3004] lg:z-40`}
      >
        {/* <div className="flex-none ml-4 pt-[60px]"> */}
        <LocationSingleVehicleSelector
          isRequesting={isLoading}
          getSingleSelectedVehicle={getSingleSelectedVehicle}
          clicked={clicked}
          setClicked={setClicked}
          setDateRange={setDateRange}
          dateRange={dateRange}
          setInterval={setInterval}
          interval={interval}
        />
      </div>
      {/* BLUR FILTER */}
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

export default location;
location.getLayout = function getLayout(page) {
  return (
    <ProtectedRoute>
      <Layout>
        <DashboardLayout>{page} </DashboardLayout>
      </Layout>
    </ProtectedRoute>
  );
};
