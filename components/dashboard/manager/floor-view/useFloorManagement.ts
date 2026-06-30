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

// ✅ Fixed: id should be string (MongoDB _id), tableNumber for display
const normalizeTable = (table: any, index: number): Table => ({
  _id: table._id,                                                    // ✅ MongoDB ObjectId
  id: table._id || table.id,                                        // ✅ String ID
  tableNumber: table.tableNumber || String(index + 1),              // ✅ Display number
  capacity: Number(table.capacity ?? table.seats ?? 4),
  status: (table.status ?? "AVAILABLE") as TableStatus,
  activeOrderId: table.activeOrderId ?? table.activeOrder?._id ?? table.activeOrder?.id ?? null,
  seatedAt: table.seatedAt ?? table.createdAt,
});

const normalizeOrder = (order: any): Order => ({
  _id: order._id,
  id: String(order._id ?? order.id),
  tableId: order.tableId ?? order.table?._id ?? order.table?.id ?? "", // ✅ String
  items: (order.items ?? []).map((item: any) => ({
    itemId: String(item.itemId ?? item.menuItemId ?? item.menuItem?._id ?? item.id),
    name: item.name ?? item.menuItem?.name ?? "Item",
    price: Number(item.price ?? item.menuItem?.price ?? 0),
    quantity: Number(item.quantity ?? 1),
    modifiers: item.modifiers ?? [],
  })),
  status: order.status ?? "PENDING",
  totalAmount: Number(order.totalAmount ?? order.totalPrice ?? order.total ?? 0),
  paymentStatus: order.paymentStatus ?? "PENDING",
  createdAt: order.createdAt ?? new Date().toISOString(),
});

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
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null); // ✅ String
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

  const handleStatusChange = async (tableId: string, status: TableStatus) => {
    try {
      await updateTableStatus({ id: tableId, status }).unwrap(); // ✅ id is string
      toast.success(`Table status updated to ${statusLabels[status]}.`);
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

  const getTableCode = (id: string) => {
    const num = parseInt(id) || 0;
    return num < 10 ? `T0${num}` : `T${num}`;
  };

  const getStatusConfig = (status: TableStatus) => {
    switch (status) {
      case "AVAILABLE": return { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", badge: "bg-emerald-100 text-emerald-800 border-emerald-300", indicator: "bg-emerald-500" };
      case "SEATED": return { bg: "bg-blue-50 text-blue-700 border-blue-200", badge: "bg-blue-100 text-blue-800 border-blue-300", indicator: "bg-blue-500" };
      case "ORDERING": return { bg: "bg-amber-50 text-amber-700 border-amber-200", badge: "bg-amber-100 text-amber-800 border-amber-300", indicator: "bg-amber-500" };
      case "EATING": return { bg: "bg-orange-50 text-orange-700 border-orange-200", badge: "bg-orange-100 text-orange-800 border-orange-300", indicator: "bg-orange-500" };
      case "BILL_REQUESTED": return { bg: "bg-purple-50 text-purple-700 border-purple-200", badge: "bg-purple-100 text-purple-800 border-purple-300", indicator: "bg-purple-500" };
      case "DIRTY": return { bg: "bg-slate-50 text-slate-700 border-slate-200", badge: "bg-slate-100 text-slate-700 border-slate-300", indicator: "bg-slate-400" };
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
    statusLabels,
    isLoading: isTablesLoading || isOrdersLoading,
    isError: isTablesError || isOrdersError,
    isUpdatingStatus,
    refetch,
  };
};

export default useFloorManagement;