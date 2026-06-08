"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Table from "../../../components/Table";
import ConfirmDialog from "../../../components/ConfirmDialog";
import MenuDetailView from "../../../components/menu/MenuDetailView";
import {
  FULFILLMENT_TYPES,
  MENU_CATEGORIES,
  SERVING_PERIOD_OPTIONS,
  getCategoryPillStyle,
  type FulfillmentType,
} from "../../../lib/menuStyles";
import {
  DEFAULT_MENU_ITEMS,
  DEFAULT_MODIFIER_GROUPS,
  type MenuItem,
} from "../../../data/mockMenuItems";

interface ModifierOption {
  order: string;
  name: string;
  description: string;
  price: string;
  active: boolean;
  image?: string;
}

export default function MenuManagementPage() {
  const router = useRouter();

  // Primary States
  const [flowState, setFlowState] = useState<"grid" | "builder" | "empty" | "detail">("grid");
  const [gridCategoryFilter, setGridCategoryFilter] = useState("All Categories");
  const [gridServingFilter, setGridServingFilter] = useState("All Serving Periods");
  const [showGridCategoryDropdown, setShowGridCategoryDropdown] = useState(false);
  const [showGridServingDropdown, setShowGridServingDropdown] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(DEFAULT_MENU_ITEMS);
  const [selectedDetailItemId, setSelectedDetailItemId] = useState<string | null>(null);
  const [showDeleteMenuConfirm, setShowDeleteMenuConfirm] = useState(false);
  const [detailExpandedGroupId, setDetailExpandedGroupId] = useState<string | null>("mg-1");

  // Success Toast state (Screenshot 2 "Menu added successfully")
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Wizard - Step 1: Add Menu Item Form States
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Main Course");
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>("All Channels");
  const [selectedServingPeriods, setSelectedServingPeriods] = useState<string[]>(["Lunch", "Dinner"]);
  const [mealImage, setMealImage] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(["Chef's Pick"]);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>(["Dairy"]);
  const [markAvailable, setMarkAvailable] = useState(true);

  // Wizard - Step 2: Modifier States
  const [modifierName, setModifierName] = useState("Cooking Style");
  const [modifierDesc, setModifierDesc] = useState("How would you like your steak cooked?");
  const [selectionType, setSelectionType] = useState("Single Select");
  const [modifierRequired, setModifierRequired] = useState(true);
  const [minSelection, setMinSelection] = useState("1");
  const [maxSelection, setMaxSelection] = useState("1");

  // Collapsible Accordion sections (Screenshot 1 & 4)
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>("Cooking Style");

  // Options list state (Screenshot 4 table lists)
  const [optionsList, setOptionsList] = useState<ModifierOption[]>([
    { order: "Table 01", name: "Rare", description: "52–55°C", price: "624", active: true, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80" },
    { order: "Table 04", name: "Medium Well", description: "65–70°C", price: "648", active: true, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80" },
    { order: "Table 05", name: "Well Done", description: "70–75°C", price: "656", active: true, image: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=600&auto=format&fit=crop&q=80" }
  ]);

  // "Add Options" Drawer Slider Form State (Screenshot 3)
  const [showAddOptionDrawer, setShowAddOptionDrawer] = useState(false);
  const [drawerOptionName, setDrawerOptionName] = useState("Medium Rare");
  const [drawerOptionDesc, setDrawerOptionDesc] = useState("52–55°C");
  const [drawerOptionPrice, setDrawerOptionPrice] = useState("50 AED");
  const [drawerOptionActive, setDrawerOptionActive] = useState(true);
  const [drawerOptionImage, setDrawerOptionImage] = useState("https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80");

  // Dropdown states
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [showFulfillmentDropdown, setShowFulfillmentDropdown] = useState(false);
  const [showSelectionTypeDropdown, setShowSelectionTypeDropdown] = useState(false);

  const ALLERGENS = ["Gluten", "Dairy", "Eggs", "Fish", "Peanuts", "Soy", "Celery", "Mustard"];
  const TAG_OPTIONS = [
    { name: "Vegetarian", dotColor: "bg-[#D97706]", style: "text-[#D97706] bg-amber-50/50" },
    { name: "Vegan", dotColor: "bg-[#059669]", style: "text-[#059669] bg-emerald-50/50" },
    { name: "Spicy", dotColor: "bg-[#DC2626]", style: "text-[#DC2626] bg-red-50/50" },
    { name: "Chef's Pick", dotColor: "bg-[#B45309]", style: "text-[#B45309] bg-amber-100/55 border-[#F59E0B]", icon: "⭐" },
    { name: "Halal", dotColor: "bg-[#7C3AED]", style: "text-[#7C3AED] bg-purple-50/50" },
  ];

  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      if (gridCategoryFilter !== "All Categories" && item.category !== gridCategoryFilter) {
        return false;
      }
      if (
        gridServingFilter !== "All Serving Periods" &&
        !item.servingPeriods.includes(gridServingFilter)
      ) {
        return false;
      }
      return true;
    });
  }, [menuItems, gridCategoryFilter, gridServingFilter]);

  const servingPeriodLabel =
    selectedServingPeriods.length > 0
      ? selectedServingPeriods.join(", ")
      : "Select Serving Period";

  const handleServingPeriodToggle = (period: string) => {
    setSelectedServingPeriods((prev) =>
      prev.includes(period) ? prev.filter((p) => p !== period) : [...prev, period]
    );
  };

  const startMenuWizard = () => {
    setItemName("");
    setDescription("");
    setPrice("");
    setCategory("Main Course");
    setFulfillmentType("All Channels");
    setSelectedServingPeriods(["Lunch", "Dinner"]);
    setMealImage("");
    setSelectedTags(["Chef's Pick"]);
    setSelectedAllergens(["Dairy"]);
    setMarkAvailable(true);
    setFlowState("builder");
    setCurrentStep(1);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAllergenToggle = (allergen: string) => {
    setSelectedAllergens((prev) =>
      prev.includes(allergen) ? prev.filter((a) => a !== allergen) : [...prev, allergen]
    );
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMealImage(URL.createObjectURL(file));
    }
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  // Add Option to Table (Screenshot 3 "Assign Reservation" action!)
  const handleAddOptionSubmit = () => {
    const nextTableIndex = optionsList.length + 1;
    const paddedIndex = nextTableIndex < 10 ? `0${nextTableIndex}` : `${nextTableIndex}`;
    const newOpt: ModifierOption = {
      order: `Table ${paddedIndex}`,
      name: drawerOptionName || "Custom Option",
      description: drawerOptionDesc || "Standard specs",
      price: drawerOptionPrice.replace(" AED", "").replace("AED ", "") || "0",
      active: drawerOptionActive,
      image: drawerOptionImage || "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80"
    };

    setOptionsList((prev) => [...prev, newOpt]);
    setShowAddOptionDrawer(false);
  };

  const loadMenuItemIntoWizard = (item: MenuItem) => {
    setItemName(item.name);
    setDescription(item.description);
    setPrice(item.price.replace("AED ", ""));
    setCategory(item.category);
    setFulfillmentType(item.fulfillmentType);
    setSelectedServingPeriods(
      item.servingPeriods.length > 0 ? [...item.servingPeriods] : ["All Day"]
    );
    setMealImage(item.image);
    setSelectedTags(item.tags);
    setSelectedAllergens(item.allergens);
    setMarkAvailable(item.available);
  };

  const openMenuDetail = (item: MenuItem) => {
    setSelectedDetailItemId(item.id);
    setDetailExpandedGroupId("mg-1");
    setFlowState("detail");
  };

  const handleConfirmDeleteMenu = () => {
    if (!selectedDetailItemId) return;
    setMenuItems((prev) => prev.filter((m) => m.id !== selectedDetailItemId));
    setShowDeleteMenuConfirm(false);
    setSelectedDetailItemId(null);
    setFlowState("grid");
  };

  const handleEditFromDetail = () => {
    const item = menuItems.find((m) => m.id === selectedDetailItemId);
    if (!item) return;
    loadMenuItemIntoWizard(item);
    setFlowState("builder");
    setCurrentStep(1);
  };

  const selectedDetailItem = menuItems.find((m) => m.id === selectedDetailItemId);

  // Confirm and Publish Wizard
  const handleSaveMenuWizard = () => {
    const newItem: MenuItem = {
      id: `M${menuItems.length + 1}`,
      name: itemName || "Grilled Ribeye Steak",
      description: description || "Premium ribeye seasoned with sea salt and crackerblack pepper.",
      price: price ? `AED ${Number(price).toFixed(2)}` : "AED 129.00",
      category: category,
      fulfillmentType,
      servingPeriods:
        selectedServingPeriods.length > 0 ? selectedServingPeriods : ["All Day"],
      image: mealImage || "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80",
      tags: selectedTags.length > 0 ? selectedTags : ["Chef's Pick", "Halal"],
      allergens: selectedAllergens,
      available: markAvailable,
    };

    setMenuItems((prev) => [newItem, ...prev]);
    setShowSuccessToast(true);

    // Clean states
    setItemName("");
    setDescription("");
    setPrice("");
    setMealImage("");

    // Slide back to Master Dashboard
    setFlowState("grid");
    setCurrentStep(1);

    // Hide Toast after 4 seconds
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 4000);
  };

  // Reusable Table Configurations for Master dashboard (Screenshot 2)
  const columns = [
    {
      key: "name",
      header: "Item Name",
      render: (item: MenuItem) => (
        <div className="flex items-center gap-3 ">
          <img
            src={item.image}
            alt={item.name}
            className="w-10 h-10 rounded-xl object-cover border border-zinc-150/40 dark:border-zinc-800"
          />
          <span className="font-medium text-[#333839] dark:text-white tracking-tight">{item.name}</span>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (item: MenuItem) => (
        <span
          className={`px-3 py-1 rounded-full text-[11px] font-black uppercase border ${getCategoryPillStyle(item.category)}`}
        >
          {item.category}
        </span>
      ),
    },
    {
      key: "fulfillmentType",
      header: "Fulfillment",
      render: (item: MenuItem) => (
        <span className="text-[#333839] dark:text-white font-medium text-[13px] tracking-tight">
          {item.fulfillmentType}
        </span>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (item: MenuItem) => (
        <span className="text-[#333839] dark:text-white font-medium text-[14px] tracking-tight">{item.price}</span>
      ),
    },
    {
      key: "tags",
      header: "Tags",
      render: (item: MenuItem) => {
        const firstTag = item.tags[0];
        const remainingCount = item.tags.length - 1;
        let tagStyle = "text-[#D97706] bg-amber-50/50 dark:bg-amber-950/20 border-amber-250/50";
        if (firstTag === "Vegan") tagStyle = "text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-250/50";
        else if (firstTag === "Spicy") tagStyle = "text-[#DC2626] bg-red-50/50 dark:bg-red-950/20 border-red-250/50";
        else if (firstTag === "Halal") tagStyle = "text-[#7C3AED] bg-purple-50/50 dark:bg-purple-950/20 border-purple-250/50";
        else if (firstTag === "Chef's Pick") tagStyle = "text-amber-700 bg-amber-100/60 dark:bg-amber-900/25 border-[#F59E0B]";

        return (
          <div className="flex items-center gap-1.5 ">
            {firstTag && (
              <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold border flex items-center gap-1.5 ${tagStyle}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {firstTag}
              </span>
            )}
            {remainingCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-extrabold bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500">
                +{remainingCount}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "servingPeriods",
      header: "Serving Period",
      render: (item: MenuItem) => (
        <div className="flex flex-wrap gap-1 ">
          {item.servingPeriods.map((period) => (
            <span key={period} className="px-2.5 py-0.5 rounded bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-[10.5px] font-black uppercase border border-zinc-150/40 dark:border-zinc-750">
              {period}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "available",
      header: "Status",
      render: (item: MenuItem) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuItems((prev) =>
              prev.map((m) => (m.id === item.id ? { ...m, available: !m.available } : m))
            );
          }}
          className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${item.available ? "bg-linear-to-r from-[#041B40] to-[#0A46A6]" : "bg-zinc-200 dark:bg-zinc-750"}`}
        >
          <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${item.available ? "translate-x-5" : "translate-x-0"}`} />
        </button>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "center" as const,
      render: (item: MenuItem) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            openMenuDetail(item);
          }}
          className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative min-h-screen pb-16">

      {/* SUCCESS NOTIFICATION TOAST (Screenshot 2) */}
      {showSuccessToast && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-55 bg-white dark:bg-zinc-900 border border-zinc-150/40 dark:border-zinc-800 shadow-2xl rounded-2xl py-3.5 px-6 flex items-center gap-3 animate-fade-in ">
          <span className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center text-white text-[11px] font-black">
            ✓
          </span>
          <span className="text-[13px] font-black text-zinc-850 dark:text-white uppercase tracking-tight">
            Menu added successfully
          </span>
          <button
            onClick={() => setShowSuccessToast(false)}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 ml-4 font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* ======================= MENU DETAIL VIEW ======================= */}
      {flowState === "detail" && selectedDetailItem && (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => {
              setFlowState("grid");
              setSelectedDetailItemId(null);
            }}
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-zinc-500 hover:text-[#0A46A6] transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Menu Management
          </button>
          <MenuDetailView
            item={selectedDetailItem}
            modifierGroups={DEFAULT_MODIFIER_GROUPS}
            expandedGroupId={detailExpandedGroupId}
            onExpandedGroupChange={setDetailExpandedGroupId}
            onDelete={() => setShowDeleteMenuConfirm(true)}
            onEdit={handleEditFromDetail}
          />
        </div>
      )}

      {/* ======================= STATE A: MASTER MENU MANAGEMENT (Screenshot 2) ======================= */}
      {flowState === "grid" && (
        <div className="space-y-6 animate-fade-in ">

          {/* Header block */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ">
            <div className="">
              <h1 className="text-[24px] font-semibold text-[#333839] dark:text-white  tracking-[-0.15px] leading-[30px]">
                Menu Management
              </h1>
              <p className="text-[14px]  text-[#717680]">
                Manage your restaurant's menu categories and items.
              </p>
            </div>

            <button
              onClick={startMenuWizard}
              className="px-6 py-3 bg-linear-to-r from-[#041B40] to-[#0A46A6]  hover:bg-[#115E59] text-white text-[13px] font-black rounded-xl shadow-md hover:shadow-lg transition-all uppercase tracking-wider cursor-pointer"
            >
              + Add Menu
            </button>
          </div>

          {/* Table Container & Filter row */}
          <div className="bg-white dark:bg-zinc-950 rounded-[28px]  shadow-sm space-y-4">

            {/* Filter Pill Row */}


            {/* The Dynamic Reusable Table component */}
            <Table<MenuItem>
              columns={columns}
              data={filteredMenuItems}
              searchPlaceholder="Search Menu Item Name..."
              searchFilter={(item, query) =>
                item.name.toLowerCase().includes(query.toLowerCase()) ||
                item.category.toLowerCase().includes(query.toLowerCase())
              }
              initialRowsPerPage={10}
              className="border-none !p-0 !bg-transparent !shadow-none"
              headerRight={
                <div className="flex items-center gap-2 self-end">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setShowGridCategoryDropdown((v) => !v);
                        setShowGridServingDropdown(false);
                      }}
                      className="px-4 py-1.5 bg-white dark:bg-zinc-900 border border-[#E7E7E7] rounded-lg text-[14px] font-medium text-[#121212] cursor-pointer hover:bg-zinc-100 flex items-center gap-2"
                    >
                      {gridCategoryFilter}
                      <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {showGridCategoryDropdown && (
                      <div className="absolute top-full right-0 mt-1 min-w-[200px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-30 overflow-hidden animate-fade-in">
                        {["All Categories", ...MENU_CATEGORIES].map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => {
                              setGridCategoryFilter(cat);
                              setShowGridCategoryDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2 text-[13px] font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 cursor-pointer"
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setShowGridServingDropdown((v) => !v);
                        setShowGridCategoryDropdown(false);
                      }}
                      className="px-4 py-1.5 bg-white dark:bg-zinc-900 border border-[#E7E7E7] rounded-lg text-[14px] font-medium text-[#121212] cursor-pointer hover:bg-zinc-100 flex items-center gap-2"
                    >
                      {gridServingFilter}
                      <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {showGridServingDropdown && (
                      <div className="absolute top-full right-0 mt-1 min-w-[180px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-30 overflow-hidden animate-fade-in">
                        {["All Serving Periods", ...SERVING_PERIOD_OPTIONS].map((period) => (
                          <button
                            key={period}
                            type="button"
                            onClick={() => {
                              setGridServingFilter(period);
                              setShowGridServingDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2 text-[13px] font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 cursor-pointer"
                          >
                            {period}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              }
            />
          </div>

        </div>
      )}

      {/* ======================= STATE B: EMPTY LANDING AND MEAL CHOICE WIZARD ======================= */}
      {flowState === "empty" && (
        <div className="flex flex-col items-center justify-center min-h-[500px] bg-white dark:bg-zinc-900 border border-zinc-150/40 dark:border-zinc-800 rounded-[32px] p-8 text-center  shadow-sm animate-fade-in gap-6">
          <IsometricMenuGraphic />
          <div className="space-y-2 max-w-lg">
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
              Your Menu is Empty
            </h1>
            <p className="text-[13px] leading-relaxed font-semibold text-zinc-400 dark:text-zinc-500">
              Start creating categories, dishes, and pricing to build your digital menu for reservations, live orders, and online ordering.
            </p>
          </div>
          <button
            onClick={startMenuWizard}
            className="px-10 py-3.5 bg-[#10B981] hover:bg-[#059669] text-white text-[13px] font-black rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all uppercase tracking-wider cursor-pointer"
          >
            Create Menu
          </button>
        </div>
      )}

      {/* ======================= STATE C: BUILDER WIZARD FORM (Steps 1, 2, 3) ======================= */}
      {
        flowState === "builder" && (
          <div className="space-y-6">

            {/* Wizard Navigation Bar */}
            <div className=" ">
              <button
                onClick={() => {
                  if (currentStep > 1) setCurrentStep((currentStep - 1) as any);
                  else setFlowState("grid");
                }}
                className="flex items-center mb-2 gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 text-[12.5px] font-black transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back</span>
              </button>
              <h1 className="text-[24px] font-semibold text-[#333839] tracking-tight  leading-[30px]">
                Create Menu
              </h1>
            </div>

            {/* Three-step progress layout */}
            <div className=" shadow-md rounded-3xl p-5 flex flex-col md:flex-row items-center justify-around gap-6 shadow-none">
              {[
                { step: 1, title: "Menu", desc: currentStep === 1 ? "In Progress" : "Completed" },
                { step: 2, title: "Modifier", desc: currentStep === 2 ? "In Progress" : currentStep > 2 ? "Completed" : "Upcoming" },
                { step: 3, title: "Review & Confirm", desc: currentStep === 3 ? "In Progress" : "Upcoming" },
              ].map((node) => {
                const isCurrent = currentStep === node.step;
                const isCompleted = currentStep > node.step;

                return (
                  <div key={node.step} className="flex flex-col  items-center gap-4">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-[16px] font-semibold  transition-all ${isCurrent
                        ? "bg-linear-to-r from-[#041B40] to-[#0A46A6]  text-white scale-105"
                        : isCompleted
                          ? "bg-linear-to-r from-[#041B40] to-[#0A46A6]  text-white"
                          : "bg-[#E5E5EA] border-zinc-200 dark:border-zinc-700 text-[#1D1D1F]"
                        }`}
                    >
                      {isCompleted ? (
                        <span className="text-white text-[16px]">✓</span>
                      ) : (
                        node.step
                      )}
                    </div>
                    <div className="flex flex-col justify-center items-center  leading-none">
                      <span className={`text-[16px] font-semibold  tracking-tight ${isCurrent || isCompleted ? "text-[#1D1D1F]" : "text-[#1D1D1F]"}`}>
                        {node.title}
                      </span>
                      <span className="text-[12px]  text-[#6E6E73] mt-1 ">
                        {node.desc}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Builder Step Form panel container */}
            <div className="bg-white dark:bg-zinc-900 shadow-md rounded-[32px] shadow-sm overflow-hidden p-6 sm:p-8 animate-fade-in relative">

              {/* ----------------- STEP 1: ADD MENU ITEM DETAILS ----------------- */}
              {currentStep === 1 && (
                <form onSubmit={handleStep1Submit} className="space-y-6">

                  <div className="flex items-center justify-between  ">
                    <h2 className="text-[24px] font-semibold text-[#121212]">
                      Add Menu Item
                    </h2>
                    <button
                      type="button"
                      onClick={() => setFlowState("grid")}
                      className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Meal Image drag drop */}
                  <div className="space-y-2 ">
                    <label className="text-[14px] font-medium text-[#333839] tracking-wider block mb-1">
                      Meal Image
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div
                      onClick={handleUploadClick}
                      className="relative w-full h-48 border-2 border-dashed border-zinc-250 dark:border-zinc-800 hover:border-[#0A46A6] rounded-2xl cursor-pointer flex flex-col items-center justify-center transition-all overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/30"
                    >
                      {mealImage ? (
                        <div className="relative w-full h-full">
                          <img
                            src={mealImage}
                            alt="Meal Preview"
                            className="object-cover w-full h-full absolute inset-0"
                          />
                          <div className="absolute inset-0 bg-black/35 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <span className="text-white text-[12.5px] font-black uppercase tracking-wider">
                              Change Image
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center gap-3">
                          <svg className="w-9 h-9 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-[12px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
                            Drag & drop logo
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Form fields layout */}
                  <div className="grid grid-cols-1 gap-5">
                    <div>
                      <label className="text-[14px] font-medium text-[#333839] tracking-wider block mb-1">
                        Item Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Grilled Ribeye Steak"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        className="w-full px-4 py-2.5 text-[12.5px] font-semibold text-zinc-800 dark:text-zinc-200 bg-zinc-50/50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0A46A6]"
                      />
                    </div>

                    <div>
                      <label className="text-[14px] font-medium text-[#333839] tracking-wider block mb-1">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Brief description of the dish.."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-2.5 text-[12.5px] font-semibold text-zinc-800 dark:text-zinc-200 bg-zinc-50/50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0A46A6] resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[14px] font-medium text-[#333839] tracking-wider block mb-1">
                          Price (AED)
                        </label>
                        <input
                          type="number"
                          required
                          placeholder="e.g. 129"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="w-full px-4 py-2.5 text-[12.5px] font-semibold text-zinc-800 dark:text-zinc-200 bg-zinc-50/50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0A46A6]"
                        />
                      </div>

                      <div className="relative">
                        <label className="text-[14px] font-medium text-[#333839] tracking-wider block mb-1">
                          Category
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                          className="w-full px-4 py-2.5 text-[12.5px] font-semibold text-zinc-800 dark:text-zinc-200 bg-zinc-50/50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none flex items-center justify-between cursor-pointer"
                        >
                          <span>{category}</span>
                          <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {showCategoryDropdown && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-855 rounded-xl shadow-xl z-30 overflow-hidden  animate-fade-in">
                            {MENU_CATEGORIES.map((cat) => (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => {
                                  setCategory(cat);
                                  setShowCategoryDropdown(false);
                                }}
                                className="w-full text-left px-4 py-2.5 text-[12.5px] font-semibold transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 cursor-pointer"
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <label className="text-[14px] font-medium text-[#333839] tracking-wider block mb-1">
                          Serving Period
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setShowPeriodDropdown(!showPeriodDropdown);
                            setShowFulfillmentDropdown(false);
                          }}
                          className="w-full px-4 py-2.5 text-[12.5px] font-semibold text-zinc-800 dark:text-zinc-200 bg-zinc-50/50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none flex items-center justify-between cursor-pointer"
                        >
                          <span className="truncate">{servingPeriodLabel}</span>
                          <svg className="w-4 h-4 text-zinc-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {showPeriodDropdown && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-855 rounded-xl shadow-xl z-30 overflow-hidden animate-fade-in">
                            {SERVING_PERIOD_OPTIONS.map((period) => {
                              const isChecked = selectedServingPeriods.includes(period);
                              return (
                                <button
                                  key={period}
                                  type="button"
                                  onClick={() => handleServingPeriodToggle(period)}
                                  className="w-full text-left px-4 py-2.5 text-[12.5px] font-semibold transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 cursor-pointer flex items-center justify-between gap-3"
                                >
                                  <span>{period}</span>
                                  <span
                                    className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isChecked ? "bg-[#0A46A6] border-[#0A46A6] text-white" : "border-zinc-300 dark:border-zinc-600"}`}
                                  >
                                    {isChecked && (
                                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                      </svg>
                                    )}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      <div className="relative">
                        <label className="text-[14px] font-medium text-[#333839] tracking-wider block mb-1">
                          Fulfillment Type
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setShowFulfillmentDropdown(!showFulfillmentDropdown);
                            setShowPeriodDropdown(false);
                          }}
                          className="w-full px-4 py-2.5 text-[12.5px] font-semibold text-zinc-800 dark:text-zinc-200 bg-zinc-50/50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none flex items-center justify-between cursor-pointer"
                        >
                          <span>{fulfillmentType}</span>
                          <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {showFulfillmentDropdown && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-855 rounded-xl shadow-xl z-30 overflow-hidden animate-fade-in">
                            {FULFILLMENT_TYPES.map((type) => (
                              <button
                                key={type}
                                type="button"
                                onClick={() => {
                                  setFulfillmentType(type);
                                  setShowFulfillmentDropdown(false);
                                }}
                                className="w-full text-left px-4 py-2.5 text-[12.5px] font-semibold transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 cursor-pointer"
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
                        Tags
                      </label>
                      <div className="flex flex-wrap gap-2 ">
                        {TAG_OPTIONS.map((tag) => {
                          const isSelected = selectedTags.includes(tag.name);
                          return (
                            <button
                              key={tag.name}
                              type="button"
                              onClick={() => handleTagToggle(tag.name)}
                              className={`px-3 py-1.5 rounded-[8px] text-[14px] font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${isSelected
                                ? tag.name === "Chef's Pick"
                                  ? "border-[#F59E0B] bg-amber-50 dark:bg-amber-950/20 text-[#B45309]"
                                  : "border-[#10B981] bg-emerald-50 dark:bg-emerald-950/20 text-[#10B981]"
                                : "border-[#E7E7E7] bg-[#F6F6F6] text-[#121212]"
                                }`}
                            >
                              {tag.icon && <span className="text-[11.5px]">{tag.icon}</span>}
                              <span className={`w-2 h-2 rounded-full ${tag.dotColor}`} />
                              <span>{tag.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Allergens */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
                        Allergens
                      </label>
                      <div className="flex flex-wrap gap-2 ">
                        {ALLERGENS.map((allergen) => {
                          const isSelected = selectedAllergens.includes(allergen);
                          return (
                            <button
                              key={allergen}
                              type="button"
                              onClick={() => handleAllergenToggle(allergen)}
                              className={`px-4 py-2 rounded-[8px] text-[14px] font-medium border transition-all cursor-pointer ${isSelected
                                ? "bg-[#D1ECFF] dark:bg-emerald-950/30 text-[#0A46A6] border-[#0A46A6]"
                                : "border-[#E7E7E7] bg-[#F6F6F6] text-[#121212]"
                                }`}
                            >
                              {allergen}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Availability switch */}
                    <div className="flex items-center justify-between  ">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-[#0A46A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-[12.5px] font-extrabold text-zinc-700 dark:text-zinc-300">
                          Mark as Available
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setMarkAvailable(!markAvailable)}
                        className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${markAvailable ? "bg-linear-to-r from-[#041B40] to-[#0A46A6]" : "bg-zinc-200 dark:bg-zinc-700"}`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${markAvailable ? "translate-x-5" : "translate-x-0"}`} />
                      </button>
                    </div>
                  </div>

                  {/* Step Actions footer */}
                  <div className="flex items-center justify-end gap-3 pt-5 border-t border-zinc-100 dark:border-zinc-800/60 ">
                    <button
                      type="button"
                      onClick={() => setFlowState("grid")}
                      className="px-6 py-2.5 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-650 dark:text-zinc-350 text-[12.5px] font-black rounded-full transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-2.5 bg-linear-to-r from-[#041B40] to-[#0A46A6]  hover:bg-[#115E59] text-white text-[12.5px] font-black rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer"
                    >
                      Continue
                    </button>
                  </div>

                </form>
              )}

              {/* ----------------- STEP 2: MODIFIER & CUSTOMIZATION (Screenshot 1 & 4) ----------------- */}
              {currentStep === 2 && (
                <div className="space-y-6">

                  <div className="flex items-center justify-between  ">
                    <h2 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                      Modifier & Customization
                    </h2>
                    <button
                      onClick={() => setFlowState("grid")}
                      className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 cursor-pointer font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Modifiers Fields Form */}
                  <div className="space-y-5">
                    <div>
                      <label className="text-[14px] font-medium text-[#333839] tracking-wider block mb-1">
                        Modifier Group Name
                      </label>
                      <input
                        type="text"
                        value={modifierName}
                        onChange={(e) => setModifierName(e.target.value)}
                        placeholder="e.g. Cooking Style"
                        className="w-full px-4 py-3 text-[13px] font-semibold text-zinc-850 dark:text-zinc-200 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-750 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0F766E]"
                      />
                    </div>

                    <div>
                      <label className="text-[14px] font-medium text-[#333839] tracking-wider block mb-1">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        value={modifierDesc}
                        onChange={(e) => setModifierDesc(e.target.value)}
                        placeholder="How would you like your steak cooked?"
                        className="w-full px-4 py-3 text-[13px] font-semibold text-zinc-850 dark:text-zinc-200 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-750 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0F766E] resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch ">

                      {/* Selection type dropdown */}
                      <div className="relative">
                        <label className="text-[14px] font-medium text-[#333839] tracking-wider block mb-1">
                          Selection Type
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowSelectionTypeDropdown(!showSelectionTypeDropdown)}
                          className="w-full px-4 py-3 text-[13px] font-semibold text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-750 rounded-xl flex items-center justify-between cursor-pointer"
                        >
                          <span>{selectionType}</span>
                          <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {showSelectionTypeDropdown && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-30 overflow-hidden  animate-fade-in">
                            {["Single Select", "Multiple Select"].map((type) => (
                              <button
                                key={type}
                                type="button"
                                onClick={() => {
                                  setSelectionType(type);
                                  setShowSelectionTypeDropdown(false);
                                }}
                                className="w-full text-left px-4 py-2.5 text-[12.5px] font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-750 cursor-pointer"
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Required Field with toggle */}
                      <div className="flex items-center justify-between border border-zinc-200 dark:border-zinc-750 rounded-xl px-4 py-2.5 bg-white dark:bg-zinc-800 ">
                        <div className="flex flex-col leading-none py-1">
                          <span className="text-[14px] font-medium text-[#333839] tracking-wider block mb-1">
                            Required
                          </span>
                          <span className="text-[11px] font-extrabold text-zinc-500 dark:text-zinc-450 uppercase">
                            Customer must select one option
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setModifierRequired(!modifierRequired)}
                          className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${modifierRequired ? "bg-linear-to-r from-[#041B40] to-[#0A46A6]" : "bg-zinc-200 dark:bg-zinc-750"}`}
                        >
                          <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${modifierRequired ? "translate-x-5" : "translate-x-0"}`} />
                        </button>
                      </div>

                    </div>

                    {/* Min / Max Selection inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 ">
                      <div>
                        <label className="text-[14px] font-medium text-[#333839] tracking-wider block mb-1">
                          Min Selection
                        </label>
                        <input
                          type="number"
                          value={minSelection}
                          onChange={(e) => setMinSelection(e.target.value)}
                          className="w-full px-4 py-3 text-[13px] font-semibold text-zinc-850 dark:text-zinc-200 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-750 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0F766E]"
                        />
                      </div>

                      <div>
                        <label className="text-[14px] font-medium text-[#333839] tracking-wider block mb-1">
                          Max Selection
                        </label>
                        <input
                          type="number"
                          value={maxSelection}
                          onChange={(e) => setMaxSelection(e.target.value)}
                          className="w-full px-4 py-3 text-[13px] font-semibold text-zinc-850 dark:text-zinc-200 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-750 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0F766E]"
                        />
                      </div>
                    </div>

                    {/* Right align link: Add Another Modifier */}
                    <div className="flex items-center justify-end ">
                      <button className="text-[14px] font-semibold text-[#0A46A6] flex items-center gap-1 cursor-pointer hover:underline">
                        <span>+ Add Another Modifier</span>
                      </button>
                    </div>

                  </div>

                  {/* ----------------- THREE ACCORDION LISTING SECTIONS (Screenshot 1 / 4) ----------------- */}
                  <div className="space-y-4 pt-3 ">

                    {/* ACCORDION 1: Cooking Style (Expanded or Collapsed) */}
                    <div className="border border-[#E7E7E7] dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-950">
                      <button
                        onClick={() => setExpandedAccordion(expandedAccordion === "Cooking Style" ? null : "Cooking Style")}
                        className="w-full px-5 py-4 flex items-center justify-between font-bold text-[#333839] dark:text-white text-[15px] bg-white dark:bg-zinc-900 cursor-pointer border-b border-transparent"
                      >
                        <span>Cooking Style</span>
                        <svg className={`w-4 h-4 transition-transform duration-200 ${expandedAccordion === "Cooking Style" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {expandedAccordion === "Cooking Style" && (
                        <div className="w-full">
                          {optionsList.length === 0 ? (
                            // Large Empty options layout
                            <div className="flex flex-col items-center justify-center py-10 text-center  gap-4 border-t border-[#E7E7E7]">
                              <span className="text-4xl text-zinc-300 font-light">+</span>
                              <div className="space-y-1">
                                <h4 className="text-[13px] font-bold text-zinc-400 dark:text-zinc-550 uppercase">
                                  No options added yet
                                </h4>
                                <p className="text-[12px] font-medium text-zinc-400">
                                  Add modifier options for customers to choose from
                                </p>
                              </div>
                              <button
                                onClick={() => {
                                  setDrawerOptionName("Medium Rare");
                                  setDrawerOptionDesc("52–55°C");
                                  setDrawerOptionPrice("50 AED");
                                  setShowAddOptionDrawer(true);
                                }}
                                className="px-6 py-2.5 bg-[#0A46A6] hover:bg-[#083b8c] text-white text-[12px] font-bold rounded-full shadow-sm cursor-pointer uppercase tracking-wide"
                              >
                                Add First Option
                              </button>
                            </div>
                          ) : (
                            // Table Listing of modifier options (Screenshot 1)
                            <div className="w-full overflow-x-auto">
                              <table className="w-full border-collapse text-left text-[13px]">
                                <thead>
                                  <tr className="border-b border-[#E7E7E7] dark:border-zinc-800 bg-[#FAFAFA] text-[#717680] font-semibold  text-[12px]">
                                    <th className="py-3 px-5 font-medium">Order</th>
                                    <th className="py-3 px-4 font-medium">Option Name</th>
                                    <th className="py-3 px-4 font-medium">Description</th>
                                    <th className="py-3 px-4 font-medium">Price (AED)</th>
                                    <th className="py-3 px-4 font-medium">Status</th>
                                    <th className="py-3 px-5 font-medium text-center">Action</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E7E7E7] dark:divide-zinc-800 font-medium text-[#333839] dark:text-zinc-200">
                                  {optionsList.map((opt, idx) => (
                                    <tr key={idx} className="hover:bg-zinc-50/30">
                                      <td className="py-4 px-5 text-[#717680]">{opt.order}</td>
                                      <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                          <img
                                            src={opt.image || "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80"}
                                            className="w-8 h-8 rounded border border-zinc-200 dark:border-zinc-800 object-cover"
                                            alt=""
                                          />
                                          <span className="font-medium text-[#333839]">{opt.name}</span>
                                        </div>
                                      </td>
                                      <td className="py-4 px-4 text-[#717680]">{opt.description}</td>
                                      <td className="py-4 px-4 text-[#333839]">{opt.price}</td>
                                      <td className="py-4 px-4">
                                        <button
                                          onClick={() => {
                                            setOptionsList((prev) =>
                                              prev.map((o, i) => (i === idx ? { ...o, active: !o.active } : o))
                                            );
                                          }}
                                          className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${opt.active ? "bg-linear-to-r from-[#041B40] to-[#0A46A6]" : "bg-[#E7E7E7] dark:bg-zinc-800"}`}
                                        >
                                          <div className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-200 ${opt.active ? "translate-x-4" : "translate-x-0"}`} />
                                        </button>
                                      </td>
                                      <td className="py-4 px-5">
                                        <div className="flex items-center justify-center gap-4">
                                          <button className="text-[#717680] hover:text-[#333839] cursor-pointer">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                            </svg>
                                          </button>
                                          <button
                                            onClick={() => {
                                              setOptionsList((prev) => prev.filter((_, i) => i !== idx));
                                            }}
                                            className="text-[#F04438] hover:text-red-700 cursor-pointer"
                                          >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                              <polyline points="3 6 5 6 21 6"></polyline>
                                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                            </svg>
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* ACCORDION 2: Cuisine Type */}
                    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-950">
                      <button
                        onClick={() => setExpandedAccordion(expandedAccordion === "Cuisine Type" ? null : "Cuisine Type")}
                        className="w-full px-5 py-4 flex items-center justify-between font-black text-zinc-850 dark:text-white text-[13.5px] uppercase bg-zinc-50/50 dark:bg-zinc-900/60 cursor-pointer"
                      >
                        <span>Cuisine Type</span>
                        <svg className={`w-4 h-4 transition-transform duration-200 ${expandedAccordion === "Cuisine Type" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {expandedAccordion === "Cuisine Type" && (
                        <div className="p-5 border-t border-zinc-150 dark:border-zinc-850 text-center font-bold text-zinc-400">
                          No cuisine settings configured.
                        </div>
                      )}
                    </div>

                    {/* ACCORDION 3: Preparation Method */}
                    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-950">
                      <button
                        onClick={() => setExpandedAccordion(expandedAccordion === "Preparation Method" ? null : "Preparation Method")}
                        className="w-full px-5 py-4 flex items-center justify-between font-black text-zinc-850 dark:text-white text-[13.5px] uppercase bg-zinc-50/50 dark:bg-zinc-900/60 cursor-pointer"
                      >
                        <span>Preparation Method</span>
                        <svg className={`w-4 h-4 transition-transform duration-200 ${expandedAccordion === "Preparation Method" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {expandedAccordion === "Preparation Method" && (
                        <div className="p-5 border-t border-zinc-150 dark:border-zinc-850 text-center font-bold text-zinc-400">
                          No preparation methods specified.
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Footer Controls */}
                  <div className="flex items-center justify-end gap-3 pt-5 border-t border-zinc-100 dark:border-zinc-800/60 ">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="px-6 py-2.5 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-650 dark:text-zinc-350 text-[12.5px] font-black rounded-full transition-all cursor-pointer uppercase"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="px-8 py-2.5 bg-linear-to-r from-[#041B40] to-[#0A46A6]  hover:bg-[#115E59] text-white text-[12.5px] font-black rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer uppercase"
                    >
                      Continue
                    </button>
                  </div>

                </div>
              )}

              {/* ----------------- STEP 3: REVIEW & CONFIRM (Screenshot 5) ----------------- */}
              {currentStep === 3 && (
                <div className="space-y-6">

                  <div className="flex items-center justify-between  ">
                    <h2 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                      Review & Confirm
                    </h2>
                    <button
                      onClick={() => setFlowState("grid")}
                      className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 cursor-pointer font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Block 1: Meal Items Summary card */}
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between ">
                      <h3 className="text-[14px] font-medium text-[#333839] tracking-wider block mb-1">
                        Meal Items Summary
                      </h3>
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="px-3.5 py-1 border border-[#0A46A6]  rounded-lg text-[14px] font-medium text-[#0A46A6] dark:text-zinc-300 hover:bg-zinc-50 cursor-pointer flex items-center gap-1 "
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M17.7586 5.73214L14.268 2.24073C14.1519 2.12463 14.0141 2.03253 13.8624 1.96969C13.7107 1.90685 13.5482 1.87451 13.384 1.87451C13.2198 1.87451 13.0572 1.90685 12.9056 1.96969C12.7539 2.03253 12.6161 2.12463 12.5 2.24073L2.86641 11.8751C2.74983 11.9908 2.65741 12.1284 2.59451 12.2801C2.5316 12.4318 2.49948 12.5945 2.50001 12.7587V16.2501C2.50001 16.5816 2.6317 16.8996 2.86612 17.134C3.10054 17.3684 3.41849 17.5001 3.75001 17.5001H7.24141C7.40563 17.5006 7.5683 17.4685 7.71999 17.4056C7.87168 17.3427 8.00935 17.2503 8.12501 17.1337L17.7586 7.5001C17.8747 7.38403 17.9668 7.24622 18.0296 7.09454C18.0925 6.94286 18.1248 6.7803 18.1248 6.61612C18.1248 6.45194 18.0925 6.28937 18.0296 6.1377C17.9668 5.98602 17.8747 5.84821 17.7586 5.73214ZM7.24141 16.2501H3.75001V12.7587L10.625 5.8837L14.1164 9.3751L7.24141 16.2501ZM15 8.49073L11.5086 5.0001L13.3836 3.1251L16.875 6.61573L15 8.49073Z" fill="url(#paint0_linear_779_41849)" />
                          <defs>
                            <linearGradient id="paint0_linear_779_41849" x1="2.5" y1="1.87451" x2="26.34" y2="9.64912" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#041B40" />
                              <stop offset="1" stopColor="#0A46A6" />
                            </linearGradient>
                          </defs>
                        </svg>Edit
                      </button>
                    </div>

                    {/* Horizontal visual steak profile card */}
                    <div className="bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-[28px] p-5 flex flex-col md:flex-row gap-6 items-center">

                      <div className="relative w-full md:w-81 h-81 rounded-2xl overflow-hidden shrink-0">
                        <img
                          src={mealImage || "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80"}
                          alt="Dish summary"
                          className="object-cover w-full h-full absolute inset-0"
                        />
                      </div>

                      <div className="flex-1 space-y-4 w-full">
                        <div className="space-y-1">
                          <h4 className="text-[24px] font-semibold text-black tracking-tight">
                            {itemName || "Grilled Ribeye Steak"}
                          </h4>
                          <p className="text-[16px] leading-relaxed text-[#717680] font-medium">
                            {description || "Premium ribeye seasoned with sea salt and crackerblack pepper."}
                          </p>
                        </div>

                        {/* Fields grid specs */}
                        <div className="grid grid-cols-1 gap-y-3 gap-x-4  text-[16px] font-medium">
                          <div className="flex items-center justify-between">
                            <span className="text-[#717680]">Category</span>
                            <span className="text-zinc-850 dark:text-zinc-200">{category}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[#717680]">Price</span>
                            <span className="text-zinc-850 dark:text-zinc-200">AED {price || "129"}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[#717680]">Fulfillment</span>
                            <span className="text-zinc-850 dark:text-zinc-200">{fulfillmentType}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[#717680]">Serving Period</span>
                            <span className="text-zinc-850 dark:text-zinc-200 text-right">
                              {servingPeriodLabel === "Select Serving Period" ? "All Day" : servingPeriodLabel}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[#717680]">Tag</span>
                            <div className="flex gap-1.5">
                              <span className="px-2 py-0.5 text-[9.5px] font-black uppercase bg-amber-500/10 text-amber-600 rounded">
                                ⭐ Chef's Pick
                              </span>
                              <span className="px-2 py-0.5 text-[9.5px] font-black uppercase bg-purple-500/10 text-purple-650 rounded">
                                Halal
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[#717680]">Allergens</span>
                            <span className="px-2 py-0.5 text-[9.5px] font-black bg-[#E6F4F1] text-[#10B981] rounded">
                              {selectedAllergens[0] || "Dairy"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[#717680]">Availability</span>
                            <span className="text-[#10B981] uppercase tracking-wide">
                              {markAvailable ? "Available" : "Unavailable"}
                            </span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Block 2: Modifier Groups list (Screenshot 5 visual layout!) */}
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between ">
                      <h3 className="text-[14px] font-medium text-[#333839] tracking-wider block mb-1">
                        Modifier Group
                      </h3>
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="px-3.5 py-1 border border-[#0A46A6]  rounded-lg text-[14px] font-medium text-[#0A46A6] dark:text-zinc-300 hover:bg-zinc-50 cursor-pointer flex items-center gap-1 "
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M17.7586 5.73214L14.268 2.24073C14.1519 2.12463 14.0141 2.03253 13.8624 1.96969C13.7107 1.90685 13.5482 1.87451 13.384 1.87451C13.2198 1.87451 13.0572 1.90685 12.9056 1.96969C12.7539 2.03253 12.6161 2.12463 12.5 2.24073L2.86641 11.8751C2.74983 11.9908 2.65741 12.1284 2.59451 12.2801C2.5316 12.4318 2.49948 12.5945 2.50001 12.7587V16.2501C2.50001 16.5816 2.6317 16.8996 2.86612 17.134C3.10054 17.3684 3.41849 17.5001 3.75001 17.5001H7.24141C7.40563 17.5006 7.5683 17.4685 7.71999 17.4056C7.87168 17.3427 8.00935 17.2503 8.12501 17.1337L17.7586 7.5001C17.8747 7.38403 17.9668 7.24622 18.0296 7.09454C18.0925 6.94286 18.1248 6.7803 18.1248 6.61612C18.1248 6.45194 18.0925 6.28937 18.0296 6.1377C17.9668 5.98602 17.8747 5.84821 17.7586 5.73214ZM7.24141 16.2501H3.75001V12.7587L10.625 5.8837L14.1164 9.3751L7.24141 16.2501ZM15 8.49073L11.5086 5.0001L13.3836 3.1251L16.875 6.61573L15 8.49073Z" fill="url(#paint0_linear_779_41849)" />
                          <defs>
                            <linearGradient id="paint0_linear_779_41849" x1="2.5" y1="1.87451" x2="26.34" y2="9.64912" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#041B40" />
                              <stop offset="1" stopColor="#0A46A6" />
                            </linearGradient>
                          </defs>
                        </svg>Edit
                      </button>
                    </div>

                    {/* Prepopulated Modifier Accordions (Screenshot 5 style) */}
                    <div className="space-y-3">

                      {/* Item 1: Cooking Style (Expanded) */}
                      <div className="border border-zinc-200 dark:border-zinc-850 rounded-2xl overflow-hidden bg-white dark:bg-zinc-950">

                        <div className="px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/60 gap-2 ">
                          <div className="flex items-center gap-3 font-extrabold text-[12.5px]">
                            <span className="w-5 h-5 rounded-full bg-linear-to-r from-[#041B40] to-[#0A46A6] text-white flex items-center justify-center font-black text-[11px]">
                              {optionsList.length}
                            </span>
                            <span className="text-zinc-900 dark:text-white uppercase tracking-tight font-black">
                              {modifierName || "Cooking Style"}
                            </span>
                            <span className="text-zinc-400">
                              {selectionType} • Mini {minSelection} • Max {maxSelection}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-zinc-400 font-bold self-end text-[11px] uppercase">
                            <span>{optionsList.length} Options</span>
                            <svg className="w-4.5 h-4.5 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>

                        {/* visual modifier options cards list */}
                        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                          {optionsList.map((opt, idx) => (
                            <div key={idx} className="shadow-sm rounded-xl p-3.5 bg-zinc-50/20 dark:bg-zinc-900/20 flex items-center gap-3">
                              <img
                                src={opt.image || "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80"}
                                className="w-10 h-10 rounded-lg object-cover border border-zinc-100 dark:border-zinc-800 shrink-0"
                                alt=""
                              />
                              <div className="leading-tight">
                                <h4 className="text-[12.5px] font-black text-zinc-800 dark:text-white">{opt.name}</h4>
                                <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">{opt.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Item 2: Collapsed placeholder accordion */}
                      <div className="border border-zinc-200 dark:border-zinc-850 rounded-2xl overflow-hidden bg-white dark:bg-zinc-950">
                        <div className="px-5 py-4 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/60 ">
                          <div className="flex items-center gap-3 font-extrabold text-[12.5px] text-zinc-800 dark:text-white">
                            <span className="w-5 h-5 rounded-full bg-zinc-300 text-zinc-800 flex items-center justify-center font-black text-[11px]">
                              2
                            </span>
                            <span className="uppercase font-black">Cuisine Type</span>
                          </div>
                          <div className="flex items-center gap-4 text-zinc-400 font-bold text-[11px] uppercase">
                            <span>2 Options</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Item 3: Collapsed placeholder accordion */}
                      <div className="border border-zinc-200 dark:border-zinc-850 rounded-2xl overflow-hidden bg-white dark:bg-zinc-950">
                        <div className="px-5 py-4 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/60 ">
                          <div className="flex items-center gap-3 font-extrabold text-[12.5px] text-zinc-800 dark:text-white">
                            <span className="w-5 h-5 rounded-full bg-zinc-300 text-zinc-800 flex items-center justify-center font-black text-[11px]">
                              1
                            </span>
                            <span className="uppercase font-black">Preparation Method</span>
                          </div>
                          <div className="flex items-center gap-4 text-zinc-400 font-bold text-[11px] uppercase">
                            <span>1 Options</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Review footer actions */}
                  <div className="flex items-center justify-end gap-3 pt-5 border-t border-zinc-100 dark:border-zinc-800/60 ">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-6 py-2.5 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-650 dark:text-zinc-350 text-[12.5px] font-black rounded-full transition-all cursor-pointer uppercase"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSaveMenuWizard}
                      className="px-10 py-3 bg-linear-to-r from-[#041B40] to-[#0A46A6] hover:bg-[#0A46A6] text-white text-[12.5px] font-black rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 uppercase tracking-wide cursor-pointer"
                    >
                      Publish Menu Item
                    </button>
                  </div>

                </div>
              )}

            </div>

          </div>
        )
      }

      {/* ======================= STATE D: SLIDER DRAWER - ADD OPTIONS (Screenshot 3) ======================= */}
      {
        showAddOptionDrawer && (
          <div className="fixed inset-0 z-55 flex justify-end  p-2">
            {/* Overlay backdrop */}
            <div
              onClick={() => setShowAddOptionDrawer(false)}
              className="fixed inset-0 bg-[#092219]/35 backdrop-blur-xs transition-opacity duration-300 cursor-pointer animate-fade-in"
            />

            {/* Slider Drawer panel */}
            <div className="relative w-full rounded-[20px] max-w-lg bg-white dark:bg-zinc-900 shadow-2xl h-full flex flex-col justify-between animate-slide-in-right z-10 border-l border-zinc-150 dark:border-zinc-850 p-3 sm:p-6">

              <div className="space-y-3 overflow-y-auto px-1 flex-1">

                {/* title bar */}
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-850 pb-3">
                  <h3 className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                    Add Options
                  </h3>
                  <button
                    onClick={() => setShowAddOptionDrawer(false)}
                    className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer font-bold"
                  >
                    ✕
                  </button>
                </div>

                {/* Add Image field (Screenshot 3 style!) */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-zinc-400 uppercase tracking-wider block">
                    Add Image <span className="text-zinc-350">(Optional)</span>
                  </label>
                  <div className="relative w-full h-44 rounded-2xl overflow-hidden shadow-sm bg-zinc-50 shrink-0">
                    <img
                      src={drawerOptionImage}
                      className="w-full h-full object-cover absolute inset-0"
                      alt=""
                    />
                    <div className="absolute inset-0 bg-black/15 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white text-[12px] font-bold uppercase bg-black/60 py-1.5 px-3 rounded-lg">
                        Edit photo
                      </span>
                    </div>
                  </div>
                </div>

                {/* Form Input fields */}
                <div className="space-y-2">
                  <div>
                    <label className="text-[11px] font-black text-zinc-400 uppercase tracking-wider block mb-1">
                      Option Name
                    </label>
                    <input
                      type="text"
                      value={drawerOptionName}
                      onChange={(e) => setDrawerOptionName(e.target.value)}
                      placeholder="e.g. Medium Rare"
                      className="w-full px-4 py-2.5 text-[12.5px] font-semibold text-zinc-850 dark:text-zinc-200 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-750 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0A46A6]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-black text-zinc-400 uppercase tracking-wider block mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={drawerOptionDesc}
                      onChange={(e) => setDrawerOptionDesc(e.target.value)}
                      placeholder="52–55°C"
                      className="w-full px-4 py-2.5 text-[12.5px] font-semibold text-zinc-850 dark:text-zinc-200 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-750 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0A46A6] resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-black text-zinc-400 uppercase tracking-wider block mb-1">
                      Price
                    </label>
                    <input
                      type="text"
                      value={drawerOptionPrice}
                      onChange={(e) => setDrawerOptionPrice(e.target.value)}
                      placeholder="50 AED"
                      className="w-full px-4 py-2.5 text-[12.5px] font-semibold text-zinc-850 dark:text-zinc-200 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-750 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0A46A6]"
                    />
                    <span className="text-[10px] text-zinc-400 mt-1 block uppercase font-bold">
                      Leave empty if no extra charge
                    </span>
                  </div>

                  {/* Toggle status */}
                  <div className="flex items-center justify-between shadow-sm rounded-xl p-4 bg-white dark:bg-zinc-950 ">
                    <span className="text-[12px] font-extrabold text-zinc-700 dark:text-zinc-300">
                      Status (Active)
                    </span>
                    <button
                      type="button"
                      onClick={() => setDrawerOptionActive(!drawerOptionActive)}
                      className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${drawerOptionActive ? "bg-[#0A46A6]" : "bg-zinc-200 dark:bg-zinc-700"}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${drawerOptionActive ? "translate-x-5" : "translate-x-0"}`} />
                    </button>
                  </div>

                </div>

              </div>

              {/* Bottom primary button (Screenshot 3 "Assign Reservation" action!) */}
              <div className="border-t border-zinc-100 dark:border-zinc-850 pt-4 mt-2 ">
                <button
                  onClick={handleAddOptionSubmit}
                  className="w-full py-3.5 bg-linear-to-r from-[#041B40] to-[#0A46A6] hover:bg-[#0A46A6] text-white text-[13px] font-black rounded-xl shadow-md hover:shadow-lg uppercase tracking-wider cursor-pointer text-center"
                >
                  Assign Reservation
                </button>
              </div>

            </div>
          </div>
        )
      }

      <ConfirmDialog
        isOpen={showDeleteMenuConfirm}
        onClose={() => setShowDeleteMenuConfirm(false)}
        onConfirm={handleConfirmDeleteMenu}
        title="Delete Menu?"
        description="Are you sure you want to delete this Menu? This action cannot be undone."
        confirmLabel="Delete Menu"
        cancelLabel="Cancel"
        variant="danger"
      />
    </div >
  );
}

// Inline fallback image helper if Unsplash loading is slow
function IsometricMenuGraphic() {
  return (
    <img
      src="/emptyMenu.png"
      alt="Empty Menu"
      className="w-80 h-auto object-contain mx-auto "
    />
  );
}
