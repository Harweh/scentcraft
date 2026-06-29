'use client'

import { useCart } from '@/lib/CartContext'
import Link from 'next/link'

export default function CartPage() {
    const { items, removeItem, updateQty } = useCart()
    const subtotal = items.reduce((sum, i) => sum + i.pricePerMl * i.volume * i.qty, 0)

    if (items.length === 0) {
        return (
        <main className="bg-[#100E0B] text-white min-h-screen flex items-center justify-center px-4">
            <div className="text-center">
            <p className="text-white/50 mb-6">Your bag is empty.</p>
            <Link href="/catalog" className="bg-[#B8924A] text-[#100E0B] px-6 py-3 text-sm font-medium inline-block">
                Browse the Collection
            </Link>
            </div>
        </main>
        )
    }

    return (
        <main className="bg-[#100E0B] text-[#F5EFE6] min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl mb-6 sm:mb-8">Shopping Bag</h1>

            <div className="flex flex-col gap-4 sm:gap-6 mb-8">
            {items.map((item, i) => (
                <div key={i} className="flex gap-4 border-b border-white/10 pb-4 sm:pb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center text-2xl bg-[#1C1813]" style={{ color: item.color }}>
                    {item.emoji}
                </div>
                <div className="flex-1">
                    <h3 className="font-[family-name:var(--font-display)] text-base sm:text-lg">{item.name}</h3>
                    <p className="text-xs text-white/40 mb-2">{item.volume}ml</p>
                    <div className="flex items-center gap-3">
                    <div className="flex items-center border border-white/20">
                        <button onClick={() => updateQty(i, item.qty - 1)} className="px-3 py-1">−</button>
                        <span className="px-3 text-sm">{item.qty}</span>
                        <button onClick={() => updateQty(i, item.qty + 1)} className="px-3 py-1">+</button>
                    </div>
                    <button onClick={() => removeItem(i)} className="text-xs text-white/40 underline">Remove</button>
                    </div>
                </div>
                <p className="text-sm sm:text-base font-[family-name:var(--font-display)] text-[#B8924A]">
                    ₦{(item.pricePerMl * item.volume * item.qty).toLocaleString()}
                </p>
                </div>
            ))}
            </div>

            <div className="flex justify-between text-base sm:text-lg mb-6">
            <span>Subtotal</span>
            <span className="font-[family-name:var(--font-display)] text-[#B8924A]">₦{subtotal.toLocaleString()}</span>
            </div>

            <Link href="/checkout" className="block text-center bg-[#B8924A] text-[#100E0B] py-3 text-sm tracking-wide font-medium hover:bg-[#C9A45A] transition-colors">
            Proceed to Checkout
            </Link>
        </div>
        </main>
    )
}