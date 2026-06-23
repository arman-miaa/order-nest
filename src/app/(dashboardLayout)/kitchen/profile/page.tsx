/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from "react";
import { Loader2, RefreshCw, Save, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetMeQuery, useUpdateUserMutation } from "@/redux/api/authApi";
import { unwrapApiData } from "@/src/utils/api-normalize";

export default function KitchenProfilePage() {
  const { data, isLoading, isError, refetch } = useGetMeQuery(undefined);
  const [updateUser, { isLoading: isSaving }] = useUpdateUserMutation();
  const [form, setForm] = useState<{ name?: string; email?: string; phone?: string }>({});

  const profile: any = unwrapApiData<any>(data, {});
  const values = useMemo(() => ({
    name: form.name ?? profile.name ?? profile.fullName ?? "",
    email: form.email ?? profile.email ?? "",
    phone: form.phone ?? profile.phone ?? "",
  }), [form.name, form.email, form.phone, profile.name, profile.fullName, profile.email, profile.phone]);

  const handleSubmit = async () => {
    if (!values.name.trim()) {
      toast.error("Name is required.");
      return;
    }
    if (!values.email.trim()) {
      toast.error("Email is required.");
      return;
    }

    try {
      await updateUser({ fullName: values.name, name: values.name, email: values.email, phone: values.phone }).unwrap();
      toast.success("Profile updated successfully.");
      setForm({});
    } catch (error: any) {
      toast.error(error?.data?.message || "Could not update profile.");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-extrabold tracking-tight text-slate-900">
            <User className="h-8 w-8" /> Kitchen Profile
          </h1>
          <p className="text-slate-500">Manage kitchen account details and contact information.</p>
        </div>
        <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      <div className="max-w-2xl rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        {isLoading ? (
          <div className="flex items-center gap-2 py-12 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading profile...
          </div>
        ) : isError ? (
          <div className="py-12 text-sm text-red-600">Failed to load profile.</div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="kitchen-name">Name</Label>
              <Input id="kitchen-name" value={values.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="kitchen-email">Email</Label>
              <Input id="kitchen-email" type="email" value={values.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="kitchen-phone">Phone</Label>
              <Input id="kitchen-phone" value={values.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} />
            </div>
            <Button onClick={handleSubmit} disabled={isSaving}>
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Profile
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}