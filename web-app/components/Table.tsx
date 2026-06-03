"use client";

import React, { useState, useMemo } from "react";

export interface TableColumn<T> {
  key: string;
  header: string;
  align?: "left" | "center" | "right";
  render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchFilter?: (item: T, query: string) => boolean;
  onRowClick?: (item: T) => void;
  initialRowsPerPage?: number;
  className?: string;
  headerRight?: React.ReactNode;
}

export default function Table<T>({
  columns,
  data,
  searchPlaceholder = "Search...",
  searchFilter,
  onRowClick,
  initialRowsPerPage = 10,
  className = "",
  headerRight,
}: TableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim() || !searchFilter) return data;
    return data.filter((item) => searchFilter(item, searchQuery));
  }, [data, searchQuery, searchFilter]);

  // Calculate pagination details
  const totalItems = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));

  // Adjust current page if search filters result in fewer pages
  const sanitizedCurrentPage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const startIndex = (sanitizedCurrentPage - 1) * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, sanitizedCurrentPage, rowsPerPage]);

  const startIndex = (sanitizedCurrentPage - 1) * rowsPerPage + 1;
  const endIndex = Math.min(sanitizedCurrentPage * rowsPerPage, totalItems);

  const handlePrevPage = () => {
    if (sanitizedCurrentPage > 1) {
      setCurrentPage(sanitizedCurrentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (sanitizedCurrentPage < totalPages) {
      setCurrentPage(sanitizedCurrentPage + 1);
    }
  };

  return (
    <div className={`w-full flex flex-col  bg-white dark:bg-zinc-900/50 shadow-sm rounded-[20px]  shadow-[0_8px_30px_rgb(0,0,0,0.02)] ${className}`}>

      {/* Search Header Row */}
      {(searchFilter || headerRight) && (
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
          {searchFilter && (
            <div className="relative w-full max-w-md ">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={searchPlaceholder}
                className="w-full pl-11 pr-4 py-2.5 text-[13px] font-medium text-zinc-700  border border-[#E7E7E7] dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#28A388]/30 focus:border-[#28A388] transition-all"
              />
            </div>
          )}
          {headerRight && (
            <div className="flex flex-wrap items-center gap-3 sm:justify-end">
              {headerRight}
            </div>
          )}
        </div>
      )}

      {/* Table Container */}
      <div className="w-full overflow-x-auto  ">
        <table className="w-full border-collapse text-left text-[13px] text-zinc-600 dark:text-zinc-300 py-6">
          <thead>
            <tr className="border-b border-zinc-100 bg-[#FAFAFA] dark:border-zinc-800/60 select-none">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`py-3 px-4 text-[14px] font-medium text-[#717680]  tracking-wider ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
                    }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DCDFE4] dark:divide-zinc-850">
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr
                  key={index}
                  onClick={() => onRowClick?.(item)}
                  className={`group transition-colors duration-150 ${onRowClick ? "cursor-pointer hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20" : ""
                    }`}
                >
                  {columns.map((col) => {
                    const cellAlign = col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left";
                    return (
                      <td key={col.key} className={`py-3.5 px-4 font-medium text-[14px] text-[#333839] dark:text-zinc-200 align-middle ${cellAlign}`}>
                        {col.render ? col.render(item) : (item as any)[col.key]?.toString() || "-"}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-10 text-zinc-400 dark:text-zinc-500 select-none font-medium">
                  No records found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Pagination Control Row */}
      {totalItems > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 p-4 border-t border-zinc-100 dark:border-zinc-800/40 text-[12px] font-semibold text-zinc-550 dark:text-zinc-400 select-none">

          {/* Rows per page selector */}
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <div className="relative">
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="appearance-none bg-transparent pr-8 pl-2 py-1 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#28A388] cursor-pointer text-zinc-700 dark:text-zinc-200 font-bold"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-zinc-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
          </div>

          {/* Current rows range display */}
          <span>
            {startIndex}-{endIndex} of {totalItems}
          </span>

          {/* Page navigation buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevPage}
              disabled={sanitizedCurrentPage === 1}
              className={`p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 transition-colors ${sanitizedCurrentPage === 1
                ? "text-zinc-300 dark:text-zinc-750 cursor-not-allowed"
                : "text-zinc-650 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNextPage}
              disabled={sanitizedCurrentPage === totalPages}
              className={`p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 transition-colors ${sanitizedCurrentPage === totalPages
                ? "text-zinc-300 dark:text-zinc-750 cursor-not-allowed"
                : "text-zinc-650 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
