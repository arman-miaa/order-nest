import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { advanceOrderStatus, Order } from "@/redux/features/restaurantSlice";
import { toast } from "sonner";
import { sortKitchenOrders } from "./PrioritySorter";

export const useKitchenOrders = () => {
  const dispatch = useAppDispatch();
  const { orders, menuItems } = useAppSelector((state) => state.restaurant);
  const [selectedStation, setSelectedStation] = useState<string>("All");
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  // Sync timer
  useEffect(() => {
    setCurrentTime(new Date());
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter orders and items within orders by selected station
  const getStationCategory = (station: string): string[] => {
    switch (station) {
      case "Grill Station":
        return ["Burgers", "Pizzas"];
      case "Fry Station":
        return ["Sides"];
      case "Prep Station":
        return ["Drinks", "Desserts"];
      default:
        return [];
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

  // Filter orders that have items for the selected station and are not served/cleared
  const activeKitchenOrders = orders
    .filter((order) => order.status === "Queued" || order.status === "Cooking")
    .filter((order) => {
      const itemsForStation = getFilteredItems(order);
      return itemsForStation.length > 0;
    });

  // Sort by priority
  const kitchenOrders = sortKitchenOrders(activeKitchenOrders);

  const handleAction = (orderId: string, currentStatus: string) => {
    dispatch(advanceOrderStatus({ orderId }));
    if (currentStatus === "Queued") {
      toast.success(`Cooking started for Order ${orderId}`);
    } else if (currentStatus === "Cooking") {
      toast.success(`Order ${orderId} marked Ready for pickup!`);
    }
  };

  const toggleCheck = (orderId: string, index: number) => {
    const key = `${orderId}-${index}`;
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getTableCode = (id: number) => {
    return id < 10 ? `T0${id}` : `T${id}`;
  };

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
  };
};
export default useKitchenOrders;
