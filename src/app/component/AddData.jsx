"use client";
import React, { useState } from "react";

export default function AddDataPage() {
  const today = new Date().toISOString().split("T")[0];

  const [ebill, setEbill] = useState({
    date: today,
    amount: "",
    location: "office",
    comment: "",
  });

  const [machine, setMachine] = useState({
    name: "",
    date: today,
    reading: "",
  });

  const lastMachineReading = 12000;

  const handleEbillSubmit = (e) => {
    e.preventDefault();
    console.log("Electricity:", ebill);
  };

  const handleMachineSubmit = (e) => {
    e.preventDefault();
    console.log("Machine:", machine);
  };

  return (
    <div className="max-w-3xl mx-auto  space-y-5 text-blue-800">
      <h1 className="text-2xl font-bold text-white w-full bg-green-600 text-center p-3">
        Add Data
      </h1>

      {/* Electricity Bill */}
      <form
        onSubmit={handleEbillSubmit}
        className="bg-white p-5 rounded-2xl shadow space-y-4 m-5"
      >
        <h2 className="text-xl font-semibold">Electricity Bill</h2>

        <input
          type="date"
          value={ebill.date}
          onChange={(e) => setEbill({ ...ebill, date: e.target.value })}
          className="w-full border p-2 rounded text-blue-800"
          required
        />

        <input
          type="number"
          placeholder="Amount"
          value={ebill.amount}
          onChange={(e) => setEbill({ ...ebill, amount: e.target.value })}
          className="w-full border p-2 rounded text-blue-800"
          required
        />

        <select
          value={ebill.location}
          onChange={(e) => setEbill({ ...ebill, location: e.target.value })}
          className="w-full border p-2 rounded text-blue-800"
        >
          <option value="office">Office</option>
          <option value="local">Local</option>
        </select>

        <textarea
          placeholder="Comment (optional)"
          value={ebill.comment}
          onChange={(e) => setEbill({ ...ebill, comment: e.target.value })}
          className="w-full border p-2 rounded text-blue-800"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Electricity Data
        </button>
      </form>

      {/* Machine Meter Reading */}
      <form
        onSubmit={handleMachineSubmit}
        className="bg-white p-5 rounded-2xl shadow space-y-4 m-5"
      >
        <h2 className="text-xl font-semibold">Machine Meter Reading</h2>
        <p>
          Last Reading: <strong>{lastMachineReading}</strong>
        </p>

        <select
          value={machine.name}
          onChange={(e) => setMachine({ ...machine, name: e.target.value })}
          className="w-full border p-2 rounded text-blue-800"
          required
        >
          <option value="">Select Machine</option>
          <option value="Machine A">Machine A</option>
          <option value="Machine B">Machine B</option>
        </select>

        <input
          type="date"
          value={machine.date}
          onChange={(e) => setMachine({ ...machine, date: e.target.value })}
          className="w-full border p-2 rounded text-blue-800"
          required
        />

        <input
          type="number"
          placeholder="New Reading"
          value={machine.reading}
          onChange={(e) => setMachine({ ...machine, reading: e.target.value })}
          className="w-full border p-2 rounded text-blue-800"
          required
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Machine Reading
        </button>
      </form>
    </div>
  );
}
