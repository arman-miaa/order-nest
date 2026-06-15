import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { updateTableStatus, TableStatus } from "@/redux/features/restaurantSlice";

export const useFloorManagement = () => {
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
          bg: "bg-purple-50 text-purple-700 border-purple-205 hover:bg-purple-100/50",
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

  return {
    tables,
    orders,
    selectedTableId,
    setSelectedTableId,
    selectedTable,
    activeOrder,
    handleStatusChange,
    calculateSeatedTime,
    getTableCode,
    getStatusConfig,
  };
};
export default useFloorManagement;
