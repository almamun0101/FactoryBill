"use client"
import { useState } from "react";
import { RotateCcw, Settings, Save } from "lucide-react";

export default function BillingSettings() {
  const defaultSettings = {
    localOfficeBillPercentage: 5.0,
    taxOnMoney: 15.0,
    demandChargePerMeter: 250.0,
    serviceChargePerMeter: 75.0,
    electricityRatePerUnit: 8.50,
  };

  const [settings, setSettings] = useState(defaultSettings);
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to your backend/database
    console.log("Settings saved:", settings);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to previous values if needed
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Settings className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Billing Settings</h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Default
          </button>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit Settings
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Settings Display/Edit Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Local Office Bill Percentage */}
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Local Office Bill Percentage</h3>
          {!isEditing ? (
            <div className="text-3xl font-bold text-blue-600">
              {settings.localOfficeBillPercentage.toFixed(2)}%
            </div>
          ) : (
            <div>
              <input
                type="number"
                step="0.1"
                value={settings.localOfficeBillPercentage}
                onChange={(e) => handleInputChange('localOfficeBillPercentage', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">Percentage applied to local office bills</p>
            </div>
          )}
        </div>

        {/* Tax on Money */}
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Tax on Money</h3>
          {!isEditing ? (
            <div className="text-3xl font-bold text-red-600">
              {settings.taxOnMoney.toFixed(2)}%
            </div>
          ) : (
            <div>
              <input
                type="number"
                step="0.1"
                value={settings.taxOnMoney}
                onChange={(e) => handleInputChange('taxOnMoney', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">Tax percentage on monetary transactions</p>
            </div>
          )}
        </div>

        {/* Demand Charge per Meter */}
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Demand Charge per Meter</h3>
          {!isEditing ? (
            <div className="text-3xl font-bold text-orange-600">
              ৳{settings.demandChargePerMeter.toFixed(2)}
            </div>
          ) : (
            <div>
              <input
                type="number"
                step="0.01"
                value={settings.demandChargePerMeter}
                onChange={(e) => handleInputChange('demandChargePerMeter', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">Fixed demand charge per electricity meter</p>
            </div>
          )}
        </div>

        {/* Service Charge per Meter */}
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Service Charge per Meter</h3>
          {!isEditing ? (
            <div className="text-3xl font-bold text-purple-600">
              ৳{settings.serviceChargePerMeter.toFixed(2)}
            </div>
          ) : (
            <div>
              <input
                type="number"
                step="0.01"
                value={settings.serviceChargePerMeter}
                onChange={(e) => handleInputChange('serviceChargePerMeter', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">Monthly service charge per electricity meter</p>
            </div>
          )}
        </div>

        {/* Electricity Rate per Unit */}
        <div className="bg-gray-50 p-6 rounded-lg border md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Electricity Rate per Unit (kWh)</h3>
          {!isEditing ? (
            <div className="text-3xl font-bold text-green-600">
              ৳{settings.electricityRatePerUnit.toFixed(2)} per kWh
            </div>
          ) : (
            <div>
              <input
                type="number"
                step="0.01"
                value={settings.electricityRatePerUnit}
                onChange={(e) => handleInputChange('electricityRatePerUnit', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">Rate charged per kilowatt-hour of electricity consumed</p>
            </div>
          )}
        </div>
      </div>

      {/* Current Settings Summary */}
      {!isEditing && (
        <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">Current Settings Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Local Office Bill:</span>
              <span className="font-medium">{settings.localOfficeBillPercentage}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax Rate:</span>
              <span className="font-medium">{settings.taxOnMoney}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Demand Charge:</span>
              <span className="font-medium">৳{settings.demandChargePerMeter}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Service Charge:</span>
              <span className="font-medium">৳{settings.serviceChargePerMeter}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Electricity Rate:</span>
              <span className="font-medium">৳{settings.electricityRatePerUnit}/kWh</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer Information */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> These settings will affect all billing calculations. 
          Please review carefully before saving changes. Contact system administrator for assistance.
        </p>
      </div>
    </div>
  );
}