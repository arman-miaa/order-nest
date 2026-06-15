import { RoleRoutePage } from "@/components/shared/role-route-page";

export default function StaffProfilePage() {
  return (
    <RoleRoutePage
      role="staff"
      title="My Profile"
      description="View personal details, role information, and account status."
    />
  );
}