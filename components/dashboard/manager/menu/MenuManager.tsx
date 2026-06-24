/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Search,
  Edit,
  Check,
  X,
  AlertTriangle,
  Flame,
  Plus,
  Trash2,
} from "lucide-react";
import { useMenuManagement } from "./useMenuManagement";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const categories = ["Starter", "Main Course", "Drink", "Dessert", "Side Dish"];

type MenuForm = {
  name: string;
  description: string;
  price: string;
  category: string;
  prepTime: string;
};

const emptyForm: MenuForm = {
  name: "",
  description: "",
  price: "",
  category: "Starter",
  prepTime: "10",
};

// ✅ Helper to get ID safely
const getItemId = (item: any): string => item.id ?? item._id ?? "";

export const MenuManager: React.FC = () => {
  const {
    filteredItems,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    editingItemId,
    setEditingItemId,
    editPriceValue,
    setEditPriceValue,
    selectedItem,
    setSelectedItem,
    handleToggleStock,
    handleStartEditPrice,
    handleSavePrice,
    categories: catList,
    handleCreateItem,
    handleDeleteItem,
  } = useMenuManagement();

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<MenuForm>(emptyForm);

  const openAdd = () => {
    setForm(emptyForm);
    setModalOpen(true);
  };

  const handleAddSubmit = () => {
    if (!form.name.trim() || !form.price) {
      toast.error("Name and price are required");
      return;
    }
    handleCreateItem({
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      category: form.category,
      prepTime: Number(form.prepTime),
    });
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
            Menu Management
          </h1>
          <p className="text-slate-500">
            Manage items catalog, pricing, and 86-item out-of-stock toggles.
          </p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4 mr-2" /> Add Item
        </Button>
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

        <div className="flex flex-wrap items-center gap-2">
          {catList.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition shadow-xs cursor-pointer ${
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
                <th className="pb-3 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-sm text-slate-400">
                    No menu items found.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const itemId = getItemId(item); // ✅ Safe ID
                  return (
                    <tr
                      key={itemId}
                      className={`hover:bg-slate-50/50 cursor-pointer ${
                        selectedItem && getItemId(selectedItem) === itemId ? "bg-slate-50" : ""
                      }`}
                      onClick={() => setSelectedItem(item)}
                    >
                      <td className="py-4 pr-3 max-w-[300px]">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 text-sm">{item.name}</span>
                          <span className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {item.description}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 text-xs font-semibold text-slate-600">{item.category}</td>

                      {/* Editable Price */}
                      <td className="py-4 text-sm" onClick={(e) => e.stopPropagation()}>
                        {editingItemId === itemId ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-500 font-medium">$</span>
                            <input
                              type="text"
                              value={editPriceValue}
                              onChange={(e) => setEditPriceValue(e.target.value)}
                              className="w-16 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-bold focus:outline-none focus:border-slate-400"
                            />
                            <button onClick={() => handleSavePrice(itemId)} className="rounded-lg bg-emerald-500 p-1 text-white hover:bg-emerald-600">
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => setEditingItemId(null)} className="rounded-lg bg-slate-200 p-1 text-slate-600 hover:bg-slate-300">
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 font-bold text-slate-900 group">
                            <span>${item.price.toFixed(2)}</span>
                            <button onClick={() => handleStartEditPrice(item)} className="opacity-0 group-hover:opacity-100">
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

                      {/* Stock Toggle */}
                      <td className="py-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleToggleStock(itemId, item.name, item.inStock)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                            item.inStock ? "bg-slate-900" : "bg-slate-200"
                          }`}
                        >
                          <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                            item.inStock ? "translate-x-5" : "translate-x-0"
                          }`} />
                        </button>
                        <span className={`text-[10px] font-bold ml-2 ${item.inStock ? "text-emerald-600" : "text-red-500"}`}>
                          {item.inStock ? "In Stock" : "86"}
                        </span>
                      </td>

                      {/* Delete */}
                      <td className="py-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => handleDeleteItem(itemId, item.name)} className="text-red-400 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Item Detail Sidebar */}
        <div>
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm h-full flex flex-col min-h-[480px]">
            {!selectedItem ? (
              <div className="flex flex-col items-center justify-center flex-1 text-center text-slate-400 py-12">
                <AlertTriangle className="h-12 w-12 text-slate-300 stroke-1 mb-2" />
                <p className="text-sm font-semibold">Select an Item</p>
                <p className="text-xs text-slate-400 max-w-[200px] mt-1">
                  Click on any menu item row to view details.
                </p>
              </div>
            ) : (
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="border-b border-slate-100 pb-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {selectedItem.category}
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 mt-1">{selectedItem.name}</h3>
                  </div>
                  <div className="mt-5 space-y-4 text-sm">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Description</span>
                      <p className="text-slate-600 mt-1">{selectedItem.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Item ID</span>
                        <span className="font-semibold text-slate-800 text-xs mt-1">{getItemId(selectedItem)}</span>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Est. Prep Time</span>
                        <span className="font-semibold text-slate-800 text-xs mt-1">{selectedItem.prepTime} min</span>
                      </div>
                    </div>
                    <div className="border-t border-slate-100 pt-4">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Current Pricing</span>
                      <span className="text-2xl font-extrabold text-slate-950 mt-1">${selectedItem.price.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Stock Status</span>
                        <span className={`text-xs font-bold mt-1 ${selectedItem.inStock ? "text-emerald-600" : "text-red-500"}`}>
                          {selectedItem.inStock ? "Currently Available" : "Out of Stock (86)"}
                        </span>
                      </div>
                      <button 
                        onClick={() => handleToggleStock(getItemId(selectedItem), selectedItem.name, selectedItem.inStock)}
                        className={`rounded-xl px-4 py-2 text-xs font-bold text-white transition ${
                          selectedItem.inStock ? "bg-red-500 hover:bg-red-600" : "bg-emerald-600 hover:bg-emerald-700"
                        }`}>
                        {selectedItem.inStock ? "86 Out of Stock" : "Put In Stock"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Menu Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Grilled Chicken" />
            </div>
            <div>
              <Label>Description</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Price *</Label>
                <Input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0.00" />
              </div>
              <div>
                <Label>Prep Time (min)</Label>
                <Input type="number" min="1" value={form.prepTime} onChange={(e) => setForm({ ...form, prepTime: e.target.value })} placeholder="10" />
              </div>
            </div>
            <div>
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(value) => setForm({ ...form, category: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddSubmit}>Add Item</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MenuManager;