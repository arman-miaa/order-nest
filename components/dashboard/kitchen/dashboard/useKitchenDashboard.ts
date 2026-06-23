/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { useGetAllOrdersQuery } from "@/redux/api/restaurantApi";
import { unwrapApiData } from "@/src/utils/api-normalize";
import { normalizeOrder } from "@/src/utils/restaurant-normalize";
import { Order } from "@/redux/features/restaurantSlice";

export const useKitchenDashboard = () => {
  const { data: ordersData, isLoading, isError, refetch } = useGetAllOrdersQuery({ status: "active" });

  const orders = useMemo(() => unwrapApiData<any[]>(ordersData, []).map(normalizeOrder), [ordersData]);

  const activeOrders = orders.filter(
    (o) => o.status === "Queued" || o.status === "Cooking"
  );

  const queuedOrders = activeOrders.filter((o) => o.status === "Queued");
  const cookingOrders = activeOrders.filter((o) => o.status === "Cooking");

  const overdueOrders = activeOrders.filter((o) => {
    const dueTime = new Date(o.dueAt).getTime();
    return dueTime < Date.now();
  });

  const servedOrders = orders.filter((o) => o.completedAt);
  const avgTicketTime =
    servedOrders.length > 0
      ? Math.round(
          servedOrders.reduce((sum, o) => {
            const created = new Date(o.createdAt).getTime();
            const completed = new Date(o.completedAt!).getTime();
            return sum + (completed - created) / 60000;
          }, 0) / servedOrders.length
        )
      : 0;

  return {
    orders,
    activeOrders,
    queuedOrders,
    cookingOrders,
    overdueOrders,
    avgTicketTime,
    isLoading,
    isError,
    refetch,
  };
};
