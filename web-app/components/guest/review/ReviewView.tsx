"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import GuestPageHeader from "@/components/guest/GuestPageHeader";
import PrimaryButton from "@/components/guest/PrimaryButton";
import ExperienceTagPicker from "./ExperienceTagPicker";
import RestaurantReviewCard from "./RestaurantReviewCard";
import ReviewPhotoUpload from "./ReviewPhotoUpload";
import StarRating from "./StarRating";
import type { ReviewPageData } from "./types";

interface ReviewViewProps {
  data: ReviewPageData;
}

const ReviewView = ({ data }: ReviewViewProps) => {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [reviewText, setReviewText] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!photoFile) {
      setPhotoPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(photoFile);
    setPhotoPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photoFile]);

  const toggleTag = (id: string) => {
    setSelectedTagIds((current) =>
      current.includes(id) ? current.filter((tagId) => tagId !== id) : [...current, id]
    );
  };

  const handlePhotoChange = (file: File | null) => {
    setPhotoFile(file);
  };

  const handleSubmit = () => {
    if (rating < 1) return;
    router.push("/review/submitted");
  };

  return (
    <div className="w-full bg-white pb-28">
      <GuestPageHeader
        title={data.title}
        description={data.description}
        heroImage={data.heroImage}
        backHref="/main"
        heightClass="h-[240px]"
      />

      <div className="relative z-10 -mt-6 rounded-t-3xl bg-white px-4 pt-6">
        <RestaurantReviewCard restaurant={data.restaurant} />

        <section className="mt-6">
          <h2 className="text-sm font-semibold text-[#111827]">
            How was your overall experience?
          </h2>
          <div className="mt-3">
            <StarRating value={rating} onChange={setRating} />
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-sm font-semibold text-[#111827]">
            Tell us more about your experience{" "}
            <span className="font-normal text-[#64748B]">(Optional)</span>
          </h2>
          <div className="mt-3">
            <ExperienceTagPicker
              tags={data.experienceTags}
              selectedIds={selectedTagIds}
              onToggle={toggleTag}
            />
          </div>
        </section>

        <section className="mt-6">
          <label htmlFor="review-text" className="text-sm font-semibold text-[#111827]">
            Write your review
          </label>
          <textarea
            id="review-text"
            value={reviewText}
            onChange={(event) => setReviewText(event.target.value)}
            placeholder="Share more about your experience"
            rows={4}
            className="mt-3 w-full resize-none rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#111827] placeholder:text-[#94A3B8] outline-none focus:border-[#0A46A6]"
          />
        </section>

        <section className="mt-6">
          <h2 className="text-sm font-semibold text-[#111827]">
            Add Photos <span className="font-normal text-[#64748B]">(Optional)</span>
          </h2>
          <div className="mt-3">
            <ReviewPhotoUpload previewUrl={photoPreviewUrl} onChange={handlePhotoChange} />
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#F1F5F9] bg-white px-4 py-4">
        <PrimaryButton onClick={handleSubmit} disabled={rating < 1}>
          {data.submitLabel}
        </PrimaryButton>
      </div>
    </div>
  );
};

export default ReviewView;
