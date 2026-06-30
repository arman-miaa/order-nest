import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, RefreshCw } from "lucide-react";
import { useOrderBuilder } from "./useOrderBuilder";
import { MenuGrid } from "./MenuGrid";
import { CartPanel } from "./CartPanel";

export const OrderForm: React.FC = () => {
  const router = useRouter();
  const {
    tables,
    selectedTableId,
    setSelectedTableId,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    cart,
    isVip,
    setIsVip,
    filteredItems,
    addToCart,
    removeFromCart,
    adjustQuantity,
    toggleModifier,
    subtotal,
    tax,
    total,
    handleFireOrder,
    isLoading,
    isError,
    refetch,
  } = useOrderBuilder();

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-800 p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/staff/tables")}
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 hover:text-slate-800 shadow-2xs transition hover:bg-slate-50 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 font-sans">
              Order Builder
            </h1>
            <p className="text-xs text-slate-500">
              Select items, apply modifiers, and fire ticket to kitchen.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-2xs">
          <span className="text-xs font-bold text-slate-400">TABLE</span>
    <select
  value={selectedTableId}
  onChange={(e) => setSelectedTableId(parseInt(e.target.value))}
  className="bg-transparent text-sm font-extrabold text-slate-900 outline-none cursor-pointer border-none"
  disabled={isLoading || tables.length === 0}
>
  {tables.map((t, index) => {
    // ✅ Ensure numeric ID
    const tableId = typeof t.id === 'number' ? t.id : Number(t.id) || (index + 1);
    return (
      <option
        key={tableId}
        value={tableId}
        className="bg-white text-slate-900 font-bold"
      >
        {tableId < 10 ? `T0${tableId}` : `T${tableId}`}
      </option>
    );
  })}
</select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-white py-20 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading order data...
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-100 bg-white py-16 text-center">
          <p className="text-sm font-semibold text-red-600">Failed to load tables or menu items.</p>
          <button
            onClick={() => refetch()}
            className="mx-auto mt-4 flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6 lg:flex-row items-start">
          <MenuGrid
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            filteredItems={filteredItems}
            addToCart={addToCart}
          />

          <CartPanel
            cart={cart}
            isVip={isVip}
            setIsVip={setIsVip}
            subtotal={subtotal}
            tax={tax}
            total={total}
            removeFromCart={removeFromCart}
            adjustQuantity={adjustQuantity}
            toggleModifier={toggleModifier}
            handleFireOrder={handleFireOrder}
          />
        </div>
      )}
    </div>
  );
};
export default OrderForm;