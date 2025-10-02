"use client"
import React, { useState } from "react";
import {
  Calendar,
  Activity,
  X,
  Zap,
  Trash2,
  ChevronRight,
} from "lucide-react";
import firebaseConfig from "../firebase.config";
// Mock data - replace with your Firebase data
const initialMachines = [
  { id: "m1", size: "Machine A - 50HP" },
  { id: "m2", size: "Machine B - 75HP" },
  { id: "m3", size: "Machine C - 100HP" },
];

const initialReadings = [
  { id: "r1", machineId: "m1", machineSize: "Machine A - 50HP", date: "2024-09-15", month: "September 2024", meter: 15420, electricity: 850 },
  { id: "r2", machineId: "m2", machineSize: "Machine B - 75HP", date: "2024-09-18", month: "September 2024", meter: 22100, electricity: 1200 },
  { id: "r3", machineId: "m1", machineSize: "Machine A - 50HP", date: "2024-10-01", month: "October 2024", meter: 16300, electricity: 880 },
];

const page = () => {
  const [machines] = useState(initialMachines);
  const [readings, setReadings] = useState(initialReadings);
  const [showAddReading, setShowAddReading] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [newReading, setNewReading] = useState({ 
    date: "", 
    meter: ""
  });

  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleAddReading = () => {
    if (!newReading.date || !newReading.meter || !selectedMachine) {
      alert("Please fill in all fields");
      return;
    }

    const meterValue = parseInt(newReading.meter);
    const dateObj = new Date(newReading.date);
    const month = dateObj.toLocaleDateString("en-US", { 
      month: "long", 
      year: "numeric" 
    });

    const machineReadings = readings
      .filter(r => r.machineId === selectedMachine.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const lastReading = machineReadings.length > 0 ? machineReadings[0] : null;
    const electricityUsed = lastReading ? meterValue - lastReading.meter : meterValue;

    if (electricityUsed < 0) {
      alert("New meter reading must be greater than the last reading");
      return;
    }

    const newReadingData = {
      id: `r${Date.now()}`,
      machineId: selectedMachine.id,
      machineSize: selectedMachine.size,
      date: newReading.date,
      month: month,
      meter: meterValue,
      electricity: electricityUsed,
    };

    setReadings([newReadingData, ...readings]);
    setShowAddReading(false);
    setNewReading({ date: "", meter: "" });
    setSelectedMachine(null);
  };

  const handleDeleteReading = (readingId) => {
    if (!confirm("Delete this reading?")) return;
    setReadings(readings.filter(r => r.id !== readingId));
  };

  const getMachineStats = (machineId) => {
    const machineReadings = readings.filter(r => r.machineId === machineId);
    const totalElectricity = machineReadings.reduce((sum, r) => sum + (r.electricity || 0), 0);
    const sortedReadings = machineReadings.sort((a, b) => new Date(b.date) - new Date(a.date));
    const latestReading = sortedReadings[0] || { meter: 0 };
    return { 
      count: machineReadings.length, 
      total: totalElectricity,
      latest: latestReading.meter 
    };
  };

  const totalReadingsCount = readings.length;
  const totalConsumption = readings.reduce((sum, r) => sum + (r.electricity || 0), 0);

  return (
    <div className="min-h-screen max-5xl ml-80 mx-auto bg-gray-50 pb-20">
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Meter Tracker</h1>
              <p className="text-sm text-gray-500 mt-0.5">{currentDate}</p>
            </div>
            <Activity className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{machines.length}</div>
            <div className="text-xs text-gray-600 mt-1">Machines</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{totalReadingsCount}</div>
            <div className="text-xs text-gray-600 mt-1">Readings</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{totalConsumption.toLocaleString()}</div>
            <div className="text-xs text-gray-600 mt-1">Total kWh</div>
          </div>
        </div>

        {/* Machines */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3 px-1">Machines</h2>
          <div className="space-y-3">
            {machines.map((machine) => {
              const stats = getMachineStats(machine.id);
              return (
                <div
                  key={machine.id}
                  onClick={() => {
                    setSelectedMachine(machine);
                    setShowAddReading(true);
                  }}
                  className="bg-white rounded-lg p-4 border border-gray-200 active:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{machine.size}</h3>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          {stats.count} readings
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Latest: </span>
                          <span className="font-semibold text-gray-900">{stats.latest.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Total: </span>
                          <span className="font-semibold text-blue-600">{stats.total.toLocaleString()} kWh</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* All Readings */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3 px-1">Recent Readings</h2>
          {readings.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
              <Calendar className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No readings yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {readings.sort((a, b) => new Date(b.date) - new Date(a.date)).map((reading) => (
                <div
                  key={reading.id}
                  className="bg-white rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{reading.machineSize}</h4>
                        <span className="text-xs text-gray-500 bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                          {reading.month}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">
                        {new Date(reading.date).toLocaleDateString("en-US", { 
                          month: "short", 
                          day: "numeric", 
                          year: "numeric" 
                        })}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Meter: </span>
                          <span className="font-semibold text-gray-900">{reading.meter.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Used: </span>
                          <span className="font-semibold text-blue-600">{reading.electricity.toLocaleString()} kWh</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteReading(reading.id);
                      }}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Reading Modal */}
      {showAddReading && selectedMachine && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => {
              setShowAddReading(false);
              setSelectedMachine(null);
              setNewReading({ date: "", meter: "" });
            }}
          />
          <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl z-50 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Add Reading</h3>
                <p className="text-sm text-gray-500">{selectedMachine.size}</p>
              </div>
              <button
                onClick={() => {
                  setShowAddReading(false);
                  setSelectedMachine(null);
                  setNewReading({ date: "", meter: "" });
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Form */}
            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reading Date
                </label>
                <input
                  type="date"
                  value={newReading.date}
                  onChange={(e) => setNewReading({ ...newReading, date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meter Reading
                </label>
                <input
                  type="number"
                  value={newReading.meter}
                  onChange={(e) => setNewReading({ ...newReading, meter: e.target.value })}
                  placeholder="Enter current meter reading"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-base"
                />
                {getMachineStats(selectedMachine.id).latest > 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Last reading: {getMachineStats(selectedMachine.id).latest.toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 space-y-2">
              <button
                onClick={handleAddReading}
                className="w-full py-3.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors"
              >
                Add Reading
              </button>
              <button
                onClick={() => {
                  setShowAddReading(false);
                  setSelectedMachine(null);
                  setNewReading({ date: "", meter: "" });
                }}
                className="w-full py-3.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default page;