import React from "react";
import { Users, Clock } from "lucide-react";
import { Table, Order, TableStatus } from "../../shared/types/restaurant.types";

interface TableGridProps {
  tables: Table[];
  orders: Order[];
  selectedTableId: number | null;
  setSelectedTableId: (id: number) => void;
  getStatusConfig: (status: TableStatus) => { bg: string; badge: string; indicator: string };
  getTableCode: (id: number) => string;
  calculateSeatedTime: (seatedAtStr?: string) => string;
  statusLabels?: Record<string, string>;
}

export const TableGrid: React.FC<TableGridProps> = ({
  tables,
  orders,
  selectedTableId,
  setSelectedTableId,
  getStatusConfig,
  getTableCode,
  calculateSeatedTime,
  statusLabels = {},
}) => {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <h2 className="text-lg font-bold text-slate-900 font-sans">Main Dining Area</h2>
        <div className="text-xs font-medium text-slate-500">
          Total Tables: {tables.length} | Occupied:{" "}
          {tables.filter((t) => t.status !== "AVAILABLE" && t.status !== "DIRTY").length}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
        {tables.map((table, index) => {
          const config = getStatusConfig(table.status);
          
          // ✅ Ensure unique key as string
          const uniqueKey = String(table.id ?? table._id ?? `table-${index}`);
          
          // ✅ Convert table.id to number for comparison
          const tableId = typeof table.id === 'number' ? table.id : Number(table.id);
          const isSelected = selectedTableId !== null && selectedTableId === tableId;

          return (
            <button
              key={uniqueKey}
              onClick={() => {
                if (!isNaN(tableId)) {
                  setSelectedTableId(tableId);
                }
              }}
              className={`flex flex-col justify-between rounded-2xl border p-4 text-left transition h-28 cursor-pointer ${
                config.bg
              } ${
                isSelected ? "ring-2 ring-slate-900 shadow-md scale-[1.02]" : "shadow-xs"
              }`}
            >
              <div className="flex items-start justify-between w-full">
                <span className="text-lg font-extrabold tracking-tight">
                  {getTableCode(tableId || index + 1)}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold opacity-80">
                  <Users className="h-3 w-3" />
                  {table.capacity} pax
                </span>
              </div>

              <div className="mt-3">
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-90 truncate">
                  {statusLabels[table.status] || table.status}
                </span>
                {table.status !== "AVAILABLE" && table.status !== "DIRTY" && (
                  <span className="text-[10px] flex items-center gap-1 opacity-70 mt-0.5">
                    <Clock className="h-2.5 w-2.5" />
                    {calculateSeatedTime(
                      table.seatedAt || orders.find((o) => o.id === table.activeOrderId)?.createdAt
                    )}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TableGrid;