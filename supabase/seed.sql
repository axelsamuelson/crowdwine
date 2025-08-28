-- Seed data for wine crowdsourcing platform

-- Insert collections
INSERT INTO collections (title, handle, description, is_active) VALUES
  ('Röda Viner', 'roda-viner', 'Utmärkta röda viner från hela världen', true),
  ('Vita Viner', 'vita-viner', 'Friska vita viner för alla tillfällen', true),
  ('Rosé Viner', 'rose-viner', 'Eleganta rosé viner med karaktär', true),
  ('Champagne & Mousserande', 'champagne-mousserande', 'Exklusiva bubbelviner för speciella tillfällen', true);

-- Insert producers
INSERT INTO producers (name, handle, description, country, region, is_active) VALUES
  ('Château Margaux', 'chateau-margaux', 'Legendarisk bordeaux-producent med över 400 års historia', 'Frankrike', 'Bordeaux', true),
  ('Dom Pérignon', 'dom-perignon', 'Exklusiv champagne från Moët & Chandon', 'Frankrike', 'Champagne', true),
  ('Antinori', 'antinori', 'Italiensk vinproducent med tradition sedan 1385', 'Italien', 'Toscana', true),
  ('Vega Sicilia', 'vega-sicilia', 'Spansk vinproducent känd för sina Rioja-viner', 'Spanien', 'Rioja', true);

-- Insert wines
INSERT INTO wines (title, handle, description, description_html, category_id, producer_id, vintage, wine_type, grape_varieties, alcohol_content, region, country, price_range_min, price_range_max, currency_code, bottles_per_pallet, available_for_sale, is_active) VALUES
  (
    'Château Margaux 2018',
    'chateau-margaux-2018',
    'En exceptionell bordeaux från den legendariska producenten',
    '<p>En exceptionell bordeaux från den legendariska producenten. Denna vintage representerar perfekt balans mellan kraft och elegans.</p>',
    (SELECT id FROM collections WHERE handle = 'roda-viner'),
    (SELECT id FROM producers WHERE handle = 'chateau-margaux'),
    2018,
    'Rött vin',
    ARRAY['Cabernet Sauvignon', 'Merlot', 'Cabernet Franc', 'Petit Verdot'],
    13.5,
    'Bordeaux',
    'Frankrike',
    2500.00,
    2500.00,
    'SEK',
    56,
    true,
    true
  ),
  (
    'Dom Pérignon 2012',
    'dom-perignon-2012',
    'En extraordinär champagne med komplexitet och elegans',
    '<p>En extraordinär champagne med komplexitet och elegans. Denna vintage är en av de bästa från Dom Pérignon.</p>',
    (SELECT id FROM collections WHERE handle = 'champagne-mousserande'),
    (SELECT id FROM producers WHERE handle = 'dom-perignon'),
    2012,
    'Champagne',
    ARRAY['Chardonnay', 'Pinot Noir'],
    12.5,
    'Champagne',
    'Frankrike',
    1800.00,
    1800.00,
    'SEK',
    56,
    true,
    true
  ),
  (
    'Tignanello 2019',
    'tignanello-2019',
    'En ikonisk Super Tuscan från Antinori',
    '<p>En ikonisk Super Tuscan från Antinori. Denna vin kombinerar traditionell toskansk stil med moderna tekniker.</p>',
    (SELECT id FROM collections WHERE handle = 'roda-viner'),
    (SELECT id FROM producers WHERE handle = 'antinori'),
    2019,
    'Rött vin',
    ARRAY['Sangiovese', 'Cabernet Sauvignon', 'Cabernet Franc'],
    14.0,
    'Toscana',
    'Italien',
    1200.00,
    1200.00,
    'SEK',
    56,
    true,
    true
  ),
  (
    'Unico 2015',
    'unico-2015',
    'En exklusiv Rioja från Vega Sicilia',
    '<p>En exklusiv Rioja från Vega Sicilia. Denna vin är en av Spaniens mest prestigefyllda viner.</p>',
    (SELECT id FROM collections WHERE handle = 'roda-viner'),
    (SELECT id FROM producers WHERE handle = 'vega-sicilia'),
    2015,
    'Rött vin',
    ARRAY['Tempranillo', 'Cabernet Sauvignon'],
    14.5,
    'Rioja',
    'Spanien',
    1600.00,
    1600.00,
    'SEK',
    56,
    true,
    true
  );

-- Insert wine variants
INSERT INTO wine_variants (wine_id, title, price, available_for_sale, bottle_size, sku) VALUES
  ((SELECT id FROM wines WHERE handle = 'chateau-margaux-2018'), '750ml', 2500.00, true, '750ml', 'CM-2018-750'),
  ((SELECT id FROM wines WHERE handle = 'dom-perignon-2012'), '750ml', 1800.00, true, '750ml', 'DP-2012-750'),
  ((SELECT id FROM wines WHERE handle = 'tignanello-2019'), '750ml', 1200.00, true, '750ml', 'TIG-2019-750'),
  ((SELECT id FROM wines WHERE handle = 'unico-2015'), '750ml', 1600.00, true, '750ml', 'UNI-2015-750');

-- Insert pallets for crowdsourcing
INSERT INTO pallets (wine_id, target_bottles, current_bottles, status, estimated_shipping_date) VALUES
  ((SELECT id FROM wines WHERE handle = 'chateau-margaux-2018'), 56, 12, 'filling', CURRENT_DATE + INTERVAL '30 days'),
  ((SELECT id FROM wines WHERE handle = 'dom-perignon-2012'), 56, 34, 'filling', CURRENT_DATE + INTERVAL '15 days'),
  ((SELECT id FROM wines WHERE handle = 'tignanello-2019'), 56, 8, 'filling', CURRENT_DATE + INTERVAL '45 days'),
  ((SELECT id FROM wines WHERE handle = 'unico-2015'), 56, 22, 'filling', CURRENT_DATE + INTERVAL '25 days');

-- Insert wine images (placeholder URLs)
INSERT INTO wine_images (wine_id, url, alt_text, width, height, position, is_featured) VALUES
  ((SELECT id FROM wines WHERE handle = 'chateau-margaux-2018'), 'https://example.com/chateau-margaux-1.jpg', 'Château Margaux 2018 - Front', 800, 600, 1, true),
  ((SELECT id FROM wines WHERE handle = 'chateau-margaux-2018'), 'https://example.com/chateau-margaux-2.jpg', 'Château Margaux 2018 - Back', 800, 600, 2, false),
  ((SELECT id FROM wines WHERE handle = 'dom-perignon-2012'), 'https://example.com/dom-perignon-1.jpg', 'Dom Pérignon 2012 - Front', 800, 600, 1, true),
  ((SELECT id FROM wines WHERE handle = 'dom-perignon-2012'), 'https://example.com/dom-perignon-2.jpg', 'Dom Pérignon 2012 - Back', 800, 600, 2, false),
  ((SELECT id FROM wines WHERE handle = 'tignanello-2019'), 'https://example.com/tignanello-1.jpg', 'Tignanello 2019 - Front', 800, 600, 1, true),
  ((SELECT id FROM wines WHERE handle = 'unico-2015'), 'https://example.com/unico-1.jpg', 'Unico 2015 - Front', 800, 600, 1, true);
