/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { MenuItem } from "@/redux/features/restaurantSlice";
import {
  useGetAllMenuItemsQuery,
  useToggleMenuItemStockMutation,
  useUpdateMenuItemMutation,
  useCreateMenuItemMutation,
  useDeleteMenuItemMutation,
} from "@/redux/api/restaurantApi";
import { unwrapApiData } from "@/src/utils/api-normalize";

const normalizeMenuItem = (item: any): MenuItem => ({
  id: String(item._id ?? item.id ?? ""),  // ✅ Fallback to empty string
  name: item.name ?? "Untitled item",
  description: item.description ?? "",
  price: Number(item.price ?? 0),
  prepTime: Number(item.prepTime ?? item.preparationTime ?? 0),
  category: item.category ?? "Sides",
  imageUrl: item.imageUrl ?? item.image ?? "/images/login.jpg",
  inStock: Boolean(item.inStock ?? item.isAvailable ?? item.stockStatus !== "OUT_OF_STOCK"),
});

export const useMenuManagement = () => {
  const { data, isLoading, isError, refetch } = useGetAllMenuItemsQuery(undefined);
  const [toggleStock] = useToggleMenuItemStockMutation();
  const [updateMenuItem] = useUpdateMenuItemMutation();
  const [createMenuItem] = useCreateMenuItemMutation();
  const [deleteMenuItem] = useDeleteMenuItemMutation();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editPriceValue, setEditPriceValue] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const menuItems = useMemo(
    () => unwrapApiData<any[]>(data, []).map(normalizeMenuItem),
    [data]
  );

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Toggle stock status (86)
  const handleToggleStock = async (itemId: string, name: string, currentlyInStock: boolean) => {
    try {
      await toggleStock(itemId).unwrap();
      toast.success(
        currentlyInStock 
          ? `"${name}" marked as OUT OF STOCK (86)` 
          : `"${name}" is back IN STOCK`
      );
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Could not update item stock.");
    }
  };

  // Start editing price
  const handleStartEditPrice = (item: MenuItem) => {
    const itemId = item.id ?? item._id ?? "";  // ✅ Ensure string
    setEditingItemId(itemId);
    setEditPriceValue(item.price.toString());
  };

  // Save price
  const handleSavePrice = async (itemId: string) => {
    const parsedPrice = parseFloat(editPriceValue);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    try {
      await updateMenuItem({ id: itemId, data: { price: parsedPrice } }).unwrap();
      setEditingItemId(null);
      toast.success("Price updated successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Could not update price.");
    }
  };

  // Create new menu item
  const handleCreateItem = async (data: {
    name: string;
    description: string;
    price: number;
    category: string;
    prepTime: number;
  }) => {
    try {
      await createMenuItem(data).unwrap();
      toast.success(`"${data.name}" added to menu!`);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Could not create menu item.");
    }
  };

  // Delete menu item
  const handleDeleteItem = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await deleteMenuItem(id).unwrap();
      toast.success(`"${name}" deleted from menu!`);
      // ✅ Fix: Check both id and _id
      if (selectedItem && (selectedItem.id === id || selectedItem._id === id)) {
        setSelectedItem(null);
      }
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Could not delete menu item.");
    }
  };

  // Get unique categories for tabs
  const categories = ["All", ...Array.from(new Set(menuItems.map((item) => item.category)))];

  return {
    // Data
    menuItems,
    filteredItems,
    categories,
    
    // Search & Filter
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    
    // Edit state
    editingItemId,
    setEditingItemId,
    editPriceValue,
    setEditPriceValue,
    
    // Selected item
    selectedItem,
    setSelectedItem,
    
    // Actions
    handleToggleStock,
    handleStartEditPrice,
    handleSavePrice,
    handleCreateItem,
    handleDeleteItem,
    
    // Status
    isLoading,
    isError,
    refetch,
  };
};