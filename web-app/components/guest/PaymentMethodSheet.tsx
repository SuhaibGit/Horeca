"use client";

import { CreditCard, Trash2, X } from "lucide-react";
import type { PaymentMethod } from "./types";

interface PaymentMethodSheetProps {
  open: boolean;
  methods: PaymentMethod[];
  selectedId: string | null;
  onClose: () => void;
  onSelect: (id: string) => void;
  onAddNew: () => void;
}

function CardBrandBadge({ brand }: { brand: PaymentMethod["brand"] }) {
  if (brand === "visa") {
    return <span className="text-xs font-bold text-[#1A1F71]">VISA</span>;
  }
  return <span className="text-xs font-bold text-[#EB001B]">MC</span>;
}

const PaymentMethodSheet = ({
  open,
  methods,
  selectedId,
  onClose,
  onSelect,
  onAddNew,
}: PaymentMethodSheetProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/40">
      <button type="button" className="absolute inset-0" aria-label="Close" onClick={onClose} />

      <div className="relative z-10 w-full rounded-t-3xl bg-white px-4 pb-8 pt-5">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#111827]">Payment Method</h3>
          <button type="button" onClick={onClose} aria-label="Close payment sheet">
            <X className="h-5 w-5 text-[#64748B]" />
          </button>
        </div>

        <div className="space-y-3">
          {methods.map((method) => {
            const selected = method.id === selectedId;

            return (
              <button
                key={method.id}
                type="button"
                onClick={() => onSelect(method.id)}
                className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left ${
                  selected ? "border-[#0A46A6]" : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`h-4 w-4 rounded-full border ${
                      selected ? "border-[#0A46A6] bg-[#0A46A6]" : "border-gray-300"
                    }`}
                  />
                  <CardBrandBadge brand={method.brand} />
                  <div>
                    <p className="text-sm font-medium text-[#111827]">{method.label}</p>
                    <p className="text-xs text-[#64748B]">{method.expiry}</p>
                  </div>
                </div>
                <Trash2 className="h-4 w-4 text-[#94A3B8]" />
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onAddNew}
          className="mt-5 flex w-full items-center gap-2 text-sm font-semibold text-[#0A46A6]"
        >
          <CreditCard className="h-4 w-4" />
          Add New Credit or Debit Card
        </button>
      </div>
    </div>
  );
};

export default PaymentMethodSheet;
