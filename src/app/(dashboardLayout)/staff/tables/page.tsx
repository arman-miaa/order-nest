"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { updateTableStatus, TableStatus } from "@/redux/features/restaurantSlice";
import { 
  Users, 
  Clock, 
  ChevronRight,
  ClipboardList,
  Coffee,
  CheckCircle2,
  DollarSign,
  Plus
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function StaffTablesPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { tables, orders } = useAppSelector((state) => state.restaurant);
  const [filter, setFilter] = useState<string>("All");
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case "Available":
        return {
          card: "border-emerald-200 bg-emerald-50/50 text-emerald-700 hover:bg-emerald-100/50 shadow-xs",
          badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
          icon: "text-emerald-500",
        };
      case "Seated":
        return {
          card: "border-blue-200 bg-blue-50/50 text-blue-700 hover:bg-blue-100/50 shadow-xs",
          badge: "bg-blue-100 text-blue-800 border-blue-200",
          icon: "text-blue-500",
        };
      case "Ordering":
        return {
          card: "border-amber-200 bg-amber-50/50 text-amber-700 hover:bg-amber-100/50 shadow-xs",
          badge: "bg-amber-100 text-amber-800 border-amber-200 animate-pulse",
          icon: "text-amber-500",
        };
      case "Eating":
        return {
          card: "border-orange-200 bg-orange-50/50 text-orange-700 hover:bg-orange-100/50 shadow-xs",
          badge: "bg-orange-100 text-orange-800 border-orange-200",
          icon: "text-orange-500",
        };
      case "Bill Requested":
        return {
          card: "border-purple-300 bg-purple-50/70 text-purple-700 hover:bg-purple-100/70 shadow-xs border-dashed animate-pulse",
          badge: "bg-purple-100 text-purple-800 border-purple-200",
          icon: "text-purple-500",
        };
      case "Dirty":
        return {
          card: "border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100/50 shadow-xs",
          badge: "bg-slate-100 text-slate-700 border-slate-200",
          icon: "text-slate-500",
        };
      default:
        return {
          card: "border-slate-200 bg-white text-slate-700 shadow-xs",
          badge: "bg-slate-100 text-slate-600 border-slate-200",
          icon: "text-slate-500",
        };
    }
  };

  const handleTableClick = (tableId: number, status: TableStatus) => {
    if (status === "Available") {
      dispatch(updateTableStatus({ tableId, status: "Seated" }));
      toast.success(`Table ${tableId} is now Seated. Ready to take orders.`);
    } else if (status === "Seated" || status === "Ordering") {
      router.push(`/staff/new-order?tableId=${tableId}`);
    } else if (status === "Dirty") {
      dispatch(updateTableStatus({ tableId, status: "Available" }));
      toast.success(`Table ${tableId} has been cleared and is now available.`);
    } else if (status === "Eating" || status === "Bill Requested") {
      dispatch(updateTableStatus({ tableId, status: "Dirty" }));
      toast.success(`Payment confirmed for Table ${tableId}. Resetting to Dirty.`);
    }
  };

  const filteredTables = tables.filter(t => filter === "All" || t.status === filter);

  const calculateSeatedTime = (seatedAtStr?: string) => {
    if (!seatedAtStr || !currentTime) return "0 min";
    const diff = currentTime.getTime() - new Date(seatedAtStr).getTime();
    return `${Math.round(diff / 60000)} min`;
  };

  const getTableCode = (id: number) => {
    return id < 10 ? `T0${id}` : `T${id}`;
  };

  const filters = ["All", "Available", "Seated", "Ordering", "Eating", "Bill Requested", "Dirty"];

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-800 p-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#1E3A5F]">OrderNest Staff OS</span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Table Seating Selection</h1>
          <p className="text-xs text-slate-500">Seat guests, initiate billing, or fire new kitchen tickets.</p>
        </div>

        {/* Legend / Info */}
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition border ${
                filter === f
                  ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-2xs"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filteredTables.map((table) => {
          const config = getStatusColor(table.status);
          const activeOrd = table.activeOrderId ? orders.find(o => o.id === table.activeOrderId) : null;
          
          return (
            <button
              key={table.id}
              onClick={() => handleTableClick(table.id, table.status)}
              className={`group flex flex-col justify-between rounded-2xl border p-5 text-left transition h-36 relative overflow-hidden bg-white ${config.card}`}
            >
              <div className="flex justify-between items-start w-full">
                <span className="text-2xl font-extrabold tracking-tight text-slate-950">{getTableCode(table.id)}</span>
                <span className={`rounded-full border px-2.5 py-0.5 text-[9px] font-bold ${config.badge}`}>
                  {table.status}
                </span>
              </div>

              <div className="mt-4 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <Users className="h-3.5 w-3.5 opacity-80" />
                  <span>{table.capacity} pax max</span>
                </div>
                {table.status !== "Available" && table.status !== "Dirty" && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="h-3.5 w-3.5 opacity-80" />
                    <span>{calculateSeatedTime(table.seatedAt || activeOrd?.createdAt)}</span>
                  </div>
                )}
              </div>

              <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition duration-200 text-slate-900 translate-x-2 group-hover:translate-x-0">
                <ChevronRight className="h-5 w-5" />
              </div>

              <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-2 block border-t border-slate-100 pt-2">
                {table.status === "Available" && "Click to Seat Table"}
                {table.status === "Seated" && "Click to Create Order"}
                {table.status === "Ordering" && "Click to Build Order"}
                {table.status === "Eating" && "Click to Conf. Bill"}
                {table.status === "Bill Requested" && "Click to Close Table"}
                {table.status === "Dirty" && "Click to Clean Table"}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}