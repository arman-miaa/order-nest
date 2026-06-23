/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { TableStatus } from "@/redux/features/restaurantSlice";
import { toast } from "sonner";
import {
  useGetAllOrdersQuery,
  useGetAllTablesQuery,
  useUpdateTableStatusMutation,
} from "@/redux/api/restaurantApi";
import { unwrapApiData } from "@/src/utils/api-normalize";
import { normalizeOrder, normalizeTable } from "@/src/utils/restaurant-normalize";

export const useTables = () => {
  const router = useRouter();
  const { data: tablesData, isLoading: isTablesLoading, isError: isTablesError, refetch } = useGetAllTablesQuery(undefined);
  const { data: ordersData, isLoading: isOrdersLoading, isError: isOrdersError } = useGetAllOrdersQuery(undefined);
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateTableStatusMutation();
  const [filter, setFilter] = useState<string>("All");
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      }, 10000);
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

  const handleTableClick = async (tableId: number, status: TableStatus) => {
    if (isUpdatingStatus) return;

    if (status === "Available") {
      try {
        await updateStatus({ id: tableId, status: "Seated" }).unwrap();
        toast.success(`Table ${tableId} is now Seated. Ready to take orders.`);
      } catch (error: any) {
        toast.error(error?.data?.message || "Could not seat table.");
      }
    } else if (status === "Seated" || status === "Ordering") {
      router.push(`/staff/new-order?tableId=${tableId}`);
    } else if (status === "Dirty") {
      try {
        await updateStatus({ id: tableId, status: "Available" }).unwrap();
        toast.success(`Table ${tableId} has been cleared and is now available.`);
      } catch (error: any) {
        toast.error(error?.data?.message || "Could not clear table.");
      }
    } else if (status === "Eating" || status === "Bill Requested") {
      try {
        await updateStatus({ id: tableId, status: "Dirty" }).unwrap();
        toast.success(`Payment confirmed for Table ${tableId}. Resetting to Dirty.`);
      } catch (error: any) {
        toast.error(error?.data?.message || "Could not update table.");
      }
    }
  };

  const filteredTables = tables.filter((t) => filter === "All" || t.status === filter);

  const calculateSeatedTime = (seatedAtStr?: string) => {
    if (!seatedAtStr || !currentTime) return "0 min";
    const diff = currentTime.getTime() - new Date(seatedAtStr).getTime();
    return `${Math.max(0, Math.round(diff / 60000))} min`;
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
    isLoading: isTablesLoading || isOrdersLoading,
    isError: isTablesError || isOrdersError,
    refetch,
  };
};