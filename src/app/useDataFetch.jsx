"use client";
import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";

export const useDataFetch = (collection) => {
  const [data, setData] = useState([]);
  const db = getDatabase();
  const auth = getAuth();

  useEffect(() => {
    const dbRef = ref(db, `/${collection}`);

    const unsubscribe = onValue(dbRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        // Convert object to array if needed
        const formatted = Object.values(val);
        setData(formatted);
      } else {
        setData([]);
      }
    });

    return () => unsubscribe(); // cleanup
  }, [collection, db]);

  return data;
};
