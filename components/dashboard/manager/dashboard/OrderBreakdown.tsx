"use client";

import React from "react";

const categoryData = [
  { category: "Burgers", percentage: 42, color: "bg-emerald-500" },
  { category: "Pizzas", percentage: 30, color: "bg-blue-500" },
  { category: "Sides", percentage: 15, color: "bg-orange-500" },
  { category: "Drinks", percentage: 8, color: "bg-purple-500" },
  { category: "Desserts", percentage: 5, color: "bg-pink-500" },
];

export const OrderBreakdown: React.FC = () => {
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
        {categoryData.map((data) => (
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

      {/* Total indicator */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">Total Categories</span>
        <span className="text-xs font-bold text-slate-900">100%</span>
      </div>
    </div>
  );
};

export default OrderBreakdown;