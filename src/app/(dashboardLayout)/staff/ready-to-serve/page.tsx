"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { advanceOrderStatus } from "@/redux/features/restaurantSlice";
import { 
  Soup, 
  CheckCircle, 
  MapPin, 
  Clock
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function StaffReadyToServePage() {
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

  const readyOrders = orders.filter((o) => o.status === "Ready");

  const handleDeliver = (orderId: string) => {
    dispatch(advanceOrderStatus({ orderId }));
    toast.success(`Order ${orderId} served successfully!`);
  };

  const getMinutesElapsed = (readyAtStr?: string) => {
    if (!readyAtStr || !currentTime) return "0 min";
    const diff = currentTime.getTime() - new Date(readyAtStr).getTime();
    return `${Math.round(diff / 60000)} min`;
  };

  const getTableCode = (id: number) => {
    return id < 10 ? `T0${id}` : `T${id}`;
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-800 p-6 space-y-6">
      {/* Top Banner */}
      <div className="border-b border-slate-200 pb-5">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#1E3A5F]">OrderNest Staff OS</span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Ready to Serve</h1>
        <p className="text-xs text-slate-500">Deliver prepared food items to dining tables instantly.</p>
      </div>

      {/* Stats Summary */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-2.5 text-emerald-600">
            <Soup className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-550 block uppercase tracking-wide">Expedite Counter</span>
            <span className="text-lg font-extrabold text-slate-900 block mt-0.5">
              {readyOrders.length} tickets waiting to be run
            </span>
          </div>
        </div>
        
        {readyOrders.length > 0 && (
          <span className="rounded-full bg-emerald-100 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700 animate-pulse">
            Active Prep Complete
          </span>
        )}
      </div>

      {/* Ready Orders List */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm min-h-[350px] flex flex-col">
        {readyOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 text-center text-slate-400 py-16">
            <CheckCircle className="h-12 w-12 text-slate-200 stroke-1 mb-3 animate-pulse" />
            <p className="text-sm font-semibold text-slate-500">All Orders Served</p>
            <p className="text-xs text-slate-400 max-w-[200px] mt-1">
              No new items waiting at the kitchen window. Good job!
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {readyOrders.map((order) => (
              <div 
                key={order.id}
                className="rounded-2xl border border-slate-200 bg-slate-50/30 p-5 flex flex-col justify-between hover:border-slate-350 transition shadow-2xs"
              >
                <div>
                  {/* Table/Ticket info */}
                  <div className="flex items-start justify-between border-b border-slate-200 pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-blue-50 border border-blue-100 p-1.5 text-blue-600">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base">Table {getTableCode(order.tableId)}</h4>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">TICKET #{order.id.split("-")[1] || order.id}</span>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Ready {getMinutesElapsed(order.markedReadyAt)} ago
                    </span>
                  </div>

                  {/* Items list */}
                  <ul className="space-y-2 text-sm text-slate-700">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between items-center bg-white rounded-xl p-2.5 border border-slate-150">
                        <div>
                          <span className="font-extrabold text-slate-900">{item.quantity}x</span>
                          <span className="ml-2 text-slate-800">{item.name}</span>
                          {item.modifiers && item.modifiers.length > 0 && (
                            <span className="block text-[10px] text-slate-400 mt-0.5">
                              + {item.modifiers.join(", ")}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Confirm Serve button */}
                <button
                  onClick={() => handleDeliver(order.id)}
                  className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3 text-xs font-bold text-white shadow-xs transition flex items-center justify-center gap-2 mt-5"
                >
                  <CheckCircle className="h-4 w-4" />
                  Mark as Served / Delivered
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}