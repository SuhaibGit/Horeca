"use client";

import React from "react";
import Image from "next/image";
import { SectionData } from "./types";
import {
  Menu,
  ShoppingBag,
  Calendar,
  Tag,
  Gift,
  MessageCircle,
  Star,
  MoreHorizontal,
  MapPin,
  Bell,
  Share2,
  CircleFadingPlus,
} from "lucide-react";

function getActionIcon(iconName?: string) {
  switch (iconName) {
    case "BookOpen":
      return <Menu className="w-5 h-5" />;
    case "ShoppingBag":
      return <ShoppingBag className="w-5 h-5" />;
    case "Calendar":
      return <Calendar className="w-5 h-5" />;
    case "Tag":
      return <Tag className="w-5 h-5" />;
    case "Gift":
      return <Gift className="w-5 h-5" />;
    case "MessageCircle":
      return <MessageCircle className="w-5 h-5" />;
    case "Star":
      return <Star className="w-5 h-5" />;
    case "Instagram":
      return <CircleFadingPlus className="w-5 h-5" />;
    case "MoreHorizontal":
      return <MoreHorizontal className="w-5 h-5" />;
    default:
      return <Star className="w-5 h-5" />;
  }
}

function HeaderSection({ data }: { data: SectionData }) {
  return (
    <div className="flex items-center justify-between p-4 bg-transparent absolute top-0 left-0 right-0 z-10 text-white">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-[#0B2870] font-bold text-xs overflow-hidden relative">
        {data.logo ? <Image src={data.logo} alt="Logo" fill className="object-cover" /> : "Logo"}
      </div>
      {data.showShareButton && (
        <div className="flex gap-2">
          <button type="button" className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Bell className="w-4 h-4" />
          </button>
          <button type="button" className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function HeroSection({ data }: { data: SectionData }) {
  return (
    <div className="relative h-[300px] flex flex-col items-center justify-center text-white px-4 text-center rounded-b-3xl overflow-hidden shrink-0">
      {data.backgroundImage ? (
        <Image src={data.backgroundImage} alt="Hero bg" fill className="object-cover absolute inset-0 z-0" />
      ) : (
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#041B40] to-[#0A46A6]" />
      )}
      <div className="absolute inset-0 bg-black/40 z-0" />
      <div className="relative z-10 mt-10">
        <h1 className="text-3xl font-bold mb-2">{data.heading || "Gudie Cafe"}</h1>
        <p className="text-sm font-medium mb-1 text-green-400">{data.subHeading || "Good Food, Good Mood"}</p>
        <p className="text-xs text-gray-200 mb-4 max-w-[200px]">{data.description || "Fresh ingredients. Cozy Place. Great Vibes."}</p>
        {data.locationBadge && (
          <div className="inline-flex items-center gap-1 bg-[#1A3A28]/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-green-400 border border-green-500/30">
            <MapPin className="w-3 h-3" />
            {data.location || "Blue Area, Islamabad"}
          </div>
        )}
      </div>
    </div>
  );
}

function PrimaryActionsSection({ data }: { data: SectionData }) {
  return (
    <div className="bg-white rounded-3xl -mt-6 relative z-20 px-4 py-6 shadow-sm mx-2">
      <div className="grid grid-cols-3 gap-y-6 gap-x-2">
        {data.actionItems?.map((item, i) => (
          <button key={item.id ?? i} type="button" className="flex flex-col items-center gap-2 group">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${data.buttonStyle === "Filled"
                ? "bg-gray-50 text-gray-700"
                : "border border-gray-200 text-gray-600"
                }`}
            >
              {getActionIcon(item.icon)}
            </div>
            <span className="text-[10px] font-medium text-gray-600 text-center leading-tight max-w-[60px]">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function PlaceholderSection({ data }: { data: SectionData }) {
  return (
    <div className="bg-gray-100 rounded-xl p-6 m-4 flex items-center justify-center border border-dashed border-gray-300">
      <span className="text-sm font-medium text-gray-500">{data.type} Section</span>
    </div>
  );
}

export function SectionContent({ data }: { data: SectionData }) {
  switch (data.type) {
    case "Header":
      return <HeaderSection data={data} />;
    case "Hero":
      return <HeroSection data={data} />;
    case "PrimaryActions":
      return <PrimaryActionsSection data={data} />;
    default:
      return <PlaceholderSection data={data} />;
  }
}
