import React from "react";
import { Coffee, Loader2, RefreshCw } from "lucide-react";
import { useOrders } from "./useOrders";
import { OrderCard } from "./OrderCard";

export const OrderList: React.FC = () => {
  const {
    handleAdvanceStatus,
    getMinutesElapsed,
    getOrdersByStatus,
    getColumnColor,
    getTableCode,
    isLoading,
    isError,
    refetch,
  } = useOrders();

  const activeStates = ["Queued", "Cooking", "Ready", "Served"];

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-800 p-6 space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#1E3A5F]">
          OrderNest Staff OS
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-1 font-sans">
          Active Orders Feed
        </h1>
        <p className="text-xs text-slate-500">
          Track preparation stages and serve ready items to dining tables.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-white py-20 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading orders...
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-100 bg-white py-16 text-center">
          <p className="text-sm font-semibold text-red-600">Failed to load orders.</p>
          <button
            onClick={() => refetch()}
            className="mx-auto mt-4 flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 items-start">
          {activeStates.map((status) => {
            const columnOrders = getOrdersByStatus(status);

            return (
              <div
                key={status}
                className={`rounded-3xl border p-5 flex flex-col min-h-[500px] bg-white shadow-2xs ${getColumnColor(
                  status
                )}`}
              >
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                  <span className="text-sm font-extrabold text-slate-700 tracking-wider uppercase">
                    {status}
                  </span>
                  <span className="rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-xs font-bold text-slate-600">
                    {columnOrders.length}
                  </span>
                </div>

                <div className="space-y-4 overflow-y-auto flex-1 max-h-[600px] pr-1">
                  {columnOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400">
                      <Coffee className="h-8 w-8 opacity-20 mb-2" />
                      <span className="text-xs font-bold uppercase tracking-wider">Empty Column</span>
                    </div>
                  ) : (
                    columnOrders.map((order) => {
                      const elapsed = getMinutesElapsed(order.createdAt);
                      const isOverdue =
                        elapsed > 15 && status !== "Ready" && status !== "Served";

                      return (
                        <OrderCard
                          key={order.id}
                          order={order}
                          elapsed={elapsed}
                          isOverdue={isOverdue}
                          getTableCode={getTableCode}
                          onAdvance={() => handleAdvanceStatus(order.id, status)}
                        />
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default OrderList;