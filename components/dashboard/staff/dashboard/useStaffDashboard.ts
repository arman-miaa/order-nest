import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { advanceOrderStatus, TableStatus } from "@/redux/features/restaurantSlice";
import { toast } from "sonner";

export const useStaffDashboard = () => {
  const dispatch = useAppDispatch();
  const { tables, orders } = useAppSelector((s) => s.restaurant);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const interval = setInterval(() => setCurrentTime(new Date()), 10000);
    return () => clearInterval(interval);
  }, []);

  const activeOrders = orders.filter(
    (o) => o.status === "Queued" || o.status === "Cooking"
  );
  const readyOrders = orders.filter((o) => o.status === "Ready");
  const servedOrders = orders.filter(
    (o) => o.status === "Served" || o.status === "Cleared"
  );
  const occupiedTables = tables.filter(
    (t) => t.status !== "Available" && t.status !== "Dirty"
  );
  const availableTables = tables.filter((t) => t.status === "Available");
  const totalRevenue = orders
    .filter((o) => o.status === "Served" || o.status === "Cleared")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const getMinutesElapsed = (str: string) => {
    if (!currentTime) return 0;
    return Math.round(
      (currentTime.getTime() - new Date(str).getTime()) / 60000
    );
  };

  const getTableCode = (id: number) => (id < 10 ? `T0${id}` : `T${id}`);

  const handleServe = (orderId: string) => {
    dispatch(advanceOrderStatus({ orderId }));
    toast.success("Order marked as served!");
  };

  const handleClear = (orderId: string) => {
    dispatch(advanceOrderStatus({ orderId }));
    toast.success("Table cleared!");
  };

  const getStatusConfig = (status: TableStatus) => {
    switch (status) {
      case "Available":
        return {
          bg: "bg-emerald-50 border-emerald-200 text-emerald-700",
          dot: "bg-emerald-500",
          label: "Available",
        };
      case "Seated":
        return {
          bg: "bg-blue-50 border-blue-200 text-blue-700",
          dot: "bg-blue-500",
          label: "Seated",
        };
      case "Ordering":
        return {
          bg: "bg-amber-50 border-amber-200 text-amber-700",
          dot: "bg-amber-500",
          label: "Ordering",
        };
      case "Eating":
        return {
          bg: "bg-orange-50 border-orange-200 text-orange-700",
          dot: "bg-orange-500",
          label: "Eating",
        };
      case "Bill Requested":
        return {
          bg: "bg-purple-50 border-purple-200 text-purple-700",
          dot: "bg-purple-500",
          label: "Bill",
        };
      case "Dirty":
        return {
          bg: "bg-slate-50 border-slate-200 text-slate-500",
          dot: "bg-slate-400",
          label: "Dirty",
        };
      default:
        return {
          bg: "bg-slate-50 border-slate-200 text-slate-600",
          dot: "bg-slate-400",
          label: status,
        };
    }
  };

  return {
    tables,
    orders,
    currentTime,
    activeOrders,
    readyOrders,
    servedOrders,
    occupiedTables,
    availableTables,
    totalRevenue,
    getMinutesElapsed,
    getTableCode,
    handleServe,
    handleClear,
    getStatusConfig,
  };
};
