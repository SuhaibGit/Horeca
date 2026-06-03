"use client";

import React, { useState } from "react";
import Card from "../Card";

export interface ChannelData {
  name: string;
  value: number;
  displayValue: string;
  percentage: number;
  color: string;
  hoverColor: string;
}

interface ChannelChartProps {
  title?: string;
  totalLabel?: string;
  totalValue?: string;
  data?: ChannelData[];
  className?: string;
}

export default function ChannelChart({
  title = "Revenue by Channel",
  totalLabel = "Total",
  totalValue = "AED 126,430",
  data = [
    {
      name: "Dine in",
      value: 68480,
      displayValue: "AED 68,480",
      percentage: 54,
      color: "#3CCB7F",
      hoverColor: "#3CCB7F",
    },
    {
      name: "Online Ordering",
      value: 840,
      displayValue: "AED 840",
      percentage: 24,
      color: "#FD853A",
      hoverColor: "#EA580C",
    },
    {
      name: "Delivery",
      value: 680,
      displayValue: "AED 680",
      percentage: 12,
      color: "#EF4444",
      hoverColor: "#DC2626",
    },
    {
      name: "Takeaway",
      value: 7040,
      displayValue: "AED 7,040",
      percentage: 10,
      color: "#53B1FD",
      hoverColor: "#2563EB",
    },
  ],
  className = "",
}: ChannelChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // SVG calculations for a clean donut chart
  const size = 180;
  const radius = 65;
  const strokeWidth = 16;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  // Compute accumulated percentages to draw continuous circular arcs
  let accumulatedPercentage = 0;
  const segments = data.map((d, index) => {
    const strokeDashoffset = circumference - (d.percentage / 100) * circumference;
    const strokeDasharray = `${circumference} ${circumference}`;
    const rotation = (accumulatedPercentage / 100) * 360 - 90; // Rotate starting position
    accumulatedPercentage += d.percentage;

    return {
      ...d,
      strokeDashoffset,
      strokeDasharray,
      rotation,
      index,
    };
  });

  return (
    <Card className={`max-w-none !p-6 flex flex-col justify-between hover:shadow-md border border-zinc-100 dark:border-zinc-800 transition-all duration-300 select-none h-full ${className}`}>
      <h3 className="text-[20px] font-semibold text-[#333839] dark:text-zinc-200 mb-4">
        {title}
      </h3>

      {/* Donut Chart visual ring */}
      <div className="relative flex justify-center py-4 select-none">
        <svg width={size} height={size} className="transform overflow-visible">
          {segments.map((seg) => {
            const isHovered = hoveredIndex === seg.index;
            return (
              <circle
                key={seg.index}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={isHovered ? seg.hoverColor : seg.color}
                strokeWidth={isHovered ? strokeWidth + 3 : strokeWidth}
                strokeDasharray={seg.strokeDasharray}
                strokeDashoffset={seg.strokeDashoffset}
                transform={`rotate(${seg.rotation} ${center} ${center})`}
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(seg.index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}
        </svg>

        {/* Text inside the Center hole of the Ring */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
          <span className="text-[16px] tracking-[-0.18px] font-semibold text-[#333839] dark:text-white">
            {hoveredIndex !== null ? data[hoveredIndex].displayValue : totalValue}
          </span>
          <span className="text-[14px] text-[#717680] dark:text-zinc-500 font-medium uppercase tracking-wider">
            {hoveredIndex !== null ? data[hoveredIndex].name : totalLabel}
          </span>
        </div>
      </div>

      {/* Legends list */}
      <div className="space-y-1  border-t border-zinc-50 dark:border-zinc-800/60 pt-2">
        {data.map((item, idx) => (
          <div
            key={idx}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`flex items-center justify-between py-0.5 rounded-lg px-2 transition-all duration-200 cursor-pointer ${hoveredIndex === idx ? "bg-zinc-50 dark:bg-zinc-800/40" : ""
              }`}
          >
            {/* Color Dot + Name label */}
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[14px]  text-[#717680] dark:text-zinc-400">
                {item.name}
              </span>
            </div>

            {/* Total value */}
            <span className="text-[16px] font-medium text-zinc-800 dark:text-white">
              {item.displayValue}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
