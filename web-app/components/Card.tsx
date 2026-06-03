import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`w-full max-w-[500px] bg-white dark:bg-zinc-900 rounded-[24px] shadow-[0_16px_48px_-12px_rgba(0,0,0,0.04)] border border-zinc-100 dark:border-zinc-800 p-10 sm:p-12 transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
}
