"use client";
import React, { useState } from "react";
import { 
  Plus, 
  Zap, 
  Settings, 
  Calendar, 
  DollarSign, 
  MapPin, 
  MessageCircle,
  Activity,
  Save,
  TrendingUp
} from "lucide-react";

export default function AddDataPage() {
  const today = new Date().toISOString().split("T")[0];

  const [ebill, setEbill] = useState({
    date: today,
    amount: "",
    location: "office",
    comment: "",
  });

  const [machine, setMachine] = useState({
    name: "",
    date: today,
    reading: "",
  });

  const lastMachineReading = 12000;

  const handleEbillSubmit = (e) => {
    e.preventDefault();
    console.log("Electricity:", ebill);
    // Add success animation or notification here
  };

  const handleMachineSubmit = (e) => {
    e.preventDefault();
    console.log("Machine:", machine);
    // Add success animation or notification here
  };

  const calculateUsage = () => {
    if (machine.reading && lastMachineReading) {
      return parseInt(machine.reading) - lastMachineReading;
    }
    return 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 
                          text-white px-8 py-4 rounded-3xl shadow-lg mb-6">
            <Plus className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Add New Data</h1>
          </div>
          <p className="text-gray-600 text-lg">Enter electricity bills and machine readings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
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

          {/* Machine Meter Reading Form */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Machine Reading</h2>
              </div>
            </div>

            <div className="p-8 space-y-6">
              
              {/* Last Reading Info */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-5 w-5 text-orange-600" />
                  <span className="font-semibold text-gray-700">Last Reading</span>
                </div>
                <p className="text-2xl font-bold text-orange-600">{lastMachineReading.toLocaleString()}</p>
              </div>

              {/* Machine Select */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Settings className="h-4 w-4 text-gray-600" />
                  Machine
                </label>
                <select
                  value={machine.name}
                  onChange={(e) => setMachine({ ...machine, name: e.target.value })}
                  className="w-full border-2 border-gray-200 p-4 rounded-xl text-gray-800 
                            focus:border-green-500 focus:ring-4 focus:ring-green-100 
                            transition-all duration-200 bg-gray-50 focus:bg-white"
                  required
                >
                  <option value="">Select Machine</option>
                  <option value="Machine A">⚙️ Machine A</option>
                  <option value="Machine B">⚙️ Machine B</option>
                </select>
              </div>

              {/* Date Input */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Calendar className="h-4 w-4 text-green-600" />
                  Date
                </label>
                <input
                  type="date"
                  value={machine.date}
                  onChange={(e) => setMachine({ ...machine, date: e.target.value })}
                  className="w-full border-2 border-gray-200 p-4 rounded-xl text-gray-800 
                            focus:border-green-500 focus:ring-4 focus:ring-green-100 
                            transition-all duration-200 bg-gray-50 focus:bg-white"
                  required
                />
              </div>

              {/* Reading Input */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  New Reading
                </label>
                <input
                  type="number"
                  placeholder="Enter new reading"
                  value={machine.reading}
                  onChange={(e) => setMachine({ ...machine, reading: e.target.value })}
                  className="w-full border-2 border-gray-200 p-4 rounded-xl text-gray-800 
                            focus:border-green-500 focus:ring-4 focus:ring-green-100 
                            transition-all duration-200 bg-gray-50 focus:bg-white"
                  required
                />
              </div>

              {/* Usage Calculation */}
              {machine.reading && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-700">Usage Difference:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {calculateUsage().toLocaleString()} units
                    </span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleMachineSubmit}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white 
                          px-6 py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 
                          transition-all duration-300 font-semibold text-lg
                          flex items-center justify-center gap-2 shadow-lg hover:shadow-xl
                          transform hover:-translate-y-1"
              >
                <Save className="h-5 w-5" />
                Add Machine Reading
              </button>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">💡 Quick Tips</h3>
            <p className="text-gray-600">
              Make sure to enter accurate readings for proper billing calculations. 
              All fields marked as required must be filled before submission.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}