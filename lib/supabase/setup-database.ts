import { supabaseAdmin } from './config'

export interface DatabaseSetupResult {
  success: boolean
  message: string
  details?: any
}

export async function setupDatabase(): Promise<DatabaseSetupResult> {
  try {
    console.log('🚀 Starting database setup for wine crowdsourcing platform...')

    // 1. Skapa collections-tabell (Shopify-kompatibel)
    const { error: collectionsError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS collections (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          handle VARCHAR(255) UNIQUE NOT NULL,
          description TEXT,
          image_url VARCHAR(255),
          seo_title VARCHAR(255),
          seo_description TEXT,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (collectionsError) {
      console.error('Error creating collections table:', collectionsError)
      return { success: false, message: 'Failed to create collections table', details: collectionsError }
    }

    // 2. Skapa producenter-tabell (Shopify vendor-kompatibel)
    const { error: producersError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS producers (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          handle VARCHAR(255) UNIQUE NOT NULL,
          description TEXT,
          country VARCHAR(100),
          region VARCHAR(100),
          website VARCHAR(255),
          logo_url VARCHAR(255),
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (producersError) {
      console.error('Error creating producers table:', producersError)
      return { success: false, message: 'Failed to create producers table', details: producersError }
    }

    // 3. Skapa viner-tabell (Shopify product-kompatibel + vin-specifika fält)
    const { error: winesError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS wines (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          handle VARCHAR(255) UNIQUE NOT NULL,
          description TEXT,
          description_html TEXT,
          product_type VARCHAR(100) DEFAULT 'Wine',
          category_id UUID REFERENCES collections(id),
          producer_id UUID REFERENCES producers(id),
          vintage INTEGER,
          wine_type VARCHAR(100),
          grape_varieties TEXT[],
          alcohol_content DECIMAL(4,2),
          region VARCHAR(100),
          country VARCHAR(100),
          price_range_min DECIMAL(10,2) NOT NULL,
          price_range_max DECIMAL(10,2) NOT NULL,
          compare_at_price DECIMAL(10,2),
          currency_code VARCHAR(3) DEFAULT 'SEK',
          bottles_per_pallet INTEGER DEFAULT 56,
          min_pallet_orders INTEGER DEFAULT 1,
          max_pallet_orders INTEGER DEFAULT 10,
          available_for_sale BOOLEAN DEFAULT true,
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

    // 4. Skapa wine_images-tabell (Shopify image-kompatibel)
    const { error: imagesError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS wine_images (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          wine_id UUID REFERENCES wines(id) ON DELETE CASCADE,
          url VARCHAR(500) NOT NULL,
          alt_text VARCHAR(255),
          width INTEGER,
          height INTEGER,
          position INTEGER DEFAULT 0,
          is_featured BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (imagesError) {
      console.error('Error creating wine_images table:', imagesError)
      return { success: false, message: 'Failed to create wine_images table', details: imagesError }
    }

    // 5. Skapa wine_variants-tabell (Shopify variant-kompatibel)
    const { error: variantsError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS wine_variants (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          wine_id UUID REFERENCES wines(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          price DECIMAL(10,2) NOT NULL,
          compare_at_price DECIMAL(10,2),
          available_for_sale BOOLEAN DEFAULT true,
          bottle_size VARCHAR(50) DEFAULT '750ml',
          sku VARCHAR(255),
          barcode VARCHAR(255),
          weight_grams INTEGER,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (variantsError) {
      console.error('Error creating wine_variants table:', variantsError)
      return { success: false, message: 'Failed to create wine_variants table', details: variantsError }
    }

    // 6. Skapa wine_options-tabell (Shopify option-kompatibel)
    const { error: optionsError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS wine_options (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          wine_id UUID REFERENCES wines(id) ON DELETE CASCADE,
          name VARCHAR(100) NOT NULL,
          position INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (optionsError) {
      console.error('Error creating wine_options table:', optionsError)
      return { success: false, message: 'Failed to create wine_options table', details: optionsError }
    }

    // 7. Skapa wine_option_values-tabell
    const { error: optionValuesError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS wine_option_values (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          option_id UUID REFERENCES wine_options(id) ON DELETE CASCADE,
          value VARCHAR(255) NOT NULL,
          position INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (optionValuesError) {
      console.error('Error creating wine_option_values table:', optionValuesError)
      return { success: false, message: 'Failed to create wine_option_values table', details: optionValuesError }
    }

    // 8. Skapa kunder-tabell (Shopify customer-kompatibel)
    const { error: customersError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS customers (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          first_name VARCHAR(100),
          last_name VARCHAR(100),
          phone VARCHAR(20),
          accepts_marketing BOOLEAN DEFAULT false,
          address TEXT,
          city VARCHAR(100),
          postal_code VARCHAR(20),
          country VARCHAR(100),
          province VARCHAR(100),
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (customersError) {
      console.error('Error creating customers table:', customersError)
      return { success: false, message: 'Failed to create customers table', details: customersError }
    }

    // 9. Skapa pallar-tabell (Vin-specifik för crowdsourcing)
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

    // 10. Skapa orders-tabell (Shopify order-kompatibel + pall-logik)
    const { error: ordersError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS orders (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          order_number VARCHAR(255) UNIQUE NOT NULL,
          customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
          wine_id UUID REFERENCES wines(id) ON DELETE CASCADE,
          variant_id UUID REFERENCES wine_variants(id),
          pallet_id UUID REFERENCES pallets(id) ON DELETE CASCADE,
          quantity INTEGER NOT NULL,
          unit_price DECIMAL(10,2) NOT NULL,
          total_price DECIMAL(10,2) NOT NULL,
          status VARCHAR(50) DEFAULT 'pending',
          financial_status VARCHAR(50) DEFAULT 'pending',
          fulfillment_status VARCHAR(50) DEFAULT 'unfulfilled',
          order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          estimated_shipping_date DATE,
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (ordersError) {
      console.error('Error creating orders table:', ordersError)
      return { success: false, message: 'Failed to create orders table', details: ordersError }
    }

    // 11. Skapa carts-tabell (Shopify cart-kompatibel)
    const { error: cartsError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS carts (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          customer_id UUID REFERENCES customers(id),
          expires_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (cartsError) {
      console.error('Error creating carts table:', cartsError)
      return { success: false, message: 'Failed to create carts table', details: cartsError }
    }

    // 12. Skapa cart_lines-tabell (Shopify cart line-kompatibel)
    const { error: cartLinesError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS cart_lines (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
          wine_id UUID REFERENCES wines(id) ON DELETE CASCADE,
          variant_id UUID REFERENCES wine_variants(id),
          quantity INTEGER NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (cartLinesError) {
      console.error('Error creating cart_lines table:', cartLinesError)
      return { success: false, message: 'Failed to create cart_lines table', details: cartLinesError }
    }

    // 13. Skapa indexes för prestanda
    const { error: indexesError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        -- Collections indexes
        CREATE INDEX IF NOT EXISTS idx_collections_handle ON collections(handle);
        CREATE INDEX IF NOT EXISTS idx_collections_is_active ON collections(is_active);
        
        -- Producers indexes
        CREATE INDEX IF NOT EXISTS idx_producers_handle ON producers(handle);
        CREATE INDEX IF NOT EXISTS idx_producers_is_active ON producers(is_active);
        
        -- Wines indexes
        CREATE INDEX IF NOT EXISTS idx_wines_handle ON wines(handle);
        CREATE INDEX IF NOT EXISTS idx_wines_producer_id ON wines(producer_id);
        CREATE INDEX IF NOT EXISTS idx_wines_category_id ON wines(category_id);
        CREATE INDEX IF NOT EXISTS idx_wines_is_active ON wines(is_active);
        CREATE INDEX IF NOT EXISTS idx_wines_available_for_sale ON wines(available_for_sale);
        CREATE INDEX IF NOT EXISTS idx_wines_price_range ON wines(price_range_min, price_range_max);
        
        -- Images indexes
        CREATE INDEX IF NOT EXISTS idx_wine_images_wine_id ON wine_images(wine_id);
        CREATE INDEX IF NOT EXISTS idx_wine_images_position ON wine_images(position);
        
        -- Variants indexes
        CREATE INDEX IF NOT EXISTS idx_wine_variants_wine_id ON wine_variants(wine_id);
        CREATE INDEX IF NOT EXISTS idx_wine_variants_available ON wine_variants(available_for_sale);
        
        -- Orders indexes
        CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
        CREATE INDEX IF NOT EXISTS idx_orders_wine_id ON orders(wine_id);
        CREATE INDEX IF NOT EXISTS idx_orders_pallet_id ON orders(pallet_id);
        CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
        CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
        
        -- Pallets indexes
        CREATE INDEX IF NOT EXISTS idx_pallets_wine_id ON pallets(wine_id);
        CREATE INDEX IF NOT EXISTS idx_pallets_status ON pallets(status);
        
        -- Cart indexes
        CREATE INDEX IF NOT EXISTS idx_carts_customer_id ON carts(customer_id);
        CREATE INDEX IF NOT EXISTS idx_cart_lines_cart_id ON cart_lines(cart_id);
      `
    })

    if (indexesError) {
      console.error('Error creating indexes:', indexesError)
      return { success: false, message: 'Failed to create indexes', details: indexesError }
    }

    // 14. Skapa RLS policies
    const { error: rlsError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        -- Aktivera RLS på alla tabeller
        ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
        ALTER TABLE producers ENABLE ROW LEVEL SECURITY;
        ALTER TABLE wines ENABLE ROW LEVEL SECURITY;
        ALTER TABLE wine_images ENABLE ROW LEVEL SECURITY;
        ALTER TABLE wine_variants ENABLE ROW LEVEL SECURITY;
        ALTER TABLE wine_options ENABLE ROW LEVEL SECURITY;
        ALTER TABLE wine_option_values ENABLE ROW LEVEL SECURITY;
        ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
        ALTER TABLE pallets ENABLE ROW LEVEL SECURITY;
        ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
        ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
        ALTER TABLE cart_lines ENABLE ROW LEVEL SECURITY;
        
        -- Public read access policies
        CREATE POLICY "Allow public read access to collections" ON collections
          FOR SELECT USING (is_active = true);
          
        CREATE POLICY "Allow public read access to producers" ON producers
          FOR SELECT USING (is_active = true);
          
        CREATE POLICY "Allow public read access to wines" ON wines
          FOR SELECT USING (is_active = true AND available_for_sale = true);
          
        CREATE POLICY "Allow public read access to wine_images" ON wine_images
          FOR SELECT USING (true);
          
        CREATE POLICY "Allow public read access to wine_variants" ON wine_variants
          FOR SELECT USING (available_for_sale = true);
          
        CREATE POLICY "Allow public read access to wine_options" ON wine_options
          FOR SELECT USING (true);
          
        CREATE POLICY "Allow public read access to wine_option_values" ON wine_option_values
          FOR SELECT USING (true);
          
        CREATE POLICY "Allow public read access to pallets" ON pallets
          FOR SELECT USING (true);
        
        -- Customer-specific policies
        CREATE POLICY "Allow customers to read own orders" ON orders
          FOR SELECT USING (customer_id = auth.uid());
          
        CREATE POLICY "Allow customers to create orders" ON orders
          FOR INSERT WITH CHECK (customer_id = auth.uid());
          
        CREATE POLICY "Allow customers to read own cart" ON carts
          FOR SELECT USING (customer_id = auth.uid());
          
        CREATE POLICY "Allow customers to manage own cart" ON carts
          FOR ALL USING (customer_id = auth.uid());
          
        CREATE POLICY "Allow customers to manage own cart lines" ON cart_lines
          FOR ALL USING (cart_id IN (SELECT id FROM carts WHERE customer_id = auth.uid()));
      `
    })

    if (rlsError) {
      console.error('Error setting up RLS policies:', rlsError)
      return { success: false, message: 'Failed to setup RLS policies', details: rlsError }
    }

    console.log('✅ Database setup completed successfully!')
    return { 
      success: true, 
      message: 'Database setup completed successfully for wine crowdsourcing platform!',
      details: {
        tables: [
          'collections', 'producers', 'wines', 'wine_images', 'wine_variants',
          'wine_options', 'wine_option_values', 'customers', 'pallets', 
          'orders', 'carts', 'cart_lines'
        ],
        indexes: 'Performance indexes created',
        rls: 'Row Level Security enabled',
        shopify_compatible: 'Structure matches Shopify data model'
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

    // Lägg till exempel-collection
    const { data: collection, error: collectionError } = await supabaseAdmin
      .from('collections')
      .insert({
        title: 'Bordeaux Wines',
        handle: 'bordeaux-wines',
        description: 'Exceptional wines from the legendary Bordeaux region',
        seo_title: 'Bordeaux Wines - Premium French Wines',
        seo_description: 'Discover the finest Bordeaux wines from renowned producers'
      })
      .select()
      .single()

    if (collectionError) {
      console.error('Error creating example collection:', collectionError)
      return { success: false, message: 'Failed to create example collection', details: collectionError }
    }

    // Lägg till exempel-producent
    const { data: producer, error: producerError } = await supabaseAdmin
      .from('producers')
      .insert({
        name: 'Château Margaux',
        handle: 'chateau-margaux',
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
        title: 'Château Margaux 2018',
        handle: 'chateau-margaux-2018',
        description: 'A magnificent vintage with exceptional complexity and aging potential',
        description_html: '<p>A magnificent vintage with exceptional complexity and aging potential</p>',
        product_type: 'Wine',
        category_id: collection.id,
        producer_id: producer.id,
        vintage: 2018,
        wine_type: 'Red',
        grape_varieties: ['Cabernet Sauvignon', 'Merlot', 'Cabernet Franc', 'Petit Verdot'],
        alcohol_content: 13.5,
        region: 'Bordeaux',
        country: 'France',
        price_range_min: 899.00,
        price_range_max: 899.00,
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

    // Lägg till exempel-variant
    const { data: variant, error: variantError } = await supabaseAdmin
      .from('wine_variants')
      .insert({
        wine_id: wine.id,
        title: '750ml',
        price: 899.00,
        bottle_size: '750ml',
        available_for_sale: true
      })
      .select()
      .single()

    if (variantError) {
      console.error('Error creating example variant:', variantError)
      return { success: false, message: 'Failed to create example variant', details: variantError }
    }

    // Lägg till exempel-bild
    const { error: imageError } = await supabaseAdmin
      .from('wine_images')
      .insert({
        wine_id: wine.id,
        url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800',
        alt_text: 'Château Margaux 2018 Red Wine',
        width: 800,
        height: 600,
        position: 1,
        is_featured: true
      })

    if (imageError) {
      console.error('Error creating example image:', imageError)
      return { success: false, message: 'Failed to create example image', details: imageError }
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
        collection: collection.title,
        producer: producer.name,
        wine: wine.title,
        variant: variant.title,
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
