"use client";
import React from "react";
import {
  Home,
  Zap,
  Activity,
  BarChart3,
  User,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  // Navigation items
  const navItems = [
    { icon: Home, label: "Home", route: "/" },
    { icon: Zap, label: "Electricity", route: "/electricity" },
    { icon: Activity, label: "Machine", route: "/machine" },
    { icon: BarChart3, label: "Monthly", route: "/monthly" },
    { icon: User, label: "Profile", route: "/profile" },
  ];

  return (
    <>
      {/* Sidebar for large screens */}
      <aside className="hidden md:flex fixed top-0 left-0 h-full w-56 bg-white border-r border-gray-200 shadow-lg z-50 flex-col p-4">
        <div className="flex flex-col gap-4">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.route;
            return (
              <button
                key={index}
                onClick={() => router.push(item.route)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                <Icon
                  size={20}
                  className={isActive ? "text-blue-600" : "text-gray-600"}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Bottom nav for mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md z-50 md:hidden">
        <div className="flex items-center justify-around px-2 py-3">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.route;
            return (
              <button
                key={index}
                onClick={() => router.push(item.route)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                <Icon
                  size={20}
                  className={isActive ? "text-blue-600" : "text-gray-600"}
                />
                <span
                  className={`text-xs font-medium ${
                    isActive ? "text-blue-600" : "text-gray-600"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
