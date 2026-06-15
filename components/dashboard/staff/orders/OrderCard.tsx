import React from "react";
import { Clock, AlertTriangle, ArrowRight, Sparkles } from "lucide-react";
import { Order } from "../../shared/types/restaurant.types";

interface OrderCardProps {
  order: Order;
  elapsed: number;
  isOverdue: boolean;
  getTableCode: (id: number) => string;
  onAdvance: () => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  elapsed,
  isOverdue,
  getTableCode,
  onAdvance,
}) => {
  return (
    <div
      className={`rounded-2xl border p-4 bg-white relative overflow-hidden transition shadow-3xs hover:border-slate-350 hover:shadow-xs ${
        order.isVip ? "border-amber-400" : "border-slate-200"
      } ${isOverdue ? "border-red-300 bg-red-50/10" : ""}`}
    >
      {/* VIP Tag */}
      {order.isVip && (
        <div className="absolute right-0 top-0 bg-amber-100 text-amber-800 rounded-bl-xl border-l border-b border-amber-200 px-2.5 py-0.5 text-[8px] font-extrabold uppercase tracking-widest flex items-center gap-1">
          <Sparkles className="h-2.5 w-2.5 text-amber-500" />
          VIP
        </div>
      )}

      <div className="flex justify-between items-start">
        <div>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
            TICKET #{order.id.split("-")[1] || order.id}
          </span>
          <span className="text-base font-extrabold text-slate-900 block mt-0.5">
            Table {getTableCode(order.tableId)}
          </span>
        </div>

        <span
          className={`text-[10px] font-bold flex items-center gap-1 mt-0.5 ${
            isOverdue ? "text-red-600 animate-pulse" : "text-slate-500"
          }`}
        >
          <Clock className="h-3 w-3" />
          {elapsed}m ago
        </span>
      </div>

      {/* Items summary */}
      <div className="mt-3 space-y-1 text-xs text-slate-700 bg-slate-50/50 rounded-xl p-2.5 border border-slate-150">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between">
            <span>
              {item.quantity}x {item.name}
            </span>
            {item.modifiers && item.modifiers.length > 0 && (
              <span className="text-[9px] text-slate-400 font-medium">
                + {item.modifiers.join(", ")}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Pricing & Control */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs font-bold text-blue-600">${order.totalPrice.toFixed(2)}</span>

        {order.status === "Ready" && (
          <button
            onClick={onAdvance}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-[10px] font-bold text-white shadow-xs transition cursor-pointer"
          >
            Serve Table
            <ArrowRight className="h-3 w-3" />
          </button>
        )}

        {order.status === "Served" && (
          <button
            onClick={onAdvance}
            className="flex items-center gap-1.5 rounded-lg bg-white hover:bg-slate-50 px-3 py-1.5 text-[10px] font-bold text-slate-650 shadow-2xs transition border border-slate-205 cursor-pointer"
          >
            Clear Table
          </button>
        )}
      </div>

      {/* Overdue Warning */}
      {isOverdue && (
        <div className="mt-2.5 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-red-600 border-t border-red-100 pt-2.5">
          <AlertTriangle className="h-3.5 w-3.5" />
          Overdue! Needs Expediting
        </div>
      )}
    </div>
  );
};
