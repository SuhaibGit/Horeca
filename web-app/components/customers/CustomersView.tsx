"use client";

import React, { useMemo, useState } from "react";
import {
  Customer,
  mockCustomerStats,
  mockCustomers,
} from "../../data/mockCustomers";
import { mockLiveOrders } from "../../data/mockOrders";
import { enrichCustomerWithLiveOrders } from "../../lib/customerOrders";
import StatCard from "../StatCard";
import Table, { TableColumn } from "../Table";
import Dropdown from "../Dropdown";
import EmptyState from "../EmptyState";
import CustomerAvatar from "./CustomerAvatar";
import CustomerDetailDrawer from "./CustomerDetailDrawer";

const CUSTOMER_TYPE_OPTIONS = [
  { value: "all", label: "Customer Type" },
  { value: "Restaurant visit", label: "Restaurant visit" },
  { value: "Delivery", label: "Delivery" },
];

const PERIOD_OPTIONS = [
  { value: "30days", label: "Last 30 Days" },
  { value: "7days", label: "Last 7 Days" },
  { value: "today", label: "Today" },
  { value: "all", label: "All Time" },
];

/** Set to true to preview the empty state from the design */
const SHOW_EMPTY_STATE = false;

function formatSpend(amount: number): string {
  return `${amount.toLocaleString("en-US")} AED`;
}

export default function CustomersView() {
  const [customerTypeFilter, setCustomerTypeFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("30days");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const customers = useMemo(
    () =>
      SHOW_EMPTY_STATE
        ? []
        : mockCustomers.map((c) => enrichCustomerWithLiveOrders(c, mockLiveOrders)),
    []
  );

  const filteredCustomers = useMemo(() => {
    let result = [...customers];

    if (customerTypeFilter !== "all") {
      result = result.filter((c) => c.customerType === customerTypeFilter);
    }

    if (periodFilter === "today") {
      result = result.filter((c) => c.lastVisitDays === 0);
    } else if (periodFilter === "7days") {
      result = result.filter((c) => c.lastVisitDays <= 7);
    } else if (periodFilter === "30days") {
      result = result.filter((c) => c.lastVisitDays <= 30);
    }

    result.sort((a, b) => a.lastVisitDays - b.lastVisitDays);
    return result;
  }, [customers, customerTypeFilter, periodFilter]);

  const handleOpenDrawer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDrawerOpen(true);
  };

  const searchFilter = (customer: Customer, query: string) => {
    const term = query.toLowerCase();
    return (
      customer.name.toLowerCase().includes(term) ||
      customer.email.toLowerCase().includes(term) ||
      customer.phone.toLowerCase().includes(term) ||
      customer.customerType.toLowerCase().includes(term)
    );
  };

  const tableColumns: TableColumn<Customer>[] = [
    {
      key: "customer",
      header: "Customer",
      render: (customer) => (
        <div className="flex items-center gap-3">
          <CustomerAvatar name={customer.name} color={customer.avatarColor} size="sm" />
          <span className="font-bold text-zinc-850 dark:text-zinc-100">{customer.name}</span>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      render: (customer) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">{customer.phone}</span>
          <span className="text-[12px] font-medium text-zinc-400 dark:text-zinc-500">
            {customer.email}
          </span>
        </div>
      ),
    },
    {
      key: "orders",
      header: "Orders",
      align: "center",
      render: (customer) => (
        <span className="font-bold text-zinc-800 dark:text-zinc-200">{customer.ordersCount}</span>
      ),
    },
    {
      key: "totalSpend",
      header: "Total Spend",
      render: (customer) => (
        <span className="font-bold text-zinc-850 dark:text-zinc-100">
          {formatSpend(customer.totalSpend)}
        </span>
      ),
    },
    {
      key: "customerType",
      header: "Customer Type",
      render: (customer) => (
        <span className="font-medium text-zinc-700 dark:text-zinc-300">{customer.customerType}</span>
      ),
    },
    {
      key: "lastVisit",
      header: "Last Visit",
      render: (customer) => (
        <span className="font-semibold text-zinc-500 dark:text-zinc-400">{customer.lastVisit}</span>
      ),
    },
    {
      key: "action",
      header: "Action",
      align: "center",
      render: (customer) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenDrawer(customer);
          }}
          className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-500 hover:text-[#0A46A6] hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          aria-label={`Actions for ${customer.name}`}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>
      ),
    },
  ];

  const hasCustomers = filteredCustomers.length > 0;

  return (
    <div className="space-y-6">
      <h1 className="text-xl sm:text-[24px] font-semibold text-[#333839] dark:text-white tracking-[-0.15px]">
        Customers
      </h1>

      {customers.length > 0 && (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Total Customer"
            value={mockCustomerStats.totalCustomers.toString()}
            iconType="orders"
          />
          <StatCard
            title="New This Month"
            value={mockCustomerStats.newThisMonth.toString()}
            iconType="reservations"
          />
          <StatCard
            title="Avg Lifetime Value"
            value={mockCustomerStats.avgLifetimeValue}
            iconType="revenue"
          />
          <StatCard
            title="Repeat Rate"
            value={mockCustomerStats.repeatRate}
            iconType="value"
          />
        </section>
      )}

      <section className="min-h-[400px]">
        {hasCustomers ? (
          <Table
            columns={tableColumns}
            data={filteredCustomers}
            searchPlaceholder="Search..."
            searchFilter={searchFilter}
            initialRowsPerPage={10}
            onRowClick={handleOpenDrawer}
            headerRight={
              <>
                <Dropdown
                  options={CUSTOMER_TYPE_OPTIONS}
                  value={customerTypeFilter}
                  onChange={setCustomerTypeFilter}
                />
                <Dropdown
                  options={PERIOD_OPTIONS}
                  value={periodFilter}
                  onChange={setPeriodFilter}
                />
              </>
            }
          />
        ) : (
          <EmptyState
            imageSrc="/emptyCust.png"
            imageAlt="No customers yet"
            title="No Customers Yet"
            description="Customers who place orders, reservations, or loyalty sign-ups will automatically appear here."
          />
        )}
      </section>

      <CustomerDetailDrawer
        customer={selectedCustomer}
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedCustomer(null);
        }}
      />
    </div>
  );
}
