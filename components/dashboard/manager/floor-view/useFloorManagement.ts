/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { TableStatus, Table, Order } from "@/redux/features/restaurantSlice";
import {
  useGetAllOrdersQuery,
  useGetAllTablesQuery,
  useUpdateTableStatusMutation,
} from "@/redux/api/restaurantApi";
import { unwrapApiData } from "@/src/utils/api-normalize";

const normalizeTable = (table: any, index: number): Table => ({
  id: Number(table.tableNo ?? table.number ?? table.id ?? table._id ?? index + 1),
  capacity: Number(table.capacity ?? table.seats ?? 4),
  status: (table.status ?? "AVAILABLE") as TableStatus, // ✅ Keep as backend value
  activeOrderId: table.activeOrderId ?? table.activeOrder?._id ?? table.activeOrder?.id ?? null,
  seatedAt: table.seatedAt ?? table.createdAt,
  isVip: Boolean(table.isVip),
});

const normalizeOrder = (order: any): Order => ({
  id: String(order._id ?? order.id),
  tableId: Number(order.tableId ?? order.table?.id ?? order.table?.tableNo ?? 0),
  items: (order.items ?? []).map((item: any) => ({
    itemId: String(item.itemId ?? item.menuItemId ?? item.menuItem?._id ?? item.id),
    name: item.name ?? item.menuItem?.name ?? "Item",
    price: Number(item.price ?? item.menuItem?.price ?? 0),
    quantity: Number(item.quantity ?? 1),
    modifiers: item.modifiers ?? [],
  })),
  status: order.status ?? "PENDING",
  totalPrice: Number(order.totalPrice ?? order.total ?? 0),
  isVip: Boolean(order.isVip ?? order.vip),
  createdAt: order.createdAt ?? new Date().toISOString(),
  dueAt: order.dueAt ?? order.estimatedReadyAt ?? order.createdAt ?? new Date().toISOString(),
  startedCookingAt: order.startedCookingAt,
  markedReadyAt: order.markedReadyAt,
  completedAt: order.completedAt,
});

// ✅ Display names for UI
const statusLabels: Record<TableStatus, string> = {
  AVAILABLE: "Available",
  OCCUPIED: "Occupied",
  RESERVED: "Reserved",
  DIRTY: "Dirty",
  SEATED: "Seated",
  ORDERING: "Ordering",
  EATING: "Eating",
  BILL_REQUESTED: "Bill Requested",
};

export const useFloorManagement = () => {
  const { data: tablesResponse, isLoading: isTablesLoading, isError: isTablesError, refetch } = useGetAllTablesQuery(undefined);
  const { data: ordersResponse, isLoading: isOrdersLoading, isError: isOrdersError } = useGetAllOrdersQuery(undefined);
  const [updateTableStatus, { isLoading: isUpdatingStatus }] = useUpdateTableStatusMutation();
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 10000);
    return () => clearInterval(interval);
  }, []);

  const tables = useMemo(
    () => unwrapApiData<any[]>(tablesResponse, []).map(normalizeTable),
    [tablesResponse]
  );

  const orders = useMemo(
    () => unwrapApiData<any[]>(ordersResponse, []).map(normalizeOrder),
    [ordersResponse]
  );

  const selectedTable = tables.find((t) => t.id === selectedTableId);
  const activeOrder = selectedTable?.activeOrderId
    ? orders.find((o) => o.id === selectedTable.activeOrderId)
    : null;

  const handleStatusChange = async (tableId: number, status: TableStatus) => {
    try {
      await updateTableStatus({ id: tableId, status }).unwrap();
      toast.success(`Table ${getTableCode(tableId)} marked ${statusLabels[status]}.`);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Could not update table status.");
    }
  };

  const calculateSeatedTime = (seatedAtStr?: string) => {
    if (!seatedAtStr || !currentTime) return "0 min";
    const diff = currentTime.getTime() - new Date(seatedAtStr).getTime();
    return `${Math.max(0, Math.round(diff / 60000))} min`;
  };

  const getTableCode = (id: number) => (id < 10 ? `T0${id}` : `T${id}`);

  // ✅ Use TableStatus (backend values) in switch
  const getStatusConfig = (status: TableStatus) => {
    switch (status) {
      case "AVAILABLE": return { bg: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/70", badge: "bg-emerald-150 text-emerald-800 border-emerald-300", indicator: "bg-emerald-500" };
      case "SEATED": return { bg: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100/70", badge: "bg-blue-150 text-blue-800 border-blue-300", indicator: "bg-blue-500" };
      case "ORDERING": return { bg: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100/70", badge: "bg-amber-150 text-amber-800 border-amber-300 animate-pulse", indicator: "bg-amber-500" };
      case "EATING": return { bg: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100/70", badge: "bg-orange-150 text-orange-800 border-orange-300", indicator: "bg-orange-500" };
      case "BILL_REQUESTED": return { bg: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100/50", badge: "bg-purple-150 text-purple-800 border-purple-300", indicator: "bg-purple-500" };
      case "DIRTY": return { bg: "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100/70", badge: "bg-slate-150 text-slate-800 border-slate-300", indicator: "bg-slate-400" };
      case "OCCUPIED": return { bg: "bg-amber-50 text-amber-700 border-amber-200", badge: "bg-amber-150 text-amber-800 border-amber-300", indicator: "bg-amber-500" };
      case "RESERVED": return { bg: "bg-cyan-50 text-cyan-700 border-cyan-200", badge: "bg-cyan-150 text-cyan-800 border-cyan-300", indicator: "bg-cyan-500" };
      default: return { bg: "bg-gray-50 text-gray-700 border-gray-200", badge: "bg-gray-100 text-gray-800 border-gray-300", indicator: "bg-gray-400" };
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
    statusLabels, // ✅ Export for display
    isLoading: isTablesLoading || isOrdersLoading,
    isError: isTablesError || isOrdersError,
    isUpdatingStatus,
    refetch,
  };
};

export default useFloorManagement;