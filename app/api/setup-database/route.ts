import { NextRequest, NextResponse } from 'next/server'
import { setupDatabase, seedExampleData } from '@/lib/supabase/setup-database'

export async function POST(request: NextRequest) {
  try {
    // Kör databas-setup
    const setupResult = await setupDatabase()
    
    if (!setupResult.success) {
      return NextResponse.json(
        { error: setupResult.message, details: setupResult.details },
        { status: 500 }
      )
    }

    // Lägg till exempel-data
    const seedResult = await seedExampleData()
    
    if (!seedResult.success) {
      return NextResponse.json(
        { 
          warning: 'Database created but seeding failed', 
          setup: setupResult,
          seeding: seedResult 
        },
        { status: 200 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Database setup and seeding completed successfully!',
      setup: setupResult,
      seeding: seedResult
    })

  } catch (error) {
    console.error('Setup API error:', error)
    return NextResponse.json(
      { error: 'Internal server error during setup' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Database setup endpoint. Use POST to run setup.',
    endpoint: '/api/setup-database'
  })
}
