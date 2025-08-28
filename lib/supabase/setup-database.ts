import { supabaseAdmin } from './config'

export interface DatabaseSetupResult {
  success: boolean
  message: string
  details?: any
}

export async function setupDatabase(): Promise<DatabaseSetupResult> {
  try {
    console.log('🚀 Starting database setup...')

    // 1. Skapa producenter-tabell
    const { error: producersError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS producers (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          country VARCHAR(100),
          region VARCHAR(100),
          website VARCHAR(255),
          logo_url VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (producersError) {
      console.error('Error creating producers table:', producersError)
      return { success: false, message: 'Failed to create producers table', details: producersError }
    }

    // 2. Skapa viner-tabell
    const { error: winesError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS wines (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          producer_id UUID REFERENCES producers(id) ON DELETE CASCADE,
          vintage INTEGER,
          wine_type VARCHAR(100),
          grape_varieties TEXT[],
          description TEXT,
          price_per_bottle DECIMAL(10,2) NOT NULL,
          bottles_per_pallet INTEGER DEFAULT 56,
          min_pallet_orders INTEGER DEFAULT 1,
          max_pallet_orders INTEGER DEFAULT 10,
          image_url VARCHAR(255),
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (winesError) {
      console.error('Error creating wines table:', winesError)
      return { success: false, message: 'Failed to create wines table', details: winesError }
    }

    // 3. Skapa kunder-tabell
    const { error: customersError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS customers (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          first_name VARCHAR(100),
          last_name VARCHAR(100),
          phone VARCHAR(20),
          address TEXT,
          city VARCHAR(100),
          postal_code VARCHAR(20),
          country VARCHAR(100),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (customersError) {
      console.error('Error creating customers table:', customersError)
      return { success: false, message: 'Failed to create customers table', details: customersError }
    }

    // 4. Skapa pallar-tabell
    const { error: palletsError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS pallets (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          wine_id UUID REFERENCES wines(id) ON DELETE CASCADE,
          target_bottles INTEGER NOT NULL,
          current_bottles INTEGER DEFAULT 0,
          status VARCHAR(50) DEFAULT 'filling',
          estimated_shipping_date DATE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (palletsError) {
      console.error('Error creating pallets table:', palletsError)
      return { success: false, message: 'Failed to create pallets table', details: palletsError }
    }

    // 5. Skapa orders-tabell
    const { error: ordersError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS orders (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
          wine_id UUID REFERENCES wines(id) ON DELETE CASCADE,
          pallet_id UUID REFERENCES pallets(id) ON DELETE CASCADE,
          quantity INTEGER NOT NULL,
          total_price DECIMAL(10,2) NOT NULL,
          status VARCHAR(50) DEFAULT 'pending',
          order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          estimated_shipping_date DATE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (ordersError) {
      console.error('Error creating orders table:', ordersError)
      return { success: false, message: 'Failed to create orders table', details: ordersError }
    }

    // 6. Skapa indexes för prestanda
    const { error: indexesError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        -- Index på wine_id för snabb lookup
        CREATE INDEX IF NOT EXISTS idx_orders_wine_id ON orders(wine_id);
        
        -- Index på pallet_id för snabb lookup
        CREATE INDEX IF NOT EXISTS idx_orders_pallet_id ON orders(pallet_id);
        
        -- Index på customer_id för snabb lookup
        CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
        
        -- Index på status för snabb filtrering
        CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
        
        -- Index på producer_id för viner
        CREATE INDEX IF NOT EXISTS idx_wines_producer_id ON wines(producer_id);
        
        -- Index på is_active för viner
        CREATE INDEX IF NOT EXISTS idx_wines_is_active ON wines(is_active);
        
        -- Index på pallet status
        CREATE INDEX IF NOT EXISTS idx_pallets_status ON pallets(status);
      `
    })

    if (indexesError) {
      console.error('Error creating indexes:', indexesError)
      return { success: false, message: 'Failed to create indexes', details: indexesError }
    }

    // 7. Skapa RLS policies
    const { error: rlsError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        -- Aktivera RLS på alla tabeller
        ALTER TABLE producers ENABLE ROW LEVEL SECURITY;
        ALTER TABLE wines ENABLE ROW LEVEL SECURITY;
        ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
        ALTER TABLE pallets ENABLE ROW LEVEL SECURITY;
        ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
        
        -- Policy för att alla kan läsa producenter och viner
        CREATE POLICY "Allow public read access to producers" ON producers
          FOR SELECT USING (true);
          
        CREATE POLICY "Allow public read access to wines" ON wines
          FOR SELECT USING (is_active = true);
          
        CREATE POLICY "Allow public read access to pallets" ON pallets
          FOR SELECT USING (true);
        
        -- Policy för att kunder kan läsa sina egna orders
        CREATE POLICY "Allow customers to read own orders" ON orders
          FOR SELECT USING (customer_id = auth.uid());
          
        -- Policy för att kunder kan skapa orders
        CREATE POLICY "Allow customers to create orders" ON orders
          FOR INSERT WITH CHECK (customer_id = auth.uid());
      `
    })

    if (rlsError) {
      console.error('Error setting up RLS policies:', rlsError)
      return { success: false, message: 'Failed to setup RLS policies', details: rlsError }
    }

    console.log('✅ Database setup completed successfully!')
    return { 
      success: true, 
      message: 'Database setup completed successfully!',
      details: {
        tables: ['producers', 'wines', 'customers', 'pallets', 'orders'],
        indexes: 'Performance indexes created',
        rls: 'Row Level Security enabled'
      }
    }

  } catch (error) {
    console.error('❌ Database setup failed:', error)
    return { 
      success: false, 
      message: 'Database setup failed', 
      details: error 
    }
  }
}

// Funktion för att lägga till exempel-data
export async function seedExampleData(): Promise<DatabaseSetupResult> {
  try {
    console.log('🌱 Seeding example data...')

    // Lägg till exempel-producent
    const { data: producer, error: producerError } = await supabaseAdmin
      .from('producers')
      .insert({
        name: 'Château Margaux',
        description: 'Legendary Bordeaux producer known for exceptional wines',
        country: 'France',
        region: 'Bordeaux',
        website: 'https://www.chateau-margaux.com'
      })
      .select()
      .single()

    if (producerError) {
      console.error('Error creating example producer:', producerError)
      return { success: false, message: 'Failed to create example producer', details: producerError }
    }

    // Lägg till exempel-vin
    const { data: wine, error: wineError } = await supabaseAdmin
      .from('wines')
      .insert({
        name: 'Château Margaux 2018',
        producer_id: producer.id,
        vintage: 2018,
        wine_type: 'Red',
        grape_varieties: ['Cabernet Sauvignon', 'Merlot', 'Cabernet Franc', 'Petit Verdot'],
        description: 'A magnificent vintage with exceptional complexity and aging potential',
        price_per_bottle: 899.00,
        bottles_per_pallet: 56,
        min_pallet_orders: 1,
        max_pallet_orders: 5
      })
      .select()
      .single()

    if (wineError) {
      console.error('Error creating example wine:', wineError)
      return { success: false, message: 'Failed to create example wine', details: wineError }
    }

    // Skapa första pall
    const { error: palletError } = await supabaseAdmin
      .from('pallets')
      .insert({
        wine_id: wine.id,
        target_bottles: 56,
        current_bottles: 0,
        status: 'filling'
      })

    if (palletError) {
      console.error('Error creating example pallet:', palletError)
      return { success: false, message: 'Failed to create example pallet', details: palletError }
    }

    console.log('✅ Example data seeded successfully!')
    return { 
      success: true, 
      message: 'Example data seeded successfully!',
      details: {
        producer: producer.name,
        wine: wine.name,
        pallet: 'Created'
      }
    }

  } catch (error) {
    console.error('❌ Data seeding failed:', error)
    return { 
      success: false, 
      message: 'Data seeding failed', 
      details: error 
    }
  }
}
