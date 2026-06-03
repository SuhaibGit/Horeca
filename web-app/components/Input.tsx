import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
}

export default function Input({
  label,
  icon,
  error,
  id,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="space-y-1.5 w-full">
      <label
        htmlFor={id}
        className="text-[14px] font-medium text-[#454545] block select-none"
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
            {icon}
          </div>
        )}
        <input
          id={id}
          className={`w-full ${icon ? "pl-12" : "px-4"
            } pr-4 py-3.5 bg-white dark:bg-zinc-800/40 border ${error
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-[#DCDFE4] focus:ring-[#0A46A6]/80 focus:border-[#0A4E35]/80"
            } rounded-xl text-zinc-800 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-1 focus:bg-[#f4f5f6] dark:focus:bg-zinc-800/60 transition-all text-[13px] font-medium shadow-2xs ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-500 font-medium select-none">{error}</p>
      )}
    </div>
  );
}
