import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'


/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get one order by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order found
 *       404:
 *         description: Order not found
 *   patch:
 *     summary: Update order or payment status (Admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, processing, shipped, delivered, cancelled]
 *               paymentStatus:
 *                 type: string
 *                 enum: [pending, paid, failed]
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       404:
 *         description: Order not found
 */


export async function GET(request, { params }) {
  try {
    await connectDB()

    const { id } = await params

    const order = await Order.findById(id)

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: 'Order not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: order,
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('GET /api/orders/[id] error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch order',
        error: error.message,
      },
      { status: 500 }
    )
  }
}


export async function PATCH(request, { params }) {
  try {
    await connectDB()

    const { id } = await params

    const body = await request.json()
    const { status, paymentStatus } = body

    const updates = {}
    if (status) updates.status = status
    if (paymentStatus) updates.paymentStatus = paymentStatus

    const order = await Order.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    )

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: 'Order not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Order updated successfully',
        data: order,
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('PATCH /api/orders/[id] error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update order',
        error: error.message,
      },
      { status: 500 }
    )
  }
}