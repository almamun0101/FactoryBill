"use client";
import React, { useEffect, useState } from "react";
import {
  Home,
  Zap,
  Activity,
  Plus,
  BarChart3,
  User,
  TrendingUp,
  AlertCircle,
  Calendar,
  DollarSign,
  MapPin,
  MessageCircle,
  Save,
  X,
  Building2,
  Store,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getDatabase, push, ref, set } from "firebase/database";
import { getAuth } from "firebase/auth";
import firebaseConfig from "../firebase.config";
import { useDataFetch } from "../useDataFetch";

const Page = () => {
  const router = useRouter();
  const db = getDatabase();
  const ebillFetch = useDataFetch("electricity");
  const [currentDate, setCurrentDate] = useState("");
  const [add, setAdd] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [ebill, setEbill] = useState({
    date: today || null,
    amount: 0,
    location: "office",
    comment: "",
  });

  const percentageDecrease = 10;


  useEffect(() => {
    setCurrentDate(
      new Date().toLocaleDateString("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
  }, []);

  const handleEbillSubmit = async (e) => {
    e.preventDefault();
    try {
      const newRef = push(ref(db, "electricity")); // fixed spelling + correct usage
      await set(newRef, {
        ...ebill,
        amount: Number(ebill.amount) || 0, // make sure it's a number, not string/undefined
        comment: ebill.comment || "", // avoid undefined
      });

      console.log("Electricity entry saved:", ebill);
      setAdd(false);
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  // // Utility function to get final bill
  // const getFinalAmount = (item) =>
  //   item.place === "Local"
  //     ? item.amount
  //     : Math.round(item.amount * (1 - percentageDecrease / 100));

  // const totalAmount = ebillFetch.reduce((sum, item) => sum + getFinalAmount(item), 0);

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

        {/* Add Bill Form */}
        {add && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center bg-gradient-to-r from-gray-900 to-gray-800 p-5">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-white" />
                <h2 className="text-lg font-bold text-white">Add New Entry</h2>
              </div>
              <button
                onClick={() => setAdd(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleEbillSubmit} className="p-6 space-y-5">
              {/* Date */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Calendar className="h-4 w-4 text-blue-600" /> Date
                </label>
                <input
                  type="date"
                  value={ebill.date}
                  onChange={(e) => setEbill({ ...ebill, date: e.target.value })}
                  className="w-full border border-gray-300 p-3.5 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                  required
                />
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <DollarSign className="h-4 w-4 text-green-600" /> Amount (৳)
                </label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={ebill.amount}
                  onChange={(e) =>
                    setEbill({ ...ebill, amount: e.target.value })
                  }
                  className="w-full border border-gray-300 p-3.5 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                  required
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <MapPin className="h-4 w-4 text-red-600" /> Location
                </label>
                <select
                  value={ebill.location}
                  onChange={(e) =>
                    setEbill({ ...ebill, location: e.target.value })
                  }
                  className="w-full border border-gray-300 p-3.5 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                >
                  <option value="office">🏢 Office</option>
                  <option value="local">🏪 Local</option>
                </select>
              </div>

              {/* Comment */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <MessageCircle className="h-4 w-4 text-purple-600" /> Comment
                  (Optional)
                </label>
                <textarea
                  placeholder="Add any additional notes..."
                  value={ebill.comment}
                  onChange={(e) =>
                    setEbill({ ...ebill, comment: e.target.value })
                  }
                  className="w-full border border-gray-300 p-3.5 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none h-24 resize-none"
                />
              </div>

              {/* Save Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.98]"
              >
                <Save className="h-5 w-5" /> Save Entry
              </button>
            </form>
          </div>
        )}

        {/* Records Table */}
        {!add && (
          <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center bg-gradient-to-r from-gray-900 to-gray-800 p-5">
              <h2 className="text-lg font-bold text-white flex items-center gap-3">
                <Calendar className="h-5 w-5" /> Recent Entries
              </h2>
              <button
                onClick={() => setAdd(true)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-white font-medium transition-colors"
              >
                <Plus className="h-4 w-4" /> Add
              </button>
            </div>

            {/* Desktop Table */}
            <div className="p-6 hidden md:block">
              <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl font-semibold text-gray-700 mb-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" /> Date
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" /> Bill Amount
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-600" /> Location
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-600" /> Final Cost
                </div>
              </div>

              <div className="space-y-2">
                {ebillFetch.map((item, index) => {
                  // const finalAmount = getFinalAmount(item);
                  const isOffice = item.place === "office";

                  return (
                    <div
                      key={index}
                      className="grid grid-cols-4 gap-4 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200"
                    >
                      <span className="text-gray-700 font-medium text-sm">
                        {item.date}
                      </span>

                      <span className="text-base font-bold text-gray-900">
                        ৳{item.amount.toLocaleString()}
                      </span>

                      <span className="flex items-center gap-2">
                        {isOffice ? (
                          <Building2 className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Store className="h-5 w-5 text-purple-600" />
                        )}
                        <span className="text-sm font-medium text-gray-700">
                          {item.place}
                        </span>
                      </span>

                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-green-600">
                          {/* ৳{finalAmount.toLocaleString()} */}
                            ৳{item.amount.toLocaleString()}
                        </span>
                        {!isOffice && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold">
                            -{percentageDecrease}%
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="p-6 md:hidden space-y-3">
              {ebillFetch.map((item, index) => {
                // const finalAmount = getFinalAmount(item);
                const isOffice = item.place === "office";

                return (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:bg-blue-50/50 transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        {isOffice ? (
                          <Building2 className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Store className="h-5 w-5 text-purple-600" />
                        )}
                        <span className="font-semibold text-gray-900">
                          {item.place}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {item.date}
                      </span>
                    </div>

                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Bill Amount
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          ৳{item.amount.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1">Final Cost</p>
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-bold text-green-600">
                            {/* ৳{finalAmount.toLocaleString()} */}
                              ৳{item.amount.toLocaleString()}
                          </p>
                          {!isOffice && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold">
                              -{percentageDecrease}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary Footer */}
            <div className="mt-6 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-600 rounded-lg">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">
                      Period Total
                    </h3>
                    <p className="text-gray-600 text-xs">Combined costs</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {/* ৳{totalAmount.toLocaleString()} */}
                </p>
              </div>
            </div>
          </section>
        )}

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
    </div>
  );
};

export default Page;
