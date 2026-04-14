"use client";

import { useAuth } from "@/components/AuthProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const US_STATES = [
  "Alabama",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

export default function AdminLeadsPage() {
  const { user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [estadoFilter, setEstadoFilter] = useState("");
  const [iuLFilter, setIULFilter] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
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

  // ── Fetch leads ─────────────────────────────────────────────────────────
  useEffect(() => {
    fetchLeads({ showLoading: true });
  }, [user, page, estadoFilter, iuLFilter]);

  const fetchLeads = async ({ showLoading = false } = {}) => {
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
        ...(estadoFilter && { estado: estadoFilter }),
        ...(iuLFilter && { tieneIUL: iuLFilter }),
      });

      const response = await fetch(`/api/admin/leads?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch leads");
      }

      const data = await response.json();
      setLeads(data.leads || []);
    } catch (err) {
      setError(err.message);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  // ── Delete lead ──────────────────────────────────────────────────────────
  const deleteLead = async (leadId) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;

    try {
      const token = await user?.getIdToken(true);
      if (!token) return;

      const response = await fetch(`/api/admin/leads/${leadId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete lead");
      }

      setLeads((prevLeads) => prevLeads.filter((lead) => lead._id !== leadId));
      if (selectedLead?._id === leadId) {
        setSelectedLead(null);
      }
      showToast("Deleted");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <ProtectedRoute adminOnly={true}>
      <main className="min-h-screen pt-16 bg-navy-900 flex">
        {sidebarOpen && (
          <button
            aria-label="Close sidebar overlay"
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
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
          className={`fixed left-0 top-16 z-40 h-[calc(100vh-64px)] w-64 overflow-y-auto border-r border-gold-500/20 bg-navy-800 transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
        >
          <div className="p-6">
            <button
              onClick={() => setSidebarOpen(false)}
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
                <p className="text-xs font-semibold text-gold-400 uppercase tracking-wider mb-4">
                  Main
                </p>
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
                  <span>Dashboard</span>
                </Link>
              </div>

              <div>
                <p className="text-xs font-semibold text-gold-400 uppercase tracking-wider mb-4 mt-6">
                  Management
                </p>
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
                  <span>Users</span>
                </Link>

                <Link
                  href="/dashboard/admin/leads"
                  className="flex items-center gap-3 px-4 py-3 text-white bg-gold-400/10 rounded transition"
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
                  <span>Leads</span>
                </Link>
              </div>
            </nav>
          </div>
        </aside>

        {/* ── Main Content ─────────────────────────────────────────────────── */}
        <div className="flex-1 lg:ml-64">
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-6 flex items-start justify-between gap-4">
              <h1 className="text-3xl font-bold text-white mb-2">
                Leads Management
              </h1>
              <button
                onClick={() => setSidebarOpen(true)}
                className="rounded border border-gold-400/40 p-2 text-gold-400 lg:hidden"
                aria-label="Open menu"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            <p className="mb-6 text-sm text-gray-400 sm:text-base">
              View and manage all leads submissions
            </p>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-300 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {/* Filters */}
            <div className="bg-navy-800 border border-gold-500/20 rounded-lg p-4 sm:p-6 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Filter by State
                  </label>
                  <select
                    value={estadoFilter}
                    onChange={(e) => {
                      setEstadoFilter(e.target.value);
                      setPage(1);
                    }}
                    className="w-full px-4 py-2 bg-navy-700 border border-gray-600 text-white rounded focus:outline-none focus:border-gold-400"
                  >
                    <option value="">All States</option>
                    {US_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Filter by IUL Status
                  </label>
                  <select
                    value={iuLFilter}
                    onChange={(e) => {
                      setIULFilter(e.target.value);
                      setPage(1);
                    }}
                    className="w-full px-4 py-2 bg-navy-700 border border-gray-600 text-white rounded focus:outline-none focus:border-gold-400"
                  >
                    <option value="">All</option>
                    <option value="Si">Has IUL</option>
                    <option value="No">No IUL</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Leads Table */}
            <div className="bg-navy-800 border border-gold-500/20 rounded-lg overflow-hidden">
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gold-500/20 bg-navy-700/50">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gold-400">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gold-400">
                        State
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gold-400">
                        Age
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gold-400">
                        Has IUL
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gold-400">
                        Investment
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gold-400">
                        Date
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
                          colSpan="7"
                          className="px-6 py-8 text-center text-gray-400"
                        >
                          Loading leads...
                        </td>
                      </tr>
                    ) : leads.length === 0 ? (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-6 py-8 text-center text-gray-400"
                        >
                          No leads found
                        </td>
                      </tr>
                    ) : (
                      leads.map((lead) => (
                        <tr
                          key={lead._id}
                          className="border-b border-gold-500/10 hover:bg-navy-700/50 transition"
                        >
                          <td className="px-6 py-4 text-white font-medium">
                            {lead.nombre}
                          </td>
                          <td className="px-6 py-4 text-gray-300">
                            {lead.estado}
                          </td>
                          <td className="px-6 py-4 text-gray-300">
                            {lead.edad}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                lead.tieneIUL === "Si"
                                  ? "bg-green-400/10 text-green-400"
                                  : "bg-gray-400/10 text-gray-400"
                              }`}
                            >
                              {lead.tieneIUL}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-300">
                            {lead.cuantoInvertir}
                          </td>
                          <td className="px-6 py-4 text-gray-400 text-sm">
                            {new Date(lead.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => setSelectedLead(lead)}
                                className="text-blue-400 hover:text-blue-300 transition text-sm font-semibold"
                              >
                                Details
                              </button>
                              <button
                                onClick={() => deleteLead(lead._id)}
                                className="text-red-400 hover:text-red-300 transition text-sm font-semibold"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {!loading && leads.length > 0 && (
                <div className="space-y-3 p-3 md:hidden">
                  {leads.map((lead) => (
                    <div key={lead._id} className="rounded-lg border border-gold-500/20 bg-navy-700/40 p-4">
                      <div className="mb-1 text-white font-semibold">{lead.nombre}</div>
                      <div className="mb-3 text-sm text-gray-300">
                        {lead.estado} • Age {lead.edad} • {lead.tieneIUL}
                      </div>
                      <div className="mb-3 text-sm text-gray-300">
                        Investment: {lead.cuantoInvertir || "-"}
                      </div>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="text-blue-400 hover:text-blue-300 transition text-sm font-semibold"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => deleteLead(lead._id)}
                          className="text-red-400 hover:text-red-300 transition text-sm font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {loading && (
                <div className="p-6 text-center text-gray-400 md:hidden">Loading leads...</div>
              )}
              {!loading && leads.length === 0 && (
                <div className="p-6 text-center text-gray-400 md:hidden">No leads found</div>
              )}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
                disabled={leads.length < 10}
                className="px-4 py-2 bg-gold-400 text-navy-900 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-gold-500/20 bg-navy-800 p-4 shadow-xl sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Lead Details</h2>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="text-gray-400 transition hover:text-white"
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">Name</p>
                  <p className="text-white">{selectedLead.nombre || "-"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">State</p>
                  <p className="text-white">{selectedLead.estado || "-"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">Age</p>
                  <p className="text-white">{selectedLead.edad ?? "-"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">Has IUL</p>
                  <p className="text-white">{selectedLead.tieneIUL || "-"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Investment Source
                  </p>
                  <p className="text-white">{selectedLead.dondeInvierte || "-"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Amount to Invest
                  </p>
                  <p className="text-white">{selectedLead.cuantoInvertir || "-"}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs uppercase tracking-wide text-gray-400">IUL Purpose</p>
                  <p className="text-white">{selectedLead.paraQueIUL || "-"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">Source</p>
                  <p className="text-white">{selectedLead.source || "-"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">Created At</p>
                  <p className="text-white">
                    {selectedLead.createdAt
                      ? new Date(selectedLead.createdAt).toLocaleString("en-US")
                      : "-"}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Metadata</p>
                  <pre className="mt-1 max-h-40 overflow-auto rounded bg-navy-900 p-3 text-xs text-gray-300">
                    {JSON.stringify(selectedLead.metadata || {}, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}
