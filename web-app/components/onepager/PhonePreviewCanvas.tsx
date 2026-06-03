"use client";

import React from "react";
import { useBuilder } from "./BuilderContext";
import SortableSectionNode from "./SortableSectionNode";
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
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { Wifi, Battery, Signal } from "lucide-react";

export default function PhonePreviewCanvas() {
  const { sections, setSections, setSelectedSectionId } = useBuilder();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
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
    <div
      className="flex-1 bg-[#F9FAFB] dark:bg-[#151515] overflow-y-auto  flex items-center justify-center p-8 min-w-[400px]"
      onClick={() => setSelectedSectionId(null)}
    >
      <div
        className="w-[250px] h-[500px] bg-white rounded-[40px] shadow-2xl scrollbar-hide relative border-[8px] border-gray-900 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dynamic Island / Notch Area */}
        <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-50 scrollbar-hide pointer-events-none">
          <div className="w-[120px] h-6 bg-gray-900 rounded-b-3xl"></div>
        </div>

        {/* Status Bar */}
        <div className="flex justify-between items-center px-6 pt-3 pb-2 text-white z-50 pointer-events-none text-xs font-medium relative mix-blend-difference">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Scrollable Phone Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide relative bg-[#061413]">
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
                <SortableSectionNode key={section.id} data={section} />
              ))}
            </SortableContext>
          </DndContext>

          {/* Powered by Horeca footer */}
          <div className="text-center py-6 pb-8">
            <span className="text-[9px] font-medium text-gray-500 uppercase tracking-widest">Powered by Horeca</span>
          </div>
        </div>

        {/* Bottom Home Indicator */}
        <div className="absolute bottom-1.5 inset-x-0 flex justify-center z-50 pointer-events-none">
          <div className="w-[120px] h-1.5 bg-black/20 dark:bg-white/20 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
