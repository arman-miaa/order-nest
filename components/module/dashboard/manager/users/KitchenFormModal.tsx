
'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChefHat, Edit } from "lucide-react";
import { StaffUser, StaffFormData, StaffShift } from "@/src/types/user.type";

interface KitchenFormModalProps {
  mode: 'add' | 'edit';
  user?: StaffUser | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: StaffFormData) => void;
}

export function KitchenFormModal({ mode, user, open, onClose, onSubmit }: KitchenFormModalProps) {
  // Initialize state directly - no useEffect
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
      role: "kitchen", pin: "", shift: "morning", device: "Wall Screen",
    };
  });

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) onClose();
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
              <><ChefHat className="h-5 w-5" /> Add Kitchen Staff</>
            ) : (
              <><Edit className="h-5 w-5" /> Edit Kitchen: {user?.name}</>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label>Full Name <span className="text-red-500">*</span></Label>
            <Input placeholder="Enter kitchen staff name" value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div>
            <Label>Email <span className="text-red-500">*</span></Label>
            <Input type="email" placeholder="kitchen@restaurant.com" value={formData.email}
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
            {mode === 'add' ? 'Create Kitchen Staff' : 'Update Kitchen Staff'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}