import React from "react";

const dummyItems = [
  { id: 1, name: "Classic Burger", status: "In Stock", prepTime: "8 min" },
  { id: 2, name: "Chicken Alfredo", status: "In Stock", prepTime: "12 min" },
  { id: 3, name: "Salmon Fillet", status: "Low Stock", prepTime: "15 min" },
  { id: 4, name: "Caesar Salad", status: "In Stock", prepTime: "5 min" },
];

export function KitchenItemsView() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Manage the availability and details of menu items from the kitchen perspective.
      </p>
      <ul className="space-y-2">
        {dummyItems.map((item) => (
          <li key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex justify-between items-center">
            <span className="font-semibold text-slate-800">{item.name}</span>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${item.status === 'In Stock' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
              {item.status} ({item.prepTime})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}