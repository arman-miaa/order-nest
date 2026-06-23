/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder: any) => ({
    // Create Staff or Kitchen
    createStaff: builder.mutation({
      query: (data: any) => ({
        url: "/users/staff/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Staff"],
    }),

    // Get all staff (with filters)
    getAllStaff: builder.query({
      query: (params?: any) => {
        // Build query params
        const queryParams: any = {};
        if (params?.searchTerm) queryParams.searchTerm = params.searchTerm;
        if (params?.role && params.role !== "all") queryParams.role = params.role;
        if (params?.shift && params.shift !== "all") queryParams.shift = params.shift;
        if (params?.status && params.status !== "all") queryParams.status = params.status;
        if (params?.page) queryParams.page = params.page;
        if (params?.limit) queryParams.limit = params.limit;
        
        return {
          url: "/users/staff",
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: ["Staff"],
    }),

    // Get single staff by ID
    getSingleStaff: builder.query({
      query: (id: string) => ({
        url: `/users/staff/${id}`,
        method: "GET",
      }),
      providesTags: ["Staff"],
    }),

    // Update staff
    updateStaff: builder.mutation({
      query: ({ id, data }: { id: string; data: any }) => ({
        url: `/users/staff/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Staff"],
    }),

    // Toggle staff status (Active/Suspended)
    toggleStaffStatus: builder.mutation({
      query: (id: string) => ({
        url: `/users/staff/${id}/toggle-status`,
        method: "PATCH",
      }),
      invalidatesTags: ["Staff"],
    }),

    // Delete staff
    deleteStaff: builder.mutation({
      query: (id: string) => ({
        url: `/users/staff/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Staff"],
    }),
  }),
});

export const {
  useCreateStaffMutation,
  useGetAllStaffQuery,
  useGetSingleStaffQuery,
  useUpdateStaffMutation,
  useToggleStaffStatusMutation,
  useDeleteStaffMutation,
} = userApi;