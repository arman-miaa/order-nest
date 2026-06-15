import { RoleRoutePage } from "@/components/shared/role-route-page";

export default function ManagerFloorViewPage() {
  return (
    <RoleRoutePage
      role="manager"
      title="Live Floor View"
      description="Monitor table occupancy and floor activity in real time."
    />
  );
}