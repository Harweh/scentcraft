/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { useEffect, useState } from 'react'

const CATEGORIES = ['Floral', 'Woody', 'Fresh', 'Oriental', 'Citrus']

export default function CatalogPage() {
    const [fragrances, setFragrances] = useState([])
    const [filtered, setFiltered] = useState([])
    const [activeCategory, setActiveCategory] = useState(null)
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/fragrances')
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
        if (search.trim()) {
        result = result.filter(f => f.name.toLowerCase().includes(search.toLowerCase()))
        }
        setFiltered(result)
    }, [activeCategory, search, fragrances])

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">

        {/* Hero — type scales down hard on small screens, buttons stack vertically */}
        <section className="py-12 sm:py-16 md:py-20 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-[#B8924A] mb-3 sm:mb-4">
            The Art of Scent
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl md:text-7xl leading-tight mb-4 sm:mb-6">
            Define Your Aura<br />
            <em className="italic text-[#B8924A]">Precisely.</em>
            </h1>
            <p className="text-sm sm:text-base text-[#6B6459] max-w-md mx-auto mb-6 sm:mb-8">
            Discover artisan fragrances crafted for the discerning, or build a
            signature blend entirely your own.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-xs sm:max-w-none mx-auto">
            <button className="bg-[#1A1714] text-white px-6 sm:px-8 py-3 text-sm tracking-wide hover:bg-[#B8924A] transition">
                Explore Collection
            </button>
            <a href="/customizer" className="border border-[#1A1714] px-6 sm:px-8 py-3 text-sm tracking-wide hover:border-[#B8924A] hover:text-[#B8924A] transition">
                Mix Your Own
            </a>
            </div>
        </section>

        {/* Filters — search full-width on mobile, category pills scroll horizontally instead of wrapping */}
        <section className="mb-8 sm:mb-10 border-t border-[#E5E0D8] pt-6 sm:pt-8">
            <input
            type="text"
            placeholder="Search fragrances…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-[#E5E0D8] px-4 py-2.5 text-sm mb-3 focus:outline-none focus:border-[#B8924A]"
            />
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible scrollbar-hide">
            <button
                onClick={() => setActiveCategory(null)}
                className={`shrink-0 px-4 py-2 text-xs uppercase tracking-wide border whitespace-nowrap ${!activeCategory ? 'bg-[#1A1714] text-white' : 'border-[#E5E0D8] text-[#6B6459]'}`}
            >
                All
            </button>
            {CATEGORIES.map(cat => (
                <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-4 py-2 text-xs uppercase tracking-wide border whitespace-nowrap ${activeCategory === cat ? 'bg-[#1A1714] text-white' : 'border-[#E5E0D8] text-[#6B6459]'}`}
                >
                {cat}
                </button>
            ))}
            </div>
        </section>

        {/* Grid — 2 columns on phones, 3 on tablets, 4 on desktop */}
        {loading ? (
            <p className="text-center text-[#6B6459] py-16 sm:py-20">Loading fragrances…</p>
        ) : filtered.length === 0 ? (
            <p className="text-center text-[#6B6459] py-16 sm:py-20">No fragrances match that search.</p>
        ) : (
            <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map(f => (
                <a key={f._id} href={`/product/${f._id}`} className="group block">
                <div
                    className="aspect-square mb-3 sm:mb-4 flex items-center justify-center text-3xl sm:text-4xl"
                    style={{ backgroundColor: f.color || '#F0EBE3' }}
                >
                    {f.emoji}
                </div>
                <p className="text-[10px] sm:text-xs uppercase tracking-wide text-[#B8924A] mb-1">
                    {f.category}
                </p>
                <h3 className="font-[family-name:var(--font-display)] text-base sm:text-lg mb-1 group-hover:text-[#B8924A] transition">
                    {f.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#6B6459]">
                    ₦{(f.pricePerMl * 30).toLocaleString()}
                    <span className="text-[10px] sm:text-xs"> / 30ml</span>
                </p>
                </a>
            ))}
            </section>
        )}

        </main>
    )
}