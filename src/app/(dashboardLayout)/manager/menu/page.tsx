"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toggleMenuItemStock, editMenuItemPrice, MenuItem } from "@/redux/features/restaurantSlice";
import { 
  Search, 
  Filter, 
  Edit, 
  Check, 
  X,
  AlertTriangle,
  Flame,
  Plus
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ManagerMenuPage() {
  const dispatch = useAppDispatch();
  const menuItems = useAppSelector((state) => state.restaurant.menuItems);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editPriceValue, setEditPriceValue] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Filter menu items
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleToggleStock = (itemId: string, name: string, currentlyInStock: boolean) => {
    dispatch(toggleMenuItemStock({ itemId }));
    if (currentlyInStock) {
      toast.warning(`"${name}" is now marked as 86 (Out of Stock). Staff cannot order it.`);
    } else {
      toast.success(`"${name}" is back in stock.`);
    }
  };

  const handleStartEditPrice = (item: MenuItem) => {
    setEditingItemId(item.id);
    setEditPriceValue(item.price.toString());
  };

  const handleSavePrice = (itemId: string) => {
    const parsedPrice = parseFloat(editPriceValue);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      toast.error("Please enter a valid price");
      return;
    }
    dispatch(editMenuItemPrice({ itemId, newPrice: parsedPrice }));
    setEditingItemId(null);
    toast.success("Price updated successfully");
  };

  const categories = ["All", "Burgers", "Pizzas", "Sides", "Drinks", "Desserts"];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Panel */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Menu Management</h1>
          <p className="text-slate-500">Manage items catalog, pricing, and 86-item out-of-stock toggles.</p>
        </div>
      </div>

      {/* Filters & Search Row */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search items by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-slate-400"
          />
        </div>

        {/* Categories Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition shadow-xs ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.75fr] xl:grid-cols-[1.7fr_0.7fr]">
        {/* Menu Items Table */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 font-semibold">Item Info</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Price</th>
                <th className="pb-3 font-semibold">Prep Time</th>
                <th className="pb-3 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => (
                <tr 
                  key={item.id} 
                  className={`hover:bg-slate-50/50 cursor-pointer ${selectedItem?.id === item.id ? "bg-slate-50" : ""}`}
                  onClick={() => setSelectedItem(item)}
                >
                  <td className="py-4 pr-3 max-w-[300px]">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 text-sm">{item.name}</span>
                      <span className="text-xs text-slate-500 line-clamp-1 mt-0.5">{item.description}</span>
                    </div>
                  </td>
                  <td className="py-4 text-xs font-semibold text-slate-600">{item.category}</td>
                  
                  {/* Editable Price cell */}
                  <td className="py-4 text-sm" onClick={(e) => e.stopPropagation()}>
                    {editingItemId === item.id ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500 font-medium">$</span>
                        <input
                          type="text"
                          value={editPriceValue}
                          onChange={(e) => setEditPriceValue(e.target.value)}
                          className="w-16 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-400"
                        />
                        <button
                          onClick={() => handleSavePrice(item.id)}
                          className="rounded-lg bg-emerald-500 p-1 text-white hover:bg-emerald-600"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingItemId(null)}
                          className="rounded-lg bg-slate-200 p-1 text-slate-600 hover:bg-slate-300"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 font-bold text-slate-900 group">
                        <span>${item.price.toFixed(2)}</span>
                        <button
                          onClick={() => handleStartEditPrice(item)}
                          className="rounded-md p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition"
                        >
                          <Edit className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </td>
                  
                  <td className="py-4 text-xs font-semibold text-slate-600">
                    <span className="flex items-center gap-1">
                      <Flame className="h-3.5 w-3.5 text-amber-500" />
                      {item.prepTime} min
                    </span>
                  </td>
                  
                  <td className="py-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => handleToggleStock(item.id, item.name, item.inStock)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          item.inStock ? "bg-slate-900" : "bg-slate-200"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                            item.inStock ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                      <span className={`text-[10px] font-bold ml-2 uppercase w-14 text-left ${
                        item.inStock ? "text-emerald-600" : "text-red-500 font-bold"
                      }`}>
                        {item.inStock ? "In Stock" : "86 Item"}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Item Edit Sidebar */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm h-full flex flex-col min-h-[480px]">
            {!selectedItem ? (
              <div className="flex flex-col items-center justify-center flex-1 text-center text-slate-400 py-12">
                <AlertTriangle className="h-12 w-12 text-slate-300 stroke-1 mb-2" />
                <p className="text-sm font-semibold">Select an Item</p>
                <p className="text-xs text-slate-400 max-w-[200px] mt-1">
                  Click on any menu item row to view item descriptions, specs, and details.
                </p>
              </div>
            ) : (
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                <div>
                  {/* Header */}
                  <div className="border-b border-slate-100 pb-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedItem.category}</span>
                    <h3 className="text-xl font-extrabold text-slate-900 mt-1">{selectedItem.name}</h3>
                  </div>

                  {/* Details content */}
                  <div className="mt-5 space-y-4 text-sm">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Description</span>
                      <p className="text-slate-600 mt-1 leading-relaxed">{selectedItem.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Item ID</span>
                        <span className="font-semibold text-slate-800 uppercase text-xs mt-1 block">{selectedItem.id}</span>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Est. Prep Time</span>
                        <span className="font-semibold text-slate-800 text-xs mt-1 block">{selectedItem.prepTime} minutes</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Current Pricing</span>
                      <span className="text-2xl font-extrabold text-slate-950 mt-1 block">${selectedItem.price.toFixed(2)}</span>
                    </div>

                    <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Stock Status</span>
                        <span className={`text-xs font-bold mt-1 block ${selectedItem.inStock ? "text-emerald-600" : "text-red-500"}`}>
                          {selectedItem.inStock ? "Currently Available" : "Out of Stock (86)"}
                        </span>
                      </div>
                      <button
                        onClick={() => handleToggleStock(selectedItem.id, selectedItem.name, selectedItem.inStock)}
                        className={`rounded-xl px-4 py-2 text-xs font-bold text-white transition ${
                          selectedItem.inStock ? "bg-red-500 hover:bg-red-600" : "bg-emerald-600 hover:bg-emerald-700"
                        }`}
                      >
                        {selectedItem.inStock ? "86 Out of Stock" : "Put In Stock"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-dashed border-slate-200 p-4 text-[11px] leading-relaxed text-slate-500 bg-slate-50/50 mt-6">
                  <strong>Manager Tip:</strong> Toggling an item to "86" blocks it in real-time from the staff tablet order screen to prevent ordering unavailable items.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}