'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChefHat, Edit } from "lucide-react";
import { StaffUser, StaffFormData } from "@/src/types/user.type";

interface KitchenFormModalProps {
  mode: 'add' | 'edit';
  user?: StaffUser | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: StaffFormData) => void;
}

export function KitchenFormModal({ mode, user, open, onClose, onSubmit }: KitchenFormModalProps) {
  // Initialize state directly
  const [formData, setFormData] = useState<StaffFormData>(() => {
    if (mode === 'edit' && user) {
      return {
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        pin: user.pin,
        shift: user.shift || "all-day",
        device: user.device || "Wall Screen",
      };
    }
    return {
      name: "Kitchen Display",
      email: "kitchen@ordernest.com",
      phone: "",
      role: "kitchen",
      pin: "0000",
      shift: "all-day",
      device: "Wall Screen",
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
              <><ChefHat className="h-5 w-5" /> Setup Kitchen Display</>
            ) : (
              <><Edit className="h-5 w-5" /> Edit Kitchen: {user?.name}</>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Info Box */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-sm text-orange-800">
              <ChefHat className="h-4 w-4 inline mr-1" />
              <strong>Shared Display:</strong> This account is used on the kitchen wall screen. 
              All kitchen staff share this single display.
            </p>
          </div>

          <div>
            <Label>Display Name <span className="text-red-500">*</span></Label>
            <Input 
              placeholder="Kitchen Display" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
            />
            <p className="text-xs text-muted-foreground mt-1">
              This name shows on the kitchen screen
            </p>
          </div>

          <div>
            <Label>Email <span className="text-red-500">*</span></Label>
            <Input 
              type="email" 
              placeholder="kitchen@ordernest.com" 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
            />
          </div>

          <div>
            <Label>Phone (Optional)</Label>
            <Input 
              placeholder="01XXXXXXXXX" 
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
            />
          </div>

          <div>
            <Label>Kitchen PIN <span className="text-red-500">*</span></Label>
            <Input 
              type="password" 
              maxLength={4} 
              placeholder="****" 
              value={formData.pin}
              onChange={(e) => setFormData({ ...formData, pin: e.target.value })} 
            />
            <p className="text-xs text-muted-foreground mt-1">
              Simple PIN for kitchen staff (e.g., 0000 or 1234)
            </p>
          </div>

          {/* Device Info - Read only */}
          <div className="bg-muted rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Device:</span>
              <span>Wall Screen (Kitchen Display)</span>
            </div>
            <div className="flex items-center gap-2 text-sm mt-1">
              <span className="font-medium">Hours:</span>
              <span>24/7 (Always On During Service)</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>
            {mode === 'add' ? 'Setup Kitchen Display' : 'Update Kitchen Display'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}