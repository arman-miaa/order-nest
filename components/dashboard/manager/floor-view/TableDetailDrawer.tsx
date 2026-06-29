import React from "react";
import { HelpCircle, Users, CheckCircle, DollarSign, XCircle } from "lucide-react";
import { Table, Order, TableStatus } from "../../shared/types/restaurant.types";

interface TableDetailDrawerProps {
  selectedTable: Table | null;
  activeOrder: Order | null;
  handleStatusChange: (tableId: number, status: TableStatus) => void;
  getTableCode: (id: number) => string;
  getStatusConfig: (status: TableStatus) => { bg: string; badge: string; indicator: string };
  statusLabels?: Record<string, string>; // ✅ Add this
}

export const TableDetailDrawer: React.FC<TableDetailDrawerProps> = ({
  selectedTable,
  activeOrder,
  handleStatusChange,
  getTableCode,
  getStatusConfig,
  statusLabels = {}, // ✅ Default empty
}) => {
  if (!selectedTable) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm h-full flex flex-col min-h-[480px] justify-center items-center">
        <HelpCircle className="h-12 w-12 text-slate-300 stroke-1 mb-2" />
        <p className="text-sm font-semibold">No Table Selected</p>
        <p className="text-xs text-slate-400 max-w-[200px] mt-1 text-center">
          Click on any table card to view seating details and active order status.
        </p>
      </div>
    );
  }

  const statusConfig = getStatusConfig(selectedTable.status);

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm h-full flex flex-col min-h-[480px] justify-between">
      <div>
        {/* Table Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 font-sans">
              Table {getTableCode(selectedTable.id)}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
              <Users className="h-3 w-3" /> Max Capacity: {selectedTable.capacity} guests
            </p>
          </div>
          <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusConfig.badge}`}>
            {statusLabels[selectedTable.status] || selectedTable.status}
          </span>
        </div>

        {/* Quick Actions */}
        <div className="mt-5 space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Actions</h4>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleStatusChange(selectedTable.id, "AVAILABLE")}
              disabled={selectedTable.status === "AVAILABLE"}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-slate-700 shadow-xs transition hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
              Available
            </button>
            <button
              onClick={() => handleStatusChange(selectedTable.id, "SEATED")}
              disabled={selectedTable.status === "SEATED"}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-slate-700 shadow-xs transition hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
            >
              <Users className="h-3.5 w-3.5 text-blue-500" />
              Seated
            </button>
            <button
              onClick={() => handleStatusChange(selectedTable.id, "BILL_REQUESTED")}
              disabled={selectedTable.status === "BILL_REQUESTED" || selectedTable.status === "AVAILABLE"}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-slate-700 shadow-xs transition hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
            >
              <DollarSign className="h-3.5 w-3.5 text-purple-500" />
              Bill
            </button>
            <button
              onClick={() => handleStatusChange(selectedTable.id, "DIRTY")}
              disabled={selectedTable.status === "DIRTY"}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-slate-700 shadow-xs transition hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
            >
              <XCircle className="h-3.5 w-3.5 text-slate-500" />
              Dirty
            </button>
          </div>
        </div>

        {/* Active Order Details */}
        <div className="mt-6 border-t border-slate-100 pt-6">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Active Order
          </h4>

          {!activeOrder ? (
            <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-500 bg-slate-50/50">
              No active order fired for this table.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase">
                    TICKET #{activeOrder.id?.split("-")[1] || activeOrder.id}
                  </span>
                  <div className="text-xs font-medium text-slate-500 mt-0.5">
                    Ordered:{" "}
                    {new Date(activeOrder.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                  {activeOrder.status}
                </span>
              </div>

              {/* Items list */}
              <div className="rounded-xl border border-slate-150 bg-slate-50/50 divide-y divide-slate-100 max-h-48 overflow-y-auto">
                {activeOrder.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center p-3 text-xs">
                    <div>
                      <span className="font-bold text-slate-800">{item.quantity}x</span>
                      <span className="ml-2 text-slate-700">{item.name}</span>
                      {item.modifiers && item.modifiers.length > 0 && (
                        <span className="block text-[10px] text-slate-400 mt-0.5">
                          + {item.modifiers.join(", ")}
                        </span>
                      )}
                    </div>
                    <span className="font-semibold text-slate-900">
                      ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                <span className="text-sm font-bold text-slate-800">Total Price:</span>
                <span className="text-base font-extrabold text-slate-900">
                  ${(activeOrder.totalPrice || 0).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Clear Table button */}
      {(selectedTable.status === "DIRTY" || selectedTable.status === "BILL_REQUESTED") && (
        <button
          onClick={() => handleStatusChange(selectedTable.id, "AVAILABLE")}
          className="w-full rounded-xl bg-slate-900 py-3 text-xs font-bold text-white shadow-xs transition hover:bg-slate-800 flex items-center justify-center gap-2 mt-6 cursor-pointer"
        >
          <CheckCircle className="h-4 w-4" />
          Reset Table to Available
        </button>
      )}
    </div>
  );
};

export default TableDetailDrawer;