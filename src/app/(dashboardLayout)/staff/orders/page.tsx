"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { advanceOrderStatus } from "@/redux/features/restaurantSlice";
import { 
  Clock, 
  Coffee,
  AlertTriangle,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function StaffOrdersPage() {
  const dispatch = useAppDispatch();
  const { orders } = useAppSelector((state) => state.restaurant);
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
    if (currentStatus === "Ready") {
      toast.success(`Order ${orderId} delivered to table!`);
    } else if (currentStatus === "Served") {
      toast.success(`Table cleared! Table status set to Dirty.`);
    }
  };

  const getMinutesElapsed = (createdAtStr: string) => {
    if (!currentTime) return 0;
    const diff = currentTime.getTime() - new Date(createdAtStr).getTime();
    return Math.round(diff / 60000);
  };

  // Group active orders by status columns
  const activeStates = ["Queued", "Cooking", "Ready", "Served"];
  
  const getOrdersByStatus = (status: string) => {
    return orders.filter(o => o.status === status);
  };

  const getColumnColor = (status: string) => {
    switch (status) {
      case "Queued": return "border-slate-200 bg-slate-50/50";
      case "Cooking": return "border-amber-200 bg-amber-50/20";
      case "Ready": return "border-emerald-200 bg-emerald-50/20";
      case "Served": return "border-blue-200 bg-blue-50/20";
      default: return "border-slate-200";
    }
  };

  const getTableCode = (id: number) => {
    return id < 10 ? `T0${id}` : `T${id}`;
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-800 p-6 space-y-6">
      {/* Top Banner */}
      <div className="border-b border-slate-200 pb-5">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#1E3A5F]">OrderNest Staff OS</span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Active Orders Feed</h1>
        <p className="text-xs text-slate-500">Track preparation stages and serve ready items to dining tables.</p>
      </div>

      {/* Kanban Board Layout */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 items-start">
        {activeStates.map((status) => {
          const columnOrders = getOrdersByStatus(status);
          
          return (
            <div 
              key={status} 
              className={`rounded-3xl border p-5 flex flex-col min-h-[500px] bg-white shadow-2xs ${getColumnColor(status)}`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                <span className="text-sm font-extrabold text-slate-700 tracking-wider uppercase">{status}</span>
                <span className="rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-xs font-bold text-slate-600">
                  {columnOrders.length}
                </span>
              </div>

              {/* Orders List */}
              <div className="space-y-4 overflow-y-auto flex-1 max-h-[600px] pr-1">
                {columnOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400">
                    <Coffee className="h-8 w-8 opacity-20 mb-2" />
                    <span className="text-xs font-bold uppercase tracking-wider">Empty Column</span>
                  </div>
                ) : (
                  columnOrders.map((order) => {
                    const elapsed = getMinutesElapsed(order.createdAt);
                    const isOverdue = elapsed > 15 && status !== "Ready" && status !== "Served";

                    return (
                      <div 
                        key={order.id} 
                        className={`rounded-2xl border p-4 bg-white relative overflow-hidden transition shadow-3xs hover:border-slate-350 hover:shadow-xs ${
                          order.isVip ? "border-amber-400" : "border-slate-200"
                        } ${isOverdue ? "border-red-300 bg-red-50/10" : ""}`}
                      >
                        {/* VIP Tag */}
                        {order.isVip && (
                          <div className="absolute right-0 top-0 bg-amber-100 text-amber-800 rounded-bl-xl border-l border-b border-amber-200 px-2.5 py-0.5 text-[8px] font-extrabold uppercase tracking-widest flex items-center gap-1">
                            <Sparkles className="h-2.5 w-2.5 text-amber-500" />
                            VIP
                          </div>
                        )}

                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">TICKET #{order.id.split("-")[1] || order.id}</span>
                            <span className="text-base font-extrabold text-slate-900 block mt-0.5">Table {getTableCode(order.tableId)}</span>
                          </div>
                          
                          <span className={`text-[10px] font-bold flex items-center gap-1 mt-0.5 ${
                            isOverdue ? "text-red-600 animate-pulse" : "text-slate-500"
                          }`}>
                            <Clock className="h-3 w-3" />
                            {elapsed}m ago
                          </span>
                        </div>

                        {/* Items summary */}
                        <div className="mt-3 space-y-1 text-xs text-slate-700 bg-slate-50/50 rounded-xl p-2.5 border border-slate-150">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span>{item.quantity}x {item.name}</span>
                              {item.modifiers && item.modifiers.length > 0 && (
                                <span className="text-[9px] text-slate-400 font-medium">+ {item.modifiers.join(", ")}</span>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Pricing */}
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xs font-bold text-blue-600">${order.totalPrice.toFixed(2)}</span>
                          
                          {/* Progress Controls */}
                          {status === "Ready" && (
                            <button
                              onClick={() => handleAdvanceStatus(order.id, status)}
                              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-[10px] font-bold text-white shadow-xs transition"
                            >
                              Serve Table
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          )}

                          {status === "Served" && (
                            <button
                              onClick={() => handleAdvanceStatus(order.id, status)}
                              className="flex items-center gap-1.5 rounded-lg bg-white hover:bg-slate-50 px-3 py-1.5 text-[10px] font-bold text-slate-650 shadow-2xs transition border border-slate-205"
                            >
                              Clear Table
                            </button>
                          )}
                        </div>

                        {/* Overdue Warning */}
                        {isOverdue && (
                          <div className="mt-2.5 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-red-600 border-t border-red-100 pt-2.5">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            Overdue! Needs Expediting
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}