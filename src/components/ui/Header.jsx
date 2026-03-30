"use client";

import { useAuth } from "@/components/AuthProvider";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import logo from "../../../public/empire-logo.png";

export default function Header() {
  const { user, userProfile, isAuthenticated, isAdmin, logout, loading } =
    useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      setDropdownOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy-950/90 backdrop-blur-md border-b border-gold-500/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between">
        {/* ── Logo ──────────────────────────────────────── */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
          <Image
            src={logo}
            alt="Empire Investments"
            height={80}
            className="h-10 sm:h-12 md:h-14 w-auto"
            priority
          />
          <div className="leading-none">
            <p className="text-white font-display font-semibold text-base sm:text-lg md:text-xl">
              Empire
            </p>
            <p className="text-gold-400 font-display text-[10px] sm:text-xs md:text-sm tracking-[0.2em] uppercase">
              Investments
            </p>
          </div>
        </Link>

        {/* ── Right Section ──────────────────────────────────────── */}
        <div className="flex items-center gap-4">
          {/* Sign In / Sign Up Links */}
          {!loading && !isAuthenticated && (
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/signin"
                className="text-gray-300 hover:text-gold-400 text-xs sm:text-sm font-semibold uppercase tracking-widest transition"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="btn-gold px-3 py-2 text-[10px] sm:px-4 sm:py-2.5 sm:text-xs md:px-5 tracking-widest uppercase"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* User Dropdown Menu */}
          {!loading && isAuthenticated && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 hover:bg-navy-800/50 px-3 py-2 rounded-lg transition"
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={userProfile?.displayName}
                    className="w-8 h-8 rounded-full border border-gold-400"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-xs font-bold text-navy-900">
                    {userProfile?.displayName?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:inline text-sm text-white font-semibold">
                  {userProfile?.displayName?.split(" ")[0]}
                </span>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-navy-800 border border-gold-500/20 rounded-lg shadow-lg overflow-hidden">
                  <div className="px-4 py-3 border-b border-gold-500/20">
                    <p className="text-white font-semibold text-sm">
                      {userProfile?.displayName}
                    </p>
                    <p className="text-gray-400 text-xs">{user?.email}</p>
                  </div>

                  <nav className="py-2">
                    {/* Dashboard Link */}
                    <Link
                      href={isAdmin ? "/dashboard/admin" : "/dashboard/user"}
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gold-400/10 hover:text-gold-400 transition"
                    >
                      {isAdmin ? "Admin Dashboard" : "My Dashboard"}
                    </Link>

                    {/* Settings */}
                    <Link
                      href="#"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gold-400/10 hover:text-gold-400 transition opacity-50 cursor-not-allowed"
                    >
                      Settings
                    </Link>

                    {/* Divider */}
                    <div className="border-t border-gold-500/20 my-2"></div>

                    {/* Sign Out */}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 transition"
                    >
                      Sign Out
                    </button>
                  </nav>
                </div>
              )}
            </div>
          )}

          {/* Original CTA for non-authenticated users */}
          {!loading && !isAuthenticated && window.location.pathname === "/" && (
            <a
              href="#formulario"
              className="hidden sm:block btn-gold px-3 py-2 text-[10px] sm:px-4 sm:py-2.5 sm:text-xs md:px-5 tracking-widest uppercase"
            >
              Solicitar Info
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
