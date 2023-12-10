import React, { useEffect, useState } from "react";
import "../../styles/pages/dashboard.css";

import Sidebar from "../Sidebar";
import Topbar from "@/components/Topbar";
import { useSelector } from "react-redux";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [countStep, setCountStep] = useState(null);

  const user = useSelector((state) => state.reducer.auth.user);

  useEffect(() => {
    user.is_first_login === true
      ? setIsFirstLogin(true)
      : setIsFirstLogin(false);
  }, [user.is_first_login]);

  return (
    <div className={`min-h-screen primaryBg overflow-hidden`}>
      {/* <div
        className={`h-screen fixed top-0 left-0 p-4 duration-500 ${sidebarOpen ? "w-[374px]" : "w-32"
          }`}
      > */}
      <div className="">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isFirstLogin={isFirstLogin}
          setIsFirstLogin={setIsFirstLogin}
          countStep={countStep}
          setCountStep={setCountStep}
        />
      </div>

      <div
        className={`${
          sidebarOpen ? "xl:ml-[374px] " : "lg:ml-20 xl:ml-32"
        } duration-500 min-h-screen  z-0`}
      >
        {/* <div className="lg:px-10 px-6 lg:static sticky top-0 z-[8000] "> */}
        <div
          className={`${
            countStep === 4 ? "z-[8000]" : "z-[3000]"
          } lg:px-10 px-6 lg:static sticky top-0 `}
        >
          <Topbar
            isFirstLogin={isFirstLogin}
            setIsFirstLogin={setIsFirstLogin}
            countStep={countStep}
            setCountStep={setCountStep}
          />
        </div>
        {/* <div className="relative pl-[70px]">{children}</div> */}
        <div className="relative lg:px-10 px-6 ">{children}</div>
      </div>

      {/* BLUR BASED ON FIRST TIME USER ========================================== */}
      <div
        className={` ${
          isFirstLogin ? "block" : "hidden"
        } blur-filter_dashboard`}
      ></div>
      {/* BLUR PROFILE BASED ON FIRST TIME USER */}
    </div>
  );
};

export default DashboardLayout;
