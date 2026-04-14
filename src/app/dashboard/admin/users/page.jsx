"use client";

import { useAuth } from "@/components/AuthProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function AdminUsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  const showToast = (message, type = "success") => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast({ message, type });
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 2200);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  // ── Fetch users ─────────────────────────────────────────────────────────
  useEffect(() => {
    fetchUsers({ showLoading: true });
  }, [user, page, roleFilter]);

  const fetchUsers = async ({ showLoading = false } = {}) => {
    try {
      setError("");
      if (showLoading) {
        setLoading(true);
      }
      const token = await user?.getIdToken(true);
      if (!token) return;

      const query = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(roleFilter !== "all" && { role: roleFilter }),
      });

      const response = await fetch(`/api/users?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  // ── Update user role ────────────────────────────────────────────────────
  const updateUserRole = async (userId, newRole) => {
    try {
      const token = await user?.getIdToken(true);
      if (!token) return;

      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update user");
      }

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u._id === userId ? { ...u, role: newRole, updatedAt: new Date() } : u
        )
      );
      showToast("Updated");
    } catch (err) {
      setError(err.message);
    }
  };

  // ── Delete user ──────────────────────────────────────────────────────────
  const deleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = await user?.getIdToken(true);
      if (!token) return;

      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete user");
      }

      setUsers((prevUsers) => prevUsers.filter((u) => u._id !== userId));
      showToast("Deleted");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <ProtectedRoute adminOnly={true}>
      <main className="min-h-screen pt-16 bg-navy-900 flex">
        {toast && (
          <div className="pointer-events-none fixed right-6 top-24 z-50">
            <div
              className={`rounded-md border px-4 py-2 text-sm font-semibold shadow-lg transition-all duration-300 ${
                toast.type === "success"
                  ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-200"
                  : "border-red-400/40 bg-red-500/15 text-red-200"
              }`}
            >
              {toast.message}
            </div>
          </div>
        )}
        {/* ── Sidebar ──────────────────────────────────────────────────────── */}
        <aside
          className={`${
            sidebarOpen ? "w-64" : "w-20"
          } bg-navy-800 border-r border-gold-500/20 transition-all duration-300 fixed h-[calc(100vh-64px)] overflow-y-auto z-40`}
        >
          <div className="p-6">
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

            <nav className="space-y-2">
              <div>
                {sidebarOpen && (
                  <p className="text-xs font-semibold text-gold-400 uppercase tracking-wider mb-4">
                    Main
                  </p>
                )}
                <Link
                  href="/dashboard/admin"
                  className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gold-400/10 rounded transition"
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
                  className="flex items-center gap-3 px-4 py-3 text-white bg-gold-400/10 rounded transition"
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
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                Users Management
              </h1>
              <p className="text-gray-400">Manage and control user accounts</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-300 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {/* Filters */}
            <div className="bg-navy-800 border border-gold-500/20 rounded-lg p-6 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Filter by Role
                  </label>
                  <select
                    value={roleFilter}
                    onChange={(e) => {
                      setRoleFilter(e.target.value);
                      setPage(1);
                    }}
                    className="px-4 py-2 bg-navy-700 border border-gray-600 text-white rounded focus:outline-none focus:border-gold-400"
                  >
                    <option value="all">All Roles</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-navy-800 border border-gold-500/20 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gold-500/20 bg-navy-700/50">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gold-400">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gold-400">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gold-400">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gold-400">
                        Joined
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gold-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-6 py-8 text-center text-gray-400"
                        >
                          Loading users...
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-6 py-8 text-center text-gray-400"
                        >
                          No users found
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr
                          key={u._id}
                          className="border-b border-gold-500/10 hover:bg-navy-700/50 transition"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {u.photoURL ? (
                                <img
                                  src={u.photoURL}
                                  alt={u.displayName}
                                  className="w-8 h-8 rounded-full"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-xs font-bold text-navy-900">
                                  {u.displayName?.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <span className="text-white font-medium">
                                {u.displayName}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-300">{u.email}</td>
                          <td className="px-6 py-4">
                            <select
                              value={u.role}
                              onChange={(e) =>
                                updateUserRole(u._id, e.target.value)
                              }
                              className="px-3 py-1 bg-navy-700 border border-gray-600 text-white rounded text-sm focus:outline-none focus:border-gold-400"
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-gray-400 text-sm">
                            {new Date(u.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => deleteUser(u._id)}
                              className="text-red-400 hover:text-red-300 transition text-sm font-semibold"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gold-400 text-navy-900 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              <span className="text-gray-400">Page {page}</span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={users.length < 10}
                className="px-4 py-2 bg-gold-400 text-navy-900 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
