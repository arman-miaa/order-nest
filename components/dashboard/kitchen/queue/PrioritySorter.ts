import { Order } from "../../shared/types/restaurant.types";

/**
 * Sorts kitchen orders:
 * 1. VIP orders always come first.
 * 2. Within the same VIP status, oldest orders (created first) come first.
 */
export const sortKitchenOrders = (orders: Order[]): Order[] => {
  return [...orders].sort((a, b) => {
    if (a.isVip && !b.isVip) return -1;
    if (!a.isVip && b.isVip) return 1;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
};
export default sortKitchenOrders;
