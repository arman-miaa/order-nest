import { RoleRoutePage } from "@/components/shared/role-route-page";

export default function StaffOrdersCurrentPage() {
  return (
    <RoleRoutePage
      role="staff"
      title="Current Orders"
      description="View orders that are currently open on the floor."
    />
  );
}