import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/config'

export async function POST(request: NextRequest) {
  try {
    const wineData = await request.json()
    
    console.log('🍷 Adding wine:', wineData)
    
    // Validate required fields
    if (!wineData.title || !wineData.handle) {
      return NextResponse.json(
        { error: 'Title and handle are required' },
        { status: 400 }
      )
    }

    // Prepare wine data for insertion
    const wineToInsert = {
      title: wineData.title,
      handle: wineData.handle,
      description: wineData.description || '',
      product_type: wineData.product_type || 'Wine',
      category_id: wineData.category_id || null,
      producer_id: wineData.producer_id || null,
      vintage: wineData.vintage || new Date().getFullYear(),
      wine_type: wineData.wine_type || '',
      grape_varieties: wineData.grape_varieties || [],
      alcohol_content: wineData.alcohol_content || 13.5,
      region: wineData.region || '',
      country: wineData.country || '',
      price_range_min: wineData.price_range_min || 0,
      price_range_max: wineData.price_range_max || 0,
      bottles_per_pallet: wineData.bottles_per_pallet || 56,
      min_pallet_orders: wineData.min_pallet_orders || 1,
      max_pallet_orders: wineData.max_pallet_orders || 10,
      available_for_sale: wineData.available_for_sale !== false,
      is_active: wineData.is_active !== false,
      currency_code: wineData.currency_code || 'SEK'
    }

    // Insert wine into database
    const { data: wine, error } = await supabaseAdmin
      .from('wines')
      .insert(wineToInsert)
      .select()
      .single()

    if (error) {
      console.error('❌ Error adding wine:', error)
      return NextResponse.json(
        { error: 'Failed to add wine', details: error.message },
        { status: 500 }
      )
    }

    console.log('✅ Wine added successfully:', wine)
    
    return NextResponse.json({
      success: true,
      wine,
      message: 'Wine added successfully'
    })

  } catch (error) {
    console.error('❌ Exception adding wine:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    console.log('🍷 Fetching wines...')
    
    const { data: wines, error } = await supabaseAdmin
      .from('wines')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Error fetching wines:', error)
      return NextResponse.json(
        { error: 'Failed to fetch wines', details: error.message },
        { status: 500 }
      )
    }

    console.log(`✅ Fetched ${wines?.length || 0} wines`)
    
    return NextResponse.json({
      success: true,
      wines: wines || []
    })

  } catch (error) {
    console.error('❌ Exception fetching wines:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
