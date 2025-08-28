import { NextResponse } from 'next/server'
import { getWines, getCollections } from '@/lib/supabase/adapters'

export async function GET() {
  try {
    console.log('🔍 Debug: Testing Supabase adapters...')
    
    // Test getWines
    const wines = await getWines()
    console.log('🍷 Debug: getWines result:', wines?.length || 0, 'wines')
    
    // Test getCollections  
    const collections = await getCollections()
    console.log('📚 Debug: getCollections result:', collections?.length || 0, 'collections')
    
    return NextResponse.json({
      success: true,
      wines: {
        count: wines?.length || 0,
        data: wines?.slice(0, 2) || [] // First 2 wines for debugging
      },
      collections: {
        count: collections?.length || 0,
        data: collections?.slice(0, 2) || [] // First 2 collections for debugging
      }
    })
  } catch (error) {
    console.error('❌ Debug: Error in debug endpoint:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
