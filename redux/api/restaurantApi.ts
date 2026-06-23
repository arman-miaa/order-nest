/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "./baseApi";

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