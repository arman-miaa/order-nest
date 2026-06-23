/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo } from "react";

const categoryColors: Record<string, string> = {
  Burgers: "bg-emerald-500",
  Pizzas: "bg-blue-500",
  Sides: "bg-orange-500",
  Drinks: "bg-purple-500",
  Desserts: "bg-pink-500",
};

export const OrderBreakdown: React.FC<{ orders?: any[] }> = ({ orders = [] }) => {
  const categoryData = useMemo(() => {
    const counts = orders.reduce<Record<string, number>>((acc, order) => {
      (order.items ?? []).forEach((item: any) => {
        const category = item.category ?? item.menuItem?.category ?? "Other";
        acc[category] = (acc[category] ?? 0) + Number(item.quantity ?? 1);
      });
      return acc;
    }, {});

    const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
    return Object.entries(counts).map(([category, count]) => ({
      category,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      color: categoryColors[category] ?? "bg-slate-500",
    }));
  }, [orders]);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-bold text-slate-900 font-sans">
          Order Breakdown
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Percentage of total items ordered by category
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {categoryData.length === 0 ? (
          <p className="py-12 text-center text-sm text-slate-400">No order items found.</p>
        ) : categoryData.map((data) => (
          <div key={data.category} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700">
                {data.category}
              </span>
              <span className="text-sm font-bold text-slate-900">
                {data.percentage}%
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${data.color}`}
                style={{ width: `${data.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">Total Categories</span>
        <span className="text-xs font-bold text-slate-900">{categoryData.length}</span>
      </div>
    </div>
  );
};

export default OrderBreakdown;