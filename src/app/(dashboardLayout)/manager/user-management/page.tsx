/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, UserPlus, ChefHat, Search, Filter, ShieldOff, UserCog, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { StaffFormData, StaffUser } from "@/src/types/user.type";
import { StaffFormModal } from "@/components/module/dashboard/manager/users/StaffFormModal";
import { KitchenFormModal } from "@/components/module/dashboard/manager/users/KitchenFormModal";
import { StaffTable } from "@/components/module/dashboard/manager/users/StaffTable";
import { 
  useCreateStaffMutation, 
  useGetAllStaffQuery,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
  useToggleStaffStatusMutation 
} from "@/redux/api/userApi";
import { toast } from "sonner";

// Define response type
interface StaffResponse {
  data: any[];
  meta: {
    total: number;
    page: number;
    limit: number;
    staffCount: number;
    kitchenCount: number;
  };
}

export default function UserManagementPage() {
  // Filter states
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Modal states
  const [staffModal, setStaffModal] = useState<{
    open: boolean; mode: 'add' | 'edit'; user?: any;
  }>({ open: false, mode: 'add' });

  const [kitchenModal, setKitchenModal] = useState<{
    open: boolean; mode: 'add' | 'edit'; user?: any;
  }>({ open: false, mode: 'add' });

  // API Hooks
  const { 
    data: staffData, 
    isLoading, 
    isError,
    error,
    refetch 
  } = useGetAllStaffQuery({
    searchTerm: search || undefined,
    role: roleFilter === "all" ? undefined : roleFilter.toUpperCase(),
    status: statusFilter === "all" ? undefined : statusFilter.toUpperCase(),
    page,
    limit,
  });

  const [createStaff, { isLoading: isCreating }] = useCreateStaffMutation();
  const [updateStaff] = useUpdateStaffMutation();
  const [deleteStaff] = useDeleteStaffMutation();
  const [toggleStatus] = useToggleStaffStatusMutation();

  // Cast response
  const response = staffData as StaffResponse | undefined;
  
  // Map backend data to frontend format
  const staffList: StaffUser[] = (response?.data || []).map((user: any) => ({
    _id: user._id || user.id,  // Use _id from transform, fallback to id
    name: user.name || user.fullName || "",
    email: user.email || "",
    phone: user.phone || "",
    role: (user.role?.toLowerCase() || "waiter") as "waiter" | "kitchen",
    pin: user.pin || "",
    shift: user.shift || "morning",
    device: user.device || "",
    status: (user.status?.toLowerCase() || "active") as "active" | "disabled",
    lastLogin: user.lastLogin || "Never",
  }));

  const meta = response?.meta || { total: 0, page: 1, limit: 10, staffCount: 0, kitchenCount: 0 };
  const totalUsers = meta.total || 0;
  const staffCount = meta.staffCount || 0;
  const kitchenCount = meta.kitchenCount || 0;
  const activeCount = staffList.filter((u) => u.status === "active").length;

  // Handle staff form submit
  const handleStaffSubmit = async (data: StaffFormData) => {
    try {
      if (staffModal.mode === 'add') {
        await createStaff({
          fullName: data.name,
          email: data.email,
          phone: data.phone,
          role: "STAFF",
          pin: data.pin,
          shift: data.shift,
          device: data.device || "Tablet-01",
        }).unwrap();
        toast.success("Waiter staff created successfully!");
      } else if (staffModal.mode === 'edit' && staffModal.user) {
        const userId = staffModal.user._id || staffModal.user.id;
        await updateStaff({
          id: userId,
          data: {
            fullName: data.name,
            email: data.email,
            phone: data.phone,
            pin: data.pin,
            shift: data.shift,
            device: data.device,
          }
        }).unwrap();
        toast.success("Staff updated successfully!");
      }
      setStaffModal({ open: false, mode: 'add' });
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong!");
    }
  };

  // Handle kitchen form submit
  const handleKitchenSubmit = async (data: StaffFormData) => {
    try {
      if (kitchenModal.mode === 'add') {
        await createStaff({
          fullName: data.name,
          email: data.email,
          phone: data.phone,
          role: "KITCHEN",
          pin: data.pin,
          shift: "all-day",
          device: "Wall Screen",
        }).unwrap();
        toast.success("Kitchen display created successfully!");
      } else if (kitchenModal.mode === 'edit' && kitchenModal.user) {
        const userId = kitchenModal.user._id || kitchenModal.user.id;
        await updateStaff({
          id: userId,
          data: {
            fullName: data.name,
            email: data.email,
            phone: data.phone,
            pin: data.pin,
          }
        }).unwrap();
        toast.success("Kitchen display updated successfully!");
      }
      setKitchenModal({ open: false, mode: 'add' });
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong!");
    }
  };

  // Handle edit
const handleEdit = (user: StaffUser) => {
  const userId = user._id || (user as any).id;

  if (!userId || userId === "undefined") {
    toast.error("Invalid user ID");
    return;
  }

  // ✅ modal set করার আগে একটু delay — browser autocomplete trigger এড়াতে
  setTimeout(() => {
    if (user.role === "kitchen") {
      setKitchenModal({ open: true, mode: 'edit', user });
    } else {
      setStaffModal({ open: true, mode: 'edit', user });
    }
  }, 0);
};

  // Handle delete
  const handleDelete = async (user: StaffUser) => {
    const userId = user._id || (user as any).id;
    
    if (!userId || userId === "undefined") {
      toast.error("Invalid user ID");
      return;
    }
    
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      try {
        await deleteStaff(userId).unwrap();
        toast.success("Staff deleted successfully!");
        refetch();
      } catch (error: any) {
        toast.error(error?.data?.message || "Cannot delete this staff!");
      }
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (id: string) => {
    if (!id || id === "undefined") {
      toast.error("Invalid user ID");
      return;
    }
    try {
      await toggleStatus(id).unwrap();
      toast.success("Status updated!");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Cannot change status!");
    }
  };

  // ========== LOADING STATE ==========
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg text-gray-500">Loading staff data...</p>
      </div>
    );
  }

  // ========== ERROR STATE ==========
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="bg-red-50 p-4 rounded-full">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        <p className="text-lg font-semibold text-red-600">Failed to load staff data</p>
        <p className="text-sm text-gray-500">
          {(error as any)?.data?.message || "Please check your connection or try again"}
        </p>
        <Button onClick={() => refetch()} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" /> Retry
        </Button>
      </div>
    );
  }

  // ========== MAIN CONTENT ==========
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8" />
            Staff Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage waiter and kitchen staff accounts, roles, and PINs.
          </p>
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={() => setStaffModal({ open: true, mode: 'add' })}
            disabled={isCreating}
          >
            {isCreating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4 mr-2" />
            )}
            Add Waiter
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setKitchenModal({ open: true, mode: 'add' })}
            disabled={isCreating}
          >
            <ChefHat className="h-4 w-4 mr-2" /> Add Kitchen Staff
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Staff", value: totalUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Waiters", value: staffCount, icon: UserCog, color: "text-green-600", bg: "bg-green-50" },
          { label: "Kitchen", value: kitchenCount, icon: ChefHat, color: "text-orange-600", bg: "bg-orange-50" },
          { label: "Active", value: activeCount, icon: ShieldOff, color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map((stat, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
  <Input
  type="text"
  autoComplete="off"
  placeholder="Search by name or email..."
  className="pl-9"
  value={search}
  onChange={(e) => {
    setSearch(e.target.value);
    setPage(1);
  }}
/>
        </div>
        <Select value={roleFilter} onValueChange={(value) => {
          setRoleFilter(value);
          setPage(1);
        }}>
          <SelectTrigger className="w-[150px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="waiter">👤 Waiter</SelectItem>
            <SelectItem value="kitchen">👨‍🍳 Kitchen</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(value) => {
          setStatusFilter(value);
          setPage(1);
        }}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">🟢 Active</SelectItem>
            <SelectItem value="suspended">🔴 Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Staff Table */}
      {staffList.length > 0 ? (
        <StaffTable
          users={staffList}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="bg-gray-100 p-6 rounded-full">
            <Users className="h-16 w-16 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-600">No Staff Found</h2>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Waiter Staff Modal */}
      <StaffFormModal
        mode={staffModal.mode}
        user={staffModal.user}
        open={staffModal.open}
        onClose={() => setStaffModal({ open: false, mode: 'add' })}
        onSubmit={handleStaffSubmit}
      />

      {/* Kitchen Staff Modal */}
      <KitchenFormModal
        mode={kitchenModal.mode}
        user={kitchenModal.user}
        open={kitchenModal.open}
        onClose={() => setKitchenModal({ open: false, mode: 'add' })}
        onSubmit={handleKitchenSubmit}
      />
    </div>
  );
}