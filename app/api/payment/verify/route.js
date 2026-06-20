import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'
import { verifyNovacPayment } from '@/lib/novac'

export async function GET(request) {
    try {
        await connectDB()
        const { searchParams } = new URL(request.url)
        const reference = searchParams.get('reference')

        if (!reference) {
        return NextResponse.json(
            { success: false, message: 'Reference is required' },
            { status: 400 }
        )
        }

        const novacResponse = await verifyNovacPayment(reference)

        if (!novacResponse.status) {
        return NextResponse.json(
            { success: false, message: 'Could not verify payment with Novac' },
            { status: 500 }
        )
        }

        const order = await Order.findOne({ paymentReference: reference })
        if (!order) {
        return NextResponse.json(
            { success: false, message: 'No matching order found for this reference' },
            { status: 404 }
        )
        }

        if (novacResponse.data.status === 'successful') {
        order.paymentStatus = 'paid'
        order.status = 'confirmed'
        } else if (novacResponse.data.status === 'failed') {
        order.paymentStatus = 'failed'
        }
        // if "pending" — leave as-is, don't change anything yet

        await order.save()

        return NextResponse.json(
        {
            success: true,
            paymentStatus: order.paymentStatus,
            order,
        },
        { status: 200 }
        )

    } catch (error) {
        console.error('GET /api/payment/verify error:', error)
        return NextResponse.json(
        { success: false, message: 'Failed to verify payment', error: error.message },
        { status: 500 }
        )
    }
}