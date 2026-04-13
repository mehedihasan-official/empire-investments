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

          // Force refresh the ID token to avoid stale / invalid tokens.
          const token = await firebaseUser.getIdToken(true);

          const response = await fetch("/api/auth/me", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              displayName: firebaseUser.displayName || "",
              photoURL: firebaseUser.photoURL || "",
            }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error(
              "AuthProvider /api/auth/me failed:",
              response.status,
              errorData,
            );
            throw new Error(errorData.error || "Unable to sync user profile");
          }

          const userData = await response.json();
          setUserProfile(userData.user);
          Cookie.set("auth_token", token, { expires: 7 });
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
    isUser: userProfile?.role === "user",
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
