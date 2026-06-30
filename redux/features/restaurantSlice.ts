// Only keep types - no demo data, no reducers

export type TableStatus = "AVAILABLE" | "OCCUPIED" | "RESERVED" | "DIRTY" | "SEATED" | "ORDERING" | "EATING" | "BILL_REQUESTED";
export type OrderStatus = "PENDING" | "SENT" | "PREPARING" | "READY" | "SERVED" | "COMPLETED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "UNPAID" | "PAID" | "REFUNDED";
export type AlertStatus = "PENDING" | "ACKNOWLEDGED" | "RESOLVED" | "DISMISSED";
// src/redux/features/restaurantSlice.ts

// ✅ Update to match backend Prisma enum
export interface MenuItem {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  price: number;
  prepTime: number;
  category: string;
  imageUrl?: string;
  image?: string;
  inStock: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  modifiers?: string[];
}

export interface Order {
  _id?: string;
  id?: string;
  tableId: string;
  table?: Table;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;   // ✅ Prisma field
  totalPrice?: number; 
    isVip?: boolean;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface Alert {
  _id?: string;
  id?: string;
  type: "delay" | "stock" | "vip" | "system";
  message: string;
  severity: "critical" | "warning" | "info";
  createdAt: string;
  resolved: boolean;
  tableId?: string;
  table?: Table;
}

export interface Table {
  _id?: string;
  id?: string;
  tableNumber: string;
  capacity: number;
  status: TableStatus;
  activeOrderId?: string | null;
  seatedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}