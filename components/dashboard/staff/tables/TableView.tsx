import React from "react";
import { useTables } from "./useTables";
import { TableCard } from "./TableCard";
import { TableStatus } from "../../shared/types/restaurant.types";

export const TableView: React.FC = () => {
  const {
    orders,
    filter,
    setFilter,
    filteredTables,
    handleTableClick,
    calculateSeatedTime,
    getTableCode,
    getStatusColor,
  } = useTables();

  const filters = ["All", "Available", "Seated", "Ordering", "Eating", "Bill Requested", "Dirty"];

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-800 p-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#1E3A5F]">
            OrderNest Staff OS
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
            Table Seating Selection
          </h1>
          <p className="text-xs text-slate-500">
            Seat guests, initiate billing, or fire new kitchen tickets.
          </p>
        </div>

        {/* Legend / Info */}
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition border cursor-pointer ${
                filter === f
                  ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-2xs"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filteredTables.map((table) => {
          const config = getStatusColor(table.status);
          // ✅ Fix: Add || null to handle undefined from Array.find()
          const activeOrd = table.activeOrderId
            ? (orders.find((o) => o.id === table.activeOrderId) || null)
            : null;

          return (
            <TableCard
              key={table.id}
              table={table}
              activeOrder={activeOrd}
              statusColorConfig={config}
              getTableCode={getTableCode}
              calculateSeatedTime={calculateSeatedTime}
              onClick={() => handleTableClick(table.id, table.status)}
            />
          );
        })}
      </div>
    </div>
  );
};
export default TableView;