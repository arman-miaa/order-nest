/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { TableStatus } from "@/redux/features/restaurantSlice";
import { toast } from "sonner";
import {
  useGetAllOrdersQuery,
  useGetAllTablesQuery,
  useUpdateOrderStatusMutation,
} from "@/redux/api/restaurantApi";
import { unwrapApiData } from "@/src/utils/api-normalize";
import { normalizeOrder, normalizeTable } from "@/src/utils/restaurant-normalize";

export const useStaffDashboard = () => {
  const { data: tablesData, isLoading: isTablesLoading, isError: isTablesError, refetch: refetchTables } = useGetAllTablesQuery(undefined);
  const { data: ordersData, isLoading: isOrdersLoading, isError: isOrdersError, refetch: refetchOrders } = useGetAllOrdersQuery(undefined);
  const [advanceStatus] = useUpdateOrderStatusMutation();
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 10000);
    return () => clearInterval(interval);
  }, []);

  const tables = useMemo(
    () => unwrapApiData<any[]>(tablesData, []).map(normalizeTable),
    [tablesData]
  );

  const orders = useMemo(
    () => unwrapApiData<any[]>(ordersData, []).map(normalizeOrder),
    [ordersData]
  );

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
  const totalRevenue = servedOrders.reduce((sum, o) => sum + o.totalPrice, 0);

  const getMinutesElapsed = (str: string) => {
    if (!currentTime) return 0;
    return Math.max(0, Math.round(
      (currentTime.getTime() - new Date(str).getTime()) / 60000
    ));
  };

  const getTableCode = (id: number) => (id < 10 ? `T0${id}` : `T${id}`);

  const handleServe = async (orderId: string) => {
    try {
      await advanceStatus({ id: orderId }).unwrap();
      toast.success("Order marked as served!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Could not serve order.");
    }
  };

  const handleClear = async (orderId: string) => {
    try {
      await advanceStatus({ id: orderId }).unwrap();
      toast.success("Table cleared!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Could not clear order.");
    }
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

  const refetch = () => {
    refetchTables();
    refetchOrders();
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
    isLoading: isTablesLoading || isOrdersLoading,
    isError: isTablesError || isOrdersError,
    refetch,
  };
};