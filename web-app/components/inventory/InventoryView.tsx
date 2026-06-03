"use client";

import React, { useMemo, useState } from "react";
import {
  InventoryItem,
  mockInventoryItems,
  deriveInventoryStats,
  applyRestock,
  applyMarkOutOfStock,
  CATEGORY_OPTIONS,
} from "../../data/mockInventory";
import StatCard from "../StatCard";
import Table, { TableColumn } from "../Table";
import Dropdown from "../Dropdown";
import EmptyState from "../EmptyState";
import Button from "../Button";
import InventoryItemThumb from "./InventoryItemThumb";
import StockProgressBar from "./StockProgressBar";
import StatusBadge from "./StatusBadge";
import ActionMenu from "../ActionMenu";
import InventoryDetailDrawer from "./InventoryDetailDrawer";
import InventoryModal, { InventoryModalState } from "./InventoryModal";
import ConfirmDialog from "../ConfirmDialog";

const CATEGORY_FILTER_OPTIONS = [
  { value: "all", label: "All Categories" },
  ...CATEGORY_OPTIONS.map((c) => ({ value: c.toLowerCase(), label: c })),
];

const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "Status" },
  { value: "in_stock", label: "In Stock" },
  { value: "low_stock", label: "Low Stock" },
  { value: "out_of_stock", label: "Out of Stock" },
  { value: "expiring_soon", label: "Expiring Soon" },
];

const SHOW_EMPTY_STATE = false;

function formatExpiryDisplay(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function syncItemInList(items: InventoryItem[], updated: InventoryItem): InventoryItem[] {
  return items.map((i) => (i.id === updated.id ? updated : i));
}

export default function InventoryView() {
  const [items, setItems] = useState<InventoryItem[]>(
    SHOW_EMPTY_STATE ? [] : mockInventoryItems
  );
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalState, setModalState] = useState<InventoryModalState | null>(null);
  const [confirmOutOpen, setConfirmOutOpen] = useState(false);
  const [pendingOutItem, setPendingOutItem] = useState<InventoryItem | null>(null);

  const stats = useMemo(() => deriveInventoryStats(items), [items]);

  const filteredItems = useMemo(() => {
    let result = [...items];
    if (categoryFilter !== "all") {
      result = result.filter((item) => item.category.toLowerCase() === categoryFilter);
    }
    if (statusFilter !== "all") {
      result = result.filter((item) => item.status === statusFilter);
    }
    return result;
  }, [items, categoryFilter, statusFilter]);

  const updateItem = (updated: InventoryItem) => {
    setItems((prev) => syncItemInList(prev, updated));
    setSelectedItem((prev) => (prev?.id === updated.id ? updated : prev));
  };

  const handleOpenDrawer = (item: InventoryItem) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  const handleAddItem = (item: InventoryItem) => {
    setItems((prev) => [item, ...prev]);
  };

  const handleOpenEdit = (item: InventoryItem) => {
    setSelectedItem(item);
    setModalState({ mode: "edit", item });
  };

  const handleOpenRestock = (item: InventoryItem) => {
    setSelectedItem(item);
    setModalState({ mode: "restock", item });
  };

  const handleConfirmRestock = (item: InventoryItem, quantity: number) => {
    updateItem(applyRestock(item, quantity));
  };

  const handleRequestMarkOut = (item: InventoryItem) => {
    setPendingOutItem(item);
    setConfirmOutOpen(true);
  };

  const handleConfirmMarkOut = () => {
    if (!pendingOutItem) return;
    updateItem(applyMarkOutOfStock(pendingOutItem));
    setPendingOutItem(null);
  };

  const searchFilter = (item: InventoryItem, query: string) => {
    const term = query.toLowerCase();
    return (
      item.name.toLowerCase().includes(term) ||
      item.sku.toLowerCase().includes(term) ||
      item.category.toLowerCase().includes(term) ||
      item.supplier.toLowerCase().includes(term)
    );
  };

  const tableColumns: TableColumn<InventoryItem>[] = [
    {
      key: "name",
      header: "Item Name",
      render: (item) => (
        <div className="flex items-center gap-3">
          <InventoryItemThumb emoji={item.imageEmoji} color={item.imageColor} />
          <span className="font-bold text-zinc-850 dark:text-zinc-100">{item.name}</span>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (item) => (
        <span className="font-semibold text-zinc-600 dark:text-zinc-300">{item.category}</span>
      ),
    },
    {
      key: "stock",
      header: "Stock Level",
      render: (item) => (
        <StockProgressBar
          current={item.currentQuantity}
          max={item.maxCapacity}
          unit={item.unit}
          status={item.status}
        />
      ),
    },
    {
      key: "expiry",
      header: "Expiry",
      render: (item) => (
        <span className="font-semibold text-zinc-600 dark:text-zinc-300">
          {formatExpiryDisplay(item.expiryDate)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      render: (item) => (
        <ActionMenu
          items={[
            { id: "view", label: "View Details", onClick: () => handleOpenDrawer(item) },
            { id: "edit", label: "Edit Item", onClick: () => handleOpenEdit(item) },
            { id: "restock", label: "Restock", onClick: () => handleOpenRestock(item) },
            {
              id: "out",
              label: "Mark Out of Stock",
              onClick: () => handleRequestMarkOut(item),
              variant: "danger",
            },
          ]}
        />
      ),
    },
  ];

  const addButton = (
    <button
      type="button"
      onClick={() => setModalState({ mode: "add" })}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-linear-to-r from-[#041B40] to-[#0A46A6] text-white text-[14px] font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer shrink-0"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
      </svg>
      Add Inventory
    </button>
  );

  return (
    <div className="space-y-6 select-none">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-[24px] font-semibold text-[#333839] dark:text-white tracking-[-0.15px]">
            Inventory Management
          </h1>
          <p className="text-[14px] font-medium text-zinc-500 dark:text-zinc-400 mt-1">
            Manage ingredients, stock levels and kitchen usage
          </p>
        </div>
        {items.length > 0 && addButton}
      </div>

      {items.length > 0 ? (
        <>
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard title="Total Inventory Items" value={stats.totalItems.toString()} iconType="orders" />
            <StatCard title="Low Stock" value={stats.lowStock.toString()} iconType="reservations" />
            <StatCard title="Out of Stock" value={stats.outOfStock.toString()} iconType="revenue" />
            <StatCard title="Expiring Soon" value={stats.expiringSoon.toString()} iconType="value" />
          </section>

          <section>
            <Table
              columns={tableColumns}
              data={filteredItems}
              searchPlaceholder="Search..."
              searchFilter={searchFilter}
              initialRowsPerPage={10}
              headerRight={
                <>
                  <Dropdown
                    options={CATEGORY_FILTER_OPTIONS}
                    value={categoryFilter}
                    onChange={setCategoryFilter}
                  />
                  <Dropdown
                    options={STATUS_FILTER_OPTIONS}
                    value={statusFilter}
                    onChange={setStatusFilter}
                  />
                </>
              }
            />
          </section>
        </>
      ) : (
        <EmptyState
          imageSrc="/emptyInv.png"
          imageAlt="No inventory items"
          title="No Inventory Items Yet"
          description="Start tracking ingredients, stock levels, suppliers, and kitchen usage to manage your restaurant inventory efficiently."
          action={
            <Button type="button" onClick={() => setModalState({ mode: "add" })} className="max-w-xs mx-auto">
              Add Inventory Item
            </Button>
          }
        />
      )}

      <InventoryModal
        state={modalState}
        onClose={() => setModalState(null)}
        onAdd={handleAddItem}
        onSave={updateItem}
        onRestock={handleConfirmRestock}
      />

      <ConfirmDialog
        isOpen={confirmOutOpen}
        onClose={() => {
          setConfirmOutOpen(false);
          setPendingOutItem(null);
        }}
        onConfirm={handleConfirmMarkOut}
        title="Mark Item as Out of Stock?"
        description="This item will become unavailable for kitchen operations and menu usage."
        confirmLabel="Mark Out of Stock"
        cancelLabel="Cancel"
        variant="danger"
      />

      <InventoryDetailDrawer
        item={selectedItem}
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedItem(null);
        }}
        onEdit={(item) => {
          setSelectedItem(item);
          setModalState({ mode: "edit", item });
        }}
        onRestockClick={(item) => {
          setSelectedItem(item);
          setModalState({ mode: "restock", item });
        }}
      />
    </div>
  );
}
