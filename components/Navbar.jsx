/* eslint-disable @next/next/no-html-link-for-pages */
'use client'

import { useState } from 'react'
import { BRAND_NAME } from '@/lib/brand'

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <header className="bg-[#1A1714] text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <a href="/" className="font-[family-name:var(--font-display)] text-lg sm:text-xl italic shrink-0 tracking-wide">
            {BRAND_NAME}
            </a>

            {/* Desktop nav */}
            <nav className="hidden md:flex gap-8 text-sm tracking-wide">
            <a href="/catalog" className="hover:text-[#B8924A] transition-colors">Collections</a>
            <a href="/customizer" className="hover:text-[#B8924A] transition-colors">Bespoke Lab</a>
            <a href="/orders" className="hover:text-[#B8924A] transition-colors">Orders</a>
            </nav>

            <div className="flex items-center gap-5">
            <button aria-label="Search" className="text-white/80 hover:text-[#B8924A] transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
            </button>
            <button aria-label="Cart" className="text-white/80 hover:text-[#B8924A] transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
            </button>

            {/* Hamburger — mobile only */}
            <button
                aria-label="xMenu"
                className="md:hidden flex flex-col gap-1.5 ml-1"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                <span className={`block w-5 h-px bg-white transition-transform origin-center ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
                <span className={`block w-5 h-px bg-white transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-5 h-px bg-white transition-transform origin-center ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </button>
            </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
            <nav className="md:hidden flex flex-col px-4 pb-4 gap-1 text-sm border-t border-white/10">
            <a href="/catalog" className="py-3 hover:text-[#B8924A] transition-colors" onClick={() => setMenuOpen(false)}>Collections</a>
            <a href="/customizer" className="py-3 hover:text-[#B8924A] transition-colors" onClick={() => setMenuOpen(false)}>Bespoke Lab</a>
            <a href="/orders" className="py-3 hover:text-[#B8924A] transition-colors" onClick={() => setMenuOpen(false)}>Orders</a>
            </nav>
        )}
        </header>
    )
}