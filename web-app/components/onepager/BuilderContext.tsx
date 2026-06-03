"use client";

import React, { createContext, useContext, useState } from "react";
import { SectionData, SectionType } from "./types";

interface BuilderContextType {
  sections: SectionData[];
  setSections: React.Dispatch<React.SetStateAction<SectionData[]>>;
  selectedSectionId: string | null;
  setSelectedSectionId: (id: string | null) => void;
  updateSection: (id: string, data: Partial<SectionData>) => void;
  removeSection: (id: string) => void;
  addSection: (type: SectionType) => void;
  saveSections: () => void;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export const ONEPAGER_STORAGE_KEY = "horeca-onepager-sections";

export const initialSections: SectionData[] = [
  { id: "header-1", type: "Header", logo: "/logo.png", showShareButton: true },
  { id: "hero-1", type: "Hero", heading: "Gudie Cafe", subHeading: "Good Food, Good Mood", description: "Fresh ingredients. Cozy Place. Great Vibe.", locationBadge: true, location: "Blue Area, Islamabad", backgroundImage: "/Auth/AuthIMG.png" },
  {
    id: "primary-actions-1", type: "PrimaryActions", buttonStyle: "Filled", actionItems: [
      { id: "a1", label: "View Menu", icon: "BookOpen" },
      { id: "a2", label: "Order Online", icon: "ShoppingBag" },
      { id: "a3", label: "Reserve Table", icon: "Calendar" },
      { id: "a4", label: "Daily Deals", icon: "Tag" },
      { id: "a5", label: "Special Offers", icon: "Gift" },
      { id: "a6", label: "WhatsApp Us", icon: "MessageCircle" },
      { id: "a7", label: "Leave a Review", icon: "Star" },
      { id: "a8", label: "Follow Us", icon: "Instagram", socialLinks: ["https://www.Instagram.com", "https://www.Facebook.com", "https://www.Youtube.com", "https://docs.Tiktok.com"] },
      { id: "a9", label: "More", icon: "MoreHorizontal" }
    ]
  },
  {
    id: "promotions-1", type: "Promotions",
    promotions: [
      { id: "p1", title: "20% Off This Weekend", description: "Dine in and enjoy a 20% discount on all mains.", badge: "Limited", image: "/Auth/AuthIMG.png" },
      { id: "p2", title: "Happy Hour 4–6 PM", description: "Buy one get one on selected drinks every evening.", badge: "Daily", image: "/Auth/AuthIMG.png" },
    ]
  },
  {
    id: "reviews-1", type: "Reviews",
    reviews: [
      { id: "r1", name: "Sarah M.", rating: 5, text: "Amazing food and great atmosphere!", avatar: "" },
      { id: "r2", name: "Ahmed K.", rating: 5, text: "Best restaurant in the area. Highly recommend.", avatar: "" },
      { id: "r3", name: "Priya S.", rating: 4, text: "Loved the ambiance and the service was top-notch.", avatar: "" },
    ],
    showGoogleRating: true,
    googleRating: 4.8,
    googleReviewCount: 324,
  },
  // { id: "footer-1", type: "Footer",
  //   footerPhone: "+92 300 1234567",
  //   footerEmail: "hello@guidecafe.com",
  //   footerAddress: "Blue Area, Islamabad",
  //   footerCopyright: "© 2025 Gudie Cafe. All rights reserved.",
  // },
];

export function loadStoredSections(): SectionData[] {
  if (typeof window === "undefined") return initialSections;
  try {
    const raw = localStorage.getItem(ONEPAGER_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as SectionData[];
  } catch {
    // ignore invalid stored data
  }
  return initialSections;
}

export function saveStoredSections(sections: SectionData[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ONEPAGER_STORAGE_KEY, JSON.stringify(sections));
}

export function BuilderProvider({ children }: { children: React.ReactNode }) {
  const [sections, setSections] = useState<SectionData[]>(initialSections);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>("header-1");

  React.useEffect(() => {
    setSections(loadStoredSections());
  }, []);

  const updateSection = (id: string, data: Partial<SectionData>) => {
    setSections((prev) =>
      prev.map((sec) => (sec.id === id ? { ...sec, ...data } : sec))
    );
  };

  const removeSection = (id: string) => {
    setSections((prev) => prev.filter((sec) => sec.id !== id));
    if (selectedSectionId === id) {
      setSelectedSectionId(null);
    }
  };

  const addSection = (type: SectionType) => {
    const newSection: SectionData = {
      id: `${type.toLowerCase()}-${Date.now()}`,
      type,
    };
    setSections((prev) => [...prev, newSection]);
    setSelectedSectionId(newSection.id);
  };

  return (
    <BuilderContext.Provider
      value={{
        sections,
        setSections,
        selectedSectionId,
        setSelectedSectionId,
        updateSection,
        removeSection,
        addSection,
        saveSections: () => saveStoredSections(sections),
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilder() {
  const context = useContext(BuilderContext);
  if (context === undefined) {
    throw new Error("useBuilder must be used within a BuilderProvider");
  }
  return context;
}
