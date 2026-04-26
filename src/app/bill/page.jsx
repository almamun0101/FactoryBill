"use client";
import React from "react";
import { useDataFetch } from "../useDataFetch";
import firebaseConfig from "../firebase.config";

const Page = () => {
  const { data, loading, error } = useDataFetch("setting/settings");

  console.log(data);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="pl-100">
      mamun
      {data?.map((item) => (
        <div key={item.id}>
          <p>{item.id}</p>
        </div>
      ))}
    </div>
  );
};

export default Page;