import React, { useEffect, useState } from "react";
// ======= SVG
import RightArrowPaginateSVG from "@/components/SVG/pagination/RightArrowPaginateSVG";
import LeftArrowPaginateSVG from "@/components/SVG/pagination/LeftArrowPaginateSVG";
import "../../styles/components/pagination.css";
import Select from "react-select";

const PaginationMobile = () => {
  const [offset, setOffset] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(100);
  const [clicked, setClicked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Generate page numbers to display
  const pages = [];
  const calculatePages = Math.ceil(totalItems / offset);

  for (let i = 1; i <= calculatePages; i++) {
    pages.push(i);
  }
  useEffect(() => {
    setTotalPages(calculatePages);
  }, [calculatePages]);
  const handlePageClick = (clickedPage) => {
    setCurrentPage(clickedPage);
  };

  const selectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "white",
      border: 0,
      padding: "5px 0",
      borderRadius: "8px",
      outline: "none",
      ZIndex: 1000,
    }),

    singleValue: (provided) => ({
      ...provided,
      color: "black",
      fontSize: "16px",
      fontWeight: 500,
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: "150px",
      overflowY: "auto",
    }),
  };

  return (
    <div>
      <div className="  pb-6">
        <p>{pages} </p>
        <div className="flex items-center gap-2 my-3">
          <ul className="pagination flex items-center gap-2">
            <li
              className="rounded-lg w-20 h-10 flex items-center justify-center bg-white dark-shadow hover:bg-[#FDD10E] hover:primary-shadow cursor-pointer"
              onClick={() =>
                currentPage > 1 && handlePageClick(currentPage - 1)
              }
            >
              Previous
            </li>

            <div className="">
              <select
                value={currentPage}
                onChange={(e) => {
                  setCurrentPage(Number(e.target.value));
                }}
                className="p-[10px] rounded-md text-[#48525C] text-black  "
                style={{ backgroundColor: "white" }}
              >
                {pages.map((pageNumber) => (
                  <option
                    key={pageNumber}
                    value={pageNumber}
                    className="py-4 my-4"
                  >
                    {pageNumber}
                  </option>
                ))}
              </select>
            </div>

            <li
              className="cursor-pointer rounded-lg w-20 h-10 flex items-center justify-center bg-white dark-shadow hover:bg-[#FDD10E] hover:primary-shadow"
              onClick={() =>
                currentPage < totalPages && handlePageClick(currentPage + 1)
              }
            >
              Next {totalPages}
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-4">
          <div>
            <label className="text-[#48525C] mr-2">Rows visible</label>
            <select
              value={offset}
              onChange={(e) => {
                setOffset(Number(e.target.value));
              }}
              className="p-[10px] rounded-md text-[#48525C] text-sm "
              style={{ backgroundColor: "white" }}
            >
              {[10, 20, 30, 40, 50].map((pageNumber) => (
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

        {/* <Select
                id="vehicle"
                onChange={handleVehicleSelect}
                options={vehicleOptions}
                value={selectedVehicle}
                styles={selectStyles}
              /> */}
      </div>
    </div>
  );
};

export default PaginationMobile;
