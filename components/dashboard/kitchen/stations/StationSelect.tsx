"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Grid3X3, Flame, Droplets, Coffee, LayoutDashboard } from "lucide-react";

export const StationSelect: React.FC = () => {
  const router = useRouter();

  const stations = [
    {
      id: "All",
      name: "All Stations",
      description: "View the entire kitchen queue",
      icon: LayoutDashboard,
      color: "text-slate-600",
      bg: "bg-slate-50",
      border: "border-slate-200",
      hover: "hover:border-slate-400 hover:shadow-md",
    },
    {
      id: "Grill Station",
      name: "Grill Station",
      description: "Burgers, Pizzas, and mains",
      icon: Flame,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-200",
      hover: "hover:border-orange-400 hover:shadow-orange-100",
    },
    {
      id: "Fry Station",
      name: "Fry Station",
      description: "Sides and fried items",
      icon: Droplets,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
      hover: "hover:border-amber-400 hover:shadow-amber-100",
    },
    {
      id: "Prep Station",
      name: "Prep Station",
      description: "Drinks and Desserts",
      icon: Coffee,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      hover: "hover:border-blue-400 hover:shadow-blue-100",
    },
  ];

  const handleSelect = (stationId: string) => {
    router.push(`/kitchen/queue?station=${encodeURIComponent(stationId)}`);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto mt-8">
      <div className="text-center space-y-2 mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-slate-100 rounded-2xl mb-4">
          <Grid3X3 className="h-8 w-8 text-slate-700" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 font-sans">
          Select Your Station
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto">
          Choose a station to filter the order queue. You will only see items relevant to your selected station.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {stations.map((station) => {
          const Icon = station.icon;
          return (
            <div
              key={station.id}
              onClick={() => handleSelect(station.id)}
              className={`rounded-3xl border-2 p-6 cursor-pointer transition-all duration-200 bg-white shadow-sm ${station.border} ${station.hover}`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-4 rounded-2xl shrink-0 ${station.bg} ${station.color}`}>
                  <Icon className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    {station.name}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {station.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
