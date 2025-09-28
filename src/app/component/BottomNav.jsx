"use client";
import React from "react";
import {
  Home,
  Zap,
  Activity,
  BarChart3,
  User,
  TrendingUp,
  AlertCircle,
  Calendar,
  DollarSign,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// import { Home, User, Settings } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();
   const router = useRouter();

  // Navigation items
  const navItems = [
    { icon: Home, label: "Home", route: "/", active: true },
    { icon: Zap, label: "Electricity", route: "/electricity" },
    { icon: Activity, label: "Machine", route: "/machine" },
    { icon: BarChart3, label: "Monthly", route: "/monthly" },
    { icon: User, label: "Profile", route: "/profile" },
  ];



  return (
    
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md z-50">
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden z-50">
        <div className="flex items-center justify-around px-2 py-3">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={() => router.push(item.route)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                  item.active
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                <Icon 
                  size={20} 
                  className={item.active ? "text-blue-600" : "text-gray-600"} 
                />
                <span className={`text-xs font-medium ${
                  item.active ? "text-blue-600" : "text-gray-600"
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
     
      {/* <ul className="flex justify-around items-center h-16">
        {items.map(({ href, icon, label }) => {
          const active = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex flex-col items-center text-sm ${
                  active ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                {icon}
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul> */}
    </nav>
  );
}
