"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/empire-logo.png"

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy-950/90 backdrop-blur-md border-b border-gold-500/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">

        {/* ── Logo ──────────────────────────────────────── */}
        <Link href="/" className="flex items-center gap-3 group">
          
            <Image
              src={logo}
              alt="Empire Investments"
              
              height={40}
              priority
            />
         
          {/* <div className="w-10 h-10 rounded-full bg-gold-500/15 border border-gold-500/50 flex items-center justify-center">
            <span className="text-gold-400 font-display font-bold text-sm">EI</span>
          </div>
          <div className="leading-none">
            <p className="text-white font-display font-semibold text-sm">Empire</p>
            <p className="text-gold-400 font-display text-[10px] tracking-[0.2em] uppercase">
              Investments
            </p>
          </div> */}
        </Link>

        {/* ── CTA ───────────────────────────────────────── */}
        <a
          href="#formulario"
          className="btn-gold px-5 py-2.5 text-xs tracking-widest uppercase"
        >
          Solicitar Info
        </a>
      </div>
    </header>
  );
}
