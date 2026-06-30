import React from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { useTables } from "./useTables";
import { TableCard } from "./TableCard";

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
    isLoading,
    isError,
    refetch,
  } = useTables();

  const filters = [
    { key: "All", label: "All" },
    { key: "AVAILABLE", label: "Available" },
    { key: "SEATED", label: "Seated" },
    { key: "ORDERING", label: "Ordering" },
    { key: "EATING", label: "Eating" },
    { key: "BILL_REQUESTED", label: "Bill Requested" },
    { key: "DIRTY", label: "Dirty" },
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-800 p-6 space-y-6">
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

        <div className="flex flex-wrap items-center gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition border cursor-pointer ${
                filter === f.key
                  ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-2xs"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-white py-20 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading tables...
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-100 bg-white py-16 text-center">
          <p className="text-sm font-semibold text-red-600">Failed to load tables.</p>
          <button
            onClick={() => refetch()}
            className="mx-auto mt-4 flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </button>
        </div>
      ) : filteredTables.length === 0 ? (
        <div className="rounded-2xl border border-slate-100 bg-white py-16 text-center text-sm text-slate-500">
          No tables found for this filter.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filteredTables.map((table, index) => {
            const config = getStatusColor(table.status);

            // ✅ Use string key for React key prop
            const keyId = String(table.id ?? table._id ?? index);
            
            // ✅ Convert to number for function calls
            const tableId = Number(table.id) || (index + 1);

            const activeOrd = table.activeOrderId
              ? (orders.find((o) => o.id === table.activeOrderId) || null)
              : null;

            return (
              <TableCard
                key={keyId}
                table={table}  // ✅ Keep original table (no override needed)
                activeOrder={activeOrd}
                statusColorConfig={config}
                getTableCode={getTableCode}
                calculateSeatedTime={calculateSeatedTime}
                onClick={() => handleTableClick(tableId, table.status)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TableView;