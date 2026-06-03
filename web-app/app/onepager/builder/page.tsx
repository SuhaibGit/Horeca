"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { BuilderProvider, useBuilder } from "@/components/onepager/BuilderContext";
import BuilderSidebarLeft from "@/components/onepager/BuilderSidebarLeft";
import PhonePreviewCanvas from "@/components/onepager/PhonePreviewCanvas";
import BuilderSidebarRight from "@/components/onepager/BuilderSidebarRight";



function BuilderPageContent() {
  const router = useRouter();
  const { saveSections } = useBuilder();

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-[#1C1C1E]">
      {/* Top Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/onepager" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-2 rounded-full border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => {
              saveSections();
              router.push("/dashboard/onepager?updated=1&status=unpublished&view=preview");
            }}
            className="px-6 py-2 rounded-full bg-gradient-to-r from-[#041B40] to-[#0A46A6] hover:bg-gradient-to-r from-[#041B40] to-[#0A46A6]/90 text-white text-sm font-medium transition-colors"
          >
            Save Changes
          </button>
        </div>
      </header>

      {/* Main Builder Area */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <BuilderSidebarLeft />

        {/* Center Canvas */}
        <PhonePreviewCanvas />

        {/* Right Sidebar */}
        <BuilderSidebarRight />
      </main>
    </div>
  );
}

export default function OnePagerBuilderPage() {
  return (
    <BuilderProvider>
      <BuilderPageContent />
    </BuilderProvider>
  );
}
