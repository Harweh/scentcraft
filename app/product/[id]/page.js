// 'use client'

// import { useEffect, useState } from 'react'
// import { useParams } from 'next/navigation'
// import Image from 'next/image'
// import Link from 'next/link'
// import { useCart } from '@/lib/CartContext'

// const VOLUMES = [15, 30, 50, 100]

// export default function ProductDetailPage() {
//     const { id } = useParams()
//     const { addItem } = useCart()
//     const [fragrance, setFragrance] = useState(null)
//     const [volume, setVolume] = useState(30)
//     const [qty, setQty] = useState(1)
//     const [loading, setLoading] = useState(true)
//     const [added, setAdded] = useState(false)

//     useEffect(() => {
//         // if (!id) return
//         // fetch(`/api/fragrances/${id}`)
//         // .then(res => res.json())
//         // .then(data => { if (data.success) setFragrance(data.data) })
//         // .finally(() => setLoading(false))

//         if (!id) return
//         fetch(`/api/fragrances/${id}`)
//         .then(r => r.json())
//         .then(data => { if (data.success) setFragrance(data.data) })
//         .catch(console.error)
//         .finally(() => setLoading(false))
//     }, [id])

//     function handleAddToCart() {
//     addItem({
//         fragranceId: fragrance._id,
//         name:        fragrance.name,
//         emoji:       fragrance.emoji,
//         color:       fragrance.color,
//         imageUrl:    fragrance.imageUrl,
//         pricePerMl:  fragrance.pricePerMl,
//         volume,
//         qty,
//     })
//     setAdded(true)
//     setTimeout(() => setAdded(false), 2500)
//     }

//     if (loading) return <p className="bg-[#100E0B] text-white/50 text-center py-20 min-h-screen">Loading…</p>
//     if (!fragrance) return <p className="bg-[#100E0B] text-white/50 text-center py-20 min-h-screen">Fragrance not found.</p>

//     const price = fragrance.pricePerMl * volume * qty

//     return (
//         <main className="bg-[#100E0B] text-[#F5EFE6] min-h-screen">
//         <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">

//             <div className="relative aspect-square bg-[#1C1813] flex items-center justify-center text-6xl sm:text-7xl">
//             {fragrance.imageUrl ? (
//                 <Image src={fragrance.imageUrl} alt={fragrance.name} fill className="object-cover" />
//             ) : (
//                 <span style={{ color: fragrance.color }}>{fragrance.emoji}</span>
//             )}
//             </div>

//             <div>
//             <p className="text-xs uppercase tracking-[0.2em] text-[#B8924A] mb-2">{fragrance.category}</p>
//             <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl mb-3">{fragrance.name}</h1>
//             <p className="text-sm sm:text-base text-white/60 mb-6 leading-relaxed">{fragrance.description}</p>

//             <p className="text-xs uppercase tracking-wide text-white/40 mb-2">Select Volume</p>
//             <div className="flex gap-2 mb-6 flex-wrap">
//                 {VOLUMES.map(v => (
//                 <button
//                     key={v}
//                     onClick={() => setVolume(v)}
//                     className={`px-4 py-2 text-sm border ${volume === v ? 'bg-[#B8924A] text-[#100E0B] border-[#B8924A]' : 'border-white/20 text-white/60'}`}
//                 >
//                     {v}ml
//                 </button>
//                 ))}
//             </div>

//             <p className="text-2xl sm:text-3xl font-[family-name:var(--font-display)] mb-6 text-[#B8924A]">
//                 ₦{price.toLocaleString()}
//             </p>

//             <div className="flex flex-col sm:flex-row gap-3">
//                 <div className="flex items-center border border-white/20 w-fit">
//                 <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-3">−</button>
//                 <span className="px-4">{qty}</span>
//                 <button onClick={() => setQty(qty + 1)} className="px-4 py-3">+</button>
//                 </div>
//                 <button
//                 onClick={() => {
//                     addItem({ fragranceId: fragrance._id, name: fragrance.name, emoji: fragrance.emoji, color: fragrance.color, imageUrl: fragrance.imageUrl, pricePerMl: fragrance.pricePerMl, volume, qty })
//                     setAdded(true)
//                     setTimeout(() => setAdded(false), 2000)
//                 }}
//                 className="flex-1 bg-[#B8924A] text-[#100E0B] py-3 text-sm tracking-wide font-medium hover:bg-[#C9A45A] transition-colors"
//                 >
//                 {added ? 'Added ✓' : 'Add to Cart'}
//                 </button>
//             </div>
//             </div>
//         </div>
//         </main>
//     )
// }

// 'use client'

// import { useEffect, useState } from 'react'
// import { useParams } from 'next/navigation'
// import Image from 'next/image'
// import Link from 'next/link'
// import { useCart } from '@/lib/CartContext'

// const ML_OPTIONS = [15, 30, 50, 100]

// export default function ProductDetailPage() {
//     const { id } = useParams()
//     const { addItem } = useCart()
//     const [fragrance, setFragrance] = useState(null)
//     const [loading,   setLoading]   = useState(true)
//     const [volume,    setVolume]    = useState(30)
//     const [qty,       setQty]       = useState(1)
//     const [added,     setAdded]     = useState(false)

//     useEffect(() => {

//     // if (!id) return
//     //     fetch(`/api/fragrances/${id}`)
//     //     .then(res => res.json())
//     //     .then(data => { if (data.success) setFragrance(data.data) })
//     //     .finally(() => setLoading(false))


//     if (!id) return
//         fetch(`/api/fragrances/${id}`)
//         .then(r => r.json())
//         .then(data => { if (data.success) setFragrance(data.data) })
//         .catch(console.error)
//         .finally(() => setLoading(false))
//     }, [id])

//     function handleAddToCart() {
//         addItem({
//         fragranceId: fragrance._id,
//         name:        fragrance.name,
//         emoji:       fragrance.emoji,
//         color:       fragrance.color,
//         imageUrl:    fragrance.imageUrl,
//         pricePerMl:  fragrance.pricePerMl,
//         volume,
//         qty,
//         })
//         setAdded(true)
//         setTimeout(() => setAdded(false), 2500)
//     }

//     if (loading) return (
//         <main className="bg-[#100E0B] min-h-screen text-[#F5EFE6]">
//         <div className="max-w-7xl mx-auto px-6 sm:px-8 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
//             <div className="aspect-[3/4] bg-white/5" />
//             <div className="space-y-4 pt-4">
//             <div className="h-3 bg-white/5 w-20" />
//             <div className="h-8 bg-white/5 w-64" />
//             <div className="h-3 bg-white/5 w-full max-w-sm" />
//             </div>
//         </div>
//         </main>
//     )

//     if (!fragrance) return (
//         <main className="bg-[#100E0B] min-h-screen text-[#F5EFE6] flex items-center justify-center">
//         <div className="text-center">
//             <p className="text-4xl mb-4">🌿</p>
//             <p className="font-[family-name:var(--font-display)] text-2xl mb-4">Fragrance not found</p>
//             <Link href="/catalog" className="text-xs uppercase tracking-[0.15em] text-[#B8924A] hover:underline">Back to catalog</Link>
//         </div>
//         </main>
//     )

//     const { name, category, description, pricePerMl, imageUrl, color, emoji, duration, inStock } = fragrance
//     const totalPrice = (pricePerMl * volume * qty).toLocaleString()

//     return (
//         <main className="bg-[#100E0B] min-h-screen text-[#F5EFE6]">

//         {/* Breadcrumb */}
//         <div className="border-b border-white/10">
//             <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4 flex items-center gap-2 text-xs text-[#F5EFE6]/30 uppercase tracking-[0.12em]">
//             <Link href="/catalog" className="hover:text-[#B8924A] transition-colors">Collections</Link>
//             <span>/</span>
//             <span className="text-[#F5EFE6]/60">{name}</span>
//             </div>
//         </div>

//         <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 sm:py-20">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">

//             {/* Image — sticky on desktop */}
//             <div className="relative aspect-[3/4] overflow-hidden bg-[#1C1813] md:sticky md:top-28">
//                 {imageUrl ? (
//                 <Image src={imageUrl} alt={name} fill priority className="object-cover object-center" />
//                 ) : (
//                 <div className="w-full h-full flex items-center justify-center text-8xl" style={{ backgroundColor: color || '#1C1813' }}>
//                     {emoji}
//                 </div>
//                 )}
//             </div>

//             {/* Info panel */}
//             <div className="flex flex-col gap-8 pt-2">

//                 <div>
//                 <p className="text-xs uppercase tracking-[0.25em] text-[#B8924A] mb-3">{category}</p>
//                 <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl leading-tight mb-4">{name}</h1>
//                 <p className="text-sm text-[#F5EFE6]/60 leading-relaxed">{description}</p>
//                 </div>

//                 {/* Pills */}
//                 <div className="flex gap-3 flex-wrap">
//                 <span className="text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 border border-white/15 text-[#F5EFE6]/50">
//                     {duration} lasting
//                 </span>
//                 <span className={`text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 border ${inStock ? 'border-emerald-500/30 text-emerald-400/70' : 'border-red-500/30 text-red-400/70'}`}>
//                     {inStock ? 'In Stock' : 'Out of Stock'}
//                 </span>
//                 </div>

//                 <div className="h-px bg-white/10" />

//                 {/* Volume selector */}
//                 <div>
//                 <p className="text-xs uppercase tracking-[0.2em] text-[#F5EFE6]/40 mb-4">Select Volume</p>
//                 <div className="flex gap-3">
//                     {ML_OPTIONS.map(size => (
//                     <button
//                         key={size}
//                         onClick={() => setVolume(size)}
//                         className={`flex-1 py-3 text-xs uppercase tracking-[0.12em] border transition-colors
//                         ${volume === size
//                             ? 'bg-[#B8924A] border-[#B8924A] text-[#100E0B]'
//                             : 'border-white/15 text-[#F5EFE6]/50 hover:border-[#B8924A] hover:text-[#B8924A]'}`}
//                     >
//                         {size}ml
//                     </button>
//                     ))}
//                 </div>
//                 </div>

//                 {/* Qty + price */}
//                 <div className="flex items-center justify-between">
//                 <div>
//                     <p className="text-xs uppercase tracking-[0.2em] text-[#F5EFE6]/30 mb-1">Quantity</p>
//                     <div className="flex items-center border border-white/15">
//                     <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-2.5 text-[#F5EFE6]/50 hover:text-[#B8924A] transition-colors">−</button>
//                     <span className="px-4 text-sm">{qty}</span>
//                     <button onClick={() => setQty(qty + 1)} className="px-4 py-2.5 text-[#F5EFE6]/50 hover:text-[#B8924A] transition-colors">+</button>
//                     </div>
//                 </div>
//                 <div className="text-right">
//                     <p className="text-xs uppercase tracking-[0.2em] text-[#F5EFE6]/30 mb-1">Total</p>
//                     <p className="font-[family-name:var(--font-display)] text-3xl text-[#B8924A]">₦{totalPrice}</p>
//                     <p className="text-xs text-[#F5EFE6]/25 mt-0.5">₦{pricePerMl.toLocaleString()}/ml</p>
//                 </div>
//                 </div>

//                 {/* CTAs */}
//                 <div className="flex flex-col gap-3">
//                 <button
//                     onClick={handleAddToCart}
//                     disabled={!inStock}
//                     className={`w-full py-4 text-xs uppercase tracking-[0.2em] font-medium transition-colors
//                     ${!inStock
//                         ? 'bg-white/5 text-[#F5EFE6]/20 cursor-not-allowed'
//                         : added
//                         ? 'bg-emerald-600 text-white'
//                         : 'bg-[#B8924A] text-[#100E0B] hover:bg-[#C9A45A]'
//                     }`}
//                 >
//                     {added ? '✓ Added to Cart' : inStock ? 'Add to Cart' : 'Out of Stock'}
//                 </button>
//                 <Link
//                     href="/cart"
//                     className="w-full py-4 text-xs uppercase tracking-[0.2em] border border-white/20 text-center hover:border-[#B8924A] hover:text-[#B8924A] transition-colors"
//                 >
//                     View Cart →
//                 </Link>
//                 </div>

//                 {/* Delivery */}
//                 <p className="text-xs text-[#F5EFE6]/25 border-t border-white/10 pt-6">
//                 Lagos delivery ₦1,500 · National ₦3,500 · International ₦15,000
//                 </p>
//             </div>
//             </div>
//         </div>
//         </main>
//     )
// }


'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/lib/CartContext'

const ML_OPTIONS = [15, 30, 50, 100]

export default function ProductDetailPage() {
    const { id } = useParams()
    const { addItem } = useCart()
    const [fragrance, setFragrance] = useState(null)
    const [loading,   setLoading]   = useState(true)
    const [volume,    setVolume]    = useState(30)
    const [qty,       setQty]       = useState(1)
    const [added,     setAdded]     = useState(false)

    useEffect(() => {
        if (!id) return
        fetch(`/api/fragrances/${id}`)
        .then(r => r.json())
        .then(data => { if (data.success && data.data) setFragrance(data.data) })
        .catch(console.error)
        .finally(() => setLoading(false))
    }, [id])

    function handleAddToCart() {
        addItem({
        fragranceId: fragrance._id,
        name:        fragrance.name,
        emoji:       fragrance.emoji,
        color:       fragrance.color,
        imageUrl:    fragrance.imageUrl,
        pricePerMl:  fragrance.pricePerMl,
        volume,
        qty,
        })
        setAdded(true)
        setTimeout(() => setAdded(false), 2500)
    }

    if (loading) return (
        <main className="bg-[#100E0B] min-h-screen text-[#F5EFE6]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
            <div className="aspect-[3/4] bg-white/5" />
            <div className="space-y-4 pt-4">
            <div className="h-3 bg-white/5 w-20" />
            <div className="h-8 bg-white/5 w-64" />
            <div className="h-3 bg-white/5 w-full max-w-sm" />
            </div>
        </div>
        </main>
    )

    if (!fragrance) return (
        <main className="bg-[#100E0B] min-h-screen text-[#F5EFE6] flex items-center justify-center">
        <div className="text-center">
            <p className="text-4xl mb-4">🌿</p>
            <p className="font-[family-name:var(--font-display)] text-2xl mb-4">Fragrance not found</p>
            <Link href="/catalog" className="text-xs uppercase tracking-[0.15em] text-[#B8924A] hover:underline">Back to catalog</Link>
        </div>
        </main>
    )

    const { name, category, description, pricePerMl, imageUrl, color, emoji, duration, inStock } = fragrance
    const totalPrice = (pricePerMl * volume * qty).toLocaleString()

    return (
        <main className="bg-[#100E0B] min-h-screen text-[#F5EFE6]">

        {/* Breadcrumb */}
        <div className="border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4 flex items-center gap-2 text-xs text-[#F5EFE6]/30 uppercase tracking-[0.12em]">
            <Link href="/catalog" className="hover:text-[#B8924A] transition-colors">Collections</Link>
            <span>/</span>
            <span className="text-[#F5EFE6]/60">{name}</span>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 sm:py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">

            {/* Image — sticky on desktop */}
            <div className="relative aspect-[3/4] overflow-hidden bg-[#1C1813] md:sticky md:top-28">
                {imageUrl ? (
                <Image src={imageUrl} alt={name} fill priority className="object-cover object-center" />
                ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl" style={{ backgroundColor: color || '#1C1813' }}>
                    {emoji}
                </div>
                )}
            </div>

            {/* Info panel */}
            <div className="flex flex-col gap-8 pt-2">

                <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#B8924A] mb-3">{category}</p>
                <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl leading-tight mb-4">{name}</h1>
                <p className="text-sm text-[#F5EFE6]/60 leading-relaxed">{description}</p>
                </div>

                {/* Pills */}
                <div className="flex gap-3 flex-wrap">
                <span className="text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 border border-white/15 text-[#F5EFE6]/50">
                    {duration} lasting
                </span>
                <span className={`text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 border ${inStock ? 'border-emerald-500/30 text-emerald-400/70' : 'border-red-500/30 text-red-400/70'}`}>
                    {inStock ? 'In Stock' : 'Out of Stock'}
                </span>
                </div>

                <div className="h-px bg-white/10" />

                {/* Volume selector */}
                <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#F5EFE6]/40 mb-4">Select Volume</p>
                <div className="flex gap-3">
                    {ML_OPTIONS.map(size => (
                    <button
                        key={size}
                        onClick={() => setVolume(size)}
                        className={`flex-1 py-3 text-xs uppercase tracking-[0.12em] border transition-colors
                        ${volume === size
                            ? 'bg-[#B8924A] border-[#B8924A] text-[#100E0B]'
                            : 'border-white/15 text-[#F5EFE6]/50 hover:border-[#B8924A] hover:text-[#B8924A]'}`}
                    >
                        {size}ml
                    </button>
                    ))}
                </div>
                </div>

                {/* Qty + price */}
                <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#F5EFE6]/30 mb-1">Quantity</p>
                    <div className="flex items-center border border-white/15">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-2.5 text-[#F5EFE6]/50 hover:text-[#B8924A] transition-colors">−</button>
                    <span className="px-4 text-sm">{qty}</span>
                    <button onClick={() => setQty(qty + 1)} className="px-4 py-2.5 text-[#F5EFE6]/50 hover:text-[#B8924A] transition-colors">+</button>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#F5EFE6]/30 mb-1">Total</p>
                    <p className="font-[family-name:var(--font-display)] text-3xl text-[#B8924A]">₦{totalPrice}</p>
                    <p className="text-xs text-[#F5EFE6]/25 mt-0.5">₦{pricePerMl.toLocaleString()}/ml</p>
                </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col gap-3">
                <button
                    onClick={handleAddToCart}
                    disabled={!inStock}
                    className={`w-full py-4 text-xs uppercase tracking-[0.2em] font-medium transition-colors
                    ${!inStock
                        ? 'bg-white/5 text-[#F5EFE6]/20 cursor-not-allowed'
                        : added
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#B8924A] text-[#100E0B] hover:bg-[#C9A45A]'
                    }`}
                >
                    {added ? '✓ Added to Cart' : inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <Link
                    href="/cart"
                    className="w-full py-4 text-xs uppercase tracking-[0.2em] border border-white/20 text-center hover:border-[#B8924A] hover:text-[#B8924A] transition-colors"
                >
                    View Cart →
                </Link>
                </div>

                {/* Delivery */}
                <p className="text-xs text-[#F5EFE6]/25 border-t border-white/10 pt-6">
                Lagos delivery ₦1,500 · National ₦3,500 · International ₦15,000
                </p>
            </div>
            </div>
        </div>
        </main>
    )
}