"use client";
import React from "react";
import { useRouter } from "next/navigation";   // ✅ Next.js App Router
import { Plus } from "lucide-react";

export default function FloatingAddButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/adddata")}
      className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700
                 text-white p-4 rounded-full shadow-xl transition"
    >
      <Plus size={28} />
    </button>
  );
}
