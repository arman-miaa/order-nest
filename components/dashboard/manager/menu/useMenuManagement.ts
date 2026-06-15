import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toggleMenuItemStock, editMenuItemPrice, MenuItem } from "@/redux/features/restaurantSlice";
import { toast } from "sonner";

export const useMenuManagement = () => {
  const dispatch = useAppDispatch();
  const menuItems = useAppSelector((state) => state.restaurant.menuItems);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editPriceValue, setEditPriceValue] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleToggleStock = (itemId: string, name: string, currentlyInStock: boolean) => {
    dispatch(toggleMenuItemStock({ itemId }));
    if (currentlyInStock) {
      toast.warning(`"${name}" is now marked as 86 (Out of Stock).`);
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
  };
};
