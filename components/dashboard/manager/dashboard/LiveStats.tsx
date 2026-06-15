import React from "react";
import { DollarSign, Activity, Percent, Clock, TrendingUp } from "lucide-react";

interface LiveStatsProps {
  totalRevenue: number;
  activeOrdersCount: number;
  queuedCount: number;
  cookingCount: number;
  occupancyPercentage: number;
  avgTicketTime: number;
}

export const LiveStats: React.FC<LiveStatsProps> = ({
  totalRevenue,
  activeOrdersCount,
  queuedCount,
  cookingCount,
  occupancyPercentage,
  avgTicketTime,
}) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Revenue */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-500">Total Revenue</span>
          <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-bold text-slate-900">${totalRevenue.toFixed(2)}</h3>
          <p className="mt-1 flex items-center text-xs text-emerald-600 font-medium">
            <TrendingUp className="mr-1 h-3.5 w-3.5" />
            +12% vs yesterday
          </p>
        </div>
      </div>

      {/* Active Orders */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-500">Active Orders</span>
          <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
            <Activity className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-bold text-slate-900">{activeOrdersCount}</h3>
          <p className="mt-1 text-xs text-slate-500">
            {queuedCount} queued, {cookingCount} cooking
          </p>
        </div>
      </div>

      {/* Table Occupancy */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-500">Table Occupancy</span>
          <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
            <Percent className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-bold text-slate-900">{occupancyPercentage}%</h3>
          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{ width: `${occupancyPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Avg Ticket Time */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-500">Avg Ticket Time</span>
          <div className="rounded-xl bg-purple-50 p-2.5 text-purple-600">
            <Clock className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-bold text-slate-900">{avgTicketTime} min</h3>
          <p className="mt-1 text-xs text-slate-500">Target speed: &lt; 15 min</p>
        </div>
      </div>
    </div>
  );
};
export default LiveStats;
