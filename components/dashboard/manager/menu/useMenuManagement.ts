/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { MenuItem } from "@/redux/features/restaurantSlice";
import {
  useGetAllMenuItemsQuery,
  useToggleMenuItemStockMutation,
  useUpdateMenuItemMutation,
} from "@/redux/api/restaurantApi";
import { unwrapApiData } from "@/src/utils/api-normalize";

const normalizeMenuItem = (item: any): MenuItem => ({
  id: String(item._id ?? item.id),
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

  const handleToggleStock = async (itemId: string, name: string, currentlyInStock: boolean) => {
    try {
      await toggleStock(itemId).unwrap();
      toast[currentlyInStock ? "warning" : "success"](
        currentlyInStock ? `"${name}" is now marked out of stock.` : `"${name}" is back in stock.`
      );
    } catch (error: any) {
      toast.error(error?.data?.message || "Could not update item stock.");
    }
  };

  const handleStartEditPrice = (item: MenuItem) => {
    setEditingItemId(item.id);
    setEditPriceValue(item.price.toString());
  };

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
    } catch (error: any) {
      toast.error(error?.data?.message || "Could not update price.");
    }
  };

  const categories = ["All", ...Array.from(new Set(menuItems.map((item) => item.category)))];

  return {
    menuItems,
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
    categories,
    isLoading,
    isError,
    refetch,
  };
};