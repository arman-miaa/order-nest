/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MenuItem, OrderItem } from "@/redux/features/restaurantSlice";
import { toast } from "sonner";
import {
  useCreateOrderMutation,
  useGetAllMenuItemsQuery,
  useGetAllTablesQuery,
} from "@/redux/api/restaurantApi";
import { unwrapApiData } from "@/src/utils/api-normalize";
import { normalizeMenuItem, normalizeTable } from "@/src/utils/restaurant-normalize";

export const useOrderBuilder = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialTableId = searchParams.get("tableId")
    ? parseInt(searchParams.get("tableId")!)
    : 1;

  const { data: tablesData, isLoading: isTablesLoading, isError: isTablesError } = useGetAllTablesQuery(undefined);
  const { data: menuData, isLoading: isMenuLoading, isError: isMenuError, refetch } = useGetAllMenuItemsQuery(undefined);
  const [createOrder, { isLoading: isSubmitting }] = useCreateOrderMutation();

  const [selectedTableId, setSelectedTableId] = useState<number>(initialTableId);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isVip, setIsVip] = useState(false);

  const tables = useMemo(
    () => unwrapApiData<any[]>(tablesData, []).map(normalizeTable),
    [tablesData]
  );

  const menuItems = useMemo(
    () => unwrapApiData<any[]>(menuData, []).map(normalizeMenuItem),
    [menuData]
  );

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
      setCart([
        ...cart,
        {
          itemId: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          modifiers: [],
        },
      ]);
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

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleFireOrder = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty!");
      return;
    }
    if (!selectedTableId) {
      toast.error("Select a table before firing the order.");
      return;
    }

    const payload = {
      tableId: selectedTableId,
      tableNo: selectedTableId,
      items: cart.map((item) => ({
        itemId: item.itemId,
        menuItemId: item.itemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        modifiers: item.modifiers ?? [],
      })),
      isVip,
      subtotal,
      tax,
      totalPrice: total,
    };

    try {
      await createOrder(payload).unwrap();
      toast.success(`Order fired to the kitchen for Table ${selectedTableId}!`);
      router.push("/staff/tables");
    } catch (error: any) {
      toast.error(error?.data?.message || "Could not create order.");
    }
  };

  const getTableCode = (id: number) => {
    return id < 10 ? `T0${id}` : `T${id}`;
  };

  return {
    tables,
    menuItems,
    selectedTableId,
    setSelectedTableId,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    cart,
    isVip,
    setIsVip,
    filteredItems,
    addToCart,
    removeFromCart,
    adjustQuantity,
    toggleModifier,
    subtotal,
    tax,
    total,
    handleFireOrder,
    getTableCode,
    isLoading: isTablesLoading || isMenuLoading,
    isError: isTablesError || isMenuError,
    isSubmitting,
    refetch,
  };
};
export default useOrderBuilder;