import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'
import { initializeNovacPayment } from '@/lib/novac'
import Transaction from '@/models/Transaction'


/**
 * @swagger
 * /api/payment/initialize:
 *   post:
 *     summary: Initialize a Novac payment
 *     description: Called after an order with paymentMethod "online" is created — returns a checkout link to redirect the customer to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [orderId, email]
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: MongoDB _id of the order
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Returns authorizationUrl to redirect the customer to
 *       400:
 *         description: Missing fields or order is not set up for online payment
 *       404:
 *         description: Order not found
 */



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

        // console.log('Sending to Novac:', { firstName, lastName, email })

        const novacResponse = await initializeNovacPayment({
        email,
        firstName,
        lastName,
        phoneNumber: order.customer.phone,
        amount: order.totalAmount,
        reference: order.orderId,
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/orders`,
        description: `Aura Luxe order ${order.orderId}`,
        })

        if (!novacResponse.status) {
        return NextResponse.json(
            { success: false, message: novacResponse.message || 'Novac initialization failed' },
            { status: 500 }
        )
        }

        order.paymentReference = novacResponse.data.transactionReference
        await order.save()

        // Log the attempt the moment it starts — even if the customer
        // never comes back to trigger /verify, this proof still exists
        await Transaction.create({
        order: order._id,
        orderId: order.orderId,
        reference: novacResponse.data.transactionReference,
        amount: order.totalAmount,
        currency: 'NGN',
        status: 'pending',
        source: 'initialize',
        gatewayResponse: novacResponse.data,
        })

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