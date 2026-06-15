import { RoleRoutePage } from "@/components/shared/role-route-page";

export default function StaffServicePage() {
  return (
    <RoleRoutePage
      role="staff"
      title="Table Service"
      description="Handle serving and clearing actions for assigned tables."
    />
  );
}