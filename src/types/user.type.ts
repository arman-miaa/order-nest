// export interface User {
//   id: string;
//   name: string;
//   phone: string;
//   email: string;
//   role: string;
//   status: string;
//   createdAt: string;
//   updatedAt: string;
// }


// types.ts - Shared types for staff management

// src/types/user.type.ts

export type StaffRole = "kitchen" | "waiter";
export type StaffShift = "morning" | "evening" | "all-day"; 
export type StaffStatus = "active" | "disabled";

export interface StaffUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  pin: string;
  shift: StaffShift;
  device?: string;      
  status: StaffStatus;
  lastLogin: string;
}

export interface StaffFormData {
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  pin: string;
  shift: StaffShift;
  device?: string;      
}