import { RoleRoutePage } from "@/components/shared/role-route-page";

export default function KitchenQueuePage() {
  return (
    <RoleRoutePage
      role="kitchen"
      title="Order Queue"
      description="See all queued kitchen orders and current workload."
    />
  );
}