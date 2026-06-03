"use client";

import React, { useMemo, useState } from "react";
import { ArrowLeft, Download, Eye } from "lucide-react";
import Plan, { getPlanById, PlanId } from "@/components/Plan";
import DetailDrawer from "@/components/DetailDrawer";
import Table, { TableColumn } from "@/components/Table";
import Toast from "@/components/Toast";

type BillingTab = "overview" | "invoices";
type OverviewView = "manage" | "choose-plan";
type InvoiceStatus = "Upcoming" | "Pending" | "Paid";

interface InvoiceItem {
  id: string;
  dueDate: string;
  description: string;
  total: string;
  status: InvoiceStatus;
  subtotal: string;
  taxes: string;
  netPay: string;
  invoiceNumber?: string;
  paymentMethod?: string;
}

const seedInvoices: InvoiceItem[] = [
  { id: "inv-1", dueDate: "20/05/2026", description: "Monthly Invoice", total: "AED 3,000", status: "Upcoming", subtotal: "AED 3,000", taxes: "AED 450", netPay: "AED 3450" },
  { id: "inv-2", dueDate: "30/06/2026", description: "Monthly Invoice", total: "AED 750", status: "Pending", subtotal: "AED 750", taxes: "AED 112", netPay: "AED 862" },
  { id: "inv-3", dueDate: "15/07/2026", description: "Monthly Invoice", total: "AED 2,200", status: "Paid", subtotal: "AED 2,200", taxes: "AED 330", netPay: "AED 2530", invoiceNumber: "Y15Y4VWM-0005", paymentMethod: "VISA 3794" },
  { id: "inv-4", dueDate: "01/08/2026", description: "Monthly Invoice", total: "AED 3,000", status: "Paid", subtotal: "AED 3,000", taxes: "AED 450", netPay: "AED 3450", invoiceNumber: "Y15Y4VWM-0006", paymentMethod: "VISA 3794" },
  { id: "inv-5", dueDate: "12/09/2026", description: "Monthly Invoice", total: "AED 3,000", status: "Pending", subtotal: "AED 3,000", taxes: "AED 450", netPay: "AED 3450" },
];

function getInvoiceStatusClass(status: InvoiceStatus) {
  switch (status) {
    case "Paid":
      return "bg-[#EBF7FF] text-[#0A46A6]";
    case "Pending":
      return "bg-amber-50 text-amber-600";
    default:
      return "bg-zinc-100 text-zinc-600";
  }
}

export default function BillingPage() {
  const [tab, setTab] = useState<BillingTab>("overview");
  const [overviewView, setOverviewView] = useState<OverviewView>("manage");
  const [activePlanId, setActivePlanId] = useState<PlanId>("Standard");
  const [autoRenewal, setAutoRenewal] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const activePlan = getPlanById(activePlanId);

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const columns: TableColumn<InvoiceItem>[] = [
    { key: "dueDate", header: "Due Date" },
    { key: "description", header: "Description" },
    { key: "total", header: "Invoice Total" },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${getInvoiceStatusClass(item.status)}`}>
          {item.status}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Action",
      align: "center",
      render: (item) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedInvoice(item);
          }}
          className="text-zinc-500 hover:text-zinc-700"
        >
          <Eye className="h-4 w-4" />
        </button>
      ),
    },
  ];

  const drawerFooter = useMemo(() => {
    if (!selectedInvoice) return undefined;
    if (selectedInvoice.status === "Paid") {
      return (
        <button
          type="button"
          onClick={() => showToastMessage("Invoice PDF downloaded.")}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#041B40] to-[#0A46A6] px-5 py-2.5 text-sm font-semibold text-white"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </button>
      );
    }
    return (
      <button
        type="button"
        onClick={() => {
          showToastMessage("Payment initiated successfully.");
          setSelectedInvoice(null);
        }}
        className="w-full rounded-full bg-gradient-to-r from-[#041B40] to-[#0A46A6] px-5 py-2.5 text-sm font-semibold text-white"
      >
        Pay Now
      </button>
    );
  }, [selectedInvoice]);
  return (
    <div className="flex-1 h-full overflow-y-auto  p-4 md:p-6">
      <div className="space-y-4">
        <div className="flex gap-6 ">
          {(["overview", "invoices"] as BillingTab[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setTab(item);
                setOverviewView("manage");
              }}
              className={`pb-1 text-sm font-semibold capitalize cursor-pointer ${tab === item
                ? "border-b-3 border-[#041B40] bg-gradient-to-r from-[#041B40] to-[#0A46A6] bg-clip-text bg-clip-border text-transparent "
                : "text-zinc-500"
                }`}
            >
              {item}
            </button>
          ))}
        </div>

        {tab === "overview" ? (
          overviewView === "choose-plan" ? (
            <div className="rounded-2xl bg-white p-4 md:p-8">
              <button
                type="button"
                onClick={() => setOverviewView("manage")}
                className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-zinc-600"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <Plan
                selectedPlanId={activePlanId}
                onSelectPlan={(planId) => {
                  setActivePlanId(planId);
                  setOverviewView("manage");
                  showToastMessage(`${planId} plan selected successfully.`);
                }}
                onBack={() => setOverviewView("manage")}
                showFooter={false}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-[24px] font-semibold text-[#333839] mb-2">Manage Subscription</h1>
                  <p className="text-[16px] text-[#717680]">
                    View your current subscription details and manage recurring payments.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOverviewView("choose-plan")}
                  className="rounded-full bg-gradient-to-r from-[#041B40] to-[#0A46A6] cursor-pointer px-5 py-2 text-[14px] font-medium text-white"
                >
                  Change Subscription
                </button>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-100 pb-4">
                  <div>
                    <p className="text-[20px] font-semibold text-[#333839]">Active Plan</p>
                    <p className="text-[14px] font-medium text-[#717680]">{activePlan.subtitle ?? activePlan.name}</p>
                  </div>

                  <p className="text-[32px] font-semibold bg-gradient-to-r from-[#041B40] to-[#0A46A6] bg-clip-text text-transparent">
                    <span className="text-[14px] font-semibold text-[#717680]">AED </span>
                    {activePlan.price}
                    <span className="text-[14px] text-[#626D6F]"> /month</span>
                  </p>
                </div>
                <ul className="mt-4 grid grid-cols-1 gap-3">
                  {activePlan.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2 text-[14px] font-medium text-[#333839]">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full  text-black">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-5">
                <div>
                  <p className="font-semibold text-[#333839]">Auto-Renewal</p>
                  <p className="text-sm text-zinc-500">Automatically renew subscription each month.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAutoRenewal((prev) => !prev);
                    showToastMessage(
                      autoRenewal ? "Auto-renewal turned off." : "Auto-renewal enabled."
                    );
                  }}
                  className={`relative h-7 w-12 cursor-pointer rounded-full transition-colors ${autoRenewal ? "bg-gradient-to-r from-[#041B40] to-[#0A46A6]" : "bg-zinc-300"
                    }`}
                >
                  <span
                    className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${autoRenewal ? "left-5" : "left-0.5"
                      }`}
                  />
                </button>
              </div>
            </div>
          )
        ) : (
          <div className="space-y-4">
            <div>
              <h1 className="text-[24px] font-semibold text-[#333839] mb-2">Invoice Management</h1>
              <p className="text-[16px] text-[#717680]">
                Access invoice records, payment details, billing dates, and transaction history for your active subscription plan.
              </p>
            </div>

            <Table<InvoiceItem>
              columns={columns}
              data={seedInvoices}
              searchPlaceholder="Search..."
              searchFilter={(item, query) =>
                item.description.toLowerCase().includes(query.toLowerCase()) ||
                item.dueDate.includes(query)
              }
              onRowClick={(item) => setSelectedInvoice(item)}
              headerRight={
                <>
                  <button className="rounded-lg border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-600">
                    Date
                  </button>
                  <button className="rounded-lg border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-600">
                    Status
                  </button>
                </>
              }
            />
          </div>
        )}
      </div>

      <DetailDrawer
        isOpen={Boolean(selectedInvoice)}
        onClose={() => setSelectedInvoice(null)}
        title={selectedInvoice?.description ?? "Invoice"}
        badge={
          selectedInvoice ? (
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${getInvoiceStatusClass(selectedInvoice.status)}`}
            >
              {selectedInvoice.status}
            </span>
          ) : null
        }
        maxWidthClass="max-w-[420px]"
        footer={drawerFooter}
      >
        {selectedInvoice ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-zinc-500">Due Date</p>
                <p className="font-semibold text-[#333839]">{selectedInvoice.dueDate}</p>
              </div>
              <div>
                <p className="text-zinc-500">Status</p>
                <p className="font-semibold text-[#333839]">{selectedInvoice.status}</p>
              </div>
              {selectedInvoice.invoiceNumber ? (
                <div>
                  <p className="text-zinc-500">Invoice number</p>
                  <p className="font-semibold text-[#333839]">{selectedInvoice.invoiceNumber}</p>
                </div>
              ) : null}
              {selectedInvoice.paymentMethod ? (
                <div>
                  <p className="text-zinc-500">Payment method</p>
                  <p className="font-semibold text-[#333839]">{selectedInvoice.paymentMethod}</p>
                </div>
              ) : null}
            </div>
            <div className="space-y-2 rounded-xl border border-zinc-200 p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Subtotal</span>
                <span className="font-semibold">{selectedInvoice.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Taxes</span>
                <span className="font-semibold">{selectedInvoice.taxes}</span>
              </div>
              <div className="flex justify-between border-t border-zinc-100 pt-2">
                <span className="font-semibold text-[#333839]">Total Net Pay</span>
                <span className="text-lg font-bold text-[#0B2870]">{selectedInvoice.netPay}</span>
              </div>
            </div>
          </div>
        ) : null}
      </DetailDrawer>

      <Toast message={toastMessage} isVisible={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
}
