"use client";
import { useEffect, useState } from "react";
import { RotateCcw, Settings, Save } from "lucide-react";
import { getDatabase, ref, set } from "firebase/database";
import { getAuth } from "firebase/auth";
import firebaseConfig from "../firebase.config";
import { useDataFetch } from "../useDataFetch";

export default function BillingSettings() {
  const settingFetch = useDataFetch("setting/settings");
  const db = getDatabase();
  const auth = getAuth();

  const defaultSettings = {
    localOfficeBillPercentage: 1.0,
    taxOnMoney: 5.0,
    demandChargePerMeter: 250.0,
    serviceChargePerMeter: 1205.0,
    electricityRatePerUnit: 10.76,
  };

  // store strings so input can be blank
  const [settings, setSettings] = useState(
    Object.fromEntries(Object.entries(defaultSettings).map(([k, v]) => [k, String(v)]))
  );
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (settingFetch?.data) {
      const merged = { ...defaultSettings, ...settingFetch.data };
      setSettings(
        Object.fromEntries(Object.entries(merged).map(([k, v]) => [k, String(v)]))
      );
    }
  }, [settingFetch?.data]);

  const handleInputChange = (field, value) => {
    // allow empty string for full delete, but block negative sign
    if (value === "" || (/^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0)) {
      setSettings((prev) => ({ ...prev, [field]: value }));
    }
  };

  const normalizeNumbers = (obj) =>
    Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [
        k,
        Math.max(0, parseFloat(v) || 0), // convert empty/NaN to 0, no negatives
      ])
    );

  const handleSave = async () => {
    const clean = normalizeNumbers(settings);
    try {
      await set(ref(db, "setting/settings"), clean);
      setSettings(
        Object.fromEntries(Object.entries(clean).map(([k, v]) => [k, String(v)]))
      );
      setIsEditing(false);
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleReset = () =>
    setSettings(
      Object.fromEntries(
        Object.entries(defaultSettings).map(([k, v]) => [k, String(v)])
      )
    );

  const handleCancel = () => {
    setIsEditing(false);
    if (settingFetch?.data) {
      const merged = { ...defaultSettings, ...settingFetch.data };
      setSettings(
        Object.fromEntries(Object.entries(merged).map(([k, v]) => [k, String(v)]))
      );
    } else {
      handleReset();
    }
  };

  const numberFields = [
    {
      key: "localOfficeBillPercentage",
      label: "Local Office Bill Percentage",
      suffix: "%",
      color: "text-blue-600",
      hint: "Percentage applied to local office bills",
    },
    {
      key: "taxOnMoney",
      label: "Tax on Money",
      suffix: "%",
      color: "text-red-600",
      hint: "Tax percentage on monetary transactions",
    },
    {
      key: "demandChargePerMeter",
      label: "Demand Charge per Meter",
      prefix: "৳",
      color: "text-orange-600",
      hint: "Fixed demand charge per electricity meter",
    },
    {
      key: "serviceChargePerMeter",
      label: "Service Charge per Meter",
      prefix: "৳",
      color: "text-purple-600",
      hint: "Monthly service charge per electricity meter",
    },
  ];

  const cleanDisplay = normalizeNumbers(settings); // for summary & view mode

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

      {/* Settings grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {numberFields.map(({ key, label, suffix = "", prefix = "", color, hint }) => (
          <div key={key} className="bg-gray-50 p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">{label}</h3>
            {!isEditing ? (
              <div className={`text-3xl font-bold ${color}`}>
                {prefix}
                {cleanDisplay[key].toFixed(1)}
                {suffix}
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  value={settings[key]}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">{hint}</p>
              </div>
            )}
          </div>
        ))}

        {/* Electricity Rate */}
        <div className="bg-gray-50 p-6 rounded-lg border md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Electricity Rate per Unit (kWh)
          </h3>
          {!isEditing ? (
            <div className="text-3xl font-bold text-green-600">
              ৳{cleanDisplay.electricityRatePerUnit.toFixed(1)} per kWh
            </div>
          ) : (
            <div>
              <input
                type="text"
                value={settings.electricityRatePerUnit}
                onChange={(e) =>
                  handleInputChange("electricityRatePerUnit", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Rate charged per kilowatt-hour of electricity consumed
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {!isEditing && (
        <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">
            Current Settings Summary
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Local Office Bill:</span>
              <span className="font-medium">
                {cleanDisplay.localOfficeBillPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax Rate:</span>
              <span className="font-medium">
                {cleanDisplay.taxOnMoney.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Demand Charge:</span>
              <span className="font-medium">
                ৳{cleanDisplay.demandChargePerMeter.toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Service Charge:</span>
              <span className="font-medium">
                ৳{cleanDisplay.serviceChargePerMeter.toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Electricity Rate:</span>
              <span className="font-medium">
                ৳{cleanDisplay.electricityRatePerUnit.toFixed(1)}/kWh
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Values cannot be negative. Empty inputs will be
          saved as 0.
        </p>
      </div>
    </div>
  );
}
