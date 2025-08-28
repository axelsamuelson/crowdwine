import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/config'

export async function POST(request: NextRequest) {
  try {
    const palletData = await request.json()
    
    console.log('📦 Creating pallet:', palletData)
    
    // Validate required fields
    if (!palletData.wine_id) {
      return NextResponse.json(
        { error: 'Wine ID is required' },
        { status: 400 }
      )
    }

    // Prepare pallet data for insertion - only use columns that exist
    const palletToInsert = {
      wine_id: palletData.wine_id,
      target_bottles: palletData.target_bottles || 56, // Default to 56 bottles per pallet
      current_bottles: palletData.current_bottles || 0,
      status: palletData.status || 'filling'
      // Removed estimated_shipping and timestamps as they might not exist
    }

    const { data: pallet, error } = await supabaseAdmin
      .from('pallets')
      .insert([palletToInsert])
      .select()
      .single()

    if (error) {
      console.error('❌ Failed to create pallet:', error)
      return NextResponse.json(
        { error: `Failed to create pallet: ${error.message}` },
        { status: 500 }
      )
    }

    console.log('✅ Pallet created successfully:', pallet)
    return NextResponse.json({ success: true, pallet })

  } catch (error) {
    console.error('❌ Error creating pallet:', error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const wineId = searchParams.get('wine_id')
    
    let query = supabaseAdmin
      .from('pallets')
      .select('*')
      .order('created_at', { ascending: false })

    if (wineId) {
      query = query.eq('wine_id', wineId)
    }

    const { data: pallets, error } = await query

    if (error) {
      console.error('❌ Failed to fetch pallets:', error)
      return NextResponse.json(
        { error: `Failed to fetch pallets: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, pallets })

  } catch (error) {
    console.error('❌ Error fetching pallets:', error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
