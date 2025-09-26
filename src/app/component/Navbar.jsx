"use client";
import React from "react";
import { useRouter } from "next/navigation"; // ✅ Next.js App Router
import { Plus } from "lucide-react";

const Navbar = () => {
    const router = useRouter();
    
  return (
    <div className="w-full bg-green-600  text-center ">
      <div className="max-w-5xl mx-auto flex justify-between px-10">
        <h1 className="text-2xl p-2">Factory Electricity </h1>
        <button
          onClick={() => router.push("/setting")}
          className="text-white p-4 rounded-full shadow-xl transition"
        >
          Setting
        </button>
      </div>
    </div>
  );
};

export default Navbar;
