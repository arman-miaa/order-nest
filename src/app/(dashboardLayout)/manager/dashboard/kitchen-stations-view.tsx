/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo } from "react";
import { Loader2 } from "lucide-react";
import { useGetAllMenuItemsQuery, useGetAllOrdersQuery } from "@/redux/api/restaurantApi";
import { unwrapApiData } from "@/src/utils/api-normalize";
import { normalizeMenuItem, normalizeOrder } from "@/src/utils/restaurant-normalize";

const stations = [
  { name: "Grill Station", categories: ["Burgers", "Pizzas"] },
  { name: "Fry Station", categories: ["Sides"] },
  { name: "Prep Station", categories: ["Drinks", "Desserts"] },
];

export function KitchenStationsView() {
  const { data: ordersData, isLoading: isOrdersLoading, isError: isOrdersError } = useGetAllOrdersQuery({ status: "active" });
  const { data: menuData, isLoading: isMenuLoading, isError: isMenuError } = useGetAllMenuItemsQuery(undefined);

  const orders = useMemo(() => unwrapApiData<any[]>(ordersData, []).map(normalizeOrder), [ordersData]);
  const menuItems = useMemo(() => unwrapApiData<any[]>(menuData, []).map(normalizeMenuItem), [menuData]);

  const stationSummaries = stations.map((station) => {
    const currentOrders = orders.filter((order) =>
      ["Queued", "Cooking"].includes(order.status) &&
      order.items.some((item) => {
        const menuItem = menuItems.find((candidate) => candidate.id === item.itemId);
        return menuItem && station.categories.includes(menuItem.category);
      })
    ).length;

    return {
      ...station,
      currentOrders,
      status: currentOrders > 0 ? "Active" : "Idle",
    };
  });

  if (isOrdersLoading || isMenuLoading) {
    return <div className="flex items-center gap-2 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading stations...</div>;
  }

  if (isOrdersError || isMenuError) {
    return <p className="text-sm text-red-600">Failed to load station workload.</p>;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Monitor the status and workload of each kitchen station.
      </p>
      <ul className="space-y-2">
        {stationSummaries.map((station) => (
          <li key={station.name} className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex justify-between items-center">
            <span className="font-semibold text-slate-800">{station.name}</span>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${station.status === 'Active' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
              {station.status} ({station.currentOrders} orders)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}