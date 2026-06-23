import React from "react";
import Link from "next/link";
import { Table2, Plus, Users, ChefHat, Soup, ClipboardList, Loader2, RefreshCw } from "lucide-react";
import { useStaffDashboard } from "./useStaffDashboard";
import { KpiCards } from "./KpiCards";
import { FloorMap } from "./FloorMap";
import { OrderFeed } from "./OrderFeed";

export const StaffDashboard: React.FC = () => {
  const {
    tables,
    orders,
    currentTime,
    activeOrders,
    readyOrders,
    occupiedTables,
    availableTables,
    totalRevenue,
    getMinutesElapsed,
    getTableCode,
    handleServe,
    getStatusConfig,
    isLoading,
    isError,
    refetch,
  } = useStaffDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-white py-20 text-sm text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading dashboard...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-100 bg-white py-16 text-center">
        <p className="text-sm font-semibold text-red-600">Failed to load dashboard data.</p>
        <button
          onClick={() => refetch()}
          className="mx-auto mt-4 flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* ─── Header ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">
            OrderNest Staff OS
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
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
      <KpiCards
        activeOrdersCount={activeOrders.length}
        queuedCount={orders.filter((o) => o.status === "Queued").length}
        cookingCount={orders.filter((o) => o.status === "Cooking").length}
        readyOrdersCount={readyOrders.length}
        occupiedTablesCount={occupiedTables.length}
        totalTablesCount={tables.length}
        totalRevenue={totalRevenue}
        servedOrdersCount={orders.filter((o) => o.status === "Served" || o.status === "Cleared").length}
      />

      {/* ─── Main Grid ───────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Left: Table Floor Map */}
        <FloorMap
          tables={tables}
          orders={orders}
          availableCount={availableTables.length}
          occupiedCount={occupiedTables.length}
          getStatusConfig={getStatusConfig}
          getTableCode={getTableCode}
          getMinutesElapsed={getMinutesElapsed}
        />

        {/* Right: Live Order Feed + Ready to Serve */}
        <OrderFeed
          readyOrders={readyOrders}
          activeOrders={activeOrders}
          getMinutesElapsed={getMinutesElapsed}
          getTableCode={getTableCode}
          handleServe={handleServe}
        />
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
};
