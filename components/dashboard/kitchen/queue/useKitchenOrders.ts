/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { MenuItem, Order } from "@/redux/features/restaurantSlice";
import {
  useGetAllMenuItemsQuery,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from "@/redux/api/restaurantApi";
import { unwrapApiData } from "@/src/utils/api-normalize";
import { sortKitchenOrders } from "./PrioritySorter";

const normalizeMenuItem = (item: any): MenuItem => ({
  id: String(item._id ?? item.id),
  name: item.name ?? "Untitled item",
  description: item.description ?? "",
  price: Number(item.price ?? 0),
  prepTime: Number(item.prepTime ?? item.preparationTime ?? 0),
  category: item.category ?? "Sides",
  imageUrl: item.imageUrl ?? item.image ?? "/images/login.jpg",
  inStock: Boolean(item.inStock ?? item.isAvailable ?? true),
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
  status: order.status ?? "Queued",
  totalPrice: Number(order.totalPrice ?? order.total ?? 0),
  isVip: Boolean(order.isVip ?? order.vip),
  createdAt: order.createdAt ?? new Date().toISOString(),
  dueAt: order.dueAt ?? order.estimatedReadyAt ?? order.createdAt ?? new Date().toISOString(),
  startedCookingAt: order.startedCookingAt,
  markedReadyAt: order.markedReadyAt,
  completedAt: order.completedAt,
});

export const useKitchenOrders = () => {
  const { data: ordersData, isLoading: isOrdersLoading, isError: isOrdersError } = useGetAllOrdersQuery({ status: "active" });
  const { data: menuData, isLoading: isMenuLoading, isError: isMenuError } = useGetAllMenuItemsQuery(undefined);
  const [advanceStatus] = useUpdateOrderStatusMutation();
  const searchParams = useSearchParams();
  const stationQuery = searchParams.get("station");
  const [selectedStation, setSelectedStation] = useState<string>(stationQuery || "All");

  useEffect(() => {
    if (stationQuery) {
      setSelectedStation(stationQuery);
    }
  }, [stationQuery]);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const orders = useMemo(() => unwrapApiData<any[]>(ordersData, []).map(normalizeOrder), [ordersData]);
  const menuItems = useMemo(() => unwrapApiData<any[]>(menuData, []).map(normalizeMenuItem), [menuData]);

  const getStationCategory = (station: string): string[] => {
    switch (station) {
      case "Grill Station": return ["Burgers", "Pizzas"];
      case "Fry Station": return ["Sides"];
      case "Prep Station": return ["Drinks", "Desserts"];
      default: return [];
    }
  };

  const getFilteredItems = (order: Order) => {
    if (selectedStation === "All") return order.items;
    const categories = getStationCategory(selectedStation);
    return order.items.filter((item) => {
      const menuItem = menuItems.find((mi) => mi.id === item.itemId);
      return menuItem && categories.includes(menuItem.category);
    });
  };

  const activeKitchenOrders = orders
    .filter((order) => order.status === "Queued" || order.status === "Cooking")
    .filter((order) => getFilteredItems(order).length > 0);

  const kitchenOrders = sortKitchenOrders(activeKitchenOrders);

  const handleAction = async (orderId: string, currentStatus: string) => {
    try {
      await advanceStatus({ id: orderId }).unwrap();
      toast.success(currentStatus === "Queued" ? `Cooking started for Order ${orderId}` : `Order ${orderId} marked Ready for pickup!`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Could not update kitchen order.");
    }
  };

  const toggleCheck = (orderId: string, index: number) => {
    const key = `${orderId}-${index}`;
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getTableCode = (id: number) => (id < 10 ? `T0${id}` : `T${id}`);

  return {
    orders,
    selectedStation,
    setSelectedStation,
    checkedItems,
    currentTime,
    getFilteredItems,
    kitchenOrders,
    handleAction,
    toggleCheck,
    getTableCode,
    isLoading: isOrdersLoading || isMenuLoading,
    isError: isOrdersError || isMenuError,
  };
};
export default useKitchenOrders;