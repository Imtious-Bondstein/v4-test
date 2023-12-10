import React, { useEffect, useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import Layout from "@/components/layouts/Layout";
import DashboardLayout from "@/components/layouts/DashboardLayout";

import axios from "@/plugins/axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SubadminTable from "@/components/tables/SubadminTable";

const index = () => {
  const [subAdminList, setSubAdminList] = useState([]);

  // FETCH SUBADMIN DATA LIST
  const fetchSubadminData = async () => {
    await axios
      .get(`/api/v4/sub-admin/list`)
      .then((res) => {
        const data = res.data.data;
        setSubAdminList(
          data.map((item, index) => ({
            ...item,
            sl: index + 1,
            displayDropdownInfo: false,
          }))
        );
        console.log("SUBADMIN DATA ", res.data.data);
      })
      .catch((err) => {
        console.log("SUBADMIN DATA : ", err.response);
        // toast.error(err.response?.data?.user_message);
      });
  };

  useEffect(() => {
    fetchSubadminData();
  }, []);

  return (
    <div className="pb-16">
      <ToastContainer />

      <div className="sm:p-5 rounded-[20px]">
        <SubadminTable
          subAdminList={subAdminList}
          setSubAdminList={setSubAdminList}
        />
      </div>
    </div>
  );
};

export default index;

index.getLayout = function getLayout(page) {
  return (
    <ProtectedRoute>
      <Layout>
        <DashboardLayout>{page}</DashboardLayout>
      </Layout>
    </ProtectedRoute>
  );
};
