import DashboardLayout from "@/components/layouts/DashboardLayout";
import Layout from "@/components/layouts/Layout";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import TestChart from "@/components/charts/TestChart";
import TripChart from "@/components/charts/TripChart";
import useStorage from "@/components/hooks/useStorage";
// import { getStorage } from "../components/hooks/useStorage";
import "@/styles/test/test.css";
import TestTable from "@/components/tables/TestTable";
import axios from "axios";
import baseUrl from "@/plugins/baseUrl";
import { useSelector } from "react-redux";
import TestTable3 from "@/components/tables/TestTable3";

const test = () => {
  const LOCAL_STORAGE_KEY = "filters";
  const initialStateFilters = { isExpended: true };

  const [filters, setFilters] = useStorage(
    "local",
    LOCAL_STORAGE_KEY,
    initialStateFilters
  );
  console.log("filters", filters);

  // The value
  const { isExpended } = filters;

  // Setting the value
  const handleToggle = (newIsExpended) =>
    setFilters({ ...filters, isExpended: newIsExpended });

  const alertSummury = [
    {
      date: "5 Jan 2023",
      trips: 23,
      speeding: 10,
      fenceOut: 9,
    },
    {
      date: "6 Jan 2023",
      trips: 25,
      speeding: 15,
      fenceOut: 10,
    },
  ];

  return (
    <div>
      <TestTable />
    </div>
  );
};

export default test;
test.getLayout = function getLayout(page) {
  return (
    <Layout>
      <DashboardLayout>{page}</DashboardLayout>
    </Layout>
  );
};
