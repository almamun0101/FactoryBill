"use client";
import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Zap,
  Settings,
  Calendar,
  Search,
  Wallet,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // --- Sample Data ---
  const billsData = {
    "2024-01": {
      recharge: 1500,
      electricity: { amount: 1250, units: 850 },
      machines: [
        { name: "AC Unit 1", reading: 320, hours: 300, cost: 420 },
        { name: "Compressor", reading: 210, hours: 200, cost: 320 },
        { name: "Printer", reading: 130, hours: 120, cost: 180 },
      ],
      otherCosts: { maintenance: 150, supplies: 80 },
    },
    "2024-02": {
      recharge: 1300,
      electricity: { amount: 1180, units: 780 },
      machines: [
        { name: "AC Unit 1", reading: 290, hours: 280, cost: 380 },
        { name: "Compressor", reading: 190, hours: 180, cost: 290 },
        { name: "Printer", reading: 110, hours: 100, cost: 160 },
      ],
      otherCosts: { maintenance: 120, supplies: 60 },
    },
    "2024-03": {
      recharge: 1650,
      electricity: { amount: 1420, units: 920 },
      machines: [
        { name: "AC Unit 1", reading: 350, hours: 320, cost: 480 },
        { name: "Compressor", reading: 230, hours: 220, cost: 350 },
        { name: "Printer", reading: 140, hours: 140, cost: 220 },
      ],
      otherCosts: { maintenance: 100, supplies: 90 },
    },
  };

  // --- Helpers ---
  const filteredMonths = Object.keys(billsData).filter((m) =>
    new Date(m)
      .toLocaleDateString("en-US", { month: "long", year: "numeric" })
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const getMonthLabel = (month) =>
    new Date(month).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

  const getTotal = (data) => {
    const machineTotal = data.machines.reduce((sum, m) => sum + m.cost, 0);
    const otherTotal = Object.values(data.otherCosts).reduce((a, b) => a + b, 0);
    return data.electricity.amount + machineTotal + otherTotal;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f8fc] to-[#eef1f7] p-6 font-sans">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto mb-10 text-center"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Monthly Bills & Machine Overview
        </h1>
        <p className="text-gray-600">
          Track your monthly electricity, recharge, and machine costs.
        </p>
      </motion.div>

      {/* Search */}
      <div className="max-w-md mx-auto mb-8 relative">
        <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search month (e.g. March)"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Cards */}
      <div className="max-w-5xl mx-auto space-y-6">
        {filteredMonths
          .sort((a, b) => new Date(b) - new Date(a))
          .map((month) => {
            const data = billsData[month];
            const isOpen = selectedMonth === month;
            const total = getTotal(data);
            const monthName = getMonthLabel(month);

            return (
              <motion.div
                key={month}
                layout
                transition={{ layout: { duration: 0.4, type: "spring" } }}
                className={`overflow-hidden rounded-2xl shadow-md border border-gray-200 ${
                  isOpen ? "bg-white" : "bg-gradient-to-r from-indigo-50 to-blue-50"
                }`}
              >
                {/* Header */}
                <motion.button
                  layout="position"
                  className="w-full flex justify-between items-center p-5 cursor-pointer"
                  onClick={() => setSelectedMonth(isOpen ? null : month)}
                >
                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-indigo-600" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        {monthName}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium text-gray-800">
                        Recharge:
                      </span>{" "}
                      ${data.recharge} &nbsp; | &nbsp;
                      <span className="font-medium text-gray-800">
                        Total Cost:
                      </span>{" "}
                      ${total}
                    </p>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </motion.button>

                {/* Expanded details */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4 }}
                      className="p-6 border-t border-gray-200 bg-white"
                    >
                      {/* Electricity */}
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-5"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="w-5 h-5 text-blue-500" />
                          <h4 className="font-semibold text-gray-800">
                            Electricity Usage
                          </h4>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg flex justify-between items-center text-sm">
                          <span className="text-gray-600">
                            {data.electricity.units} units used
                          </span>
                          <span className="font-semibold text-blue-600">
                            ${data.electricity.amount}
                          </span>
                        </div>
                      </motion.div>

                      {/* Machines */}
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-5"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Settings className="w-5 h-5 text-green-500" />
                          <h4 className="font-semibold text-gray-800">
                            Machine Readings
                          </h4>
                        </div>
                        <div className="space-y-2">
                          {data.machines.map((m, i) => (
                            <motion.div
                              key={i}
                              whileHover={{ scale: 1.02 }}
                              className="bg-green-50 p-3 rounded-lg shadow-sm flex justify-between items-center text-sm"
                            >
                              <div>
                                <p className="font-medium text-gray-800">
                                  {m.name}
                                </p>
                                <p className="text-gray-500">
                                  Reading: {m.reading} | Hours: {m.hours}
                                </p>
                              </div>
                              <div className="font-semibold text-green-600">
                                ${m.cost}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>

                      {/* Other Costs */}
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-5"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Wallet className="w-5 h-5 text-orange-500" />
                          <h4 className="font-semibold text-gray-800">
                            Other Costs
                          </h4>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-3 space-y-1">
                          {Object.entries(data.otherCosts).map(([k, v]) => (
                            <div
                              key={k}
                              className="flex justify-between text-sm text-gray-700"
                            >
                              <span className="capitalize">{k}</span>
                              <span className="font-medium">${v}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>

                      {/* Summary */}
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="border-t border-gray-200 pt-4"
                      >
                        <p className="font-semibold text-gray-900 text-lg flex justify-between">
                          <span>Total Monthly Cost</span>
                          <span className="text-indigo-600">${total}</span>
                        </p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        {filteredMonths.length === 0 && (
          <p className="text-center text-gray-500">No months found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
