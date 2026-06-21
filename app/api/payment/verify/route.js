import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'
import Transaction from '@/models/Transaction'
import { verifyNovacPayment } from '@/lib/novac'
import { sendPaymentConfirmedEmail } from '@/lib/email.js'


/**
 * @swagger
 * /api/payment/verify:
 *   get:
 *     summary: Verify a Novac payment
 *     description: Re-confirms transaction status directly with Novac and updates the order's paymentStatus
 *     parameters:
 *       - in: query
 *         name: reference
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns the updated payment status and order
 *       400:
 *         description: Reference missing
 *       404:
 *         description: No matching order found for this reference
 */




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

        let finalStatus = 'pending'
        if (novacResponse.data.status === 'successful') {
        order.paymentStatus = 'paid'
        order.status = 'confirmed'
        finalStatus = 'successful'
        } else if (novacResponse.data.status === 'failed') {
        order.paymentStatus = 'failed'
        finalStatus = 'failed'
        }

        await order.save()

        // Log this verification event permanently — separate from the order itself
        await Transaction.create({
        order: order._id,
        orderId: order.orderId,
        reference,
        amount: order.totalAmount,
        currency: 'NGN',
        status: finalStatus,
        source: 'verify',
        gatewayResponse: novacResponse.data,
        })

        // Fire the payment-confirmed email — separate from the order-placed email
        if (order.paymentStatus === 'paid') {
        try {
            await sendPaymentConfirmedEmail(order)
        } catch (emailError) {
            console.error('Payment confirmation email failed:', emailError)
        }
        }

        return NextResponse.json(
        { success: true, paymentStatus: order.paymentStatus, order },
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