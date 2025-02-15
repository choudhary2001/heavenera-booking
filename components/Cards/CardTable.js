import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

export default function CardTable({
  color,
  title,
  headers,
  data,
  actionButton,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  searchQuery, // Pass searchQuery as a prop
  onSearchChange, // Pass onSearchChange as a prop
}) {
  const MAX_PAGES_TO_SHOW = 5; // Number of pages to show at a time
  const searchInputRef = useRef(null); // Ref for the search input field

  // Generate the range of pages to display
  const getPageRange = () => {
    const half = Math.floor(MAX_PAGES_TO_SHOW / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + MAX_PAGES_TO_SHOW - 1);

    if (end - start + 1 < MAX_PAGES_TO_SHOW) {
      start = Math.max(1, end - MAX_PAGES_TO_SHOW + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const pageRange = getPageRange();

  // Focus the search input after each render
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchQuery]);

  return (
    <>
      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
          (color === "light" ? "bg-white" : "bg-blueGray-700 text-white")
        }
      >
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center justify-between">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3
                className={
                  "font-semibold text-lg " +
                  (color === "light" ? "text-blueGray-700" : "text-white")
                }
              >
                {title}
              </h3>
            </div>
            {/* Action Button */}
            {actionButton && (
              <div className="relative px-4">
                {actionButton}
              </div>
            )}
          </div>
          {/* Search Input */}
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={onSearchChange} // Use the onSearchChange prop
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ref={searchInputRef} // Attach the ref to the input field
              autoFocus // Automatically focus the input field
            />
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          {/* Projects table */}
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className={
                      "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold " +
                      (index === 0
                        ? "text-left" // First column: left-aligned
                        : index === headers.length - 1
                          ? "text-right" // Last column: right-aligned
                          : "text-center") + // Middle columns: center-aligned
                      (color === "light"
                        ? " bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        : " bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                    }
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={
                        "border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 " +
                        (cellIndex === 0
                          ? "text-left" // First column: left-aligned
                          : cellIndex === row.length - 1
                            ? "text-right" // Last column: right-aligned
                            : "text-center") // Middle columns: center-aligned
                      }
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center p-4 border-t border-gray-200">
          {/* Page Size Dropdown */}
          <div>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded-md text-sm cursor-pointer"
              style={{ width: "65px" }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          {/* Pagination Buttons */}
          <div className="flex items-center justify-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {/* Page Numbers */}
            {pageRange.map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-2 py-1 text-sm font-medium ${page === currentPage
                  ? "bg-lightblue-500 text-gray-700"
                  : "bg-white text-gray-700 hover:bg-gray-50"
                  } border border-gray-300 rounded-md`}
              >
                {page}
              </button>
            ))}

            {/* Ellipsis for Remaining Pages */}
            {totalPages > MAX_PAGES_TO_SHOW && pageRange[pageRange.length - 1] < totalPages && (
              <span className="px-2 py-1 text-sm text-gray-700">...</span>
            )}

            {/* Last Page Button */}
            {totalPages > MAX_PAGES_TO_SHOW && pageRange[pageRange.length - 1] < totalPages && (
              <button
                onClick={() => onPageChange(totalPages)}
                className={`px-2 py-1 text-sm font-medium ${totalPages === currentPage
                  ? "bg-red-500 text-gray-700"
                  : "bg-white text-gray-700 hover:bg-gray-50"
                  } border border-gray-300 rounded-md`}
              >
                {totalPages}
              </button>
            )}

            {/* Next Button */}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

CardTable.defaultProps = {
  color: "light",
  headers: [],
  data: [],
  currentPage: 1,
  totalPages: 1,
  pageSize: 10,
  onPageChange: () => { },
  onPageSizeChange: () => { },
  searchQuery: "", // Default empty search query
  onSearchChange: () => { }, // Default empty search handler
};

CardTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
  headers: PropTypes.arrayOf(PropTypes.string),
  data: PropTypes.arrayOf(PropTypes.array),
  actionButton: PropTypes.node,
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  pageSize: PropTypes.number,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  searchQuery: PropTypes.string, // Prop for search query
  onSearchChange: PropTypes.func, // Prop for search change handler
};