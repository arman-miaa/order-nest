import { RoleRoutePage } from "@/components/shared/role-route-page";

export default function StaffOrdersPage() {
  return (
    <RoleRoutePage
      role="staff"
      title="Active Orders"
      description="Manage the live order queue for your assigned tables."
    />
  );
}