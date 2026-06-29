'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/lib/CartContext'

export default function FragranceCard({ fragrance, priority = false }) {
    const { _id, name, category, pricePerMl, imageUrl, color, emoji, duration } = fragrance
    const { addItem } = useCart()
    const [added, setAdded] = useState(false)

    const bottlePrice = (pricePerMl * 30).toLocaleString()

    function handleAddToCart(e) {
        // Stop the Link from navigating when tapping the button
        e.preventDefault()
        e.stopPropagation()
        addItem({
        fragranceId: _id,
        name,
        emoji,
        color,
        imageUrl,
        pricePerMl,
        volume: 30,   // default 30ml from the catalog
        qty: 1,
        })
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
    }

    return (
        <Link href={`/product/${_id}`} className="group block">
        {/* Image / colour swatch */}
        <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-[#1C1813]">
            {imageUrl ? (
            <Image
                src={imageUrl}
                alt={name}
                fill
                priority={priority}
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            ) : (
            <div
                className="w-full h-full flex items-center justify-center text-5xl"
                style={{ backgroundColor: color || '#1C1813' }}
            >
                {emoji}
            </div>
            )}

            {/* Duration badge */}
            <span className="absolute top-3 left-3 text-[9px] uppercase tracking-[0.15em] px-2 py-1 bg-[#100E0B]/70 text-[#F5EFE6]/60 backdrop-blur-sm">
            {duration}
            </span>

            {/* Add to Cart — slides up on hover */}
            <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
                onClick={handleAddToCart}
                className={`w-full py-3 text-[10px] uppercase tracking-[0.2em] font-medium transition-colors
                ${added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#B8924A] text-[#100E0B] hover:bg-[#C9A45A]'
                }`}
            >
                {added ? '✓ Added to Cart' : '+ Add to Cart'}
            </button>
            </div>
        </div>

        {/* Text */}
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#B8924A] mb-1">{category}</p>
        <h3 className="font-[family-name:var(--font-display)] text-base sm:text-lg leading-snug mb-1.5 group-hover:text-[#B8924A] transition-colors duration-200">
            {name}
        </h3>
        <p className="text-sm text-[#F5EFE6]/50">
            ₦{bottlePrice}<span className="text-xs"> / 30ml</span>
        </p>
        </Link>
    )
}