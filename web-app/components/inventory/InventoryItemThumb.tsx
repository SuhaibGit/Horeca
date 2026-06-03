"use client";

import React from "react";

interface InventoryItemThumbProps {
  emoji: string;
  color: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "w-9 h-9 text-lg",
  md: "w-11 h-11 text-xl",
  lg: "w-20 h-14 text-2xl",
};

export default function InventoryItemThumb({
  emoji,
  color,
  size = "sm",
}: InventoryItemThumbProps) {
  return (
    <div
      className={`${sizes[size]} rounded-lg flex items-center justify-center shrink-0`}
      style={{ backgroundColor: color }}
      aria-hidden
    >
      {emoji}
    </div>
  );
}
