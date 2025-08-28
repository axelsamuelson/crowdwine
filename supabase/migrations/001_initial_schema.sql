-- Initial database schema for wine crowdsourcing platform
-- This migration creates all necessary tables

-- 1. Collections table (categories)
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

-- 2. Producers table (wine producers)
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

-- 3. Wines table (main product table)
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

-- 4. Wine images table
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

-- 5. Wine variants table
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

-- 6. Wine options table
CREATE TABLE IF NOT EXISTS wine_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wine_id UUID REFERENCES wines(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Wine option values table
CREATE TABLE IF NOT EXISTS wine_option_values (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  option_id UUID REFERENCES wine_options(id) ON DELETE CASCADE,
  value VARCHAR(255) NOT NULL,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Customers table
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

-- 9. Pallets table (crowdsourcing logic)
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

-- 10. Orders table
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

-- 11. Carts table
CREATE TABLE IF NOT EXISTS carts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Cart lines table
CREATE TABLE IF NOT EXISTS cart_lines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
  wine_id UUID REFERENCES wines(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES wine_variants(id),
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_collections_handle ON collections(handle);
CREATE INDEX IF NOT EXISTS idx_collections_active ON collections(is_active);

CREATE INDEX IF NOT EXISTS idx_producers_handle ON producers(handle);
CREATE INDEX IF NOT EXISTS idx_producers_active ON producers(is_active);

CREATE INDEX IF NOT EXISTS idx_wines_handle ON wines(handle);
CREATE INDEX IF NOT EXISTS idx_wines_category ON wines(category_id);
CREATE INDEX IF NOT EXISTS idx_wines_producer ON wines(producer_id);
CREATE INDEX IF NOT EXISTS idx_wines_active ON wines(is_active);
CREATE INDEX IF NOT EXISTS idx_wines_available ON wines(available_for_sale);

CREATE INDEX IF NOT EXISTS idx_wine_images_wine_id ON wine_images(wine_id);
CREATE INDEX IF NOT EXISTS idx_wine_images_position ON wine_images(position);

CREATE INDEX IF NOT EXISTS idx_wine_variants_wine_id ON wine_variants(wine_id);
CREATE INDEX IF NOT EXISTS idx_wine_variants_available ON wine_variants(available_for_sale);

CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_wine_id ON orders(wine_id);
CREATE INDEX IF NOT EXISTS idx_orders_pallet_id ON orders(pallet_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);

CREATE INDEX IF NOT EXISTS idx_pallets_wine_id ON pallets(wine_id);
CREATE INDEX IF NOT EXISTS idx_pallets_status ON pallets(status);

CREATE INDEX IF NOT EXISTS idx_carts_customer_id ON carts(customer_id);
CREATE INDEX IF NOT EXISTS idx_cart_lines_cart_id ON cart_lines(cart_id);

-- Enable Row Level Security (RLS)
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

-- Create basic RLS policies
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
