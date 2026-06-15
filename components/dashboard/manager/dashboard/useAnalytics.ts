import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { resetDemoData } from "@/redux/features/restaurantSlice";

export const useAnalytics = () => {
  const dispatch = useAppDispatch();
  const { tables, orders, alerts } = useAppSelector((state) => state.restaurant);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const completedOrders = orders.filter(
    (o) => o.status === "Served" || o.status === "Cleared"
  );
  const totalRevenue = orders
    .filter((o) => o.status !== "Cleared" && o.status !== "Queued")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const activeOrders = orders.filter(
    (o) => o.status === "Queued" || o.status === "Cooking" || o.status === "Ready"
  );

  const occupiedTables = tables.filter(
    (t) => t.status !== "Available" && t.status !== "Dirty"
  ).length;
  const occupancyPercentage = Math.round((occupiedTables / tables.length) * 100);

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
      : 14;

  const handleReset = () => {
    dispatch(resetDemoData());
  };

  const getTableCode = (id: number) => {
    return id < 10 ? `T0${id}` : `T${id}`;
  };

  return {
    tables,
    orders,
    alerts,
    currentTime,
    totalRevenue,
    activeOrders,
    occupiedTables,
    occupancyPercentage,
    avgTicketTime,
    handleReset,
    getTableCode,
  };
};
export default useAnalytics;
