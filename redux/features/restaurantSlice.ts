import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TableStatus = "Available" | "Seated" | "Ordering" | "Eating" | "Bill Requested" | "Dirty";
export type OrderStatus = "Queued" | "Cooking" | "Ready" | "Served" | "Cleared";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  prepTime: number; // in minutes
  category: "Burgers" | "Pizzas" | "Sides" | "Drinks" | "Desserts";
  imageUrl: string;
  inStock: boolean;
}

export interface OrderItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  modifiers?: string[];
}

export interface Order {
  id: string;
  tableId: number;
  items: OrderItem[];
  status: OrderStatus;
  totalPrice: number;
  isVip: boolean;
  createdAt: string; // ISO string
  dueAt: string; // ISO string
  startedCookingAt?: string;
  markedReadyAt?: string;
  completedAt?: string;
}

export interface Alert {
  id: string;
  type: "delay" | "stock" | "vip" | "system";
  message: string;
  severity: "critical" | "warning" | "info";
  createdAt: string;
  resolved: boolean;
  tableId?: number;
}

export interface Table {
  id: number;
  capacity: number;
  status: TableStatus;
  activeOrderId: string | null;
  seatedAt?: string; // ISO string when table was seated
    isVip?: boolean;
}

interface RestaurantState {
  tables: Table[];
  menuItems: MenuItem[];
  orders: Order[];
  alerts: Alert[];
}

// Initial Menu Items
const initialMenuItems: MenuItem[] = [
  {
    id: "b1",
    name: "Classic Cheeseburger",
    description: "Flame-grilled beef patty, cheddar cheese, lettuce, tomato, pickles, house sauce.",
    price: 12.99,
    prepTime: 8,
    category: "Burgers",
    imageUrl: "/images/login.jpg", // Using placeholder image from project assets
    inStock: true,
  },
  {
    id: "b2",
    name: "Double Bacon Burger",
    description: "Two beef patties, crispy bacon, double cheddar, caramelized onions, BBQ sauce.",
    price: 15.99,
    prepTime: 10,
    category: "Burgers",
    imageUrl: "/images/login.jpg",
    inStock: true,
  },
  {
    id: "b3",
    name: "Spicy Jalapeno Burger",
    description: "Beef patty, pepper jack cheese, fried jalapenos, spicy mayo, lettuce.",
    price: 13.99,
    prepTime: 9,
    category: "Burgers",
    imageUrl: "/images/login.jpg",
    inStock: true,
  },
  {
    id: "p1",
    name: "Pepperoni Pizza",
    description: "Classic marinara, fresh mozzarella, premium pepperoni, oregano, hot honey drizzle.",
    price: 16.99,
    prepTime: 12,
    category: "Pizzas",
    imageUrl: "/images/otp.jpg",
    inStock: true,
  },
  {
    id: "p2",
    name: "Margherita Pizza",
    description: "San Marzano tomatoes, fresh mozzarella, fresh basil, extra virgin olive oil.",
    price: 14.99,
    prepTime: 10,
    category: "Pizzas",
    imageUrl: "/images/otp.jpg",
    inStock: true,
  },
  {
    id: "p3",
    name: "BBQ Chicken Pizza",
    description: "Grilled chicken, BBQ sauce base, red onions, cilantro, smoked gouda.",
    price: 17.99,
    prepTime: 13,
    category: "Pizzas",
    imageUrl: "/images/otp.jpg",
    inStock: true,
  },
  {
    id: "s1",
    name: "Truffle Fries",
    description: "Golden crispy fries tossed in truffle oil, parmesan cheese, and fresh parsley.",
    price: 6.99,
    prepTime: 5,
    category: "Sides",
    imageUrl: "/images/login.jpg",
    inStock: true,
  },
  {
    id: "s2",
    name: "Mozzarella Sticks",
    description: "Crispy breaded mozzarella served with warm marinara sauce (6 pieces).",
    price: 7.99,
    prepTime: 6,
    category: "Sides",
    imageUrl: "/images/login.jpg",
    inStock: true,
  },
  {
    id: "d1",
    name: "Lemon Mint Craft Soda",
    description: "Refreshing house-made soda with fresh lemon juice and fresh mint leaves.",
    price: 4.50,
    prepTime: 2,
    category: "Drinks",
    imageUrl: "/images/otp.jpg",
    inStock: true,
  },
  {
    id: "d2",
    name: "Iced Caramel Latte",
    description: "Double espresso, cold milk, rich caramel syrup, served over ice.",
    price: 4.99,
    prepTime: 3,
    category: "Drinks",
    imageUrl: "/images/otp.jpg",
    inStock: true,
  },
  {
    id: "de1",
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with a molten center, served with vanilla bean ice cream.",
    price: 8.99,
    prepTime: 7,
    category: "Desserts",
    imageUrl: "/images/login.jpg",
    inStock: true,
  },
  {
    id: "de2",
    name: "New York Cheesecake",
    description: "Rich and creamy classic cheesecake served with a sweet strawberry compote.",
    price: 7.99,
    prepTime: 4,
    category: "Desserts",
    imageUrl: "/images/login.jpg",
    inStock: true,
  },
];

// Initial tables with varying states to make dashboard look populated on load
const initialTables: Table[] = [
  { id: 1, capacity: 2, status: "Available", activeOrderId: null },
  { id: 2, capacity: 4, status: "Seated", activeOrderId: null, seatedAt: new Date(Date.now() - 15 * 60000).toISOString() },
  { id: 3, capacity: 4, status: "Eating", activeOrderId: "ord-3", seatedAt: new Date(Date.now() - 40 * 60000).toISOString() },
  { id: 4, capacity: 2, status: "Available", activeOrderId: null },
  { id: 5, capacity: 6, status: "Ordering", activeOrderId: "ord-5", seatedAt: new Date(Date.now() - 10 * 60000).toISOString() },
  { id: 6, capacity: 2, status: "Dirty", activeOrderId: null },
  { id: 7, capacity: 4, status: "Available", activeOrderId: null },
  { id: 8, capacity: 8, status: "Bill Requested", activeOrderId: "ord-8", seatedAt: new Date(Date.now() - 55 * 60000).toISOString() },
  { id: 9, capacity: 4, status: "Available", activeOrderId: null },
  { id: 10, capacity: 2, status: "Available", activeOrderId: null },
  { id: 11, capacity: 4, status: "Seated", activeOrderId: null, seatedAt: new Date(Date.now() - 5 * 60000).toISOString() },
  { id: 12, capacity: 6, status: "Eating", activeOrderId: "ord-12", seatedAt: new Date(Date.now() - 30 * 60000).toISOString() },
  { id: 13, capacity: 2, status: "Available", activeOrderId: null },
  { id: 14, capacity: 4, status: "Available", activeOrderId: null },
  { id: 15, capacity: 4, status: "Available", activeOrderId: null },
  { id: 16, capacity: 4, status: "Available", activeOrderId: null },
  { id: 17, capacity: 6, status: "Available", activeOrderId: null },
  { id: 18, capacity: 2, status: "Available", activeOrderId: null },
  { id: 19, capacity: 8, status: "Available", activeOrderId: null },
  { id: 20, capacity: 4, status: "Available", activeOrderId: null },
];

const initialOrders: Order[] = [
  {
    id: "ord-3",
    tableId: 3,
    items: [
      { itemId: "b1", name: "Classic Cheeseburger", price: 12.99, quantity: 2, modifiers: ["Extra Cheese"] },
      { itemId: "s1", name: "Truffle Fries", price: 6.99, quantity: 1 },
      { itemId: "d1", name: "Lemon Mint Craft Soda", price: 4.50, quantity: 2 },
    ],
    status: "Served",
    totalPrice: 37.47,
    isVip: false,
    createdAt: new Date(Date.now() - 35 * 60000).toISOString(),
    dueAt: new Date(Date.now() - 25 * 60000).toISOString(),
    startedCookingAt: new Date(Date.now() - 32 * 60000).toISOString(),
    markedReadyAt: new Date(Date.now() - 22 * 60000).toISOString(),
    completedAt: new Date(Date.now() - 20 * 60000).toISOString(),
  },
  {
    id: "ord-5",
    tableId: 5,
    items: [
      { itemId: "p1", name: "Pepperoni Pizza", price: 16.99, quantity: 1, modifiers: ["Spicy"] },
      { itemId: "p3", name: "BBQ Chicken Pizza", price: 17.99, quantity: 1 },
      { itemId: "d2", name: "Iced Caramel Latte", price: 4.99, quantity: 3 },
    ],
    status: "Cooking",
    totalPrice: 49.95,
    isVip: true,
    createdAt: new Date(Date.now() - 8 * 60000).toISOString(),
    dueAt: new Date(Date.now() + 5 * 60000).toISOString(),
    startedCookingAt: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: "ord-8",
    tableId: 8,
    items: [
      { itemId: "b2", name: "Double Bacon Burger", price: 15.99, quantity: 4 },
      { itemId: "s2", name: "Mozzarella Sticks", price: 7.99, quantity: 2 },
      { itemId: "de1", name: "Chocolate Lava Cake", price: 8.99, quantity: 4 },
      { itemId: "d1", name: "Lemon Mint Craft Soda", price: 4.50, quantity: 4 },
    ],
    status: "Served",
    totalPrice: 133.90,
    isVip: false,
    createdAt: new Date(Date.now() - 50 * 60000).toISOString(),
    dueAt: new Date(Date.now() - 35 * 60000).toISOString(),
    startedCookingAt: new Date(Date.now() - 48 * 60000).toISOString(),
    markedReadyAt: new Date(Date.now() - 38 * 60000).toISOString(),
    completedAt: new Date(Date.now() - 35 * 60000).toISOString(),
  },
  {
    id: "ord-12",
    tableId: 12,
    items: [
      { itemId: "b2", name: "Double Bacon Burger", price: 15.99, quantity: 2 },
      { itemId: "p2", name: "Margherita Pizza", price: 14.99, quantity: 1 },
      { itemId: "s1", name: "Truffle Fries", price: 6.99, quantity: 2 },
    ],
    status: "Served",
    totalPrice: 60.95,
    isVip: false,
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    dueAt: new Date(Date.now() - 13 * 60000).toISOString(),
    startedCookingAt: new Date(Date.now() - 22 * 60000).toISOString(),
    markedReadyAt: new Date(Date.now() - 10 * 60000).toISOString(),
    completedAt: new Date(Date.now() - 8 * 60000).toISOString(),
  },
];

const initialAlerts: Alert[] = [
  {
    id: "alt-1",
    type: "delay",
    message: "Table 5 Order (#ord-5) cooking is taking longer than expected.",
    severity: "warning",
    createdAt: new Date(Date.now() - 2 * 60000).toISOString(),
    resolved: false,
    tableId: 5,
  },
  {
    id: "alt-2",
    type: "vip",
    message: "VIP Guests seated at Table 5 are ready to order.",
    severity: "info",
    createdAt: new Date(Date.now() - 9 * 60000).toISOString(),
    resolved: false,
    tableId: 5,
  },
];

const getStoredState = (): RestaurantState => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("ordernest_state");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse restaurant state from localStorage", e);
      }
    }
  }
  return {
    tables: initialTables,
    menuItems: initialMenuItems,
    orders: initialOrders,
    alerts: initialAlerts,
  };
};

const initialState: RestaurantState = getStoredState();

const saveState = (state: RestaurantState) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("ordernest_state", JSON.stringify(state));
  }
};

const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    fireOrder: (
      state,
      action: PayloadAction<{
        tableId: number;
        items: OrderItem[];
        isVip: boolean;
      }>
    ) => {
      const { tableId, items, isVip } = action.payload;
      const orderId = `ord-${Math.floor(1000 + Math.random() * 9000)}`;
      const now = new Date();
      
      // Calculate max prep time
      let maxPrepTime = 5;
      items.forEach((item) => {
        const menuItem = state.menuItems.find((mi) => mi.id === item.itemId);
        if (menuItem && menuItem.prepTime > maxPrepTime) {
          maxPrepTime = menuItem.prepTime;
        }
      });
      
      const dueAt = new Date(now.getTime() + maxPrepTime * 60000);
      const totalPrice = parseFloat(
        items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
      );

      const newOrder: Order = {
        id: orderId,
        tableId,
        items,
        status: "Queued",
        totalPrice,
        isVip,
        createdAt: now.toISOString(),
        dueAt: dueAt.toISOString(),
      };

      state.orders.push(newOrder);

      // Update table status
      const table = state.tables.find((t) => t.id === tableId);
      if (table) {
        table.status = "Eating"; // Transition from Seated/Ordering to eating state
        table.activeOrderId = orderId;
      }

      // If VIP, add VIP alert
      if (isVip) {
        state.alerts.push({
          id: `alt-${Math.random().toString(36).substr(2, 9)}`,
          type: "vip",
          message: `VIP Order placed at Table ${tableId}!`,
          severity: "info",
          createdAt: now.toISOString(),
          resolved: false,
          tableId,
        });
      }

      saveState(state);
    },

    advanceOrderStatus: (state, action: PayloadAction<{ orderId: string }>) => {
      const { orderId } = action.payload;
      const order = state.orders.find((o) => o.id === orderId);
      if (!order) return;

      const now = new Date().toISOString();

      if (order.status === "Queued") {
        order.status = "Cooking";
        order.startedCookingAt = now;
      } else if (order.status === "Cooking") {
        order.status = "Ready";
        order.markedReadyAt = now;
      } else if (order.status === "Ready") {
        order.status = "Served";
        order.completedAt = now;
        
        // Update Table status when served
        const table = state.tables.find((t) => t.id === order.tableId);
        if (table) {
          table.status = "Eating";
        }
      } else if (order.status === "Served") {
        order.status = "Cleared";
        
        // Update table to dirty, remove active order ID
        const table = state.tables.find((t) => t.id === order.tableId);
        if (table) {
          table.status = "Dirty";
          table.activeOrderId = null;
        }
      }

      saveState(state);
    },

    updateTableStatus: (
      state,
      action: PayloadAction<{ tableId: number; status: TableStatus }>
    ) => {
      const { tableId, status } = action.payload;
      const table = state.tables.find((t) => t.id === tableId);
      if (table) {
        table.status = status;
        if (status === "Seated") {
          table.seatedAt = new Date().toISOString();
        } else if (status === "Available" || status === "Dirty") {
          table.activeOrderId = null;
          table.seatedAt = undefined;
        }
      }
      saveState(state);
    },

    toggleMenuItemStock: (state, action: PayloadAction<{ itemId: string }>) => {
      const { itemId } = action.payload;
      const item = state.menuItems.find((mi) => mi.id === itemId);
      if (item) {
        item.inStock = !item.inStock;
        
        // Add alert if marked 86 out of stock
        if (!item.inStock) {
          state.alerts.push({
            id: `alt-${Math.random().toString(36).substr(2, 9)}`,
            type: "stock",
            message: `Menu Item "${item.name}" has been marked 86 (Out of Stock)!`,
            severity: "warning",
            createdAt: new Date().toISOString(),
            resolved: false,
          });
        }
      }
      saveState(state);
    },

    editMenuItemPrice: (
      state,
      action: PayloadAction<{ itemId: string; newPrice: number }>
    ) => {
      const { itemId, newPrice } = action.payload;
      const item = state.menuItems.find((mi) => mi.id === itemId);
      if (item) {
        item.price = newPrice;
      }
      saveState(state);
    },

    resolveAlert: (state, action: PayloadAction<{ alertId: string }>) => {
      const { alertId } = action.payload;
      const alert = state.alerts.find((a) => a.id === alertId);
      if (alert) {
        alert.resolved = true;
      }
      saveState(state);
    },

    addAlert: (
      state,
      action: PayloadAction<{
        type: "delay" | "stock" | "vip" | "system";
        message: string;
        severity: "critical" | "warning" | "info";
        tableId?: number;
      }>
    ) => {
      const { type, message, severity, tableId } = action.payload;
      state.alerts.push({
        id: `alt-${Math.random().toString(36).substr(2, 9)}`,
        type,
        message,
        severity,
        createdAt: new Date().toISOString(),
        resolved: false,
        tableId,
      });
      saveState(state);
    },
    
    resetDemoData: (state) => {
      state.tables = initialTables;
      state.menuItems = initialMenuItems;
      state.orders = initialOrders;
      state.alerts = initialAlerts;
      saveState(state);
    }
  },
});

export const {
  fireOrder,
  advanceOrderStatus,
  updateTableStatus,
  toggleMenuItemStock,
  editMenuItemPrice,
  resolveAlert,
  addAlert,
  resetDemoData
} = restaurantSlice.actions;

export default restaurantSlice.reducer;
