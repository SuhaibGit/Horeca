"use client";

import React, { useState } from "react";

interface InviteFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function InviteForm({ onSuccess, onCancel }: InviteFormProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("staff");
  const [tables, setTables] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSubmitting(false);
    setSubmitted(true);
    if (onSuccess) onSuccess();
  };

  const toggleTable = (tab: string) => {
    if (tables.includes(tab)) {
      setTables(tables.filter((t) => t !== tab));
    } else {
      setTables([...tables, tab]);
    }
  };

  if (submitted) {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100 dark:border-emerald-900/50">
          <svg
            className="w-8 h-8 text-emerald-600 dark:text-emerald-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Invitation Sent!</h3>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
          An invitation code has been successfully dispatched to <span className="font-semibold">{email}</span>.
        </p>
        <button
          onClick={onCancel}
          className="mt-6 px-5 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
        >
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-6">
      <div>
        <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Invite Team Member</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Add new hostesses, waiters, or managers to your HORECAS workspace.
        </p>
      </div>

      {/* Email field */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-zinc-400 tracking-wider uppercase">
          Email Address
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="colleague@horeca.com"
          className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700/50 rounded-xl text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4E35]"
        />
      </div>

      {/* Role selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-zinc-400 tracking-wider uppercase block">
          Platform Role
        </label>
        <div className="grid grid-cols-3 gap-2">
          {["admin", "manager", "staff"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`py-2 px-3 text-xs font-semibold rounded-lg capitalize border transition-all cursor-pointer ${
                role === r
                  ? "bg-[#0A4E35]/10 border-[#0A4E35] text-[#0A4E35] dark:text-emerald-400 dark:bg-emerald-500/10"
                  : "bg-transparent border-zinc-100 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Table access selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-zinc-400 tracking-wider uppercase block">
          Assigned Dining Zones
        </label>
        <div className="flex flex-wrap gap-1.5">
          {["Zone A", "Zone B", "Zone C", "VIP Area", "Outdoor Patio", "Bar Area"].map((zone) => {
            const isSelected = tables.includes(zone);
            return (
              <button
                key={zone}
                type="button"
                onClick={() => toggleTable(zone)}
                className={`py-1.5 px-3 text-xs rounded-full border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#0A4E35] text-white border-transparent"
                    : "bg-zinc-50 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 border-zinc-100 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                {zone}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 bg-[#0A4E35] hover:bg-[#073625] text-white text-sm font-semibold rounded-xl transition-all shadow disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? "Sending..." : "Send Invitation"}
        </button>
      </div>
    </form>
  );
}
