import { RoleRoutePage } from "@/components/shared/role-route-page";

export default function ManagerOrdersPage() {
  return (
    <RoleRoutePage
      role="manager"
      title="Order Management"
      description="Manage live, priority, and historical orders for the floor."
    />
  );
}