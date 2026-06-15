import React from "react";
import Link from "next/link";
import { Flame, Soup, Users, CheckCircle2, Activity, ArrowRight } from "lucide-react";
import { Order } from "../../shared/types/restaurant.types";

interface KpiCardsProps {
  activeOrdersCount: number;
  queuedCount: number;
  cookingCount: number;
  readyOrdersCount: number;
  occupiedTablesCount: number;
  totalTablesCount: number;
  totalRevenue: number;
  servedOrdersCount: number;
}

export const KpiCards: React.FC<KpiCardsProps> = ({
  activeOrdersCount,
  queuedCount,
  cookingCount,
  readyOrdersCount,
  occupiedTablesCount,
  totalTablesCount,
  totalRevenue,
  servedOrdersCount,
}) => {
  return (
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
            {activeOrdersCount}
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            {queuedCount} queued · {cookingCount} cooking
          </p>
        </div>
        {activeOrdersCount > 0 && (
          <div className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-amber-600">
            <Activity className="h-3.5 w-3.5 animate-pulse" />
            Kitchen is active
          </div>
        )}
      </div>

      {/* Ready to Serve */}
      <div
        className={`rounded-2xl border p-5 shadow-sm transition ${
          readyOrdersCount > 0
            ? "border-emerald-200 bg-emerald-50"
            : "border-slate-100 bg-white"
        }`}
      >
        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-bold uppercase tracking-wider ${
              readyOrdersCount > 0 ? "text-emerald-700" : "text-slate-500"
            }`}
          >
            Ready to Serve
          </span>
          <div
            className={`rounded-xl p-2 ${
              readyOrdersCount > 0
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
              readyOrdersCount > 0 ? "text-emerald-900" : "text-slate-900"
            }`}
          >
            {readyOrdersCount}
          </h3>
          <p
            className={`mt-0.5 text-xs ${
              readyOrdersCount > 0 ? "text-emerald-700" : "text-slate-500"
            }`}
          >
            {readyOrdersCount > 0
              ? "Tickets waiting at pass"
              : "No items at pass"}
          </p>
        </div>
        {readyOrdersCount > 0 && (
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
            {occupiedTablesCount}
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            of {totalTablesCount} total tables
          </p>
        </div>
        <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-500"
            style={{
              width: `${Math.round(
                (occupiedTablesCount / (totalTablesCount || 1)) * 100
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
            {servedOrdersCount} orders completed
          </p>
        </div>
      </div>
    </div>
  );
};
