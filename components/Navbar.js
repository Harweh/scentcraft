// /* eslint-disable @next/next/no-html-link-for-pages */
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BRAND_NAME } from '@/lib/brand'
import { useCart } from '@/lib/CartContext'

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const { items } = useCart()
    const cartCount = items.reduce((sum, i) => sum + i.qty, 0)

    return (
        <header className="bg-[#e7dfd7] text-black sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 sm:px-6 h-16 flex items-center justify-between">
            <Link href="/" className="font-[family-name:var(--font-display text-black)] text-lg text-black sm:text-xl italic shrink-0 tracking-wide">
            {BRAND_NAME}
            </Link>

            <nav className="hidden md:flex gap-8 text-sm tracking-wide">
            <Link href="/catalog" className="hover:text-[#B8924A] transition-colors">Collections</Link>
            <Link href="/customizer" className="hover:text-[#B8924A] transition-colors">Bespoke Lab</Link>
            <Link href="/orders" className="hover:text-[#B8924A] transition-colors">Orders</Link>
            </nav>

            <div className="flex items-center gap-5">
            <Link href="/catalog" aria-label="Search" className="text-black/80 hover:text-[#f8e8cb] transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
            </Link>

            <Link href="/cart" aria-label="Cart" className="relative text-black/80 hover:text-[#B8924A] transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#eeebe5] text-[#1A1714] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                    {cartCount}
                </span>
                )}
            </Link>

            <Link href="/orders" aria-label="Account" className="text-black/80 hover:text-[#B8924A] transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
            </Link>

            <button
                aria-label="Menu"
                className="md:hidden flex flex-col gap-1.5 ml-1"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                <span className={`block w-5 h-px bg-white transition-transform origin-center ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
                <span className={`block w-5 h-px bg-white transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-5 h-px bg-white transition-transform origin-center ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </button>
            </div>
        </div>

        {menuOpen && (
            <nav className="md:hidden flex flex-col px-4 pb-4 gap-1 text-sm border-t border-white/10">
            <Link href="/catalog" className="py-3 hover:text-[#B8924A] transition-colors" onClick={() => setMenuOpen(false)}>Collections</Link>
            <Link href="/customizer" className="py-3 hover:text-[#B8924A] transition-colors" onClick={() => setMenuOpen(false)}>Bespoke Lab</Link>
            <Link href="/orders" className="py-3 hover:text-[#B8924A] transition-colors" onClick={() => setMenuOpen(false)}>Orders</Link>
            </nav>
        )}
        </header>
    )
}