"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  User,
  Shield,
  Monitor,
  Palette,
  Bell,
  Database,
  ArrowLeft,
  Users,
} from "lucide-react";

const settingMenuItems = [
  {
    title: "사용자 관리",
    href: "/setting/users",
    icon: Users,
    description: "현재 서비스 사용자 목록 관리",
  },
];

export function SettingSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">설정</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/" passHref>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {settingMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} passHref className="w-full">
                    <SidebarMenuButton
                      isActive={isActive}
                      className="w-full justify-start h-auto p-3"
                    >
                      <div className="flex items-start space-x-3 w-full">
                        <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        <div className="text-left flex-1">
                          <div className="font-medium">{item.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
