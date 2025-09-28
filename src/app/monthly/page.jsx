"use client"
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, DollarSign, Zap, Settings, Eye, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);

  // Sample data - replace with your actual data
  const billsData = {
    '2024-01': {
      electricity: { amount: 1250, units: 850, rate: 1.47 },
      machines: [
        { name: 'AC Unit 1', cost: 420, hours: 300 },
        { name: 'Industrial Printer', cost: 180, hours: 120 },
        { name: 'Compressor', cost: 320, hours: 200 }
      ],
      otherCosts: { maintenance: 150, supplies: 80 }
    },
    '2024-02': {
      electricity: { amount: 1180, units: 780, rate: 1.51 },
      machines: [
        { name: 'AC Unit 1', cost: 380, hours: 280 },
        { name: 'Industrial Printer', cost: 160, hours: 100 },
        { name: 'Compressor', cost: 290, hours: 180 }
      ],
      otherCosts: { maintenance: 200, supplies: 60 }
    },
    '2024-03': {
      electricity: { amount: 1420, units: 920, rate: 1.54 },
      machines: [
        { name: 'AC Unit 1', cost: 480, hours: 320 },
        { name: 'Industrial Printer', cost: 220, hours: 140 },
        { name: 'Compressor', cost: 350, hours: 220 }
      ],
      otherCosts: { maintenance: 120, supplies: 90 }
    },
    '2024-04': {
      electricity: { amount: 1380, units: 880, rate: 1.57 },
      machines: [
        { name: 'AC Unit 1', cost: 450, hours: 310 },
        { name: 'Industrial Printer', cost: 200, hours: 130 },
        { name: 'Compressor', cost: 340, hours: 210 }
      ],
      otherCosts: { maintenance: 180, supplies: 70 }
    },
    '2024-05': {
      electricity: { amount: 1520, units: 980, rate: 1.55 },
      machines: [
        { name: 'AC Unit 1', cost: 520, hours: 350 },
        { name: 'Industrial Printer', cost: 240, hours: 150 },
        { name: 'Compressor', cost: 380, hours: 240 }
      ],
      otherCosts: { maintenance: 160, supplies: 100 }
    },
    '2024-06': {
      electricity: { amount: 1680, units: 1050, rate: 1.60 },
      machines: [
        { name: 'AC Unit 1', cost: 580, hours: 380 },
        { name: 'Industrial Printer', cost: 260, hours: 160 },
        { name: 'Compressor', cost: 420, hours: 260 }
      ],
      otherCosts: { maintenance: 140, supplies: 85 }
    }
  };

  const getMonthlyTotals = (data) => {
    const machineCost = data.machines.reduce((sum, machine) => sum + machine.cost, 0);
    const otherCosts = Object.values(data.otherCosts).reduce((sum, cost) => sum + cost, 0);
    const total = data.electricity.amount + machineCost + otherCosts;
    return { machineCost, otherCosts, total };
  };

  const getPercentageChange = (current, previous)=> {
    if (!previous) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const MonthCard = ({ month, data, index, totalMonths }) => {
    const { machineCost, otherCosts, total } = getMonthlyTotals(data);
    const monthName = new Date(month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const shortMonth = new Date(month).toLocaleDateString('en-US', { month: 'short' });
    
    // Calculate change from previous month
    const months = Object.keys(billsData).sort();
    const currentIndex = months.indexOf(month);
    const previousMonth = currentIndex > 0 ? months[currentIndex - 1] : null;
    const prevTotal = previousMonth ? getMonthlyTotals(billsData[previousMonth]).total : 0;

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        {/* Month Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">{monthName}</h3>
            </div>
            <button
              onClick={() => setSelectedMonth(selectedMonth === month ? null : month)}
              className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
            >
              <Eye className="w-4 h-4" />
              Details
              <ChevronRight className={`w-4 h-4 transition-transform ${selectedMonth === month ? 'rotate-90' : ''}`} />
            </button>
          </div>
        </div>

        {/* Summary Section */}
        <div className="p-6">
          {/* Total Cost */}
          <div className="mb-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Total Monthly Cost</p>
            <p className="text-3xl font-bold text-gray-900">${total.toLocaleString()}</p>
            {prevTotal > 0 && (
              <div className="flex items-center justify-center gap-1 mt-2">
                {total > prevTotal ? (
                  <TrendingUp className="w-4 h-4 text-red-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-green-500" />
                )}
                <span className={`text-sm font-medium ${total > prevTotal ? 'text-red-500' : 'text-green-500'}`}>
                  {total > prevTotal ? '+' : ''}{getPercentageChange(total, prevTotal)}%
                </span>
                <span className="text-xs text-gray-500">vs prev month</span>
              </div>
            )}
          </div>

          {/* Cost Breakdown */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Zap className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600 mb-1">Electricity</p>
              <p className="font-semibold text-gray-900">${data.electricity.amount}</p>
              <p className="text-xs text-gray-500">{data.electricity.units} units</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <Settings className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600 mb-1">Machines</p>
              <p className="font-semibold text-gray-900">${machineCost}</p>
              <p className="text-xs text-gray-500">{data.machines.length} machines</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="w-6 h-6 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-orange-600 font-bold text-sm">+</span>
              </div>
              <p className="text-xs text-gray-600 mb-1">Others</p>
              <p className="font-semibold text-gray-900">${otherCosts}</p>
              <p className="text-xs text-gray-500">Misc costs</p>
            </div>
          </div>

          {/* Mini Chart */}
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{
                name: shortMonth,
                electricity: data.electricity.amount,
                machines: machineCost,
                other: otherCosts
              }]}>
                <Bar dataKey="electricity" stackId="a" fill="#3B82F6" />
                <Bar dataKey="machines" stackId="a" fill="#10B981" />
                <Bar dataKey="other" stackId="a" fill="#F59E0B" />
                <Tooltip formatter={(value) => `$${value}`} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed View */}
        {selectedMonth === month && (
          <div className="border-t border-gray-200 bg-gray-50">
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Machine Details */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Machine Breakdown</h4>
                  <div className="space-y-2">
                    {data.machines.map((machine, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-white rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{machine.name}</p>
                          <p className="text-xs text-gray-500">{machine.hours} hours</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${machine.cost}</p>
                          <p className="text-xs text-gray-500">${(machine.cost / machine.hours).toFixed(2)}/hr</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cost Summary & Chart */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Distribution</h4>
                  <div className="h-40 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Electricity', value: data.electricity.amount, fill: '#3B82F6' },
                            { name: 'Machines', value: machineCost, fill: '#10B981' },
                            { name: 'Other', value: otherCosts, fill: '#F59E0B' }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={70}
                          paddingAngle={5}
                          dataKey="value"
                        >
                        </Pie>
                        <Tooltip formatter={(value) => `$${value}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(data.otherCosts).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 capitalize">{key}</span>
                        <span className="font-medium">${value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen  bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Monthly Bills Dashboard</h1>
          <p className="text-gray-600">Track your electricity, machine costs, and expenses by month</p>
        </div>

        {/* Monthly Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {Object.entries(billsData)
            .sort(([a], [b]) => new Date(b) - new Date(a)) // Sort by newest first
            .map(([month, data], index) => (
            <MonthCard
              key={month}
              month={month}
              data={data}
              index={index}
              totalMonths={Object.keys(billsData).length}
            />
          ))}
        </div>

        {/* Overall Summary */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">6-Month Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={Object.entries(billsData).map(([month, data]) => {
                const { machineCost, otherCosts } = getMonthlyTotals(data);
                return {
                  month: new Date(month).toLocaleDateString('en-US', { month: 'short' }),
                  electricity: data.electricity.amount,
                  machines: machineCost,
                  other: otherCosts,
                  total: data.electricity.amount + machineCost + otherCosts
                };
              })}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString()}`, '']}
                  labelStyle={{ color: '#374151' }}
                  contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
                />
                <Bar dataKey="electricity" stackId="a" fill="#3B82F6" name="Electricity" />
                <Bar dataKey="machines" stackId="a" fill="#10B981" name="Machines" />
                <Bar dataKey="other" stackId="a" fill="#F59E0B" name="Other Costs" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;