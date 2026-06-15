import { RoleRoutePage } from "@/components/shared/role-route-page";

export default function ManagerAlertsSystemPage() {
  return (
    <RoleRoutePage
      role="manager"
      title="System Alerts"
      description="Review operational alerts, warnings, and system notices."
    />
  );
}