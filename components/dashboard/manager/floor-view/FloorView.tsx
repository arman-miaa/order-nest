import React from "react";
import { TableStatus } from "../../shared/types/restaurant.types";
import { useFloorManagement } from "./useFloorManagement";
import { TableGrid } from "./TableGrid";
import { TableDetailDrawer } from "./TableDetailDrawer";

export const FloorView: React.FC = () => {
  const {
    tables,
    orders,
    selectedTableId,
    setSelectedTableId,
    selectedTable,
    activeOrder,
    handleStatusChange,
    calculateSeatedTime,
    getTableCode,
    getStatusConfig,
      isLoading,
    isError,
  } = useFloorManagement();
  if (isLoading) {
    return <div className="p-6 text-sm text-slate-500">Loading floor data...</div>;
  }

  if (isError) {
    return <div className="p-6 text-sm text-red-600">Failed to load floor data.</div>;
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Panel */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
            Live Floor Management
          </h1>
          <p className="text-slate-500">Real-time table status monitoring and floor control.</p>
        </div>

        {/* Status Legend */}
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-xs">
          {(
            ["Available", "Seated", "Ordering", "Eating", "Bill Requested", "Dirty"] as TableStatus[]
          ).map((status) => {
            const config = getStatusConfig(status);
            return (
              <div key={status} className="flex items-center gap-1.5 px-1.5">
                <span className={`h-2.5 w-2.5 rounded-full ${config.indicator}`} />
                <span className="text-xs font-semibold text-slate-600">{status}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.75fr] xl:grid-cols-[1.7fr_0.7fr]">
        {/* Floor Map Table Grid */}
        <TableGrid
          tables={tables}
          orders={orders}
          selectedTableId={selectedTableId}
          setSelectedTableId={setSelectedTableId}
          getStatusConfig={getStatusConfig}
          getTableCode={getTableCode}
          calculateSeatedTime={calculateSeatedTime}
        />

        {/* Sidebar Info Drawer */}
        <div className="space-y-6">
          <TableDetailDrawer
            selectedTable={selectedTable || null}
            activeOrder={activeOrder || null}
            handleStatusChange={handleStatusChange}
            getTableCode={getTableCode}
            getStatusConfig={getStatusConfig}
          />
        </div>
      </div>
    </div>
  );
};
export default FloorView;
