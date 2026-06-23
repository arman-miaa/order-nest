"use client";

import React from "react";
import { Loader2, RefreshCw, Clock, Flame, AlertTriangle, CookingPot } from "lucide-react";
import { useKitchenDashboard } from "./useKitchenDashboard";

export const KitchenDashboard: React.FC = () => {
  const {
    activeOrders,
    queuedOrders,
    cookingOrders,
    overdueOrders,
    avgTicketTime,
    isLoading,
    isError,
    refetch,
  } = useKitchenDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-white py-20 text-sm text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading kitchen metrics...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-100 bg-white py-16 text-center text-sm font-semibold text-red-600">
        Failed to load dashboard data.
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
            Kitchen Overview
          </h1>
          <p className="text-slate-500">
            Live kitchen metrics and queue summary.
          </p>
        </div>
        <button
          onClick={refetch}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Active */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 text-slate-600 mb-4">
            <div className="rounded-xl bg-blue-50 p-2.5">
              <CookingPot className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-sm font-bold uppercase tracking-wider">Active Tickets</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight text-slate-900">
              {activeOrders.length}
            </span>
          </div>
        </div>

        {/* Queued */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 text-slate-600 mb-4">
            <div className="rounded-xl bg-amber-50 p-2.5">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <span className="text-sm font-bold uppercase tracking-wider">Queued</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight text-slate-900">
              {queuedOrders.length}
            </span>
          </div>
        </div>

        {/* Cooking */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 text-slate-600 mb-4">
            <div className="rounded-xl bg-orange-50 p-2.5">
              <Flame className="h-5 w-5 text-orange-600" />
            </div>
            <span className="text-sm font-bold uppercase tracking-wider">Cooking</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight text-slate-900">
              {cookingOrders.length}
            </span>
          </div>
        </div>

        {/* Overdue */}
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <div className="rounded-xl bg-red-100 p-2.5">
              <AlertTriangle className="h-5 w-5 text-red-700" />
            </div>
            <span className="text-sm font-bold uppercase tracking-wider">Overdue</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight text-red-700">
              {overdueOrders.length}
            </span>
            <span className="text-sm font-semibold text-red-600">tickets</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Performance</h2>
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-slate-500 font-semibold uppercase">Avg Ticket Time</span>
            <span className="text-3xl font-extrabold text-slate-800">{avgTicketTime} min</span>
          </div>
        </div>
      </div>
    </div>
  );
};
