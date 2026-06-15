import { RoleRoutePage } from "@/components/shared/role-route-page";

export default function ManagerOrdersActivePage() {
  return (
    <RoleRoutePage
      role="manager"
      title="Active Orders"
      description="Track orders that are currently being prepared or served."
    />
  );
}