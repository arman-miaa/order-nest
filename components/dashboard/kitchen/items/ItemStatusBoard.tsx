"use client";

import React from "react";
import { Loader2, RefreshCw, Search, CheckCircle2, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useItemStatus } from "./useItemStatus";

export const ItemStatusBoard: React.FC = () => {
  const {
    filteredItems,
    categories,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    handleToggleStock,
    isLoading,
    isError,
    refetch,
  } = useItemStatus();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-white py-20 text-sm text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading items...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-100 bg-white py-16 text-center text-sm font-semibold text-red-600">
        Failed to load item status.
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
            86 Control Board
          </h1>
          <p className="text-slate-500">
            Manage item availability. Out of stock items cannot be ordered.
          </p>
        </div>
        <button
          onClick={refetch}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition border cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-600 border-slate-200 hover:text-slate-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl border p-4 flex flex-col justify-between transition ${
                item.inStock
                  ? "border-slate-200 bg-white shadow-xs"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {item.category}
                  </span>
                  {item.inStock ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="h-3 w-3" /> IN STOCK
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                      <XCircle className="h-3 w-3" /> OUT OF STOCK
                    </span>
                  )}
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">{item.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description}</p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100/50">
                <button
                  onClick={() => handleToggleStock(item.id, item.inStock, item.name)}
                  className={`w-full py-2.5 rounded-xl text-sm font-bold transition cursor-pointer flex justify-center items-center gap-2 ${
                    item.inStock
                      ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                      : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                  }`}
                >
                  {item.inStock ? "Mark Out of Stock" : "Mark In Stock"}
                </button>
              </div>
            </div>
          ))}
          {filteredItems.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 text-sm">
              No items found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
