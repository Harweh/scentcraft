import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'
import { getDeliveryFee, getMixingCosts } from '@/lib/pricing.js'
import { sendOrderConfirmationEmail } from '@/lib/email.js'


/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     description: Returns all orders, newest first
 *     responses:
 *       200:
 *         description: List of orders
 *   post:
 *     summary: Place a new order
 *     description: Creates a new order — supports as_is, manual_mix, and ai_match purchase types
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [purchaseType, deliveryZone, notes, paymentMethod, customer]
 *             properties:
 *               purchaseType:
 *                 type: string
 *                 enum: [as_is, manual_mix, ai_match]
 *               deliveryZone:
 *                 type: string
 *                 enum: [local, national, international]
 *               notes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     fragranceId:
 *                       type: string
 *                     name:
 *                       type: string
 *                     emoji:
 *                       type: string
 *                     role:
 *                       type: string
 *                       enum: [Base, Heart, Top]
 *                     pricePerMl:
 *                       type: number
 *                     mlUsed:
 *                       type: number
 *               fragranceCost:
 *                 type: number
 *               scentDescription:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *                 enum: [cod, online]
 *               customer:
 *                 type: object
 *                 required: [name, address, phone]
 *                 properties:
 *                   name:
 *                     type: string
 *                   address:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   email:
 *                     type: string
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       400:
 *         description: Missing or invalid fields
 */

export async function GET() {
  try {

    await connectDB()
    const orders = await Order.find().sort({ createdAt: -1 })

    // Fire the email — but don't let a failed email crash the whole order
// If Gmail has a hiccup, the order should still succeed regardless
    // try {
    //   await sendOrderConfirmationEmail(order)
    // } catch (emailError) {
    //   console.error('Email sending failed (order still saved):', emailError)
    // }

    return NextResponse.json(
      {
        success: true,
        count: orders.length,
        data: orders,
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('GET /api/orders error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch orders',
        error: error.message,
      },
      { status: 500 }
    )
  }
}


export async function POST(request) {
  try {

    await connectDB()

    const body = await request.json()

    const {
      notes,           // array of selected fragrance notes
      scentDescription, // AI generated description from Puter.js
      fragranceCost,   // total cost of all notes combined
      paymentMethod,   // 'cod' or 'online'
      customer,        // { name, address, phone, email }
      purchaseType,    // ← add it here, pulled out immediately with everything else
      deliveryZone,
    } = body

    if (!notes || notes.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please select at least one fragrance note',
        },
        { status: 400 }
      )
    }

    if (!customer || !customer.name || !customer.address || !customer.phone) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please provide your name, address and phone number',
        },
        { status: 400 }
      )
    }

    if (!paymentMethod || !['cod', 'online'].includes(paymentMethod)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please select a valid payment method',
        },
        { status: 400 }
      )
    }

    if (!purchaseType || !['as_is', 'manual_mix', 'ai_match'].includes(purchaseType)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please specify a valid purchase type',
        },
        { status: 400 }
      )
    }

    if (!deliveryZone || !['local', 'national', 'international'].includes(deliveryZone)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please specify a valid delivery zone',
        },
        { status: 400 }
      )
    }

    // Step 5: Calculate pricing
    // These match the PRD business model exactly:
    // Mixing fee → $15 flat
    // Vial cost  → $5 flat
    // Total      → fragranceCost + mixingFee + vialCost
    // const mixingFee = 15.00
    // const vialCost = 5.00
    // const totalAmount = Number(fragranceCost) + mixingFee + vialCost


    // ✅ Pricing now depends on purchaseType
    // const { purchaseType } = body  deleted

    // let mixingFee = 0
    // let vialCost = 0

    // if (purchaseType === 'manual_mix' || purchaseType === 'ai_match') {
    //   // Only custom blends incur mixing labor and a sample vial
    //   mixingFee = 15.00
    //   vialCost = 5.00
    // }
    // as_is purchases: both stay 0 — no mixing happened, no sample vial needed

    // const totalAmount = Number(fragranceCost) + mixingFee + vialCost + deliveryFee

    // ✅ Replace the old manual if/else pricing logic with this
      const { mixingFee, vialCost } = getMixingCosts(purchaseType)
      const deliveryFee = getDeliveryFee(deliveryZone)
      const totalAmount = Number(fragranceCost) + mixingFee + vialCost + deliveryFee


    // Step 6: Generate a unique readable Order ID
    // Date.now() gives us milliseconds since 1970 — always unique
    // This matches exactly the PRD format: ORD-1718204580000
    const orderId = `ORD-${Date.now()}`

    // Step 7: Create the order in MongoDB
    const order = await Order.create({
      orderId,
      purchaseType,
      deliveryZone,
      notes,
      scentDescription: scentDescription || '',
      fragranceCost: Number(fragranceCost),
      mixingFee,
      vialCost,
      deliveryFee,
      totalAmount,
      customer,
      paymentMethod,
      // payment and order status default to 'pending'
      // as defined in our Order model
    })

    try {
      await sendOrderConfirmationEmail(order)
    } catch (emailError) {
      console.error('Email sending failed (order still saved):', emailError)
    }

    // Step 8: Return the created order
    // status 201 = Created successfully
    return NextResponse.json(
      {
        success: true,
        message: 'Order placed successfully! 🎉',
        data: order,
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('POST /api/orders error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to place order',
        error: error.message,
      },
      { status: 500 }
    )
  }
}