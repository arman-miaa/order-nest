/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChefHat, Edit, Monitor } from "lucide-react";
import { StaffUser, StaffFormData } from "@/src/types/user.type";

interface KitchenFormModalProps {
  mode: 'add' | 'edit';
  user?: StaffUser | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: StaffFormData) => void;
}

const defaultKitchenData: StaffFormData = {
  name: "Kitchen Display",
  email: "kitchen@ordernest.com",
  phone: "",
  role: "kitchen",
  pin: "0000",
  shift: "all-day",
  device: "Wall Screen",
};

export function KitchenFormModal({ mode, user, open, onClose, onSubmit }: KitchenFormModalProps) {
  const prevOpenRef = useRef(false);

  const getInitialData = (): StaffFormData => {
    if (mode === 'edit' && user) {
      return {
        name: user.name || "Kitchen Display",
        email: user.email || "kitchen@ordernest.com",
        phone: user.phone || "",
        role: "kitchen",
        pin: user.pin || "0000",
        shift: (user.shift as any) || "all-day",
        device: user.device || "Wall Screen",
      };
    }
    return defaultKitchenData;
  };

  const [formData, setFormData] = useState<StaffFormData>(getInitialData);

  // Only reset when modal opens (false → true transition)
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
              ? <><ChefHat className="h-5 w-5" /> Setup Kitchen Display</>
              : <><Edit className="h-5 w-5" /> Edit Kitchen: {user?.name}</>
            }
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-sm text-orange-800 flex items-start gap-2">
              <ChefHat className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                <strong>Shared Display:</strong> This is the kitchen wall screen account.
                One account for all kitchen staff.
              </span>
            </p>
          </div>

          <div>
            <Label>Display Name <span className="text-red-500">*</span></Label>
            <Input
              placeholder="Kitchen Display"
              value={formData.name}
              onChange={(e) => update('name', e.target.value)}
            />
          </div>

          <div>
            <Label>Email <span className="text-red-500">*</span></Label>
            <Input
              type="email"
              // ✅ autoComplete off — এটাই email search এ চলে যাওয়ার fix
              autoComplete="off"
              placeholder="kitchen@ordernest.com"
              value={formData.email}
              onChange={(e) => update('email', e.target.value)}
            />
          </div>

          <div>
            <Label>Phone (Optional)</Label>
            <Input
              placeholder="01XXXXXXXXX"
              value={formData.phone}
              onChange={(e) => update('phone', e.target.value)}
            />
          </div>

          <div>
            <Label>Kitchen Access PIN <span className="text-red-500">*</span></Label>
            <Input
              type="password"
              maxLength={4}
              autoComplete="new-password"
              placeholder="****"
              value={formData.pin}
              onChange={(e) => update('pin', e.target.value)}
            />
          </div>

          <div className="bg-slate-50 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Monitor className="h-4 w-4 text-slate-500" />
              <span className="font-medium">Device:</span>
              <span>Wall Screen Display</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Hours:</span>
              <span className="text-green-600">Always Active (All Day)</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {mode === 'add' ? 'Setup Kitchen Display' : 'Update Settings'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}