/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from "react";
import { Edit, Loader2, Plus, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableStatus } from "@/redux/features/restaurantSlice";
import {
  useCreateTableMutation,
  useDeleteTableMutation,
  useGetAllTablesQuery,
  useUpdateTableMutation,
  useUpdateTableStatusMutation,
} from "@/redux/api/restaurantApi";
import { unwrapApiData } from "@/src/utils/api-normalize";

const statuses: TableStatus[] = ["Available", "Seated", "Ordering", "Eating", "Bill Requested", "Dirty"];

type TableForm = {
  tableNo: string;
  capacity: string;
  status: TableStatus;
};

const emptyForm: TableForm = {
  tableNo: "",
  capacity: "4",
  status: "Available",
};

const getId = (table: any) => table._id ?? table.id ?? table.tableNo ?? table.number;

const normalizeTable = (table: any, index: number) => ({
  raw: table,
  id: getId(table),
  tableNo: table.tableNo ?? table.number ?? table.id ?? index + 1,
  capacity: Number(table.capacity ?? table.seats ?? 4),
  status: (table.status ?? "Available") as TableStatus,
  activeOrderId: table.activeOrderId ?? table.activeOrder?._id ?? table.activeOrder?.id ?? null,
  seatedAt: table.seatedAt,
});

export function TableManagement() {
  const { data, isLoading, isError, refetch } = useGetAllTablesQuery(undefined);
  const [createTable, { isLoading: isCreating }] = useCreateTableMutation();
  const [updateTable, { isLoading: isUpdating }] = useUpdateTableMutation();
  const [updateStatus] = useUpdateTableStatusMutation();
  const [deleteTable, { isLoading: isDeleting }] = useDeleteTableMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<any | null>(null);
  const [form, setForm] = useState<TableForm>(emptyForm);

  const tables = useMemo(
    () => unwrapApiData<any[]>(data, []).map(normalizeTable),
    [data]
  );

  const openAdd = () => {
    setEditingTable(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (table: any) => {
    setEditingTable(table);
    setForm({
      tableNo: String(table.tableNo),
      capacity: String(table.capacity),
      status: table.status,
    });
    setModalOpen(true);
  };

  const validate = () => {
    const tableNo = Number(form.tableNo);
    const capacity = Number(form.capacity);
    if (!Number.isInteger(tableNo) || tableNo <= 0) {
      toast.error("Enter a valid table number.");
      return false;
    }
    if (!Number.isInteger(capacity) || capacity <= 0) {
      toast.error("Enter a valid capacity.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const payload = {
      tableNo: Number(form.tableNo),
      capacity: Number(form.capacity),
      status: form.status,
    };

    try {
      if (editingTable) {
        await updateTable({ id: editingTable.id, data: payload }).unwrap();
        toast.success("Table updated successfully.");
      } else {
        await createTable(payload).unwrap();
        toast.success("Table created successfully.");
      }
      setModalOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Could not save table.");
    }
  };

  const handleStatusChange = async (table: any, status: TableStatus) => {
    try {
      await updateStatus({ id: table.id, status }).unwrap();
      toast.success(`Table ${table.tableNo} marked ${status}.`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Could not update table status.");
    }
  };

  const handleDelete = async (table: any) => {
    if (!confirm(`Delete table ${table.tableNo}?`)) return;
    try {
      await deleteTable(table.id).unwrap();
      toast.success("Table deleted successfully.");
    } catch (error: any) {
      toast.error(error?.data?.message || "Could not delete table.");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Table Management</h1>
          <p className="text-slate-500">Create, update, delete, and manage table statuses.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
          <Button onClick={openAdd}>
            <Plus className="h-4 w-4" /> Add Table
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading tables...
          </div>
        ) : isError ? (
          <div className="py-16 text-center text-sm text-red-600">Failed to load tables.</div>
        ) : tables.length === 0 ? (
          <div className="py-16 text-center text-sm text-slate-500">No tables found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b text-xs uppercase tracking-wider text-slate-400">
                  <th className="py-3">Table</th>
                  <th className="py-3">Capacity</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Active Order</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tables.map((table) => (
                  <tr key={String(table.id)}>
                    <td className="py-4 font-bold text-slate-900">T{String(table.tableNo).padStart(2, "0")}</td>
                    <td className="py-4 text-slate-600">{table.capacity} guests</td>
                    <td className="py-4">
                      <Select value={table.status} onValueChange={(value: TableStatus) => handleStatusChange(table, value)}>
                        <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {statuses.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-4 text-slate-500">{table.activeOrderId || "None"}</td>
                    <td className="py-4">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEdit(table)}>
                          <Edit className="h-4 w-4" /> Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(table)} disabled={isDeleting}>
                          <Trash2 className="h-4 w-4" /> Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingTable ? "Edit Table" : "Add Table"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="table-no">Table Number</Label>
              <Input id="table-no" type="number" min={1} value={form.tableNo} onChange={(e) => setForm((prev) => ({ ...prev, tableNo: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="table-capacity">Capacity</Label>
              <Input id="table-capacity" type="number" min={1} value={form.capacity} onChange={(e) => setForm((prev) => ({ ...prev, capacity: e.target.value }))} />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(value: TableStatus) => setForm((prev) => ({ ...prev, status: value }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="button" onClick={handleSubmit} disabled={isCreating || isUpdating}>
              {(isCreating || isUpdating) && <Loader2 className="h-4 w-4 animate-spin" />}
              {editingTable ? "Update Table" : "Create Table"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}