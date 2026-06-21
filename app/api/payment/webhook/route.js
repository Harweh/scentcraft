import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'
import Transaction from '@/models/Transaction'
import { sendPaymentConfirmedEmail } from '@/lib/email.js'

export const runtime = 'nodejs'

// Novac's documented public IP — confirmed from their own docs.
// They've stated this can change in the future with advance notice,
// so this is the one thing worth checking back on periodically.
const NOVAC_ALLOWED_IPS = ['18.233.137.110']

function getClientIp(request) {
    const forwarded = request.headers.get('x-forwarded-for')
    if (forwarded) return forwarded.split(',')[0].trim()
    return request.headers.get('x-real-ip') || ''
}

export async function POST(request) {
    try {
        // Step 1: Reject anything not genuinely from Novac's IP
        const clientIp = getClientIp(request)
        if (!NOVAC_ALLOWED_IPS.includes(clientIp)) {
        console.warn(`Blocked webhook from untrusted IP: ${clientIp}`)
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        await connectDB()
        const body = await request.json()
        const { data, notifyType } = body

        if (!data || !data.transactionReference) {
        return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
        }

        const order = await Order.findOne({ paymentReference: data.transactionReference })
        if (!order) {
        // Still return 200 — Novac retries on non-200, and a missing
        // order won't fix itself with retries
        console.warn(`Webhook received for unknown order: ${data.transactionReference}`)
        return NextResponse.json({ received: true }, { status: 200 })
    }

    // Capture this BEFORE updating, so we know if this is a genuinely
    // NEW confirmation or one we already processed via /verify
    const wasAlreadyPaid = order.paymentStatus === 'paid'

    if (notifyType === 'successful') {
        order.paymentStatus = 'paid'
        order.status = 'confirmed'
        } else if (notifyType === 'failed' || notifyType === 'abandoned') {
        order.paymentStatus = 'failed'
        } else if (notifyType === 'reversed') {
        order.paymentStatus = 'failed'
        order.status = 'cancelled'
        }

        await order.save()

        await Transaction.create({
        order: order._id,
        orderId: order.orderId,
        reference: data.transactionReference,
        amount: order.totalAmount,
        currency: data.currency || 'NGN',
        status: notifyType === 'successful' ? 'successful'
            : ['failed', 'abandoned', 'reversed'].includes(notifyType) ? 'failed'
            : 'pending',
        source: 'webhook',
        gatewayResponse: data,
        })

        // Only email if THIS event is what newly confirmed payment —
        // prevents double-emailing if /verify already caught it first
        if (order.paymentStatus === 'paid' && !wasAlreadyPaid) {
        try {
            await sendPaymentConfirmedEmail(order)
        } catch (emailError) {
            console.error('Payment confirmation email failed:', emailError)
        }
        }

        // MUST be 200 — anything else triggers Novac's retry policy
        return NextResponse.json({ received: true }, { status: 200 })

    } catch (error) {
        console.error('POST /api/payment/webhook error:', error)
        return NextResponse.json({ error: 'Internal error' }, { status: 500 })
    }
}