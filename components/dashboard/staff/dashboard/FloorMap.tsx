import React from "react";
import Link from "next/link";
import { Clock, Sparkles, ArrowRight } from "lucide-react";
import { Table, Order, TableStatus } from "../../shared/types/restaurant.types";

interface FloorMapProps {
  tables: Table[];
  orders: Order[];
  availableCount: number;
  occupiedCount: number;
  getStatusConfig: (status: TableStatus) => { bg: string; dot: string; label: string };
  getTableCode: (id: number) => string;
  getMinutesElapsed: (str: string) => number;
}

export const FloorMap: React.FC<FloorMapProps> = ({
  tables,
  orders,
  availableCount,
  occupiedCount,
  getStatusConfig,
  getTableCode,
  getMinutesElapsed,
}) => {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-sans">
            Floor Table Map
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {availableCount} available · {occupiedCount} occupied
          </p>
        </div>
        <Link
          href="/staff/tables"
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 transition"
        >
          Full View <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
        {tables.slice(0, 20).map((table) => {
          const config = getStatusConfig(table.status);
          const activeOrder = table.activeOrderId
            ? orders.find((o) => o.id === table.activeOrderId)
            : null;
          const elapsed = activeOrder
            ? getMinutesElapsed(activeOrder.createdAt)
            : null;

          return (
            <Link
              key={table.id}
              href={
                table.status === "Available"
                  ? "/staff/tables"
                  : `/staff/new-order?tableId=${table.id}`
              }
              className={`group flex flex-col items-center justify-center rounded-2xl border p-3 text-center transition hover:shadow-xs hover:scale-[1.03] h-24 relative ${config.bg}`}
            >
              {/* Status dot */}
              <span
                className={`absolute top-2 right-2 h-2 w-2 rounded-full ${config.dot} ${
                  table.status === "Bill Requested" ? "animate-pulse" : ""
                }`}
              />
              {table.isVip && (
                <Sparkles className="absolute top-1.5 left-1.5 h-3 w-3 text-amber-500" />
              )}
              <span className="text-base font-extrabold">
                {getTableCode(table.id)}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wide opacity-80 mt-0.5">
                {config.label}
              </span>
              {elapsed !== null && (
                <span className="text-[9px] font-semibold opacity-70 mt-0.5 flex items-center gap-0.5">
                  <Clock className="h-2.5 w-2.5" />
                  {elapsed}m
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Status legend */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-3">
        {(
          [
            "Available",
            "Seated",
            "Ordering",
            "Eating",
            "Bill Requested",
            "Dirty",
          ] as TableStatus[]
        ).map((s) => {
          const c = getStatusConfig(s);
          return (
            <div key={s} className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${c.dot}`} />
              <span className="text-[10px] font-semibold text-slate-500">
                {s}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
