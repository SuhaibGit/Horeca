"use client";

import React, { useState } from "react";
import Card from "../Card";

export interface ChartDataPoint {
  label: string;
  value: number;
  displayValue: string;
}

interface RevenueChartProps {
  title?: string;
  timeframes?: string[];
  activeTimeframe?: string;
  onTimeframeChange?: (timeframe: string) => void;
  data?: ChartDataPoint[];
  yearLabel?: string;
  className?: string;
}

export default function RevenueChart({
  title = "Revenue",
  timeframes = ["Last 30 Days", "Last 6 Months", "This Year"],
  activeTimeframe = "Last 30 Days",
  onTimeframeChange,
  data = [
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
  yearLabel = "2025",
  className = "",
}: RevenueChartProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(3); // Default hover on April to match the user's mockup!

  const handleTimeframeClick = (tf: string) => {
    if (onTimeframeChange) onTimeframeChange(tf);
    setDropdownOpen(false);
  };

  // Dimensions of our SVG chart container
  const width = 600;
  const height = 260;
  const paddingX = 40;
  const paddingY = 30;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Find max value for scaling
  const maxValue = 100; // Constrained to 100k for neatness

  // Calculate coordinates for points
  const points = data.map((d, index) => {
    const x = paddingX + (index / (data.length - 1)) * chartWidth;
    const y = paddingY + chartHeight - (d.value / maxValue) * chartHeight;
    return { x, y, ...d };
  });

  // Generate SVG path for wavy line (Catmull-Rom or Cubic Bezier interpolation)
  const getWavyPath = () => {
    if (points.length === 0) return "";
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      // Control points for smooth bezier interpolation
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    return path;
  };

  // Generate closed SVG path for filled area under the curve
  const getAreaPath = () => {
    const wavy = getWavyPath();
    if (!wavy) return "";
    return `${wavy} L ${points[points.length - 1].x} ${paddingY + chartHeight} L ${points[0].x} ${paddingY + chartHeight} Z`;
  };

  return (
    <Card className={`max-w-none !p-6 flex flex-col hover:shadow-md border border-zinc-100 dark:border-zinc-800 transition-all duration-300 select-none ${className}`}>
      {/* Header Info */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[20px] font-semibold text-[#333839] dark:text-[#333839]">
          {title}
        </h3>

        {/* Timeframe Dropdown Select */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/40 text-[12px] font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100/50 transition-all cursor-pointer"
          >
            <span>{activeTimeframe}</span>
            <svg
              className={`w-3 h-3 text-zinc-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""
                }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute top-full right-0 mt-1 w-36 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg z-25 py-1 overflow-hidden animate-fade-in">
              {timeframes.map((tf, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTimeframeClick(tf)}
                  className={`w-full text-left px-3.5 py-2 text-[12px] font-bold hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors cursor-pointer ${tf === activeTimeframe ? "bg-zinc-50/80 dark:bg-zinc-700/30 text-[#0A46A6]" : "text-zinc-600 dark:text-zinc-300"
                    }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="relative w-full overflow-x-auto scrollbar-hide py-1">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[500px] h-auto overflow-visible">
          <defs>
            {/* Smooth emerald gradient for the area chart */}
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#718EEC4D" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#718EEC0D" stopOpacity="0.00" />
            </linearGradient>
          </defs>

          {/* Y-Axis Horizontal Gridlines */}
          {[0, 25, 50, 75, 100].map((val) => {
            const y = paddingY + chartHeight - (val / maxValue) * chartHeight;
            return (
              <g key={val} className=" ">
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#E4E4E7"
                  strokeWidth={1}
                  strokeDasharray="4,4"
                />
                <text
                  x={paddingX - 10}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[12px] fill-[#000000B2] dark:fill-zinc-500 font-semibold"
                >
                  {val === 0 ? "0" : `${val}k`}
                </text>
              </g>
            );
          })}

          {/* Wavy Gradient Area Path */}
          <path d={getAreaPath()} fill="url(#areaGradient)" />

          {/* Core Green Stroke Path */}
          <path
            d={getWavyPath()}
            fill="none"
            stroke="#0A46A6"
            strokeWidth={1.5}
            strokeLinecap="round"
          />

          {/* Interactive Hover Nodes */}
          {points.map((pt, idx) => (
            <g
              key={idx}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="cursor-pointer group/node"
            >
              {/* Invisible touch target */}
              <circle cx={pt.x} cy={pt.y} r={12} fill="transparent" />

              {/* Dynamic point highlight circle */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredIndex === idx ? 5.5 : 3.5}
                fill={hoveredIndex === idx ? "#0A46A6" : "#ffffff"}
                stroke="#0A46A6"
                strokeWidth={hoveredIndex === idx ? 3.5 : 2}
                className="transition-all duration-200"
              />
            </g>
          ))}

          {/* X-Axis Monthly Labels */}
          {points.map((pt, idx) => (
            <text
              key={idx}
              x={pt.x}
              y={height - paddingY + 18}
              textAnchor="middle"
              className="text-[12px] fill-black/70 dark:fill-zinc-500 font-semibold uppercase"
            >
              {pt.label}
            </text>
          ))}
        </svg>

        {/* Floating Custom Tooltip (Absolute overlay matching the selected index) */}
        {hoveredIndex !== null && points[hoveredIndex] && (
          <div
            style={{
              left: `${(points[hoveredIndex].x / width) * 100}%`,
              top: `${(points[hoveredIndex].y / height) * 100 - 15}%`,
              transform: "translate(-50%, -100%)",
            }}
            className="absolute bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 shadow-lg rounded-xl py-2 px-3 flex flex-col gap-0.5 pointer-events-none select-none z-10 animate-fade-in text-center min-w-[110px]"
          >
            <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
              {data[hoveredIndex].label}
            </span>
            <div className="flex items-center justify-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-linear-to-r from-[#041B40] to-[#0A46A6]" />
              <span className="text-[11.5px] font-black text-zinc-800 dark:text-white">
                {data[hoveredIndex].displayValue}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Year / Indicator */}
      <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-zinc-50 dark:border-zinc-800/60 select-none">
        <div className="flex items-center gap-1.5 text-[12px] text-[#000000B2] dark:text-zinc-500 uppercase">
          <svg className="w-3.5 h-3.5 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{yearLabel}</span>
        </div>
      </div>
    </Card>
  );
}
