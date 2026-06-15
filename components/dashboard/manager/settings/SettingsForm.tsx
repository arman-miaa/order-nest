import React from "react";
import {
  Settings,
  Bell,
  Save,
  Shield,
  Clock,
  Percent,
  Wifi,
  Database,
  RefreshCw,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { useSettings } from "./useSettings";

const ToggleSwitch = ({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) => (
  <button
    onClick={() => onChange(!value)}
    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
      value ? "bg-slate-900" : "bg-slate-200"
    }`}
  >
    <span
      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
        value ? "translate-x-5" : "translate-x-0"
      }`}
    />
  </button>
);

export const SettingsForm: React.FC = () => {
  const {
    taxRate, setTaxRate,
    serviceCharge, setServiceCharge,
    defaultPrepTime, setDefaultPrepTime,
    overdueThreshold, setOverdueThreshold,
    restaurantName, setRestaurantName,
    currency, setCurrency,
    notifyDelays, setNotifyDelays,
    notifyVip, setNotifyVip,
    notifyStock86, setNotifyStock86,
    notifySystem, setNotifySystem,
    websocketEnabled, setWebsocketEnabled,
    offlineQueue, setOfflineQueue,
    duplicateGuard, setDuplicateGuard,
    saved,
    handleSave,
  } = useSettings();

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
          Settings
        </h1>
        <p className="text-slate-500 mt-1">
          Configure restaurant preferences, billing, notifications, and system behavior.
        </p>
      </div>

      {/* Two-column grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Restaurant Configuration */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="rounded-xl bg-slate-100 p-2.5">
              <Settings className="h-5 w-5 text-slate-700" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Restaurant Configuration</h2>
              <p className="text-xs text-slate-500">Basic restaurant details and regional settings</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Restaurant Name
              </label>
              <input
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Percent className="h-3.5 w-3.5" /> Tax Rate
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-slate-400 focus:bg-white"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">%</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Percent className="h-3.5 w-3.5" /> Service Charge
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={serviceCharge}
                    onChange={(e) => setServiceCharge(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-slate-400 focus:bg-white"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">%</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-slate-400 focus:bg-white cursor-pointer"
              >
                <option value="USD">USD — US Dollar ($)</option>
                <option value="EUR">EUR — Euro (€)</option>
                <option value="GBP">GBP — British Pound (£)</option>
                <option value="BDT">BDT — Bangladeshi Taka (৳)</option>
              </select>
            </div>

            <button
              onClick={() => handleSave("Restaurant")}
              className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 py-3 text-sm font-bold text-white shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {saved === "Restaurant" ? (
                <><Check className="h-4 w-4" /> Saved!</>
              ) : (
                <><Save className="h-4 w-4" /> Save Configuration</>
              )}
            </button>
          </div>
        </div>

        {/* Kitchen Timing */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="rounded-xl bg-amber-50 p-2.5">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Kitchen Timing Rules</h2>
              <p className="text-xs text-slate-500">Default prep time and overdue alert thresholds</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Default Prep Time (when item has no set time)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={defaultPrepTime}
                  onChange={(e) => setDefaultPrepTime(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-slate-400 focus:bg-white"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">min</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Overdue Alert Threshold
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={overdueThreshold}
                  onChange={(e) => setOverdueThreshold(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-slate-400 focus:bg-white"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">min</span>
              </div>
              <p className="text-xs text-slate-400">
                Orders exceeding this duration will be flagged red on all screens.
              </p>
            </div>

            <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4 text-xs text-amber-800 leading-relaxed">
              <strong className="block mb-1">Priority Formula</strong>
              <code className="font-mono text-xs">due_time = fired_time + prep_time</code>
              <br />
              <code className="font-mono text-xs">urgency = current_time − due_time</code>
            </div>

            <button
              onClick={() => handleSave("Kitchen Timing")}
              className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 py-3 text-sm font-bold text-white shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {saved === "Kitchen Timing" ? (
                <><Check className="h-4 w-4" /> Saved!</>
              ) : (
                <><Save className="h-4 w-4" /> Save Timing Rules</>
              )}
            </button>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="rounded-xl bg-blue-50 p-2.5">
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Notification Preferences</h2>
              <p className="text-xs text-slate-500">Control which alerts appear on the manager screen</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              {
                label: "Delayed Order Alerts",
                desc: "Show alert when any order exceeds the overdue threshold",
                value: notifyDelays,
                onChange: setNotifyDelays,
              },
              {
                label: "VIP Table Notifications",
                desc: "Show banner when VIP guests are seated or order",
                value: notifyVip,
                onChange: setNotifyVip,
              },
              {
                label: "86 Out-of-Stock Alerts",
                desc: "Show warning when a menu item is marked out of stock",
                value: notifyStock86,
                onChange: setNotifyStock86,
              },
              {
                label: "System Health Alerts",
                desc: "Show connectivity and sync status notifications",
                value: notifySystem,
                onChange: setNotifySystem,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-150 bg-slate-50/50 p-4"
              >
                <div>
                  <p className="text-sm font-bold text-slate-900">{item.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                </div>
                <ToggleSwitch value={item.value} onChange={item.onChange} />
              </div>
            ))}

            <button
              onClick={() => handleSave("Notifications")}
              className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 py-3 text-sm font-bold text-white shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {saved === "Notifications" ? (
                <><Check className="h-4 w-4" /> Saved!</>
              ) : (
                <><Save className="h-4 w-4" /> Save Notification Settings</>
              )}
            </button>
          </div>
        </div>

        {/* System & Sync */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="rounded-xl bg-emerald-50 p-2.5">
              <Shield className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">System &amp; Sync Rules</h2>
              <p className="text-xs text-slate-500">Realtime architecture and data integrity configuration</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              {
                label: "WebSocket Live Sync",
                desc: "Enable real-time push events across all screens",
                value: websocketEnabled,
                onChange: setWebsocketEnabled,
                icon: <Wifi className="h-4 w-4 text-emerald-600" />,
              },
              {
                label: "Offline Queue (Staff Tablets)",
                desc: "Queue orders locally when disconnected and sync on reconnect",
                value: offlineQueue,
                onChange: setOfflineQueue,
                icon: <Database className="h-4 w-4 text-blue-500" />,
              },
              {
                label: "Duplicate Fire Guard",
                desc: "Reject repeated order submissions for the same ticket",
                value: duplicateGuard,
                onChange: setDuplicateGuard,
                icon: <Shield className="h-4 w-4 text-slate-500" />,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-150 bg-slate-50/50 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{item.icon}</div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{item.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
                <ToggleSwitch value={item.value} onChange={item.onChange} />
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
            <button
              onClick={() => toast.info("Backup triggered successfully")}
              className="w-full rounded-xl border border-slate-200 bg-white hover:bg-slate-50 py-3 text-sm font-bold text-slate-700 shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Database className="h-4 w-4" />
              Trigger State Backup
            </button>
            <button
              onClick={() => {
                if (typeof window !== "undefined") localStorage.removeItem("ordernest_state");
                toast.success("System state cleared. Reload to reset demo data.");
              }}
              className="w-full rounded-xl border border-red-100 bg-red-50 hover:bg-red-100/80 py-3 text-sm font-bold text-red-700 shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              Reset &amp; Clear Demo State
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsForm;
