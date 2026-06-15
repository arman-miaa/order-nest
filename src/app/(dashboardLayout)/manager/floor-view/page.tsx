"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { updateTableStatus, TableStatus } from "@/redux/features/restaurantSlice";
import { 
  Users, 
  Clock, 
  DollarSign, 
  XCircle, 
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  RotateCcw
} from "lucide-react";
import { useState, useEffect } from "react";

export default function ManagerFloorViewPage() {
  const dispatch = useAppDispatch();
  const { tables, orders } = useAppSelector((state) => state.restaurant);
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const selectedTable = tables.find((t) => t.id === selectedTableId);
  const activeOrder = selectedTable?.activeOrderId 
    ? orders.find((o) => o.id === selectedTable.activeOrderId)
    : null;

  // Status style helper
  const getStatusConfig = (status: TableStatus) => {
    switch (status) {
      case "Available":
        return {
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/70",
          badge: "bg-emerald-150 text-emerald-800 border-emerald-300",
          indicator: "bg-emerald-500",
        };
      case "Seated":
        return {
          bg: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100/70",
          badge: "bg-blue-150 text-blue-800 border-blue-300",
          indicator: "bg-blue-500",
        };
      case "Ordering":
        return {
          bg: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100/70",
          badge: "bg-amber-150 text-amber-800 border-amber-300 animate-pulse",
          indicator: "bg-amber-500",
        };
      case "Eating":
        return {
          bg: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100/70",
          badge: "bg-orange-150 text-orange-800 border-orange-300",
          indicator: "bg-orange-500",
        };
      case "Bill Requested":
        return {
          bg: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-155 bg-purple-100/50",
          badge: "bg-purple-150 text-purple-800 border-purple-300 animate-bounce",
          indicator: "bg-purple-500",
        };
      case "Dirty":
        return {
          bg: "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100/70",
          badge: "bg-slate-150 text-slate-800 border-slate-300",
          indicator: "bg-slate-400",
        };
      default:
        return {
          bg: "bg-gray-50 text-gray-700 border-gray-200",
          badge: "bg-gray-100 text-gray-800 border-gray-300",
          indicator: "bg-gray-400",
        };
    }
  };

  const handleStatusChange = (tableId: number, status: TableStatus) => {
    dispatch(updateTableStatus({ tableId, status }));
  };

  const calculateSeatedTime = (seatedAtStr?: string) => {
    if (!seatedAtStr || !currentTime) return "0 min";
    const diff = currentTime.getTime() - new Date(seatedAtStr).getTime();
    return `${Math.round(diff / 60000)} min`;
  };

  const getTableCode = (id: number) => {
    return id < 10 ? `T0${id}` : `T${id}`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Panel */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Live Floor Management</h1>
          <p className="text-slate-500">Real-time table status monitoring and floor control.</p>
        </div>
        
        {/* Status Legend */}
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-xs">
          {(["Available", "Seated", "Ordering", "Eating", "Bill Requested", "Dirty"] as TableStatus[]).map((status) => {
            const config = getStatusConfig(status);
            return (
              <div key={status} className="flex items-center gap-1.5 px-1.5">
                <span className={`h-2.5 w-2.5 rounded-full ${config.indicator}`} />
                <span className="text-xs font-semibold text-slate-600">{status}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.75fr] xl:grid-cols-[1.7fr_0.7fr]">
        {/* Floor Map Table Grid */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <h2 className="text-lg font-bold text-slate-900 font-sans">Main Dining Area</h2>
            <div className="text-xs font-medium text-slate-500">
              Total Tables: {tables.length} | Occupied: {tables.filter(t => t.status !== "Available" && t.status !== "Dirty").length}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
            {tables.map((table) => {
              const config = getStatusConfig(table.status);
              const isSelected = selectedTableId === table.id;
              
              return (
                <button
                  key={table.id}
                  onClick={() => setSelectedTableId(table.id)}
                  className={`flex flex-col justify-between rounded-2xl border p-4 text-left transition h-28 ${config.bg} ${
                    isSelected ? "ring-2 ring-slate-900 shadow-md scale-[1.02]" : "shadow-xs"
                  }`}
                >
                  <div className="flex items-start justify-between w-full">
                    <span className="text-lg font-extrabold tracking-tight">{getTableCode(table.id)}</span>
                    <span className="flex items-center gap-1 text-[10px] font-bold opacity-80">
                      <Users className="h-3 w-3" />
                      {table.capacity} pax
                    </span>
                  </div>

                  <div className="mt-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider block opacity-90 truncate">
                      {table.status}
                    </span>
                    {table.status !== "Available" && table.status !== "Dirty" && (
                      <span className="text-[10px] flex items-center gap-1 opacity-70 mt-0.5">
                        <Clock className="h-2.5 w-2.5" />
                        {calculateSeatedTime(table.seatedAt || orders.find(o => o.id === table.activeOrderId)?.createdAt)}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar Info Drawer */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm h-full flex flex-col min-h-[480px]">
            {!selectedTable ? (
              <div className="flex flex-col items-center justify-center flex-1 text-center text-slate-400 py-12">
                <HelpCircle className="h-12 w-12 text-slate-300 stroke-1 mb-2" />
                <p className="text-sm font-semibold">No Table Selected</p>
                <p className="text-xs text-slate-400 max-w-[200px] mt-1">
                  Click on any table card to view seating details and active order status.
                </p>
              </div>
            ) : (
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                <div>
                  {/* Table Header */}
                  <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900">Table {getTableCode(selectedTable.id)}</h3>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <Users className="h-3 w-3" /> Max Capacity: {selectedTable.capacity} guests
                      </p>
                    </div>
                    <span className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusConfig(selectedTable.status).badge}`}>
                      {selectedTable.status}
                    </span>
                  </div>

                  {/* Actions Drawer */}
                  <div className="mt-5 space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Actions</h4>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleStatusChange(selectedTable.id, "Available")}
                        disabled={selectedTable.status === "Available"}
                        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-slate-700 shadow-xs transition hover:bg-slate-50 disabled:opacity-50"
                      >
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                        Available
                      </button>
                      <button
                        onClick={() => handleStatusChange(selectedTable.id, "Seated")}
                        disabled={selectedTable.status === "Seated"}
                        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-slate-700 shadow-xs transition hover:bg-slate-50 disabled:opacity-50"
                      >
                        <Users className="h-3.5 w-3.5 text-blue-500" />
                        Seated
                      </button>
                      <button
                        onClick={() => handleStatusChange(selectedTable.id, "Bill Requested")}
                        disabled={selectedTable.status === "Bill Requested" || selectedTable.status === "Available"}
                        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-slate-700 shadow-xs transition hover:bg-slate-50 disabled:opacity-50"
                      >
                        <DollarSign className="h-3.5 w-3.5 text-purple-500" />
                        Bill
                      </button>
                      <button
                        onClick={() => handleStatusChange(selectedTable.id, "Dirty")}
                        disabled={selectedTable.status === "Dirty"}
                        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-slate-700 shadow-xs transition hover:bg-slate-50 disabled:opacity-50"
                      >
                        <XCircle className="h-3.5 w-3.5 text-slate-500" />
                        Dirty
                      </button>
                    </div>
                  </div>

                  {/* Active Order Details */}
                  <div className="mt-6 border-t border-slate-100 pt-6">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Active Order</h4>
                    
                    {!activeOrder ? (
                      <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-500 bg-slate-50/50">
                        No active order fired for this table.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-slate-400 uppercase">TICKET #{activeOrder.id.split("-")[1] || activeOrder.id}</span>
                            <div className="text-xs font-medium text-slate-500 mt-0.5">
                              Ordered: {new Date(activeOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                          <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                            {activeOrder.status}
                          </span>
                        </div>

                        {/* Items list */}
                        <div className="rounded-xl border border-slate-150 bg-slate-50/50 divide-y divide-slate-100 max-h-48 overflow-y-auto">
                          {activeOrder.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 text-xs">
                              <div>
                                <span className="font-bold text-slate-800">{item.quantity}x</span>
                                <span className="ml-2 text-slate-700">{item.name}</span>
                                {item.modifiers && item.modifiers.length > 0 && (
                                  <span className="block text-[10px] text-slate-400 mt-0.5">
                                    + {item.modifiers.join(", ")}
                                  </span>
                                )}
                              </div>
                              <span className="font-semibold text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                          <span className="text-sm font-bold text-slate-800">Total Price:</span>
                          <span className="text-base font-extrabold text-slate-900">${activeOrder.totalPrice.toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Clear Active Table button */}
                {(selectedTable.status === "Dirty" || selectedTable.status === "Bill Requested") && (
                  <button
                    onClick={() => handleStatusChange(selectedTable.id, "Available")}
                    className="w-full rounded-xl bg-slate-900 py-3 text-xs font-bold text-white shadow-xs transition hover:bg-slate-800 flex items-center justify-center gap-2 mt-6"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Reset Table to Available
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}