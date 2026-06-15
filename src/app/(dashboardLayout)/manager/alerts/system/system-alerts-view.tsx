"use client";

import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";

const alerts = [
  { id: 1, title: "Delayed Order #1842", detail: "Table 08 - Prep exceeding 20m", type: "critical" },
  { id: 2, title: "86 Item: Salmon", detail: "Marked out of stock by Chef", type: "action" },
  { id: 3, title: "Kitchen Sync", detail: "Last update 2s ago", type: "healthy" },
  { id: 4, title: "VIP Table 02", detail: "Service priority bumped", type: "notice" },
];

export function SystemAlertsView() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {alerts.map((item) => (
        <div key={item.id} className="group rounded-2xl border border-slate-200 bg-white p-4 flex items-start justify-between gap-4 transition-all hover:border-slate-300 hover:shadow-md">
          <div className="flex gap-3">
            <div className="mt-1">
              {item.type === 'critical' ? (
                <AlertCircle className="size-5 text-red-500" />
              ) : item.type === 'healthy' ? (
                <CheckCircle2 className="size-5 text-emerald-500" />
              ) : (
                <AlertTriangle className="size-5 text-amber-500" />
              )}
            </div>
            <div>
              <p className="text-base font-bold text-slate-900">{item.title}</p>
              <p className="text-sm font-medium text-slate-500">{item.detail}</p>
            </div>
          </div>
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm ${
            item.type === 'critical' ? 'bg-red-100 text-red-700' : 
            item.type === 'healthy' ? 'bg-emerald-100 text-emerald-700' : 
            'bg-amber-100 text-amber-700'
          }`}>
            {item.type}
          </span>
        </div>
      ))}
    </div>
  );
}