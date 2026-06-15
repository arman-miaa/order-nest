"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      icon?: LucideIcon;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items?.map((item) => {
          const hasChildren = Boolean(item.items?.length);
          const isChildActive = item.items?.some((sub) => pathname === sub.url);
          const isActive = item.isActive || pathname === item.url || isChildActive;

          if (hasChildren) {
            return (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <div className="flex items-center gap-1">
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className={`flex-1 ${
                          isActive
                            ? "bg-primary text-white hover:bg-primary/80 hover:text-white"
                            : ""
                        }`}
                      >
                        {item.icon && <item.icon className="mr-2 h-5 w-5" />}
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleTrigger asChild>
                      <button
                        type="button"
                        aria-label={`Toggle ${item.title}`}
                        className="mr-1 flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
                      >
                        <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link href={subItem.url}>
                              {subItem.icon && (
                                <subItem.icon className="mr-2 h-5 w-5" />
                              )}
                              <span
                                className={`${
                                  pathname === subItem.url ? "text-primary" : ""
                                }`}
                              >
                                {subItem.title}
                              </span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          }

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className={`${
                  isActive
                    ? "bg-primary text-white hover:bg-primary/90 hover:text-white"
                    : ""
                }`}
              >
                <Link href={item.url}>
                  {item.icon && <item.icon className="mr-2 h-5 w-5" />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
