"use client";

import { X } from "lucide-react";

interface DeliveryAddressSheetProps {
  open: boolean;
  address: string;
  onClose: () => void;
  onChange: (address: string) => void;
  onSave: () => void;
}

const DeliveryAddressSheet = ({
  open,
  address,
  onClose,
  onChange,
  onSave,
}: DeliveryAddressSheetProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/40">
      <button type="button" className="absolute inset-0" aria-label="Close" onClick={onClose} />

      <div className="relative z-10 w-full rounded-t-3xl bg-white px-4 pb-8 pt-5">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#111827]">Delivery Address</h3>
          <button type="button" onClick={onClose} aria-label="Close delivery address sheet">
            <X className="h-5 w-5 text-[#64748B]" />
          </button>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[#111827]">
            Address <span className="text-red-500">*</span>
          </span>
          <textarea
            value={address}
            onChange={(event) => onChange(event.target.value)}
            rows={3}
            placeholder="Enter your delivery address"
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-[#111827] outline-none placeholder:text-[#94A3B8] focus:border-[#0A46A6]"
          />
        </label>

        <button
          type="button"
          onClick={onSave}
          disabled={!address.trim()}
          className="mt-5 w-full rounded-full bg-gradient-to-r from-[#041B40] to-[#0A46A6] px-6 py-3.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          Save Address
        </button>
      </div>
    </div>
  );
};

export default DeliveryAddressSheet;
