import { RoleRoutePage } from "@/components/shared/role-route-page";

export default function ManagerAlertsDelayedPage() {
  return (
    <RoleRoutePage
      role="manager"
      title="Delayed Orders"
      description="See orders that are behind schedule and need attention."
    />
  );
}