"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Zap, Settings, Calendar } from "lucide-react";

const Dashboard = () => {
  // Simple demo data
  const billsData = [
    { month: "Jan", electricity: 1250, machines: 920, others: 230 },
    { month: "Feb", electricity: 1180, machines: 830, others: 260 },
    { month: "Mar", electricity: 1420, machines: 1050, others: 210 },
    { month: "Apr", electricity: 1380, machines: 990, others: 250 },
    { month: "May", electricity: 1520, machines: 1120, others: 300 },
    { month: "Jun", electricity: 1680, machines: 1240, others: 280 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 animate-fade-in">
          Monthly Bill Summary
        </h1>
        <p className="text-gray-600">Track your energy and machine costs easily</p>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg hover:-translate-y-1 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <Zap className="text-blue-500 w-6 h-6" />
            <h2 className="font-semibold text-gray-800">Electricity</h2>
          </div>
          <p className="text-2xl font-bold text-gray-900">$1,680</p>
          <p className="text-sm text-gray-500">Last Month: $1,520</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg hover:-translate-y-1 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <Settings className="text-green-500 w-6 h-6" />
            <h2 className="font-semibold text-gray-800">Machines</h2>
          </div>
          <p className="text-2xl font-bold text-gray-900">$1,240</p>
          <p className="text-sm text-gray-500">Last Month: $1,120</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg hover:-translate-y-1 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="text-orange-500 w-6 h-6" />
            <h2 className="font-semibold text-gray-800">Other Costs</h2>
          </div>
          <p className="text-2xl font-bold text-gray-900">$280</p>
          <p className="text-sm text-gray-500">Last Month: $300</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          6-Month Overview
        </h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={billsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="month" stroke="#555" />
              <YAxis stroke="#555" />
              <Tooltip formatter={(v) => `$${v}`} />
              <Bar dataKey="electricity" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="machines" fill="#10B981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="others" fill="#F59E0B" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Small Footer */}
      <p className="text-center text-gray-500 text-sm mt-8">
        © 2025 Smart Energy Dashboard
      </p>
    </div>
  );
};

export default Dashboard;
