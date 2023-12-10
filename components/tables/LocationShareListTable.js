import React, { useEffect, useRef, useState } from "react";
import SearchSVG from "../SVG/SearchSVG";
import EditTableSVG from "../SVG/table/EditTableSVG";
import UpdateShareCurrentLocationModal from "../modals/UpdateShareCurrentLocationModal";
import {
  locationShareListDateTime,
  shareLinkDateTime,
  shareLinkDateTimeCheck,
  shareLinkDateTimeTest,
} from "@/utils/dateTimeConverter";
import EditTableMobileSVG from "../SVG/table/EditTableMobileSVG";
import CrossSVG from "@/svg/CrossSVG";
import { async } from "regenerator-runtime";
import axios from "@/plugins/axios";

const LocationShareListTable = ({
  isLoading,
  setIsLoading,
  setSearchKey,
  searchKey,
  locationShareData,
  offset,
}) => {
  const [data, setData] = useState([]);
  const myRef = useRef();
  const [shareCurrentLocationModalIsOpen, setShareCurrentLocationModalIsOpen] =
    useState(false);
  const [selectedVehicles, setSelectedVehicles] = useState([]);

  const [isBack, setIsBack] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [linkExpireTime, setLinkExpireTime] = useState(null);
  const [sharedID, setSharedID] = useState(null);

  const toggleClass = " transform translate-x-3";

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

  // HANDLE ACTIVE STATUS ================================================
  const handleActiveStatus = async (id, expireTime, time, selectedData) => {
    const updateData = data.map((singleData) => {
      if (singleData.id === id) {
        if (
          time === true &&
          singleData.active_status === false &&
          expireTime === true
        ) {
          handleModal(selectedData);
        } else if (expireTime === true) {
          handleModal(selectedData);
        }

        const body = {
          shared_id: id,
          active_status: `${singleData.active_status === true ? "0" : "1"}`,
        };
        console.log("Body Data", body);

        axios
          .post(`/api/v4/shared-token/update`, body)
          .then((res) => {
            console.log("Token Data", res);
            setLinkExpireTime(res.data.expires_at);
            setGeneratedLink(
              `${clientBaseURL}/location/share-current-location?access=${res.data.token}`
            );
          })
          .then(() => {
            startSharing();
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => setIsLoading(false));
        return { ...singleData, active_status: !singleData.active_status };
      } else {
        return singleData;
      }
    });

    setData(updateData);
    console.log(updateData, "Updated data=====================");
  };

  // MODAL ===============================================================
  const handleModal = (data) => {
    setShareCurrentLocationModalIsOpen(true);
    setIsBack(false);
    setSelectedDuration(null);
    setSelectedVehicles(data);
  };

  // HANDLE DROPDOWN DATA FOR MOBILE DEVICE ================================
  const handleDropDownData = (id) => {
    const newState = data?.map((vehicle) => {
      if (vehicle.id === id) {
        return {
          ...vehicle,
          displayDropdownInfo: !vehicle.displayDropdownInfo,
        };
      }
      return vehicle;
    });
    setData(newState);
  };

  // INIT DATA (ADDED "displayDropdownInfo") ===============================
  const initData = () => {
    const newState = locationShareData.map((item, index) => ({
      ...item,
      displayDropdownInfo: false,
    }));
    setData(newState);
  };

  // CLICK OUTSIDE STARTS ==========================================================
  const handelClickOutside = (e) => {
    if (myRef.current !== null && !myRef.current.contains(e.target)) {
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
  // CLICK OUTSIDE ENDS ============================================================

  useEffect(() => {
    initData();
  }, [locationShareData]);

  return (
    <div>
      <UpdateShareCurrentLocationModal
        selectedVehicles={selectedVehicles}
        setShareCurrentLocationModalIsOpen={setShareCurrentLocationModalIsOpen}
        shareCurrentLocationModalIsOpen={shareCurrentLocationModalIsOpen}
        isBack={isBack}
        setIsBack={setIsBack}
        selectedDuration={selectedDuration}
        setSelectedDuration={setSelectedDuration}
        linkExpireTime={linkExpireTime}
        setLinkExpireTime={setLinkExpireTime}
        sharedID={sharedID}
        setSharedID={setSharedID}
      />
      {/* PAGE TITLE */}
      <div className="flex items-center justify-between pb-4 md:pb-6">
        <h1 className="text-[#1E1E1E] text-lg md:text-[32px] font-bold md:mt-0 md:pt-5">
          Location Share List
        </h1>
      </div>

      {/* SEARCH-BAR & BUTTONS */}
      <div className="pb-4 md:pb-6 ">
        {/* Search-bar */}
        <label className="relative block w-full lg:w-[387px] h-[42px] sm:h-[48px] bg-white rounded-xl">
          <input
            onChange={(e) => setSearchKey(e.target.value)}
            value={searchKey}
            className="w-full h-full px-5 rounded-xl outline-quaternary text-sm text-[#8D96A1] font-normal"
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
      </div>

      {/* TABLE */}
      <div className="rounded-[20px] overflow-hidden">
        <div className="p-2 sm:p-[15px] overflow-x-auto bg-white  rounded-[20px] h-[65vh]">
          {isLoading ? (
            <div className="w-full">{skeletonDiv}</div>
          ) : (
            <table className="md:min-w-[1400px] w-full">
              <thead className="bg-[#FFFAE6] h-[70px] rounded-md hidden md:table-header-group">
                <tr className="">
                  {/* SL */}
                  <th className="text-left px-5 rounded-l-[10px] text-[#1E1E1E] text-base ms:text-lg font-bold hidden md:table-cell">
                    Sl.
                  </th>

                  {/* BSTID */}
                  <th className="text-left px-5 text-[#1E1E1E] text-base ms:text-lg font-bold hidden md:table-cell">
                    BSTID
                  </th>

                  {/* VEHICLE NAME */}
                  <th className="text-left px-5 text-[#1E1E1E] text-base ms:text-lg font-bold hidden md:table-cell">
                    Vehicle Name
                  </th>

                  {/* START TIME */}
                  <th className="text-left  px-5 text-[#1E1E1E]text-base ms:text-lg font-bold hidden md:table-cell">
                    Start Time
                  </th>

                  {/* EXPIRY TIME */}
                  <th className=" text-left px-5 text-[#1E1E1E] text-base ms:text-lg font-bold hidden md:table-cell">
                    Expiry Time
                  </th>
                  {/* ACTION BUTTONS */}
                  <th className="rounded-r-[10px] text-left px-5 text-[#1E1E1E] text-base font-bold hidden md:table-cell">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody ref={myRef} className="rounded-xl">
                {data.map(
                  ({
                    sl,
                    id,
                    identifier,
                    bst_id,
                    vrn,
                    vehicle_name,
                    start_time,
                    expire_time,
                    active_status,
                    displayDropdownInfo,
                  }) => {
                    return (
                      <tr
                        key={sl}
                        className={`relative h-[45px] md:h-[81px] ${
                          sl % 2 === 0 ? "bg-white" : "bg-[#F8FBFF]"
                        }`}
                      >
                        {/* SL */}
                        <td className="rounded-l-[10px] px-5 text-base text-[#48525C] hidden md:table-cell">
                          {/* {index + 1} */}
                          {sl}
                        </td>

                        {/* BSTID */}
                        <td className="p-5 md:py-0 text-base text-primaryText hidden md:table-cell">
                          {bst_id}
                        </td>

                        {/* VEHICLE NAME */}
                        <td className="p-5 md:py-0 text-base text-primaryText hidden md:table-cell">
                          {vehicle_name}
                        </td>

                        {/* START TIME */}
                        <td className="px-5 text-base text-primaryText hidden md:table-cell">
                          {locationShareListDateTime(start_time)}
                        </td>

                        {/* EXPIRY TIME */}
                        <td className="px-5 text-base text-primaryText hidden md:table-cell">
                          {locationShareListDateTime(expire_time)}
                        </td>

                        {/* ACTION BUTTONS */}
                        <td className="rounded-r-[10px] px-5 text-base hidden md:table-cell">
                          <div className="flex space-x-20">
                            <div>
                              {/* toggle button start */}
                              <div
                                className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                                onClick={() => {
                                  setSharedID(id);
                                  handleActiveStatus(
                                    id,
                                    shareLinkDateTimeCheck(expire_time),
                                    shareLinkDateTimeCheck(linkExpireTime),
                                    [
                                      {
                                        id,
                                        vehicle_name,
                                        bst_id,
                                        vrn,
                                        active_status,
                                      },
                                    ]
                                  );
                                }}
                              >
                                {/* Switch */}
                                <div
                                  className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${
                                    active_status === false ||
                                    shareLinkDateTimeCheck(expire_time) === true
                                      ? "bg-[#C9D1DA]"
                                      : `${toggleClass} bg-primary`
                                  }`}
                                >
                                  {console.log(
                                    shareLinkDateTimeCheck(linkExpireTime),
                                    "time"
                                  )}
                                </div>
                              </div>
                              {/* toggle button end */}
                            </div>
                            <button
                              className="flex justify-center items-center group"
                              onClick={() => {
                                setSharedID(id);
                                handleModal([
                                  {
                                    identifier,
                                    vehicle_name,
                                    bst_id,
                                    vrn,
                                    id,
                                    active_status,
                                  },
                                ]);
                              }}
                            >
                              <EditTableSVG />
                            </button>
                          </div>
                        </td>

                        {/* TABLE DETAILS FOR SMALL SCREEN */}
                        <td
                          className={`p-3 md:hidden flex flex-col space-y-2 duration-300 ease-in-out rounded-[20px] md:rounded-none ${
                            displayDropdownInfo === true
                              ? "h-[200px] sm:h-[160px]"
                              : "h-[50px] justify-center"
                          } `}
                        >
                          <div
                            onClick={() => handleDropDownData(id)}
                            className="flex items-center text-tertiaryText text-sm font-bold"
                          >
                            <p>BSTID:&nbsp;</p>
                            <p> {bst_id}</p>
                          </div>
                          {displayDropdownInfo === true ? (
                            <div className="flex flex-col space-y-2">
                              <div className="flex items-center text-tertiaryText text-sm font-medium">
                                <p>Vehicle Name:&nbsp;</p>
                                <p>{vehicle_name}</p>
                              </div>
                              <div className="flex items-center text-tertiaryText text-sm font-medium">
                                <p>Start Time:&nbsp;</p>
                                <p>{locationShareListDateTime(start_time)}</p>
                              </div>
                              <div className="flex items-center text-tertiaryText text-sm font-medium">
                                <p>Expiry Time:&nbsp;</p>
                                <p>{locationShareListDateTime(expire_time)}</p>
                              </div>
                              <div className="flex items-center text-tertiaryText text-sm font-medium">
                                <p>Actions:&nbsp;</p>
                                <div className="flex space-x-4 mx-2">
                                  <div>
                                    {/* toggle button start */}
                                    <div
                                      className="w-8 h-4 flex items-center bg-[#F0F5FB] rounded-full cursor-pointer relative z-0 text-sm font-normal"
                                      onClick={() => {
                                        setSharedID(id);
                                        handleActiveStatus(
                                          id,
                                          shareLinkDateTimeCheck(expire_time),
                                          shareLinkDateTimeCheck(
                                            linkExpireTime
                                          ),
                                          [
                                            {
                                              id,
                                              vehicle_name,
                                              bst_id,
                                              vrn,
                                              active_status,
                                            },
                                          ]
                                        );
                                      }}
                                    >
                                      {/* Switch */}
                                      <div
                                        className={`z-10 w-3 h-3 ml-1 flex justify-center items-center rounded-full transform duration-300 ease-in-out ${
                                          !active_status
                                            ? "bg-[#C9D1DA]"
                                            : `${toggleClass} bg-primary`
                                        }`}
                                      >
                                        {console.log(
                                          shareLinkDateTimeCheck(
                                            linkExpireTime
                                          ),
                                          "time"
                                        )}
                                      </div>
                                    </div>
                                    {/* toggle button end */}
                                  </div>
                                  <button
                                    className="flex justify-center items-center group"
                                    onClick={() => {
                                      setSharedID(id);
                                      handleModal([
                                        {
                                          identifier,
                                          vehicle_name,
                                          bst_id,
                                          vrn,
                                          id,
                                          active_status,
                                        },
                                      ]);
                                    }}
                                  >
                                    <EditTableMobileSVG />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
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

export default LocationShareListTable;
