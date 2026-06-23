/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserPlus, Edit } from "lucide-react";
import { StaffUser, StaffFormData, StaffShift } from "@/src/types/user.type";

interface StaffFormModalProps {
  mode: 'add' | 'edit';
  user?: StaffUser | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: StaffFormData) => void;
}

export function StaffFormModal({ mode, user, open, onClose, onSubmit }: StaffFormModalProps) {
  const prevOpenRef = useRef(false);

  const getInitialData = (): StaffFormData => {
    if (mode === 'edit' && user) {
      return {
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "waiter",
        pin: user.pin || "",
        shift: (user.shift as StaffShift) || "morning",
        device: user.device || "Tablet-01",
      };
    }
    return {
      name: "",
      email: "",
      phone: "",
      role: "waiter",
      pin: "",
      shift: "morning",
      device: "Tablet-01",
    };
  };

  const [formData, setFormData] = useState<StaffFormData>(getInitialData);

  // ✅ Reset form ONLY when modal opens (prevents autocomplete issue)
  useEffect(() => {
    if (open && !prevOpenRef.current) {
      setFormData(getInitialData());
    }
    prevOpenRef.current = open;
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.pin.trim()) {
      alert("Please fill all required fields");
      return;
    }
    onSubmit(formData);
  };

  const update = (field: keyof StaffFormData, value: string) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === 'add'
              ? <><UserPlus className="h-5 w-5" /> Add Waiter Staff</>
              : <><Edit className="h-5 w-5" /> Edit Waiter: {user?.name}</>
            }
          </DialogTitle>
        </DialogHeader>

        {/* ✅ Wrap in form with autocomplete="off" */}
        <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="staff-fullname">Full Name <span className="text-red-500">*</span></Label>
              <Input
                id="staff-fullname"
                name="staff-fullname"
                autoComplete="off"
                placeholder="Enter name"
                value={formData.name}
                onChange={(e) => update('name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="staff-email">Email <span className="text-red-500">*</span></Label>
              <Input
                id="staff-email"
                name="staff-email"
                type="text"
                inputMode="email"
                autoComplete="off"
                placeholder="waiter@restaurant.com"
                value={formData.email}
                onChange={(e) => update('email', e.target.value)}
                // ✅ Add this to prevent browser from filling search value
                onFocus={(e) => {
                  if (mode === 'add') {
                    e.target.select();
                  }
                }}
              />
            </div>
            <div>
              <Label htmlFor="staff-phone">Phone</Label>
              <Input
                id="staff-phone"
                name="staff-phone"
                autoComplete="off"
                placeholder="01XXXXXXXXX"
                value={formData.phone}
                onChange={(e) => update('phone', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="staff-pin">PIN <span className="text-red-500">*</span></Label>
                <Input
                  id="staff-pin"
                  name="staff-pin"
                  type="password"
                  maxLength={4}
                  autoComplete="new-password"
                  placeholder="****"
                  value={formData.pin}
                  onChange={(e) => update('pin', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="staff-shift">Shift</Label>
                <Select
                  value={formData.shift}
                  onValueChange={(value: StaffShift) => update('shift', value)}
                >
                  <SelectTrigger id="staff-shift"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (8AM-4PM)</SelectItem>
                    <SelectItem value="evening">Evening (4PM-12AM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="button" onClick={handleSubmit}>
              {mode === 'add' ? 'Create Staff' : 'Update Staff'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}