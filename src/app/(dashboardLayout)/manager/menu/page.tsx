import { RoleRoutePage } from "@/components/shared/role-route-page";

export default function ManagerMenuPage() {
  return (
    <RoleRoutePage
      role="manager"
      title="Menu Management"
      description="Update menu items, categories, and item availability."
    />
  );
}