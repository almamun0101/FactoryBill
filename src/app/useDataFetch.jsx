"use client";
import { useEffect, useState } from "react";
import { getDatabase, ref, onValue, off } from "firebase/database";
import firebaseConfig from "./firebase.config";

export const useDataFetch = (collection) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!collection) {
      setError("Collection path is required");
      setLoading(false);
      return;
    }

    const db = getDatabase();
    const dbRef = ref(db, collection);

    try {
      const unsubscribe = onValue(
        dbRef,
        (snapshot) => {
          try {
            if (!snapshot.exists()) {
              setData([]);
              setError(null);
              setLoading(false);
              return;
            }

            const list = [];
            snapshot.forEach((childSnapshot) => {
              const value = childSnapshot.val();

              // extra safety check
              if (value !== null && typeof value === "object") {
                list.push({
                  id: childSnapshot.key,
                  ...value,
                });
              }
            });

            setData(list);
            setError(null);
          } catch (parseError) {
            console.error("Data parsing error:", parseError);
            setError("Failed to process data");
          } finally {
            setLoading(false);
          }
        },
        (firebaseError) => {
          console.error("Firebase error:", firebaseError);
          setError(firebaseError.message || "Something went wrong");
          setLoading(false);
        }
      );

      return () => {
        off(dbRef); // clean listener
        unsubscribe();
      };
    } catch (err) {
      console.error("Initialization error:", err);
      setError("Failed to connect to database");
      setLoading(false);
    }
  }, [collection]);

  return { data, loading, error };
};