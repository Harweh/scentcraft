/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/immutability */
'use client'

import { useEffect, useState } from 'react'

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
const CATEGORIES = ['Floral', 'Woody', 'Fresh', 'Oriental', 'Citrus']
const DURATIONS = ['Short', 'Medium', 'Long']

// Temporary client-side gate — NOT real security, just keeps the page
// from being casually stumbled into. The /api/fragrances and /api/orders
// routes themselves still need server-side auth before launch.
const ADMIN_PASSCODE = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || 'aura2026'

export default function AdminPage() {
    const [authed, setAuthed]   = useState(false)
    const [passcode, setPasscode] = useState('')
    const [authError, setAuthError] = useState('')
    const [tab, setTab] = useState('orders') // 'orders' | 'fragrances'

    useEffect(() => {
        if (sessionStorage.getItem('aura_admin_authed') === 'true') setAuthed(true)
    }, [])

    function handleLogin(e) {
        e.preventDefault()
        if (passcode === ADMIN_PASSCODE) {
        sessionStorage.setItem('aura_admin_authed', 'true')
        setAuthed(true)
        setAuthError('')
        } else {
        setAuthError('Incorrect passcode')
        }
    }

    if (!authed) {
        return (
        <main className="bg-[#100E0B] min-h-screen text-[#F5EFE6] flex items-center justify-center px-6">
            <form onSubmit={handleLogin} className="w-full max-w-sm">
            <p className="text-xs uppercase tracking-[0.25em] text-[#B8924A] mb-3 text-center">Internal</p>
            <h1 className="font-[family-name:var(--font-display)] text-2xl mb-8 text-center">Admin Access</h1>
            <input
                type="password"
                placeholder="Passcode"
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                className="w-full bg-white/5 border border-white/15 px-5 py-3.5 text-sm text-center focus:outline-none focus:border-[#B8924A] mb-3"
                autoFocus
            />
            {authError && <p className="text-xs text-red-400 text-center mb-3">{authError}</p>}
            <button type="submit" className="w-full bg-[#B8924A] text-[#100E0B] py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#C9A45A] transition-colors">
                Enter
            </button>
            </form>
        </main>
        )
    }

    return (
        <main className="bg-[#100E0B] min-h-screen text-[#F5EFE6]">
        <section className="border-b border-white/10">
            <div className="max-w-6xl mx-auto px-6 sm:px-8 py-10">
            <p className="text-xs uppercase tracking-[0.25em] text-[#B8924A] mb-2">Internal</p>
            <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl mb-6">
                Admin Dashboard
            </h1>

            <div className="flex gap-2">
                {[
                { id: 'orders',     label: 'Orders' },
                { id: 'fragrances', label: 'Fragrances' },
                ].map(t => (
                <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`px-5 py-2.5 text-xs uppercase tracking-[0.12em] border transition-colors
                    ${tab === t.id
                        ? 'bg-[#B8924A] border-[#B8924A] text-[#100E0B]'
                        : 'border-white/15 text-[#F5EFE6]/50 hover:border-[#B8924A] hover:text-[#B8924A]'
                    }`}
                >
                    {t.label}
                </button>
                ))}
            </div>
            </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 sm:px-8 py-10">
            {tab === 'orders' ? <OrdersAdmin /> : <FragrancesAdmin />}
        </section>
        </main>
    )
    }

    // ────────────────────────────────────────────────────────
    // ORDERS TAB
    // ────────────────────────────────────────────────────────
    function OrdersAdmin() {
    const [orders, setOrders]   = useState([])
    const [loading, setLoading] = useState(true)
    const [updatingId, setUpdatingId] = useState(null)

    useEffect(() => { loadOrders() }, [])

    function loadOrders() {
        setLoading(true)
        fetch('/api/orders')
        .then(r => r.json())
        .then(data => { if (data.success) setOrders(data.data) })
        .catch(console.error)
        .finally(() => setLoading(false))
    }

    async function updateStatus(orderId, status) {
        setUpdatingId(orderId)
        try {
        const res = await fetch(`/api/orders/${orderId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        })
        const data = await res.json()
        if (data.success) {
            setOrders(prev => prev.map(o => o._id === orderId ? data.data : o))
        }
        } catch (err) {
        console.error(err)
        } finally {
        setUpdatingId(null)
        }
    }

    if (loading) return <p className="text-sm text-[#F5EFE6]/40">Loading orders…</p>
    if (orders.length === 0) return <p className="text-sm text-[#F5EFE6]/40">No orders yet.</p>

    return (
        <div className="flex flex-col gap-4">
        <p className="text-xs text-[#F5EFE6]/30 uppercase tracking-[0.15em]">{orders.length} total orders</p>

        <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
            <thead>
                <tr className="border-b border-white/10 text-left text-[#F5EFE6]/40 text-xs uppercase tracking-[0.1em]">
                <th className="py-3 pr-4">Order</th>
                <th className="py-3 pr-4">Customer</th>
                <th className="py-3 pr-4">Total</th>
                <th className="py-3 pr-4">Payment</th>
                <th className="py-3 pr-4">Status</th>
                </tr>
            </thead>
            <tbody>
                {orders.map(order => (
                <tr key={order._id} className="border-b border-white/5">
                    <td className="py-4 pr-4">
                    <p className="font-medium">{order.orderId}</p>
                    <p className="text-xs text-[#F5EFE6]/30">{new Date(order.createdAt).toLocaleDateString('en-NG')}</p>
                    </td>
                    <td className="py-4 pr-4">
                    <p>{order.customer?.name}</p>
                    <p className="text-xs text-[#F5EFE6]/30">{order.customer?.phone}</p>
                    </td>
                    <td className="py-4 pr-4 text-[#B8924A]">₦{order.totalAmount?.toLocaleString()}</td>
                    <td className="py-4 pr-4">
                    <span className={order.paymentStatus === 'paid' ? 'text-emerald-400/70' : order.paymentStatus === 'failed' ? 'text-red-400/70' : 'text-amber-400/70'}>
                        {order.paymentMethod === 'cod' ? 'COD' : 'Online'} · {order.paymentStatus}
                    </span>
                    </td>
                    <td className="py-4">
                    <select
                        value={order.status}
                        disabled={updatingId === order._id}
                        onChange={e => updateStatus(order._id, e.target.value)}
                        className="bg-white/5 border border-white/15 px-3 py-2 text-xs focus:outline-none focus:border-[#B8924A] disabled:opacity-50"
                    >
                        {ORDER_STATUSES.map(s => (
                        <option key={s} value={s} className="bg-[#1C1813]">{s}</option>
                        ))}
                    </select>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    )
    }

    // ────────────────────────────────────────────────────────
    // FRAGRANCES TAB
    // ────────────────────────────────────────────────────────
    function FragrancesAdmin() {
    const [fragrances, setFragrances] = useState([])
    const [loading, setLoading]       = useState(true)
    const [showForm, setShowForm]     = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError]           = useState('')

    const emptyForm = {
        name: '', category: 'Floral', description: '', duration: 'Medium',
        pricePerMl: '', imageUrl: '', color: '#B8924A', emoji: '🌸',
    }
    const [form, setForm] = useState(emptyForm)

    useEffect(() => { loadFragrances() }, [])

    function loadFragrances() {
        setLoading(true)
        fetch('/api/fragrances')
        .then(r => r.json())
        .then(data => { if (data.success) setFragrances(data.data) })
        .catch(console.error)
        .finally(() => setLoading(false))
    }

    async function handleCreate(e) {
        e.preventDefault()
        setSubmitting(true)
        setError('')
        try {
        const res = await fetch('/api/fragrances', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, pricePerMl: Number(form.pricePerMl) }),
        })
        const data = await res.json()
        if (!data.success) throw new Error(data.message || 'Failed to create fragrance')
        setFragrances(prev => [data.data, ...prev])
        setForm(emptyForm)
        setShowForm(false)
        } catch (err) {
        setError(err.message)
        } finally {
        setSubmitting(false)
        }
    }

    async function handleDelete(id) {
        if (!confirm('Delete this fragrance? This cannot be undone.')) return
        try {
        const res = await fetch(`/api/fragrances/${id}`, { method: 'DELETE' })
        const data = await res.json()
        if (data.success) setFragrances(prev => prev.filter(f => f._id !== id))
        } catch (err) {
        console.error(err)
        }
    }

    return (
        <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
            <p className="text-xs text-[#F5EFE6]/30 uppercase tracking-[0.15em]">{fragrances.length} fragrances</p>
            <button
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-2.5 text-xs uppercase tracking-[0.12em] bg-[#B8924A] text-[#100E0B] hover:bg-[#C9A45A] transition-colors"
            >
            {showForm ? 'Cancel' : '+ New Fragrance'}
            </button>
        </div>

        {showForm && (
            <form onSubmit={handleCreate} className="border border-white/10 p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input required placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="bg-white/5 border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-[#B8924A]" />

            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                className="bg-white/5 border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-[#B8924A]">
                {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#1C1813]">{c}</option>)}
            </select>

            <textarea required placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                rows={2} className="sm:col-span-2 bg-white/5 border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-[#B8924A] resize-none" />

            <select value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })}
                className="bg-white/5 border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-[#B8924A]">
                {DURATIONS.map(d => <option key={d} value={d} className="bg-[#1C1813]">{d}</option>)}
            </select>

            <input required type="number" placeholder="Price per ml (₦)" value={form.pricePerMl} onChange={e => setForm({ ...form, pricePerMl: e.target.value })}
                className="bg-white/5 border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-[#B8924A]" />

            <input placeholder="Image URL (/images/...)" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                className="bg-white/5 border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-[#B8924A]" />

            <input placeholder="Emoji (fallback)" value={form.emoji} onChange={e => setForm({ ...form, emoji: e.target.value })}
                className="bg-white/5 border border-white/15 px-4 py-3 text-sm focus:outline-none focus:border-[#B8924A]" />

            {error && <p className="sm:col-span-2 text-sm text-red-400">{error}</p>}

            <button type="submit" disabled={submitting}
                className="sm:col-span-2 bg-[#B8924A] text-[#100E0B] py-3 text-xs uppercase tracking-[0.15em] font-medium hover:bg-[#C9A45A] transition-colors disabled:opacity-50">
                {submitting ? 'Creating…' : 'Create Fragrance'}
            </button>
            </form>
        )}

        {loading ? (
            <p className="text-sm text-[#F5EFE6]/40">Loading…</p>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {fragrances.map(f => (
                <div key={f._id} className="border border-white/10 p-4 flex flex-col gap-2">
                <div className="flex items-start justify-between">
                    <div>
                    <p className="font-[family-name:var(--font-display)] text-base">{f.emoji} {f.name}</p>
                    <p className="text-xs text-[#B8924A]">{f.category}</p>
                    </div>
                    <button onClick={() => handleDelete(f._id)} className="text-xs text-[#F5EFE6]/30 hover:text-red-400 transition-colors">
                    Delete
                    </button>
                </div>
                <p className="text-xs text-[#F5EFE6]/40">₦{f.pricePerMl?.toLocaleString()}/ml · {f.duration}</p>
                <p className={`text-xs ${f.inStock ? 'text-emerald-400/60' : 'text-red-400/60'}`}>
                    {f.inStock ? 'In Stock' : 'Out of Stock'}
                </p>
                </div>
            ))}
            </div>
        )}
        </div>
    )
}