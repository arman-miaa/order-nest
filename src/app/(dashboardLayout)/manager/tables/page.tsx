import { RoleRoutePage } from "@/components/shared/role-route-page";

export default function ManagerTablesPage() {
  return (
    <RoleRoutePage
      role="manager"
      title="Table Management"
      description="Manage table allocation, table states, and dining room availability."
    />
  );
}