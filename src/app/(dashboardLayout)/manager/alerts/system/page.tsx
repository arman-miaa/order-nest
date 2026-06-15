import { RoleRoutePage } from "@/components/shared/role-route-page";
import { SystemAlertsView } from "@/components/dashboard/manager/alerts/system-alerts-view";

export default function ManagerAlertsSystemPage() {
  return (
    <RoleRoutePage
      role="manager"
      title="System Alerts"
      description="Review operational alerts, warnings, and system notices."
    >
      <SystemAlertsView />
    </RoleRoutePage>
  );
}