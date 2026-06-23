/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo } from "react";
import { Loader2 } from "lucide-react";
import { useGetAllMenuItemsQuery } from "@/redux/api/restaurantApi";
import { unwrapApiData } from "@/src/utils/api-normalize";
import { normalizeMenuItem } from "@/src/utils/restaurant-normalize";

export function KitchenItemsView() {
  const { data, isLoading, isError } = useGetAllMenuItemsQuery(undefined);
  const items = useMemo(() => unwrapApiData<any[]>(data, []).map(normalizeMenuItem), [data]);

  if (isLoading) {
    return <div className="flex items-center gap-2 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading kitchen items...</div>;
  }

  if (isError) {
    return <p className="text-sm text-red-600">Failed to load kitchen items.</p>;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Manage the availability and details of menu items from the kitchen perspective.
      </p>
      <ul className="space-y-2">
        {items.length === 0 ? (
          <li className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-500">No menu items found.</li>
        ) : items.map((item) => (
          <li key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex justify-between items-center">
            <span className="font-semibold text-slate-800">{item.name}</span>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${item.inStock ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
              {item.inStock ? "In Stock" : "Out of Stock"} ({item.prepTime} min)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}