import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'
import { initializeNovacPayment } from '@/lib/novac'

export const runtime = 'nodejs'

export async function POST(request) {
    try {
        await connectDB()
        const body = await request.json()
        const { orderId, email } = body

        if (!orderId || !email) {
        return NextResponse.json(
            { success: false, message: 'Order ID and email are required' },
            { status: 400 }
        )
        }

        const order = await Order.findById(orderId)
        if (!order) {
        return NextResponse.json(
            { success: false, message: 'Order not found' },
            { status: 404 }
        )
        }

        if (order.paymentMethod !== 'online') {
        return NextResponse.json(
            { success: false, message: 'This order was placed as Cash on Delivery, not online payment' },
            { status: 400 }
        )
        }

        const nameParts = order.customer.name.trim().split(' ')
        const firstName = nameParts[0]
        const lastName = nameParts.slice(1).join(' ') || nameParts[0]

        const novacResponse = await initializeNovacPayment({
        email,
        firstName,
        lastName,
        phoneNumber: order.customer.phone,
        amount: order.totalAmount,
        reference: order.orderId,
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/orders`,
        description: `ScentCraft order ${order.orderId}`,
        })

        if (!novacResponse.status) {
        return NextResponse.json(
            { success: false, message: novacResponse.message || 'Novac initialization failed' },
            { status: 500 }
        )
        }

        order.paymentReference = novacResponse.data.transactionReference
        await order.save()

        return NextResponse.json(
        {
            success: true,
            authorizationUrl: novacResponse.data.paymentRedirectUrl,
            reference: novacResponse.data.transactionReference,
        },
        { status: 200 }
        )

    } catch (error) {
        console.error('POST /api/payment/initialize error:', error)
        return NextResponse.json(
        { success: false, message: 'Failed to initialize payment', error: error.message },
        { status: 500 }
        )
    }
}