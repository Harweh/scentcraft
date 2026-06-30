// // app/customizer/page.js
// export default function CustomizerPage() {
//     return <div>Customizer page coming soon</div>
// }

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/CartContext'

const GENDER_OPTIONS = [
    { value: 'unisex', label: 'No Preference' },
    { value: 'female',  label: 'Feminine' },
    { value: 'male',    label: 'Masculine' },
    ]

    const MOOD_PROMPTS = [
    'Confident and bold, ready to walk into any room',
    'Warm and cozy, like a candlelit evening',
    'Fresh and energized, like the first morning of spring',
    'Mysterious and seductive, for a night out',
    ]

    export default function CustomizerPage() {
    const router = useRouter()
    const { addItem } = useCart()

    const [step, setStep]               = useState(1) // 1 = describe, 2 = result
    const [description, setDescription] = useState('')
    const [gender, setGender]           = useState('unisex')
    const [loading, setLoading]         = useState(false)
    const [error, setError]             = useState('')
    const [result, setResult]           = useState(null)
    const [added, setAdded]             = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        if (description.trim().length < 5) {
        setError('Tell us a little more about how you want to feel.')
        return
        }
        setError('')
        setLoading(true)

        try {
        const res = await fetch('/api/ai/describe-match', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description: description.trim(), gender }),
        })
        const data = await res.json()
        if (!data.success) throw new Error(data.message || 'Something went wrong')
        setResult(data)
        setStep(2)
        } catch (err) {
        setError(err.message)
        } finally {
        setLoading(false)
        }
    }

    function handleAddBlendToCart() {
        if (!result) return
        // Each matched note gets added as its own cart line — mlUsed from the AI route (2ml each)
        result.matchedFragrances.forEach(f => {
        addItem({
            fragranceId: f.name, // matched fragrances from vector search don't carry _id here
            name: `${f.name} (${f.role} note)`,
            emoji: f.emoji,
            color: f.color,
            imageUrl: null,
            pricePerMl: f.pricePerMl,
            volume: f.mlUsed,
            qty: 1,
        })
        })
        setAdded(true)
        setTimeout(() => setAdded(false), 2500)
    }

    function startOver() {
        setStep(1)
        setResult(null)
        setDescription('')
        setError('')
    }

    return (
        <main className="bg-[#100E0B] min-h-screen text-[#F5EFE6]">

        {/* Header */}
        <section className="border-b border-white/10">
            <div className="max-w-3xl mx-auto px-6 sm:px-8 py-14 sm:py-20 text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-[#B8924A] mb-3">Bespoke Lab</p>
            <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl leading-tight mb-4">
                Your Scent, <em className="italic text-[#B8924A]">Digitally Mastered</em>
            </h1>
            <p className="text-sm text-[#F5EFE6]/50 max-w-md mx-auto">
                Describe how you want to feel. Our AI selects and blends real fragrance notes from our collection to match.
            </p>
            </div>
        </section>

        {/* Step indicator */}
        <div className="max-w-md mx-auto px-6 flex items-center justify-center gap-3 -mt-2 mb-10">
            <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-[#B8924A]' : 'bg-white/10'}`} />
            <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-[#B8924A]' : 'bg-white/10'}`} />
        </div>

        {step === 1 && (
            <section className="max-w-2xl mx-auto px-6 sm:px-8 pb-24">
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">

                {/* Mood textarea */}
                <div>
                <label className="text-xs uppercase tracking-[0.2em] text-[#F5EFE6]/50 mb-3 block">
                    How do you want to feel?
                </label>
                <textarea
                    rows={4}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="e.g. Warm, confident, and a little mysterious — like rain on sun-warmed earth..."
                    className="w-full bg-white/5 border border-white/15 px-5 py-4 text-sm text-[#F5EFE6] placeholder-[#F5EFE6]/25 focus:outline-none focus:border-[#B8924A] transition-colors resize-none"
                />

                {/* Quick prompt chips */}
                <div className="flex flex-wrap gap-2 mt-3">
                    {MOOD_PROMPTS.map(prompt => (
                    <button
                        key={prompt}
                        type="button"
                        onClick={() => setDescription(prompt)}
                        className="text-[10px] uppercase tracking-[0.1em] px-3 py-2 border border-white/10 text-[#F5EFE6]/40 hover:border-[#B8924A] hover:text-[#B8924A] transition-colors"
                    >
                        {prompt.length > 38 ? prompt.slice(0, 38) + '…' : prompt}
                    </button>
                    ))}
                </div>
                </div>

                {/* Gender lean */}
                <div>
                <label className="text-xs uppercase tracking-[0.2em] text-[#F5EFE6]/50 mb-3 block">
                    Scent Lean <span className="text-[#F5EFE6]/25 normal-case tracking-normal">(optional, your mood always comes first)</span>
                </label>
                <div className="flex gap-3">
                    {GENDER_OPTIONS.map(opt => (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() => setGender(opt.value)}
                        className={`flex-1 py-3 text-xs uppercase tracking-[0.12em] border transition-colors
                        ${gender === opt.value
                            ? 'bg-[#B8924A] border-[#B8924A] text-[#100E0B]'
                            : 'border-white/15 text-[#F5EFE6]/50 hover:border-[#B8924A] hover:text-[#B8924A]'
                        }`}
                    >
                        {opt.label}
                    </button>
                    ))}
                </div>
                </div>

                {error && <p className="text-sm text-red-400">{error}</p>}

                <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#B8924A] text-[#100E0B] py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#C9A45A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                {loading ? 'Blending your scent…' : 'Find My Blend'}
                </button>

                {loading && (
                <div className="flex items-center justify-center gap-3 text-xs text-[#F5EFE6]/40">
                    <div className="w-3 h-3 border-2 border-[#B8924A] border-t-transparent rounded-full animate-spin" />
                    Searching our collection and crafting your description…
                </div>
                )}
            </form>
            </section>
        )}

        {step === 2 && result && (
            <section className="max-w-3xl mx-auto px-6 sm:px-8 pb-24">

            {/* Result hero */}
            <div className="text-center mb-12">
                <p className="text-xs uppercase tracking-[0.25em] text-[#B8924A] mb-3">Your Bespoke Blend</p>
                <h2 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl mb-6">
                {result.perfumeName}
                </h2>
                <p className="text-sm sm:text-base text-[#F5EFE6]/60 leading-relaxed max-w-xl mx-auto">
                {result.scentDescription}
                </p>
            </div>

            {/* Matched notes */}
            <div className="mb-12">
                <p className="text-xs uppercase tracking-[0.2em] text-[#F5EFE6]/40 mb-5 text-center">The Notes</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {result.matchedFragrances.map((f, i) => (
                    <div key={i} className="border border-white/10 p-5 text-center">
                    <div
                        className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center text-xl"
                        style={{ backgroundColor: f.color || '#1C1813' }}
                    >
                        {f.emoji}
                    </div>
                    <p className="text-[9px] uppercase tracking-[0.15em] text-[#B8924A] mb-1">{f.role} Note</p>
                    <p className="font-[family-name:var(--font-display)] text-base mb-1">{f.name}</p>
                    <p className="text-xs text-[#F5EFE6]/40">{f.category}</p>
                    </div>
                ))}
                </div>
            </div>

            {/* Pricing breakdown */}
            <div className="border border-white/10 p-6 mb-8">
                <p className="text-xs uppercase tracking-[0.2em] text-[#F5EFE6]/40 mb-4">Price Breakdown</p>
                <div className="flex flex-col gap-2 text-sm mb-4">
                <div className="flex justify-between">
                    <span className="text-[#F5EFE6]/50">Fragrance notes</span>
                    <span>₦{result.pricing.fragranceCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-[#F5EFE6]/50">Mixing fee</span>
                    <span>₦{result.pricing.mixingFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-[#F5EFE6]/50">Sample vial</span>
                    <span>₦{result.pricing.vialCost.toLocaleString()}</span>
                </div>
                </div>
                <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                <span className="text-xs uppercase tracking-[0.15em] text-[#F5EFE6]/50">Total</span>
                <span className="font-[family-name:var(--font-display)] text-2xl text-[#B8924A]">
                    ₦{result.pricing.totalAmount.toLocaleString()}
                </span>
                </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
                <button
                onClick={handleAddBlendToCart}
                className={`flex-1 py-4 text-xs uppercase tracking-[0.2em] font-medium transition-colors
                    ${added ? 'bg-emerald-600 text-white' : 'bg-[#B8924A] text-[#100E0B] hover:bg-[#C9A45A]'}`}
                >
                {added ? '✓ Added to Cart' : 'Add Blend to Cart'}
                </button>
                <button
                onClick={startOver}
                className="flex-1 py-4 text-xs uppercase tracking-[0.2em] border border-white/20 hover:border-[#B8924A] hover:text-[#B8924A] transition-colors"
                >
                Try Another Mood
                </button>
            </div>
            </section>
        )}
        </main>
    )
}