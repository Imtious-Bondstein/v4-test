import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Layout from "@/components/layouts/Layout";
import VehicleGroupTable from "@/components/tables/VehicleGroupTable";
import axios from "@/plugins/axios";

import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [groupData, setGroupData] = useState([]);

  // FETCHING DATA FROM API --------- 01
  const fetchGroupData = async () => {
    console.log("home page");
    await axios
      .get("/api/v4/vehicle-group/list")
      .then((res) => {
        console.log("-- get groups res--", res.data.data);

        const newData = res.data.data.map((item, index) => ({
          ...item,
          sl: index + 1,
          checkbox: false,
        }));
        setGroupData(newData);
      })
      .catch((err) => {
        console.log("groups error : ", err.response);
        // toast.error("err.response.data?.user_message");
      })
      .finally(() => setIsLoading(false));
  };

  // --------- 02
  useEffect(() => {
    fetchGroupData();
  }, []);

  return (
    <div>
      <ToastContainer />
      <VehicleGroupTable
        isLoading={isLoading}
        groupData={groupData}
        setGroupData={setGroupData}
        fetchGroupData={fetchGroupData}
      />
    </div>
  );
};

export default index;
index.getLayout = function getLayout(pages) {
  return (
    <ProtectedRoute>
      <Layout>
        <DashboardLayout>{pages} </DashboardLayout>
      </Layout>
    </ProtectedRoute>
  );
};
