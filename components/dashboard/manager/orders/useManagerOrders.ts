import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { advanceOrderStatus } from "@/redux/features/restaurantSlice";
import { toast } from "sonner";

export const useManagerOrders = () => {
  const dispatch = useAppDispatch();
  const { orders } = useAppSelector((state) => state.restaurant);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "active" | "completed" | "vip">("active");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const interval = setInterval(() => setCurrentTime(new Date()), 10000);
    return () => clearInterval(interval);
  }, []);

  const handleAdvanceStatus = (orderId: string) => {
    dispatch(advanceOrderStatus({ orderId }));
    toast.success(`Advanced Order ${orderId} state successfully!`);
  };

  const filteredOrders = orders.filter((order) => {
    const tableStr = `table ${order.tableId}`;
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tableStr.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterMode === "active")
      return order.status === "Queued" || order.status === "Cooking" || order.status === "Ready";
    if (filterMode === "completed")
      return order.status === "Served" || order.status === "Cleared";
    if (filterMode === "vip") return order.isVip;
    return true;
  });

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Queued": return "bg-slate-100 text-slate-700 border-slate-200";
      case "Cooking": return "bg-amber-100 text-amber-800 border-amber-200 animate-pulse";
      case "Ready": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Served": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Cleared": return "bg-slate-50 text-slate-500 border-slate-100";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getMinutesElapsed = (createdAtStr: string) => {
    if (!currentTime) return 0;
    return Math.round((currentTime.getTime() - new Date(createdAtStr).getTime()) / 60000);
  };

  const getTableCode = (id: number) => (id < 10 ? `T0${id}` : `T${id}`);

  return {
    orders,
    searchQuery,
    setSearchQuery,
    filterMode,
    setFilterMode,
    selectedOrderId,
    setSelectedOrderId,
    selectedOrder,
    filteredOrders,
    handleAdvanceStatus,
    getStatusColor,
    getMinutesElapsed,
    getTableCode,
  };
};
