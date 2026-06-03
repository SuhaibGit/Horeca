"use client";

import React, { useState } from "react";
import Card from "../Card";

export interface PeakHourDataPoint {
  time: string;
  occupancy: number; // 0 to 100 percentage
}

interface PeakHoursChartProps {
  title?: string;
  data?: PeakHourDataPoint[];
  className?: string;
  /** Stretch chart area to fill card height (e.g. beside Category Domain). */
  fillHeight?: boolean;
}

export default function PeakHoursChart({
  title = "Peak Hours Today",
  data = [
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
  className = "",
  fillHeight = false,
}: PeakHoursChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // SVG configuration
  const width = 554;
  const height = 222;
  const paddingX = 40;
  const paddingY = 30;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;
  const maxOccupancy = 100;

  const barWidth = 43;
  const gap = (chartWidth - barWidth * data.length) / (data.length - 1);

  return (
    <Card
      className={`max-w-none !p-6 flex flex-col hover:shadow-md border border-zinc-100 dark:border-zinc-800 transition-all duration-300 select-none h-full ${fillHeight ? "min-h-[420px]" : ""
        } ${className}`}
    >
      <h3 className="text-[20px] font-semibold text-[#333839] dark:text-zinc-200 shrink-0 mb-2">
        {title}
      </h3>

      <div
        className={`relative w-full overflow-x-auto scrollbar-hide py-1 ${fillHeight ? "flex-1 flex flex-col min-h-[280px]" : ""
          }`}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className={`w-full min-w-[400px] overflow-visible ${fillHeight ? "h-full min-h-[280px] flex-1" : "h-auto"
            }`}
          preserveAspectRatio="xMidYMax meet"
        >
          {/* Gradients */}
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#041B40" />
              <stop offset="100%" stopColor="#0A46A6" />
            </linearGradient>

            <linearGradient id="barGradientHover" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#041B40" />
              <stop offset="100%" stopColor="#0A46A6" />
            </linearGradient>
          </defs>

          {/* Horizontal dotted grid lines */}
          {[0, 25, 50, 75, 100].map((val) => {
            const y =
              paddingY + chartHeight - (val / maxOccupancy) * chartHeight;

            return (
              <g key={val} className="opacity-45 dark:opacity-20">
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#E4E4E7"
                  strokeWidth={1}
                  strokeDasharray="3,3"
                />

                <text
                  x={paddingX - 10}
                  y={y + 3.5}
                  textAnchor="end"
                  className="text-[9px] fill-zinc-400 dark:fill-zinc-500 font-semibold"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Bar pillars */}
          {data.map((d, idx) => {
            const x = paddingX + idx * (barWidth + gap);
            const barHeight =
              (d.occupancy / maxOccupancy) * chartHeight;

            const y = paddingY + chartHeight - barHeight;
            const isHovered = hoveredIdx === idx;

            return (
              <g
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer"
              >
                {/* Background hover column */}
                <rect
                  x={x - 8}
                  y={paddingY}
                  width={barWidth + 8}
                  height={chartHeight}
                  fill={
                    isHovered
                      ? "rgba(24,103,78,0.03)"
                      : "transparent"
                  }
                  rx={6}
                  className="transition-all duration-200"
                />

                {/* Gradient bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={
                    isHovered
                      ? "url(#barGradientHover)"
                      : "url(#barGradient)"
                  }
                  rx={6}
                  className="transition-all duration-300"
                />

                {/* Tooltip */}
                {isHovered && (
                  <g className="animate-fade-in">
                    <rect
                      x={x + barWidth / 2 - 20}
                      y={y - 25}
                      width={40}
                      height={18}
                      fill="#111111"
                      rx={4}
                    />

                    <text
                      x={x + barWidth / 2}
                      y={y - 13}
                      textAnchor="middle"
                      fill="#ffffff"
                      className="text-[9px] font-bold"
                    >
                      {d.occupancy}%
                    </text>
                  </g>
                )}

                {/* Time label */}
                <text
                  x={x + barWidth / 2}
                  y={height - paddingY + 16}
                  textAnchor="middle"
                  className="text-[9.5px] fill-zinc-400 dark:fill-zinc-500 font-semibold"
                >
                  {d.time}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </Card>
  );
}
