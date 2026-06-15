import { RoleRoutePage } from "@/components/shared/role-route-page";

export default function ManagerSettingsPage() {
  return (
    <RoleRoutePage
      role="manager"
      title="Settings"
      description="Configure manager-level preferences and application settings."
    />
  );
}