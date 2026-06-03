import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
}

export default function Button({
  children,
  isLoading,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`w-full flex items-center justify-center px-6 py-3.5 bg-linear-to-r from-[#041B40] to-[#0A46A6] hover:bg-[#12503C] dark:bg-linear-to-r from-[#041B40] to-[#0A46A6] dark:hover:bg-[#12503C] text-white font-bold rounded-[100px] shadow-xs hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0A46A6] focus:ring-offset-1 transition-all disabled:opacity-75 disabled:pointer-events-none text-[14px] cursor-pointer ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
}
