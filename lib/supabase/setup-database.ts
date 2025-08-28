import { supabaseAdmin } from './config'

interface SetupResult {
  table: string
  status: 'exists' | 'missing' | 'error'
  error?: any
}

export async function setupDatabase(): Promise<{ success: boolean; results: SetupResult[] }> {
  console.log('🚀 Starting database setup check...')
  const results: SetupResult[] = []

  try {
    // Now check all tables since we know the basic setup works
    const tables = [
      'collections',
      'producers', 
      'wines',
      'wine_images',
      'wine_variants',
      'wine_options',
      'wine_option_values',
      'customers',
      'pallets',
      'orders',
      'carts',
      'cart_lines'
    ]

    for (const table of tables) {
      try {
        console.log(`🔍 Checking table: ${table}`)
        
        // Try to select from the table
        const { error } = await supabaseAdmin
          .from(table)
          .select('id')
          .limit(1)

        if (error) {
          if (error.code === 'PGRST116' || error.code === 'PGRST205') {
            console.log(`⚠️ Table ${table} does not exist`)
            results.push({ 
              table, 
              status: 'missing', 
              error: `Table does not exist. Please create it using the SQL from supabase/migrations/001_initial_schema.sql` 
            })
          } else {
            console.log(`⚠️ Error with ${table} table:`, error)
            results.push({ table, status: 'error', error })
          }
        } else {
          console.log(`✅ Table ${table} exists`)
          results.push({ table, status: 'exists' })
        }
      } catch (err) {
        console.log(`❌ Exception with ${table}:`, err)
        results.push({ table, status: 'error', error: err })
      }
    }

    const missing = results.filter(r => r.status === 'missing')
    const exists = results.filter(r => r.status === 'exists')
    const errors = results.filter(r => r.status === 'error')
    
    console.log(`📊 Results: ${exists.length} tables exist, ${missing.length} missing, ${errors.length} errors`)
    
    if (missing.length > 0) {
      console.log('📝 Missing tables need to be created manually in Supabase Dashboard')
      console.log('📋 Use the SQL from supabase/migrations/001_initial_schema.sql')
    }
    
    if (errors.length > 0) {
      console.log('⚠️ Some tables had errors during setup')
    }

    return { 
      success: errors.length === 0, 
      results 
    }

  } catch (error) {
    console.error('❌ Database setup check failed:', error)
    return { 
      success: false, 
      results: [{ table: 'setup', status: 'error', error }] 
    }
  }
}

export async function seedExampleData(): Promise<{ success: boolean; message: string }> {
  try {
    console.log('🌱 Seeding example data...')
    
    // Check if we already have data
    const { data: existingCollections } = await supabaseAdmin
      .from('collections')
      .select('id')
      .limit(1)

    if (existingCollections && existingCollections.length > 0) {
      console.log('✅ Example data already exists, skipping seed')
      return { success: true, message: 'Data already seeded' }
    }

    // Insert collections
    const { error: collectionsError } = await supabaseAdmin
      .from('collections')
      .insert([
        { title: 'Röda Viner', handle: 'roda-viner', description: 'Utmärkta röda viner från hela världen' },
        { title: 'Vita Viner', handle: 'vita-viner', description: 'Friska vita viner för alla tillfällen' },
        { title: 'Rosé Viner', handle: 'rose-viner', description: 'Eleganta rosé viner med karaktär' },
        { title: 'Champagne & Mousserande', handle: 'champagne-mousserande', description: 'Exklusiva bubbelviner för speciella tillfällen' }
      ])

    if (collectionsError) {
      console.error('❌ Failed to seed collections:', collectionsError)
      return { success: false, message: 'Failed to seed collections' }
    }

    console.log('✅ Example data seeded successfully')
    return { success: true, message: 'Data seeded successfully' }

  } catch (error) {
    console.error('❌ Failed to seed data:', error)
    return { success: false, message: 'Failed to seed data' }
  }
}
