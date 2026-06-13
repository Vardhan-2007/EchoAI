// src/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";

// Create the context (empty box that will hold auth data)
const AuthContext = createContext(null);

// Provider component — wraps your entire app
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase listens for login/logout automatically
    // This runs ONCE when app starts
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);   // null = logged out, object = logged in
      setLoading(false);       // Done checking auth state
    });

    // Cleanup: stop listening when app closes
    return () => unsubscribe();
  }, []);

  // Logout function
  const logout = async () => {
    await signOut(auth);
  };

  // Value available to ALL children components
  const value = {
    user,        // Current user object (or null)
    loading,     // true = still checking auth
    logout,      // Function to sign out
    isLoggedIn: !!user  // Boolean: true if user exists
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — use this in any component to access auth
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}