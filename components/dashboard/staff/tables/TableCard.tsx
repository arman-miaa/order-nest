import React from "react";
import { Users, Clock, Plus } from "lucide-react";
import { Table, Order, TableStatus } from "../../shared/types/restaurant.types";
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
  const statusLabels: Record<string, string> = {
    AVAILABLE: "Available",
    OCCUPIED: "Occupied",
    RESERVED: "Reserved",
    SEATED: "Seated",
    ORDERING: "Ordering",
    EATING: "Eating",
    BILL_REQUESTED: "Bill Requested",
    DIRTY: "Dirty",
  };

  const getActionHint = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "Tap to Seat";
      case "SEATED":
      case "ORDERING":
        return "Take Order";
      case "EATING":
        return "Order Placed";
      case "BILL_REQUESTED":
        return "Confirm Payment";
      case "DIRTY":
        return "Tap to Clear";
      default:
        return "Manage";
    }
  };

  const tableId = typeof table.id === 'number' ? table.id : parseInt(String(table.id ?? "0")) || 0;

  return (
    <button
      onClick={onClick}
      className={`group flex flex-col justify-between rounded-2xl border p-5 text-left transition h-36 relative overflow-hidden bg-white cursor-pointer ${statusColorConfig.card}`}
    >
      <div className="flex justify-between items-start w-full">
        <div>
          <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
            TABLE {getTableCode(tableId)}
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-xl font-extrabold text-slate-900 group-hover:scale-105 transition duration-200">
              Capacity: {table.capacity}
            </span>
          </div>
        </div>

        {/* ✅ Cast to TableStatus */}
        <StatusBadge
          status={table.status as TableStatus}
          type="table"
          className={statusColorConfig.badge}
        />
      </div>

      <div className="w-full">
        {table.status !== "AVAILABLE" && table.status !== "DIRTY" && (
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

      <div className="w-full border-t border-slate-150/70 pt-2.5 flex items-center justify-between mt-auto">
        <span className="text-[10px] font-extrabold tracking-wider uppercase text-slate-400">
          {getActionHint(table.status)}
        </span>
        <Plus className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition text-slate-500" />
      </div>
    </button>
  );
};

export default TableCard;