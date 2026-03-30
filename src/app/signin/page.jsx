"use client";

import { auth } from "@/lib/firebase";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  // ── Input validation ────────────────────────────────────────────────────
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Valid email is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Handle Google sign in ─────────────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    setServerError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Get user role from MongoDB to determine redirect
      const token = await result.user.getIdToken();
      const response = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage("Successfully signed in! Redirecting...");
        const isAdmin = data.user?.role === "admin";

        // Redirect after a short delay to show success message
        setTimeout(() => {
          router.push(isAdmin ? "/dashboard/admin" : "/dashboard/user");
        }, 1500);
      } else {
        router.push("/dashboard/user");
      }
    } catch (error) {
      setServerError(
        error.code === "auth/popup-closed-by-user"
          ? "Sign in was cancelled"
          : error.message || "Google sign in failed",
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Handle sign in ──────────────────────────────────────────────────────
  const handleSignIn = async (e) => {
    e.preventDefault();
    setServerError("");
    setSuccessMessage("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );

      // Get user role from MongoDB to determine redirect
      const token = await userCredential.user.getIdToken();
      const response = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage("Successfully signed in! Redirecting...");
        const isAdmin = data.user?.role === "admin";

        // Redirect after a short delay to show success message
        setTimeout(() => {
          router.push(isAdmin ? "/dashboard/admin" : "/dashboard/user");
        }, 1500);
      } else {
        router.push("/dashboard/user");
      }
    } catch (error) {
      setServerError(
        error.code === "auth/user-not-found"
          ? "No account with this email found"
          : error.code === "auth/wrong-password"
            ? "Incorrect password"
            : error.message || "Sign in failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-24 bg-navy-900">
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-navy-800 border border-gold-500/20 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-2">Sign In</h1>
          <p className="text-gray-400 mb-8">Access your Empire account</p>

          {successMessage && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-300 px-4 py-3 rounded mb-6">
              {successMessage}
            </div>
          )}

          {serverError && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-300 px-4 py-3 rounded mb-6">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-5">
            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-navy-800 text-gray-400">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={`w-full px-4 py-2.5 bg-navy-700 border rounded text-white placeholder-gray-500 focus:outline-none focus:border-gold-400 transition ${
                  errors.email ? "border-red-500" : "border-gray-600"
                }`}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className={`w-full px-4 py-2.5 bg-navy-700 border rounded text-white placeholder-gray-500 focus:outline-none focus:border-gold-400 transition ${
                  errors.password ? "border-red-500" : "border-gray-600"
                }`}
                placeholder="Your password"
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold py-2.5 text-sm font-semibold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-gray-400 text-sm mt-8">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-gold-400 hover:text-gold-300 font-semibold transition"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
