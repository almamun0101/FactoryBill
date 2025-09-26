import React from "react";
import { Zap, MapPin, Calendar, DollarSign, Activity } from "lucide-react";

const Electricity = () => {
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
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Electricity Dashboard</h1>
          </div>
          <p className="text-gray-600 text-lg">Monitor and manage your electricity consumption</p>
        </div>

        {/* Machines Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Activity className="h-6 w-6 text-blue-600" />
            Machine Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
            {machines.map((m, i) => (
              <div
                key={i}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 
                           border border-gray-100 overflow-hidden transform hover:-translate-y-2"
              >
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                  <h3 className="text-2xl font-bold text-white text-center">{m.size}</h3>
                </div>
                <div className="p-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <span className="flex items-center gap-2 font-semibold text-gray-700">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        Meter Reading
                      </span>
                      <span className="text-xl font-bold text-gray-900">{m.meter}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                      <span className="flex items-center gap-2 font-semibold text-gray-700">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        Electricity Usage
                      </span>
                      <span className="text-xl font-bold text-blue-600">{m.electricity}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl shadow-xl p-8 text-center text-white mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-white/20 rounded-full">
              <Zap className="h-12 w-12" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2">Total Monthly Consumption</h2>
          <p className="text-5xl font-bold mb-2">৳{totalElectricity.toLocaleString()}</p>
          <p className="text-green-100 text-lg">Current billing period</p>
        </div>

        {/* Electricity Table Section */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6">
            <h2 className="text-2xl font-bold text-white text-center flex items-center justify-center gap-3">
              <Calendar className="h-6 w-6" />
              Electricity Consumption Details
            </h2>
          </div>
          
          <div className="p-8">
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl mb-4">
              <div className="flex items-center gap-2 font-bold text-gray-700">
                <Calendar className="h-4 w-4 text-blue-600" />
                Date
              </div>
              <div className="flex items-center gap-2 font-bold text-gray-700">
                <DollarSign className="h-4 w-4 text-green-600" />
                Amount
              </div>
              <div className="flex items-center gap-2 font-bold text-gray-700">
                <MapPin className="h-4 w-4 text-red-600" />
                Location
              </div>
              <div className="flex items-center gap-2 font-bold text-gray-700">
                <Zap className="h-4 w-4 text-yellow-600" />
                Final Cost
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
                               hover:shadow-md"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-800 font-medium">{item.date}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-green-600 bg-green-50 px-3 py-1 rounded-lg">
                        ৳{parseInt(item.amount).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${isOffice ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
                      <span className={`font-semibold px-3 py-1 rounded-full text-sm ${
                        isOffice 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {item.place}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">
                        ৳{isOffice ? parseInt(item.amount).toLocaleString() : Math.round(newValue).toLocaleString()}
                      </span>
                      {!isOffice && (
                        <span className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                          -{percentageDecrease}%
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary Footer */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Total Consumption</h3>
                    <p className="text-gray-600 text-sm">Combined electricity costs</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-blue-600">
                    ৳{data.reduce((total, item) => {
                      const newValue = item.amount * (1 - percentageDecrease / 100);
                      return total + (item.place === "Office" ? parseInt(item.amount) : newValue);
                    }, 0).toLocaleString()}
                  </p>
                  <p className="text-gray-500 text-sm">Current period</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Electricity;