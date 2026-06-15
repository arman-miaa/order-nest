import { RoleRoutePage } from "@/components/shared/role-route-page";

export default function StaffServiceServedPage() {
  return (
    <RoleRoutePage
      role="staff"
      title="Mark Served"
      description="Mark items or orders as served after delivery to the guest."
    />
  );
}