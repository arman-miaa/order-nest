/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Alert,
  MenuItem,
  Order,
  OrderStatus,
  Table,
  TableStatus,
} from "@/redux/features/restaurantSlice";

const menuCategories = ["Burgers", "Pizzas", "Sides", "Drinks", "Desserts"] as const;

export const getEntityId = (entity: any): string =>
  String(entity?._id ?? entity?.id ?? entity?.tableNo ?? entity?.number ?? "");

// ✅ Fixed: Use MongoDB _id as id, not tableNumber
export const normalizeTable = (table: any, index = 0): Table => ({
  _id: table._id,  // ✅ Keep original MongoDB _id
  id: table._id || table.id,  // ✅ Use _id as id, not tableNumber!
  tableNumber: table.tableNumber || table.tableNo || String(index + 1),  // ✅ Separate tableNumber
  capacity: Number(table.capacity ?? table.seats ?? 4),
  status: (table.status ?? "AVAILABLE") as TableStatus,
  activeOrderId: table.activeOrderId ?? table.activeOrder?._id ?? table.activeOrder?.id ?? null,
  seatedAt: table.seatedAt ?? table.createdAt,
});

export const normalizeMenuItem = (item: any): MenuItem => {
  const category = menuCategories.includes(item.category) ? item.category : "Sides";

  return {
    id: getEntityId(item),
    _id: item._id,
    name: item.name ?? "Untitled item",
    description: item.description ?? "",
    price: Number(item.price ?? 0),
    prepTime: Number(item.prepTime ?? item.preparationTime ?? 0),
    category,
    imageUrl: item.imageUrl ?? item.image ?? "/images/login.jpg",
    inStock: Boolean(item.inStock ?? item.isAvailable ?? item.stockStatus !== "OUT_OF_STOCK"),
  };
};

export const normalizeOrder = (order: any): Order => ({
  _id: order._id,
  id: getEntityId(order),
  tableId: order.tableId ?? order.table?.id ?? order.table?._id ?? "",
  items: (order.items ?? []).map((item: any) => ({
    itemId: String(item.itemId ?? item.menuItemId ?? item.menuItem?._id ?? item.id),
    name: item.name ?? item.menuItem?.name ?? "Item",
    price: Number(item.price ?? item.menuItem?.price ?? 0),
    quantity: Number(item.quantity ?? 1),
    modifiers: item.modifiers ?? [],
  })),
  status: (order.status ?? "PENDING") as OrderStatus,
  totalAmount: Number(order.totalAmount ?? order.totalPrice ?? order.total ?? 0), // ✅ totalAmount
  paymentStatus: (order.paymentStatus ?? "PENDING") as any,
  isVip: Boolean(order.isVip ?? order.vip),
  createdAt: order.createdAt ?? new Date().toISOString(),
});

export const normalizeAlert = (alert: any): Alert => ({
  id: getEntityId(alert),
  type: alert.type ?? "system",
  message: alert.message ?? alert.title ?? "System alert",
  severity: alert.severity ?? "info",
  createdAt: alert.createdAt ?? new Date().toISOString(),
  resolved: Boolean(alert.resolved ?? alert.isResolved),
  tableId: alert.tableId ?? alert.table?.tableNo,
});