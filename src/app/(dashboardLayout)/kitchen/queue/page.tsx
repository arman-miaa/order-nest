"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { advanceOrderStatus, Order } from "@/redux/features/restaurantSlice";
import { 
  Flame, 
  Clock, 
  CheckSquare, 
  Square,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  ChefHat
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function KitchenQueuePage() {
  const dispatch = useAppDispatch();
  const { orders, menuItems } = useAppSelector((state) => state.restaurant);
  const [selectedStation, setSelectedStation] = useState<string>("All");
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  // Sync timer
  useEffect(() => {
    setCurrentTime(new Date());
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter orders and items within orders by selected station
  const getStationCategory = (station: string): string[] => {
    switch (station) {
      case "Grill Station": return ["Burgers", "Pizzas"];
      case "Fry Station": return ["Sides"];
      case "Prep Station": return ["Drinks", "Desserts"];
      default: return [];
    }
  };

  const getFilteredItems = (order: Order) => {
    if (selectedStation === "All") return order.items;
    
    const categories = getStationCategory(selectedStation);
    return order.items.filter((item) => {
      const menuItem = menuItems.find((mi) => mi.id === item.itemId);
      return menuItem && categories.includes(menuItem.category);
    });
  };

  // Filter orders that have items for the selected station and are not served/cleared
  const kitchenOrders = orders
    .filter((order) => order.status === "Queued" || order.status === "Cooking")
    .filter((order) => {
      const itemsForStation = getFilteredItems(order);
      return itemsForStation.length > 0;
    })
    .sort((a, b) => {
      if (a.isVip && !b.isVip) return -1;
      if (!a.isVip && b.isVip) return 1;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

  const handleAction = (orderId: string, currentStatus: string) => {
    dispatch(advanceOrderStatus({ orderId }));
    if (currentStatus === "Queued") {
      toast.success(`Cooking started for Order ${orderId}`);
    } else if (currentStatus === "Cooking") {
      toast.success(`Order ${orderId} marked Ready for pickup!`);
    }
  };

  const toggleCheck = (orderId: string, index: number) => {
    const key = `${orderId}-${index}`;
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Calculate timer countdown or countup
  const renderTimer = (order: Order) => {
    if (!currentTime) return "0:00";
    const dueTime = new Date(order.dueAt).getTime();
    const now = currentTime.getTime();
    const diff = dueTime - now;

    const absoluteDiff = Math.abs(diff);
    const minutes = Math.floor(absoluteDiff / 60000);
    const seconds = Math.floor((absoluteDiff % 60000) / 1000);
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    if (diff < 0) {
      return (
        <span className="text-red-600 font-extrabold flex items-center gap-1.5 animate-pulse">
          <AlertTriangle className="h-4 w-4" />
          OVERDUE -{minutes}:{formattedSeconds}
        </span>
      );
    }
    
    return (
      <span className="text-emerald-600 font-bold flex items-center gap-1">
        <Clock className="h-3.5 w-3.5" />
        {minutes}:{formattedSeconds} left
      </span>
    );
  };

  const getTableCode = (id: number) => {
    return id < 10 ? `T0${id}` : `T${id}`;
  };

  const stations = ["All", "Grill Station", "Fry Station", "Prep Station"];

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-800 p-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#1E3A5F]">OrderNest Kitchen OS</span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Kitchen Main Board</h1>
          <p className="text-xs text-slate-500">Urgency-sorted orders, station item filtering, and checklist controls.</p>
        </div>

        {/* Station Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {stations.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStation(st)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition border ${
                selectedStation === st
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                  : "bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-2xs"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Board container */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm min-h-[480px] flex flex-col justify-center">
        {kitchenOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center text-slate-400 py-16">
            <CheckCircle2 className="h-12 w-12 text-slate-200 stroke-1 mb-3 animate-pulse" />
            <p className="text-sm font-semibold text-slate-500">Queue is Clear</p>
            <p className="text-xs text-slate-400 max-w-[200px] mt-1">
              No active tickets for the {selectedStation === "All" ? "kitchen" : selectedStation}.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-start">
            {kitchenOrders.map((order) => {
              const stationItems = getFilteredItems(order);
              const totalItemsCount = stationItems.length;
              const checkedCount = stationItems.filter((_, idx) => checkedItems[`${order.id}-${idx}`]).length;
              const isAllChecked = checkedCount === totalItemsCount;
              
              return (
                <div 
                  key={order.id} 
                  className={`rounded-2xl border bg-slate-50/50 p-5 flex flex-col justify-between h-[360px] relative overflow-hidden transition shadow-2xs hover:shadow-xs ${
                    order.isVip ? "border-amber-400 bg-amber-50/5" : "border-slate-200"
                  }`}
                >
                  {/* VIP Tag */}
                  {order.isVip && (
                    <div className="absolute right-0 top-0 bg-amber-100 text-amber-800 rounded-bl-xl border-l border-b border-amber-200 px-2.5 py-0.5 text-[8px] font-extrabold uppercase tracking-widest flex items-center gap-1">
                      <Sparkles className="h-2.5 w-2.5 text-amber-500" />
                      VIP
                    </div>
                  )}

                  {/* Header info */}
                  <div>
                    <div className="flex justify-between items-start border-b border-slate-200 pb-3 mb-3">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">TICKET #{order.id.split("-")[1] || order.id}</span>
                        <h4 className="font-extrabold text-slate-900 text-base mt-0.5 font-sans">Table {getTableCode(order.tableId)}</h4>
                      </div>
                      <span className="text-xs font-semibold uppercase mt-1">
                        {renderTimer(order)}
                      </span>
                    </div>

                    {/* Filtered Items checklist */}
                    <div className="space-y-2.5 overflow-y-auto max-h-44 pr-1">
                      {stationItems.map((item, idx) => {
                        const checkKey = `${order.id}-${idx}`;
                        const isChecked = checkedItems[checkKey] || false;
                        
                        return (
                          <div 
                            key={idx}
                            onClick={() => toggleCheck(order.id, idx)}
                            className="flex items-start gap-2.5 cursor-pointer select-none group"
                          >
                            <div className="mt-0.5 shrink-0">
                              {isChecked ? (
                                <CheckSquare className="h-4 w-4 text-emerald-600" />
                              ) : (
                                <Square className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition" />
                              )}
                            </div>
                            <div>
                              <span className={`text-xs font-bold leading-normal ${
                                isChecked ? "text-slate-400 line-through font-normal" : "text-slate-800"
                              }`}>
                                {item.quantity}x {item.name}
                              </span>
                              {item.modifiers && item.modifiers.length > 0 && (
                                <span className={`block text-[10px] ${
                                  isChecked ? "text-slate-400" : "text-slate-500 font-semibold"
                                }`}>
                                  + {item.modifiers.join(", ")}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions summary footer */}
                  <div className="mt-4 border-t border-slate-200 pt-4">
                    {order.status === "Queued" ? (
                      <button
                        onClick={() => handleAction(order.id, "Queued")}
                        className="w-full rounded-xl bg-amber-600 hover:bg-amber-500 py-3 text-xs font-extrabold text-white shadow-xs transition flex items-center justify-center gap-1.5"
                      >
                        <Flame className="h-4 w-4 animate-pulse" />
                        START COOKING
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAction(order.id, "Cooking")}
                        className={`w-full rounded-xl py-3 text-xs font-extrabold shadow-xs transition flex items-center justify-center gap-1.5 ${
                          isAllChecked 
                            ? "bg-emerald-600 hover:bg-emerald-500 text-white" 
                            : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-250 shadow-2xs text-slate-700"
                        }`}
                      >
                        <ChefHat className="h-4 w-4" />
                        MARK READY {isAllChecked ? "(CHECKED)" : `(${checkedCount}/${totalItemsCount})`}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}