import React from "react";
import { HelpCircle, ArrowRight, CheckCircle } from "lucide-react";
import { Order } from "../../shared/types/restaurant.types";

interface OrderDetailPanelProps {
  selectedOrder: Order | null;
  getStatusColor: (status: string) => string;
  getTableCode: (id: number) => string;
  handleAdvanceStatus: (orderId: string) => void;
}

export const OrderDetailPanel: React.FC<OrderDetailPanelProps> = ({
  selectedOrder,
  getStatusColor,
  getTableCode,
  handleAdvanceStatus,
}) => {
  if (!selectedOrder) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm h-full flex flex-col min-h-[480px] justify-center items-center text-center text-slate-400">
        <HelpCircle className="h-12 w-12 text-slate-300 stroke-1 mb-2" />
        <p className="text-sm font-semibold">Select an Order</p>
        <p className="text-xs text-slate-400 max-w-[200px] mt-1">
          Click on any order ticket row to view full items breakdown and action overrides.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm h-full flex flex-col min-h-[480px] justify-between">
      <div>
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Table {getTableCode(selectedOrder.tableId)}
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 mt-0.5 font-sans">
              Ticket #{selectedOrder.id}
            </h3>
          </div>
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${getStatusColor(selectedOrder.status)}`}>
            {selectedOrder.status}
          </span>
        </div>

        {/* Body Details */}
        <div className="mt-5 space-y-4 text-xs">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Items List
            </span>
            <div className="rounded-xl border border-slate-150 bg-slate-50/50 divide-y divide-slate-100 max-h-48 overflow-y-auto">
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3">
                  <div>
                    <span className="font-bold text-slate-800">{item.quantity}x</span>
                    <span className="ml-2 text-slate-700">{item.name}</span>
                    {item.modifiers && item.modifiers.length > 0 && (
                      <span className="block text-[9px] text-slate-400 mt-0.5">
                        + {item.modifiers.join(", ")}
                      </span>
                    )}
                  </div>
                  <span className="font-semibold text-slate-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-slate-100 pt-3">
            <span className="text-sm font-bold text-slate-850">Total Bill Amount:</span>
            <span className="text-base font-extrabold text-slate-900">
              ${selectedOrder.totalPrice.toFixed(2)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Fired Time
              </span>
              <span className="font-semibold text-slate-800 text-xs mt-1 block">
                {new Date(selectedOrder.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Estimated Due
              </span>
              <span className="font-semibold text-slate-800 text-xs mt-1 block">
                {new Date(selectedOrder.dueAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Overrides */}
      {selectedOrder.status !== "Cleared" && (
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Manager Override Control
          </span>
          <button
            onClick={() => handleAdvanceStatus(selectedOrder.id)}
            className="w-full rounded-xl bg-slate-900 py-3 text-xs font-bold text-white shadow-xs transition hover:bg-slate-800 flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowRight className="h-4 w-4" />
            Force Progress State
          </button>
        </div>
      )}
    </div>
  );
};
export default OrderDetailPanel;
