import React from "react";
import { CheckCircle2 } from "lucide-react";
import { useKitchenOrders } from "./useKitchenOrders";
import { KitchenCard } from "./KitchenCard";

export const OrderQueue: React.FC = () => {
  const {
    selectedStation,
    setSelectedStation,
    checkedItems,
    currentTime,
    getFilteredItems,
    kitchenOrders,
    handleAction,
    toggleCheck,
    getTableCode,
  } = useKitchenOrders();

  const stations = ["All", "Grill Station", "Fry Station", "Prep Station"];

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-800 p-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#1E3A5F]">
            OrderNest Kitchen OS
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1 font-sans">
            Kitchen Main Board
          </h1>
          <p className="text-xs text-slate-500">
            Urgency-sorted orders, station item filtering, and checklist controls.
          </p>
        </div>

        {/* Station Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {stations.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStation(st)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition border cursor-pointer ${
                selectedStation === st
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                  : "bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-2xs"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Board container */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm min-h-[480px] flex flex-col justify-center">
        {kitchenOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center text-slate-400 py-16">
            <CheckCircle2 className="h-12 w-12 text-slate-200 stroke-1 mb-3 animate-pulse" />
            <p className="text-sm font-semibold text-slate-500">Queue is Clear</p>
            <p className="text-xs text-slate-400 max-w-[200px] mt-1">
              No active tickets for the {selectedStation === "All" ? "kitchen" : selectedStation}.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-start">
            {kitchenOrders.map((order) => {
              const stationItems = getFilteredItems(order);

              return (
                <KitchenCard
                  key={order.id}
                  order={order}
                  stationItems={stationItems}
                  checkedItems={checkedItems}
                  currentTime={currentTime}
                  toggleCheck={toggleCheck}
                  handleAction={handleAction}
                  getTableCode={getTableCode}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
export default OrderQueue;
