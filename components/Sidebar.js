"use client";
import React, { useEffect, useState } from "react";
import MainLogo2 from "@/svg/MainLogo2SVG";
import MainLogo3 from "@/svg/MainLogo3SVG";
import AnalyticsSummary from "@/svg/menu/AnalyticsSummary";
import Vehicles from "@/svg/menu/Vehicles";
import MenuController from "@/svg/MenuControllerSVG";
import Link from "next/link";
import ReportsSVG from "@/svg/menu/ReportsSVG";
import ActivitySVG from "@/svg/menu/ActivitySVG";
import SupportSVG from "@/svg/menu/SupportSVG";
import BillingSVG from "@/svg/menu/BillingSVG";
import UserProfileSVG from "@/svg/menu/UserProfileSVG";
import LogoutSVG from "@/svg/menu/LogoutSVG";
import Bondstein from "@/svg/BondsteinSVG";
import RightArrowSVG from "./SVG/RightArrowSVG";

// / store action
import { SIGNOUT, UPDATE_USER_NEW } from "../store/slices/authSlice.js";
import { CLEAR_VEHICLE } from "../store/slices/vehicleSlice";
import { CLEAR_FAVORITE } from "../store/slices/favoriteSlice";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import "../styles/components/sidebar.css";
import axios from "@/plugins/axios";
import CrossSVG from "@/svg/CrossSVG";

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  setIsFirstLogin,
  isFirstLogin,
  countStep,
  setCountStep,
}) => {
  // const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPath, setCurrentPath] = useState("");

  const [expandAnalytics, setExpandAnalytics] = useState(false);
  const [expandVehicles, setExpandVehicles] = useState(true);
  const [expandActivity, setExpandActivity] = useState(false);
  const [expandReports, setExpandReports] = useState(false);
  const [expandSupport, setExpandSupport] = useState(false);
  const [navbarScrolled, setNavbarScrolled] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.reducer.auth.user);
  // console.log("hola Uesr", user);

  useEffect(() => {
    isFirstLogin === true ? setExpandVehicles(false) : "";
  }, [isFirstLogin]);

  const handleLogout = () => {
    dispatch(SIGNOUT());
    dispatch(CLEAR_VEHICLE());
    dispatch(CLEAR_FAVORITE());
    Cookies.remove("token");
    // const token = Cookie.get("token");
    router.push("/signin");

    // LOGOUT API ============================================
    axios
      .post("/api/v4/logout")
      .then((res) => {
        console.log(res.data.app_message);
        console.log(res.data.user_message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const expandNestedLinks = (name) => {
    if (name === "vehicles") {
      setExpandVehicles(!expandVehicles);

      setExpandAnalytics(false);
      setExpandActivity(false);
      setExpandSupport(false);
      setExpandReports(false);
    } else if (name === "activity") {
      setExpandActivity(!expandActivity);

      setExpandAnalytics(false);
      setExpandVehicles(false);
      setExpandSupport(false);
      setExpandReports(false);
    } else if (name === "reports") {
      setExpandReports(!expandReports);

      setExpandAnalytics(false);
      setExpandVehicles(false);
      setExpandSupport(false);
    } else if (name === "support") {
      setExpandSupport(!expandSupport);

      setExpandAnalytics(false);
      setExpandActivity(false);
      setExpandVehicles(false);
      setExpandReports(false);
    } else if (name === "analytics-and-summary") {
      setExpandAnalytics(!expandAnalytics);

      setExpandSupport(false);
      setExpandActivity(false);
      setExpandVehicles(false);
      setExpandReports(false);
    } else {
      setExpandAnalytics(false);

      setExpandSupport(false);
      setExpandActivity(false);
      setExpandVehicles(false);
      setExpandReports(false);
    }

    console.log("name", name);
  };

  const linkItems = [
    {
      title: "Analytics & Summary",
      path: "Analytics & Summary",
      icon: AnalyticsSummary,
    },
    { title: "Vehicles", path: "Vehicles", icon: Vehicles },
    { title: "Reports", path: "Reports", icon: ReportsSVG },
    { title: "Activity", path: "Activity", icon: ActivitySVG },

    { title: "Support", path: "Support", icon: SupportSVG },
    { title: "Billing", path: "Billing", icon: BillingSVG },
    { title: "User Profile", path: "User Profile", icon: UserProfileSVG },
  ];

  const changePosition = () => {
    if (window.scrollY >= 70) {
      setNavbarScrolled(true);
    } else {
      setNavbarScrolled(false);
    }
  };

  useEffect(() => {
    window.innerWidth <= 1024 ? setSidebarOpen(false) : null;
  }, []);

  // console.log("sidebarOpen", sidebarOpen);

  useEffect(() => {
    console.log("router.pathname", router.pathname);
    if (router.pathname.includes("analytics-and-summary")) {
      setSidebarOpen(true);
      setCurrentPath("Analytics & Summary");
    } else if (router.pathname.includes("reports")) {
      setSidebarOpen(false);
      setCurrentPath("Reports");
    } else if (
      router.pathname.includes("activity/alerts") ||
      router.pathname.includes("geo-fence")
    ) {
      setSidebarOpen(false);
      setCurrentPath("Activity");
    } else if (router.pathname.includes("support")) {
      setSidebarOpen(false);
      setCurrentPath("Support");
    } else if (
      router.pathname.includes("reports") ||
      router.pathname.includes("reports/location")
    ) {
      setSidebarOpen(false);
      setCurrentPath("Reports");
    } else if (
      router.pathname.includes("dashboard") ||
      router.pathname.includes("location")
    ) {
      setSidebarOpen(false);
      setCurrentPath("Vehicles");
    } else if (router.pathname.includes("user-profile")) {
      setSidebarOpen(false);
      setCurrentPath("User Profile");
    } else {
      setSidebarOpen(false);
      setCurrentPath("Analytics & Summary");
    }

    // setIsFavorite(favoriteLists.current.includes(router.pathname));
  }, [router.pathname]);

  useEffect(() => {
    changePosition();
    // adding the event when scroll change Logo
    window.addEventListener("scroll", changePosition);
  });

  // SCROLLBAR HIDE FOR FIRST TIME USER TOUR OPTIONS =====================================
  useEffect(() => {
    isFirstLogin
      ? (document.body.style.overflow = "hidden")
      : (document.body.style.overflow = "auto");
  }, [isFirstLogin]);

  return (
    <div
      className={`z-[3002] sidebar fixed top-0 left-0 p-4 duration-500 ease-in-out  ${
        sidebarOpen
          ? "w-[374px] h-[100vh] z-[8000]"
          : "w-[120px] h-[10vh] lg:h-[100vh]"
      }`}
    >
      {/* ======== expanded sidebar ======== */}
      <div
        className={`${
          sidebarOpen ? "block" : "hidden"
        }  bg-white  w-full h-full rounded-[40px] overflow-hidden z-[10000]`}
      >
        <div className="w-full h-full flex flex-col relative">
          <div className="flex-none">
            {/* ======= hamburger =======  */}
            <div className="absolute right-6 top-6">
              <button onClick={() => setSidebarOpen(!sidebarOpen)}>
                <MenuController />
              </button>
            </div>

            {/* ===== Logo ====== */}
            <div className="pl-6 mt-6">
              <button
                onClick={() => router.push("/analytics-and-summary")}
                className="w-fit h-fit rounded-full"
                href="/analytics-and-summary"
              >
                <MainLogo2 />
              </button>
            </div>

            {/* ===== user ====== */}
            <div className="px-6 mt-5">
              {/* <p className="font-bold">
                  {user && user?.first_name ? (
                    <span>
                      <span>{user?.first_name} </span>
                      <span>{user?.last_name} </span>
                    </span>
                  ) : (
                    <span>{user?.phone_number}</span>
                  )}
                </p> */}
              <p className="font-bold mb-4">{user && user?.customer_name}</p>
              {/* <p className="font-light text-xs">User ID: {user && user?.id}</p> */}
            </div>
          </div>
          <div className="grow flex flex-col relative overflow-y-auto overflow-x-hidden ">
            {/* ====== links ====  */}
            <div className="grow pt-5 pb-7 ">
              {/*  ====== single link Analytics & Summary ===== */}
              <div
                className={` ${
                  isFirstLogin && countStep !== 0
                    ? " opacity-[0.4] cursor-not-allowed"
                    : "opacity-1 cursor-pointer"
                }`}
              >
                {/* onClick={() => {
                    setCurrentPath("Analytics & Summary");
                    router.push("/analytics-and-summary");
                  }}
                   */}
                <div
                  onClick={() => {
                    expandNestedLinks("analytics-and-summary");
                    setCurrentPath("Analytics & Summary");
                    router.push("/analytics-and-summary");
                  }}
                  className={`transition group flex items-center justify-between py-2 pl-2 pr-3.5 rounded-xl text-[#1E1E1E] font-bold ${
                    currentPath === "Analytics & Summary" && countStep === 0
                      ? "bg-[#FFFAE6] tmv-shadow"
                      : "font-base"
                  }`}
                >
                  <div className="flex items-center justify-between gap-[22px] pr-1 flex-1 group">
                    <div
                      className={`w-[32px] h-[32px] rounded-lg group-hover:nav-link-grad  flex items-center justify-center ${
                        currentPath === "Analytics & Summary"
                          ? "nav-link-grad"
                          : ""
                      }`}
                    >
                      <AnalyticsSummary />
                    </div>
                    <div className="relative overflow-hidden flex-1 select-none">
                      <p className=" ">Analytics & Summary</p>
                    </div>
                  </div>
                  <span
                    className={`${
                      currentPath === "Analytics & Summary"
                        ? "block"
                        : "hidden group-hover:block"
                    }   `}
                  >
                    <RightArrowSVG />
                  </span>
                </div>

                {/* ====== Nested links ==== */}

                {/* ==== nested-link-hide , nested-link-visible --> from global.css ===  */}
              </div>

              {/* // ====== single link Vehicles ==== */}
              <div
                className={`px-3 ${
                  isFirstLogin && countStep != 1
                    ? " opacity-[0.4] cursor-not-allowed"
                    : "opacity-1 cursor-pointer"
                }`}
              >
                <div
                  onClick={() => {
                    if (isFirstLogin) {
                      // expandNestedLinks("vehicles");
                      // setCurrentPath("Vehicles");
                    } else {
                      expandNestedLinks("vehicles");
                      setCurrentPath("Vehicles");
                    }
                  }}
                  className={`flex items-center justify-between py-2 pl-2 pr-3.5 rounded-xl  text-[#1E1E1E] ${
                    currentPath === "Vehicles" || countStep === 1
                      ? "bg-[#FFFAE6] font-bold tmv-shadow "
                      : "font-base"
                  }`}
                >
                  <div className="flex items-center justify-between gap-[22px] pr-1 flex-1 group">
                    <div
                      className={`w-[32px] h-[32px] rounded-lg group-hover:nav-link-grad  flex items-center justify-center ${
                        currentPath === "Vehicles" ? "nav-link-grad" : ""
                      }`}
                    >
                      <Vehicles />
                    </div>
                    <div className="relative overflow-hidden flex-1 ">
                      <p>Vehicles</p>
                    </div>
                  </div>
                  <span
                    className={`${
                      currentPath === "Vehicles"
                        ? "block"
                        : "hidden group-hover:block"
                    }   `}
                  >
                    <RightArrowSVG />
                  </span>
                </div>

                {/* // ====== Nested links ==== */}
                <ul
                  className={`pl-14 overflow-hidden ${
                    expandVehicles
                      ? "nested-link-visible pt-4"
                      : "nested-link-hide"
                  }`}
                >
                  <li className="mb-4 group text-[#6A7077] hover:text-[#1E1E1E] ">
                    <Link
                      href={isFirstLogin ? "" : "/dashboard"}
                      className="flex items-center gap-4"
                    >
                      <span>• Dashboard</span>
                      <span className="group-hover:block hidden">
                        <RightArrowSVG />
                      </span>
                    </Link>
                  </li>
                  <li className="mb-4 group text-[#6A7077] hover:text-[#1E1E1E] ">
                    <Link
                      href={isFirstLogin ? "" : "/location/current-location"}
                      className="flex items-center gap-4"
                    >
                      <span>• Current Location</span>
                      <span className="group-hover:block hidden">
                        <RightArrowSVG />
                      </span>
                    </Link>
                  </li>
                  <li className="mb-4 group text-[#6A7077] hover:text-[#1E1E1E] ">
                    <Link
                      href={isFirstLogin ? "" : "/location/vehicle-route"}
                      className="flex items-center gap-4"
                    >
                      <span>• Vehicle Route</span>
                      <span className="group-hover:block hidden">
                        <RightArrowSVG />
                      </span>
                    </Link>
                  </li>
                  <li className="mb-4 group text-[#6A7077] hover:text-[#1E1E1E] ">
                    <Link
                      href={isFirstLogin ? "" : "/activity/location-share-list"}
                      className="flex items-center gap-4"
                    >
                      <span>• Location Share List</span>
                      <span className="group-hover:block hidden">
                        <RightArrowSVG />
                      </span>
                    </Link>
                  </li>
                  <li className="mb-4 group text-[#6A7077] hover:text-[#1E1E1E] ">
                    <Link
                      href={isFirstLogin ? "" : "/activity/route-share-list"}
                      className="flex items-center gap-4"
                    >
                      <span>• Route Share List</span>
                      <span className="group-hover:block hidden">
                        <RightArrowSVG />
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* // ====== single link Reports ===== */}
              <div
                className={`px-3 ${
                  isFirstLogin && countStep != 2
                    ? " opacity-[0.4] cursor-not-allowed"
                    : "opacity-1 cursor-pointer"
                }`}
              >
                <div
                  onClick={() => {
                    expandNestedLinks("reports");
                    setCurrentPath("Reports");
                  }}
                  className={` group flex items-center justify-between py-2 pl-2 pr-3.5 rounded-xl text-[#1E1E1E] ${
                    currentPath === "Reports" || countStep === 2
                      ? "bg-[#FFFAE6] font-bold tmv-shadow "
                      : "font-base"
                  }`}
                >
                  <div className="flex items-center justify-between gap-[22px] pr-1 flex-1 group">
                    <div
                      className={`w-[32px] h-[32px] rounded-lg group-hover:nav-link-grad  flex items-center justify-center ${
                        currentPath === "Reports" ? "nav-link-grad" : ""
                      }`}
                    >
                      <ReportsSVG />
                    </div>
                    <div className="relative overflow-hidden flex-1 ">
                      <p className=" ">Reports</p>
                    </div>
                  </div>
                  <span
                    className={`${
                      currentPath === "Reports"
                        ? "block"
                        : "hidden group-hover:block"
                    }   `}
                  >
                    <RightArrowSVG />
                  </span>
                </div>

                {/* // ====== Nested links ==== */}
                <ul
                  className={`pl-14 overflow-hidden ${
                    expandReports
                      ? "nested-link-visible pt-4"
                      : "nested-link-hide"
                  }`}
                >
                  {/* <li className="mb-4 group text-[#6A7077] hover:text-[#1E1E1E] ">
                    <Link
                      href="/reports/distance-report/hourly"
                      className="flex items-center gap-4"
                    >
                      <span>• Hourly Distance Report</span>
                      <span className="group-hover:block hidden">
                        <RightArrowSVG />
                      </span>
                    </Link>
                  </li> */}
                  {/* <li className="mb-4 group text-[#6A7077] hover:text-[#1E1E1E] ">
                    <Link
                      href="/reports/distance-report/daily"
                      className="flex items-center gap-4"
                    >
                      <span>• Daily Distance Report</span>
                      <span className="group-hover:block hidden">
                        <RightArrowSVG />
                      </span>
                    </Link>
                  </li> */}

                  <li className="mb-4 group text-[#6A7077] hover:text-[#1E1E1E] ">
                    <Link
                      href={
                        isFirstLogin ? "" : "/reports/distance-report/monthly"
                      }
                      className="flex items-center gap-4"
                    >
                      <span>• Monthly Distance Report</span>
                      <span className="group-hover:block hidden">
                        <RightArrowSVG />
                      </span>
                    </Link>
                  </li>
                  <li className="mb-4 group text-[#6A7077] hover:text-[#1E1E1E] ">
                    <Link
                      href={
                        isFirstLogin ? "" : "/reports/distance-report/hourly"
                      }
                      className="flex items-center gap-4"
                    >
                      <span>• Hourly Distance Report</span>
                      <span className="group-hover:block hidden">
                        <RightArrowSVG />
                      </span>
                    </Link>
                  </li>
                  <li className="mb-4 group text-[#6A7077] hover:text-[#1E1E1E] ">
                    <Link
                      href={
                        isFirstLogin ? "" : "/reports/distance-report/daily"
                      }
                      className="flex items-center gap-4"
                    >
                      <span>• Daily Distance Report</span>
                      <span className="group-hover:block hidden">
                        <RightArrowSVG />
                      </span>
                    </Link>
                  </li>
                  <li className="mb-4 group text-[#6A7077] hover:text-[#1E1E1E] ">
                    <Link
                      href={isFirstLogin ? "" : "reports/location"}
                      className="flex items-center gap-4"
                    >
                      <span>• Location Report</span>
                      <span className="group-hover:block hidden">
                        <RightArrowSVG />
                      </span>
                    </Link>
                  </li>
                  <li className="mb-4 group text-[#6A7077] hover:text-[#1E1E1E] ">
                    <Link
                      href={isFirstLogin ? "" : "/reports/speed"}
                      className="flex items-center gap-4"
                    >
                      <span>• Speed Report</span>
                      <span className="group-hover:block hidden">
                        <RightArrowSVG />
                      </span>
                    </Link>
                  </li>
                  <li className="mb-4 group text-[#6A7077] hover:text-[#1E1E1E] ">
                    <Link
                      href={isFirstLogin ? "" : "/reports/engine"}
                      className="flex items-center gap-4"
                    >
                      <span>• Engine Report</span>
                      <span className="group-hover:block hidden">
                        <RightArrowSVG />
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* // ====== single link Activity ===== */}
              <div
                className={` px-3 ${
                  isFirstLogin && countStep != 3
                    ? " opacity-[0.4] cursor-not-allowed"
                    : "opacity-1 cursor-pointer"
                }`}
              >
                <div
                  onClick={() => {
                    expandNestedLinks("activity");
                    setCurrentPath("Activity");
                  }}
                  className={` group flex items-center justify-between py-2 pl-2 pr-3.5 rounded-xl text-[#1E1E1E] ${
                    currentPath === "Activity" || countStep === 3
                      ? "bg-[#FFFAE6] font-bold tmv-shadow "
                      : "font-base"
                  }`}
                >
                  <div className="flex items-center justify-between gap-[22px] pr-1 flex-1 group">
                    <div
                      className={`w-[32px] h-[32px] rounded-lg group-hover:nav-link-grad  flex items-center justify-center ${
                        currentPath === "Activity" ? "nav-link-grad" : ""
                      }`}
                    >
                      <ActivitySVG />
                    </div>
                    <div className="relative overflow-hidden flex-1 ">
                      <p className=" ">Alert</p>
                    </div>
                  </div>
                  <span
                    className={`${
                      currentPath === "Activity"
                        ? "block"
                        : "hidden group-hover:block"
                    }   `}
                  >
                    <RightArrowSVG />
                  </span>
                </div>

                {/* // ====== Nested links ==== */}
                <ul
                  className={`pl-14 overflow-hidden ${
                    expandActivity
                      ? "nested-link-visible pt-4"
                      : "nested-link-hide"
                  }`}
                >
                  <li className="mb-4 group text-[#6A7077] hover:text-[#1E1E1E] ">
                    <Link
                      href={isFirstLogin ? "" : "/activity/alerts/overspeed"}
                      className="flex items-center gap-4"
                    >
                      <span>• Overspeed Alerts</span>
                      <span className="group-hover:block hidden">
                        <RightArrowSVG />
                      </span>
                    </Link>
                  </li>

                  <li className="mb-4 group text-[#6A7077] hover:text-[#1E1E1E] ">
                    <Link
                      href={isFirstLogin ? "" : "/activity/alerts/panic"}
                      className="flex items-center gap-4"
                    >
                      <span>• Panic Alerts</span>
                      <span className="group-hover:block hidden">
                        <RightArrowSVG />
                      </span>
                    </Link>
                  </li>
                  <li className="mb-4 group text-[#6A7077] hover:text-[#1E1E1E] ">
                    <Link
                      href={
                        isFirstLogin ? "" : "/activity/alerts/driving-fatigue"
                      }
                      className="flex items-center gap-4"
                    >
                      <span>• Driving Fatigue Alerts</span>
                      <span className="group-hover:block hidden">
                        <RightArrowSVG />
                      </span>
                    </Link>
                  </li>
                  <li className="mb-4 group text-[#6A7077] hover:text-[#1E1E1E] ">
                    <Link
                      href={isFirstLogin ? "" : "/activity/alerts/offline"}
                      className="flex items-center gap-4"
                    >
                      <span>• Offline Alerts</span>
                      <span className="group-hover:block hidden">
                        <RightArrowSVG />
                      </span>
                    </Link>
                  </li>
                  <li className="mb-4 group text-[#6A7077] hover:text-[#1E1E1E] ">
                    <Link
                      href={
                        isFirstLogin ? "" : "/activity/alerts/disconnection"
                      }
                      className="flex items-center gap-4"
                    >
                      <span>• Disconnection Alerts</span>
                      <span className="group-hover:block hidden">
                        <RightArrowSVG />
                      </span>
                    </Link>
                  </li>
                  <li className="mb-4 group text-[#6A7077] hover:text-[#1E1E1E] ">
                    <Link
                      href={isFirstLogin ? "" : "/activity/alerts/manage"}
                      className="flex items-center gap-4"
                    >
                      <span>• Alert Management</span>
                      <span className="group-hover:block hidden">
                        <RightArrowSVG />
                      </span>
                    </Link>
                  </li>
                  <li className="mb-4 group text-[#6A7077] hover:text-[#1E1E1E] ">
                    <Link
                      href={isFirstLogin ? "" : "/activity/alerts/summary"}
                      className="flex items-center gap-4"
                    >
                      <span>• Alert Summary</span>
                      <span className="group-hover:block hidden">
                        <RightArrowSVG />
                      </span>
                    </Link>
                  </li>
                  <li className="mb-4 group text-[#6A7077] hover:text-[#1E1E1E] ">
                    <Link
                      href={isFirstLogin ? "" : "/activity/geo-fence"}
                      className="flex items-center gap-4"
                    >
                      <span>• Geo Fence</span>
                      <span className="group-hover:block hidden">
                        <RightArrowSVG />
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* // ====== single link Support ===== */}
              <div
                className={`px-3 ${
                  isFirstLogin
                    ? " opacity-[0.4] cursor-not-allowed"
                    : "opacity-1 cursor-pointer"
                }`}
              >
                <div
                  onClick={() => {
                    expandNestedLinks("support");
                    setCurrentPath("Support");
                  }}
                  className={` group flex items-center justify-between py-2 pl-2 pr-3.5 rounded-xl text-[#1E1E1E] ${
                    currentPath === "Support"
                      ? "bg-[#FFFAE6] font-bold tmv-shadow "
                      : "font-base"
                  }`}
                >
                  <div className="flex items-center justify-between gap-[22px] pr-1 flex-1 group">
                    <div
                      className={`w-[32px] h-[32px] rounded-lg group-hover:nav-link-grad  flex items-center justify-center ${
                        currentPath === "Support" ? "nav-link-grad" : ""
                      }`}
                    >
                      <SupportSVG />
                    </div>
                    <div className="relative overflow-hidden flex-1 ">
                      <p className=" ">Support</p>
                    </div>
                  </div>
                  <span
                    className={`${
                      currentPath === "Support"
                        ? "block"
                        : "hidden group-hover:block"
                    }   `}
                  >
                    <RightArrowSVG />
                  </span>
                </div>

                {/* // ====== Nested links ==== */}
                <ul
                  className={`pl-14 overflow-hidden ${
                    expandSupport
                      ? "nested-link-visible pt-4"
                      : "nested-link-hide"
                  }`}
                >
                  <li className="mb-4 group text-[#6A7077] hover:text-[#1E1E1E] ">
                    <Link
                      href="/support/vehicle-profile"
                      className="flex items-center gap-4"
                    >
                      <span>• Vehicle Profiles</span>
                      <span className="group-hover:block hidden">
                        <RightArrowSVG />
                      </span>
                    </Link>
                  </li>

                  <li className="mb-4 group text-[#6A7077] hover:text-[#1E1E1E] ">
                    <Link
                      href="/support/vehicle-group"
                      className="flex items-center gap-4"
                    >
                      <span>• Vehicle Group</span>
                      <span className="group-hover:block hidden">
                        <RightArrowSVG />
                      </span>
                    </Link>
                  </li>

                  <li className="mb-4 group text-[#6A7077] hover:text-[#1E1E1E] ">
                    <Link
                      href="/support/device-details"
                      className="flex items-center gap-4"
                    >
                      <span>• Device Details</span>
                      <span className="group-hover:block hidden">
                        <RightArrowSVG />
                      </span>
                    </Link>
                  </li>

                  <li className="mb-4 group text-[#6A7077] hover:text-[#1E1E1E] ">
                    <Link
                      href="/support/ticket"
                      className="flex items-center gap-4"
                    >
                      <span>• Support Ticket</span>
                      <span className="group-hover:block hidden">
                        <RightArrowSVG />
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* // ====== single link Billing ===== */}
              <div
                className={`px-3 ${
                  isFirstLogin
                    ? " opacity-[0.4] cursor-not-allowed"
                    : "opacity-1 cursor-pointer"
                }`}
              >
                <div
                  onClick={() => setCurrentPath("Billing")}
                  className={` group flex items-center justify-between py-2 pl-2 pr-3.5 rounded-xl text-[#1E1E1E] ${
                    currentPath === "Billing"
                      ? "bg-[#FFFAE6] font-bold tmv-shadow "
                      : "font-base"
                  }`}
                >
                  <div className="flex items-center justify-between gap-[22px] pr-1 flex-1 group">
                    <div
                      className={`w-[32px] h-[32px] rounded-lg group-hover:nav-link-grad  flex items-center justify-center ${
                        currentPath === "Billing" ? "nav-link-grad" : ""
                      }`}
                    >
                      <BillingSVG />
                    </div>
                    <div className="relative overflow-hidden flex-1 ">
                      <p className=" ">Billing</p>
                    </div>
                  </div>
                  <span
                    className={`${
                      currentPath === "Billing"
                        ? "block"
                        : "hidden group-hover:block"
                    }   `}
                  >
                    <RightArrowSVG />
                  </span>
                </div>
              </div>

              {/* // ====== single link User Profile ===== */}
              <div
                className={`px-3 ${
                  isFirstLogin && countStep !== 4
                    ? " opacity-[0.4] cursor-not-allowed"
                    : "opacity-1 cursor-pointer"
                }`}
              >
                <Link
                  href={isFirstLogin ? "" : "/user-profile"}
                  className={` ${
                    isFirstLogin && countStep !== 4
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  <div
                    onClick={() => setCurrentPath("User Profile")}
                    className={` group flex items-center justify-between py-2 pl-2 pr-3.5 rounded-xl text-[#1E1E1E] ${
                      currentPath === "User Profile" || countStep === 4
                        ? "bg-[#FFFAE6] font-bold tmv-shadow "
                        : "font-base"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-[22px] pr-1 flex-1 group">
                      <div
                        className={`w-[32px] h-[32px] rounded-lg group-hover:nav-link-grad  flex items-center justify-center ${
                          currentPath === "User Profile" ? "nav-link-grad" : ""
                        }`}
                      >
                        <UserProfileSVG />
                      </div>
                      <div className="relative overflow-hidden flex-1 ">
                        <p className=" ">User Profile</p>
                      </div>
                    </div>
                    <span
                      className={`${
                        currentPath === "User Profile"
                          ? "block"
                          : "hidden group-hover:block"
                      }   `}
                    >
                      <RightArrowSVG />
                    </span>
                  </div>
                </Link>
              </div>
            </div>

            {/* ====== logout ====  */}
            <div className="sticky bottom-0 bg-white ">
              <div
                onClick={handleLogout}
                className=" mb-[40px] group duration-300 flex items-center justify-between py-2 pl-5 rounded-xl cursor-pointer  text-[#1E1E1E]   "
              >
                <div className="flex items-center justify-between gap-[22px] pr-1 flex-1">
                  <div className="w-[32px] h-[32px] rounded-lg group-hover:nav-link-grad flex items-center justify-center">
                    <LogoutSVG />
                  </div>
                  <div className="relative overflow-hidden flex-1 ">
                    <p className=" ">Log Out</p>
                  </div>
                </div>
              </div>

              {/* ======== copyright ======== */}
              <div className="pl-5 text-xs pb-5">
                <Bondstein />
                <p className="text-[#8D96A1] mt-3">
                  Bondstein Technologies Ltd.
                </p>
                <p className="text-[#8D96A1]">Ⓒ 2015 - 2023</p>
              </div>
            </div>
          </div>
          {countStep === null && isFirstLogin ? (
            <div className="blur-sidebar"></div>
          ) : (
            ""
          )}
        </div>
      </div>

      {/* ======== collapsed sidebar ======== */}
      <div
        className={`${
          sidebarOpen ? "hidden" : "block"
        } py-4 lg:bg-white w-full lg:h-full rounded-[25px]`}
      >
        <div className="w-full h-full  overflow-y-auto overflow-x-hidden relative">
          {/* ======= hamburger =======  */}
          <div
            className={`${
              navbarScrolled
                ? "justify-center"
                : "justify-start lg:justify-center"
            } flex items-center mb-5 ml-2 mt-1 sm:mt-1 lg:ml-0 z-[3005]`}
          >
            <button onClick={() => setSidebarOpen(!sidebarOpen)}>
              <MenuController />
            </button>
          </div>

          {/* ===== logo ====== */}
          <div className="hidden lg:flex items-center justify-center">
            <button
              onClick={() => router.push("/analytics-and-summary")}
              className="w-fit h-fit rounded-full"
              href="/analytics-and-summary"
            >
              <MainLogo3 />
            </button>
          </div>

          <div className="p-5 hidden lg:block ">
            {/* ====== single link ====  */}
            {linkItems.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  setCurrentPath(item.path);
                  setSidebarOpen(!sidebarOpen);
                  item.title === "Vehicles"
                    ? expandNestedLinks("vehicles")
                    : item.title === "reports"
                    ? expandNestedLinks("reports")
                    : item.title === "Activity"
                    ? expandNestedLinks("activity")
                    : item.title === "Support"
                    ? expandNestedLinks("support")
                    : item.title === "Reports"
                    ? expandNestedLinks("reports")
                    : expandNestedLinks();

                  // setCurrentPath("Vehicles");
                }}
                className={`w-fit group flex items-center justify-center  p-[8px] rounded-xl cursor-pointer text-[#1E1E1E] ${
                  currentPath === item.path
                    ? "bg-[#FFFAE6] font-bold tmv-shadow"
                    : "font-base"
                }`}
              >
                <div className="flex items-center justify-center  ">
                  <div
                    className={`w-[32px] h-[32px] rounded-lg group-hover:nav-link-grad  flex items-center justify-center ${
                      currentPath === item.path ? "nav-link-grad" : ""
                    }`}
                  >
                    {React.createElement(item?.icon)}
                  </div>
                  <div className="relative overflow-hidden flex-1 "></div>
                </div>
              </div>
            ))}
          </div>
          {/* ====== logout ====  */}
          <div className="absolute bottom-0 w-full hidden lg:block ">
            <div className="mb-0 group duration-300 flex items-center justify-center py-2 pl-2 pr-3.5 rounded-xl  text-[#1E1E1E]">
              <div
                onClick={handleLogout}
                className="w-[32px] h-[32px] rounded-lg group-hover:nav-link-grad flex items-center justify-center cursor-pointer"
              >
                <LogoutSVG />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ALL TOOLTIPS FOR FIRST TIME USER (Start) */}
      {countStep === 0 && isFirstLogin ? (
        <>
          <div className="absolute font-bold w-[40px] h-[40px] rounded-full flex justify-center items-center bg-[#FFD53E] right-0 top-[228px]">
            1
          </div>
          <div class="triangle absolute right-0 -mr-[22px] top-[226px]"></div>
          <div className="w-[250px] p-5 h-auto absolute right-0 -mr-[270px] bg-white top-[230px] rounded-[5px] text-[14px]">
            <div
              onClick={() => {
                setIsFirstLogin(false), setCountStep(8);
                dispatch(UPDATE_USER_NEW({ is_first_login: false }));
              }}
              className="float-right -mt-4 -me-4 cursor-pointer"
              title="Skip tour"
            >
              <CrossSVG />
            </div>
            <p>
              Check out our <strong>Analytics and Summary</strong> page to see
              what's up with your vehicles. You'll get a snapshot of the
              distance they've covered in the last week and where they are right
              now. It's all the information you need, easy and quick.
            </p>
            <button
              onClick={() => {
                setCountStep(countStep + 1),
                  setExpandVehicles(true),
                  expandNestedLinks("vehicles");
              }}
              className="px-4 py-1.5 rounded-full shadow-md hover:shadow-lg bg-gradient text-primaryText float-right text-sm font-bold"
            >
              Next
            </button>
          </div>
        </>
      ) : countStep === 1 && isFirstLogin ? (
        <>
          <div className="absolute font-bold w-[40px] h-[40px] rounded-full flex justify-center items-center bg-[#FFD53E] right-0 top-[278px]">
            2
          </div>
          <div class="triangle absolute right-0 -mr-[22px] top-[274px]"></div>
          <div className="w-[250px] p-5 h-auto absolute right-0 -mr-[270px] bg-white top-[280px] rounded-[5px] text-[14px]">
            <div
              onClick={() => {
                setIsFirstLogin(false), setCountStep(8);
                dispatch(UPDATE_USER_NEW({ is_first_login: false }));
              }}
              className="float-right -mt-4 -me-4 cursor-pointer"
              title="Skip tour"
            >
              <CrossSVG />
            </div>
            <p>
              1. Explore the <strong>Dashboard</strong> to check the status of
              all your vehicles.
            </p>
            <p>
              2. Locate your vehicle precisely on the
              <strong> Current Location</strong> page.
            </p>
            <p>
              3. Track your <strong>Vehicle's Route</strong> at any time.
            </p>
            <p>
              4. <strong>Share your Location</strong> easily with others.
            </p>
            <button
              onClick={() => {
                setCountStep(countStep - 1),
                  setExpandVehicles(false),
                  expandNestedLinks("analytics-and-summary");
              }}
              className="px-4 py-1.5 rounded-full shadow-md hover:shadow-lg bg-gradient text-primaryText float-left text-sm font-bold mt-4"
            >
              Back
            </button>
            <button
              onClick={() => {
                setCountStep(countStep + 1),
                  setExpandReports(true),
                  expandNestedLinks("reports");
              }}
              className="px-4 py-1.5 rounded-full shadow-md hover:shadow-lg bg-gradient text-primaryText float-right text-sm font-bold mt-4"
            >
              Next
            </button>
          </div>
        </>
      ) : countStep === 2 && isFirstLogin ? (
        <>
          <div className="absolute font-bold w-[40px] h-[40px] rounded-full flex justify-center items-center bg-[#FFD53E] right-0 top-[326px]">
            3
          </div>
          <div class="triangle absolute right-0 -mr-[22px] top-[321px]"></div>
          <div className="w-[250px] p-5 h-auto absolute right-0 -mr-[270px] bg-white top-[324px] rounded-[5px] text-[14px]">
            <div
              onClick={() => {
                setIsFirstLogin(false), setCountStep(8);
                dispatch(UPDATE_USER_NEW({ is_first_login: false }));
              }}
              className="float-right -mt-4 -me-4 cursor-pointer"
              title="Skip tour"
            >
              <CrossSVG />
            </div>
            <p>
              Check out the <strong>Reports</strong> on your vehicles in this
              section. From
              <strong> distance</strong> covered to <strong>engine </strong>
              details, we've got all the essential data you need.
            </p>
            <button
              onClick={() => {
                setCountStep(countStep - 1),
                  setExpandVehicles(true),
                  expandNestedLinks("vehicles");
              }}
              className="px-4 py-1.5 rounded-full shadow-md hover:shadow-lg bg-gradient text-primaryText float-left text-sm font-bold mt-4"
            >
              Back
            </button>
            <button
              onClick={() => {
                setCountStep(countStep + 1),
                  setExpandActivity(true),
                  expandNestedLinks("activity");
              }}
              className="px-4 py-1.5 rounded-full shadow-md hover:shadow-lg bg-gradient text-primaryText float-right text-sm font-bold mt-4"
            >
              Next
            </button>
          </div>
        </>
      ) : countStep === 3 && isFirstLogin ? (
        <>
          <div className="absolute font-bold w-[40px] h-[40px] rounded-full flex justify-center items-center bg-[#FFD53E] right-0 top-[371px]">
            4
          </div>
          <div class="triangle absolute right-0 -mr-[22px] top-[368px]"></div>
          <div className="w-[250px] p-5 h-auto absolute right-0 -mr-[270px] bg-white top-[371px] rounded-[5px] text-[14px]">
            <div
              onClick={() => {
                setIsFirstLogin(false), setCountStep(8);
                dispatch(UPDATE_USER_NEW({ is_first_login: false }));
              }}
              className="float-right -mt-4 -me-4 cursor-pointer"
              title="Skip tour"
            >
              <CrossSVG />
            </div>
            <p>
              Explore the <strong>Alert reports</strong> for your vehicles in
              this section. <strong>Customize</strong> your alerts to receive
              only the notifications you need, avoiding unnecessary emails and
              phone alerts.
            </p>
            <button
              onClick={() => {
                setCountStep(countStep - 1),
                  setExpandReports(true),
                  setExpandActivity(false);
                expandNestedLinks("reports");
              }}
              className="px-4 py-1.5 rounded-full shadow-md hover:shadow-lg bg-gradient text-primaryText float-left text-sm font-bold mt-4"
            >
              Back
            </button>
            <button
              onClick={() => {
                setCountStep(countStep + 1), setExpandActivity(false);
              }}
              className="px-4 py-1.5 rounded-full shadow-md hover:shadow-lg bg-gradient text-primaryText float-right text-sm font-bold mt-4"
            >
              Next
            </button>
          </div>
        </>
      ) : countStep === 4 && isFirstLogin ? (
        <>
          <div className="absolute font-bold w-[40px] h-[40px] rounded-full flex justify-center items-center bg-[#FFD53E] right-0 top-[517px]">
            5
          </div>
          <div class="triangle absolute right-0 -mr-[22px] top-[514px]"></div>
          <div className="w-[250px] p-5 h-auto absolute right-0 -mr-[270px] bg-white top-[517px] rounded-[5px] text-[14px]">
            <div
              onClick={() => {
                setIsFirstLogin(false), setCountStep(8);
                dispatch(UPDATE_USER_NEW({ is_first_login: false }));
              }}
              className="float-right -mt-4 -me-4 cursor-pointer"
              title="Skip tour"
            >
              <CrossSVG />
            </div>
            <p>
              Navigate to your <strong>Profile</strong> from here and make
              necessary changes whenever you need.
            </p>
            <button
              onClick={() => {
                setCountStep(countStep - 1),
                  setExpandActivity(true),
                  expandNestedLinks("activity");
              }}
              className="px-4 py-1.5 rounded-full shadow-md hover:shadow-lg bg-gradient text-primaryText float-left text-sm font-bold mt-4"
            >
              Back
            </button>
            <button
              onClick={() => {
                setIsFirstLogin(false),
                  setCountStep(8),
                  router.push("/user-profile");
              }}
              className="px-4 py-1.5 rounded-full shadow-md hover:shadow-lg bg-gradient text-primaryText float-right text-sm font-semibold mt-4 "
            >
              End
            </button>
          </div>
        </>
      ) : (
        ""
      )}
      {/* ALL TOOLTIPS FOR FIRST TIME USER (End) */}

      {/* WELCOME TOOLTIP FOR FIRST TIME USER (Start) */}
      <>
        <div
          className={`${
            countStep === null && isFirstLogin === true ? "block" : "hidden"
          } items-center justify-center w-[550px] h-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pb-10 rounded-xl bg-white shadow-lg z-[8000]`}
        >
          <div className="py-5 bg-[#FFD53E] rounded-t-xl">
            <p className="text-center text-[32px]">
              Welcome to Track My Vehicle!
            </p>
          </div>
          <div className="bg-white w-full h-full px-5 text-[18px]">
            <p className="text-center p-5">
              Get ready to discover our redesigned website. With a new
              user-friendly interface, navigating our platform becomes an
              intuitive and seamless experience.
            </p>
            <button
              onClick={() => {
                setIsFirstLogin(false), setCountStep(8);
                dispatch(UPDATE_USER_NEW({ is_first_login: false }));
              }}
              className="px-8 py-2.5 shadow-lg bg-gradient rounded-full bg-[#FFD53E] float-left text-sm font-bold mt-4"
            >
              Skip
            </button>
            <button
              onClick={() => {
                setCountStep(0);
              }}
              className="px-8 py-2.5 rounded-full shadow-lg bg-gradient float-right text-sm font-bold mt-4"
            >
              Start
            </button>
          </div>
        </div>
      </>
      {/* WELCOME TOOLTIP FOR FIRST TIME USER (End) */}
    </div>
  );
};

export default Sidebar;
