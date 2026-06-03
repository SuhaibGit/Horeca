"use client";

import React from "react";
import { Wifi, Battery, Signal } from "lucide-react";
import { useBuilder } from "./BuilderContext";
import { SectionContent } from "./SectionRenderer";

interface ReadOnlyPhonePreviewProps {
  className?: string;
}

export default function ReadOnlyPhonePreview({ className = "" }: ReadOnlyPhonePreviewProps) {
  const { sections } = useBuilder();

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="w-[300px] h-[600px] bg-white rounded-[40px] shadow-2xl relative border-[10px] border-gray-900 overflow-hidden flex flex-col">
        <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-50 pointer-events-none">
          <div className="w-[120px] h-6 bg-gray-900 rounded-b-3xl" />
        </div>

        <div className="flex justify-between items-center px-6 pt-3 pb-2 text-white z-50 pointer-events-none text-xs font-medium relative mix-blend-difference">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide relative bg-[#061413]">
          {sections.map((section) => (
            <div key={section.id} className={`relative ${section.type === "Header" ? "h-0" : ""}`}>
              <SectionContent data={section} />
            </div>
          ))}

          <div className="text-center py-6 pb-8">
            <span className="text-[9px] font-medium text-gray-500 uppercase tracking-widest">Powered by Horeca</span>
          </div>
        </div>

        <div className="absolute bottom-1.5 inset-x-0 flex justify-center z-50 pointer-events-none">
          <div className="w-[120px] h-1.5 bg-black/20 rounded-full" />
        </div>
      </div>
    </div>
  );
}
