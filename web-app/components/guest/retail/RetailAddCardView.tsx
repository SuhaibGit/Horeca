"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { retailPageData } from "@/data/retailProducts";
import { useRetailCart } from "@/contexts/RetailCartContext";
import GuestPageHeader from "@/components/guest/GuestPageHeader";
import PrimaryButton from "@/components/guest/PrimaryButton";

export default function RetailAddCardView() {
  const router = useRouter();
  const { setPayment } = useRetailCart();
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const handleContinue = () => {
    const last4 = cardNumber.replace(/\s/g, "").slice(-4) || "4542";
    setPayment("pm-retail", `MasterCard *${last4}`);
    router.push("/shop/checkout");
  };

  return (
    <div className="w-full bg-white pb-28">
      <GuestPageHeader
        title=""
        heroImage={retailPageData.heroImage}
        backHref="/shop/checkout"
        showTitle={false}
      />

      <div className="relative z-10 -mt-6 rounded-t-3xl bg-white px-4 pt-6">
        <h1 className="text-2xl font-bold text-[#111827]">Add Payment Method</h1>

        <div className="mt-6 space-y-4">
          <Field label="Name on Card" required value={name} onChange={setName} placeholder="Marcus Alonso" />
          <Field
            label="Card Number"
            required
            value={cardNumber}
            onChange={setCardNumber}
            placeholder="1234 5678 9101 1121"
          />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Expiry Date" required value={expiry} onChange={setExpiry} placeholder="02 25" />
            <Field label="CVC/CVV" required value={cvc} onChange={setCvc} placeholder="124" />
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 bg-white px-4 py-4">
        <div className="mx-auto w-full max-w-md">
          <PrimaryButton onClick={handleContinue}>Continue</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[#111827]">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-gray-200 bg-[#F9FAFB] px-4 py-3.5 text-sm text-[#111827] outline-none placeholder:text-[#94A3B8] focus:border-[#0A46A6]"
      />
    </label>
  );
}
