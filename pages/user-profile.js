import React, { useState, useRef, useEffect } from "react";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";

// ====== Layout =========
import Layout from "@/components/layouts/Layout";
import DashboardLayout from "@/components/layouts/DashboardLayout";

// ======= styles
import "../styles/globals.css";

//====== toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserProfile from "@/components/UserProfile";

const user_profile = () => {
  return (
    <div className="pb-20">
      <ToastContainer />
      <div>
        <UserProfile />
      </div>
    </div>
  );
};

export default user_profile;

user_profile.getLayout = function getLayout(page) {
  return (
    <ProtectedRoute>
      <Layout>
        <DashboardLayout>{page}</DashboardLayout>
      </Layout>
    </ProtectedRoute>
  );
};
