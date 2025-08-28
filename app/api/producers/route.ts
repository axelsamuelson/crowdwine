import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/config'

export async function POST(request: NextRequest) {
  try {
    const producerData = await request.json()
    
    console.log('🏭 Adding producer:', producerData)
    
    // Validate required fields
    if (!producerData.name || !producerData.handle) {
      return NextResponse.json(
        { error: 'Name and handle are required' },
        { status: 400 }
      )
    }

    // Prepare producer data for insertion
    const producerToInsert = {
      name: producerData.name,
      handle: producerData.handle,
      description: producerData.description || '',
      country: producerData.country || '',
      region: producerData.region || '',
      website: producerData.website || '',
      is_active: producerData.is_active !== false
    }

    // Insert producer into database
    const { data: producer, error } = await supabaseAdmin
      .from('producers')
      .insert(producerToInsert)
      .select()
      .single()

    if (error) {
      console.error('❌ Error adding producer:', error)
      return NextResponse.json(
        { error: 'Failed to add producer', details: error.message },
        { status: 500 }
      )
    }

    console.log('✅ Producer added successfully:', producer)
    
    return NextResponse.json({
      success: true,
      producer,
      message: 'Producer added successfully'
    })

  } catch (error) {
    console.error('❌ Exception adding producer:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    console.log('🏭 Fetching producers...')
    
    const { data: producers, error } = await supabaseAdmin
      .from('producers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Error fetching producers:', error)
      return NextResponse.json(
        { error: 'Failed to fetch producers', details: error.message },
        { status: 500 }
      )
    }

    console.log(`✅ Fetched ${producers?.length || 0} producers`)
    
    return NextResponse.json({
      success: true,
      producers: producers || []
    })

  } catch (error) {
    console.error('❌ Exception fetching producers:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
