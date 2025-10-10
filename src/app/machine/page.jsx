"use client";
import React, { useState } from "react";
import { Activity, Plus, ChevronRight, ArrowLeft, X } from "lucide-react";

const ELECTRICITY_RATE = 7.5; // BDT per kWh

export default function MeterTracker() {
  const [machines, setMachines] = useState([
    { id: "m1", name: "Compressor A", model: "MDX-100", size: "50HP" },
    { id: "m2", name: "Motor B", model: "MR-75", size: "75HP" },
  ]);

  const [readings, setReadings] = useState([
    { id: "r1", machineId: "m1", date: "2024-09-15", meter: 15420, usage: 850 },
    { id: "r2", machineId: "m1", date: "2024-10-15", meter: 16270, usage: 850 },
    { id: "r3", machineId: "m2", date: "2024-09-20", meter: 22000, usage: 1100 },
  ]);

  const [showAddMachine, setShowAddMachine] = useState(false);
  const [showDetail, setShowDetail] = useState(null); // machineId
  const [newMachine, setNewMachine] = useState({
    name: "",
    model: "",
    size: "",
  });

  const addMachine = () => {
    if (!newMachine.name || !newMachine.model || !newMachine.size) {
      alert("Please fill all fields!");
      return;
    }
    const newMachineData = {
      id: `m${Date.now()}`,
      ...newMachine,
    };
    setMachines([...machines, newMachineData]);
    setNewMachine({ name: "", model: "", size: "" });
    setShowAddMachine(false);
  };

  const getMachineStats = (machineId) => {
    const machineReadings = readings
      .filter((r) => r.machineId === machineId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    const last = machineReadings[0];
    const totalUsage = machineReadings.reduce((sum, r) => sum + r.usage, 0);
    const lastMonthUsage = last ? last.usage : 0;
    const estimatedBill = (lastMonthUsage * ELECTRICITY_RATE).toFixed(2);
    return { totalUsage, lastMonthUsage, estimatedBill };
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // -------------------- Dashboard View --------------------
  if (!showDetail) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 md:ml-80">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
              Machine Tracker
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">{currentDate}</p>
          </div>
          <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
        </div>

        {/* Body */}
        <div className="px-3 sm:px-4 py-5 space-y-4">
          {/* Stats Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div>
              <h2 className="text-xs sm:text-sm text-gray-600">Total Machines</h2>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {machines.length}
              </p>
            </div>
            <button
              onClick={() => setShowAddMachine(true)}
              className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
            >
              <Plus size={16} className="sm:hidden" />
              <Plus size={18} className="hidden sm:inline" />
              Add Machine
            </button>
          </div>

          {/* Machine Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {machines.map((machine) => {
              const stats = getMachineStats(machine.id);
              return (
                <div
                  key={machine.id}
                  onClick={() => setShowDetail(machine.id)}
                  className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 hover:shadow-md cursor-pointer transition"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900">
                      {machine.name}
                    </h3>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-1">
                    Model: {machine.model}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 mb-2">
                    Size: {machine.size}
                  </p>

                  <div className="text-xs sm:text-sm mt-3 space-y-1">
                    <div className="flex justify-between text-gray-700">
                      <span>Last Month Usage:</span>
                      <span className="font-semibold">
                        {stats.lastMonthUsage} kWh
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Estimated Bill:</span>
                      <span className="font-semibold text-blue-600">
                        ৳{stats.estimatedBill}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add Machine Modal */}
        {showAddMachine && (
          <>
            <div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setShowAddMachine(false)}
            />
            <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-xl z-50 max-h-[90vh] sm:max-w-md sm:mx-auto sm:rounded-lg overflow-y-auto">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-base sm:text-lg font-semibold">
                  Add Machine
                </h3>
                <button
                  onClick={() => setShowAddMachine(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-4 space-y-3 sm:space-y-4">
                <input
                  type="text"
                  placeholder="Machine Name"
                  value={newMachine.name}
                  onChange={(e) =>
                    setNewMachine({ ...newMachine, name: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base"
                />
                <input
                  type="text"
                  placeholder="Model Number"
                  value={newMachine.model}
                  onChange={(e) =>
                    setNewMachine({ ...newMachine, model: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base"
                />
                <input
                  type="text"
                  placeholder="Machine Size (e.g., 75HP)"
                  value={newMachine.size}
                  onChange={(e) =>
                    setNewMachine({ ...newMachine, size: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base"
                />
              </div>

              <div className="p-4 border-t space-y-2">
                <button
                  onClick={addMachine}
                  className="w-full py-2 sm:py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 text-sm sm:text-base"
                >
                  Add Machine
                </button>
                <button
                  onClick={() => setShowAddMachine(false)}
                  className="w-full py-2 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // -------------------- Machine Detail View --------------------
  const selectedMachine = machines.find((m) => m.id === showDetail);
  const machineReadings = readings
    .filter((r) => r.machineId === showDetail)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:ml-80">
      <button
        onClick={() => setShowDetail(null)}
        className="flex items-center gap-2 mb-4 text-blue-600 hover:underline text-sm sm:text-base"
      >
        <ArrowLeft size={16} className="sm:size-[18px]" /> Back
      </button>

      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 mb-5">
        <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
          {selectedMachine.name}
        </h2>
        <p className="text-xs sm:text-sm text-gray-500">
          Model: {selectedMachine.model} | Size: {selectedMachine.size}
        </p>
      </div>

      <div className="space-y-3">
        {machineReadings.length === 0 ? (
          <p className="text-gray-500 text-center py-10 text-sm">
            No readings available yet.
          </p>
        ) : (
          machineReadings.map((r) => (
            <div
              key={r.id}
              className="bg-white border border-gray-200 rounded-lg p-4 text-sm sm:text-base"
            >
              <div className="flex justify-between mb-1">
                <p className="text-gray-600">
                  {new Date(r.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p className="font-semibold text-gray-900">
                  {r.meter.toLocaleString()} meter
                </p>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Used:</span>
                <span className="text-blue-600 font-semibold">
                  {r.usage} kWh (৳{(r.usage * ELECTRICITY_RATE).toFixed(2)})
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
