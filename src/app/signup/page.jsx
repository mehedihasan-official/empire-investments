"use client";

import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUp() {
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  // ── Input validation ────────────────────────────────────────────────────
  const validateForm = () => {
    const newErrors = {};

    if (!formData.displayName.trim()) {
      newErrors.displayName = "Full name is required";
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Valid email is required";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Handle Google sign up ─────────────────────────────────────────────────
  const handleGoogleSignUp = async () => {
    setServerError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Get a fresh ID token to avoid stale authentication state.
      const token = await result.user.getIdToken(true);

      // Sync user profile in MongoDB and return the saved role
      const response = await fetch("/api/auth/me", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          displayName: result.user.displayName || "",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create user profile");
      }

      setSuccessMessage("Account created successfully! Redirecting...");

      const data = await response.json();
      const isAdmin = data.user?.role === "admin";

      // Redirect after a short delay to show success message
      setTimeout(() => {
        router.push(isAdmin ? "/dashboard/admin" : "/dashboard/user");
      }, 1500);
    } catch (error) {
      setServerError(
        error.code === "auth/popup-closed-by-user"
          ? "Sign up was cancelled"
          : error.message || "Google sign up failed",
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Handle sign up ──────────────────────────────────────────────────────
  const handleSignUp = async (e) => {
    e.preventDefault();
    setServerError("");
    setSuccessMessage("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );

      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: formData.displayName,
      });

      // Get a fresh ID token to avoid stale auth state.
      const token = await userCredential.user.getIdToken(true);

      // Sync user profile in MongoDB and return the saved role
      const response = await fetch("/api/auth/me", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          displayName: formData.displayName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create user profile");
      }

      setSuccessMessage("Account created successfully! Redirecting...");

      const data = await response.json();
      const isAdmin = data.user?.role === "admin";

      // Redirect after a short delay to show success message
      setTimeout(() => {
        router.push(isAdmin ? "/dashboard/admin" : "/dashboard/user");
      }, 1500);
    } catch (error) {
      setServerError(
        error.code === "auth/email-already-in-use"
          ? "Email already registered"
          : error.message || "Sign up failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-24 bg-navy-900">
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-navy-800 border border-gold-500/20 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-2">Sign Up</h1>
          <p className="text-gray-400 mb-8">Create your Empire account</p>

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

          <form onSubmit={handleSignUp} className="space-y-5">
            {/* Google Sign Up Button */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
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
                  Or create account with email
                </span>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={(e) =>
                  setFormData({ ...formData, displayName: e.target.value })
                }
                className={`w-full px-4 py-2.5 bg-navy-700 border rounded text-white placeholder-gray-500 focus:outline-none focus:border-gold-400 transition ${
                  errors.displayName ? "border-red-500" : "border-gray-600"
                }`}
                placeholder="Your full name"
              />
              {errors.displayName && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.displayName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
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
                name="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className={`w-full px-4 py-2.5 bg-navy-700 border rounded text-white placeholder-gray-500 focus:outline-none focus:border-gold-400 transition ${
                  errors.password ? "border-red-500" : "border-gray-600"
                }`}
                placeholder="At least 6 characters"
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
                className={`w-full px-4 py-2.5 bg-navy-700 border rounded text-white placeholder-gray-500 focus:outline-none focus:border-gold-400 transition ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-600"
                }`}
                placeholder="Confirm password"
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold py-2.5 text-sm font-semibold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-gray-400 text-sm mt-8">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-gold-400 hover:text-gold-300 font-semibold transition"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
