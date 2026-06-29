/* eslint-disable react-hooks/immutability */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/CartContext'

const STATE_ZONE_MAP = { Lagos: 'local' }

export default function CheckoutPage() {
    const { items, clearCart } = useCart()
    const router = useRouter()
    const subtotal = items.reduce((sum, i) => sum + i.pricePerMl * i.volume * i.qty, 0)

    const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', state: 'Lagos', paymentMethod: 'cod' })
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    function update(field, value) {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setSubmitting(true)
        setError('')

        const deliveryZone = STATE_ZONE_MAP[form.state] || 'national'

        const notes = items.map(item => ({
        fragranceId: item.fragranceId,
        name: item.name,
        emoji: item.emoji,
        pricePerMl: item.pricePerMl,
        mlUsed: item.volume * item.qty,
        }))

        try {
        const orderRes = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            purchaseType: 'as_is',
            deliveryZone,
            notes,
            fragranceCost: subtotal,
            paymentMethod: form.paymentMethod,
            customer: { name: form.name, address: `${form.address}, ${form.state}`, phone: form.phone, email: form.email },
            }),
        })
        const orderData = await orderRes.json()
        if (!orderData.success) throw new Error(orderData.message || 'Order failed')

        if (form.paymentMethod === 'online') {
            const payRes = await fetch('/api/payment/initialize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: orderData.data._id, email: form.email }),
            })
            const payData = await payRes.json()
            if (!payData.success) throw new Error(payData.message || 'Payment initialization failed')
            clearCart()
            window.location.href = payData.authorizationUrl
        } else {
            clearCart()
            router.push('/orders')
        }
        } catch (err) {
        setError(err.message)
        setSubmitting(false)
        }
    }

    return (
        <main className="bg-[#100E0B] text-[#F5EFE6] min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl mb-8">Checkout</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input required placeholder="Full Name" value={form.name} onChange={e => update('name', e.target.value)} className="bg-transparent border border-white/20 px-4 py-3 text-sm focus:outline-none focus:border-[#B8924A]" />
            <input required type="email" placeholder="Email" value={form.email} onChange={e => update('email', e.target.value)} className="bg-transparent border border-white/20 px-4 py-3 text-sm focus:outline-none focus:border-[#B8924A]" />
            <input required placeholder="Phone" value={form.phone} onChange={e => update('phone', e.target.value)} className="bg-transparent border border-white/20 px-4 py-3 text-sm focus:outline-none focus:border-[#B8924A]" />
            <input required placeholder="Delivery Address" value={form.address} onChange={e => update('address', e.target.value)} className="bg-transparent border border-white/20 px-4 py-3 text-sm focus:outline-none focus:border-[#B8924A]" />

            <select value={form.state} onChange={e => update('state', e.target.value)} className="bg-[#100E0B] border border-white/20 px-4 py-3 text-sm focus:outline-none focus:border-[#B8924A]">
                <option value="Lagos">Lagos</option>
                <option value="Other">Other Nigerian State</option>
            </select>

            <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => update('paymentMethod', 'cod')} className={`flex-1 py-3 text-sm border ${form.paymentMethod === 'cod' ? 'bg-[#B8924A] text-[#100E0B] border-[#B8924A]' : 'border-white/20'}`}>
                Cash on Delivery
                </button>
                <button type="button" onClick={() => update('paymentMethod', 'online')} className={`flex-1 py-3 text-sm border ${form.paymentMethod === 'online' ? 'bg-[#B8924A] text-[#100E0B] border-[#B8924A]' : 'border-white/20'}`}>
                Pay Online
                </button>
            </div>

            <div className="flex justify-between text-lg mt-4 mb-2">
                <span>Subtotal</span>
                <span className="text-[#B8924A] font-[family-name:var(--font-display)]">₦{subtotal.toLocaleString()}</span>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button type="submit" disabled={submitting} className="bg-[#B8924A] text-[#100E0B] py-3 text-sm font-medium tracking-wide hover:bg-[#C9A45A] transition-colors disabled:opacity-50">
                {submitting ? 'Placing Order…' : 'Complete Order'}
            </button>
            </form>
        </div>
        </main>
    )
}