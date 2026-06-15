import React from "react";
import { ShoppingCart, Crown, Trash2, Minus, Plus, ChefHat } from "lucide-react";
import { OrderItem } from "../../shared/types/restaurant.types";

interface CartPanelProps {
  cart: OrderItem[];
  isVip: boolean;
  setIsVip: (vip: boolean) => void;
  subtotal: number;
  tax: number;
  total: number;
  removeFromCart: (itemId: string) => void;
  adjustQuantity: (itemId: string, amount: number) => void;
  toggleModifier: (itemId: string, modifier: string) => void;
  handleFireOrder: () => void;
}

export const CartPanel: React.FC<CartPanelProps> = ({
  cart,
  isVip,
  setIsVip,
  subtotal,
  tax,
  total,
  removeFromCart,
  adjustQuantity,
  toggleModifier,
  handleFireOrder,
}) => {
  const availableModifiers = ["Extra Cheese", "Spicy", "No Onions", "Gluten Free", "Large Size"];

  return (
    <div className="w-full lg:w-96 shrink-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between h-[600px] lg:h-[750px]">
      <div>
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-slate-500" />
            <h3 className="font-extrabold text-slate-900 text-lg font-sans">
              Cart Summary
            </h3>
          </div>
          <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-xs font-bold text-slate-600">
            {cart.reduce((sum, i) => sum + i.quantity, 0)} Items
          </span>
        </div>

        {/* VIP Toggle Switch */}
        <div className="rounded-2xl border border-slate-150 bg-slate-50/50 p-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className={`h-4 w-4 ${isVip ? "text-amber-500" : "text-slate-400"}`} />
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                VIP Order
              </span>
              <span className="text-[10px] text-slate-400 font-semibold block">
                Prioritizes ticket in kitchen queue
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsVip(!isVip)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isVip ? "bg-slate-900" : "bg-slate-200"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                isVip ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Cart items list */}
        <div className="space-y-4 overflow-y-auto max-h-[300px] lg:max-h-[420px] pr-1">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400">
              <ShoppingCart className="h-10 w-10 text-slate-200 stroke-1 mb-2" />
              <p className="text-sm font-semibold text-slate-500">Cart is Empty</p>
              <p className="text-xs text-slate-400 max-w-[180px] mt-1">
                Add food or drinks from the catalog menu.
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.itemId}
                className="rounded-2xl border border-slate-150 p-3 bg-slate-50/20 space-y-2.5"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 leading-snug">
                      {item.name}
                    </h5>
                    <span className="text-[10px] text-blue-600 font-black block mt-0.5">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.itemId)}
                    className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Modifiers checklist */}
                <div className="flex flex-wrap gap-1">
                  {availableModifiers.map((mod) => {
                    const active = (item.modifiers || []).includes(mod);
                    return (
                      <button
                        key={mod}
                        onClick={() => toggleModifier(item.itemId, mod)}
                        className={`rounded-lg px-2 py-0.5 text-[9px] font-bold border transition cursor-pointer ${
                          active
                            ? "bg-slate-900 border-slate-900 text-white"
                            : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                        }`}
                      >
                        {mod}
                      </button>
                    );
                  })}
                </div>

                {/* Adjust item count */}
                <div className="flex justify-between items-center border-t border-slate-150/70 pt-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    Quantity
                  </span>
                  <div className="flex items-center gap-2 border border-slate-200 rounded-xl bg-white p-1">
                    <button
                      onClick={() => adjustQuantity(item.itemId, -1)}
                      className="rounded-lg p-1 text-slate-500 hover:bg-slate-50 cursor-pointer"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-xs font-black text-slate-900 px-1 w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => adjustQuantity(item.itemId, 1)}
                      className="rounded-lg p-1 text-slate-500 hover:bg-slate-50 cursor-pointer"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Aggregate checkout */}
      <div className="border-t border-slate-200 pt-4 space-y-4 bg-white mt-auto">
        <div className="space-y-1.5 text-xs font-semibold text-slate-500">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="text-slate-800">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Sales Tax (8%)</span>
            <span className="text-slate-800">${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t border-slate-100 pt-2 text-sm font-black text-slate-900">
            <span>Total</span>
            <span className="text-blue-600">${total.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={handleFireOrder}
          disabled={cart.length === 0}
          className={`w-full rounded-2xl py-3 text-sm font-extrabold text-white shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer ${
            cart.length === 0
              ? "bg-slate-300 opacity-60 cursor-not-allowed"
              : "bg-slate-900 hover:bg-slate-800"
          }`}
        >
          <ChefHat className="h-4 w-4" />
          FIRE KITCHEN TICKET
        </button>
      </div>
    </div>
  );
};
