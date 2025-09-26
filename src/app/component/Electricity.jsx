import React from "react";

const Electricity = () => {
  return (
    <div className="flex justify-between items-center gap-5 p-2 ">
      <div className="bg-white w-full text-black p-5 py-10 text-left rounded-2xl ">
        <h2 className="text-lg font-bold text-center pb-5 ">
          Electricity Month : 50000{" "}
        </h2>
        <div className="flex gap-10">
          <h3 className=""> Date</h3>
          <h3 className=""> Amount </h3>
        </div>
        <div className="flex gap-10">
          <h3 className=""> 01 / 10 / 2025</h3>
          <h3 className=""> 50,000</h3>
        </div>
        <div className="flex gap-10">
          <h3 className=""> 01 / 10 / 2025</h3>
          <h3 className=""> 50,000</h3>
        </div>
       
      </div>
    </div>
  );
};

export default Electricity;
