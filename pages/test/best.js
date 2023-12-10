import React, { useState } from "react";

import Best from "@/components/test/Best";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import Layout from "@/components/layouts/Layout";
import DashboardLayout from "@/components/layouts/DashboardLayout";

const best = () => {
  const [isDropdownShow, setIsDropdownShow] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownShow(!isDropdownShow);
    console.log("page", isDropdownShow);
  };
  const closeDropdown = () => {
    console.log("close drop ", isDropdownShow);
    setIsDropdownShow(false);
  };
  return (
    <div className="bg-red-300 h-screen" onClick={closeDropdown}>
      <h1>Subroto</h1>
      <Best isDropdownShow={isDropdownShow} toggleDropdown={toggleDropdown} />
    </div>
  );
};
export default best;

best.getLayout = function getLayout(pages) {
  return (
    <ProtectedRoute>
      <Layout>
        <DashboardLayout>{pages} </DashboardLayout>
      </Layout>
    </ProtectedRoute>
  );
};
