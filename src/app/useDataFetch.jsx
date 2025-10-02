"use client";
import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";

export const useDataFetch = (collection) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const dbRef = ref(db, collection);

    const unsubscribe = onValue(dbRef, (snapshot) => {
      const list = [];
      snapshot.forEach((childSnapshot) => {
        // ✅ include Firebase auto-generated key
        list.push({ id: childSnapshot.key, ...childSnapshot.val() });
      });
      setData(list);
    });

    return () => unsubscribe();
  }, [collection]);

  return data;
};
