/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from "@/redux/api/restaurantApi";
import { unwrapApiData } from "@/src/utils/api-normalize";
import { normalizeOrder } from "@/src/utils/restaurant-normalize";
import { toast } from "sonner";

export const useOrders = () => {
  const { data, isLoading, isError, refetch } = useGetAllOrdersQuery(undefined);
  const [advanceStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      }, 10000);
    return () => clearInterval(interval);
  }, []);

  const orders = useMemo(
    () => unwrapApiData<any[]>(data, []).map(normalizeOrder),
    [data]
  );

  const handleAdvanceStatus = async (orderId: string, currentStatus: string) => {
    if (isUpdating) return;

    try {
      await advanceStatus({ id: orderId }).unwrap();
      if (currentStatus === "Ready") {
        toast.success(`Order ${orderId} delivered to table!`);
      } else if (currentStatus === "Served") {
        toast.success("Table cleared!");
      } else {
        toast.success(`Order ${orderId} advanced successfully.`);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Could not update order status.");
    }
  };

  const getMinutesElapsed = (createdAtStr: string) => {
    if (!currentTime) return 0;
    const diff = currentTime.getTime() - new Date(createdAtStr).getTime();
    return Math.max(0, Math.round(diff / 60000));
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
    isLoading,
    isError,
    refetch,
  };
};