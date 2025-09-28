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

const HomePage = () => {
  const router = useRouter();

  // Navigation items
  const navItems = [
    { icon: Home, label: "Home", route: "/", active: true },
    { icon: Zap, label: "Electricity", route: "/electricity" },
    { icon: Activity, label: "Machine", route: "/machine" },
    { icon: BarChart3, label: "Monthly", route: "/monthly" },
    { icon: User, label: "Profile", route: "/profile" },
  ];

  // Quick stats data
  const quickStats = [
    {
      title: "Total Consumption",
      value: "৳95,000",
      change: "+12%",
      icon: Zap,
      color: "blue",
      trend: "up",
    },
    {
      title: "Active Machines",
      value: "8",
      change: "+2",
      icon: Activity,
      color: "green",
      trend: "up",
    },
    {
      title: "Monthly Average",
      value: "৳31,667",
      change: "-5%",
      icon: BarChart3,
      color: "purple",
      trend: "down",
    },
    {
      title: "Alerts",
      value: "3",
      change: "+1",
      icon: AlertCircle,
      color: "red",
      trend: "up",
    },
  ];

  // Recent activities
  const recentActivities = [
    {
      action: "Machine 8oz started",
      time: "2 hours ago",
      status: "active",
    },
    {
      action: "Electricity bill updated",
      time: "5 hours ago",
      status: "completed",
    },
    {
      action: "Machine 5oz maintenance",
      time: "1 day ago",
      status: "pending",
    },
    {
      action: "Monthly report generated",
      time: "2 days ago",
      status: "completed",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-2 pb-24">
      <div className="max-w-5xl mx-auto space-y-5">
        {/* Header Section */}
        <header className="text-center">
          <div className="mt-2 flex items-center justify-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>Today, {new Date().toLocaleDateString('en-GB', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </header>

        {/* Quick Stats Grid */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Overview</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickStats.map((stat, index) => {
              const Icon = stat.icon;
              const colorClasses = {
                blue: "bg-blue-500 text-blue-600 bg-blue-50",
                green: "bg-green-500 text-green-600 bg-green-50",
                purple: "bg-purple-500 text-purple-600 bg-purple-50",
                red: "bg-red-500 text-red-600 bg-red-50",
              };

              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-full ${colorClasses[stat.color].split(' ')[2]}`}>
                      <Icon className={`h-6 w-6 ${colorClasses[stat.color].split(' ')[1]}`} />
                    </div>
                    <span
                      className={`text-sm font-medium px-2 py-1 rounded-full ${
                        stat.trend === "up"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </p>
                    <p className="text-gray-600 text-sm">{stat.title}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {navItems.slice(1).map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={() => router.push(item.route)}
                  className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300 group"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 bg-gray-50 rounded-full group-hover:bg-blue-50 transition-colors">
                      <Icon className="h-8 w-8 text-gray-600 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {item.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Recent Activities */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activities</h2>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        activity.status === "active"
                          ? "bg-blue-100 text-blue-700"
                          : activity.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Today's Summary */}
        <section className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl shadow-xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Today's Summary</h2>
              <p className="text-blue-100 mb-4">All systems running smoothly</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-sm">Efficiency: 95%</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  <span className="text-sm">Cost Savings: ৳2,500</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="p-4 bg-white/20 rounded-full">
                <BarChart3 className="h-12 w-12" />
              </div>
            </div>
          </div>
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
    </div>
  );
};

export default HomePage;