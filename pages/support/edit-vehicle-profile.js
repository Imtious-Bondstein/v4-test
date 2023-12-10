import EditVehicleProfile from "@/components/EditVehicleProfile";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Layout from "@/components/layouts/Layout";
import React from "react";

// ===== toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const edit_vehicle_profile = () => {
  return (
    <div>
      <ToastContainer />
      <EditVehicleProfile />
    </div>
  );
};

export default edit_vehicle_profile;

edit_vehicle_profile.getLayout = function getLayout(pages) {
  return (
    <ProtectedRoute>
      <Layout>
        <DashboardLayout>{pages} </DashboardLayout>
      </Layout>
    </ProtectedRoute>
  );
};
