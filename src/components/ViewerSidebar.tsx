"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { MetadataDisplay } from "./MetadataDisplay";

interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
}

export function ViewerSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [active, setActive] = useState("Dashboard");

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      className={`flex flex-col h-screen bg-secondary text-white p-4 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        {!isCollapsed && (
          <a href="#" className="text-2xl font-bold px-2">
            SOAI Viewer
          </a>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="hover:bg-gray-700"
        >
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>

      {!isCollapsed && <MetadataDisplay />}
      <div className="mt-auto">
        <Button
          variant="ghost"
          className={`w-full text-left hover:bg-primary ${isCollapsed ? "justify-center" : "justify-start"}`}
          asChild
        >
          <Link href="/">
            <ChevronLeft className={`w-5 h-5 ${!isCollapsed ? "mr-3" : ""}`} />
            {!isCollapsed && <span>돌아가기</span>}
          </Link>
        </Button>
        <Button
          variant="ghost"
          className={`w-full mt-2 text-left hover:bg-red-600/50 ${
            isCollapsed ? "justify-center" : "justify-start"
          }`}
        >
          <LogOut className={`w-5 h-5 ${!isCollapsed ? "mr-3" : ""}`} />
          {!isCollapsed && "로그아웃"}
        </Button>
      </div>
    </aside>
  );
}
