"use client";

import React from "react";

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  error?: string;
}

export default function SelectField({
  label,
  options,
  placeholder = "Select...",
  error,
  id,
  className = "",
  ...props
}: SelectFieldProps) {
  return (
    <div className="space-y-1.5 w-full">
      <label
        htmlFor={id}
        className="text-[14px] font-medium text-[#454545] block select-none"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          className={`w-full appearance-none px-4 py-3.5 pr-10 bg-white dark:bg-zinc-800/40 border ${error
            ? "border-red-500 focus:ring-red-500"
            : "border-[#DCDFE4] focus:ring-[#0A46A6]/80 focus:border-[#0A4E35]/80"
            } rounded-xl text-zinc-800 dark:text-white focus:outline-none focus:ring-1 transition-all text-[13px] font-medium cursor-pointer ${className}`}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-zinc-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}
