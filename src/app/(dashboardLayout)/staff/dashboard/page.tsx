"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  advanceOrderStatus,
  updateTableStatus,
  TableStatus,
} from "@/redux/features/restaurantSlice";
import {
  Clock,
  Soup,
  CheckCircle2,
  AlertTriangle,
  Users,
  Utensils,
  ArrowRight,
  ChefHat,
  Sparkles,
  Activity,
  Flame,
  Table2,
  ClipboardList,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

export default function StaffDashboardPage() {
  const dispatch = useAppDispatch();
  const { tables, orders } = useAppSelector((s) => s.restaurant);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const interval = setInterval(() => setCurrentTime(new Date()), 10000);
    return () => clearInterval(interval);
  }, []);

  // Derived stats
  const activeOrders = orders.filter(
    (o) => o.status === "Queued" || o.status === "Cooking"
  );
  const readyOrders = orders.filter((o) => o.status === "Ready");
  const servedOrders = orders.filter(
    (o) => o.status === "Served" || o.status === "Cleared"
  );
  const occupiedTables = tables.filter(
    (t) => t.status !== "Available" && t.status !== "Dirty"
  );
  const availableTables = tables.filter((t) => t.status === "Available");
  const totalRevenue = orders
    .filter((o) => o.status === "Served" || o.status === "Cleared")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const getMinutesElapsed = (str: string) => {
    if (!currentTime) return 0;
    return Math.round(
      (currentTime.getTime() - new Date(str).getTime()) / 60000
    );
  };

  const getTableCode = (id: number) => (id < 10 ? `T0${id}` : `T${id}`);

  const handleServe = (orderId: string) => {
    dispatch(advanceOrderStatus({ orderId }));
    toast.success("Order marked as served!");
  };

  const handleClear = (orderId: string) => {
    dispatch(advanceOrderStatus({ orderId }));
    toast.success("Table cleared!");
  };

  const getStatusConfig = (status: TableStatus) => {
    switch (status) {
      case "Available":
        return {
          bg: "bg-emerald-50 border-emerald-200 text-emerald-700",
          dot: "bg-emerald-500",
          label: "Available",
        };
      case "Seated":
        return {
          bg: "bg-blue-50 border-blue-200 text-blue-700",
          dot: "bg-blue-500",
          label: "Seated",
        };
      case "Ordering":
        return {
          bg: "bg-amber-50 border-amber-200 text-amber-700",
          dot: "bg-amber-500",
          label: "Ordering",
        };
      case "Eating":
        return {
          bg: "bg-orange-50 border-orange-200 text-orange-700",
          dot: "bg-orange-500",
          label: "Eating",
        };
      case "Bill Requested":
        return {
          bg: "bg-purple-50 border-purple-200 text-purple-700",
          dot: "bg-purple-500",
          label: "Bill",
        };
      case "Dirty":
        return {
          bg: "bg-slate-50 border-slate-200 text-slate-500",
          dot: "bg-slate-400",
          label: "Dirty",
        };
      default:
        return {
          bg: "bg-slate-50 border-slate-200 text-slate-600",
          dot: "bg-slate-400",
          label: status,
        };
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ─── Header ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">
            OrderNest Staff OS
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Staff Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {currentTime?.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}{" "}
            &mdash; Live floor view & order tracking
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/staff/tables"
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition"
          >
            <Table2 className="h-4 w-4 text-slate-500" />
            Tables
          </Link>
          <Link
            href="/staff/new-order"
            className="flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition"
          >
            <Plus className="h-4 w-4" />
            New Order
          </Link>
        </div>
      </div>

      {/* ─── KPI Cards ───────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Active Orders */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              In Kitchen
            </span>
            <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
              <Flame className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-slate-900">
              {activeOrders.length}
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              {orders.filter((o) => o.status === "Queued").length} queued ·{" "}
              {orders.filter((o) => o.status === "Cooking").length} cooking
            </p>
          </div>
          {activeOrders.length > 0 && (
            <div className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-amber-600">
              <Activity className="h-3.5 w-3.5 animate-pulse" />
              Kitchen is active
            </div>
          )}
        </div>

        {/* Ready to Serve */}
        <div
          className={`rounded-2xl border p-5 shadow-sm transition ${
            readyOrders.length > 0
              ? "border-emerald-200 bg-emerald-50"
              : "border-slate-100 bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                readyOrders.length > 0 ? "text-emerald-700" : "text-slate-500"
              }`}
            >
              Ready to Serve
            </span>
            <div
              className={`rounded-xl p-2 ${
                readyOrders.length > 0
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-50 text-slate-500"
              }`}
            >
              <Soup className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3
              className={`text-3xl font-extrabold ${
                readyOrders.length > 0 ? "text-emerald-900" : "text-slate-900"
              }`}
            >
              {readyOrders.length}
            </h3>
            <p
              className={`mt-0.5 text-xs ${
                readyOrders.length > 0 ? "text-emerald-700" : "text-slate-500"
              }`}
            >
              {readyOrders.length > 0
                ? "Tickets waiting at pass"
                : "No items at pass"}
            </p>
          </div>
          {readyOrders.length > 0 && (
            <Link
              href="/staff/ready-to-serve"
              className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 hover:underline"
            >
              Run them now <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>

        {/* Occupied Tables */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Occupied Tables
            </span>
            <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-slate-900">
              {occupiedTables.length}
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              of {tables.length} total tables
            </p>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-500"
              style={{
                width: `${Math.round(
                  (occupiedTables.length / tables.length) * 100
                )}%`,
              }}
            />
          </div>
        </div>

        {/* Revenue */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Served Revenue
            </span>
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-3xl font-extrabold text-slate-900">
              ${totalRevenue.toFixed(0)}
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              {servedOrders.length} orders completed
            </p>
          </div>
        </div>
      </div>

      {/* ─── Main Grid ───────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">

        {/* Left: Table Floor Map */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Floor Table Map
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {availableTables.length} available · {occupiedTables.length}{" "}
                occupied
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
                  <span
                    className={`h-2 w-2 rounded-full ${c.dot}`}
                  />
                  <span className="text-[10px] font-semibold text-slate-500">
                    {s}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Live Order Feed + Ready to Serve */}
        <div className="space-y-5">
          {/* Ready to Serve urgent banner */}
          {readyOrders.length > 0 && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700">
                  <Soup className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-emerald-900">
                    {readyOrders.length} Order
                    {readyOrders.length > 1 ? "s" : ""} Ready at Pass!
                  </p>
                  <p className="text-xs text-emerald-700">
                    Run to tables now
                  </p>
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
                <h2 className="text-base font-bold text-slate-900">
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
              {[...readyOrders, ...activeOrders].length === 0 ? (
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
                [...readyOrders, ...activeOrders].map((order) => {
                  const elapsed = getMinutesElapsed(order.createdAt);
                  const isOverdue =
                    elapsed > 15 && order.status !== "Ready";

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
                              #{order.id.split("-")[1] || order.id} ·{" "}
                              {order.items.length} items
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
                              isOverdue
                                ? "text-red-600 animate-pulse"
                                : "text-slate-400"
                            }`}
                          >
                            {isOverdue && (
                              <AlertTriangle className="h-2.5 w-2.5" />
                            )}
                            <Clock className="h-2.5 w-2.5" />
                            {elapsed}m
                          </div>
                        </div>
                      </div>

                      {/* Items preview */}
                      <p className="mt-2 text-[10px] text-slate-500 font-medium line-clamp-1">
                        {order.items
                          .map((i) => `${i.quantity}x ${i.name}`)
                          .join(", ")}
                      </p>

                      {/* Action */}
                      {order.status === "Ready" && (
                        <button
                          onClick={() => handleServe(order.id)}
                          className="mt-3 w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2 text-[10px] font-extrabold text-white transition flex items-center justify-center gap-1.5 shadow-xs"
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
      </div>

      {/* ─── Quick Actions Strip ─────────────────────────────── */}
      <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "Seat a Table",
              desc: "Set table to seated",
              href: "/staff/tables",
              icon: <Users className="h-5 w-5 text-blue-600" />,
              bg: "bg-blue-50 border-blue-100 hover:bg-blue-100/60",
            },
            {
              label: "Fire an Order",
              desc: "Build and send to kitchen",
              href: "/staff/new-order",
              icon: <ChefHat className="h-5 w-5 text-amber-600" />,
              bg: "bg-amber-50 border-amber-100 hover:bg-amber-100/60",
            },
            {
              label: "Ready to Serve",
              desc: `${readyOrders.length} tickets at pass`,
              href: "/staff/ready-to-serve",
              icon: <Soup className="h-5 w-5 text-emerald-600" />,
              bg: `${
                readyOrders.length > 0
                  ? "bg-emerald-50 border-emerald-200 hover:bg-emerald-100/60"
                  : "bg-slate-50 border-slate-100 hover:bg-slate-100/60"
              }`,
            },
            {
              label: "Full Order Board",
              desc: "Kanban by status",
              href: "/staff/orders",
              icon: <ClipboardList className="h-5 w-5 text-slate-600" />,
              bg: "bg-slate-50 border-slate-100 hover:bg-slate-100/60",
            },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className={`group flex flex-col gap-2.5 rounded-2xl border p-4 transition ${action.bg}`}
            >
              <div className="rounded-xl bg-white/80 border border-white shadow-xs p-2 w-fit">
                {action.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {action.label}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {action.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}