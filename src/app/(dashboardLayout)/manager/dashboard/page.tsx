"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { resetDemoData } from "@/redux/features/restaurantSlice";
import { 
  DollarSign, 
  Activity, 
  Percent, 
  Clock, 
  Utensils, 
  RotateCcw,
  ChevronRight,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ManagerDashboardPage() {
  const dispatch = useAppDispatch();
  const { tables, orders, alerts } = useAppSelector((state) => state.restaurant);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  // Sync timer
  useEffect(() => {
    setCurrentTime(new Date());
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Compute metrics
  const completedOrders = orders.filter(o => o.status === "Served" || o.status === "Cleared");
  const totalRevenue = orders
    .filter(o => o.status !== "Cleared" && o.status !== "Queued") // revenue from prep onwards
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const activeOrders = orders.filter(
    (o) => o.status === "Queued" || o.status === "Cooking" || o.status === "Ready"
  );
  
  const occupiedTables = tables.filter((t) => t.status !== "Available" && t.status !== "Dirty").length;
  const occupancyPercentage = Math.round((occupiedTables / tables.length) * 100);

  // Avg ticket time calculation (in minutes)
  const servedOrders = orders.filter(o => o.completedAt);
  const avgTicketTime = servedOrders.length > 0
    ? Math.round(
        servedOrders.reduce((sum, o) => {
          const created = new Date(o.createdAt).getTime();
          const completed = new Date(o.completedAt!).getTime();
          return sum + (completed - created) / 60000;
        }, 0) / servedOrders.length
      )
    : 14;

  const handleReset = () => {
    dispatch(resetDemoData());
  };

  // Mock data for charts
  const hourlyData = [
    { hour: "11 AM", orders: 12 },
    { hour: "1 PM", orders: 28 },
    { hour: "3 PM", orders: 15 },
    { hour: "5 PM", orders: 32 },
    { hour: "7 PM", orders: 48 },
    { hour: "9 PM", orders: 22 },
  ];

  const categoryData = [
    { category: "Burgers", percentage: 42, color: "bg-emerald-500", fill: "#10b981" },
    { category: "Pizzas", percentage: 30, color: "bg-blue-500", fill: "#3b82f6" },
    { category: "Sides", percentage: 15, color: "bg-orange-500", fill: "#f97316" },
    { category: "Drinks", percentage: 8, color: "bg-purple-500", fill: "#a855f7" },
    { category: "Desserts", percentage: 5, color: "bg-pink-500", fill: "#ec4899" },
  ];

  // Helper for status colors
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Queued":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "Cooking":
        return "bg-amber-100 text-amber-800 border-amber-200 animate-pulse";
      case "Ready":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Served":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Panel */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500">Live metrics, active order states, and analytics feed.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Demo Data
          </button>
          <Link
            href="/manager/floor-view"
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            Live Floor View
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">Total Revenue</span>
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900">${totalRevenue.toFixed(2)}</h3>
            <p className="mt-1 flex items-center text-xs text-emerald-600 font-medium">
              <TrendingUp className="mr-1 h-3.5 w-3.5" />
              +12% vs yesterday
            </p>
          </div>
        </div>

        {/* Active Orders */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">Active Orders</span>
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
              <Activity className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900">{activeOrders.length}</h3>
            <p className="mt-1 text-xs text-slate-500">
              {orders.filter(o => o.status === "Queued").length} queued, {orders.filter(o => o.status === "Cooking").length} cooking
            </p>
          </div>
        </div>

        {/* Table Occupancy */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">Table Occupancy</span>
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
              <Percent className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900">{occupancyPercentage}%</h3>
            <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100">
              <div 
                className="h-full rounded-full bg-blue-600 transition-all duration-500" 
                style={{ width: `${occupancyPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Avg Ticket Time */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">Avg Ticket Time</span>
            <div className="rounded-xl bg-purple-50 p-2.5 text-purple-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900">{avgTicketTime} min</h3>
            <p className="mt-1 text-xs text-slate-500">Target speed: &lt; 15 min</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Charts & Feeds */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Columns (Charts) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Hourly Orders Custom SVG Chart */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Hourly Order Volume</h2>
                <p className="text-xs text-slate-500">Peak hour tracking (orders count)</p>
              </div>
              <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">Live</span>
            </div>
            
            <div className="mt-6 flex h-60 items-end justify-between px-2 pt-4">
              {hourlyData.map((data, idx) => {
                const heightPercentage = Math.round((data.orders / 50) * 100);
                return (
                  <div key={idx} className="flex flex-col items-center gap-2 w-1/6">
                    <span className="text-xs font-bold text-slate-700">{data.orders}</span>
                    <div className="relative w-10 sm:w-12 rounded-t-lg bg-slate-100 h-44 flex items-end">
                      <div 
                        className="w-full rounded-t-lg bg-linear-to-t from-slate-900 to-slate-700 hover:opacity-90 transition-all duration-500" 
                        style={{ height: `${heightPercentage}%` }}
                      />
                    </div>
                    <span className="text-[10px] sm:text-xs font-medium text-slate-500">{data.hour}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Breakdown Custom Visual representation */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Order Breakdown</h2>
            <p className="text-xs text-slate-500 mb-6">Percentage of total items ordered by category</p>
            
            <div className="space-y-4">
              {categoryData.map((data) => (
                <div key={data.category} className="space-y-1">
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span className="text-slate-700">{data.category}</span>
                    <span className="text-slate-900">{data.percentage}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100">
                    <div 
                      className={`h-full rounded-full ${data.color}`}
                      style={{ width: `${data.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Active Order Feed) */}
        <div className="space-y-6">
          {/* Active Orders Tracker */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col h-[525px]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Active Order Feed</h2>
                <p className="text-xs text-slate-500">{activeOrders.length} orders in progress</p>
              </div>
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700 uppercase tracking-wide">
                Live Feed
              </span>
            </div>

            <div className="mt-4 flex-1 overflow-y-auto space-y-4 pr-1">
              {activeOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
                  <Utensils className="h-10 w-10 text-slate-300 stroke-1 mb-2" />
                  <p className="text-sm font-medium">No active orders</p>
                  <p className="text-xs text-slate-400">New orders will show up here</p>
                </div>
              ) : (
                activeOrders.map((order) => {
                  const minutesElapsed = currentTime 
                    ? Math.round((currentTime.getTime() - new Date(order.createdAt).getTime()) / 60000)
                    : 0;
                  const isDelayed = minutesElapsed > 15 && order.status !== "Ready";

                  return (
                    <div 
                      key={order.id} 
                      className={`rounded-xl border p-4 transition shadow-xs hover:border-slate-300 bg-slate-50/50 ${
                        isDelayed ? "border-red-200 bg-red-50/10" : "border-slate-150"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs font-bold text-slate-400">TICKET #{order.id.split("-")[1] || order.id}</span>
                          <h4 className="font-bold text-slate-900">Table {order.tableId}</h4>
                        </div>
                        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${getStatusStyle(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      
                      {/* Items Preview */}
                      <p className="mt-2 text-xs font-medium text-slate-600 line-clamp-2">
                        {order.items.map(item => `${item.quantity}x ${item.name}`).join(", ")}
                      </p>

                      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                        <span className="text-xs font-semibold text-slate-900">${order.totalPrice.toFixed(2)}</span>
                        <span className={`text-[10px] font-bold flex items-center gap-1 ${
                          isDelayed ? "text-red-600 animate-pulse" : "text-slate-500"
                        }`}>
                          {isDelayed && <AlertTriangle className="h-3 w-3" />}
                          {minutesElapsed} min ago
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}