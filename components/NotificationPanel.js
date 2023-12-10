import React, { useEffect, useMemo, useRef, useState } from "react";
import "../styles/components/notification.css";
import Search from "@/svg/SearchSVG";
import { notificationDate, notificationTime } from "@/utils/dateTimeConverter";
import DoubleTikSVG from "./SVG/DoubleTikSVG";
import TriangleSVG from "./SVG/TriangleSVG";
import CrossSVG from "@/svg/CrossSVG";
import SearchSVG from "./SVG/SearchSVG";
import CloseSVG from "./SVG/CloseSVG";
import Link from "next/link";
import axios from "@/plugins/axios";
import { async } from "regenerator-runtime";

const NotificationPanel = ({
  notificationData,
  setIsOpenNotification,
  unreadNotificationCount,
  setUnreadNotificationCount,
}) => {
  const [searchKey, setSearchKey] = useState("");

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1
  );
  const [notifications, setNotifications] = useState([]);
  const [isNotificationLoading, setNotificationIsLoading] = useState(false);

  // const clearSearchField = () => {
  //   console.log("ddd");
  //   setSearchKey(" ");
  // };

  const initNotifications = (data) => {
    const notifications = data.reduce((pre, item) => {
      const date = new Date(item.time);
      const isToday = date >= todayStart;
      const isYesterday = date >= yesterdayStart && date < todayStart;
      const isPast = date < yesterdayStart;
      let group;
      if (isToday) {
        group = "Today";
      } else if (isYesterday) {
        group = "Yesterday";
      } else if (isPast) {
        group = "Past";
      }
      if (group) {
        const existingGroup = pre.find((g) => g.group === group);
        if (existingGroup) {
          existingGroup.notifications.push(item);
        } else {
          pre.push({ group, notifications: [item] });
        }
      }
      return pre;
    }, []);

    setNotifications(notifications);
  };

  // search  notification
  const filteredNotifications = useMemo(() => {
    return notifications.map((group) => {
      return {
        group: group.group,
        notifications: group.notifications.filter((notification) => {
          return (
            notification &&
            notification.notification_head &&
            notification.notification_head
              .toString()
              .toLowerCase()
              .includes(searchKey.toLowerCase())
          );
        }),
      };
    });
  }, [notifications, searchKey]);

  const searchNotifications = async () => {
    await axios
      .get(`/api/v4/alert/search-alert?param=0&search_param=${searchKey}`)
      .then((res) => {
        console.log("notification search data", res.data.data.data);
        initNotifications(res.data.data.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setNotificationIsLoading(false);
      });
  };

  // search notification backend

  // set single notification read & unread
  const setSingleNotificationUpdate = async (notification) => {
    const data = {
      alert_id: notification.id,
      param: notification.is_read ? "unread" : "read",
    };

    await axios
      .post("/api/v4/alert/alert-update", data)
      .then((res) => {
        if (res.data.code === 200) {
          const updatedNotificationData = notifications.map((group) => {
            const updatedGroup = group.notifications.map((item) => {
              if (item.id === notification.id) {
                return { ...item, is_read: !notification.is_read };
              }
              return item;
            });
            return { ...group, notifications: updatedGroup };
          });
          setNotifications(updatedNotificationData);
          //========update unread notification count
          notification.is_read
            ? setUnreadNotificationCount(unreadNotificationCount + 1)
            : setUnreadNotificationCount(unreadNotificationCount - 1);
        }

        console.log("update notification------", res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // set multiple notification read
  const setMultipleNotificationRead = async () => {
    const data = {
      alert_id: "all",
      param: "read",
    };

    await axios
      .post("/api/v4/alert/alert-update", data)
      .then((res) => {
        if (res.data.code === 200) {
          const updatedNotificationData = notifications.map((group) => {
            const updatedGroup = group.notifications.map((item) => {
              return { ...item, is_read: true };
            });
            return { ...group, notifications: updatedGroup };
          });
          setNotifications(updatedNotificationData);
          //========update unread notification count
          setUnreadNotificationCount(0);
        }

        console.log("update notification all------", res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (!searchKey.length) {
      initNotifications(notificationData);
      setNotificationIsLoading(false);
    }
  }, [notificationData, searchKey]);

  useEffect(() => {
    console.log("search key", searchKey.length);
    //call search notification if search key is not empty but call in a set time out 2 sec
    if (searchKey && searchKey.length > 0) {
      setNotificationIsLoading(true);
      const delayDebounceFn = setTimeout(() => {
        searchNotifications();
      }, 2000);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchKey]);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-[100%] sm:w-[482px] p-6 bg-white rounded-[20px] notification-shadow mt-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <button
          className=" fill-[#C9D1DA] hover:fill-quaternary absolute top-10 right-4"
          onClick={() => setIsOpenNotification(false)}
        >
          <CloseSVG />
        </button>
        <div className="flex justify-center absolute top-0 right-14 md:right-[143px] mr-1.5 md:-mr-1">
          <div className="">
            <TriangleSVG height={43} width={49} />
          </div>
        </div>
        {/* ======= search ======= */}
        <div className="mt-4 relative ">
          <div className="absolute top-4 right-4">
            {searchKey ? (
              <span onClick={() => setSearchKey("")} className="cursor-pointer">
                <CrossSVG />
              </span>
            ) : (
              <SearchSVG />
            )}
          </div>
          <input
            onChange={(e) => setSearchKey(e.target.value)}
            value={searchKey}
            className="py-[18px] px-6 text-sm rounded-lg w-full  tmv-shadow placeholder:text-tertiaryText outline-quaternary"
            placeholder="Search Notification"
            type="text"
          />

          {/* =============data========= */}
          <div className="mt-6 h-[350px] sm:[400px] overflow-y-scroll scrollGray">
            {notifications.length ? (
              <>
                {notifications.map((group) => (
                  <div className=" mr-4" key={group.group}>
                    <h2 className="font-bold text-tertiary">{group.group}</h2>
                    <hr className="my-2" />
                    {!isNotificationLoading ? (
                      <ul>
                        {group.notifications.map((notification) => (
                          <li
                            className={`mb-2.5 rounded-[10px] p-4 cursor-pointer ${
                              !notification.is_read
                                ? "bg-secondary"
                                : "bg-[#fafafa]"
                            }`}
                            key={notification.id}
                            onClick={() =>
                              setSingleNotificationUpdate(notification)
                            }
                          >
                            <p
                              className={`text-sm font-bold mb-[10px] ${
                                !notification.is_read
                                  ? "text-quaternary"
                                  : "text-tertiaryText"
                              }`}
                            >
                              {/* Name: {notification.name}-{notification.color}-
                        {notification.type} - BSTID: {notification.BSTID} */}
                              {notification.notification_head}
                            </p>
                            <p
                              className={`text-sm ${
                                !notification.is_read
                                  ? "text-black"
                                  : "text-tertiary"
                              }`}
                            >
                              {notification.notification_msg}
                            </p>
                            <p
                              className={`text-sm text-right ${
                                !notification.is_read
                                  ? "text-black"
                                  : "text-[#48525C]"
                              }`}
                            >
                              <span>
                                {group.group !== "Past"
                                  ? group.group
                                  : notificationDate(notification.time)}
                              </span>
                              <span className="ml-2">
                                {notificationTime(notification.time)}
                              </span>
                            </p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <>
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <div
                              key={i}
                              className="p-2 border-4 skeleton-border h-28 w-full rounded-[10px] mb-2.5"
                            >
                              <div className="skeleton h-full rounded-[10px]"></div>
                            </div>
                          ))}
                      </>
                    )}
                  </div>
                ))}
              </>
            ) : (
              <p className="text-center text-sm text-tertiary">
                No Notification Found
              </p>
            )}
          </div>

          {/* ========button====== */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={setMultipleNotificationRead}
              className="flex items-center space-x-2"
            >
              <DoubleTikSVG />
              <span className="text-tertiaryText text-sm font-semibold hover:text-black duration-300">
                Mark as all read
              </span>
            </button>
            <Link
              href="/notifications"
              onClick={() => setIsOpenNotification(false)}
            >
              <button className="bg-primary rounded-xl py-2.5 px-3 sm:px-6 text-sm shadow-md shadow-primary/50 hover:shadow-xl hover:shadow-primary/60 duration-300">
                All Notifications
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;
