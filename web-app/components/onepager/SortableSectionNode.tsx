"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SectionData } from "./types";
import { useBuilder } from "./BuilderContext";
import { SectionContent } from "./SectionRenderer";

export default function SortableSectionNode({ data }: { data: SectionData }) {
  const { selectedSectionId, setSelectedSectionId } = useBuilder();
  const isSelected = selectedSectionId === data.id;

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: data.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${data.type === "Header" ? "h-0" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedSectionId(data.id);
      }}
    >
      <div
        className={`absolute inset-0 -m-1 border-2 rounded-xl z-30 pointer-events-none transition-colors ${
          isSelected ? "border-blue-500" : "border-transparent group-hover:border-blue-500/50"
        }`}
      />

      <div
        {...attributes}
        {...listeners}
        className={`absolute top-2 right-2 z-40 bg-white shadow-md rounded border border-gray-200 p-1 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity ${
          data.type === "Header" ? "hidden" : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-4 h-4 flex flex-wrap gap-[2px] items-center justify-center text-gray-400">
          <div className="w-1.5 h-1.5 bg-current rounded-[1px]" />
          <div className="w-1.5 h-1.5 bg-current rounded-[1px]" />
          <div className="w-1.5 h-1.5 bg-current rounded-[1px]" />
          <div className="w-1.5 h-1.5 bg-current rounded-[1px]" />
        </div>
      </div>

      <SectionContent data={data} />
    </div>
  );
}
