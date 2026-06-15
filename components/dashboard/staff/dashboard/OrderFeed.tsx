import React from "react";
import Link from "next/link";
import { Clock, AlertTriangle, Soup, ChefHat, Sparkles, Plus, Utensils, ClipboardList } from "lucide-react";
import { Order } from "../../shared/types/restaurant.types";

interface OrderFeedProps {
  readyOrders: Order[];
  activeOrders: Order[];
  getMinutesElapsed: (str: string) => number;
  getTableCode: (id: number) => string;
  handleServe: (orderId: string) => void;
}

export const OrderFeed: React.FC<OrderFeedProps> = ({
  readyOrders,
  activeOrders,
  getMinutesElapsed,
  getTableCode,
  handleServe,
}) => {
  const combinedOrders = [...readyOrders, ...activeOrders];

  return (
    <div className="space-y-5">
      {/* Ready to Serve urgent banner */}
      {readyOrders.length > 0 && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700">
              <Soup className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-emerald-900">
                {readyOrders.length} Order{readyOrders.length > 1 ? "s" : ""} Ready at Pass!
              </p>
              <p className="text-xs text-emerald-700">Run to tables now</p>
            </div>
          </div>
          <Link
            href="/staff/ready-to-serve"
            className="shrink-0 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-bold text-white transition shadow-xs"
          >
            Serve Now
          </Link>
        </div>
      )}

      {/* Active Orders Feed */}
      <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm flex flex-col flex-1">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-sans">
              Active Order Feed
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {activeOrders.length} in kitchen
            </p>
          </div>
          <Link
            href="/staff/orders"
            className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
          >
            <ClipboardList className="h-3.5 w-3.5" />
            Full Board
          </Link>
        </div>

        <div className="space-y-3 overflow-y-auto max-h-[370px] pr-1">
          {combinedOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
              <Utensils className="h-10 w-10 text-slate-200 stroke-1 mb-2" />
              <p className="text-sm font-semibold text-slate-500">
                All caught up!
              </p>
              <p className="text-xs text-slate-400 mt-1">
                No active orders. Take a new order to get started.
              </p>
              <Link
                href="/staff/new-order"
                className="mt-4 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition"
              >
                <Plus className="h-3.5 w-3.5" />
                New Order
              </Link>
            </div>
          ) : (
            combinedOrders.map((order) => {
              const elapsed = getMinutesElapsed(order.createdAt);
              const isOverdue = elapsed > 15 && order.status !== "Ready";

              return (
                <div
                  key={order.id}
                  className={`rounded-2xl border p-4 transition ${
                    order.status === "Ready"
                      ? "border-emerald-200 bg-emerald-50/40"
                      : isOverdue
                      ? "border-red-200 bg-red-50/30"
                      : "border-slate-150 bg-slate-50/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      {order.status === "Ready" ? (
                        <div className="rounded-lg bg-emerald-100 p-1.5 text-emerald-700">
                          <Soup className="h-3.5 w-3.5" />
                        </div>
                      ) : (
                        <div className="rounded-lg bg-amber-100 p-1.5 text-amber-700">
                          <ChefHat className="h-3.5 w-3.5" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-extrabold text-slate-900">
                            Table {getTableCode(order.tableId)}
                          </span>
                          {order.isVip && (
                            <Sparkles className="h-3 w-3 text-amber-500" />
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold">
                          #{order.id.split("-")[1] || order.id} · {order.items.length} items
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold border ${
                          order.status === "Ready"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                            : order.status === "Cooking"
                            ? "bg-amber-100 text-amber-800 border-amber-200 animate-pulse"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {order.status}
                      </span>
                      <div
                        className={`mt-1 text-[10px] font-bold flex items-center justify-end gap-0.5 ${
                          isOverdue ? "text-red-600 animate-pulse" : "text-slate-400"
                        }`}
                      >
                        {isOverdue && <AlertTriangle className="h-2.5 w-2.5" />}
                        <Clock className="h-2.5 w-2.5" />
                        {elapsed}m
                      </div>
                    </div>
                  </div>

                  {/* Items preview */}
                  <p className="mt-2 text-[10px] text-slate-500 font-medium line-clamp-1">
                    {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                  </p>

                  {/* Action */}
                  {order.status === "Ready" && (
                    <button
                      onClick={() => handleServe(order.id)}
                      className="mt-3 w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2 text-[10px] font-extrabold text-white transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Soup className="h-3 w-3" />
                      Mark as Served — Table {getTableCode(order.tableId)}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
