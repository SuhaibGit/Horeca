"use client";

import React from "react";
import Image from "next/image";

interface EmptyStateProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description?: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  imageSrc,
  imageAlt,
  title,
  description,
  className = "",
  action,
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-4 text-center space-y-4 animate-fade-in select-none ${className}`}
    >
      <div className="relative w-64 h-64 md:w-80 md:h-80 mb-2">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          className="object-contain"
        />
      </div>

      <h4 className="text-[20px] font-bold text-[#333839] dark:text-white tracking-tight">
        {title}
      </h4>

      <p className="text-[14px] font-medium text-zinc-500 dark:text-zinc-400 max-w-md leading-relaxed">
        {description}
      </p>

      {action && <div className="pt-2 w-full max-w-sm">{action}</div>}
    </div>
  );
}
