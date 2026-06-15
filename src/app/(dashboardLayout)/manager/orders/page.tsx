"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { advanceOrderStatus, Order } from "@/redux/features/restaurantSlice";
import { 
  Search, 
  ArrowRight, 
  Trash2, 
  Sparkles, 
  Clock, 
  Users,
  CheckCircle,
  HelpCircle,
  AlertTriangle
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function ManagerOrdersPage() {
  const dispatch = useAppDispatch();
  const { orders } = useAppSelector((state) => state.restaurant);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "active" | "completed" | "vip">("active");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleAdvanceStatus = (orderId: string, currentStatus: string) => {
    dispatch(advanceOrderStatus({ orderId }));
    toast.success(`Advanced Order ${orderId} state successfully!`);
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const tableStr = `table ${order.tableId}`;
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tableStr.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (filterMode === "active") {
      return order.status === "Queued" || order.status === "Cooking" || order.status === "Ready";
    }
    if (filterMode === "completed") {
      return order.status === "Served" || order.status === "Cleared";
    }
    if (filterMode === "vip") {
      return order.isVip;
    }
    return true; // "all"
  });

  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Queued":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "Cooking":
        return "bg-amber-100 text-amber-800 border-amber-200 animate-pulse";
      case "Ready":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Served":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Cleared":
        return "bg-slate-50 text-slate-500 border-slate-100";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getMinutesElapsed = (createdAtStr: string) => {
    if (!currentTime) return 0;
    const diff = currentTime.getTime() - new Date(createdAtStr).getTime();
    return Math.round(diff / 60000);
  };

  const getTableCode = (id: number) => {
    return id < 10 ? `T0${id}` : `T${id}`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Panel */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Order Management</h1>
          <p className="text-slate-500">Live order control center, history tracking, and manual status overrides.</p>
        </div>
      </div>

      {/* Filters, Search and Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ticket ID or Table number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-slate-400 shadow-3xs"
          />
        </div>

        {/* Categories Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {(["active", "completed", "vip", "all"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterMode(tab)}
              className={`rounded-xl px-4 py-2.5 text-xs font-bold transition border capitalize shadow-2xs ${
                filterMode === tab
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tab} Orders
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Order table & Side details */}
      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.75fr] xl:grid-cols-[1.7fr_0.7fr]">
        {/* Table list */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-150 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 font-semibold">Order ID</th>
                <th className="pb-3 font-semibold">Table</th>
                <th className="pb-3 font-semibold">Elapsed</th>
                <th className="pb-3 font-semibold">Items</th>
                <th className="pb-3 font-semibold">Total</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order) => {
                const elapsed = getMinutesElapsed(order.createdAt);
                const isOverdue = elapsed > 15 && order.status !== "Ready" && order.status !== "Served" && order.status !== "Cleared";

                return (
                  <tr 
                    key={order.id} 
                    className={`hover:bg-slate-50/50 cursor-pointer ${
                      selectedOrderId === order.id ? "bg-slate-50" : ""
                    } ${isOverdue ? "bg-red-50/10" : ""}`}
                    onClick={() => setSelectedOrderId(order.id)}
                  >
                    <td className="py-4 font-bold text-slate-900 text-sm">
                      <div className="flex items-center gap-1">
                        #{order.id.split("-")[1] || order.id}
                        {order.isVip && <Sparkles className="h-3.5 w-3.5 text-amber-500" />}
                      </div>
                    </td>
                    <td className="py-4 font-bold text-slate-800 text-sm">Table {getTableCode(order.tableId)}</td>
                    <td className="py-4 text-xs font-semibold text-slate-500">
                      <span className={`flex items-center gap-1 ${isOverdue ? "text-red-600 animate-pulse" : ""}`}>
                        <Clock className="h-3.5 w-3.5" />
                        {elapsed} min
                      </span>
                    </td>
                    <td className="py-4 pr-3 max-w-[220px]">
                      <span className="text-xs text-slate-600 line-clamp-1">
                        {order.items.map(i => `${i.quantity}x ${i.name}`).join(", ")}
                      </span>
                    </td>
                    <td className="py-4 font-extrabold text-slate-900 text-sm">${order.totalPrice.toFixed(2)}</td>
                    <td className="py-4 text-xs font-bold">
                      <span className={`rounded-full border px-2.5 py-0.5 ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 text-xs" onClick={(e) => e.stopPropagation()}>
                      {order.status !== "Cleared" ? (
                        <button
                          onClick={() => handleAdvanceStatus(order.id, order.status)}
                          className="flex items-center gap-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 font-bold transition shadow-3xs"
                        >
                          {order.status === "Queued" && "Cook"}
                          {order.status === "Cooking" && "Ready"}
                          {order.status === "Ready" && "Serve"}
                          {order.status === "Served" && "Clear"}
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      ) : (
                        <span className="text-slate-400 font-semibold flex items-center gap-1">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> Finished
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Side Panel Drawer */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm h-full flex flex-col min-h-[480px]">
            {!selectedOrder ? (
              <div className="flex flex-col items-center justify-center flex-1 text-center text-slate-400 py-12">
                <HelpCircle className="h-12 w-12 text-slate-300 stroke-1 mb-2" />
                <p className="text-sm font-semibold">Select an Order</p>
                <p className="text-xs text-slate-400 max-w-[200px] mt-1">
                  Click on any order ticket row to view full items breakdown and action overrides.
                </p>
              </div>
            ) : (
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                <div>
                  {/* Header */}
                  <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Table {getTableCode(selectedOrder.tableId)}
                      </span>
                      <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">Ticket #{selectedOrder.id}</h3>
                    </div>
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>

                  {/* Body Details */}
                  <div className="mt-5 space-y-4 text-xs">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Items List</span>
                      <div className="rounded-xl border border-slate-150 bg-slate-50/50 divide-y divide-slate-100 max-h-48 overflow-y-auto">
                        {selectedOrder.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center p-3">
                            <div>
                              <span className="font-bold text-slate-800">{item.quantity}x</span>
                              <span className="ml-2 text-slate-700">{item.name}</span>
                              {item.modifiers && item.modifiers.length > 0 && (
                                <span className="block text-[9px] text-slate-400 mt-0.5">
                                  + {item.modifiers.join(", ")}
                                </span>
                              )}
                            </div>
                            <span className="font-semibold text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                      <span className="text-sm font-bold text-slate-850">Total Bill Amount:</span>
                      <span className="text-base font-extrabold text-slate-900">${selectedOrder.totalPrice.toFixed(2)}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Fired Time</span>
                        <span className="font-semibold text-slate-800 text-xs mt-1 block">
                          {new Date(selectedOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Estimated Due</span>
                        <span className="font-semibold text-slate-800 text-xs mt-1 block">
                          {new Date(selectedOrder.dueAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Overrides */}
                {selectedOrder.status !== "Cleared" && (
                  <div className="border-t border-slate-100 pt-4 space-y-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Manager Override Control</span>
                    <button
                      onClick={() => handleAdvanceStatus(selectedOrder.id, selectedOrder.status)}
                      className="w-full rounded-xl bg-slate-900 py-3 text-xs font-bold text-white shadow-xs transition hover:bg-slate-800 flex items-center justify-center gap-2"
                    >
                      <ArrowRight className="h-4 w-4" />
                      Force Progress State
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}