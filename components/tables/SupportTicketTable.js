import React, { useEffect, useRef, useState } from "react";
import ColumnTableSVG from "../SVG/table/ColumnTableSVG";
import GraphTableSVG from "../SVG/table/GraphTableSVG";
import Search from "@/svg/SearchSVG";
import PlusSVG from "../SVG/PlusSVG";
import SupportTicketModal from "../modals/SupportTicketModal";
import axios from "@/plugins/axios";
import { toast } from "react-toastify";
import LeftArrowPagination from "@/components/SVG/pagination/LeftArrowPaginateSVG";
import RightArrowPaginateSVG from "@/components/SVG/pagination/RightArrowPaginateSVG";
import { useDispatch, useSelector } from "react-redux";
import { vehicleDateTime } from "@/utils/dateTimeConverter";

const SupportTicketTable = ({
  isLoading,
  ticketData,
  setTicketData,
  fetchTicketData,
}) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.reducer.auth.token);

  const [data, setData] = useState([]);

  const [supportTicketModalIsOpen, setSupportTicketModalIsOpen] =
    useState(false);

  const [clickOutside, setclickOutside] = useState(false);
  const myRef = useRef();

  // PAGINATION
  const [offset, setOffset] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // MODAL ======================
  const handleSupportTicket = () => {
    setSupportTicketModalIsOpen(true);
  };

  // ======= raise ticket
  const handleSubmitSupport = async (formData, normalData) => {
    console.log("req data", formData);
    console.log("req data", normalData);

    try {
      const response = await fetch(
        `https://apiv4.singularitybd.co/api/v4/support-ticket/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      if (response.ok) {
        const responseData = await response.json();
        console.log("ticket raise res: ", responseData);
        toast.success(responseData.user_message);
        fetchTicketData();
        setCurrentPage(1);
        setSupportTicketModalIsOpen(false);
      } else {
        const errorResponse = await response.json();
        console.log("else ticket raise err: ", errorResponse);
        toast.error(errorResponse?.message);
      }
    } catch (error) {
      console.log("catch ticket raise : ", error);
    }
  };

  // =============== SEARCH
  const handleTicketSearch = (e) => {
    const inputValue = e.target.value.toLowerCase();
    if (!inputValue) {
      const calculatePages = Math.ceil(ticketData.length / offset);
      setTotalPages(calculatePages);
      setData(ticketData.slice(0, 10));
    } else {
      setCurrentPage(1);
      setTotalPages(1);
      const matchedVehicle = ticketData.filter((matched) =>
        matched.vehicle_name.toLowerCase().includes(inputValue)
      );
      setData(matchedVehicle);
    }
  };

  // paginate button clicks
  const handlePageClick = (page) => {
    setCurrentPage(page);
    updateData(page);
  };
  // update pagination data
  const updateData = (page) => {
    const startIndex = (page - 1) * offset;
    const endIndex = startIndex + offset;

    setData(ticketData.slice(startIndex, endIndex));
  };

  // ===== custom pagination =====
  const visiblePages = 5; //visible pagination buttons

  // Calculate range of visible page numbers
  const rangeStart = Math.max(currentPage - Math.floor(visiblePages / 2), 1);
  const rangeEnd = Math.min(rangeStart + visiblePages - 1, totalPages);

  // Generate page numbers to display
  const pages = [];
  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i);
  }

  // update if visible rows changes
  useEffect(() => {
    setCurrentPage(1);
    setOffset(offset);

    const calculatePages = Math.ceil(totalItems / offset);
    setTotalPages(calculatePages);
    updateData(1);
  }, [offset]);

  useEffect(() => {
    const calculatePages = Math.ceil(ticketData.length / offset);
    setTotalPages(calculatePages);
    setTotalItems(ticketData.length);

    setData(
      ticketData.slice(0, 50).map((item, index) => ({
        ...item,
        sl: index + 1,
        displayDropdownInfo: false,
      }))
    );
  }, [ticketData]);

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

  // CLICK DATA SHOW FOR MOBILE ============================================
  const handleDropDownData = (sl) => {
    const newState = data?.map((vehicle) => {
      setclickOutside(true);
      if (vehicle.sl === sl) {
        return {
          ...vehicle,
          displayDropdownInfo: !vehicle.displayDropdownInfo,
        };
      }
      return vehicle;
    });
    setData(newState);
  };
  // CLICK OUTSIDE =========================================================
  const handelClickOutside = (e) => {
    if (clickOutside === true && !myRef.current.contains(e.target)) {
      const newState = data?.map((vehicle) => {
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
    <div>
      {/* MODAL */}
      <div>
        <div>
          <SupportTicketModal
            supportTicketModalIsOpen={supportTicketModalIsOpen}
            setSupportTicketModalIsOpen={setSupportTicketModalIsOpen}
            handleSubmitSupport={handleSubmitSupport}
          />
        </div>
      </div>

      {/* CONTENT */}
      <div className="hourly-distance-table w-full">
        {/* ====== PAGE TITLE ====== */}
        <div className="flex items-center justify-between pb-0 md:pb-7">
          <h1 className="text-primaryText text-lg md:text-[32px] font-bold mt-2 md:mt-0 md:pt-5">
            Support Ticket
          </h1>
        </div>

        {/* SEARCH-BAR & BUTTONS */}
        <div className="flex flex-col-reverse sm:flex-row items-end sm:items-center justify-center sm:justify-between md:pb-6 -mb-10 sm:my-5 md:my-0 sm:space-x-">
          {/* SEARCH-BAR */}
          <div className="relative flex justify-between items-center w-full sm:w-[387px] h-[48px] bg-white r rounded-xl -mt-[50px] mb-[50px] sm:my-0">
            <input
              onChange={(e) => handleTicketSearch(e)}
              className="w-full h-full text-sm text-tmvGray font-normal outline-quaternary rounded-xl px-3"
              type="text"
              placeholder="Search"
            />
            <div className="absolute right-4">
              <Search />
            </div>
          </div>
          {/* BUTTONS */}
          <div className="flex items-end sm:items-center justify-end gap-2 xs:gap-4 mb-6 sm:mb-0 relative sm:static -top-9 md:-top-16 lg:-top-20 xl:top-0 mt-1.5 xs:mt-0">
            <button
              onClick={() => handleSupportTicket()}
              className={`fill-[#1E1E1E] flex items-center justify-center gap-3 px-4text-sm bg-[#FDD10E] text-[#1E1E1E] rounded-md sm:rounded-[12px] w-[35px] h-[35px] xs:w-[42px] md:w-[238px] xs:h-[42px] md:h-[48px]  duration-300 hover:shadow-xl hover:shadow-primary/60`}
            >
              <PlusSVG />
              <p className="hidden md:block">Raise Support Ticket</p>
            </button>
          </div>
        </div>
        {/* TABLE */}
        <div className="overflow-hidden rounded-[20px]">
          <div className="overflow-x-auto bg-white h-[66vh] p-2 sm:px-6 sm:pt-[29px]">
            {isLoading ? (
              <div className="w-full">{skeletonDiv}</div>
            ) : (
              <table className="md:min-w-[1500px] w-full">
                <thead className="bg-[#FFFAE6] h-[70px] rounded-md hidden md:table-header-group">
                  <tr className="">
                    {/* SL */}
                    <th className="w-[100px] text-left px-3 rounded-l-[10px] text-[#1E1E1E] text-lg font-bold">
                      Sl.
                    </th>

                    {/* TIME */}
                    <th className="w-[250px] text-left text-[#1E1E1E] text-lg font-bold  ">
                      Time
                    </th>

                    {/* ID NO */}
                    <th className="w-[150px] text-left text-[#1E1E1E] text-lg font-bold ">
                      ID No.
                    </th>

                    {/* CATEGORY */}
                    <th className="w-[200px] text-left text-[#1E1E1E] text-lg font-bold">
                      Category
                    </th>

                    {/* VEHICLE NAME */}
                    <th className="w-[200px] text-left text-[#1E1E1E] text-lg font-bold">
                      Vehicle Name
                    </th>
                    {/* STATUS */}
                    <th className="w-[150px] text-left text-[#1E1E1E] text-lg font-bold">
                      Status
                    </th>

                    {/* RESPONSE */}
                    <th className="w-[150px] text-left text-[#1E1E1E] text-lg font-bold">
                      Response
                    </th>
                  </tr>
                </thead>

                <tbody ref={myRef} className="rounded-xl">
                  {data.map(
                    (
                      {
                        id,
                        sl,
                        date,
                        idNo,
                        category,
                        vehicle_name,
                        response,
                        status,
                        distance,
                        displayDropdownInfo,
                      },
                      index
                    ) => {
                      return (
                        <tr
                          key={index}
                          className={`relative rounded-xl h-[50px] md:h-[81px] ${
                            index % 2 === 0 ? "bg-white" : "bg-[#F8FBFF]"
                          }`}
                        >
                          {/* SL */}
                          <td className="w-[100px] px-3 rounded-l-[10px] text-lg text-[#48525C] hidden md:table-cell">
                            {sl}
                          </td>

                          {/* DATE */}
                          <td className="w-[250px] text-left text-lg text-[#48525C] hidden md:table-cell">
                            {vehicleDateTime(date)}
                          </td>

                          {/* ID NO */}
                          <td className="w-[150px] text-left text-lg text-[#48525C] hidden md:table-cell">
                            {id}
                          </td>

                          {/* CATEGORY */}
                          <td
                            className={`w-[200px] text-left text-lg text-[#48525C] hidden md:table-cell primaryText`}
                          >
                            {category}
                          </td>

                          {/* VEHICLE NAME */}
                          <td className="w-[200px] text-left text-lg text-[#48525C]  hidden md:table-cell">
                            {vehicle_name}
                          </td>
                          {/* STATUS */}
                          <td className="w-[150px] text-left text-lg text-[#48525C]  hidden md:table-cell">
                            {status}
                          </td>

                          {/* RESPONSE */}
                          <td className="w-[150px] text-left text-lg text-[#48525C]  hidden md:table-cell">
                            {response}
                          </td>
                          {/* TABLE DETAILS FOR SMALL SCREEN */}
                          <td
                            className={`md:hidden flex flex-col space-y-2 duration-300 ease-in-out rounded-[10px] md:rounded-none p-3 ${
                              displayDropdownInfo === true
                                ? "h-[200px]"
                                : "h-[25px]"
                            } `}
                          >
                            <div
                              onClick={() => handleDropDownData(sl)}
                              className="flex items-center text-tertiaryText text-sm font-bold"
                            >
                              <p>Time:&nbsp;</p>
                              <p>{vehicleDateTime(date)}</p>
                            </div>

                            {displayDropdownInfo === true ? (
                              <div className="flex flex-col space-y-2">
                                <div className="flex items-center text-tertiaryText text-sm font-medium">
                                  <p>ID No:&nbsp;</p>
                                  <p>{id}</p>
                                </div>
                                <div className="flex items-center text-tertiaryText text-sm font-medium">
                                  <p>Category:&nbsp;</p>
                                  <p> {category}</p>
                                </div>
                                <div className="flex items-center text-tertiaryText text-sm font-medium">
                                  <p>Vehicle Name:&nbsp;</p>
                                  <p>{vehicle_name}</p>
                                </div>
                                <div className="flex items-center text-tertiaryText text-sm font-medium">
                                  <p>Status:&nbsp;</p>
                                  <p>{status}</p>
                                </div>
                                <div className="flex items-center text-tertiaryText text-sm font-medium">
                                  <p>Response:&nbsp;</p>
                                  <p>{response}</p>
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

      {/* ====== PAGINATION ====== */}
      <div className="pagination flex items-center justify-center md:justify-between pb-6">
        <div className="hidden md:flex items-center gap-4">
          <div>
            <label className="text-[#48525C] mr-2">Rows visible</label>
            <select
              value={offset}
              onChange={(e) => {
                setOffset(Number(e.target.value));
              }}
              className="p-[10px] rounded-md text-[#48525C] text-sm w-[65px] outline-quaternary"
            >
              {[2, 5, 10, 20, 30, 40, 50, 75, 100].map((pageNumber) => (
                <option key={pageNumber} value={pageNumber}>
                  {pageNumber}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className="text-[#48525C]">
              Showing {currentPage} of {totalPages}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 my-3">
          <ul className="pagination flex items-center gap-2">
            <li
              className="rounded-lg w-10 h-10 flex items-center justify-center bg-white dark-shadow hover:bg-[#FDD10E] hover:primary-shadow cursor-pointer"
              onClick={() =>
                currentPage > 1 && handlePageClick(currentPage - 1)
              }
            >
              <LeftArrowPagination />
            </li>
            {/*  before dots  */}
            {rangeStart >= 2 && (
              <>
                <li
                  className="rounded-lg w-10 h-10 flex items-center justify-center bg-white disabled cursor-pointer hover:bg-[#FDD10E] hover:primary-shadow"
                  onClick={() => handlePageClick(1)}
                >
                  1
                </li>
                {currentPage > 4 && (
                  <li className="rounded-lg w-10 h-10 flex items-center justify-center bg-white disabled">
                    ...
                  </li>
                )}
              </>
            )}
            {/* Generate page buttons */}
            {pages.map((page) => (
              <li
                key={page}
                className={`rounded-lg w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-[#FDD10E] hover:primary-shadow ${
                  page === currentPage
                    ? " bg-[#FDD10E] primary-shadow"
                    : "bg-white dark-shadow"
                }`}
                onClick={() => handlePageClick(page)}
              >
                {page}
              </li>
            ))}
            {/* after dots  */}
            {rangeEnd < totalPages && (
              <>
                {totalPages - currentPage > 3 && (
                  <li className="rounded-lg w-10 h-10 flex items-center justify-center bg-white disabled">
                    ...
                  </li>
                )}
                <li
                  className="rounded-lg w-10 h-10 flex items-center justify-center bg-white cursor-pointer hover:bg-[#FDD10E] hover:primary-shadow"
                  onClick={() => handlePageClick(totalPages)}
                >
                  {totalPages}
                </li>
              </>
            )}

            <li
              className="cursor-pointer rounded-lg w-10 h-10 flex items-center justify-center bg-white dark-shadow hover:bg-[#FDD10E] hover:primary-shadow"
              onClick={() =>
                currentPage < totalPages && handlePageClick(currentPage + 1)
              }
            >
              <RightArrowPaginateSVG />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SupportTicketTable;
