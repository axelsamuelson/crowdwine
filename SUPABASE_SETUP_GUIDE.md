# Supabase Database Setup Guide

## 🚀 Steg-för-steg guide för att sätta upp databasen

Eftersom Supabase inte har `exec_sql` funktionen aktiverad i nya projekt, behöver vi skapa tabellerna manuellt via Supabase Dashboard.

### 1. Gå till Supabase Dashboard
- Öppna [supabase.com](https://supabase.com)
- Logga in och välj ditt projekt
- Gå till "Table Editor" i vänster menyn

### 2. Skapa Collections-tabell
```sql
CREATE TABLE collections (
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
```

### 3. Skapa Producers-tabell
```sql
CREATE TABLE producers (
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
```

### 4. Skapa Wines-tabell
```sql
CREATE TABLE wines (
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
```

### 5. Skapa Wine Images-tabell
```sql
CREATE TABLE wine_images (
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
```

### 6. Skapa Wine Variants-tabell
```sql
CREATE TABLE wine_variants (
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
```

### 7. Skapa Wine Options-tabell
```sql
CREATE TABLE wine_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wine_id UUID REFERENCES wines(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 8. Skapa Wine Option Values-tabell
```sql
CREATE TABLE wine_option_values (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  option_id UUID REFERENCES wine_options(id) ON DELETE CASCADE,
  value VARCHAR(255) NOT NULL,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 9. Skapa Customers-tabell
```sql
CREATE TABLE customers (
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
```

### 10. Skapa Pallets-tabell
```sql
CREATE TABLE pallets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wine_id UUID REFERENCES wines(id) ON DELETE CASCADE,
  target_bottles INTEGER NOT NULL,
  current_bottles INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'filling',
  estimated_shipping_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 11. Skapa Orders-tabell
```sql
CREATE TABLE orders (
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
```

### 12. Skapa Carts-tabell
```sql
CREATE TABLE carts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 13. Skapa Cart Lines-tabell
```sql
CREATE TABLE cart_lines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
  wine_id UUID REFERENCES wines(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES wine_variants(id),
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔧 Sätt upp RLS (Row Level Security)

Efter att du skapat alla tabeller, aktivera RLS:

```sql
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
```

## 📊 Skapa Indexes

```sql
-- Collections indexes
CREATE INDEX idx_collections_handle ON collections(handle);
CREATE INDEX idx_collections_active ON collections(is_active);

-- Producers indexes
CREATE INDEX idx_producers_handle ON producers(handle);
CREATE INDEX idx_producers_active ON producers(is_active);

-- Wines indexes
CREATE INDEX idx_wines_handle ON wines(handle);
CREATE INDEX idx_wines_category ON wines(category_id);
CREATE INDEX idx_wines_producer ON wines(producer_id);
CREATE INDEX idx_wines_active ON wines(is_active);
CREATE INDEX idx_wines_available ON wines(available_for_sale);

-- Images indexes
CREATE INDEX idx_wine_images_wine_id ON wine_images(wine_id);
CREATE INDEX idx_wine_images_position ON wine_images(position);

-- Variants indexes
CREATE INDEX idx_wine_variants_wine_id ON wine_variants(wine_id);
CREATE INDEX idx_wine_variants_available ON wine_variants(available_for_sale);

-- Orders indexes
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_wine_id ON orders(wine_id);
CREATE INDEX idx_orders_pallet_id ON orders(pallet_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_number ON orders(order_number);

-- Pallets indexes
CREATE INDEX idx_pallets_wine_id ON pallets(wine_id);
CREATE INDEX idx_pallets_status ON pallets(status);

-- Cart indexes
CREATE INDEX idx_carts_customer_id ON carts(customer_id);
CREATE INDEX idx_cart_lines_cart_id ON cart_lines(cart_id);
```

## 🎯 Nästa steg

Efter att du skapat alla tabeller:

1. Gå tillbaka till din app
2. Klicka på "Setup Database" knappen i admin-panelen
3. Systemet kommer att seeda exempel-data automatiskt
4. Besök `/shop` sidan för att se dina viner!

## 💡 Tips

- Använd "SQL Editor" i Supabase Dashboard för att köra SQL-kommandon
- Kopiera och klistra in varje CREATE TABLE-kommando en i taget
- Kontrollera att alla tabeller skapades korrekt innan du går vidare
- Om du får fel, kontrollera att du inte har skrivit fel i SQL-koden
