import { NextResponse } from 'next/server'
import swaggerSpec from '@/lib/swagger.js'

export async function GET() {
    return NextResponse.json(swaggerSpec)
}