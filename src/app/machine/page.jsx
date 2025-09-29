"use client";
import { useState } from "react";
import {
  Calendar,
  Plus,
  TrendingDown,
  Hash,
  Activity,
  X,
  Zap,
} from "lucide-react";

export default function Page() {
  const [machines, setMachines] = useState([
    {
      id: 1,
      size: "8 Ounces",
      readings: [
        { date: "2025-09-01", meter: 10000, electricity: 10000 },
        { date: "2025-09-15", meter: 15000, electricity: 5000 },
      ],
    },
    {
      id: 2,
      size: "5 Ounces",
      readings: [
        { date: "2025-09-01", meter: 10000, electricity: 10000 },
        { date: "2025-09-10", meter: 12000, electricity: 2000 },
      ],
    },
  ]);

  const [selectedMachine, setSelectedMachine] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [newReading, setNewReading] = useState({
    date: "",
    meter: "",
  });

  // format today’s date
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const handleCardClick = (machine) => {
    setSelectedMachine(machine);
    setShowSidebar(true);
    setNewReading({ date: "", meter: "" });
  };

  const handleAddReading = () => {
    if (!newReading.date || !newReading.meter) {
      alert("Please fill in all fields");
      return;
    }

    const meterValue = parseInt(newReading.meter);
    const lastReading =
      selectedMachine.readings[selectedMachine.readings.length - 1];
    const electricityUsed = meterValue - lastReading.meter;

    if (electricityUsed < 0) {
      alert("New meter reading must be greater than the last reading");
      return;
    }

    const updatedMachines = machines.map((m) => {
      if (m.id === selectedMachine.id) {
        return {
          ...m,
          readings: [
            ...m.readings,
            {
              date: newReading.date,
              meter: meterValue,
              electricity: electricityUsed,
            },
          ],
        };
      }
      return m;
    });

    setMachines(updatedMachines);
    setShowSidebar(false);
    setNewReading({ date: "", meter: "" });
  };

  const getLatestReading = (machine) => {
    return machine.readings[machine.readings.length - 1];
  };

  const getTotalElectricity = (machine) => {
    return machine.readings.reduce((sum, r) => sum + r.electricity, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-2 pb-24">
      <div className="max-w-5xl mx-auto space-y-5">
        {/* Header Section */}
        <header className="text-center">
          <div className="mt-2 flex items-center justify-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>Today, {currentDate}</span>
          </div>
        </header>

        {/* Machine Cards */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Activity className="h-6 w-6 text-blue-600" />
              Machine Overview
            </h2>
            <span className="text-sm text-gray-500 font-medium">
              {machines.length} Machines Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {machines.map((machine) => {
              const latest = getLatestReading(machine);
              const total = getTotalElectricity(machine);

              return (
                <div
                  key={machine.id}
                  onClick={() => handleCardClick(machine)}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2 hover:scale-105"
                >
                  <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-2xl font-bold text-white">
                          {machine.size}
                        </h3>
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                          <Zap className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <p className="text-blue-100 text-sm font-medium">
                        {machine.readings.length} readings recorded
                      </p>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4 text-gray-600" />
                        <span className="font-medium text-gray-700">
                          Current Meter
                        </span>
                      </div>
                      <span className="text-xl font-bold text-gray-900">
                        {latest.meter.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-gray-700">
                          Total Usage
                        </span>
                      </div>
                      <span className="text-xl font-bold text-blue-600">
                        {total.toLocaleString()}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-gray-200">
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <Plus className="h-4 w-4" />
                        <span className="font-medium">Click to add reading</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Summary Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold opacity-90">
                Total Machines
              </h3>
              <Activity className="h-8 w-8 opacity-80" />
            </div>
            <p className="text-4xl font-bold">{machines.length}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold opacity-90">
                Total Readings
              </h3>
              <Calendar className="h-8 w-8 opacity-80" />
            </div>
            <p className="text-4xl font-bold">
              {machines.reduce((sum, m) => sum + m.readings.length, 0)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold opacity-90">
                Total Consumption
              </h3>
              <Zap className="h-8 w-8 opacity-80" />
            </div>
            <p className="text-4xl font-bold">
              {machines
                .reduce((sum, m) => sum + getTotalElectricity(m), 0)
                .toLocaleString()}
            </p>
          </div>
        </section>
      </div>

      {/* Sidebar */}
      {showSidebar && selectedMachine && (
        <div className="fixed left-0 top-0 h-screen w-[350px] bg-white shadow-2xl z-50 animate-in slide-in-from-left duration-300 flex flex-col">
          {/* Sidebar Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold">{selectedMachine.size}</h3>
              <p className="text-blue-100 text-sm mt-1">Add new meter reading</p>
            </div>
            <button
              onClick={() => setShowSidebar(false)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {/* Reading History */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Reading History
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedMachine.readings.map((reading, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl text-sm"
                  >
                    <span className="text-gray-600 font-medium">
                      {reading.date}
                    </span>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-900 font-semibold">
                        Meter: {reading.meter.toLocaleString()}
                      </span>
                      <span className="text-blue-600 font-semibold">
                        Used: {reading.electricity.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* New Reading Form */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Plus className="h-5 w-5 text-blue-600" />
                New Reading
              </h4>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={newReading.date}
                  onChange={(e) =>
                    setNewReading({ ...newReading, date: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meter Reading
                </label>
                <input
                  type="number"
                  value={newReading.meter}
                  onChange={(e) =>
                    setNewReading({ ...newReading, meter: e.target.value })
                  }
                  placeholder="Enter meter reading"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Last reading:{" "}
                  {getLatestReading(selectedMachine).meter.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3">
            <button
              onClick={() => setShowSidebar(false)}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddReading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
            >
              Add Reading
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
