import React from "react";
import { Sparkles, Clock, AlertTriangle, CheckSquare, Square, Flame, ChefHat } from "lucide-react";
import { Order, OrderItem } from "../../shared/types/restaurant.types";

import { StatusControls } from "../status/StatusControls";

interface KitchenCardProps {
  order: Order;
  stationItems: OrderItem[];
  checkedItems: Record<string, boolean>;
  currentTime: Date | null;
  toggleCheck: (orderId: string, idx: number) => void;
  handleAction: (orderId: string, currentStatus: string) => void;
  getTableCode: (id: number) => string;
}

export const KitchenCard: React.FC<KitchenCardProps> = ({
  order,
  stationItems,
  checkedItems,
  currentTime,
  toggleCheck,
  handleAction,
  getTableCode,
}) => {
  const totalItemsCount = stationItems.length;
  const checkedCount = stationItems.filter((_, idx) => checkedItems[`${order.id}-${idx}`]).length;
  const isAllChecked = checkedCount === totalItemsCount;

  // Calculate timer countdown or countup
  const renderTimer = () => {
    if (!currentTime) return "0:00";
    const dueTime = new Date(order.dueAt).getTime();
    const now = currentTime.getTime();
    const diff = dueTime - now;

    const absoluteDiff = Math.abs(diff);
    const minutes = Math.floor(absoluteDiff / 60000);
    const seconds = Math.floor((absoluteDiff % 60000) / 1000);
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    if (diff < 0) {
      return (
        <span className="text-red-600 font-extrabold flex items-center gap-1.5 animate-pulse">
          <AlertTriangle className="h-4 w-4" />
          OVERDUE -{minutes}:{formattedSeconds}
        </span>
      );
    }

    return (
      <span className="text-emerald-600 font-bold flex items-center gap-1">
        <Clock className="h-3.5 w-3.5" />
        {minutes}:{formattedSeconds} left
      </span>
    );
  };

  return (
    <div
      className={`rounded-2xl border bg-slate-50/50 p-5 flex flex-col justify-between h-[360px] relative overflow-hidden transition shadow-2xs hover:shadow-xs ${
        order.isVip ? "border-amber-400 bg-amber-50/5" : "border-slate-200"
      }`}
    >
      {/* VIP Tag */}
      {order.isVip && (
        <div className="absolute right-0 top-0 bg-amber-100 text-amber-800 rounded-bl-xl border-l border-b border-amber-200 px-2.5 py-0.5 text-[8px] font-extrabold uppercase tracking-widest flex items-center gap-1">
          <Sparkles className="h-2.5 w-2.5 text-amber-500" />
          VIP
        </div>
      )}

      {/* Header info */}
      <div>
        <div className="flex justify-between items-start border-b border-slate-200 pb-3 mb-3">
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
              TICKET #{order.id.split("-")[1] || order.id}
            </span>
            <h4 className="font-extrabold text-slate-900 text-base mt-0.5 font-sans">
              Table {getTableCode(order.tableId)}
            </h4>
          </div>
          <span className="text-xs font-semibold uppercase mt-1">
            {renderTimer()}
          </span>
        </div>

        {/* Filtered Items checklist */}
        <div className="space-y-2.5 overflow-y-auto max-h-44 pr-1">
          {stationItems.map((item, idx) => {
            const checkKey = `${order.id}-${idx}`;
            const isChecked = checkedItems[checkKey] || false;

            return (
              <div
                key={idx}
                onClick={() => toggleCheck(order.id, idx)}
                className="flex items-start gap-2.5 cursor-pointer select-none group"
              >
                <div className="mt-0.5 shrink-0">
                  {isChecked ? (
                    <CheckSquare className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Square className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition" />
                  )}
                </div>
                <div>
                  <span
                    className={`text-xs font-bold leading-normal ${
                      isChecked ? "text-slate-400 line-through font-normal" : "text-slate-800"
                    }`}
                  >
                    {item.quantity}x {item.name}
                  </span>
                  {item.modifiers && item.modifiers.length > 0 && (
                    <span
                      className={`block text-[10px] ${
                        isChecked ? "text-slate-400" : "text-slate-500 font-semibold"
                      }`}
                    >
                      + {item.modifiers.join(", ")}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions summary footer */}
      <div className="mt-4 border-t border-slate-200 pt-4">
        <StatusControls
          status={order.status}
          isAllChecked={isAllChecked}
          checkedCount={checkedCount}
          totalItemsCount={totalItemsCount}
          onStartCooking={() => handleAction(order.id, "Queued")}
          onMarkReady={() => handleAction(order.id, "Cooking")}
        />
      </div>
    </div>
  );
};
