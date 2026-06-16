"use client";

import React from "react";
import Link from "next/link";
import { RotateCcw, ChevronRight } from "lucide-react";
import useAnalytics from "@/components/dashboard/manager/dashboard/useAnalytics";
import { LiveStats } from "@/components/dashboard/manager/dashboard/LiveStats";
import { OrderBreakdown } from "@/components/dashboard/manager/dashboard/OrderBreakdown";
import { ActiveOrderFeed } from "@/components/dashboard/manager/dashboard/ActiveOrderFeed";
import RevenueChart from "@/components/dashboard/manager/dashboard/RevenueChart";


export const ManagerDashboard: React.FC = () => {
  const {
    orders,
    currentTime,
    totalRevenue,
    activeOrders,
    occupancyPercentage,
    avgTicketTime,
    handleReset,
    getTableCode,
  } = useAnalytics();

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Panel */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
            Dashboard Overview
          </h1>
          <p className="text-slate-500">
            Live metrics, active order states, and analytics feed.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Demo Data
          </button>
          <Link
            href="/manager/floor-view"
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition "
          >
            Live Floor View
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <LiveStats
        totalRevenue={totalRevenue}
        activeOrdersCount={activeOrders.length}
        queuedCount={orders.filter((o) => o.status === "Queued").length}
        cookingCount={orders.filter((o) => o.status === "Cooking").length}
        occupancyPercentage={occupancyPercentage}
        avgTicketTime={avgTicketTime}
      />

      {/* Main Grid: Charts & Feeds */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Columns (Chart + Breakdown) */}
        <div className="lg:col-span-2 space-y-6">
          <RevenueChart />
          <OrderBreakdown />
        </div>

        {/* Right Column (Active Order Feed) */}
        <ActiveOrderFeed
          activeOrders={activeOrders}
          currentTime={currentTime}
          getTableCode={getTableCode}
        />
      </div>
    </div>
  );
};

export default ManagerDashboard;