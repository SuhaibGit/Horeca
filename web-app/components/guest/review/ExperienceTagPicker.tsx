"use client";

import {
  Armchair,
  Banknote,
  Leaf,
  Smile,
  Soup,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { ExperienceTag, ExperienceTagIcon } from "./types";

const iconMap: Record<ExperienceTagIcon, LucideIcon> = {
  food: Soup,
  staff: Smile,
  service: Zap,
  ambience: Armchair,
  value: Banknote,
  clean: Leaf,
};

interface ExperienceTagPickerProps {
  tags: ExperienceTag[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}

const ExperienceTagPicker = ({ tags, selectedIds, onToggle }: ExperienceTagPickerProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const selected = selectedIds.includes(tag.id);
        const Icon = iconMap[tag.icon];

        return (
          <button
            key={tag.id}
            type="button"
            onClick={() => onToggle(tag.id)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition-colors ${
              selected
                ? "border-[#041B40] bg-[#041B40] text-white"
                : "border-[#E5E7EB] bg-white text-[#334155]"
            }`}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            {tag.label}
          </button>
        );
      })}
    </div>
  );
};

export default ExperienceTagPicker;
