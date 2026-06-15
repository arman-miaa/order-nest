import React from "react";

export const RevenueChart: React.FC = () => {
  const hourlyData = [
    { hour: "11 AM", orders: 12 },
    { hour: "1 PM", orders: 28 },
    { hour: "3 PM", orders: 15 },
    { hour: "5 PM", orders: 32 },
    { hour: "7 PM", orders: 48 },
    { hour: "9 PM", orders: 22 },
  ];

  const categoryData = [
    { category: "Burgers", percentage: 42, color: "bg-emerald-500" },
    { category: "Pizzas", percentage: 30, color: "bg-blue-500" },
    { category: "Sides", percentage: 15, color: "bg-orange-500" },
    { category: "Drinks", percentage: 8, color: "bg-purple-500" },
    { category: "Desserts", percentage: 5, color: "bg-pink-500" },
  ];

  return (
    <div className="space-y-6 lg:col-span-2">
      {/* Hourly Orders Custom SVG Chart */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-sans">
              Hourly Order Volume
            </h2>
            <p className="text-xs text-slate-500">Peak hour tracking (orders count)</p>
          </div>
          <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-650">
            Live
          </span>
        </div>

        <div className="mt-6 flex h-60 items-end justify-between px-2 pt-4">
          {hourlyData.map((data, idx) => {
            const heightPercentage = Math.round((data.orders / 50) * 100);
            return (
              <div key={idx} className="flex flex-col items-center gap-2 w-1/6">
                <span className="text-xs font-bold text-slate-700">{data.orders}</span>
                <div className="relative w-10 sm:w-12 rounded-t-lg bg-slate-100 h-44 flex items-end">
                  <div
                    className="w-full rounded-t-lg bg-linear-to-t from-slate-900 to-slate-700 hover:opacity-90 transition-all duration-500"
                    style={{ height: `${heightPercentage}%` }}
                  />
                </div>
                <span className="text-[10px] sm:text-xs font-medium text-slate-500">
                  {data.hour}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Breakdown Custom Visual representation */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 font-sans">Order Breakdown</h2>
        <p className="text-xs text-slate-500 mb-6">
          Percentage of total items ordered by category
        </p>

        <div className="space-y-4">
          {categoryData.map((data) => (
            <div key={data.category} className="space-y-1">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span className="text-slate-700">{data.category}</span>
                <span className="text-slate-900">{data.percentage}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${data.color}`}
                  style={{ width: `${data.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default RevenueChart;
