"use client";

import React, { useState } from "react";
import { useBranch } from "./layout";
import StatCard from "../../components/StatCard";
import RevenueChart, { ChartDataPoint } from "../../components/dashboard/RevenueChart";
import ChannelChart, { ChannelData } from "../../components/dashboard/ChannelChart";
import PeakHoursChart, { PeakHourDataPoint } from "../../components/dashboard/PeakHoursChart";
import CategoriesProgress, { CategoryPerformance } from "../../components/dashboard/CategoriesProgress";
import PerformanceTable, { TableRow } from "../../components/dashboard/PerformanceTable";
import ReservationSummaryList, { ReservationMetric } from "../../components/dashboard/ReservationSummaryList";

// Define mock data configurations for multiple branches so the user can easily swap content when reusing!
const BRANCH_DATASETS: Record<
  string,
  {
    stats: {
      revenueToday: string;
      totalOrders: string;
      reservations: string;
      avgOrderValue: string;
    };
    revenueData: ChartDataPoint[];
    channelData: ChannelData[];
    peakHours: PeakHourDataPoint[];
    categories: CategoryPerformance[];
    tableData: TableRow[];
    reservationSummary: ReservationMetric[];
  }
> = {
  // Downtown Branch
  "1": {
    stats: {
      revenueToday: "AED 48,290",
      totalOrders: "32",
      reservations: "84/120",
      avgOrderValue: "AED 1,509",
    },
    revenueData: [
      { label: "Jan", value: 75, displayValue: "AED 75,000" },
      { label: "Feb", value: 45, displayValue: "AED 45,000" },
      { label: "Mar", value: 80, displayValue: "AED 80,000" },
      { label: "Apr", value: 78, displayValue: "AED 78,000" },
      { label: "May", value: 55, displayValue: "AED 55,000" },
      { label: "Jun", value: 78, displayValue: "AED 78,000" },
      { label: "Jul", value: 52, displayValue: "AED 52,000" },
      { label: "Aug", value: 32, displayValue: "AED 32,000" },
      { label: "Sept", value: 65, displayValue: "AED 65,000" },
      { label: "Oct", value: 55, displayValue: "AED 55,000" },
      { label: "Nov", value: 48, displayValue: "AED 48,000" },
      { label: "Dec", value: 72, displayValue: "AED 72,000" },
    ],
    channelData: [
      { name: "Dine in", value: 68480, displayValue: "AED 68,480", percentage: 54, color: "#3CCB7F", hoverColor: "#3CCB7F" },
      { name: "Online Ordering", value: 840, displayValue: "AED 840", percentage: 24, color: "#FD853A", hoverColor: "#EA580C" },
      { name: "Delivery", value: 680, displayValue: "AED 680", percentage: 12, color: "#EF4444", hoverColor: "#DC2626" },
      { name: "Takeaway", value: 7040, displayValue: "AED 7,040", percentage: 10, color: "#53B1FD", hoverColor: "#2563EB" },
    ],
    peakHours: [
      { time: "11am", occupancy: 12 },
      { time: "12pm", occupancy: 30 },
      { time: "1pm", occupancy: 46 },
      { time: "2pm", occupancy: 32 },
      { time: "6pm", occupancy: 41 },
      { time: "7pm", occupancy: 65 },
      { time: "8pm", occupancy: 92 },
      { time: "9pm", occupancy: 52 },
      { time: "10pm", occupancy: 24 },
    ],
    categories: [
      { name: "Starter", value: "AED 24,560", percentage: 76 },
      { name: "Main Course", value: "AED 25,000", percentage: 71 },
      { name: "Beverages", value: "AED 18,500", percentage: 65 },
      { name: "Dessert", value: "AED 14,500", percentage: 54 },
    ],
    tableData: [
      { channel: "Dine in", revenue: "68,430", orders: "624", avgOrderValue: "109.66", change: "+15.4%", isPositive: true },
      { channel: "Online Ordering", revenue: "29,870", orders: "430", avgOrderValue: "69.45", change: "+12.0%", isPositive: true },
      { channel: "Delivery", revenue: "82,300", orders: "1,015", avgOrderValue: "121.60", change: "+22.3%", isPositive: true },
      { channel: "Takeaways", revenue: "45,120", orders: "512", avgOrderValue: "88.25", change: "+8.7%", isPositive: true },
      { channel: "Totals", revenue: "126,430", orders: "1248", avgOrderValue: "101.32", change: "+18.9%", isPositive: true, isTotal: true },
    ],
    reservationSummary: [
      { label: "Walk Ins", value: "88", change: "+15.4%", isPositive: true },
      { label: "Total Reservation", value: "312", change: "+15.4%", isPositive: true },
      { label: "No Shows", value: "18", change: "+15.4%", isPositive: false },
      { label: "Cancellation", value: "24", change: "+15.4%", isPositive: false },
      { label: "Seated Rate", value: "86.5%", change: "+15.4%", isPositive: true },
    ],
  },
  // Marina Branch
  "2": {
    stats: {
      revenueToday: "AED 34,910",
      totalOrders: "24",
      reservations: "62/90",
      avgOrderValue: "AED 1,454",
    },
    revenueData: [
      { label: "Jan", value: 55, displayValue: "AED 55,000" },
      { label: "Feb", value: 35, displayValue: "AED 35,000" },
      { label: "Mar", value: 60, displayValue: "AED 60,000" },
      { label: "Apr", value: 58, displayValue: "AED 58,000" },
      { label: "May", value: 45, displayValue: "AED 45,000" },
      { label: "Jun", value: 68, displayValue: "AED 68,000" },
      { label: "Jul", value: 42, displayValue: "AED 42,000" },
      { label: "Aug", value: 28, displayValue: "AED 28,000" },
      { label: "Sept", value: 50, displayValue: "AED 50,000" },
      { label: "Oct", value: 45, displayValue: "AED 45,000" },
      { label: "Nov", value: 38, displayValue: "AED 38,000" },
      { label: "Dec", value: 58, displayValue: "AED 58,000" },
    ],
    channelData: [
      { name: "Dine in", value: 52400, displayValue: "AED 52,400", percentage: 50, color: "#3CCB7F", hoverColor: "#3CCB7F" },
      { name: "Online Ordering", value: 25120, displayValue: "AED 25,120", percentage: 24, color: "#FD853A", hoverColor: "#EA580C" },
      { name: "Delivery", value: 16750, displayValue: "AED 16,750", percentage: 16, color: "#EF4444", hoverColor: "#DC2626" },
      { name: "Takeaway", value: 10460, displayValue: "AED 10,460", percentage: 10, color: "#53B1FD", hoverColor: "#2563EB" },
    ],
    peakHours: [
      { time: "11am", occupancy: 10 },
      { time: "12pm", occupancy: 25 },
      { time: "1pm", occupancy: 40 },
      { time: "2pm", occupancy: 28 },
      { time: "6pm", occupancy: 35 },
      { time: "7pm", occupancy: 58 },
      { time: "8pm", occupancy: 80 },
      { time: "9pm", occupancy: 45 },
      { time: "10pm", occupancy: 20 },
    ],
    categories: [
      { name: "Starter", value: "AED 18,240", percentage: 70 },
      { name: "Main Course", value: "AED 20,400", percentage: 68 },
      { name: "Beverages", value: "AED 12,150", percentage: 60 },
      { name: "Dessert", value: "AED 9,800", percentage: 48 },
    ],
    tableData: [
      { channel: "Dine in", revenue: "52,400", orders: "480", avgOrderValue: "109.16", change: "+12.1%", isPositive: true },
      { channel: "Online Ordering", revenue: "25,120", orders: "360", avgOrderValue: "69.77", change: "+10.4%", isPositive: true },
      { channel: "Delivery", revenue: "16,750", orders: "150", avgOrderValue: "111.66", change: "+8.2%", isPositive: true },
      { channel: "Takeaways", revenue: "10,460", orders: "120", avgOrderValue: "87.16", change: "+6.5%", isPositive: true },
      { channel: "Totals", revenue: "104,730", orders: "1110", avgOrderValue: "94.35", change: "+10.9%", isPositive: true, isTotal: true },
    ],
    reservationSummary: [
      { label: "Walk Ins", value: "64", change: "+12.1%", isPositive: true },
      { label: "Total Reservation", value: "248", change: "+12.5%", isPositive: true },
      { label: "No Shows", value: "12", change: "+8.2%", isPositive: false },
      { label: "Cancellation", value: "16", change: "+9.1%", isPositive: false },
      { label: "Seated Rate", value: "84.2%", change: "+12.8%", isPositive: true },
    ],
  },
  // Beach Club
  "3": {
    stats: {
      revenueToday: "AED 62,450",
      totalOrders: "48",
      reservations: "95/150",
      avgOrderValue: "AED 1,680",
    },
    revenueData: [
      { label: "Jan", value: 95, displayValue: "AED 95,000" },
      { label: "Feb", value: 65, displayValue: "AED 65,000" },
      { label: "Mar", value: 110, displayValue: "AED 110,000" },
      { label: "Apr", value: 105, displayValue: "AED 105,000" },
      { label: "May", value: 85, displayValue: "AED 85,000" },
      { label: "Jun", value: 115, displayValue: "AED 115,000" },
      { label: "Jul", value: 92, displayValue: "AED 92,000" },
      { label: "Aug", value: 58, displayValue: "AED 58,000" },
      { label: "Sept", value: 88, displayValue: "AED 88,000" },
      { label: "Oct", value: 82, displayValue: "AED 82,000" },
      { label: "Nov", value: 75, displayValue: "AED 75,000" },
      { label: "Dec", value: 98, displayValue: "AED 98,000" },
    ],
    channelData: [
      { name: "Dine in", value: 92300, displayValue: "AED 92,300", percentage: 62, color: "#3CCB7F", hoverColor: "#3CCB7F" },
      { name: "Online Ordering", value: 38200, displayValue: "AED 38,200", percentage: 20, color: "#FD853A", hoverColor: "#EA580C" },
      { name: "Delivery", value: 115200, displayValue: "AED 115,200", percentage: 11, color: "#EF4444", hoverColor: "#DC2626" },
      { name: "Takeaway", value: 62100, displayValue: "AED 62,100", percentage: 7, color: "#53B1FD", hoverColor: "#2563EB" },
    ],
    peakHours: [
      { time: "11am", occupancy: 18 },
      { time: "12pm", occupancy: 42 },
      { time: "1pm", occupancy: 68 },
      { time: "2pm", occupancy: 52 },
      { time: "6pm", occupancy: 60 },
      { time: "7pm", occupancy: 85 },
      { time: "8pm", occupancy: 98 },
      { time: "9pm", occupancy: 70 },
      { time: "10pm", occupancy: 35 },
    ],
    categories: [
      { name: "Starter", value: "AED 35,620", percentage: 82 },
      { name: "Main Course", value: "AED 38,900", percentage: 78 },
      { name: "Beverages", value: "AED 28,450", percentage: 74 },
      { name: "Dessert", value: "AED 22,100", percentage: 62 },
    ],
    tableData: [
      { channel: "Dine in", revenue: "92,300", orders: "810", avgOrderValue: "113.95", change: "+18.2%", isPositive: true },
      { channel: "Online Ordering", revenue: "38,200", orders: "515", avgOrderValue: "74.17", change: "+14.1%", isPositive: true },
      { channel: "Delivery", revenue: "115,200", orders: "1,220", avgOrderValue: "124.40", change: "+24.5%", isPositive: true },
      { channel: "Takeaways", revenue: "62,100", orders: "624", avgOrderValue: "99.51", change: "+10.1%", isPositive: true },
      { channel: "Totals", revenue: "185,200", orders: "1624", avgOrderValue: "114.03", change: "+21.2%", isPositive: true, isTotal: true },
    ],
    reservationSummary: [
      { label: "Walk Ins", value: "112", change: "+18.4%", isPositive: true },
      { label: "Total Reservation", value: "418", change: "+19.1%", isPositive: true },
      { label: "No Shows", value: "24", change: "+10.4%", isPositive: false },
      { label: "Cancellation", value: "32", change: "+12.1%", isPositive: false },
      { label: "Seated Rate", value: "88.4%", change: "+18.9%", isPositive: true },
    ],
  },
};

export default function DashboardOverviewPage() {
  const { activeBranchId } = useBranch();
  const [timeframe, setTimeframe] = useState("Last 30 Days");

  const branchDataset = BRANCH_DATASETS[activeBranchId] || BRANCH_DATASETS["1"];

  return (
    <div className="space-y-6">
      {/* Row Title */}
      <div className="flex items-center justify-between select-none">
        <h1 className="text-xl sm:text-lg sm:text-[24px] font-semibold text-[#333839] dark:text-white tracking-[-0.15px] ">
          Dashboard
        </h1>
        <span className="text-[11px] font-bold text-[#0A46A6] dark:text-emerald-400 bg-[#EBF7FF]  dark:bg-emerald-950/30 px-3 py-1 rounded-full uppercase tracking-wider">
          Live Feed
        </span>
      </div>

      {/* STAT CARDS ROW */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-fade-in">
        <StatCard
          title="Revenue Today"
          value={branchDataset.stats.revenueToday}
          change="+8.2%"
          isPositive={true}
          iconType="revenue"
        />
        <StatCard
          title="Total Orders"
          value={branchDataset.stats.totalOrders}
          change="-2.1%"
          isPositive={false}
          iconType="orders"
        />
        <StatCard
          title="Reservations"
          value={branchDataset.stats.reservations}
          change="+14.8%"
          isPositive={true}
          iconType="reservations"
        />
        <StatCard
          title="Avg Order Value"
          value={branchDataset.stats.avgOrderValue}
          change="+4.3%"
          isPositive={true}
          iconType="value"
        />
      </section>

      {/* REVENUE & CHANNELS CHARTS ROW (Split 60% and 40%) */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
        <div className="lg:col-span-3">
          <RevenueChart
            data={branchDataset.revenueData}
            activeTimeframe={timeframe}
            onTimeframeChange={setTimeframe}
          />
        </div>
        <div className="lg:col-span-2">
          <ChannelChart
            data={branchDataset.channelData}
          />
        </div>
      </section>

      {/* PEAK HOURS & CATEGORIES ROW (Split 50% and 50%) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <PeakHoursChart
          data={branchDataset.peakHours}
        />
        <CategoriesProgress
          categories={branchDataset.categories}
        />
      </section>

      {/* PERFORMANCE TABLE & RESERVATION SUMMARY (Split 60% and 40%) */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch pb-6">
        <div className="lg:col-span-3">
          <PerformanceTable
            rows={branchDataset.tableData}
          />
        </div>
        <div className="lg:col-span-2">
          <ReservationSummaryList
            metrics={branchDataset.reservationSummary}
          />
        </div>
      </section>
    </div>
  );
}
