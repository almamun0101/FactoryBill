"use client";
import React from "react";
import {
  Zap,
  MapPin,
  Calendar,
  DollarSign,
  Activity,
  Settings,
  Home,
  BarChart3,
  User,
} from "lucide-react";

import { AiFillShop } from "react-icons/ai";
import { PiBuildingOfficeBold } from "react-icons/pi";

import { useRouter } from "next/navigation";

const Electricity = () => {
  const router = useRouter();

  const machines = [
    { size: "8 Ounces", meter: "10,000", electricity: "10,000" },
    { size: "5 Ounces", meter: "10,000", electricity: "10,000" },
  ];

  const percentageDecrease = 10;
  const totalElectricity = 50000;

  const data = [
    { date: "01 Sep 25", amount: "50000", place: "Office" },
    { date: "01 Sep 25", amount: "50000", place: "Local" },
  ];

  // Navigation items for mobile navbar
  const navItems = [
    { icon: Home, label: "Home", route: "/" },
    { icon: Zap, label: "Electricity", route: "/electricity", active: true },
    { icon: Activity, label: "Machine", route: "/machine" },
    { icon: BarChart3, label: "Monthly", route: "/monthly" },
    { icon: User, label: "Profile", route: "/profile" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-5">
      <div className="max-w-5xl mx-auto space-y-12">

        {/* Machine Overview */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Activity className="h-6 w-6 text-blue-600" />
            Machine Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {machines.map((m, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100 overflow-hidden transform hover:-translate-y-1"
              >
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center">
                  <h3 className="text-xl font-bold text-white">{m.size}</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="font-medium text-gray-700">Meter Reading</span>
                    <span className="text-lg font-bold text-gray-900">{m.meter}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                    <span className="font-medium text-gray-700">Electricity Usage</span>
                    <span className="text-lg font-bold text-blue-600">{m.electricity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Total Monthly Consumption */}
        {/* <section className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl shadow-xl p-10 text-center text-white">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-white/20 rounded-full">
              <Zap className="h-12 w-12" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2">Total Monthly Consumption</h2>
          <p className="text-5xl font-extrabold mb-2">
            ৳{totalElectricity.toLocaleString()}
          </p>
          <p className="text-green-100 text-lg">Current billing period</p>
        </section> */}

        {/* Electricity Table */}
     
      </div>

      {/* Fixed Mobile Navigation Bar */}
      {/* <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden z-50">
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
      </div> */}
    </div>
  );
};

export default Electricity;