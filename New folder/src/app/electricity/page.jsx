"use client";
import React, { useState } from "react";
import {
  Zap,
  Plus,
  Calendar,
  DollarSign,
  MapPin,
  MessageCircle,
  Save,
  X,
  Building2,
  Store,
  Trash2,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { getDatabase, push, ref, set, remove } from "firebase/database";
import { useDataFetch } from "../useDataFetch";
import firebaseConfig from "../firebase.config";

const Page = () => {
  const db = getDatabase();
  const ebillData = useDataFetch("electricity");
  const [add, setAdd] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [ebill, setEbill] = useState({
    date: today,
    amount: "",
    location: "office",
    comment: "",
  });

  const Localcharge = 0.1;

  // Handle different return formats from useDataFetch
  const ebillFetch = Array.isArray(ebillData) ? ebillData : (ebillData?.data || []);
  const loading = ebillData?.loading || false;

  const handleEbillSubmit = async (e) => {
    e.preventDefault();
    try {
      const amount = Number(ebill.amount);
      const finalAmount = ebill.location === "office" 
        ? amount 
        : Math.round(amount * (1 - Localcharge / 100));

      const newRef = push(ref(db, "electricity"));
      await set(newRef, {
        date: ebill.date,
        amount: amount,
        finalAmount: finalAmount,
        location: ebill.location,
        comment: ebill.comment || "",
      });

      // Reset form
      setEbill({
        date: today,
        amount: "",
        location: "office",
        comment: "",
      });
      setAdd(false);
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save entry");
    }
  };

  const handleDelete = async (itemKey) => {
    try {
      await remove(ref(db, `electricity/${itemKey}`));
      console.log(itemKey)
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete entry");
    }
  };

  const totalAmount = ebillFetch.reduce((sum, item) => sum + (item.finalAmount || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-3 py-4 pb-24">
      <div className="max-w-4xl mx-auto space-y-4">
        
        {/* Header */}
        <header className="text-center py-2">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</span>
          </div>
        </header>

        {/* Add Form */}
        {add && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
            <div className="flex justify-between items-center bg-gray-900 p-4 rounded-t-2xl">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                <h2 className="font-bold text-white">Add New Entry</h2>
              </div>
              <button onClick={() => setAdd(false)} className="p-1.5 hover:bg-white/10 rounded-lg">
                <X className="h-5 w-5 text-white" />
              </button>
            </div>

            <form onSubmit={handleEbillSubmit} className="p-4 space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="h-4 w-4 text-blue-600" /> Date
                </label>
                <input
                  type="date"
                  value={ebill.date}
                  onChange={(e) => setEbill({ ...ebill, date: e.target.value })}
                  className="w-full border border-gray-300 p-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <DollarSign className="h-4 w-4 text-green-600" /> Amount (৳)
                </label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={ebill.amount}
                  onChange={(e) => setEbill({ ...ebill, amount: e.target.value })}
                  className="w-full border border-gray-300 p-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="h-4 w-4 text-red-600" /> Location
                </label>
                <select
                  value={ebill.location}
                  onChange={(e) => setEbill({ ...ebill, location: e.target.value })}
                  className="w-full border border-gray-300 p-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                >
                  <option value="office">🏢 Office (No Charge)</option>
                  <option value="local">🏪 Local (-10)</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <MessageCircle className="h-4 w-4 text-purple-600" /> Comment (Optional)
                </label>
                <textarea
                  placeholder="Add notes..."
                  value={ebill.comment}
                  onChange={(e) => setEbill({ ...ebill, comment: e.target.value })}
                  className="w-full border border-gray-300 p-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none h-20 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold flex items-center justify-center gap-2 shadow-lg active:scale-[0.98]"
              >
                <Save className="h-5 w-5" /> Save Entry
              </button>
            </form>
          </div>
        )}

        {/* Records List */}
        {!add && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
            <div className="flex justify-between items-center bg-gray-900 p-4 rounded-t-2xl">
              <h2 className="font-bold text-white flex items-center gap-2">
                <Calendar className="h-5 w-5" /> Recent Entries
              </h2>
              <button
                onClick={() => setAdd(true)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg text-white font-medium"
              >
                <Plus className="h-4 w-4" /> Add
              </button>
            </div>

            <div className="p-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <p className="mt-4 text-gray-500 text-sm">Loading entries...</p>
                </div>
              ) : ebillFetch.length === 0 ? (
                <div className="text-center py-12">
                  <Zap className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No entries yet. Add your first one!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {ebillFetch.map((item) => {
                    
                    const isOffice = item.location === "office";
                    return (
                      <div
                        key={item.id}
                        className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:bg-blue-50/30 transition-all"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            {isOffice ? (
                              <Building2 className="h-5 w-5 text-blue-600" />
                            ) : (
                              <Store className="h-5 w-5 text-purple-600" />
                            )}
                            <span className="font-semibold text-gray-900 capitalize">
                              {item.location}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">{item.date}</span>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete entry"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </button>
                          </div>
                        </div>

                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Bill Amount</p>
                            <p className="text-lg font-bold text-gray-900">
                              ৳{item.amount?.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500 mb-1">Final Cost</p>
                            <div className="flex items-center gap-2">
                              <p className="text-lg font-bold text-green-600">
                                ৳{item.finalAmount?.toLocaleString()}
                              </p>
                              {!isOffice && (
                                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold">
                                  -{Localcharge}%
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {item.comment && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-xs text-gray-600 italic">{item.comment}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Total */}
              {!loading && ebillFetch.length > 0 && (
                <div className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-600 rounded-lg">
                        <Zap className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">Period Total</h3>
                        <p className="text-gray-600 text-xs">Combined costs</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">
                      ৳{totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Summary Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Today's Summary</h2>
              <p className="text-blue-100 text-sm mb-3">All systems running smoothly</p>
              <div className="flex flex-wrap gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Efficiency: 95%</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Savings: ৳2,500</span>
                </div>
              </div>
            </div>
            <div className="hidden sm:block p-3 bg-white/20 rounded-full">
              <BarChart3 className="h-10 w-10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;