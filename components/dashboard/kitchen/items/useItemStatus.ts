/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useGetAllMenuItemsQuery, useToggleMenuItemStockMutation } from "@/redux/api/restaurantApi";
import { unwrapApiData } from "@/src/utils/api-normalize";
import { normalizeMenuItem } from "@/src/utils/restaurant-normalize";

export const useItemStatus = () => {
  const { data: menuData, isLoading, isError, refetch } = useGetAllMenuItemsQuery(undefined);
  const [toggleStock, { isLoading: isToggling }] = useToggleMenuItemStockMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const menuItems = useMemo(() => unwrapApiData<any[]>(menuData, []).map(normalizeMenuItem), [menuData]);

  const categories = useMemo(() => {
    const cats = new Set(menuItems.map((item) => item.category));
    return ["All", ...Array.from(cats)];
  }, [menuItems]);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [menuItems, searchTerm, selectedCategory]);

  const handleToggleStock = async (id: string, currentStatus: boolean, itemName: string) => {
    try {
      await toggleStock(id).unwrap();
      toast.success(`${itemName} marked as ${currentStatus ? "Out of Stock" : "In Stock"}`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Could not update item stock status.");
    }
  };

  return {
    filteredItems,
    categories,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    handleToggleStock,
    isLoading,
    isError,
    isToggling,
    refetch,
  };
};
