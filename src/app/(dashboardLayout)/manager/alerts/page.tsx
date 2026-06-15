import { RoleRoutePage } from "@/components/shared/role-route-page";

export default function ManagerAlertsPage() {
  return (
    <RoleRoutePage
      role="manager"
      title="Alerts & Notifications"
      description="Central place for delayed orders, system alerts, and notifications."
    />
  );
}