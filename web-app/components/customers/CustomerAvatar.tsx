"use client";

import React from "react";

interface CustomerAvatarProps {
  name: string;
  color: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const sizeMap = {
  sm: "w-9 h-9 text-[11px]",
  md: "w-10 h-10 text-[12px]",
  lg: "w-16 h-16 text-[18px]",
};

export default function CustomerAvatar({
  name,
  color,
  size = "md",
  className = "",
}: CustomerAvatarProps) {
  return (
    <div
      className={`${sizeMap[size]} rounded-full flex items-center justify-center font-bold text-white shrink-0 ${className}`}
      style={{ backgroundColor: color }}
      aria-hidden
    >
      {getInitials(name)}
    </div>
  );
}
