"use client";

import React from "react";
import { Utensils, AlertTriangle } from "lucide-react";
import { StatusBadge } from "../../shared/components/StatusBadge";
import { OrderStatus } from "../../shared/types/restaurant.types"; // Import the type

interface Order {
  id: string;
  tableId: number;
  status: OrderStatus; // ✅ Use OrderStatus type instead of string
  items: Array<{ quantity: number; name: string }>;
  totalPrice?: number;
  createdAt: string;
}

interface ActiveOrderFeedProps {
  activeOrders: Order[];
  currentTime: Date | null;
  getTableCode: (id: number) => string;
}

export const ActiveOrderFeed: React.FC<ActiveOrderFeedProps> = ({
  activeOrders,
  currentTime,
  getTableCode,
}) => {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col h-[525px]">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-sans">
            Active Order Feed
          </h2>
          <p className="text-xs text-slate-500">
            {activeOrders.length} orders in progress
          </p>
        </div>
        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700 uppercase tracking-wide">
          Live Feed
        </span>
      </div>

      <div className="mt-4 flex-1 overflow-y-auto space-y-4 pr-1">
        {activeOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
            <Utensils className="h-10 w-10 text-slate-300 stroke-1 mb-2" />
            <p className="text-sm font-medium">No active orders</p>
            <p className="text-xs text-slate-400">New orders will show up here</p>
          </div>
        ) : (
          activeOrders.map((order) => {
            const minutesElapsed = currentTime
              ? Math.round(
                  (currentTime.getTime() - new Date(order.createdAt).getTime()) / 60000
                )
              : 0;
            const isDelayed = minutesElapsed > 15 && order.status !== "Ready";

            return (
              <div
                key={order.id}
                className={`rounded-xl border p-4 transition shadow-xs hover:border-slate-300 bg-slate-50/50 ${
                  isDelayed ? "border-red-200 bg-red-50/10" : "border-slate-200"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400">
                      TICKET #{order.id.split("-")[1] || order.id}
                    </span>
                    <h4 className="font-bold text-slate-900">
                      Table {getTableCode(order.tableId)}
                    </h4>
                  </div>
                  <StatusBadge status={order.status} type="order" />
                </div>

                {/* Items Preview */}
                <p className="mt-2 text-xs font-medium text-slate-600 line-clamp-2">
                  {order.items.map((item) => `${item.quantity}x ${item.name}`).join(", ")}
                </p>

                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-xs font-semibold text-slate-900">
                    ${order.totalPrice?.toFixed(2) || "0.00"}
                  </span>
                  <span
                    className={`text-[10px] font-bold flex items-center gap-1 ${
                      isDelayed ? "animate-pulse text-red-600" : "text-slate-500"
                    }`}
                  >
                    {isDelayed && <AlertTriangle className="h-3 w-3" />}
                    {minutesElapsed} min ago
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ActiveOrderFeed;