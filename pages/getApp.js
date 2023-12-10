import DownloadApp from "@/components/DownloadApp";
import Helpline from "@/components/Helpline";
import MainLogo from "@/svg/MainLogoSVG";
import React from "react";
import "../styles/pages/Home.css";
import AuthLayout from "@/components/layouts/AuthLayout";
import Layout from "@/components/layouts/Layout";

// cookie
import UnprotectedRoute from "@/components/authentication/UnprotectedRoute";

const getApp = () => {
  return (
    <div className="sm:w-[450px] sm:p-6 text-center z-10 overflow-auto">
      <div className="flex justify-center pb-10 pt-12 md:py-0">
        <MainLogo />
      </div>

      <p class="text-center py-4">
        Download TMV Lite App from the links given below
      </p>

      {/* APP LINKS */}
      <DownloadApp />

      {/* HELPLINE NUMBER */}
      <Helpline />
    </div>
  );
};

export default getApp;

getApp.getLayout = function getLayout(page) {
  return (
    <UnprotectedRoute>
      <Layout>
        <AuthLayout>{page}</AuthLayout>
      </Layout>
    </UnprotectedRoute>
  );
};
