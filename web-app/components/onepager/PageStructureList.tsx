"use client";

import React from "react";
import { useBuilder } from "./BuilderContext";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, MoreVertical, Layout, Type, Image as ImageIcon, Link as LinkIcon, Star, MessageSquare } from "lucide-react";
import { SectionType } from "./types";

const getSectionIcon = (type: SectionType) => {
  switch (type) {
    case "Header": return <Layout className="w-4 h-4" />;
    case "Hero": return <ImageIcon className="w-4 h-4" />;
    case "PrimaryActions": return <LinkIcon className="w-4 h-4" />;
    case "Promotions": return <Star className="w-4 h-4" />;
    case "Reviews": return <MessageSquare className="w-4 h-4" />;
    default: return <Type className="w-4 h-4" />;
  }
};

function SortableItem({ id, type, isSelected, onSelect }: { id: string, type: SectionType, isSelected: boolean, onSelect: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between px-2 py-2 border rounded-lg mb-1.5 bg-white dark:bg-[#2C2C2E] cursor-pointer transition-colors ${isSelected
        ? "border-[#0B2870] ring-1 ring-[#0B2870] dark:border-[#3858A6] dark:ring-[#3858A6]"
        : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
        }`}
      onClick={onSelect}
    >
      <div className="flex items-center gap-1.5 min-w-0">
        <button {...attributes} {...listeners} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-grab active:cursor-grabbing shrink-0">
          <GripVertical className="w-3 h-3" />
        </button>
        <div className="text-gray-500 dark:text-gray-400 shrink-0">
          {getSectionIcon(type)}
        </div>
        <span className="text-[12px] font-medium text-gray-700 dark:text-gray-300 truncate">
          {type === 'PrimaryActions' ? 'Actions' : type}
        </span>
      </div>
      <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 shrink-0">
        <MoreVertical className="w-3 h-3" />
      </button>
    </div>
  );
}

export default function PageStructureList() {
  const { sections, setSections, selectedSectionId, setSelectedSectionId } = useBuilder();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sections.map(s => s.id)}
        strategy={verticalListSortingStrategy}
      >
        {sections.map((section) => (
          <SortableItem
            key={section.id}
            id={section.id}
            type={section.type}
            isSelected={selectedSectionId === section.id}
            onSelect={() => setSelectedSectionId(section.id)}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}
