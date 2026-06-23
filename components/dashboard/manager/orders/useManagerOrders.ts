/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Order } from "@/redux/features/restaurantSlice";
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from "@/redux/api/restaurantApi";
import { unwrapApiData } from "@/src/utils/api-normalize";

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
  status: order.status ?? "Queued",
  totalPrice: Number(order.totalPrice ?? order.total ?? 0),
  isVip: Boolean(order.isVip ?? order.vip),
  createdAt: order.createdAt ?? new Date().toISOString(),
  dueAt: order.dueAt ?? order.estimatedReadyAt ?? order.createdAt ?? new Date().toISOString(),
  startedCookingAt: order.startedCookingAt,
  markedReadyAt: order.markedReadyAt,
  completedAt: order.completedAt,
});

export const useManagerOrders = () => {
  const { data, isLoading, isError, refetch } = useGetAllOrdersQuery(undefined);
  const [advanceStatus] = useUpdateOrderStatusMutation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "active" | "completed" | "vip">("active");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 10000);
    return () => clearInterval(interval);
  }, []);

  const orders = useMemo(() => unwrapApiData<any[]>(data, []).map(normalizeOrder), [data]);

  const handleAdvanceStatus = async (orderId: string) => {
    try {
      await advanceStatus({ id: orderId }).unwrap();
      toast.success(`Advanced Order ${orderId} state successfully!`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Could not update order status.");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const tableStr = `table ${order.tableId}`;
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tableStr.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterMode === "active") return ["Queued", "Cooking", "Ready"].includes(order.status);
    if (filterMode === "completed") return ["Served", "Cleared"].includes(order.status);
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
    return Math.max(0, Math.round((currentTime.getTime() - new Date(createdAtStr).getTime()) / 60000));
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
    isLoading,
    isError,
    refetch,
  };
};