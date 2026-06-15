import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { updateTableStatus, TableStatus } from "@/redux/features/restaurantSlice";
import { toast } from "sonner";

export const useTables = () => {
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

  const filteredTables = tables.filter((t) => filter === "All" || t.status === filter);

  const calculateSeatedTime = (seatedAtStr?: string) => {
    if (!seatedAtStr || !currentTime) return "0 min";
    const diff = currentTime.getTime() - new Date(seatedAtStr).getTime();
    return `${Math.round(diff / 60000)} min`;
  };

  const getTableCode = (id: number) => {
    return id < 10 ? `T0${id}` : `T${id}`;
  };

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

  return {
    tables,
    orders,
    filter,
    setFilter,
    filteredTables,
    handleTableClick,
    calculateSeatedTime,
    getTableCode,
    getStatusColor,
  };
};
