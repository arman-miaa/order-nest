import React from "react";
import { Flame, ChefHat } from "lucide-react";
import { OrderStatus } from "../../shared/types/restaurant.types";

interface StatusControlsProps {
  status: OrderStatus;
  isAllChecked: boolean;
  checkedCount: number;
  totalItemsCount: number;
  onStartCooking: () => void;
  onMarkReady: () => void;
}

export const StatusControls: React.FC<StatusControlsProps> = ({
  status,
  isAllChecked,
  checkedCount,
  totalItemsCount,
  onStartCooking,
  onMarkReady,
}) => {
  if (status === "Queued") {
    return (
      <button
        onClick={onStartCooking}
        className="w-full rounded-xl bg-amber-600 hover:bg-amber-500 py-3 text-xs font-extrabold text-white shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <Flame className="h-4 w-4 animate-pulse" />
        START COOKING
      </button>
    );
  }

  return (
    <button
      onClick={onMarkReady}
      className={`w-full rounded-xl py-3 text-xs font-extrabold shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer ${
        isAllChecked
          ? "bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-600"
          : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-250 shadow-2xs text-slate-700"
      }`}
    >
      <ChefHat className="h-4 w-4" />
      MARK READY {isAllChecked ? "(CHECKED)" : `(${checkedCount}/${totalItemsCount})`}
    </button>
  );
};
export default StatusControls;
