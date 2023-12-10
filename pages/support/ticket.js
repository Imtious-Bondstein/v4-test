import PlusSVG from "@/components/SVG/PlusSVG";
import LeftArrowPagination from "@/components/SVG/pagination/LeftArrowPaginateSVG";
import RightArrowPaginateSVG from "@/components/SVG/pagination/RightArrowPaginateSVG";
import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import DailyDistanceChart from "@/components/charts/DailyDistanceChart";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Layout from "@/components/layouts/Layout";
import SupportTicketTable from "@/components/tables/SupportTicketTable";
import SupportTicket from "@/components/tables/SupportTicketTable";
import ReportSingleVehicleSelector from "@/components/vehicleSelectors/ReportSingleVehicleSelector";
import axios from "@/plugins/axios";
import Search from "@/svg/SearchSVG";
import { supportTicketTableData } from "@/utils/supportTicketTableData";
import React, { useEffect, useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const support_ticket = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [ticketData, setTicketData] = useState([]);

  const fetchTicketData = async () => {
    setIsLoading(true);

    await axios
      .get("/api/v4/support-ticket/all-tickets")
      .then((res) => {
        console.log("-- get ticket res--", res.data.data);

        const newData = res.data.data.map((item, index) => ({
          ...item,
          sl: index + 1,
        }));
        setTicketData(newData);
      })
      .catch((err) => {
        console.log("get ticket error : ", err.response);
        // toast.error("err.response.data?.user_message");
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchTicketData();
  }, []);

  return (
    <div className="pb-20">
      <ToastContainer />
      <SupportTicketTable
        isLoading={isLoading}
        ticketData={ticketData}
        setTicketData={setTicketData}
        fetchTicketData={fetchTicketData}
      />
    </div>
  );
};

export default support_ticket;

support_ticket.getLayout = function getLayout(page) {
  return (
    <ProtectedRoute>
      <Layout>
        <DashboardLayout>{page} </DashboardLayout>
      </Layout>
    </ProtectedRoute>
  );
};
