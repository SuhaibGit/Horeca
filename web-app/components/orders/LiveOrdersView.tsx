"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  mockLiveOrders,
  mockLiveOrderStats,
  LiveOrder,
  type LiveOrdersFilterState,
} from "../../data/mockOrders";
import OrderCard, { getStatusStyles } from "./OrderCard";
import Table, { TableColumn } from "../Table";
import OrderDetailDrawer from "./OrderDetailDrawer";
import LiveOrdersFilterDrawer, {
  DEFAULT_LIVE_ORDERS_FILTERS,
} from "./LiveOrdersFilterDrawer";
import StatCard from "../StatCard";

export default function LiveOrdersView() {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<LiveOrder | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] =
    useState<LiveOrdersFilterState>(DEFAULT_LIVE_ORDERS_FILTERS);

  const filterTabs = ["All", "New", "Ready", "Preparing", "Served", "Completed", "Delay"];

  const hasActiveSideFilters =
    appliedFilters.statuses.length > 0 || appliedFilters.types.length > 0;

  const filteredOrders = useMemo(() => {
    let result = mockLiveOrders;

    if (activeFilter !== "All") {
      result = result.filter(
        (order) => order.status.toLowerCase() === activeFilter.toLowerCase()
      );
    }

    if (appliedFilters.statuses.length > 0) {
      result = result.filter((order) =>
        appliedFilters.statuses.includes(order.status)
      );
    }

    if (appliedFilters.types.length > 0) {
      result = result.filter((order) =>
        appliedFilters.types.includes(order.orderType)
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (order) =>
          order.table.toLowerCase().includes(query) ||
          order.id.toLowerCase().includes(query) ||
          order.orderType.toLowerCase().includes(query) ||
          order.items.some((item) => item.name.toLowerCase().includes(query))
      );
    }

    return result;
  }, [activeFilter, searchQuery, appliedFilters]);

  // Handle drawer trigger
  const handleOpenDrawer = (order: LiveOrder) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
  };

  // Reusable search filtering function passed to the Table
  const searchFilter = (order: LiveOrder, query: string) => {
    const term = query.toLowerCase();
    return (
      order.table.toLowerCase().includes(term) ||
      order.id.toLowerCase().includes(term) ||
      order.orderType.toLowerCase().includes(term) ||
      order.items.some((item) => item.name.toLowerCase().includes(term))
    );
  };

  // Custom cell renderer for the "Items" column in the List View table
  const renderTableItems = (order: LiveOrder) => {
    const displayPills = order.items.slice(0, 3);
    const overflowCount = order.items.length - displayPills.length;

    // Harmonious colors for different item badges
    const pillStyles = [
      "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-950/60",
      "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-950/60",
      "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-950/60",
    ];

    return (
      <div className="flex flex-wrap gap-1.5 py-1">
        {displayPills.map((item, idx) => (
          <span
            key={idx}
            className={`px-2.5 py-0.5 text-[12px]  rounded-[21px] ${pillStyles[idx % pillStyles.length]}`}
          >
            {item.quantity}x {item.name}
          </span>
        ))}
        {overflowCount > 0 && (
          <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 border border-zinc-150/40 dark:border-zinc-800/80">
            +{overflowCount} more
          </span>
        )}
      </div>
    );
  };

  // Table columns definition
  const tableColumns: TableColumn<LiveOrder>[] = [
    {
      key: "id",
      header: "Orders",
      render: (order) => (
        <span className="font-semibold text-zinc-800 dark:text-zinc-200">{order.id}</span>
      ),
    },
    {
      key: "orderType",
      header: "Type",
      render: (order) => (
        <span
          className={`text-[13px] font-semibold ${order.orderType === "Delivery"
            ? "text-[#0A46A6]"
            : "text-zinc-700 dark:text-zinc-300"
            }`}
        >
          {order.orderType}
        </span>
      ),
    },
    {
      key: "table",
      header: "Table",
      render: (order) => (
        <div className="flex items-center gap-2">
          {order.orderType === "Delivery" ? (
            <svg
              className="w-4 h-4 text-[#0A46A6]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10m10 0h2m-2 0a2 2 0 104 0m-6 0a2 2 0 104 0m6-8h3.5L21 10v6h-2"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 text-zinc-450 dark:text-zinc-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          )}
          <span className="font-extrabold text-zinc-850 dark:text-zinc-100">{order.table}</span>
        </div>
      ),
    },
    {
      key: "items",
      header: "Items",
      render: renderTableItems,
    },
    {
      key: "guests",
      header: "Guest",
      align: "center",
      render: (order) => (
        <span className="font-extrabold text-zinc-650 dark:text-zinc-400">
          {order.guests}
        </span>
      ),
    },
    {
      key: "totalPrice",
      header: "Price",
      align: "left",
      render: (order) => (
        <span className="font-black text-zinc-850 dark:text-zinc-100">
          AED {order.totalPrice.toFixed(2)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      render: (order) => {
        const style = getStatusStyles(order.status);
        return (
          <span className={`px-2.5 py-0.5 text-[14px] font-medium rounded-full ${style.bg} ${style.text}  tracking-wider`}>
            {style.label}
          </span>
        );
      },
    },
    {
      key: "action",
      header: "Action",
      align: "center",
      render: (order) => (
        <button
          onClick={() => handleOpenDrawer(order)}
          className="w-7 h-7 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#0A46A6] dark:hover:text-[#28A388] hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 select-none">
      <div className="flex items-center justify-between select-none">
        <h1 className="text-xl sm:text-lg sm:text-[24px] font-semibold text-[#333839] dark:text-white tracking-[-0.15px] ">
          Live Orders
        </h1>
      </div>
      {/* 1. STATS METRICS GRID */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Active Order"
          value={mockLiveOrderStats.activeOrders.toString()}
          iconType="orders"
        />
        <StatCard
          title="Order In Progress"
          value={mockLiveOrderStats.ordersInProgress.toString()}
          iconType="revenue"
        />
        <StatCard
          title="Tables"
          value={mockLiveOrderStats.tablesOccupied.toString()}
          iconType="reservations"
        />
        <StatCard
          title="Avg Order Value"
          value={mockLiveOrderStats.avgOrderValue}
          iconType="value"
        />
      </section>

      {/* 2. FILTERS AND VIEW TOGGLE HEADER */}
      <section className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 py-2">

        <div className="flex flex-wrap items-center gap-2">
          {filterTabs.map((tab) => {
            const isSelected = activeFilter.toLowerCase() === tab.toLowerCase();
            return (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setActiveFilter(tab);
                  setSearchQuery("");
                }}
                className={`px-4 py-2 rounded-[8px] text-[16px] font-medium transition-all duration-200 select-none cursor-pointer ${isSelected
                  ? "bg-linear-to-l from-[#041B40] to-[#0A46A6] text-white shadow-xs"
                  : "bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-450 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  }`}
              >
                {tab}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setFilterDrawerOpen(true)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-[8px] text-[16px] font-medium transition-all duration-200 select-none cursor-pointer bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 border ${hasActiveSideFilters
              ? "border-[#0A46A6]/40 text-[#0A46A6]"
              : "border-transparent"
              }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
            Filter
            {hasActiveSideFilters && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#0A46A6]" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 self-end lg:self-auto bg-white dark:bg-zinc-900 shadow-sm rounded-xl shadow-[0_4px_15px_rgb(0,0,0,0.01)] select-none">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${viewMode === "grid"
              ? "bg-linear-to-l from-[#041B40] to-[#0A46A6] text-white"
              : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              }`}
            title="Grid Card View"
          >
            {/* Grid Icon */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>

          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${viewMode === "list"
              ? "bg-linear-to-l from-[#041B40] to-[#0A46A6] text-white"
              : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              }`}
            title="List Table View"
          >
            {/* List Icon */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

      </section>

      {/* 3. DYNAMIC CONTENT MAIN AREA */}
      <section className="min-h-[400px]">
        {filteredOrders.length > 0 ? (
          viewMode === "grid" ? (
            /* Grid Card View */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onViewDetail={() => handleOpenDrawer(order)}
                />
              ))}
            </div>
          ) : (
            /* List Table View */
            <div className="animate-fade-in">
              <Table
                columns={tableColumns}
                data={filteredOrders}
                searchPlaceholder="Search table, order, or items..."
                searchFilter={searchFilter}
                initialRowsPerPage={10}
              />
            </div>
          )
        ) : (
          /* "No Active Orders Yet" Empty State Illustration */
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-4 animate-fade-in select-none">
            <div className="relative w-64 h-64 md:w-80 md:h-80 mb-2">
              <Image
                src="/Liveorder/emptyOrders.png"
                alt="No Active Orders"
                fill
                priority
                className="object-contain hover:scale-102 transition-transform duration-500"
              />
            </div>

            <h4 className="text-[20px] font-black text-zinc-900 dark:text-white tracking-tight uppercase leading-none">
              No Active Orders Yet
            </h4>

            <p className="text-[13px] font-semibold text-zinc-450 dark:text-zinc-500 max-w-sm leading-relaxed">
              {activeFilter === "All"
                ? "Once customers start placing orders, live table activity, order progress, and kitchen updates will appear here."
                : `No orders currently match the selected "${activeFilter}" status filter.`}
            </p>
          </div>
        )}
      </section>

      <OrderDetailDrawer
        order={selectedOrder}
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedOrder(null);
        }}
      />

      <LiveOrdersFilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        appliedFilters={appliedFilters}
        onApply={setAppliedFilters}
      />
    </div>
  );
}
