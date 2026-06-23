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

export const normalizeTable = (table: any, index = 0): Table => ({
  id: Number(table.tableNo ?? table.number ?? table.id ?? index + 1),
  capacity: Number(table.capacity ?? table.seats ?? 4),
  status: (table.status ?? "Available") as TableStatus,
  activeOrderId: table.activeOrderId ?? table.activeOrder?._id ?? table.activeOrder?.id ?? null,
  seatedAt: table.seatedAt ?? table.createdAt,
  isVip: Boolean(table.isVip ?? table.vip),
});

export const normalizeMenuItem = (item: any): MenuItem => {
  const category = menuCategories.includes(item.category) ? item.category : "Sides";

  return {
    id: getEntityId(item),
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
  id: getEntityId(order),
  tableId: Number(order.tableId ?? order.table?.id ?? order.table?.tableNo ?? order.tableNo ?? 0),
  items: (order.items ?? []).map((item: any) => ({
    itemId: String(item.itemId ?? item.menuItemId ?? item.menuItem?._id ?? item.id),
    name: item.name ?? item.menuItem?.name ?? "Item",
    price: Number(item.price ?? item.menuItem?.price ?? 0),
    quantity: Number(item.quantity ?? 1),
    modifiers: item.modifiers ?? [],
  })),
  status: (order.status ?? "Queued") as OrderStatus,
  totalPrice: Number(order.totalPrice ?? order.total ?? order.subtotal ?? 0),
  isVip: Boolean(order.isVip ?? order.vip),
  createdAt: order.createdAt ?? new Date().toISOString(),
  dueAt: order.dueAt ?? order.estimatedReadyAt ?? order.createdAt ?? new Date().toISOString(),
  startedCookingAt: order.startedCookingAt,
  markedReadyAt: order.markedReadyAt,
  completedAt: order.completedAt,
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
