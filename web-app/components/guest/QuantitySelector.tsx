import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
}

const QuantitySelector = ({ value, onChange, min = 1 }: QuantitySelectorProps) => {
  return (
    <div className="inline-flex items-center gap-4 rounded-full border border-gray-200 px-3 py-2">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="text-[#334155]"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="min-w-[16px] text-center text-sm font-semibold text-[#111827]">
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(value + 1)}
        className="text-[#334155]"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
};

export default QuantitySelector;
