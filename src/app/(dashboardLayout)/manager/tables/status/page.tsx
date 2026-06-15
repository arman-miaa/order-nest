import { RoleRoutePage } from "@/components/shared/role-route-page";

export default function ManagerTablesStatusPage() {
  return (
    <RoleRoutePage
      role="manager"
      title="Table Status"
      description="Track available, occupied, reserved, and cleaning states."
    />
  );
}