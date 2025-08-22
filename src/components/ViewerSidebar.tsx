"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
        <div
          className={`p-2 rounded-lg hover:bg-gray-700 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <div className="flex items-center">
            <img
              src="https://placeholder.co/40"
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
            {!isCollapsed && (
              <div className="ml-3">
                <p className="font-semibold">Dr. Human</p>
                <p className="text-xs text-gray-400">Radiologist</p>
              </div>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          className={`w-full mt-2 text-left hover:bg-red-600/50 ${
            isCollapsed ? "justify-center" : "justify-start"
          }`}
        >
          <LogOut className={`w-5 h-5 ${!isCollapsed ? "mr-3" : ""}`} />
          {!isCollapsed && "Logout"}
        </Button>
      </div>
    </aside>
  );
}
