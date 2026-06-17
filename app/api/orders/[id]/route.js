import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'


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