import React from "react";

export function KitchenDashboardView() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        This is the main dashboard for the kitchen staff. It provides an overview of
        current operations, key metrics, and quick actions.
      </p>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
        Here youll find summaries of active orders, station statuses, and performance indicators.
      </div>
    </div>
  );
}