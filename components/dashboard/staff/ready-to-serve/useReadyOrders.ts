/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from "@/redux/api/restaurantApi";
import { unwrapApiData } from "@/src/utils/api-normalize";
import { normalizeOrder } from "@/src/utils/restaurant-normalize";
import { toast } from "sonner";

export const useReadyOrders = () => {
  const { data, isLoading, isError, refetch } = useGetAllOrdersQuery({ status: "Ready" });
  const [advanceStatus] = useUpdateOrderStatusMutation();
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      }, 10000);
    return () => clearInterval(interval);
  }, []);

  const readyOrders = useMemo(
    () => unwrapApiData<any[]>(data, []).map(normalizeOrder).filter((o) => o.status === "Ready"),
    [data]
  );

  const handleDeliver = async (orderId: string) => {
    try {
      await advanceStatus({ id: orderId }).unwrap();
      toast.success(`Order ${orderId} served successfully!`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Could not serve order.");
    }
  };

  const getMinutesElapsed = (readyAtStr?: string) => {
    if (!readyAtStr || !currentTime) return "0 min";
    const diff = currentTime.getTime() - new Date(readyAtStr).getTime();
    return `${Math.max(0, Math.round(diff / 60000))} min`;
  };

  const getTableCode = (id: number) => {
    return id < 10 ? `T0${id}` : `T${id}`;
  };

  return {
    readyOrders,
    handleDeliver,
    getMinutesElapsed,
    getTableCode,
    isLoading,
    isError,
    refetch,
  };
};
export default useReadyOrders;