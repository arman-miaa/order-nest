import { RoleRoutePage } from "@/components/shared/role-route-page";

export default function KitchenItemsReadyPage() {
  return (
    <RoleRoutePage
      role="kitchen"
      title="Ready"
      description="See items that are finished and waiting to be sent out."
    />
  );
}