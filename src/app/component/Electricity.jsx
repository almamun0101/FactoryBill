import React from "react";

const Electricity = () => {
    let percentageDecrease = 10;
  const data = [
    { date: "01 / 10 / 2025", amount: "50000", place: "Office" },
    { date: "01 / 10 / 2025", amount: "50000", place: "Local" },
  ];
  return (
    <div className="flex justify-center items-center px-4">
      <div className="w-full max-w-5xl bg-white text-black rounded-2xl shadow-md p-6">
        {/* Header */}
        <h2 className="text-2xl font-bold text-center pb-6 ">
          Electricity Month : <span className="text-green-600">50,000</span>
        </h2>

        {/* Table */}
        <div className="mt-2">
          <div className="grid grid-cols-4 text-center font-semibold text-gray-700 border-b border-gray-300 pb-2">
            <span>Date</span>
            <span>Amount</span>
            <span>Place</span>
            <span>Money</span>
          </div>

          {data.map((item, index) => {
          let newValue = item.amount * (1 - (percentageDecrease / 100));

          return(
            <div
              key={index}
              className="grid grid-cols-4 text-center py-1 border-b last:border-none border-gray-200 hover:bg-gray-50 transition"
            >
              <span>{item.date}</span>
              <span className="text-green-600 font-medium">{item.amount}</span>
              <span>{item.place}</span>
              <span>
                {item.place === "Office" ? item.amount : newValue}
              </span>
            </div>
          )})}
        </div>
      </div>
    </div>
  );
};

export default Electricity;
