"use client";
import React from "react";
import {
  Zap,
  MapPin,
  Calendar,
  DollarSign,
  Activity,
  Settings,
} from "lucide-react";
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
    { date: "01 / 10 / 2025", amount: "50000", place: "Office" },
    { date: "01 / 10 / 2025", amount: "50000", place: "Local" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header Section */}
        <header className="flex flex-col items-center gap-4 text-center relative">
          <div className="flex items-center gap-3 ">
            <div className="p-3 bg-blue-600 rounded-full shadow-md">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Factory Dashboard
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Monitor and manage your electricity consumption
          </p>
          <button
            onClick={() => router.push("/setting")}
            className="absolute top-0 right-0 flex items-center gap-2 px-5 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-all shadow-md"
          >
            <Settings size={18} />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </header>

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
                    <span className="text-gray-800 font-medium">{item.date}</span>

                    <span className="text-lg font-bold text-green-600">
                      ৳{parseInt(item.amount).toLocaleString()}
                    </span>

                    <span
                      className={`font-semibold px-3 py-1 rounded-full text-sm ${
                        isOffice
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {item.place}
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
                    <h3 className="font-bold text-gray-900">Total Consumption</h3>
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
      </div>
    </div>
  );
};

export default Electricity;
