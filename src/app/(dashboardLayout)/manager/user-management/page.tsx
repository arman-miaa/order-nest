// UserManagementPage.tsx
// Main staff management page - Manager creates waiter and kitchen staff
// Uses StaffTable component for listing, separate modals for forms

'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, UserPlus, ChefHat, Search, Filter, ShieldOff, UserCog } from "lucide-react";
import { StaffFormData, StaffUser } from "@/src/types/user.type";
import { StaffFormModal } from "@/components/module/dashboard/manager/users/StaffFormModal";
import { KitchenFormModal } from "@/components/module/dashboard/manager/users/KitchenFormModal";
import { StaffTable } from "@/components/module/dashboard/manager/users/StaffTable";

export default function UserManagementPage() {
  // Staff list state
  const [users, setUsers] = useState<StaffUser[]>([
    {
      _id: "1", name: "Rahim Uddin", email: "rahim@mail.com",
      phone: "01712345678", role: "waiter", pin: "5678",
      shift: "morning", status: "active", lastLogin: "5 min ago"
    },
    {
      _id: "2", name: "Korim Mia", email: "korim@mail.com",
      phone: "01787654321", role: "waiter", pin: "1234",
      shift: "evening", status: "active", lastLogin: "2 hours ago"
    },
    {
      _id: "3", name: "Kitchen Main", email: "kitchen@mail.com",
      phone: "01711111111", role: "kitchen", pin: "9999",
      shift: "morning", status: "active", lastLogin: "2 min ago"
    },
  ]);

  // Modal states
  const [staffModal, setStaffModal] = useState<{
    open: boolean; mode: 'add' | 'edit'; user?: StaffUser;
  }>({ open: false, mode: 'add' });

  const [kitchenModal, setKitchenModal] = useState<{
    open: boolean; mode: 'add' | 'edit'; user?: StaffUser;
  }>({ open: false, mode: 'add' });

  // Filter states
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Calculate stats
  const totalUsers = users.length;
  const staffCount = users.filter(u => u.role === "waiter").length;
  const kitchenCount = users.filter(u => u.role === "kitchen").length;
  const disabledCount = users.filter(u => u.status === "disabled").length;

  // Filter users based on search, role, and status
  const filteredUsers = users.filter(user => {
    const matchSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || user.role === roleFilter;
    const matchStatus = statusFilter === "all" || user.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  // Handle staff form submit (add or edit)
  const handleStaffSubmit = (data: StaffFormData) => {
    if (staffModal.mode === 'add') {
      const newUser: StaffUser = {
        _id: Date.now().toString(),
        ...data,
        status: "active",
        lastLogin: "Never",
      };
      setUsers([...users, newUser]);
    } else if (staffModal.mode === 'edit' && staffModal.user) {
      setUsers(users.map(u =>
        u._id === staffModal.user!._id ? { ...u, ...data } : u
      ));
    }
    setStaffModal({ open: false, mode: 'add' });
  };

  // Handle kitchen form submit
  const handleKitchenSubmit = (data: StaffFormData) => {
    if (kitchenModal.mode === 'add') {
      const newUser: StaffUser = {
        _id: Date.now().toString(),
        ...data,
        role: "kitchen",
        status: "active",
        lastLogin: "Never",
      };
      setUsers([...users, newUser]);
    } else if (kitchenModal.mode === 'edit' && kitchenModal.user) {
      setUsers(users.map(u =>
        u._id === kitchenModal.user!._id ? { ...u, ...data } : u
      ));
    }
    setKitchenModal({ open: false, mode: 'add' });
  };

  // Handle edit - opens correct modal based on role
  const handleEdit = (user: StaffUser) => {
    if (user.role === "kitchen") {
      setKitchenModal({ open: true, mode: 'edit', user });
    } else {
      setStaffModal({ open: true, mode: 'edit', user });
    }
  };

  // Delete staff with confirmation
  const handleDelete = (user: StaffUser) => {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      setUsers(users.filter(u => u._id !== user._id));
    }
  };

  // Toggle active/disabled status
  const toggleStatus = (id: string) => {
    setUsers(users.map(u =>
      u._id === id ? {
        ...u,
        status: u.status === "active" ? "disabled" as const : "active" as const
      } : u
    ));
  };

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

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button onClick={() => setStaffModal({ open: true, mode: 'add' })}>
            <UserPlus className="h-4 w-4 mr-2" /> Add Waiter
          </Button>
          <Button variant="outline" onClick={() => setKitchenModal({ open: true, mode: 'add' })}>
            <ChefHat className="h-4 w-4 mr-2" /> Add Kitchen Staff
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Staff", value: totalUsers, icon: Users, color: "text-blue-600" },
          { label: "Waiter Staff", value: staffCount, icon: UserCog, color: "text-green-600" },
          { label: "Kitchen Staff", value: kitchenCount, icon: ChefHat, color: "text-orange-600" },
          { label: "Disabled", value: disabledCount, icon: ShieldOff, color: "text-red-600" },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
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
            placeholder="Search by name or email..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
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
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">🟢 Active</SelectItem>
            <SelectItem value="disabled">🔴 Disabled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Staff Table Component */}
      <StaffTable
        users={filteredUsers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={toggleStatus}
      />

      {/* Waiter Staff Modal (Add/Edit) */}
      <StaffFormModal
        mode={staffModal.mode}
        user={staffModal.user}
        open={staffModal.open}
        onClose={() => setStaffModal({ open: false, mode: 'add' })}
        onSubmit={handleStaffSubmit}
      />

      {/* Kitchen Staff Modal (Add/Edit) */}
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