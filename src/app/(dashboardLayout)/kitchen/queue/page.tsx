"use client";

import { Suspense } from "react";
import { OrderQueue } from "@/components/dashboard/kitchen/queue/OrderQueue";

export default function KitchenQueuePage() {
  return (
    <Suspense fallback={<div>Loading queue...</div>}>
      <OrderQueue />
    </Suspense>
  );
}