import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/config'

export async function POST(request: NextRequest) {
  try {
    const collectionData = await request.json()
    
    console.log('📚 Adding collection:', collectionData)
    
    // Validate required fields
    if (!collectionData.title || !collectionData.handle) {
      return NextResponse.json(
        { error: 'Title and handle are required' },
        { status: 400 }
      )
    }

    // Prepare collection data for insertion
    const collectionToInsert = {
      title: collectionData.title,
      handle: collectionData.handle,
      description: collectionData.description || '',
      seo_title: collectionData.seo_title || collectionData.title,
      seo_description: collectionData.seo_description || collectionData.description || '',
      is_active: collectionData.is_active !== false
    }

    // Insert collection into database
    const { data: collection, error } = await supabaseAdmin
      .from('collections')
      .insert(collectionToInsert)
      .select()
      .single()

    if (error) {
      console.error('❌ Error adding collection:', error)
      return NextResponse.json(
        { error: 'Failed to add collection', details: error.message },
        { status: 500 }
      )
    }

    console.log('✅ Collection added successfully:', collection)
    
    return NextResponse.json({
      success: true,
      collection,
      message: 'Collection added successfully'
    })

  } catch (error) {
    console.error('❌ Exception adding collection:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    console.log('📚 Fetching collections...')
    
    const { data: collections, error } = await supabaseAdmin
      .from('collections')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Error fetching collections:', error)
      return NextResponse.json(
        { error: 'Failed to fetch collections', details: error.message },
        { status: 500 }
      )
    }

    console.log(`✅ Fetched ${collections?.length || 0} collections`)
    
    return NextResponse.json({
      success: true,
      collections: collections || []
    })

  } catch (error) {
    console.error('❌ Exception fetching collections:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
