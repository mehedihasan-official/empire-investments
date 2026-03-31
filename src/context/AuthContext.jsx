"use client";

import { auth } from "@/lib/firebase";
import { signOut as firebaseSignOut, onAuthStateChanged } from "firebase/auth";
import Cookie from "js-cookie";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]               = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser);

          // IMPORTANT: Use getIdToken(true) to force-refresh the token.
          // After Google popup closes, the token may not be ready yet.
          // Without true, stale/invalid tokens cause 401 errors.
          const token = await firebaseUser.getIdToken(true);

          // IMPORTANT: Call POST /api/auth/register, NOT GET /api/auth/me.
          // GET returns 401/404 for new users who don't exist in MongoDB yet.
          // POST does an upsert — creates new users AND updates returning users.
          const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              displayName: firebaseUser.displayName || "",
              photoURL:    firebaseUser.photoURL    || "",
            }),
          });

          if (response.ok) {
            const userData = await response.json();
            setUserProfile(userData.user);
            Cookie.set("auth_token", token, { expires: 7 });
          } else {
            const errData = await response.json().catch(() => ({}));
            console.error("AuthProvider: register failed", response.status, errData);
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}