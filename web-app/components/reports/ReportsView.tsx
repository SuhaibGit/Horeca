"use client";

import React, { useState } from "react";
import StatCard from "@/components/StatCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import ChannelChart from "@/components/dashboard/ChannelChart";
import ReservationSummaryList from "@/components/dashboard/ReservationSummaryList";
import CategoriesProgress from "@/components/dashboard/CategoriesProgress";
import PerformanceTable from "@/components/dashboard/PerformanceTable";
import PeakHoursChart from "@/components/dashboard/PeakHoursChart";
import Trend from "@/components/dashboard/Trend";
import {
  SALE_CHANNELS,
  TOP_SELLING_ITEMS,
  REVENUE_CHART_DATA,
  salesReport,
  ordersReport,
  reservationsReport,
  RESERVATION_SOURCES,
  menuPerformanceReport,
  MENU_CATEGORIES,
  customerReport,
  CUSTOMER_SEGMENTS,
  marketingReport,
  paymentReport,
  PAYMENT_METHODS,
  REPORT_PAGE_TITLES,
  type ReportSlug,
} from "@/data/mockReports";

const REPORT_SLUGS = new Set<string>(Object.keys(REPORT_PAGE_TITLES));

export function isReportSlug(slug: string): slug is ReportSlug {
  return REPORT_SLUGS.has(slug);
}

interface ReportsViewProps {
  slug: ReportSlug;
}

export default function ReportsView({ slug }: ReportsViewProps) {
  const [timeframe, setTimeframe] = useState("Last 30 Days");
  const title = REPORT_PAGE_TITLES[slug];

  const statGrid = (count: number) =>
    `grid grid-cols-1 sm:grid-cols-2 ${count > 4 ? "lg:grid-cols-4" : "lg:grid-cols-4"} gap-4`;

  if (slug === "reports-sales-report") {
    return (
      <div className="space-y-6 animate-fade-in">
        <ReportHeader title={title} />
        <div className={statGrid(4)}>
          {salesReport.stats.map((s) => (
            <StatCard key={s.title} title={s.title} value={s.value} iconType={s.iconType} />
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <RevenueChart
            className="xl:col-span-2"
            title="Revenue"
            data={REVENUE_CHART_DATA}
            activeTimeframe={timeframe}
            onTimeframeChange={setTimeframe}
          />
          <ChannelChart title="Sale Channel" totalLabel="100% Total" totalValue="AED 77,040" data={SALE_CHANNELS} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ReservationSummaryList title="Top Selling Items" metrics={TOP_SELLING_ITEMS} />
          <CategoriesProgress
            title="Peak Hour"
            categories={salesReport.peakHours}
            footerNote={salesReport.peakFooter}
          />
        </div>
        <PerformanceTable title="Sale Summary" rows={salesReport.saleSummary} />
      </div>
    );
  }

  if (slug === "reports-orders-report") {
    return (
      <div className="space-y-6 animate-fade-in">
        <ReportHeader title={title} />
        <div className={statGrid(4)}>
          {ordersReport.stats.map((s) => (
            <StatCard key={s.title} title={s.title} value={s.value} iconType={s.iconType} />
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Trend
            className="xl:col-span-2"
            title="Order Performance Trends"
            labels={ordersReport.trend.labels}
            series={ordersReport.trend.series}
            activeTimeframe={timeframe}
            onTimeframeChange={setTimeframe}
          />
          <ChannelChart title="Sale Channel" totalLabel="100% Total" totalValue="AED 77,040" data={SALE_CHANNELS} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <ReservationSummaryList title="Top Selling Items" metrics={TOP_SELLING_ITEMS} className="h-full" />
          <PerformanceTable
            title="Operational Channel Summary"
            headers={["Channel", "Total Orders", "Completed", "Cancelled", "Revenue"]}
            genericRows={ordersReport.channelSummary}
            className="h-full"
          />
        </div>
        <PerformanceTable
          title="Recent Orders Analytics"
          headers={["Order ID", "Customer", "Channel", "Status", "Revenue", "Order Time"]}
          genericRows={ordersReport.recentOrders}
        />
      </div>
    );
  }

  if (slug === "reports-reservation-report") {
    return (
      <div className="space-y-6 animate-fade-in">
        <ReportHeader title={title} />
        <div className={statGrid(4)}>
          {reservationsReport.stats.map((s) => (
            <StatCard key={s.title} title={s.title} value={s.value} iconType={s.iconType} />
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Trend
            className="xl:col-span-2"
            title="Reservation Trends"
            labels={reservationsReport.trend.labels}
            series={reservationsReport.trend.series}
            activeTimeframe={timeframe}
            onTimeframeChange={setTimeframe}
          />
          <ChannelChart
            title="Reservation Source"
            totalLabel="100% Total"
            totalValue="2,103"
            data={RESERVATION_SOURCES}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PerformanceTable
            title="Reservation Source Efficiency"
            headers={["Source", "Total Bookings", "Completed", "Cancelled", "No-shows", "Seated Rate"]}
            genericRows={reservationsReport.sourceEfficiency}
          />
          <CategoriesProgress
            title="Peak Volume Heatmap"
            categories={reservationsReport.peakVolume}
            footerNote={reservationsReport.peakFooter}
          />
        </div>
      </div>
    );
  }

  if (slug === "reports-menu-performance") {
    return (
      <div className="space-y-6 animate-fade-in">
        <ReportHeader title={title} />
        <div className={statGrid(4)}>
          {menuPerformanceReport.stats.map((s) => (
            <StatCard key={s.title} title={s.title} value={s.value} iconType={s.iconType} />
          ))}
        </div>
        <Trend
          title="Menu Sales Growth"
          labels={menuPerformanceReport.trend.labels}
          series={menuPerformanceReport.trend.series}
          activeTimeframe={timeframe}
          onTimeframeChange={setTimeframe}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <PeakHoursChart
            title="Peak Volume Heatmap"
            data={menuPerformanceReport.peakHours}
            fillHeight
            className="h-full"
          />
          <ChannelChart
            title="Category Domain"
            totalLabel="Revenue"
            totalValue="AED 25,000"
            data={MENU_CATEGORIES}
            className="h-full"
          />
        </div>
        <PerformanceTable
          title="Recent Orders Analytics"
          headers={["Menu Item", "Category", "Orders", "Revenue", "Cost", "Profit Margin"]}
          genericRows={menuPerformanceReport.menuAnalytics}
          showPagination
          paginationFrom={1}
          paginationTo={5}
          paginationTotal={15}
        />
      </div>
    );
  }

  if (slug === "reports-customer-report") {
    return (
      <div className="space-y-6 animate-fade-in">
        <ReportHeader title={title} />
        <div className={statGrid(4)}>
          {customerReport.stats.map((s) => (
            <StatCard key={s.title} title={s.title} value={s.value} iconType={s.iconType} />
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Trend
            className="xl:col-span-2"
            title="Customer Performance"
            labels={customerReport.trend.labels}
            series={customerReport.trend.series}
            activeTimeframe={timeframe}
            onTimeframeChange={setTimeframe}
          />
          <ChannelChart
            title="Customer Segments"
            totalLabel="100% Total"
            totalValue="12,480"
            data={CUSTOMER_SEGMENTS}
          />
        </div>
      </div>
    );
  }

  if (slug === "reports-marketing-report") {
    return (
      <div className="space-y-6 animate-fade-in">
        <ReportHeader title={title} />
        <div className={statGrid(4)}>
          {marketingReport.stats.map((s) => (
            <StatCard key={s.title} title={s.title} value={s.value} iconType={s.iconType} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <Trend
            className="h-full"
            title="Campaign Performance Trends"
            labels={marketingReport.trend.labels}
            series={marketingReport.trend.series}
            activeTimeframe={timeframe}
            onTimeframeChange={setTimeframe}
          />
          <CategoriesProgress
            title="Engagement Funnel"
            categories={marketingReport.engagementFunnel}
            className="h-full"
          />
        </div>
        <PerformanceTable
          title="Top Performing Campaigns"
          headers={["Campaign Name", "Channel", "Reach", "Open Rate", "Conversion", "Revenue"]}
          genericRows={marketingReport.topCampaigns}
          showPagination
          paginationFrom={1}
          paginationTo={10}
          paginationTotal={32}
        />
      </div>
    );
  }

  if (slug === "reports-payment-report") {
    return (
      <div className="space-y-6 animate-fade-in">
        <ReportHeader title={title} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {paymentReport.stats.map((s) => (
            <StatCard key={s.title} title={s.title} value={s.value} iconType={s.iconType} />
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <RevenueChart
            className="xl:col-span-2"
            title="Revenue Growth & Trends"
            data={REVENUE_CHART_DATA}
            yearLabel="2023"
            activeTimeframe={timeframe}
            onTimeframeChange={setTimeframe}
          />
          <ChannelChart title="Payment Methods" totalLabel="Total" totalValue="$482k Total" data={PAYMENT_METHODS} />
        </div>
        <PeakHoursChart title="Peak Payment Hours" data={paymentReport.peakHours} />
        <PerformanceTable
          title="Recent Transactions"
          headers={["Customer", "Method", "Date & Time", "Amount", "Status"]}
          genericRows={paymentReport.recentTransactions}
          headerFilterLabel="Status"
          showPagination
          paginationFrom={1}
          paginationTo={5}
          paginationTotal={13}
        />
      </div>
    );
  }

  return null;
}

function ReportHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h1 className="text-[22px] font-bold text-zinc-900 dark:text-white tracking-tight">{title}</h1>
      <button
        type="button"
        className="flex items-center gap-2 px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-900 text-[12px] font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 transition-colors shrink-0"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Last 30 Days
      </button>
    </div>
  );
}
