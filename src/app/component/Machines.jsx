import React from "react";

const Machines = () => {
  const machines = [
    { size: "8 Ounces", meter: "10,000", electricity: "10,000" },
    { size: "5 Ounces", meter: "10,000", electricity: "10,000" },
  ];

  return (
    <div className="p-5">
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
        {machines.map((m, i) => (
          <div
            key={i}
            className="bg-white text-black rounded-2xl shadow-md p-6 flex flex-col items-center text-center transition hover:shadow-lg"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">{m.size}</h2>
            <h3 className="text-gray-600 mb-2">
              <span className="font-semibold text-gray-700">Meter:</span> {m.meter}
            </h3>
            <h3 className="text-gray-600">
              <span className="font-semibold text-gray-700">Electricity:</span> {m.electricity}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Machines;
