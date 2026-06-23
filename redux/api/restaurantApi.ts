/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "./baseApi";
import { getSocket } from "@/src/utils/socket";

export const restaurantApi = baseApi.injectEndpoints({
  endpoints: (builder: any) => ({
    // Dashboard
    getDashboardSummary: builder.query({
      query: (params?: any) => ({
        url: "/dashboard/summary",
        method: "GET",
        params,
      }),
      providesTags: ["Dashboard", "Table", "Order", "Alert"],
    }),

    // Tables
    createTable: builder.mutation({
      query: (data: any) => ({
        url: "/tables",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Table", "Dashboard"],
    }),
    getAllTables: builder.query({
      query: (params?: any) => ({
        url: "/tables",
        method: "GET",
        params,
      }),
      providesTags: ["Table"],
      async onCacheEntryAdded(arg: any, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }: any) {
        const socket = getSocket();
        try {
          await cacheDataLoaded;

          const handleTableUpdated = (updatedTable: any) => {
            updateCachedData((draft: any) => {
              if (!draft || !draft.data) return;
              const index = draft.data.findIndex((t: any) => t._id === updatedTable._id || t.id === updatedTable.id);
              if (index !== -1) {
                draft.data[index] = { ...draft.data[index], ...updatedTable };
              }
            });
          };

          socket.on("table_updated", handleTableUpdated);
          socket.on("updateTable", handleTableUpdated);

        } catch (error) {
          console.error("Socket cache update error:", error);
        }

        await cacheEntryRemoved;
        // Optional: socket.off for specific listeners if needed, though they usually persist globally or are cleaned up on unmount.
      },
    }),
    getSingleTable: builder.query({
      query: (id: string | number) => ({
        url: `/tables/${id}`,
        method: "GET",
      }),
      providesTags: ["Table"],
    }),
    updateTable: builder.mutation({
      query: ({ id, data }: { id: string | number; data: any }) => ({
        url: `/tables/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Table", "Dashboard"],
    }),
    updateTableStatus: builder.mutation({
      query: ({ id, status }: { id: string | number; status: string }) => ({
        url: `/tables/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Table", "Order", "Dashboard"],
    }),
    deleteTable: builder.mutation({
      query: (id: string | number) => ({
        url: `/tables/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Table", "Dashboard"],
    }),

    // Menu
    createMenuItem: builder.mutation({
      query: (data: any) => ({
        url: "/menu-items",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["MenuItem"],
    }),
    getAllMenuItems: builder.query({
      query: (params?: any) => ({
        url: "/menu-items",
        method: "GET",
        params,
      }),
      providesTags: ["MenuItem"],
    }),
    updateMenuItem: builder.mutation({
      query: ({ id, data }: { id: string | number; data: any }) => ({
        url: `/menu-items/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["MenuItem", "Alert"],
    }),
    toggleMenuItemStock: builder.mutation({
      query: (id: string | number) => ({
        url: `/menu-items/${id}/toggle-stock`,
        method: "PATCH",
      }),
      invalidatesTags: ["MenuItem", "Alert"],
    }),
    deleteMenuItem: builder.mutation({
      query: (id: string | number) => ({
        url: `/menu-items/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MenuItem"],
    }),

    // Orders
    createOrder: builder.mutation({
      query: (data: any) => ({
        url: "/orders",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Order", "Table", "Dashboard"],
    }),
    getAllOrders: builder.query({
      query: (params?: any) => ({
        url: "/orders",
        method: "GET",
        params,
      }),
      providesTags: ["Order"],
      async onCacheEntryAdded(arg: any, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }: any) {
        const socket = getSocket();
        try {
          await cacheDataLoaded;

          const handleOrderCreated = (newOrder: any) => {
            updateCachedData((draft: any) => {
              if (!draft || !draft.data) return;
              const exists = draft.data.find((o: any) => o._id === newOrder._id || o.id === newOrder.id);
              if (!exists) {
                draft.data.unshift(newOrder); // Add new order to top
              }
            });
          };

          const handleOrderUpdated = (updatedOrder: any) => {
            updateCachedData((draft: any) => {
              if (!draft || !draft.data) return;
              const index = draft.data.findIndex((o: any) => o._id === updatedOrder._id || o.id === updatedOrder.id);
              if (index !== -1) {
                draft.data[index] = { ...draft.data[index], ...updatedOrder };
              }
            });
          };

          const handleOrderDeleted = (payload: any) => {
            updateCachedData((draft: any) => {
              if (!draft || !draft.data) return;
              const idToRemove = typeof payload === "object" ? (payload._id || payload.id) : payload;
              draft.data = draft.data.filter((o: any) => o._id !== idToRemove && o.id !== idToRemove);
            });
          };

          socket.on("order_created", handleOrderCreated);
          socket.on("newOrder", handleOrderCreated);

          socket.on("order_updated", handleOrderUpdated);
          socket.on("updateOrder", handleOrderUpdated);

          socket.on("order_deleted", handleOrderDeleted);
          socket.on("deleteOrder", handleOrderDeleted);

        } catch (error) {
          console.error("Socket cache update error:", error);
        }
        await cacheEntryRemoved;
      },
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, status }: { id: string | number; status?: string }) => ({
        url: status ? `/orders/${id}/status` : `/orders/${id}/advance-status`,
        method: "PATCH",
        body: status ? { status } : undefined,
      }),
      invalidatesTags: ["Order", "Table", "Dashboard"],
    }),
    deleteOrder: builder.mutation({
      query: (id: string | number) => ({
        url: `/orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Order", "Table", "Dashboard"],
    }),

    // Alerts
    getAllAlerts: builder.query({
      query: (params?: any) => ({
        url: "/alerts",
        method: "GET",
        params,
      }),
      providesTags: ["Alert"],
      async onCacheEntryAdded(arg: any, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }: any) {
        const socket = getSocket();
        try {
          await cacheDataLoaded;

          const handleAlertCreated = (newAlert: any) => {
            updateCachedData((draft: any) => {
              if (!draft || !draft.data) return;
              const exists = draft.data.find((a: any) => a._id === newAlert._id || a.id === newAlert.id);
              if (!exists) {
                draft.data.unshift(newAlert);
              }
            });
          };

          const handleAlertResolved = (resolvedAlert: any) => {
            updateCachedData((draft: any) => {
              if (!draft || !draft.data) return;
              const index = draft.data.findIndex((a: any) => a._id === resolvedAlert._id || a.id === resolvedAlert.id);
              if (index !== -1) {
                draft.data[index] = { ...draft.data[index], ...resolvedAlert };
              }
            });
          };

          socket.on("alert_created", handleAlertCreated);
          socket.on("newAlert", handleAlertCreated);

          socket.on("alert_resolved", handleAlertResolved);
          socket.on("updateAlert", handleAlertResolved);

        } catch (error) {
          console.error("Socket cache update error:", error);
        }
        await cacheEntryRemoved;
      },
    }),
    resolveAlert: builder.mutation({
      query: (id: string | number) => ({
        url: `/alerts/${id}/resolve`,
        method: "PATCH",
      }),
      invalidatesTags: ["Alert", "Dashboard"],
    }),
  }),
});

export const {
  useGetDashboardSummaryQuery,
  useCreateTableMutation,
  useGetAllTablesQuery,
  useGetSingleTableQuery,
  useUpdateTableMutation,
  useUpdateTableStatusMutation,
  useDeleteTableMutation,
  useCreateMenuItemMutation,
  useGetAllMenuItemsQuery,
  useUpdateMenuItemMutation,
  useToggleMenuItemStockMutation,
  useDeleteMenuItemMutation,
  useCreateOrderMutation,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
  useGetAllAlertsQuery,
  useResolveAlertMutation,
} = restaurantApi;
