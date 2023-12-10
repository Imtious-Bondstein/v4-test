import DownloadSVG from "@/components/SVG/DownloadSVG";
import SearchCarSVG from "@/components/SVG/SearchCarSVG";
import SearchSVG from "@/components/SVG/SearchSVG";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Layout from "@/components/layouts/Layout";
import TestTable2 from "@/components/tables/TestTable2";

import React, { useEffect, useState } from "react";
import DeviceDetailsTable from "@/components/tables/DeviceDetailsTable";
import axios from "@/plugins/axios";
import { toast } from "react-toastify";

const device_details = () => {
  const [deviceDetails, setDeviceDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const initData = () => {
    setIsLoading(true);
    axios
      .get("/api/v4/device-details")
      .then((res) => {
        const data = res.data.deviceDetails;
        data.map((item, index) => {
          item.sl = index + 1;
        });

        setDeviceDetails(data);
        console.log("------res", data);
      })
      .catch((err) => {
        console.log(err);
        errorNotify(err.response.statusText);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    initData();
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

  return (
    <div>
      {/* ====== data table ======= */}
      <div>
        <DeviceDetailsTable
          isLoading={isLoading}
          deviceDetailsData={deviceDetails}
        />
      </div>

      <div>{/* <TestTable2 /> */}</div>
    </div>
  );
};

export default device_details;

device_details.getLayout = function getLayout(page) {
  return (
    <ProtectedRoute>
      <Layout>
        <DashboardLayout>{page}</DashboardLayout>
      </Layout>
    </ProtectedRoute>
  );
};
