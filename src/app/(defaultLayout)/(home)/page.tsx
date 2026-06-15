import { RestaurantOsOverview } from "@/components/shared/restaurant-os-overview";

export default function HomePage() {
  return (
    <div className="px-4 py-6 md:px-6">
      <RestaurantOsOverview role="manager" />
    </div>
  );
}
