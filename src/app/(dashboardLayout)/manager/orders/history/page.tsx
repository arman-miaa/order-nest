import { RoleRoutePage } from "@/components/shared/role-route-page";

export default function ManagerOrdersHistoryPage() {
  return (
    <RoleRoutePage
      role="manager"
      title="Order History"
      description="Review completed orders and historical order performance."
    />
  );
}