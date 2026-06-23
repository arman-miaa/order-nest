/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { useGetAllAlertsQuery, useGetAllOrdersQuery, useGetAllTablesQuery } from "@/redux/api/restaurantApi";
import { unwrapApiData } from "@/src/utils/api-normalize";
import { normalizeAlert, normalizeOrder, normalizeTable } from "@/src/utils/restaurant-normalize";

export const useAnalytics = () => {
  const { data: tablesData, isLoading: isTablesLoading, isError: isTablesError, refetch: refetchTables } = useGetAllTablesQuery(undefined);
  const { data: ordersData, isLoading: isOrdersLoading, isError: isOrdersError, refetch: refetchOrders } = useGetAllOrdersQuery(undefined);
  const { data: alertsData, isLoading: isAlertsLoading, isError: isAlertsError, refetch: refetchAlerts } = useGetAllAlertsQuery(undefined);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      }, 10000);
    return () => clearInterval(interval);
  }, []);

  const tables = useMemo(() => unwrapApiData<any[]>(tablesData, []).map(normalizeTable), [tablesData]);
  const orders = useMemo(() => unwrapApiData<any[]>(ordersData, []).map(normalizeOrder), [ordersData]);
  const alerts = useMemo(() => unwrapApiData<any[]>(alertsData, []).map(normalizeAlert), [alertsData]);

  const completedOrders = orders.filter(
    (o) => o.status === "Served" || o.status === "Cleared"
  );
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.totalPrice, 0);

  const activeOrders = orders.filter(
    (o) => o.status === "Queued" || o.status === "Cooking" || o.status === "Ready"
  );

  const occupiedTables = tables.filter(
    (t) => t.status !== "Available" && t.status !== "Dirty"
  ).length;
  const occupancyPercentage = tables.length > 0 ? Math.round((occupiedTables / tables.length) * 100) : 0;

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

  const handleReset = () => {
    refetchTables();
    refetchOrders();
    refetchAlerts();
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
    isLoading: isTablesLoading || isOrdersLoading || isAlertsLoading,
    isError: isTablesError || isOrdersError || isAlertsError,
  };
};
export default useAnalytics;