"use client";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Layout from "@/components/layouts/Layout";
import GroupDetailsTable from "@/components/tables/GroupDetailsTable";
import VehicleGroupTable from "@/components/tables/VehicleGroupTable";
import axios from "@/plugins/axios";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const vehicleGroupDetails = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState([]);

  const [groupName, setGroupName] = useState("");
  const [groupId, setGroupId] = useState("");

  // getGroup Details --------- 01
  const getGroupDetail = async (id) => {
    await axios
      .get(`/api/v4/vehicle-group/details?group_id=${id}`)
      .then((res) => {
        console.log(" group detail res--", res);

        const newData = res.data.data.map((item, index) => ({
          ...item,
          sl: index + 1,
          checkbox: false,
        }));

        setGroupName(newData[0].group);
        setProfileData(newData);
      })
      .catch((err) => {
        console.log("group detail error : ", err);

        toast.error(err.response?.data?.user_message);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    const path = window.location.pathname;
    const id = path.split("=")[1];
    if (id) {
      setGroupId(id);
      getGroupDetail(id);
    }
  }, []);

  return (
    <div>
      <GroupDetailsTable
        isLoading={isLoading}
        groupName={groupName}
        groupId={groupId}
        profileData={profileData}
        setProfileData={setProfileData}
        getGroupDetail={getGroupDetail}
      />
    </div>
  );
};

export default vehicleGroupDetails;

vehicleGroupDetails.getLayout = function getLayout(pages) {
  return (
    <ProtectedRoute>
      <Layout>
        <DashboardLayout>{pages} </DashboardLayout>
      </Layout>
    </ProtectedRoute>
  );
};
