import React from "react";
import { Search, Plus } from "lucide-react";
import { MenuItem } from "../../shared/types/restaurant.types";

interface MenuGridProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  filteredItems: MenuItem[];
  addToCart: (item: MenuItem) => void;
}

export const MenuGrid: React.FC<MenuGridProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  filteredItems,
  addToCart,
}) => {
  const categories = ["All", "Burgers", "Pizzas", "Sides", "Drinks", "Desserts"];

  return (
    <div className="flex flex-col gap-5 flex-1 min-w-0">
      {/* Search and Categories bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search food, drinks, sides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-sm outline-none transition focus:border-slate-400 shadow-2xs text-slate-800"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition border cursor-pointer ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-2xs"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu list Grid */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 overflow-y-auto max-h-[680px] pr-1">
        {filteredItems.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400">
            No menu items found.
          </div>
        ) : (
          filteredItems.map((item) => (
            <button
              key={item.id}
              onClick={() => addToCart(item)}
              disabled={!item.inStock}
              className={`group flex flex-col rounded-2xl border text-left bg-white overflow-hidden transition shadow-2xs hover:shadow-xs hover:border-slate-350 cursor-pointer ${
                item.inStock
                  ? "border-slate-200 hover:scale-[1.01]"
                  : "border-slate-200 opacity-60 cursor-not-allowed"
              }`}
            >
              {/* Image Container with Badges */}
              <div className="relative h-28 w-full bg-slate-100 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to placeholder color or generic image path if loading fails
                    e.currentTarget.src = "/images/login.jpg";
                  }}
                />
                {!item.inStock && (
                  <span className="absolute inset-0 bg-black/40 flex items-center justify-center text-xs font-black uppercase tracking-widest text-white">
                    86 (OUT OF STOCK)
                  </span>
                )}
                {item.inStock && (
                  <div className="absolute right-2 bottom-2 rounded-xl bg-slate-900/90 text-white px-2 py-1 text-[10px] font-extrabold shadow-sm">
                    {item.prepTime} min
                  </div>
                )}
              </div>

              {/* Description Body */}
              <div className="p-3.5 flex flex-col justify-between flex-1 gap-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium line-clamp-2 mt-1">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
                  <span className="text-xs font-black text-blue-600">
                    ${item.price.toFixed(2)}
                  </span>
                  {item.inStock && (
                    <span className="rounded-lg bg-slate-100 text-slate-600 p-1 group-hover:bg-slate-900 group-hover:text-white transition shadow-3xs">
                      <Plus className="h-3 w-3" />
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
