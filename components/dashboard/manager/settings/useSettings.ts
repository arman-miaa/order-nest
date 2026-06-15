import { useState } from "react";
import { toast } from "sonner";

export const useSettings = () => {
  const [taxRate, setTaxRate] = useState("8");
  const [serviceCharge, setServiceCharge] = useState("5");
  const [defaultPrepTime, setDefaultPrepTime] = useState("10");
  const [overdueThreshold, setOverdueThreshold] = useState("15");
  const [restaurantName, setRestaurantName] = useState("OrderNest Restaurant");
  const [currency, setCurrency] = useState("USD");

  const [notifyDelays, setNotifyDelays] = useState(true);
  const [notifyVip, setNotifyVip] = useState(true);
  const [notifyStock86, setNotifyStock86] = useState(true);
  const [notifySystem, setNotifySystem] = useState(false);

  const [websocketEnabled, setWebsocketEnabled] = useState(true);
  const [offlineQueue, setOfflineQueue] = useState(true);
  const [duplicateGuard, setDuplicateGuard] = useState(true);

  const [saved, setSaved] = useState<string | null>(null);

  const handleSave = (section: string) => {
    setSaved(section);
    toast.success(`${section} settings saved successfully!`);
    setTimeout(() => setSaved(null), 2000);
  };

  return {
    taxRate, setTaxRate,
    serviceCharge, setServiceCharge,
    defaultPrepTime, setDefaultPrepTime,
    overdueThreshold, setOverdueThreshold,
    restaurantName, setRestaurantName,
    currency, setCurrency,
    notifyDelays, setNotifyDelays,
    notifyVip, setNotifyVip,
    notifyStock86, setNotifyStock86,
    notifySystem, setNotifySystem,
    websocketEnabled, setWebsocketEnabled,
    offlineQueue, setOfflineQueue,
    duplicateGuard, setDuplicateGuard,
    saved,
    handleSave,
  };
};
