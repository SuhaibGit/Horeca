"use client";

import React from "react";
import { useBuilder } from "./BuilderContext";
import PageStructureList from "./PageStructureList";
import { SectionType } from "./types";
import {
  Type, Image as ImageIcon, Video, Square, Minus,
  Link as LinkIcon, Smile, Share2
} from "lucide-react";

const elements = [
  { icon: <Square className="w-5 h-5 text-gray-400" />, label: "Button" },
  { icon: <ImageIcon className="w-5 h-5 text-gray-400" />, label: "Image" },
  { icon: <Video className="w-5 h-5 text-gray-400" />, label: "Video" },
  { icon: <Type className="w-5 h-5 text-gray-400" />, label: "Text" },
  { icon: <Minus className="w-5 h-5 text-gray-400" />, label: "Divider" },
  { icon: <div className="w-5 h-5 border border-dashed border-gray-400 text-[10px] flex items-center justify-center text-gray-400 rounded-sm">I</div>, label: "Spacer" },
  { icon: <Smile className="w-5 h-5 text-gray-400" />, label: "Icon" },
  { icon: <LinkIcon className="w-5 h-5 text-gray-400" />, label: "Social Links" },
];

const availableSections: { label: string; type: SectionType }[] = [
  { label: "Header", type: "Header" },
  { label: "Hero", type: "Hero" },
  { label: "Primary Actions", type: "PrimaryActions" },
  { label: "Promotions / Events", type: "Promotions" },
  { label: "Reviews", type: "Reviews" },
  // { label: "Footer", type: "Footer" },
];

export default function BuilderSidebarLeft() {
  const { addSection } = useBuilder();

  return (
    <div className="flex h-full shrink-0">
      {/* Column 1: Add Elements + Section */}
      <div className="w-[279px] bg-white dark:bg-[#1C1C1E] border-r border-gray-200 dark:border-gray-800 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
          {/* Add Elements Section */}
          <div className="mb-6">
            <h3 className="text-[14px] font-semibold text-gray-900 dark:text-white mb-0.5">Add Elements</h3>
            <p className="text-[12px] text-[#717680] mb-3">Drag and drop elements to build your page</p>
            <div className="grid grid-cols-3 gap-2">
              {elements.map((el, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center p-2 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-sm transition-all cursor-grab bg-white dark:bg-[#2C2C2E]"
                >
                  <div className="mb-1">{el.icon}</div>
                  <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400">{el.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section List */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-0.5">Section</h3>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-3">Add pre built sections to your page</p>
            <div className="space-y-1.5">
              {availableSections.map((sec, i) => (
                <button
                  key={i}
                  onClick={() => addSection(sec.type)}
                  className="w-full flex items-center gap-2 p-2.5 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-sm transition-all bg-white dark:bg-[#2C2C2E] text-left"
                >
                  <div className="w-4 h-4 flex flex-wrap gap-[2px] items-center justify-center opacity-40">
                    <div className="w-1.5 h-1.5 rounded-[1px] bg-current"></div>
                    <div className="w-1.5 h-1.5 rounded-[1px] bg-current"></div>
                    <div className="w-1.5 h-1.5 rounded-[1px] bg-current"></div>
                    <div className="w-1.5 h-1.5 rounded-[1px] bg-current"></div>
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{sec.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Column 2: Page Structure */}
      <div className="w-[220px] bg-white dark:bg-[#1C1C1E] border-r border-gray-200 dark:border-gray-800 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
          <h3 className="text-[14px] font-semibold text-gray-900 dark:text-white mb-0.5">Page Structure</h3>
          <p className="text-[12px] text-[#717680] mb-3">Drag to reorder sections</p>
          <PageStructureList />
        </div>
      </div>
    </div>
  );
}
