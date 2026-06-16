/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// 12 মাসের sample data
const monthlyData = [
  { month: "Jan", revenue: 2400, orders: 120 },
  { month: "Feb", revenue: 1398, orders: 90 },
  { month: "Mar", revenue: 9800, orders: 250 },
  { month: "Apr", revenue: 3908, orders: 180 },
  { month: "May", revenue: 4800, orders: 210 },
  { month: "Jun", revenue: 3800, orders: 170 },
  { month: "Jul", revenue: 4300, orders: 195 },
  { month: "Aug", revenue: 5200, orders: 230 },
  { month: "Sep", revenue: 6100, orders: 260 },
  { month: "Oct", revenue: 4500, orders: 200 },
  { month: "Nov", revenue: 7200, orders: 290 },
  { month: "Dec", revenue: 8500, orders: 330 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
        <p className="text-sm font-bold text-slate-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-slate-600 capitalize">{entry.name}:</span>
            <span className="font-bold text-slate-900">
              {entry.name === "revenue" ? "$" : ""}
              {entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const RevenueChart: React.FC = () => {
  return (
    <div className="lg:col-span-2">
      {/* Monthly Revenue Area Chart */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-sans">
              Monthly Revenue Overview
            </h2>
            <p className="text-xs text-slate-500">
              12-month revenue & order tracking
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#dd734a]" />
              <span className="text-xs font-medium text-slate-600">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#82ca9d]" />
              <span className="text-xs font-medium text-slate-600">Orders</span>
            </div>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={monthlyData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#dd734a" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#dd734a" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#f1f5f9" 
                vertical={false} 
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#94a3b8", fontWeight: 500 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#94a3b8", fontWeight: 500 }}
                tickFormatter={(value) =>
                  value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value
                }
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#dd734a"
                strokeWidth={2.5}
                fill="url(#colorRevenue)"
                name="revenue"
                dot={false}
                activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
              />
              <Area
                type="monotone"
                dataKey="orders"
                stroke="#82ca9d"
                strokeWidth={2.5}
                fill="url(#colorOrders)"
                name="orders"
                dot={false}
                activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;