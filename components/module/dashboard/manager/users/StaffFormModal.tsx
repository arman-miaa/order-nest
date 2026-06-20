
'use client';

import React, { useState } from "react";
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
  // Initialize state directly from user prop - no useEffect needed
  const [formData, setFormData] = useState<StaffFormData>(() => {
    if (mode === 'edit' && user) {
      return {
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        pin: user.pin,
        shift: user.shift,
        device: user.device,
      };
    }
    return {
      name: "", email: "", phone: "",
      role: "waiter", pin: "", shift: "morning", device: "Tablet-01",
    };
  });

  // Reset form when modal opens with different user
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
    }
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.pin) {
      alert("Please fill all required fields");
      return;
    }
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === 'add' ? (
              <><UserPlus className="h-5 w-5" /> Add Waiter Staff</>
            ) : (
              <><Edit className="h-5 w-5" /> Edit Waiter: {user?.name}</>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label>Full Name <span className="text-red-500">*</span></Label>
            <Input placeholder="Enter name" value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div>
            <Label>Email <span className="text-red-500">*</span></Label>
            <Input type="email" placeholder="waiter@restaurant.com" value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div>
            <Label>Phone</Label>
            <Input placeholder="01XXXXXXXXX" value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>PIN <span className="text-red-500">*</span></Label>
              <Input type="password" maxLength={4} placeholder="****" value={formData.pin}
                onChange={(e) => setFormData({ ...formData, pin: e.target.value })} />
            </div>
            <div>
              <Label>Shift</Label>
              <Select value={formData.shift} onValueChange={(value: StaffShift) => setFormData({ ...formData, shift: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning (8AM-4PM)</SelectItem>
                  <SelectItem value="evening">Evening (4PM-12AM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
    
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>
            {mode === 'add' ? 'Create Staff' : 'Update Staff'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}