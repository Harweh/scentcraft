/* eslint-disable react/no-unescaped-entities */
// export default function OrdersPage() {
//     return <div>Orders page coming soon</div>
// }


'use client'

import { useState } from 'react'
import Link from 'next/link'

const STATUS_STYLES = {
    pending:    { label: 'Pending',    color: 'text-amber-400/80 border-amber-500/30' },
    confirmed:  { label: 'Confirmed',  color: 'text-blue-400/80 border-blue-500/30' },
    processing: { label: 'Processing', color: 'text-purple-400/80 border-purple-500/30' },
    shipped:    { label: 'Shipped',    color: 'text-cyan-400/80 border-cyan-500/30' },
    delivered:  { label: 'Delivered',  color: 'text-emerald-400/80 border-emerald-500/30' },
    cancelled:  { label: 'Cancelled',  color: 'text-red-400/80 border-red-500/30' },
    }

    const PAYMENT_STYLES = {
    pending: 'text-amber-400/70',
    paid:    'text-emerald-400/70',
    failed:  'text-red-400/70',
    }

    export default function OrdersPage() {
    const [email, setEmail]     = useState('')
    const [orders, setOrders]   = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError]     = useState('')

    async function handleLookup(e) {
        e.preventDefault()
        if (!email.trim()) return
        setLoading(true)
        setError('')
        try {
        const res = await fetch('/api/orders')
        const data = await res.json()
        if (!data.success) throw new Error(data.message || 'Could not load orders')

        // Filter client-side to this email — the API has no per-customer
        // filtering yet, so this is a pragmatic lookup until auth exists
        const mine = data.data.filter(
            o => o.customer?.email?.toLowerCase() === email.trim().toLowerCase()
        )
        setOrders(mine)
        } catch (err) {
        setError(err.message)
        } finally {
        setLoading(false)
        }
    }

    return (
        <main className="bg-[#100E0B] min-h-screen text-[#F5EFE6]">

        <section className="border-b border-white/10">
            <div className="max-w-2xl mx-auto px-6 sm:px-8 py-14 sm:py-20 text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-[#B8924A] mb-3">Track Your Order</p>
            <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl mb-4">
                Your Orders
            </h1>
            <p className="text-sm text-[#F5EFE6]/50">
                Enter the email you used at checkout to view your order history.
            </p>
            </div>
        </section>

        <section className="max-w-2xl mx-auto px-6 sm:px-8 py-10">
            <form onSubmit={handleLookup} className="flex gap-3 mb-12">
            <input
                type="email"
                required
                placeholder="you@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 bg-white/5 border border-white/15 px-5 py-3.5 text-sm text-[#F5EFE6] placeholder-[#F5EFE6]/25 focus:outline-none focus:border-[#B8924A] transition-colors"
            />
            <button
                type="submit"
                disabled={loading}
                className="bg-[#B8924A] text-[#100E0B] px-7 py-3.5 text-xs uppercase tracking-[0.15em] font-medium hover:bg-[#C9A45A] transition-colors disabled:opacity-50"
            >
                {loading ? 'Loading…' : 'Find Orders'}
            </button>
            </form>

            {error && <p className="text-sm text-red-400 mb-8">{error}</p>}

            {orders !== null && orders.length === 0 && !error && (
            <div className="text-center py-16">
                <p className="text-3xl mb-4">📦</p>
                <p className="font-[family-name:var(--font-display)] text-xl mb-2">No orders found</p>
                <p className="text-sm text-[#F5EFE6]/40 mb-6">
                We couldn't find any orders for that email.
                </p>
                <Link href="/catalog" className="text-xs uppercase tracking-[0.15em] text-[#B8924A] hover:underline">
                Browse the Collection →
                </Link>
            </div>
            )}

            {orders !== null && orders.length > 0 && (
            <div className="flex flex-col gap-5">
                {orders.map(order => {
                const statusInfo  = STATUS_STYLES[order.status] || STATUS_STYLES.pending
                const paymentColor = PAYMENT_STYLES[order.paymentStatus] || PAYMENT_STYLES.pending

                return (
                    <div key={order._id} className="border border-white/10 p-6">
                    <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                        <div>
                        <p className="font-[family-name:var(--font-display)] text-lg mb-1">
                            {order.orderId}
                        </p>
                        <p className="text-xs text-[#F5EFE6]/30">
                            {new Date(order.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                        </div>
                        <span className={`text-[10px] uppercase tracking-[0.12em] px-3 py-1.5 border ${statusInfo.color}`}>
                        {statusInfo.label}
                        </span>
                    </div>

                    {/* Notes / items */}
                    <div className="flex flex-col gap-2 mb-4">
                        {order.notes?.map((note, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                            <span className="text-[#F5EFE6]/60 flex items-center gap-2">
                            <span>{note.emoji}</span> {note.name} <span className="text-xs text-[#F5EFE6]/30">· {note.mlUsed}ml</span>
                            </span>
                            <span className="text-[#F5EFE6]/40">₦{(note.pricePerMl * note.mlUsed).toLocaleString()}</span>
                        </div>
                        ))}
                    </div>

                    <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                        <span className={`text-xs uppercase tracking-[0.1em] ${paymentColor}`}>
                        {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid Online'} · {order.paymentStatus}
                        </span>
                        <span className="font-[family-name:var(--font-display)] text-xl text-[#B8924A]">
                        ₦{order.totalAmount?.toLocaleString()}
                        </span>
                    </div>
                    </div>
                )
                })}
            </div>
            )}
        </section>
        </main>
    )
}