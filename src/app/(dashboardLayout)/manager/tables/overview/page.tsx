import { RoleRoutePage } from "@/components/shared/role-route-page";

export default function ManagerTablesOverviewPage() {
  return (
    <RoleRoutePage
      role="manager"
      title="View All Tables"
      description="See every table in the restaurant with its current assignment."
    />
  );
}