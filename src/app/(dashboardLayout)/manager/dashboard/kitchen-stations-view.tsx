import React from "react";

const dummyStations = [
  { id: 1, name: "Grill Station", status: "Active", currentOrders: 3 },
  { id: 2, name: "Fry Station", status: "Active", currentOrders: 2 },
  { id: 3, name: "Prep Station", status: "Idle", currentOrders: 0 },
  { id: 4, name: "Dessert Station", status: "Idle", currentOrders: 0 },
];

export function KitchenStationsView() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Monitor the status and workload of each kitchen station.
      </p>
      <ul className="space-y-2">
        {dummyStations.map((station) => (
          <li key={station.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex justify-between items-center">
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