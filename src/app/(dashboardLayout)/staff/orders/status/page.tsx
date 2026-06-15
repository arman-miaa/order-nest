import { RoleRoutePage } from "@/components/shared/role-route-page";

export default function StaffOrdersStatusPage() {
  return (
    <RoleRoutePage
      role="staff"
      title="Order Status"
      description="Check progress, delays, and ready-to-serve updates."
    />
  );
}