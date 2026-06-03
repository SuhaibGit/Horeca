import React from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
  error?: string;
}

export default function Checkbox({
  label,
  error,
  id,
  className = "",
  ...props
}: CheckboxProps) {
  return (
    <div className="space-y-1.5 w-full">
      <label className="flex items-start gap-3 cursor-pointer group select-none">
        <input
          id={id}
          type="checkbox"
          className={`mt-0.5 w-4 h-4 text-[#0A46A6] border-zinc-300 dark:border-zinc-700 rounded focus:ring-[#0A46A6] accent-[#0A46A6] cursor-pointer ${className}`}
          {...props}
        />
        <span className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium ">
          {label}
        </span>
      </label>
      {error && (
        <p className="text-xs text-red-500 font-medium select-none">{error}</p>
      )}
    </div>
  );
}
