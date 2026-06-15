import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fireOrder, OrderItem, MenuItem } from "@/redux/features/restaurantSlice";
import { toast } from "sonner";

export const useOrderBuilder = () => {
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

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleFireOrder = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty!");
      return;
    }
    dispatch(
      fireOrder({
        tableId: selectedTableId,
        items: cart,
        isVip,
      })
    );
    toast.success(`Order fired to the kitchen for Table ${selectedTableId}!`);
    router.push("/staff/tables");
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
  };
};
export default useOrderBuilder;
