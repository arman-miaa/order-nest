import React from "react";
import { OrderStatus } from "../../shared/types/restaurant.types";

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = "" }) => {
  let colorClass = "bg-slate-100 text-slate-700 border-slate-200";

  switch (status) {
    case "Queued":
      colorClass = "bg-slate-100 text-slate-700 border-slate-200";
      break;
    case "Cooking":
      colorClass = "bg-amber-100 text-amber-800 border-amber-200 animate-pulse";
      break;
    case "Ready":
      colorClass = "bg-emerald-100 text-emerald-800 border-emerald-200";
      break;
    case "Served":
      colorClass = "bg-blue-100 text-blue-800 border-blue-205";
      break;
    default:
      colorClass = "bg-slate-50 text-slate-500 border-slate-100";
  }

  return (
    <span className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold border ${colorClass} ${className}`}>
      {status}
    </span>
  );
};
export default StatusBadge;
