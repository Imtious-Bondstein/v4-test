import React, { useState } from "react";
import RightArrowPaginateSVG from "../SVG/pagination/RightArrowPaginateSVG";
import LeftArrowPaginateSVG from "../SVG/pagination/LeftArrowPaginateSVG";

function Pagination({ totalItems = 50, itemsPerPage = 4 }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const visiblePages = 5;

  // Calculate range of visible page numbers
  const rangeStart = Math.max(currentPage - Math.floor(visiblePages / 2), 1);
  const rangeEnd = Math.min(rangeStart + visiblePages - 1, totalPages);

  // Generate page numbers to display
  const pages = [];
  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i);
  }

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <ul className="pagination flex items-center gap-2 pb-20">
        {/* Show "Previous" button if not on first page */}
        <li
          className="rounded-lg w-10 h-10 flex items-center justify-center bg-white cursor-pointer"
          onClick={() => currentPage > 1 && handlePageClick(currentPage - 1)}
        >
          <LeftArrowPaginateSVG />
        </li>
        {/* Show dots if not on first or last page */}
        {rangeStart >= 2 && (
          <>
            <li
              className="rounded-lg w-10 h-10 flex items-center justify-center bg-white disabled cursor-pointer"
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
            className={`rounded-lg w-10 h-10 flex items-center justify-center cursor-pointer ${
              page === currentPage ? " bg-red-300" : "bg-white"
            }`}
            onClick={() => handlePageClick(page)}
          >
            {page}
          </li>
        ))}
        {/* Show dots if not on first or last page */}
        {rangeEnd < totalPages && (
          <>
            {totalPages - currentPage > 3 && (
              <li className="rounded-lg w-10 h-10 flex items-center justify-center bg-white disabled">
                ...
              </li>
            )}
            <li
              className="rounded-lg w-10 h-10 flex items-center justify-center bg-white cursor-pointer"
              onClick={() => handlePageClick(totalPages)}
            >
              {totalPages}
            </li>
          </>
        )}

        {/* Show "Next" button if not on last page */}

        <li
          className="cursor-pointer rounded-lg w-10 h-10 flex items-center justify-center bg-white"
          onClick={() =>
            currentPage < totalPages && handlePageClick(currentPage + 1)
          }
        >
          <RightArrowPaginateSVG />
        </li>
      </ul>
    </div>
  );
}

export default Pagination;
