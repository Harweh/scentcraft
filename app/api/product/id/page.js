'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { useCart } from '@/lib/CartContext'

const VOLUMES = [15, 30, 50, 100]

export default function ProductDetailPage() {
    const { id } = useParams()
    const { addItem } = useCart()
    const [fragrance, setFragrance] = useState(null)
    const [volume, setVolume] = useState(30)
    const [qty, setQty] = useState(1)
    const [loading, setLoading] = useState(true)
    const [added, setAdded] = useState(false)

    useEffect(() => {
        fetch(`/api/fragrances/${id}`)
        .then(res => res.json())
        .then(data => { if (data.success) setFragrance(data.data) })
        .finally(() => setLoading(false))
    }, [id])

    if (loading) return <p className="bg-[#100E0B] text-white/50 text-center py-20 min-h-screen">Loading…</p>
    if (!fragrance) return <p className="bg-[#100E0B] text-white/50 text-center py-20 min-h-screen">Fragrance not found.</p>

    const price = fragrance.pricePerMl * volume * qty

    return (
        <main className="bg-[#100E0B] text-[#F5EFE6] min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">

            <div className="relative aspect-square bg-[#1C1813] flex items-center justify-center text-6xl sm:text-7xl">
            {fragrance.imageUrl ? (
                <Image src={fragrance.imageUrl} alt={fragrance.name} fill className="object-cover" />
            ) : (
                <span style={{ color: fragrance.color }}>{fragrance.emoji}</span>
            )}
            </div>

            <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#B8924A] mb-2">{fragrance.category}</p>
            <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl mb-3">{fragrance.name}</h1>
            <p className="text-sm sm:text-base text-white/60 mb-6 leading-relaxed">{fragrance.description}</p>

            <p className="text-xs uppercase tracking-wide text-white/40 mb-2">Select Volume</p>
            <div className="flex gap-2 mb-6 flex-wrap">
                {VOLUMES.map(v => (
                <button
                    key={v}
                    onClick={() => setVolume(v)}
                    className={`px-4 py-2 text-sm border ${volume === v ? 'bg-[#B8924A] text-[#100E0B] border-[#B8924A]' : 'border-white/20 text-white/60'}`}
                >
                    {v}ml
                </button>
                ))}
            </div>

            <p className="text-2xl sm:text-3xl font-[family-name:var(--font-display)] mb-6 text-[#B8924A]">
                ₦{price.toLocaleString()}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center border border-white/20 w-fit">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-3">−</button>
                <span className="px-4">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-4 py-3">+</button>
                </div>
                <button
                onClick={() => {
                    addItem({ fragranceId: fragrance._id, name: fragrance.name, emoji: fragrance.emoji, color: fragrance.color, imageUrl: fragrance.imageUrl, pricePerMl: fragrance.pricePerMl, volume, qty })
                    setAdded(true)
                    setTimeout(() => setAdded(false), 2000)
                }}
                className="flex-1 bg-[#B8924A] text-[#100E0B] py-3 text-sm tracking-wide font-medium hover:bg-[#C9A45A] transition-colors"
                >
                {added ? 'Added ✓' : 'Add to Cart'}
                </button>
            </div>
            </div>
        </div>
        </main>
    )
}