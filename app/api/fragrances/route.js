import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Fragrance from '@/models/Fragrance'


export async function GET(request) {
  try {
    // Step 1: Connect to MongoDB using our cached connection from lib/mongodb.js
    await connectDB()


    const { searchParams } = new URL(request.url)
    const category = searchParams.get('categoxry')


    const query = category ? { category } : {}


    query.inStock = true

    const fragrances = await Fragrance.find(query).sort({ createdAt: -1 })


    return NextResponse.json(
      {
        success: true,
        count: fragrances.length, // helpful for the admin to see total count
        data: fragrances,
      },
      { status: 200 }
    )

  } catch (error) {

    console.error('GET /api/fragrances error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch fragrances',
        error: error.message,
      },
      { status: 500 }
    )
  }
}


// ══════════════════════════════════════════
// POST /api/fragrances
// Creates a NEW fragrance in the database
// Used by: Admin panel "Add Fragrance" form
// ══════════════════════════════════════════
export async function POST(request) {
  try {
    // Step 1: Connect to DB
    await connectDB()


    const body = await request.json()

    const {
      name,
      category,
      description,
      duration,
      pricePerMl,
      color,
      emoji,
    } = body


    if (!name || !category || !description || !duration || !pricePerMl) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please provide name, category, description, duration, and price',
        },
        { status: 400 }
      )
    }


    const existing = await Fragrance.findOne({ name: name.trim() })
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: `A fragrance named "${name}" already exists`,
        },
        { status: 409 }
      )
    }

    const fragrance = await Fragrance.create({
      name: name.trim(),
      category,
      description: description.trim(),
      duration,
      pricePerMl: Number(pricePerMl), // ensure it's saved as a number
      color: color || '#c4a882',       // fallback to default beige
      emoji: emoji || '🌿',            // fallback to default emoji
    })


    return NextResponse.json(
      {
        success: true,
        message: 'Fragrance added successfully',
        data: fragrance,
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('POST /api/fragrances error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create fragrance',
        error: error.message,
      },
      { status: 500 }
    )
  }
}