import { RoleRoutePage } from "@/components/shared/role-route-page";

export default function KitchenQueueAllPage() {
  return (
    <RoleRoutePage
      role="kitchen"
      title="All Orders"
      description="Review every order currently waiting in the kitchen queue."
    />
  );
}