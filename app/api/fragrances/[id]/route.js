import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Fragrance from '@/models/Fragrance'


export async function GET(request, { params }) {
  try {
    await connectDB()


    const { id } = params

    // .findById() is Mongoose shorthand for .findOne({ _id: id })
    const fragrance = await Fragrance.findById(id)

    // If no fragrance found with that ID, send 404
    if (!fragrance) {
      return NextResponse.json(
        {
          success: false,
          message: 'Fragrance not found',
        },
        { status: 404 }
        // 404 = Not Found
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: fragrance,
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('GET /api/fragrances/[id] error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch fragrance',
        error: error.message,
      },
      { status: 500 }
    )
  }
}


export async function DELETE(request, { params }) {
  try {
    await connectDB()

    const { id } = await params

    const fragrance = await Fragrance.findByIdAndDelete(id)

    // If nothing was found to delete, send 404
    if (!fragrance) {
      return NextResponse.json(
        {
          success: false,
          message: 'Fragrance not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: `"${fragrance.name}" has been deleted`,
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('DELETE /api/fragrances/[id] error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete fragrance',
        error: error.message,
      },
      { status: 500 }
    )
  }
}