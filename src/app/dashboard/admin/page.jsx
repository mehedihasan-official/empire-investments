"use client";

import { useAuth } from "@/components/AuthProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const { user, userProfile, logout } = useAuth();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userCount, setUserCount] = useState("-");
  const [leadCount, setLeadCount] = useState("-");

  useEffect(() => {
    const fetchDashboardCounts = async () => {
      try {
        if (!user) return;

        const token = await user.getIdToken(true);
        if (!token) return;

        const [usersRes, leadsRes] = await Promise.all([
          fetch("/api/users?page=1&limit=1", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/admin/leads?page=1&limit=1", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!usersRes.ok || !leadsRes.ok) {
          return;
        }

        const [usersData, leadsData] = await Promise.all([
          usersRes.json(),
          leadsRes.json(),
        ]);

        setUserCount(usersData.pagination?.total ?? "-");
        setLeadCount(leadsData.pagination?.total ?? "-");
      } catch (error) {
        console.error("Failed to load dashboard counts:", error);
      }
    };

    fetchDashboardCounts();
  }, [user]);

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
    <ProtectedRoute adminOnly={true}>
      <main className="min-h-screen pt-16 bg-navy-900 flex">
        {/* ── Sidebar ──────────────────────────────────────────────────────── */}
        <aside
          className={`${
            sidebarOpen ? "w-64" : "w-20"
          } bg-navy-800 border-r border-gold-500/20 transition-all duration-300 fixed h-[calc(100vh-64px)] overflow-y-auto z-40`}
        >
          <div className="p-6">
            {/* Toggle Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full p-2 hover:bg-gold-400/10 rounded transition mb-8"
            >
              <svg
                className="w-6 h-6 text-gold-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Navigation Menu */}
            <nav className="space-y-2">
              <div>
                {sidebarOpen && (
                  <p className="text-xs font-semibold text-gold-400 uppercase tracking-wider mb-4">
                    Main
                  </p>
                )}
                <Link
                  href="/dashboard/admin"
                  className="flex items-center gap-3 px-4 py-3 text-white hover:bg-gold-400/10 rounded transition"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  {sidebarOpen && <span>Dashboard</span>}
                </Link>
              </div>

              <div>
                {sidebarOpen && (
                  <p className="text-xs font-semibold text-gold-400 uppercase tracking-wider mb-4 mt-6">
                    Management
                  </p>
                )}
                <Link
                  href="/dashboard/admin/users"
                  className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gold-400/10 rounded transition"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                  {sidebarOpen && <span>Users</span>}
                </Link>

                <Link
                  href="/dashboard/admin/leads"
                  className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gold-400/10 rounded transition"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2 1 1 0 000-2 4 4 0 00-4 4v10a4 4 0 004 4h12a4 4 0 004-4V5a4 4 0 00-4-4 1 1 0 000 2 2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {sidebarOpen && <span>Leads</span>}
                </Link>
              </div>
            </nav>
          </div>
        </aside>

        {/* ── Main Content ─────────────────────────────────────────────────── */}
        <div
          className={`${sidebarOpen ? "ml-64" : "ml-20"} flex-1 transition-all duration-300`}
        >
          <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-12">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-gray-400">
                  Welcome, {userProfile?.displayName}
                </p>
              </div>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="btn-gold px-6 py-2.5 text-sm font-semibold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loggingOut ? "Signing Out..." : "Sign Out"}
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {/* Users Card */}
              <Link
                href="/dashboard/admin/users"
                className="bg-navy-800 border border-gold-500/20 rounded-lg p-6 hover:border-gold-400/50 transition cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white group-hover:text-gold-400 transition">
                    Users
                  </h3>
                  <svg
                    className="w-8 h-8 text-gold-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                </div>
                <p className="text-3xl font-bold text-gold-400 mb-2">
                  {userCount}
                </p>
                <p className="text-gray-400 text-sm">Manage user accounts</p>
              </Link>

              {/* Leads Card */}
              <Link
                href="/dashboard/admin/leads"
                className="bg-navy-800 border border-gold-500/20 rounded-lg p-6 hover:border-gold-400/50 transition cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white group-hover:text-gold-400 transition">
                    Leads
                  </h3>
                  <svg
                    className="w-8 h-8 text-gold-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2 1 1 0 000-2 4 4 0 00-4 4v10a4 4 0 004 4h12a4 4 0 004-4V5a4 4 0 00-4-4 1 1 0 000 2 2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-3xl font-bold text-gold-400 mb-2">
                  {leadCount}
                </p>
                <p className="text-gray-400 text-sm">View and manage leads</p>
              </Link>

              {/* Settings Card */}
              <div className="bg-navy-800 border border-gold-500/20 rounded-lg p-6 opacity-50 cursor-not-allowed">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Settings</h3>
                  <svg
                    className="w-8 h-8 text-gold-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-3xl font-bold text-gold-400 mb-2">-</p>
                <p className="text-gray-400 text-sm">Coming soon</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-navy-800 border border-gold-500/20 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/dashboard/admin/users"
                  className="flex items-center gap-4 p-4 bg-navy-700/50 hover:bg-navy-700 rounded-lg transition"
                >
                  <div className="flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-gold-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold">View All Users</p>
                    <p className="text-gray-400 text-sm">
                      Manage user accounts and roles
                    </p>
                  </div>
                </Link>

                <Link
                  href="/dashboard/admin/leads"
                  className="flex items-center gap-4 p-4 bg-navy-700/50 hover:bg-navy-700 rounded-lg transition"
                >
                  <div className="flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-gold-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path
                        fillRule="evenodd"
                        d="M4 5a2 2 0 012-2 1 1 0 000-2 4 4 0 00-4 4v10a4 4 0 004 4h12a4 4 0 004-4V5a4 4 0 00-4-4 1 1 0 000 2 2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold">View All Leads</p>
                    <p className="text-gray-400 text-sm">
                      Review and manage all leads
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
