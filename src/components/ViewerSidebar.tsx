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

interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
}

const navItems: NavItem[] = [
  { href: "#", icon: LayoutDashboard, label: "Dashboard" },
  { href: "#", icon: Users, label: "Patients" },
  { href: "#", icon: FileText, label: "Reports" },
  { href: "#", icon: Settings, label: "Settings" },
];

export function ViewerSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [active, setActive] = useState("Dashboard");

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      className={`flex flex-col h-screen bg-gray-800 text-white p-4 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between mb-10">
        {!isCollapsed && (
          <a href="#" className="text-2xl font-bold">
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

      <nav className="flex-1">
        <ul>
          {navItems.map((item) => (
            <li key={item.label} className="mb-2">
              <a
                href={item.href}
                onClick={() => setActive(item.label)}
                className={`flex items-center p-2 rounded-lg transition-colors ${
                  active === item.label
                    ? "bg-primary text-white"
                    : "hover:bg-gray-700"
                } ${isCollapsed ? "justify-center" : ""}`}
              >
                <item.icon className={`w-5 h-5 ${!isCollapsed ? "mr-3" : ""}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto">
        <div
          className={`p-2 rounded-lg hover:bg-gray-700 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <div className="flex items-center">
            <img
              src="https://via.placeholder.com/40"
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
