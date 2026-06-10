"use client";

import { Camera, X } from "lucide-react";
import { useRef } from "react";

interface ReviewPhotoUploadProps {
  previewUrl: string | null;
  onChange: (file: File | null) => void;
}

const ReviewPhotoUpload = ({ previewUrl, onChange }: ReviewPhotoUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    onChange(file);
  };

  const handleRemove = () => {
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  if (previewUrl) {
    return (
      <div className="relative h-28 w-full overflow-hidden rounded-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={previewUrl} alt="Review photo preview" className="h-full w-full object-cover" />
        <button
          type="button"
          aria-label="Remove photo"
          onClick={handleRemove}
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[#334155] shadow-sm"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex h-28 w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] text-[#64748B] transition-colors hover:border-[#94A3B8]"
      >
        <Camera className="h-6 w-6" />
        <span className="text-sm font-medium">Upload Photos</span>
      </button>
    </>
  );
};

export default ReviewPhotoUpload;
