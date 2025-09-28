"use client";
import React, { useState } from "react";
import {
  Zap,
  MapPin,
  Calendar,
  DollarSign,
  Home,
  BarChart3,
  User,
   Plus, 
  Settings, 
  MessageCircle,
  Activity,
  Save,
  TrendingUp
} from "lucide-react";

import { AiFillShop } from "react-icons/ai";
import { PiBuildingOfficeBold } from "react-icons/pi";

import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
   const today = new Date().toISOString().split("T")[0];


   const handleEbillSubmit = (e) => {
    e.preventDefault();
    console.log("Electricity:", ebill);
    // Add success animation or notification here
  };
  
    const [ebill, setEbill] = useState({
      date: today,
      amount: "",
      location: "office",
      comment: "",
    });

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-8 pb-24">
      <div className="max-w-5xl mx-auto space-y-12">
      
         {/* Electricity Bill Form */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Electricity Bill</h2>
              </div>
            </div>

            <div className="p-8 space-y-6">
              
              {/* Date Input */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  Date
                </label>
                <input
                  type="date"
                  value={ebill.date}
                  onChange={(e) => setEbill({ ...ebill, date: e.target.value })}
                  className="w-full border-2 border-gray-200 p-4 rounded-xl text-gray-800 
                            focus:border-blue-500 focus:ring-4 focus:ring-blue-100 
                            transition-all duration-200 bg-gray-50 focus:bg-white"
                  required
                />
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  Amount (৳)
                </label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={ebill.amount}
                  onChange={(e) => setEbill({ ...ebill, amount: e.target.value })}
                  className="w-full border-2 border-gray-200 p-4 rounded-xl text-gray-800 
                            focus:border-blue-500 focus:ring-4 focus:ring-blue-100 
                            transition-all duration-200 bg-gray-50 focus:bg-white"
                  required
                />
              </div>

              {/* Location Select */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <MapPin className="h-4 w-4 text-red-600" />
                  Location
                </label>
                <select
                  value={ebill.location}
                  onChange={(e) => setEbill({ ...ebill, location: e.target.value })}
                  className="w-full border-2 border-gray-200 p-4 rounded-xl text-gray-800 
                            focus:border-blue-500 focus:ring-4 focus:ring-blue-100 
                            transition-all duration-200 bg-gray-50 focus:bg-white"
                >
                  <option value="office">🏢 Office</option>
                  <option value="local">🏠 Local</option>
                </select>
              </div>

              {/* Comment Textarea */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <MessageCircle className="h-4 w-4 text-purple-600" />
                  Comment (Optional)
                </label>
                <textarea
                  placeholder="Add any additional notes..."
                  value={ebill.comment}
                  onChange={(e) => setEbill({ ...ebill, comment: e.target.value })}
                  className="w-full border-2 border-gray-200 p-4 rounded-xl text-gray-800 
                            focus:border-blue-500 focus:ring-4 focus:ring-blue-100 
                            transition-all duration-200 bg-gray-50 focus:bg-white h-24 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleEbillSubmit}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white 
                          px-6 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 
                          transition-all duration-300 font-semibold text-lg
                          flex items-center justify-center gap-2 shadow-lg hover:shadow-xl
                          transform hover:-translate-y-1"
              >
                <Save className="h-5 w-5" />
                Add Electricity Data
              </button>
            </div>
          </div>

        {/* Electricity Table */}
        <section className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6">
            <h2 className="text-2xl font-bold text-white text-center flex items-center justify-center gap-3">
              <Calendar className="h-6 w-6" />
              Electricity Consumption Details
            </h2>
          </div>

          <div className="p-6">
            {/* Table Columns */}
            <div className="grid grid-cols-4 gap-4 p-3 bg-gray-50 rounded-xl font-semibold text-gray-700 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" /> Date
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" /> Amount
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-red-600" /> Location
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-600" /> Final Cost
              </div>
            </div>

            {/* Table Rows */}
            <div className="space-y-3">
              {data.map((item, index) => {
                const newValue = item.amount * (1 - percentageDecrease / 100);
                const isOffice = item.place === "Office";

                return (
                  <div
                    key={index}
                    className="grid grid-cols-4 gap-4 p-4 rounded-xl border border-gray-200 
                               hover:border-blue-300 hover:bg-blue-50 transition-all duration-300
                               hover:shadow-sm"
                  >
                    <span className="text-gray-800 font-medium">
                      {item.date}
                    </span>

                    <span className="text-lg font-bold text-green-600">
                      ৳{parseInt(item.amount).toLocaleString()}
                    </span>

                    <span
                      className={`font-semibold flex justify-center items-center rounded-full text-sm `}
                    >
                      {isOffice ? (
                        <PiBuildingOfficeBold size={30} />
                      ) : (
                        <AiFillShop size={30} />
                      )}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        ৳
                        {isOffice
                          ? parseInt(item.amount).toLocaleString()
                          : Math.round(newValue).toLocaleString()}
                      </span>
                      {!isOffice && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                          -{percentageDecrease}%
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Table Footer */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">
                      Total Consumption
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Combined electricity costs
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    ৳
                    {data
                      .reduce((total, item) => {
                        const newValue =
                          item.amount * (1 - percentageDecrease / 100);
                        return (
                          total +
                          (item.place === "Office"
                            ? parseInt(item.amount)
                            : newValue)
                        );
                      }, 0)
                      .toLocaleString()}
                  </p>
                  <p className="text-gray-500 text-sm">Current period</p>
                </div>
              </div>
            </div>
          </div>
        </section> 

        {/* Total Monthly Consumption */}
        <section className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl shadow-xl p-10 text-center text-white">
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
        </section>
      </div>

      {/* Fixed Mobile Navigation Bar */}
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
                <span
                  className={`text-xs font-medium ${
                    item.active ? "text-blue-600" : "text-gray-600"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default page;
