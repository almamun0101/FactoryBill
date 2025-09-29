"use client";
import { useEffect, useState } from "react";
// import { RotateCcw, Settings, Save } from "lucide-react";
import { getDatabase, ref, set } from "firebase/database";
import { getAuth } from "firebase/auth";
import firebaseConfig from "../firebase.config";
import { useDataFetch } from "../useDataFetch";
import {
  RotateCcw,
  User,
  Settings,
  LogOut,
  Edit3,
  Save,
  X,
  Bell,
  Shield,
  Palette,
} from "lucide-react";

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
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
    Object.fromEntries(
      Object.entries(defaultSettings).map(([k, v]) => [k, String(v)])
    )
  );

  useEffect(() => {
    if (settingFetch?.data) {
      const merged = { ...defaultSettings, ...settingFetch.data };
      setSettings(
        Object.fromEntries(
          Object.entries(merged).map(([k, v]) => [k, String(v)])
        )
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

  const handleSaveEdit = async () => {
    const clean = normalizeNumbers(settings);
    try {
      await set(ref(db, "setting/settings"), clean);
      setSettings(
        Object.fromEntries(
          Object.entries(clean).map(([k, v]) => [k, String(v)])
        )
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

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (settingFetch?.data) {
      const merged = { ...defaultSettings, ...settingFetch.data };
      setSettings(
        Object.fromEntries(
          Object.entries(merged).map(([k, v]) => [k, String(v)])
        )
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

  const [userInfo, setUserInfo] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    bio: "Software developer passionate about creating amazing user experiences.",
  });
  const [editedInfo, setEditedInfo] = useState(userInfo);
  const [defaults, setDefaults] = useState({
    notifications: true,
    darkMode: false,
    emailUpdates: true,
    twoFactor: false,
  });

  const handleSave = () => {
    setUserInfo(editedInfo);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedInfo(userInfo);
    setIsEditing(false);
  };

  const handleLogout = () => {
    alert("Logged out successfully!");
  };

  const handleSettingChange = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <User size={40} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{userInfo.name}</h1>
                <p className="text-blue-100">{userInfo.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="px-6">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab("profile")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "profile"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Profile Info
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "settings"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Settings
              </button>
              <button
                onClick={() => setActiveTab("default")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "default"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Default
              </button>
            </div>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "profile" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Profile Information
                </h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Edit3 size={16} />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Save size={16} />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <X size={16} />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedInfo.name}
                      onChange={(e) =>
                        setEditedInfo({ ...editedInfo, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                      {userInfo.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedInfo.email}
                      onChange={(e) =>
                        setEditedInfo({ ...editedInfo, email: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                      {userInfo.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedInfo.phone}
                      onChange={(e) =>
                        setEditedInfo({ ...editedInfo, phone: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                      {userInfo.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedInfo.location}
                      onChange={(e) =>
                        setEditedInfo({
                          ...editedInfo,
                          location: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                      {userInfo.location}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editedInfo.bio}
                      onChange={(e) =>
                        setEditedInfo({ ...editedInfo, bio: e.target.value })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                      {userInfo.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Account Settings
              </h2>

              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                    <Bell size={20} className="mr-2" />
                    Notifications
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Push Notifications</span>
                      <button
                        onClick={() => handleSettingChange("notifications")}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.notifications ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.notifications
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Email Updates</span>
                      <button
                        onClick={() => handleSettingChange("emailUpdates")}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.emailUpdates ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.emailUpdates
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                    <Palette size={20} className="mr-2" />
                    Appearance
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Dark Mode</span>
                    <button
                      onClick={() => handleSettingChange("darkMode")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.darkMode ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.darkMode ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                    <Shield size={20} className="mr-2" />
                    Security
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">
                      Two-Factor Authentication
                    </span>
                    <button
                      onClick={() => handleSettingChange("twoFactor")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.twoFactor ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.twoFactor ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "default" && (
            <div className="">
              <div className="flex items-center justify-end mb-8">
               
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
                        onClick={handleCancelEdit}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Save className="h-4 w-4" />
                        Save 
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Settings grid */}
              <div className="grid grid-cols-1 justify-between md:grid-cols-2 gap-6 ">
                {numberFields.map(
                  ({ key, label, suffix = "", prefix = "", color, hint }) => (
                    <div key={key} className="w-full grid grid-cols-2 justify-between items-center bg-gray-50 p-3 rounded-lg border">
                      <h3 className=" font-semibold text-gray-800 mb-3">
                        {label}
                      </h3>
                      <div className="">

                      {!isEditing ? (
                        <div className={`text-xl font-bold ${color}`}>
                          {prefix}
                          {cleanDisplay[key].toFixed(1)}
                          {suffix}
                        </div>
                      ) : (
                        <div>
                          <input
                            type="text"
                            value={settings[key]}
                            onChange={(e) =>
                              handleInputChange(key, e.target.value)
                            }
                            className="w-full text-right px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <p className="text-sm text-gray-500 mt-1 text-right">{hint}</p>
                        </div>
                      )}
                      </div>
                    </div>
                  )
                )}

                {/* Electricity Rate */}
                <div className="grid grid-cols-2 justify-between  bg-gray-50 p-6 rounded-lg border md:col-span-2">
                  <h3 className="font-semibold text-gray-800 mb-3 ">
                    Electricity Rate per Unit (kWh)
                  </h3>
                  {!isEditing ? (
                    <div className="text-xl font-bold text-green-600">
                      ৳{cleanDisplay.electricityRatePerUnit.toFixed(1)} per kWh
                    </div>
                  ) : (
                    <div>
                      <input
                        type="text"
                        value={settings.electricityRatePerUnit}
                        onChange={(e) =>
                          handleInputChange(
                            "electricityRatePerUnit",
                            e.target.value
                          )
                        }
                        className="text-right w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-sm text-gray-500 mt-1 text-right">
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
                  <strong>Note:</strong> Values cannot be negative. Empty inputs
                  will be saved as 0.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// "use client";

// export default function BillingSettings() {
