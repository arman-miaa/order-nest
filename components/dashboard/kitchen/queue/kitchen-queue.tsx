"use client";

import { Clock, CheckCircle2, Flame } from "lucide-react";

const mockOrders = [
  {
    id: "#2041",
    table: "Table 04",
    items: [
      { name: "Classic Burger", qty: 2, note: "No onions" },
      { name: "Cheese Fries", qty: 1 },
    ],
    status: "Cooking",
    time: "8m",
    station: "Grill",
    priority: "normal",
  },
  {
    id: "#2042",
    table: "Table 12",
    items: [
      { name: "Chicken Alfredo", qty: 1 },
      { name: "Lemon Soda", qty: 2 },
    ],
    status: "Queued",
    time: "12m",
    station: "Pasta",
    priority: "high",
  },
  {
    id: "#2044",
    table: "Table 02",
    items: [
      { name: "Steak Frites", qty: 1, note: "Medium rare" },
    ],
    status: "Overdue",
    time: "overdue 3m",
    station: "Grill",
    priority: "critical",
  },
];

export function KitchenQueue() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {mockOrders.map((order) => (
        <div 
          key={order.id} 
          className={`rounded-3xl border-2 p-5 shadow-sm transition-all ${
            order.priority === 'critical' 
              ? 'border-red-200 bg-red-50/50 ring-1 ring-red-100' 
              : 'border-slate-100 bg-white'
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{order.id}</h3>
              <p className="text-sm font-medium text-slate-500">{order.table}</p>
            </div>
            <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
              order.priority === 'critical' ? 'bg-red-500 text-white' : 'bg-orange-100 text-orange-700'
            }`}>
              {order.status === 'Cooking' ? <Flame className="size-3" /> : <Clock className="size-3" />}
              {order.status}
            </div>
          </div>

          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start">
                <div className="flex gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-700">
                    {item.qty}x
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                    {item.note && <p className="text-xs text-orange-600 font-medium">Note: {item.note}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-50">
            <div className="flex items-center gap-2 text-slate-500">
              <Clock className="size-4" />
              <span className="text-xs font-semibold">{order.time}</span>
            </div>
            <button className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors">
              <CheckCircle2 className="size-3.5" />
              Done
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}