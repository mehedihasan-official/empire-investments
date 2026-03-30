"use client";

import { useAuth } from "@/components/AuthProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UserDashboard() {
  const { user, userProfile, logout } = useAuth();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  // ── Handle logout ───────────────────────────────────────────────────────
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      setLoggingOut(false);
    }
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen pt-24 bg-navy-900">
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome back, {userProfile?.displayName?.split(" ")[0]}!
              </h1>
              <p className="text-gray-400">Manage your Empire account</p>
            </div>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="btn-gold px-6 py-2.5 text-sm font-semibold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loggingOut ? "Signing Out..." : "Sign Out"}
            </button>
          </div>

          {/* Profile Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="md:col-span-1">
              <div className="bg-navy-800 border border-gold-500/20 rounded-lg p-6 sticky top-24">
                <div className="text-center">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={userProfile?.displayName}
                      className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-gold-400"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-3xl font-bold text-navy-900">
                      {userProfile?.displayName?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <h2 className="text-xl font-semibold text-white mb-1">
                    {userProfile?.displayName}
                  </h2>
                  <p className="text-gray-400 text-sm mb-6">{user?.email}</p>
                  <p className="inline-block px-3 py-1 bg-gold-400/10 border border-gold-400/50 text-gold-400 rounded-full text-xs font-semibold uppercase tracking-wide">
                    {userProfile?.role || "User"}
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-2">
              <div className="bg-navy-800 border border-gold-500/20 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Account Information
                </h3>

                {/* Account Details */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Full Name
                    </label>
                    <p className="text-white text-lg">
                      {userProfile?.displayName}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Email Address
                    </label>
                    <p className="text-white text-lg">{user?.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Account Type
                    </label>
                    <p className="text-white text-lg capitalize">
                      {userProfile?.role || "Regular User"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Member Since
                    </label>
                    <p className="text-white text-lg">
                      {userProfile?.createdAt
                        ? new Date(userProfile.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/"
              className="bg-navy-800 border border-gold-500/20 rounded-lg p-6 hover:border-gold-400/50 transition"
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                Back to Home
              </h3>
              <p className="text-gray-400 text-sm">
                Return to the main website
              </p>
            </Link>

            <Link
              href="#"
              className="bg-navy-800 border border-gold-500/20 rounded-lg p-6 hover:border-gold-400/50 transition opacity-50 cursor-not-allowed"
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                Settings (Coming Soon)
              </h3>
              <p className="text-gray-400 text-sm">
                Manage your preferences and privacy
              </p>
            </Link>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
