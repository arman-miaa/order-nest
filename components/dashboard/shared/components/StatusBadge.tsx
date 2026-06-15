import React from "react";
import { TableStatus, OrderStatus } from "../types/restaurant.types";

interface StatusBadgeProps {
  status: TableStatus | OrderStatus;
  type: "table" | "order";
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type, className = "" }) => {
  if (type === "table") {
    const tableStatus = status as TableStatus;
    let styles = "";
    let dotColor = "";

    switch (tableStatus) {
      case "Available":
        styles = "bg-emerald-50 border-emerald-200 text-emerald-700";
        dotColor = "bg-emerald-500";
        break;
      case "Seated":
        styles = "bg-blue-50 border-blue-200 text-blue-700";
        dotColor = "bg-blue-500";
        break;
      case "Ordering":
        styles = "bg-amber-50 border-amber-200 text-amber-700";
        dotColor = "bg-amber-500";
        break;
      case "Eating":
        styles = "bg-orange-50 border-orange-200 text-orange-700";
        dotColor = "bg-orange-500";
        break;
      case "Bill Requested":
        styles = "bg-purple-50 border-purple-200 text-purple-700 animate-pulse";
        dotColor = "bg-purple-500";
        break;
      case "Dirty":
        styles = "bg-slate-50 border-slate-200 text-slate-500";
        dotColor = "bg-slate-400";
        break;
      default:
        styles = "bg-slate-50 border-slate-200 text-slate-600";
        dotColor = "bg-slate-450";
    }

    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold ${styles} ${className}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${dotColor} ${tableStatus === "Bill Requested" ? "animate-pulse" : ""}`} />
        {tableStatus}
      </span>
    );
  } else {
    const orderStatus = status as OrderStatus;
    let styles = "";

    switch (orderStatus) {
      case "Queued":
        styles = "bg-slate-100 text-slate-700 border-slate-200";
        break;
      case "Cooking":
        styles = "bg-amber-100 text-amber-800 border-amber-200 animate-pulse";
        break;
      case "Ready":
        styles = "bg-emerald-100 text-emerald-800 border-emerald-200";
        break;
      case "Served":
        styles = "bg-blue-100 text-blue-800 border-blue-200";
        break;
      case "Cleared":
        styles = "bg-slate-50 text-slate-500 border-slate-100";
        break;
      default:
        styles = "bg-gray-150 text-gray-800 border-gray-250";
    }

    return (
      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold ${styles} ${className}`}>
        {orderStatus}
      </span>
    );
  }
};
