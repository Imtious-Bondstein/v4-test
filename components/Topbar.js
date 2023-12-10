"use client";

import React, { useEffect, useRef, useState } from "react";
import CreditCardIcon from "@/components/SVG/CreditCardIcon";
import CustomerSupportIcon from "@/components/SVG/CustomerSupportIcon";
import DarkModeIcon from "@/components/SVG/DarkModeIcon";
import FavoriteIcon from "@/components/SVG/FavoriteIcon";
import InformationIcon from "@/components/SVG/InformationIcon";
import NotificationIcon from "@/components/SVG/NotificationIcon";
// import DashboardLayout from "@/Layouts/DashboardLayout";
import userAvatar from "../public/images/user-avatar.png";
import Link from "next/link";

import { useRouter } from "next/router";
// dark mode credentials
// import { useTheme } from "next-themes";
import NotificationPanel from "./NotificationPanel";

//=========store
import { useSelector, useDispatch } from "react-redux";
import { fetchFavoriteLists, SET_FAVORITE } from "@/store/slices/favoriteSlice";
import axios from "@/plugins/axios";

import "../styles/pages/Home.css";

// background: white;
//     border-radius: 40px;
//     top: 16px;
//     box-shadow: 0px 4px 5px rgb(0 0 0 / 5%);

import dotenv from "dotenv";
import FavoriteIconListSVG from "./SVG/FavoriteIconListSVG";
import findUrlName from "@/utils/urlMapper";
import TriangleSVG from "./SVG/TriangleSVG";
import ProfileSVG from "./SVG/ProfileSVG";
import SwitchUserSVG from "./SVG/SwitchUserSVG";
import CrossSVG from "@/svg/CrossSVG";
dotenv.config();

const Topbar = ({ setIsFirstLogin, isFirstLogin, countStep, setCountStep }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [navbarScrolled, setNavbarScrolled] = useState(false);

  const favoriteLists = useRef([]);
  const isDispatched = useRef(false);

  const router = useRouter();

  // notification
  const [isOpenNotification, setIsOpenNotification] = useState(false);
  const [isOpenFavorite, setIsOpenFavorite] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  // ===== darkmode ======
  // const { systemTheme, theme, setTheme } = useTheme();

  //==========notification start
  const notificationRef = useRef(null);
  const [notificationData, setNotificationData] = useState([]);
  //==========notification end

  const favoriteRef = useRef(null);
  const [favoriteData, setFavoriteData] = useState([]);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(true);

  const [superAdminOptions, setSuperAdminOptions] = useState(false);
  const myRef = useRef();

  // =========store
  const dispatch = useDispatch();
  const { storeFavoriteLists, isStoreLoading } = useSelector(
    (state) => state.reducer.favorite
  );
  const user = useSelector((state) => state.reducer.auth.user);

  const handleSetFavorite = () => {
    const data = {
      page_name: router.pathname,
    };
    axios.post("/api/v4/analytics-summary/favourite-page", data).then((res) => {
      console.log(res.data.favorite_pages);
      setFavoriteData(res.data.favorite_pages);
      dispatch(SET_FAVORITE({ favorites: res.data.favorite_pages }));
      setIsFavorite(!isFavorite);
    });
    console.log("current route:-----", router.pathname);
  };

  // const currentTheme = theme === "system" ? systemTheme : theme;
  // const currentTheme = "dark";

  const changeBackground = () => {
    if (window.scrollY >= 70) {
      setNavbarScrolled(true);
    } else {
      setNavbarScrolled(false);
    }
  };
  const handleNotificationTrigger = () => {
    console.log("button clicked");
    // setIsOpenNotification(true);
    isOpenNotification === false
      ? setIsOpenNotification(true)
      : setIsOpenNotification(false);
  };

  // ========calculate unread notification
  // const unreadNotificationHandle = (notifications) => {
  //   const count = notifications.reduce((acc, notification) => {
  //     if (!notification.is_read) {
  //       return acc + 1;
  //     }
  //     return acc;
  //   }, 0);

  //   setUnreadNotificationCount(count);
  // };

  //===========notification method start

  // fetch notification data
  const fetchNotificationData = async () => {
    // setIsLoading(true);
    await axios
      .get("/api/v4/alert/get-alert?param=0")
      .then((res) => {
        // console.log("notification data", res.data);
        setNotificationData(res.data.data.data);
        setUnreadNotificationCount(res.data.total_unread);
      })
      .catch((err) => {
        console.log(err);
      });
    // .finally(() => setIsLoading(false));
  };

  const setMultipleNotificationRead = async () => {
    const data = {
      alert_id: "all",
    };

    await axios
      .post("/api/v4/alert/alert-update", data)
      .then((res) => {
        if (res.data.code === 200) {
          const updatedNotificationData = notificationData.map(
            (notification) => {
              return { ...notification, is_read: true };
            }
          );
          setNotificationData(updatedNotificationData);
        }

        console.log("update notification all------", res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //===========notification method end

  useEffect(() => {
    changeBackground();
    // adding the event when scroll change Logo
    window.addEventListener("scroll", changeBackground);
  });

  useEffect(() => {
    setMounted(true);
    fetchNotificationData();
    // set time 10 sec and call fetchNotificationData
    const interval = setInterval(() => {
      fetchNotificationData();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  //=============check favorite
  useEffect(() => {
    if (!storeFavoriteLists && !isStoreLoading && !isDispatched.current) {
      isDispatched.current = true;
      dispatch(fetchFavoriteLists());
    }
    if (!isStoreLoading && storeFavoriteLists) {
      favoriteLists.current = JSON.parse(JSON.stringify(storeFavoriteLists));
      setIsFavorite(favoriteLists.current.includes(router.pathname));
      setFavoriteData(JSON.parse(JSON.stringify(storeFavoriteLists)));
      setIsFavoriteLoading(isStoreLoading);
    }
  }, [isStoreLoading, router.pathname]);

  // useEffect(() => {
  //   console.log('Favorite list:----', storeFavoriteLists);
  // }, [router.pathname])

  //=========click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsOpenNotification(false);
        // setMultipleNotificationRead()
      }

      if (favoriteRef.current && !favoriteRef.current.contains(event.target)) {
        setIsOpenFavorite(false);
        // setMultipleNotificationRead()
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSwitchUser = () => {
    user.id === 1 && superAdminOptions === false
      ? setSuperAdminOptions(true)
      : setSuperAdminOptions(false);
  };

  // CLICK OUTSIDE =========================================================
  const handelClickOutside = (e) => {
    if (superAdminOptions === true && !myRef.current.contains(e.target)) {
      setSuperAdminOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handelClickOutside);
    return () => document.removeEventListener("mousedown", handelClickOutside);
  });

  return mounted ? (
    <div className={`${countStep === 4 ? "z-[8000]" : "z-[3000]"} relative`}>
      <div className="mr-0 md:mr-4 pt-[16px]">
        <div
          className={`flex items-center justify-end gap-x-6 p-4   ${
            navbarScrolled ? "bg-white rounded-[40px] md:shadow-md" : ""
          }`}
        >
          {/* favorite list start */}
          <div ref={favoriteRef} className="relative">
            <button
              className={`topbar-fav-btn text-sm md:border hover:border-[#ffa500] md:p-2 rounded-md md:bg-white flex justify-center items-center ${
                isOpenFavorite && "border-[#221d12]"
              }`}
              onClick={() => setIsOpenFavorite(!isOpenFavorite)}
            >
              <span className="md:mr-2.5">
                <FavoriteIconListSVG />
              </span>
              <span className="hidden md:block">My Favorites</span>
            </button>
            {isFirstLogin === true && countStep === 4 ? (
              <div className={`blur-filter_fav`}></div>
            ) : (
              ""
            )}
            {/* favorite lists */}
            {isOpenFavorite && (
              <div className="relative">
                <div className="absolute md:right-10 -right-1">
                  <TriangleSVG height={33} width={39} />
                </div>

                <div className="absolute top-[100%] md:right-0 -right-4 rounded-xl bg-white shadow-md overflow-hidden mt-6">
                  {isFavoriteLoading ? (
                    <p>Loading....</p>
                  ) : (
                    <div className="">
                      {favoriteData.map((route) => (
                        <div
                          key={route}
                          onClick={() => setIsOpenFavorite(false)}
                        >
                          <Link
                            href={route}
                            className=" text-[#6A7077] font-medium  px-4 py-2 flex items-center hover:fill-[#1E1E1E] hover:bg-primary hover:text-black whitespace-nowrap"
                          >
                            <p className="w-full">{findUrlName(route)}</p>
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* favorite list end */}
          {router.pathname !== "/analytics-and-summary" && (
            <button
              onClick={handleSetFavorite}
              className={`topbar-fav-btn flex text-sm md:border md:p-2 rounded-md md:bg-white ${
                isFavorite
                  ? "text-[#FF6B6B] border-[#FF6B6B]"
                  : "text-[#8D96A1] border-[#8D96A1]"
              } flex justify-center items-center duration-300 ease hover:scale-110`}
            >
              <span className="md:mr-2.5">
                <FavoriteIcon isFavorite={isFavorite} />
              </span>
              <span className="hidden md:block">Add to Favorites</span>
            </button>
          )}

          {/* <button className="hidden md:block cursor-all-scroll h-[29px]">
            <DarkModeIcon />
          </button> */}

          {/* <div className="h-[29px]">
            <button>
              <CreditCardIcon />
            </button>
          </div> */}

          <div ref={notificationRef} className="h-[29px]">
            <button
              className="relative"
              onClick={() => setIsOpenNotification(!isOpenNotification)}
            >
              {unreadNotificationCount ? (
                <div className="absolute -top-2 -right-1 text-[10px] font-bold text-black custom-grad rounded-full w-[22px] h-[22px] flex justify-center items-center">
                  <span>
                    {unreadNotificationCount > 99
                      ? "99+"
                      : unreadNotificationCount}
                  </span>
                </div>
              ) : (
                ""
              )}
              <NotificationIcon />
            </button>
            {/* notifications */}
            {isOpenNotification && (
              <div className="absolute right-0 top-20">
                <NotificationPanel
                  notificationData={notificationData}
                  setIsOpenNotification={setIsOpenNotification}
                  unreadNotificationCount={unreadNotificationCount}
                  setUnreadNotificationCount={setUnreadNotificationCount}
                />
              </div>
            )}
          </div>

          <div className="hidden md:block h-[29px]">
            <a href="tel:+8809639595959">
              <CustomerSupportIcon />
            </a>
          </div>

          {/* <div className="hidden md:block h-[29px]">
            <button>
              <InformationIcon />
            </button>
          </div> */}

          <div ref={myRef}>
            {user.id === 1 ? (
              <button
                onClick={() => (user.id === 1 ? handleSwitchUser() : "")}
                className="topbar-profile rounded-full bg-gradient p-0.5 overflow-hidden"
              >
                {user.image ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/assets/user/${user.image}`}
                    className="w-full rounded-full "
                  />
                ) : (
                  <img src={userAvatar.src} className="w-full rounded-full " />
                )}
              </button>
            ) : (
              <Link href="/user-profile">
                <button className="topbar-profile rounded-full bg-gradient p-0.5 overflow-hidden">
                  {user.image ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/assets/user/${user.image}`}
                      className="w-full rounded-full "
                    />
                  ) : (
                    <img
                      src={userAvatar.src}
                      className="w-full rounded-full "
                    />
                  )}
                  {/* BLUR PROFILE BASED ON FIRST TIME USER ========================================== */}
                  {countStep === 4 || isFirstLogin === false ? (
                    ""
                  ) : (
                    <div
                      className={`blur-filter_profile w-full rounded-full`}
                    ></div>
                  )}
                  {/* BLUR PROFILE BASED ON FIRST TIME USER */}

                  {/* TOOLTIP FOR FIRST TIME USER  ====================================================*/}
                  {countStep === 4 && isFirstLogin ? (
                    <>
                      <div className="absolute font-bold w-[40px] h-[40px] rounded-full flex justify-center items-center bg-[#FFD53E] right-12 top-[70px]">
                        6
                      </div>
                      <div class="triangle_profile absolute right-0 mr-28 top-[95px]"></div>
                      <div className="w-[250px] p-5 h-auto absolute right-0 mr-28 bg-white top-[80px] rounded-[5px] text-[14px]">
                        <div
                          onClick={() => {
                            setIsFirstLogin(false), setCountStep(8);
                          }}
                          className="float-right -mt-4 -me-4 cursor-pointer"
                        >
                          <CrossSVG />
                        </div>
                        <p>
                          Navigate to your <strong>Profile</strong> from here
                          and make necessary changes whenever you need.
                        </p>
                      </div>
                    </>
                  ) : (
                    ""
                  )}

                  {/* TOOLTIP FOR FIRST TIME USER */}
                </button>
              </Link>
            )}

            {/* SUPERADMIN OPTION FOR SWITCH USER & PROFILE =========================================== */}
            {superAdminOptions === true ? (
              <>
                <div className="flex justify-center absolute right-4 md:right-9">
                  <div className="">
                    <TriangleSVG height={23} width={29} />
                  </div>
                </div>
                <div
                  className={` bg-white shadow-lg p-3 rounded-xl absolute right-0 md:right-7 mt-4 text-sm`}
                >
                  <Link href="/user-profile">
                    <div className="flex items-center space-x-2 min-w-[130px] py-2 border-b duration-300 group">
                      <ProfileSVG />
                      <p>Profile</p>
                    </div>
                  </Link>
                  <Link href="/impersonate">
                    <div className="flex items-center space-x-2 w-[130px] py-2 duration-300 group">
                      <SwitchUserSVG />
                      <p>Switch User</p>
                    </div>
                  </Link>
                </div>
              </>
            ) : (
              ""
            )}
            {/* SUPERADMIN OPTION FOR SWITCH USER & PROFILE */}
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default Topbar;
