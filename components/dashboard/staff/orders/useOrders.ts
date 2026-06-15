import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { advanceOrderStatus } from "@/redux/features/restaurantSlice";
import { toast } from "sonner";

export const useOrders = () => {
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

  const getOrdersByStatus = (status: string) => {
    return orders.filter((o) => o.status === status);
  };

  const getColumnColor = (status: string) => {
    switch (status) {
      case "Queued":
        return "border-slate-200 bg-slate-50/50";
      case "Cooking":
        return "border-amber-200 bg-amber-50/20";
      case "Ready":
        return "border-emerald-200 bg-emerald-50/20";
      case "Served":
        return "border-blue-200 bg-blue-50/20";
      default:
        return "border-slate-200";
    }
  };

  const getTableCode = (id: number) => {
    return id < 10 ? `T0${id}` : `T${id}`;
  };

  return {
    orders,
    currentTime,
    handleAdvanceStatus,
    getMinutesElapsed,
    getOrdersByStatus,
    getColumnColor,
    getTableCode,
  };
};
