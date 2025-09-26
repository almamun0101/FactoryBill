"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Settings } from "lucide-react";

const Navbar = () => {
  const router = useRouter();

  return (
    <nav className="w-full bg-green-700 text-white shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Brand / Logo */}
        <h1 className="text-xl md:text-2xl font-bold tracking-wide">
          ⚡ Factory Electricity
        </h1>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/setting")}
            className="flex items-center gap-2 px-4 py-2 bg-green-800 hover:bg-green-900 rounded-lg transition-colors shadow-sm"
          >
            <Settings size={18} />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
