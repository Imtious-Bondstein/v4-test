import Search from "@/svg/SearchSVG";
import React, { useEffect, useRef, useState } from "react";
import DownloadSVG from "../SVG/DownloadSVG";
import { CSVLink } from "react-csv";
import DeleteSVG from "../SVG/table/DeleteSVG";
import Tik from "@/svg/TikSVG";
import MapTableSVG from "../SVG/table/MapTableSVG";
import CarTableSVG2 from "../SVG/table/CarTableSVG2";
import EditTableSVG from "../SVG/table/EditTableSVG";
import DeleteTableSVG2 from "../SVG/table/DeleteTableSVG2";
import CustomToolTip from "../CustomToolTip";

import "../../styles/globals.css";
import NotificationTableMarkAsReadSVG from "../SVG/table/NotificationTableMarkAsReadSVG";
import NotificationTableDeleteSVG from "../SVG/table/NotificationTableDeleteSVG";
import NotificationTableDeleteSVG2 from "../SVG/table/NotificationTablArchiveSVG";
import NotificationTableCheckedSVG from "../SVG/table/NotificationTableCheckedSVG";
import NotificationTablArchiveSVG from "../SVG/table/NotificationTablArchiveSVG";
import NotificationTableUnCheckedSVG from "../SVG/table/NotificationTableUnCheckedSVG";
import axios from "@/plugins/axios";
import SearchSVG from "../SVG/SearchSVG";
import CrossSVG from "@/svg/CrossSVG";
import ReloadSVG from "../SVG/modal/ReloadSVG";

const NotificationTable = ({
  isLoading,
  setIsLoading,
  setSearchKey,
  searchKey,
  notificationData,
  offset,
  handleReload,
}) => {
  const [data, setData] = useState([]);
  const myRef = useRef();

  const [isAllRowSelected, setIsAllRowSelected] = useState(false);

  // ALL ROW SELECTION ==============================================
  const clickAllRowSelect = () => {
    const newState = data.map((notification) => {
      if (!isAllRowSelected) {
        return { ...notification, checkbox: true };
      } else {
        return { ...notification, checkbox: false };
      }
    });
    setData(newState);
  };

  // SINGLE ROW SELECTION ==================================================
  const handleSingleRowSelect = (sl) => {
    const singleSelectRow = data.find((item) => item.sl === sl);
    singleSelectRow.checkbox === true
      ? (singleSelectRow.checkbox = false)
      : (singleSelectRow.checkbox = true);
    setData([...data]);
  };

  // ===== search notification =====
  const searchNotifications = async () => {
    setIsLoading(true);
    await axios
      .get(`/api/v4/alert/search-alert?param=0&search_param=${searchKey}`)
      .then((res) => {
        console.log("notification search data", res.data.data);
        // initNotifications(res.data.data.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // ======== multiple Notification update ========
  const multipleNotificationsRequest = async (updateType) => {
    const selectedNotification = data.filter((item) => item.checkbox === true);
    const markedNotification = selectedNotification
      .map((items) => {
        return items.id;
      })
      .join(",");

    const requestData = { alert_id: markedNotification, param: updateType };

    console.log("multi request data", requestData);

    if (selectedNotification.length) {
      await axios
        .post("/api/v4/alert/alert-update", requestData)
        .then((res) => {
          console.log("multiple notification res:", res);
          stateUpdateMultiple(selectedNotification, updateType);
        })
        .catch((err) => {
          console.log("multiple notification err :", err);
        });
    }
  };

  // ======== single Notification update ========
  const singleNotificationRequest = async (id, updateType) => {
    const requestData = { alert_id: id, param: updateType };

    console.log("single request data", requestData);

    await axios
      .post("/api/v4/alert/alert-update", requestData)
      .then((res) => {
        console.log("single notification res:", res);
        stateUpdateSingle(id, updateType);
      })
      .catch((err) => {
        console.log("single notification err :", err);
      });
  };

  // ======== state update for multiple ========
  const stateUpdateMultiple = (selectedItems, updateType) => {
    if (updateType === "read") {
      const updatedData = data.map((dataItem) => {
        const findSelectedItem = selectedItems.find(
          (selected) => selected.id === dataItem.id
        );
        if (findSelectedItem) {
          return {
            ...dataItem,
            is_read: true,
          };
        } else {
          return dataItem;
        }
      });
      console.log("read update : ", updatedData);
      setData(updatedData);
    } else if (updateType === "unread") {
      const updatedData = data.map((dataItem) => {
        const findSelectedItem = selectedItems.find(
          (selected) => selected.id === dataItem.id
        );
        if (findSelectedItem) {
          return {
            ...dataItem,
            is_read: false,
          };
        } else {
          return dataItem;
        }
      });
      console.log("unread update : ", updatedData);
      setData(updatedData);
    } else {
      const updatedData = data.filter((dataItem) => {
        const findSelectedItem = selectedItems.find(
          (selected) => selected.id === dataItem.id
        );
        return !findSelectedItem;
      });
      console.log("archive update : ", updatedData);
      setData(updatedData);
    }
  };

  // ======== state update for single ========
  const stateUpdateSingle = (id, updateType) => {
    if (updateType === "read") {
      console.log("single read : ", id, updateType);

      const selectedNotification = data.find((item) => item.id === id);
      selectedNotification.is_read = true;

      setData([...data]);
    } else {
      console.log("single archive : ", id, updateType);
      const updatedData = data.filter((dataItem) => {
        return dataItem.id !== id;
      });

      setData(updatedData);
    }
  };

  // ==== skeleton
  const divCount = offset;
  const skeletonDiv = [];

  for (let i = 0; i < divCount; i++) {
    skeletonDiv.push(
      <div
        key={i}
        className="h-[80px] w-full border-4 skeleton-border rounded-xl p-2 mt-3"
      >
        <div className="h-full skeleton rounded-xl"></div>
      </div>
    );
  }

  useEffect(() => {
    const allSelected = data.every((notification) => notification.checkbox);
    allSelected ? setIsAllRowSelected(true) : setIsAllRowSelected(false);
  }, [data]);

  // useEffect(() => {
  //   console.log("all notification data", notificationData);
  //   setData(notificationData);
  // }, [notificationData]);

  // HANDLE DROPDOWN DATA FOR MOBILE DEVICE ================================
  const handleDropDownData = (bst_id) => {
    const newState = data?.map((vehicle) => {
      if (vehicle.bst_id === bst_id) {
        return {
          ...vehicle,
          displayDropdownInfo: !vehicle.displayDropdownInfo,
        };
      }
      return vehicle;
    });
    setData(newState);
  };

  const initData = () => {
    const newState = notificationData.map((item, index) => ({
      ...item,
      displayDropdownInfo: false,
    }));
    setData(newState);
  };

  useEffect(() => {
    initData();
  }, [notificationData]);

  // CLICK OUTSIDE ==========================================================
  const handelClickOutside = (e) => {
    if (!myRef.current.contains(e.target)) {
      const newState = data.map((vehicle) => {
        return { ...vehicle, displayDropdownInfo: false };
      });
      setData(newState);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handelClickOutside);
    return () => document.removeEventListener("mousedown", handelClickOutside);
  });

  return (
    <div className="geofence-table">
      {/* PAGE TITLE */}
      <div className="flex items-center justify-between pb-7 md:pb-7">
        <h1 className="text-[#1E1E1E] text-xl md:text-[32px] font-bold mt-6 md:mt-0 md:pt-5">
          Notifications
        </h1>
      </div>

      {/* SEARCH-BAR & BUTTONS */}
      <div className="flex flex-col-reverse lg:flex-row items-end lg:items-center justify-center md:justify-between lg:pb-6 -mb-10 lg:mb-0 lg:gap-4">
        {/* Search-bar */}
        <label className="relative block w-full lg:w-[387px] h-[42px] md:h-[56px] bg-white rounded-xl -top-16 lg:top-0">
          <input
            onChange={(e) => setSearchKey(e.target.value)}
            value={searchKey}
            className="w-full h-full px-5 rounded-xl outline-[#FDD10E] text-sm text-[#8D96A1] font-normal"
            placeholder="Search"
            type="text"
            name="search"
          />
          <span className="absolute inset-y-0 right-5 flex items-center">
            {searchKey ? (
              <span onClick={() => setSearchKey("")} className="cursor-pointer">
                <CrossSVG />
              </span>
            ) : (
              <SearchSVG />
            )}
          </span>
        </label>

        {/* Buttons */}
        <div className="flex items-end lg:items-center justify-end gap-2 xs:gap-4 mb-6 lg:mb-0 relative lg:static -top-16 lg:-top-20 xl:top-0 mt-1.5 xs:mt-0">
          <button
            onClick={() => handleReload()}
            className="flex justify-center items-center space-x-2 rounded-[12px] w-[32px] h-[32px] xs:w-[42px] lg:w-[110px] xs:h-[42px] lg:h-[57px] bg-[#e7ecf3] group hover:bg-[#1E1E1E] hover:shadow-xl"
          >
            <div className=" group-hover:fill-[#e7ecf3] fill-[#1E1E1E] group-hover:animate-spinLeftOne">
              <ReloadSVG />
            </div>
            <span className="group-hover:text-[#e7ecf3] text-[#1E1E1E] hidden lg:block">
              Reload
            </span>
          </button>

          <button
            onClick={() => multipleNotificationsRequest("read")}
            className={`fill-[#1E1E1E] flex items-center justify-center gap-3 px-4text-sm bg-[#FDD10E] text-[#1E1E1E] rounded-[12px] w-[32px] h-[32px] xs:w-[42px] lg:w-[190px] xs:h-[42px] lg:h-[56px] primary-shadow hover:shadow-xl hover:shadow-primary/60 tmv duration-300 `}
          >
            <NotificationTableUnCheckedSVG />
            <p className="hidden lg:block mt-0.5">Mark as Read</p>
          </button>
          <button
            onClick={() => multipleNotificationsRequest("unread")}
            className={`fill-[#1E1E1E] flex items-center justify-center gap-3 px-4text-sm bg-[#FDD10E] text-[#1E1E1E] rounded-[12px] w-[32px] h-[32px] xs:w-[42px] lg:w-[190px] xs:h-[42px] lg:h-[56px] primary-shadow hover:shadow-xl hover:shadow-primary/60 duration-300`}
          >
            <NotificationTableCheckedSVG />
            <p className="hidden lg:block">Mark as Unread</p>
          </button>
          <button
            onClick={() => multipleNotificationsRequest("archive")}
            className={`fill-[#1E1E1E] flex items-center justify-center gap-3 px-4text-sm bg-[#FDD10E] text-[#1E1E1E] rounded-[12px] w-[32px] h-[32px] xs:w-[42px] lg:w-[130px] xs:h-[42px] lg:h-[56px] primary-shadow hover:shadow-xl hover:shadow-primary/60 duration-300`}
          >
            <NotificationTablArchiveSVG stroke={"black"} />
            <p className="hidden lg:block text-sm">Archive</p>
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-[20px] overflow-hidden">
        <div className="p-2 sm:p-[15px] overflow-x-auto bg-white  rounded-[20px] h-[65vh]">
          {isLoading ? (
            <div className="w-full">{skeletonDiv}</div>
          ) : (
            <table className="md:min-w-[1400px] w-full">
              <thead className="bg-[#FFFAE6] h-[70px] rounded-md">
                <tr className="">
                  {/* SL */}
                  <th className="text-left px-5 rounded-l-[10px] text-[#1E1E1E] text-base ms:text-lg font-bold hidden md:table-cell">
                    Sl.
                  </th>

                  {/* CHECKBOX */}
                  <th className="text-left px-5  text-[#1E1E1E] text-base font-bold rounded-md md:rounded-none">
                    <div className="flex items-center space-x-2 relative">
                      <div
                        onClick={() => clickAllRowSelect()}
                        className="w-5 h-5 md:w-6 md:h-6 rounded tmv-shadow bg-white flex justify-center items-center z-10 cursor-pointer"
                      >
                        {isAllRowSelected === true ? <Tik /> : ""}
                      </div>
                      <p className="pb-0 mb-0 md:hidden">Select All</p> &nbsp;
                    </div>
                  </th>

                  {/* TIME */}
                  <th className="text-left px-5 text-[#1E1E1E] text-base ms:text-lg font-bold hidden md:table-cell">
                    Time
                  </th>

                  {/* SUBJECT */}
                  <th className="text-left  px-5 text-[#1E1E1E]text-base ms:text-lg font-bold hidden md:table-cell">
                    Subject
                  </th>

                  {/* MESSAGE */}
                  <th className=" text-left px-5 text-[#1E1E1E] text-base ms:text-lg font-bold hidden md:table-cell">
                    Message
                  </th>
                  {/* ACTION BUTTONS */}
                  <th className="rounded-r-[10px] text-left px-5 text-[#1E1E1E] text-base font-bold hidden md:table-cell">
                    {" "}
                  </th>
                </tr>
              </thead>

              <tbody ref={myRef} className="rounded-xl">
                {data.map(
                  ({
                    sl,
                    id,
                    checkbox,
                    time,
                    notification_head,
                    notification_msg,
                    is_read,
                    bst_id,
                    displayDropdownInfo,
                  }) => {
                    return (
                      <tr
                        key={id}
                        className={`relative h-[45px] md:h-[81px] ${
                          is_read
                            ? "bg-white font-normal"
                            : "bg-secondary font-bold "
                        }
                      }`}
                      >
                        {/* SL */}
                        <td className="rounded-l-[10px] px-5 text-base text-[#48525C] hidden md:table-cell">
                          {/* {index + 1} */}
                          {sl}
                        </td>

                        {/* CHECKBOX */}
                        <td className="px-5 text-base text-primaryText hidden md:table-cell">
                          <div className="flex relative">
                            <div
                              onClick={() => handleSingleRowSelect(sl)}
                              className="w-6 h-6 rounded tmv-shadow bg-white flex justify-center items-center z-10 cursor-pointer"
                            >
                              {checkbox === true ? <Tik /> : ""}
                            </div>
                          </div>
                        </td>

                        {/* TIME */}
                        <td className="p-5 md:py-0 text-base text-primaryText hidden md:table-cell">
                          {time}
                        </td>

                        {/* SUBJECT */}
                        <td className="px-5 py-3 text-base text-primaryText">
                          {notification_head ? (
                            <div>
                              <div className="flex items-center space-x-2">
                                {/* CHECKBOX FOR MOBILE */}
                                <div className="flex relative md:hidden">
                                  <div
                                    onClick={() => handleSingleRowSelect(sl)}
                                    className="w-4 h-4 rounded tmv-shadow bg-white flex justify-center items-center z-10 cursor-pointer"
                                  >
                                    {checkbox === true ? <Tik /> : ""}
                                  </div>
                                </div>
                                <div
                                  onClick={() => handleDropDownData(bst_id)}
                                  className="flex items-center"
                                >
                                  <p className="text-[12px] font-bold text-[#6A7077] md:text-base md:hidden">
                                    Subject&nbsp;:&nbsp;
                                  </p>
                                  <p className="text-[12px] text-[#6A7077] md:text-primaryText md:text-base">
                                    {notification_head}
                                  </p>
                                </div>
                              </div>
                              {/* TABLE DETAILS FOR SMALL DEVICE */}
                              <div
                                className={`${
                                  displayDropdownInfo === true
                                    ? "h-[160px] xs:h-[140px] sm:h-[120px]"
                                    : "h-0"
                                } duration-500 ease-in-out overflow-hidden md:hidden`}
                              >
                                {/* TIME */}
                                <div className="flex items-center mt-1">
                                  <p className="text-[12px] font-normal text-[#6A7077] md:text-base md:hidden">
                                    Time&nbsp;:&nbsp;
                                  </p>
                                  <p className="text-[12px] font-normal text-[#6A7077] md:text-base">
                                    {time}
                                  </p>
                                </div>
                                {/* MESSAGE */}
                                <div className="flex items-center mt-1">
                                  <p className="text-[12px] font-normal text-[#6A7077] md:text-base md:hidden">
                                    Message&nbsp;:&nbsp;
                                  </p>
                                  <p className="text-[12px] font-normal text-[#6A7077] md:text-base">
                                    {notification_msg}
                                  </p>
                                </div>
                                {/* ACTIONS */}
                                <div className="flex items-center mt-1">
                                  <p className="text-[12px] font-normal text-[#6A7077] md:text-base md:hidden">
                                    Actions&nbsp;:&nbsp;
                                  </p>
                                  <div className="flex space-x-2">
                                    <button
                                      className="flex justify-center items-center w-[28px] h-[28px] rounded-full bg-[#1DD1A1] hover:bg-[#0dc795]"
                                      onClick={() =>
                                        singleNotificationRequest(id, "read")
                                      }
                                    >
                                      <NotificationTableMarkAsReadSVG />
                                    </button>
                                    <button
                                      className="flex justify-center items-center w-[28px] h-[28px] rounded-full bg-[#FDD10E] hover:bg-[#eec617] duration-300 ease-in-out"
                                      onClick={() =>
                                        singleNotificationRequest(id, "archive")
                                      }
                                    >
                                      <NotificationTablArchiveSVG
                                        stroke={"white"}
                                      />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                        </td>

                        {/* MESSAGE */}
                        <td className="px-5 text-base text-primaryText hidden md:table-cell">
                          {notification_msg}
                        </td>

                        {/* ACTION BUTTONS */}
                        <td className="rounded-r-[10px] px-5 text-base hidden md:table-cell">
                          <div className="flex space-x-5">
                            <button
                              className="flex justify-center items-center w-[35px] h-[35px] rounded-full bg-[#1DD1A1] hover:bg-[#0dc795] duration-300"
                              onClick={() =>
                                singleNotificationRequest(id, "read")
                              }
                            >
                              <NotificationTableMarkAsReadSVG />
                            </button>
                            <button
                              className="flex justify-center items-center w-[35px] h-[35px] rounded-full bg-[#FDD10E] hover:bg-[#eec617] duration-300 ease-in-out"
                              onClick={() =>
                                singleNotificationRequest(id, "archive")
                              }
                            >
                              <NotificationTablArchiveSVG stroke={"white"} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationTable;
