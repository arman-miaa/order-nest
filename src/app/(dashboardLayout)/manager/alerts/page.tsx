/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  AlertTriangle,
  Bell,
  CheckCircle,
  Clock,
  Loader2,
  RefreshCw,
  ShieldAlert,
  ShoppingBag,
  UserCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useGetAllAlertsQuery, useResolveAlertMutation } from "@/redux/api/restaurantApi";
import { Alert } from "@/redux/features/restaurantSlice";
import { unwrapApiData } from "@/src/utils/api-normalize";

const normalizeAlert = (alert: any): Alert => ({
  id: String(alert._id ?? alert.id),
  type: alert.type ?? "system",
  message: alert.message ?? alert.title ?? "System alert",
  severity: alert.severity ?? "info",
  createdAt: alert.createdAt ?? new Date().toISOString(),
  resolved: Boolean(alert.resolved ?? alert.isResolved),
  tableId: alert.tableId ?? alert.table?.tableNo,
});

export default function ManagerAlertsPage() {
  const { data, isLoading, isError, refetch } = useGetAllAlertsQuery(undefined);
  const [resolveAlert, { isLoading: isResolving }] = useResolveAlertMutation();
  const [filterMode, setFilterMode] = useState<"all" | "active" | "resolved">("active");

  const alerts = useMemo(() => unwrapApiData<any[]>(data, []).map(normalizeAlert), [data]);

  const filteredAlerts = alerts.filter((alert) => {
    if (filterMode === "all") return true;
    if (filterMode === "active") return !alert.resolved;
    if (filterMode === "resolved") return alert.resolved;
    return true;
  });

  const handleResolve = async (alertId: string) => {
    try {
      await resolveAlert(alertId).unwrap();
      toast.success("Alert marked resolved");
    } catch (error: any) {
      toast.error(error?.data?.message || "Could not resolve alert.");
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "delay":
        return <Clock className="h-5 w-5 text-red-500" />;
      case "stock":
        return <ShoppingBag className="h-5 w-5 text-amber-500" />;
      case "vip":
        return <UserCheck className="h-5 w-5 text-blue-500" />;
      default:
        return <ShieldAlert className="h-5 w-5 text-slate-500" />;
    }
  };

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-red-200 bg-red-50/30 text-red-800";
      case "warning":
        return "border-amber-200 bg-amber-50/30 text-amber-800";
      case "info":
        return "border-blue-200 bg-blue-50/30 text-blue-800";
      default:
        return "border-slate-200 bg-slate-50/30 text-slate-800";
    }
  };

  const totalActive = alerts.filter((a) => !a.resolved).length;
  const totalCritical = alerts.filter((a) => !a.resolved && a.severity === "critical").length;
  const totalWarning = alerts.filter((a) => !a.resolved && a.severity === "warning").length;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Alert Center</h1>
          <p className="text-slate-500">Live operational alerts, incident logging, and resolution tracking.</p>
        </div>
        <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-sm font-semibold text-slate-500">
            <span>Critical Alerts</span>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">{totalCritical}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-sm font-semibold text-slate-500">
            <span>Active Warnings</span>
            <Bell className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">{totalWarning}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-sm font-semibold text-slate-500">
            <span>Total Unresolved</span>
            <CheckCircle className="h-4 w-4 text-slate-400" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">{totalActive}</p>
        </div>
      </div>

      <div className="flex border-b border-slate-200">
        {(["active", "resolved", "all"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterMode(tab)}
            className={`border-b-2 px-6 py-3 text-sm font-bold capitalize transition ${
              filterMode === tab
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab} Alerts {tab === "active" && totalActive > 0 && `(${totalActive})`}
          </button>
        ))}
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm min-h-[350px]">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading alerts...
          </div>
        ) : isError ? (
          <div className="py-20 text-center text-sm text-red-600">Failed to load alerts.</div>
        ) : filteredAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400">
            <CheckCircle className="h-12 w-12 text-slate-200 stroke-1 mb-3" />
            <p className="text-sm font-semibold">All Clear!</p>
            <p className="text-xs text-slate-400 mt-1">No alerts found in this section.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex flex-col gap-4 rounded-2xl border p-5 transition sm:flex-row sm:items-center sm:justify-between ${getSeverityStyle(alert.severity)}`}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 shrink-0 rounded-xl bg-white p-2.5 shadow-xs">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {alert.type} notification
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className="text-xs font-medium text-slate-500">
                        {new Date(alert.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-bold text-slate-800">{alert.message}</p>
                    {alert.tableId && (
                      <span className="mt-2 inline-block rounded-lg border border-slate-200 bg-white/70 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                        Table {alert.tableId}
                      </span>
                    )}
                  </div>
                </div>

                {!alert.resolved ? (
                  <button
                    onClick={() => handleResolve(alert.id)}
                    disabled={isResolving}
                    className="flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-slate-800 disabled:opacity-50"
                  >
                    <CheckCircle className="h-3.5 w-3.5" /> Mark Resolved
                  </button>
                ) : (
                  <span className="flex shrink-0 items-center gap-1.5 text-xs font-bold text-slate-400">
                    <CheckCircle className="h-4 w-4 text-emerald-500" /> Resolved
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}