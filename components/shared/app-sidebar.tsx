"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import {
  AlertTriangle,
  Bell,
  ChefHat,
  ClipboardList,
  CookingPot,
  Grid3X3,
  HandCoins,
  Home,
  InfoIcon,
  LayoutDashboard,
  MenuIcon,
  Monitor,
  ShoppingCart,
  Soup,
  Table2,
  User,
  UtensilsCrossed,
  Eye,
  Settings,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { NavMain } from "@/components/shared/nav-main";
import { NavUser } from "./nav-user";

const data = {
  manager: {
    navMain: [
      {
        title: "Dashboard",
        url: "/manager/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Live Floor View",
        url: "/manager/floor-view",
        icon: Monitor,
      },
      {
        title: "Table Management",
        url: "/manager/tables",
        icon: Table2,
      },
      {
        title: "Menu Management",
        url: "/manager/menu",
        icon: MenuIcon,
      },
      {
        title: "Order Management",
        url: "/manager/orders",
        icon: ShoppingCart,
      },
      {
        title: "Alerts & Notifications",
        url: "/manager/alerts",
        icon: Bell,
      },
      {
        title: "Settings",
        url: "/manager/settings",
        icon: Settings,
      },
    ],
  },
  staff: {
    navMain: [
      {
        title: "Dashboard",
        url: "/staff/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Table Selection",
        url: "/staff/tables",
        icon: Table2,
      },
      {
        title: "Active Orders",
        url: "/staff/orders",
        icon: ClipboardList,
      },
      {
        title: "New Order",
        url: "/staff/new-order",
        icon: UtensilsCrossed,
      },
      {
        title: "Ready to Serve",
        url: "/staff/ready-to-serve",
        icon: Soup,
      },
      {
        title: "Table Service",
        url: "/staff/service",
        icon: ChefHat,
      },
      {
        title: "My Profile",
        url: "/staff/profile",
        icon: User,
      },
    ],
  },
  kitchen: {
    navMain: [
      {
        title: "Dashboard",
        url: "/kitchen/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Order Queue",
        url: "/kitchen/queue",
        icon: CookingPot,
      },
      {
        title: "Station Filter",
        url: "/kitchen/stations",
        icon: Grid3X3,
      },
      {
        title: "Item Status",
        url: "/kitchen/items",
        icon: ClipboardList,
      },
      {
        title: "Profile",
        url: "/kitchen/profile",
        icon: User,
      },
    ],
  },
};

interface AppSidebarProps {
  role: "manager" | "staff" | "kitchen";
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
}

export default function AppSidebar({ 
  role, 
  userName = "User",
  userEmail = "user@ordernest.com",
  userAvatar,
  ...props 
}: AppSidebarProps) {
  const sidebarData = data[role];
  const dashboardPath = {
    manager: "/manager/dashboard",
    staff: "/staff/dashboard",
    kitchen: "/kitchen/dashboard",
  }[role];
  
  // Role-based styling
  const roleStyles = {
    manager: "bg-slate-50 border-r border-slate-200",
    staff: "bg-blue-50 border-r border-blue-200",
    kitchen: "bg-orange-50 border-r border-orange-200",
  };

  return (
    <Sidebar
      collapsible="icon"
      className={`w-64 ${roleStyles[role]}`}
      {...props}
    >
      <SidebarHeader>
        <Link
          href={dashboardPath}
          className="flex flex-col items-center w-full max-h-40 justify-center gap-2 p-4"
        >
          <Image
            src="/logo2.png"
            alt="OrderNest Logo"
            width={180}
            height={180}
            className="size-auto"
            priority
          />
    
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <NavMain items={sidebarData?.navMain || []} />
      </SidebarContent>
      
      <SidebarFooter>
        <NavUser 
          user={{
            name: userName,
            email: userEmail,
            avatar: userAvatar || "",
          }}
        />
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  );
}