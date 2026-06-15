import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
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
  } = useOrderBuilder();

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-800 p-6 flex flex-col gap-6">
      {/* Top Banner */}
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

        {/* Selected Table Selector */}
        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-2xs">
          <span className="text-xs font-bold text-slate-400">TABLE</span>
          <select
            value={selectedTableId}
            onChange={(e) => setSelectedTableId(parseInt(e.target.value))}
            className="bg-transparent text-sm font-extrabold text-slate-900 outline-none cursor-pointer border-none"
          >
            {tables.map((t) => (
              <option
                key={t.id}
                value={t.id}
                className="bg-white text-slate-900 font-bold"
              >
                {t.id < 10 ? `T0${t.id}` : `T${t.id}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Split Panels */}
      <div className="flex flex-col gap-6 lg:flex-row items-start">
        {/* Left Side: Items grid */}
        <MenuGrid
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          filteredItems={filteredItems}
          addToCart={addToCart}
        />

        {/* Right Side: Cart panel summary */}
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
    </div>
  );
};
export default OrderForm;
