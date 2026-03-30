"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/empire-logo.png";

export default function Header() {
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
            <p className="text-white font-display font-semibold text-base sm:text-lg md:text-xl">Empire</p>
            <p className="text-gold-400 font-display text-[10px] sm:text-xs md:text-sm tracking-[0.2em] uppercase">
              Investments
            </p>
          </div>
        </Link>

        {/* ── CTA ───────────────────────────────────────── */}
        <a
          href="#formulario"
          className="btn-gold px-3 py-2 text-[10px] sm:px-4 sm:py-2.5 sm:text-xs md:px-5 tracking-widest uppercase"
        >
          <span className="sm:hidden">Solicitar</span>
          <span className="hidden sm:inline">Solicitar Info</span>
        </a>
      </div>
    </header>
  );
}