import React from "react";
import { Search, Clock, Sparkles, ArrowRight, CheckCircle } from "lucide-react";
import { useManagerOrders } from "./useManagerOrders";
import { OrderDetailPanel } from "./OrderDetailPanel";

export const OrderTable: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    filterMode,
    setFilterMode,
    selectedOrderId,
    setSelectedOrderId,
    selectedOrder,
    filteredOrders,
    handleAdvanceStatus,
    getStatusColor,
    getMinutesElapsed,
    getTableCode,
  } = useManagerOrders();

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Panel */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
            Order Management
          </h1>
          <p className="text-slate-500">
            Live order control center, history tracking, and manual status overrides.
          </p>
        </div>
      </div>

      {/* Filters, Search and Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ticket ID or Table number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-slate-400 shadow-3xs"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {(["active", "completed", "vip", "all"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterMode(tab)}
              className={`rounded-xl px-4 py-2.5 text-xs font-bold transition border capitalize shadow-2xs cursor-pointer ${
                filterMode === tab
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tab} Orders
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Order table & Side details */}
      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.75fr] xl:grid-cols-[1.7fr_0.7fr]">
        {/* Table list */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-150 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 font-semibold">Order ID</th>
                <th className="pb-3 font-semibold">Table</th>
                <th className="pb-3 font-semibold">Elapsed</th>
                <th className="pb-3 font-semibold">Items</th>
                <th className="pb-3 font-semibold">Total</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-sm text-slate-400">
                    No orders found for this filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const elapsed = getMinutesElapsed(order.createdAt);
                  const isOverdue =
                    elapsed > 15 &&
                    order.status !== "Ready" &&
                    order.status !== "Served" &&
                    order.status !== "Cleared";

                  return (
                    <tr
                      key={order.id}
                      className={`hover:bg-slate-50/50 cursor-pointer ${
                        selectedOrderId === order.id ? "bg-slate-50" : ""
                      } ${isOverdue ? "bg-red-50/10" : ""}`}
                      onClick={() => setSelectedOrderId(order.id)}
                    >
                      <td className="py-4 font-bold text-slate-900 text-sm">
                        <div className="flex items-center gap-1">
                          #{order.id.split("-")[1] || order.id}
                          {order.isVip && <Sparkles className="h-3.5 w-3.5 text-amber-500" />}
                        </div>
                      </td>
                      <td className="py-4 font-bold text-slate-800 text-sm">
                        Table {getTableCode(order.tableId)}
                      </td>
                      <td className="py-4 text-xs font-semibold text-slate-500">
                        <span className={`flex items-center gap-1 ${isOverdue ? "text-red-600 animate-pulse" : ""}`}>
                          <Clock className="h-3.5 w-3.5" />
                          {elapsed} min
                        </span>
                      </td>
                      <td className="py-4 pr-3 max-w-[220px]">
                        <span className="text-xs text-slate-600 line-clamp-1">
                          {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                        </span>
                      </td>
                      <td className="py-4 font-extrabold text-slate-900 text-sm">
                        ${order.totalPrice.toFixed(2)}
                      </td>
                      <td className="py-4 text-xs font-bold">
                        <span className={`rounded-full border px-2.5 py-0.5 ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 text-xs" onClick={(e) => e.stopPropagation()}>
                        {order.status !== "Cleared" ? (
                          <button
                            onClick={() => handleAdvanceStatus(order.id)}
                            className="flex items-center gap-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 font-bold transition shadow-3xs cursor-pointer"
                          >
                            {order.status === "Queued" && "Cook"}
                            {order.status === "Cooking" && "Ready"}
                            {order.status === "Ready" && "Serve"}
                            {order.status === "Served" && "Clear"}
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        ) : (
                          <span className="text-slate-400 font-semibold flex items-center gap-1">
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> Finished
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Side Panel Drawer */}
        <div>
          <OrderDetailPanel
            selectedOrder={selectedOrder || null}
            getStatusColor={getStatusColor}
            getTableCode={getTableCode}
            handleAdvanceStatus={handleAdvanceStatus}
          />
        </div>
      </div>
    </div>
  );
};
export default OrderTable;
