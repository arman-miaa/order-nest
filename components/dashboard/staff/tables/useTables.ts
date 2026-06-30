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

// Display labels
const statusLabels: Record<string, string> = {
  AVAILABLE: "Available",
  OCCUPIED: "Occupied",
  RESERVED: "Reserved",
  SEATED: "Seated",
  ORDERING: "Ordering",
  EATING: "Eating",
  BILL_REQUESTED: "Bill Requested",
  DIRTY: "Dirty",
};

export const useTables = () => {
  const router = useRouter();
  const { data: tablesData, isLoading: isTablesLoading, isError: isTablesError, refetch } = useGetAllTablesQuery(undefined);
  const { data: ordersData, isLoading: isOrdersLoading, isError: isOrdersError } = useGetAllOrdersQuery(undefined);
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateTableStatusMutation();
  const [filter, setFilter] = useState<string>("All");
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

  const handleTableClick = async (tableId: number, status: TableStatus) => {
    if (isUpdatingStatus) return;

    if (status === "AVAILABLE") {
      try {
        await updateStatus({ id: tableId, status: "SEATED" }).unwrap();
        toast.success(`Table ${tableId} seated. Ready to take orders.`);
        refetch();
      } catch (error: any) {
        toast.error(error?.data?.message || "Could not seat table.");
      }
    } else if (status === "SEATED" || status === "ORDERING") {
      router.push(`/staff/new-order?tableId=${tableId}`);
    } else if (status === "DIRTY") {
      try {
        await updateStatus({ id: tableId, status: "AVAILABLE" }).unwrap();
        toast.success(`Table ${tableId} cleared.`);
        refetch();
      } catch (error: any) {
        toast.error(error?.data?.message || "Could not clear table.");
      }
    } else if (status === "EATING" || status === "BILL_REQUESTED") {
      try {
        await updateStatus({ id: tableId, status: "DIRTY" }).unwrap();
        toast.success(`Payment confirmed for Table ${tableId}.`);
        refetch();
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

  const getTableCode = (id: number) => id < 10 ? `T0${id}` : `T${id}`;

  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case "AVAILABLE": return { card: "border-emerald-200 bg-emerald-50/50", badge: "bg-emerald-100 text-emerald-800 border-emerald-200", icon: "text-emerald-500" };
      case "SEATED": return { card: "border-blue-200 bg-blue-50/50", badge: "bg-blue-100 text-blue-800 border-blue-200", icon: "text-blue-500" };
      case "ORDERING": return { card: "border-amber-200 bg-amber-50/50", badge: "bg-amber-100 text-amber-800 border-amber-200", icon: "text-amber-500" };
      case "EATING": return { card: "border-orange-200 bg-orange-50/50", badge: "bg-orange-100 text-orange-800 border-orange-200", icon: "text-orange-500" };
      case "BILL_REQUESTED": return { card: "border-purple-300 bg-purple-50/70", badge: "bg-purple-100 text-purple-800 border-purple-200", icon: "text-purple-500" };
      case "DIRTY": return { card: "border-slate-200 bg-slate-50/50", badge: "bg-slate-100 text-slate-700 border-slate-200", icon: "text-slate-500" };
      default: return { card: "border-slate-200 bg-white", badge: "bg-slate-100 text-slate-600 border-slate-200", icon: "text-slate-500" };
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
    statusLabels,
    isLoading: isTablesLoading || isOrdersLoading,
    isError: isTablesError || isOrdersError,
    refetch,
  };
};