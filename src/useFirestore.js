// src/useFirestore.js
import { useState, useEffect, useCallback } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

// Helper: Load data from Firestore for current user
export function useFirestoreData(userId, collection = "data") {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load data from Firestore when userId changes
  useEffect(() => {
    if (!userId) {
      setData(null);
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "users", userId, collection, "main");
        const snap = await getDoc(docRef);
        
        if (snap.exists()) {
          setData(snap.data());
        } else {
          // No data yet — return empty object
          setData({});
        }
      } catch (err) {
        console.error("Firestore load error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  // Save data to Firestore
  const saveData = useCallback(async (newData) => {
    if (!userId) return;
    
    try {
      const docRef = doc(db, "users", userId, collection, "main");
      await setDoc(docRef, newData, { merge: true });
      setData(newData);
    } catch (err) {
      console.error("Firestore save error:", err);
      setError(err.message);
      throw err;
    }
  }, [userId]);

  return { data, loading, error, saveData };
}