import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { advanceOrderStatus } from "@/redux/features/restaurantSlice";
import { toast } from "sonner";

export const useReadyOrders = () => {
  const dispatch = useAppDispatch();
  const { orders } = useAppSelector((state) => state.restaurant);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const readyOrders = orders.filter((o) => o.status === "Ready");

  const handleDeliver = (orderId: string) => {
    dispatch(advanceOrderStatus({ orderId }));
    toast.success(`Order ${orderId} served successfully!`);
  };

  const getMinutesElapsed = (readyAtStr?: string) => {
    if (!readyAtStr || !currentTime) return "0 min";
    const diff = currentTime.getTime() - new Date(readyAtStr).getTime();
    return `${Math.round(diff / 60000)} min`;
  };

  const getTableCode = (id: number) => {
    return id < 10 ? `T0${id}` : `T${id}`;
  };

  return {
    readyOrders,
    handleDeliver,
    getMinutesElapsed,
    getTableCode,
  };
};
export default useReadyOrders;
