"use client";

import { auth } from "@/lib/firebase";
import { signOut as firebaseSignOut, onAuthStateChanged } from "firebase/auth";
import Cookie from "js-cookie";
import { createContext, useContext, useEffect, useState } from "react";

// ──── Auth Context ──────────────────────────────────────────────────────────
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Initialize auth state on mount ──────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser);
          // Get user profile from MongoDB
          const token = await firebaseUser.getIdToken();
          const response = await fetch("/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.ok) {
            const userData = await response.json();
            setUserProfile(userData.user);
            Cookie.set("auth_token", token, { expires: 7 });
          }
        } else {
          setUser(null);
          setUserProfile(null);
          Cookie.remove("auth_token");
        }
      } catch (err) {
        console.error("Auth state error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // ── Sign out function ──────────────────────────────────────────────────
  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setUserProfile(null);
      Cookie.remove("auth_token");
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin: userProfile?.role === "admin",
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ──── useAuth Hook ──────────────────────────────────────────────────────────
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
