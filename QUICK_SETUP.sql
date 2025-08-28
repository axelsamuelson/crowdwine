-- 🚀 Snabb setup för vin-crowdsourcing plattformen
-- Kör dessa kommandon i Supabase SQL Editor

-- 1. Collections (kategorier)
CREATE TABLE collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  handle VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Producers (producenter)
CREATE TABLE producers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  handle VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  country VARCHAR(100),
  region VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Wines (viner)
CREATE TABLE wines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  handle VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  category_id UUID REFERENCES collections(id),
  producer_id UUID REFERENCES producers(id),
  vintage INTEGER,
  wine_type VARCHAR(100),
  grape_varieties TEXT[],
  price_range_min DECIMAL(10,2) NOT NULL,
  price_range_max DECIMAL(10,2) NOT NULL,
  currency_code VARCHAR(3) DEFAULT 'SEK',
  bottles_per_pallet INTEGER DEFAULT 56,
  available_for_sale BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Pallets (pallar för crowdsourcing)
CREATE TABLE pallets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wine_id UUID REFERENCES wines(id) ON DELETE CASCADE,
  target_bottles INTEGER NOT NULL,
  current_bottles INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'filling',
  estimated_shipping_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aktivera RLS
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE producers ENABLE ROW LEVEL SECURITY;
ALTER TABLE wines ENABLE ROW LEVEL SECURITY;
ALTER TABLE pallets ENABLE ROW LEVEL SECURITY;

-- Skapa indexes
CREATE INDEX idx_collections_handle ON collections(handle);
CREATE INDEX idx_producers_handle ON producers(handle);
CREATE INDEX idx_wines_handle ON wines(handle);
CREATE INDEX idx_wines_category ON wines(category_id);
CREATE INDEX idx_pallets_wine_id ON pallets(wine_id);
CREATE INDEX idx_pallets_status ON pallets(status);

-- ✅ Klar! Nu kan du köra "Setup Database" i admin-panelen
