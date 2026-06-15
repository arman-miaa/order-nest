"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fireOrder, OrderItem, MenuItem } from "@/redux/features/restaurantSlice";
import { 
  Search, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft,
  Crown,
  ChefHat
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function StaffNewOrderPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialTableId = searchParams.get("tableId") 
    ? parseInt(searchParams.get("tableId")!) 
    : 1;

  const { tables, menuItems } = useAppSelector((state) => state.restaurant);
  
  const [selectedTableId, setSelectedTableId] = useState<number>(initialTableId);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isVip, setIsVip] = useState(false);

  // Filter menu items
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (item: MenuItem) => {
    if (!item.inStock) {
      toast.error(`"${item.name}" is currently 86 (Out of Stock)!`);
      return;
    }
    
    const existingIndex = cart.findIndex((cartItem) => cartItem.itemId === item.id);
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      setCart(updated);
    } else {
      setCart([...cart, {
        itemId: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        modifiers: [],
      }]);
    }
    toast.success(`Added ${item.name} to cart`);
  };

  const removeFromCart = (itemId: string) => {
    const updated = cart.filter((item) => item.itemId !== itemId);
    setCart(updated);
  };

  const adjustQuantity = (itemId: string, amount: number) => {
    const existingIndex = cart.findIndex((item) => item.itemId === itemId);
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += amount;
      if (updated[existingIndex].quantity <= 0) {
        removeFromCart(itemId);
      } else {
        setCart(updated);
      }
    }
  };

  const toggleModifier = (itemId: string, modifier: string) => {
    const existingIndex = cart.findIndex((item) => item.itemId === itemId);
    if (existingIndex > -1) {
      const updated = [...cart];
      const modifiers = updated[existingIndex].modifiers || [];
      if (modifiers.includes(modifier)) {
        updated[existingIndex].modifiers = modifiers.filter((m) => m !== modifier);
      } else {
        updated[existingIndex].modifiers = [...modifiers, modifier];
      }
      setCart(updated);
    }
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleFireOrder = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty!");
      return;
    }
    dispatch(fireOrder({
      tableId: selectedTableId,
      items: cart,
      isVip,
    }));
    toast.success(`Order fired to the kitchen for Table ${selectedTableId}!`);
    router.push("/staff/tables");
  };

  const getTableCode = (id: number) => {
    return id < 10 ? `T0${id}` : `T${id}`;
  };

  const categories = ["All", "Burgers", "Pizzas", "Sides", "Drinks", "Desserts"];
  const availableModifiers = ["Extra Cheese", "Spicy", "No Onions", "Gluten Free", "Large Size"];

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-800 p-6 flex flex-col gap-6">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push("/staff/tables")}
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 hover:text-slate-800 shadow-2xs transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Order Builder</h1>
            <p className="text-xs text-slate-500">Select items, apply modifiers, and fire ticket to kitchen.</p>
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
              <option key={t.id} value={t.id} className="bg-white text-slate-900 font-bold">
                {getTableCode(t.id)} ({t.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main layout grid */}
      <div className="grid gap-6 lg:grid-cols-3 flex-1 items-start">
        {/* Left Side: Catalog Items */}
        <div className="space-y-6 lg:col-span-2">
          {/* Search and Categories row */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search food items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm outline-none transition focus:border-slate-400"
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition shadow-2xs ${
                    selectedCategory === cat
                      ? "bg-slate-900 text-white border border-slate-900"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Items Grid */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item) => (
              <div 
                key={item.id}
                className={`rounded-2xl border bg-white p-4 flex flex-col justify-between h-44 shadow-xs transition ${
                  item.inStock 
                    ? "border-slate-150 hover:border-slate-350 hover:shadow-sm" 
                    : "border-red-100 bg-red-50/10 opacity-60"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.category}</span>
                    {!item.inStock && (
                      <span className="rounded-lg bg-red-100 border border-red-200 px-2 py-0.5 text-[9px] font-bold text-red-700 uppercase tracking-wide">
                        86 Item
                      </span>
                    )}
                  </div>
                  <h3 className="font-extrabold text-slate-950 text-sm mt-1">{item.name}</h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-sm font-extrabold text-slate-900">${item.price.toFixed(2)}</span>
                  <button
                    onClick={() => addToCart(item)}
                    disabled={!item.inStock}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition disabled:opacity-50 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200"
                  >
                    <Plus className="h-3 w-3" />
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Cart Summary Panel */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col h-[580px]">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-blue-500" />
              <h2 className="text-lg font-bold text-slate-900">Cart Summary</h2>
            </div>
            <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-xs font-bold text-slate-600">
              {cart.reduce((sum, item) => sum + item.quantity, 0)} items
            </span>
          </div>

          {/* Cart Items List */}
          <div className="mt-4 flex-1 overflow-y-auto space-y-4 pr-1">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
                <ShoppingCart className="h-10 w-10 text-slate-200 stroke-1 mb-2" />
                <p className="text-sm font-semibold text-slate-500">Order is Empty</p>
                <p className="text-xs text-slate-400 max-w-[180px] mt-1">
                  Add items from the menu to build a kitchen ticket.
                </p>
              </div>
            ) : (
              cart.map((cartItem) => (
                <div key={cartItem.itemId} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-xs">{cartItem.name}</h4>
                      <span className="text-[10px] text-slate-400 font-semibold">${cartItem.price.toFixed(2)} each</span>
                    </div>
                    
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => adjustQuantity(cartItem.itemId, -1)}
                        className="rounded-lg bg-slate-100 border border-slate-250 hover:bg-slate-200 p-1 transition"
                      >
                        <Minus className="h-3 w-3 text-slate-600" />
                      </button>
                      <span className="text-xs font-extrabold text-slate-900 w-4 text-center">{cartItem.quantity}</span>
                      <button
                        onClick={() => adjustQuantity(cartItem.itemId, 1)}
                        className="rounded-lg bg-slate-100 border border-slate-250 hover:bg-slate-200 p-1 transition"
                      >
                        <Plus className="h-3 w-3 text-slate-600" />
                      </button>
                      <button
                        onClick={() => removeFromCart(cartItem.itemId)}
                        className="rounded-lg bg-red-50 border border-red-100 p-1 text-red-500 hover:bg-red-100/70 ml-1.5 transition"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Modifiers checklist */}
                  <div className="flex flex-wrap gap-1.5 pt-1.5">
                    {availableModifiers.map((mod) => {
                      const isSelected = cartItem.modifiers?.includes(mod);
                      return (
                        <button
                          key={mod}
                          onClick={() => toggleModifier(cartItem.itemId, mod)}
                          className={`rounded-lg px-2.5 py-0.5 text-[9px] font-bold border transition ${
                            isSelected 
                              ? "bg-blue-600 border-blue-600 text-white" 
                              : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                          }`}
                        >
                          {mod}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pricing & Firing Summary */}
          {cart.length > 0 && (
            <div className="border-t border-slate-100 pt-4 space-y-4">
              {/* VIP Priority Toggle */}
              <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 p-3">
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-amber-500" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">VIP Priority Alert</span>
                    <span className="text-[9px] text-slate-400 block">Flag ticket for faster prep</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsVip(!isVip)}
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isVip ? "bg-amber-500" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      isVip ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Bill Details */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-800">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Tax (8%):</span>
                  <span className="font-semibold text-slate-800">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-100 pt-2">
                  <span>Total Amount:</span>
                  <span className="text-base font-extrabold text-blue-600">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Fire Button */}
              <button
                onClick={handleFireOrder}
                className="w-full rounded-2xl bg-blue-600 hover:bg-blue-500 py-3.5 text-sm font-bold text-white shadow-md transition flex items-center justify-center gap-2"
              >
                <ChefHat className="h-4 w-4" />
                Fire Order to Kitchen
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}