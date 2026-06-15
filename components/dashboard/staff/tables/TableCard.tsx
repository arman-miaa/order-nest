import React from "react";
import { Users, Clock, ClipboardList, Coffee, CheckCircle2, DollarSign, Plus } from "lucide-react";
import { Table, Order } from "../../shared/types/restaurant.types";
import { StatusBadge } from "../../shared/components/StatusBadge";

interface TableCardProps {
  table: Table;
  activeOrder: Order | null;
  statusColorConfig: { card: string; badge: string; icon: string };
  getTableCode: (id: number) => string;
  calculateSeatedTime: (seatedAtStr?: string) => string;
  onClick: () => void;
}

export const TableCard: React.FC<TableCardProps> = ({
  table,
  activeOrder,
  statusColorConfig,
  getTableCode,
  calculateSeatedTime,
  onClick,
}) => {
  const getActionHint = (status: string) => {
    switch (status) {
      case "Available":
        return "Tap to Seat";
      case "Seated":
      case "Ordering":
        return "Take Order";
      case "Eating":
        return "Order Placed";
      case "Bill Requested":
        return "Confirm Payment";
      case "Dirty":
        return "Tap to Clear";
      default:
        return "Manage";
    }
  };

  return (
    <button
      onClick={onClick}
      className={`group flex flex-col justify-between rounded-2xl border p-5 text-left transition h-36 relative overflow-hidden bg-white cursor-pointer ${statusColorConfig.card}`}
    >
      <div className="flex justify-between items-start w-full">
        <div>
          <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
            TABLE {getTableCode(table.id)}
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-xl font-extrabold text-slate-900 group-hover:scale-105 transition duration-200">
              Capacity: {table.capacity}
            </span>
          </div>
        </div>

        {/* Status Pill */}
        <StatusBadge status={table.status} type="table" className={statusColorConfig.badge} />
      </div>

      {/* Info summary */}
      <div className="w-full">
        {table.status !== "Available" && table.status !== "Dirty" && (
          <div className="space-y-1 mt-2 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-1.5">
              <Users className={`h-3.5 w-3.5 ${statusColorConfig.icon}`} />
              <span>Seated: {calculateSeatedTime(table.seatedAt)}</span>
            </div>
            {activeOrder && (
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>
                  Order:{" "}
                  <span className="font-bold text-slate-700">
                    {activeOrder.status}
                  </span>
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Card action footer overlay hint */}
      <div className="w-full border-t border-slate-150/70 pt-2.5 flex items-center justify-between mt-auto">
        <span className="text-[10px] font-extrabold tracking-wider uppercase text-slate-400">
          {getActionHint(table.status)}
        </span>
        <Plus className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition text-slate-500" />
      </div>
    </button>
  );
};
