/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import FragranceCard from '@/components/FragranceCard'

const CATEGORIES = ['Floral', 'Woody', 'Fresh', 'Oriental', 'Citrus']

export default function CatalogPage() {
    const [fragrances, setFragrances] = useState([])
    const [filtered, setFiltered] = useState([])
    const [activeCategory, setActiveCategory] = useState(null)
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/fragrances?productType=finished')
        .then(res => res.json())
        .then(data => {
            if (data.success) {
            setFragrances(data.data)
            setFiltered(data.data)
            }
        })
        .finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        let result = fragrances
        if (activeCategory) result = result.filter(f => f.category === activeCategory)
        if (search.trim()) result = result.filter(f => f.name.toLowerCase().includes(search.toLowerCase()))
        setFiltered(result)
    }, [activeCategory, search, fragrances])

    return (
        <main className="bg-[#100E0B] text-[#F5EFE6] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">

            <section className="py-12 sm:py-16 md:py-20 text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-[#B8924A] mb-4">The Collections</p>
            <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl md:text-7xl leading-tight">
                Every Aura, <em className="italic text-[#B8924A]">Curated.</em>
            </h1>
            </section>

            <div className="sticky top-16 z-40 bg-[#100E0B] py-3 -mx-4 px-4 sm:-mx-6 sm:px-6 border-b border-white/10">
            <input
                type="text"
                placeholder="Search fragrances…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full max-w-xl mx-auto block bg-transparent border border-white/20 px-4 py-3 text-sm placeholder:text-white/40 focus:outline-none focus:border-[#B8924A]"
            />
            </div>

            <div className="flex gap-2 sm:gap-3 overflow-x-auto py-6 scrollbar-hide">
            <button
                onClick={() => setActiveCategory(null)}
                className={`shrink-0 px-4 py-2 text-xs uppercase tracking-wide border whitespace-nowrap ${!activeCategory ? 'bg-[#B8924A] text-[#100E0B] border-[#B8924A]' : 'border-white/20 text-white/60'}`}
            >
                All
            </button>
            {CATEGORIES.map(cat => (
                <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-4 py-2 text-xs uppercase tracking-wide border whitespace-nowrap ${activeCategory === cat ? 'bg-[#B8924A] text-[#100E0B] border-[#B8924A]' : 'border-white/20 text-white/60'}`}
                >
                {cat}
                </button>
            ))}
            </div>

            {loading ? (
            <p className="text-center text-white/50 py-20">Loading fragrances…</p>
            ) : filtered.length === 0 ? (
            <p className="text-center text-white/50 py-20">No fragrances match that search.</p>
            ) : (
            <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 mt-4">
                {filtered.map(f => (
                <Link key={f._id} href={`/product/${f._id}`} className="group block">
                    <div className="relative aspect-square mb-3 sm:mb-4 overflow-hidden bg-[#1C1813] flex items-center justify-center text-3xl sm:text-4xl">
                    {f.imageUrl ? (
                        <Image src={f.imageUrl} alt={f.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                        <span style={{ color: f.color }}>{f.emoji}</span>
                    )}
                    </div>
                    <p className="text-[10px] sm:text-xs uppercase tracking-wide text-[#B8924A] mb-1">{f.category}</p>
                    <h3 className="font-[family-name:var(--font-display)] text-base sm:text-lg mb-1 group-hover:text-[#B8924A] transition-colors">
                    {f.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/50">
                    ₦{(f.pricePerMl * 30).toLocaleString()}<span className="text-[10px] sm:text-xs"> / 30ml</span>
                    </p>
                </Link>
                ))}
            </section>
            )}
        </div>
        </main>
    )
}