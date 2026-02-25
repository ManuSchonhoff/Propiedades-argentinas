-- =============================================================
-- PROPIEDADES ARGENTINAS — Schema + RLS + Seed
-- Ejecutar en Supabase SQL Editor (un solo bloque)
-- =============================================================

-- 1) Extensiones
create extension if not exists pgcrypto;

-- 2) Tablas
-- ----- listings -----
create table if not exists listings (
  id            uuid        primary key default gen_random_uuid(),
  op            text        not null check (op in ('buy','rent','temp')),
  title         text        not null,
  price         numeric     not null,
  currency      text        not null default 'USD',
  province      text        not null,
  city          text        not null,
  location_text text        not null,
  property_type text        not null,
  bedrooms      int,
  bathrooms     int,
  area_m2       numeric,
  badge         text,
  description   text,
  status        text        not null default 'active'
                            check (status in ('draft','pending','active','paused','sold','rented','archived')),
  created_at    timestamptz default now()
);

-- ----- listing_media -----
create table if not exists listing_media (
  id          uuid        primary key default gen_random_uuid(),
  listing_id  uuid        not null references listings(id) on delete cascade,
  url         text        not null,
  sort_order  int         not null default 0,
  created_at  timestamptz default now()
);

-- ----- leads -----
create table if not exists leads (
  id          uuid        primary key default gen_random_uuid(),
  listing_id  uuid        not null references listings(id) on delete cascade,
  name        text        not null,
  phone       text,
  email       text,
  message     text,
  created_at  timestamptz default now()
);

-- 3) Índices
create index if not exists idx_listings_op            on listings(op);
create index if not exists idx_listings_province      on listings(province);
create index if not exists idx_listings_city          on listings(city);
create index if not exists idx_listings_property_type on listings(property_type);
create index if not exists idx_listings_price         on listings(price);
create index if not exists idx_listings_created_at    on listings(created_at desc);
create index if not exists idx_listing_media_lid      on listing_media(listing_id);
create index if not exists idx_leads_lid              on leads(listing_id);

-- =============================================================
-- 4) RLS
-- =============================================================
alter table listings      enable row level security;
alter table listing_media  enable row level security;
alter table leads          enable row level security;

-- listings: SELECT sólo status='active'
create policy "anon_read_active_listings"
  on listings for select
  to anon, authenticated
  using (status = 'active');

-- listing_media: SELECT sólo si la listing está active
create policy "anon_read_active_media"
  on listing_media for select
  to anon, authenticated
  using (
    exists (
      select 1 from listings
      where listings.id = listing_media.listing_id
        and listings.status = 'active'
    )
  );

-- leads: INSERT para anon (formulario de contacto)
create policy "anon_insert_leads"
  on leads for insert
  to anon, authenticated
  with check (true);

-- leads: SELECT denegado por defecto (no policy = no access)
-- Fase siguiente: agregar policy para usuarios autenticados dueños de la listing.

-- listings: INSERT/UPDATE/DELETE para authenticated (fase siguiente)
-- create policy "auth_manage_own_listings"
--   on listings for all
--   to authenticated
--   using (auth.uid() = owner_id)
--   with check (auth.uid() = owner_id);

-- =============================================================
-- 5) SEED DATA — 15 propiedades + media
-- =============================================================

-- Usamos IDs explícitos para luego referenciar en listing_media
insert into listings (id, op, title, price, currency, province, city, location_text, property_type, bedrooms, bathrooms, area_m2, badge, description) values
  ('a0000001-0001-4000-8000-000000000001', 'buy',  'Torre Alvear Puerto Madero',       450000,  'USD', 'CABA',         'Puerto Madero',   'Puerto Madero, CABA',           'departamento', 2, 2, 120, 'Nuevo Ingreso', 'Espectacular departamento de 120m² en Torre Alvear, Puerto Madero. Dos dormitorios en suite con vestidor, living-comedor con vista panorámica al río, cocina integrada con electrodomésticos de alta gama. Amenities de primer nivel: pileta climatizada, gimnasio, sauna, salón de eventos. Cochera y baulera incluidos.'),
  ('a0000001-0001-4000-8000-000000000002', 'buy',  'Casa al Río Nordelta',              890000,  'USD', 'Buenos Aires', 'Nordelta',        'Barrio El Yacht, Nordelta',     'casa',         4, 4, 450, 'Oportunidad',   'Imponente casa de 450m² sobre el río en el exclusivo barrio El Yacht de Nordelta. Cuatro suites, living-comedor con doble altura, cocina gourmet, estudio, sala de cine. Pileta infinita con vista al río, muelle propio, jardín parquizado. Seguridad 24hs.'),
  ('a0000001-0001-4000-8000-000000000003', 'buy',  'Loft Moderno San Telmo',            185000,  'USD', 'CABA',         'San Telmo',       'San Telmo, CABA',               'departamento', 1, 1,  75, 'Destacado',     'Loft de diseño en el corazón de San Telmo. Techos altos de 4 metros, vigas de madera originales, piso de cemento alisado. Planta baja con living-cocina integrada; entrepiso con dormitorio y baño completo. Ideal para profesionales jóvenes.'),
  ('a0000001-0001-4000-8000-000000000004', 'buy',  'Departamento Palermo Hollywood',    320000,  'USD', 'CABA',         'Palermo',         'Palermo, CABA',                 'departamento', 2, 1,  95, 'Nuevo',         'Moderno dos ambientes en Palermo Hollywood. Excelente luminosidad, balcón aterrazado con parrilla, cocina americana. Edificio de categoría con pileta, solarium y SUM. A metros de Av. Juan B. Justo y transporte público.'),
  ('a0000001-0001-4000-8000-000000000005', 'buy',  'Chalet Country Pilar',              680000,  'USD', 'Buenos Aires', 'Pilar',           'Pilará, Pilar',                 'casa',         5, 4, 380, 'Premium',       'Chalet de 380m² en el country Pilará de Pilar. Cinco dormitorios, escritorio, sala de juegos, living-comedor con hogar a leña. Jardín de 1200m² con pileta y quincho. Seguridad 24hs, cancha de golf y tenis.'),
  ('a0000001-0001-4000-8000-000000000006', 'buy',  'PH Reciclado Belgrano',             275000,  'USD', 'CABA',         'Belgrano',        'Belgrano R, CABA',              'ph',           3, 2, 110, 'Reciclado',     'PH reciclado a nuevo en Belgrano R. Tres dormitorios, dos baños, terraza propia de 30m². Pisos de madera, carpintería de aluminio, calefacción central. Zona residencial arbolada, a cuadras de Av. Cabildo.'),
  ('a0000001-0001-4000-8000-000000000007', 'rent', 'Monoambiente Recoleta',             350000,  'ARS', 'CABA',         'Recoleta',        'Recoleta, CABA',                'departamento', 1, 1,  38, 'Alquiler',      'Luminoso monoambiente divisible en Recoleta. Cocina integrada, baño completo, balcón francés. Edificio con seguridad 24hs y laundry. Excelente ubicación a metros de la Facultad de Derecho y Plaza Francia.'),
  ('a0000001-0001-4000-8000-000000000008', 'rent', 'Departamento 3 Amb Caballito',      450000,  'ARS', 'CABA',         'Caballito',       'Caballito, CABA',               'departamento', 2, 1,  85, 'Alquiler',      'Tres ambientes amplio en Caballito. Dos dormitorios, living-comedor, cocina separada, lavadero independiente. Piso alto con mucha luz. A cuadras del Parque Rivadavia y subte A. Ideal familia.'),
  ('a0000001-0001-4000-8000-000000000009', 'temp', 'Dúplex Temporario Palermo',             120, 'USD', 'CABA',         'Palermo Soho',    'Palermo Soho, CABA',            'departamento', 1, 1,  65, 'Temporario',    'Dúplex totalmente amoblado y equipado en la mejor zona de Palermo Soho. Planta baja con living-cocina, planta alta con dormitorio en suite. WiFi, Smart TV, ropa de cama y cocina completa. Alquiler mínimo 3 noches.'),
  ('a0000001-0001-4000-8000-000000000010', 'temp', 'Estudio Temporario Microcentro',          85, 'USD', 'CABA',         'Microcentro',     'Microcentro, CABA',             'departamento', 1, 1,  30, 'Temporario',    'Estudio amoblado en pleno centro porteño. Ideal para viajeros de negocios o turistas. Kitchenette equipada, WiFi de alta velocidad, ropa blanca incluida. A pasos de Av. Corrientes y Florida.'),
  ('a0000001-0001-4000-8000-000000000011', 'buy',  'Casa Quinta Tigre',                 520000,  'USD', 'Buenos Aires', 'Tigre',           'Tigre, Buenos Aires',           'casa',         4, 3, 350, 'Exclusivo',     'Espléndida casa quinta en Tigre con acceso al río. Cuatro dormitorios, living con hogar, quincho con parrilla, pileta de natación, muelle propio. Terreno de 2000m² parquizado. Ideal como residencia permanente o casa de fin de semana.'),
  ('a0000001-0001-4000-8000-000000000012', 'buy',  'Oficina Premium Catalinas',         950000,  'USD', 'CABA',         'Catalinas',       'Catalinas, CABA',               'oficina',      0, 2, 200, 'Comercial',     'Oficina de categoría AAA en el complejo Catalinas. 200m² de planta libre con vista al río. Piso técnico, aire acondicionado central, sistema de seguridad. Edificio inteligente con cocheras en subsuelo.'),
  ('a0000001-0001-4000-8000-000000000013', 'buy',  'Penthouse Recoleta',               1200000,  'USD', 'CABA',         'Recoleta',        'Recoleta, CABA',                'departamento', 4, 3, 280, 'Exclusivo',     'Penthouse de 280m² con terraza de 100m² y vista 360° en Recoleta. Cuatro suites, living-comedor con doble altura, bodega climatizada, dependencia de servicio completa. Tres cocheras y baulera.'),
  ('a0000001-0001-4000-8000-000000000014', 'buy',  'Casa Barrio Cerrado San Isidro',    750000,  'USD', 'Buenos Aires', 'San Isidro',      'La Horqueta, San Isidro',       'casa',         4, 3, 320, 'Premium',       'Casa de 320m² en barrio cerrado de La Horqueta, San Isidro. Cuatro dormitorios en suite, playroom, piscina climatizada. Amplio jardín con riego automático. Seguridad 24hs, club house.'),
  ('a0000001-0001-4000-8000-000000000015', 'rent', 'Departamento Núñez',                380000,  'ARS', 'CABA',         'Núñez',           'Núñez, CABA',                   'departamento', 2, 1,  70, 'Alquiler',      'Dos ambientes luminoso en Núñez. Living-comedor con balcón, dormitorio con placard. Cocina separada. Edificio con laundry y terraza común. A 5 cuadras de Av. Cabildo y estación de tren.');

-- Media (2–3 imágenes por listing)
insert into listing_media (listing_id, url, sort_order) values
  ('a0000001-0001-4000-8000-000000000001', '/images/interior.png', 0),
  ('a0000001-0001-4000-8000-000000000001', '/images/exterior.png', 1),

  ('a0000001-0001-4000-8000-000000000002', '/images/exterior.png', 0),
  ('a0000001-0001-4000-8000-000000000002', '/images/interior.png', 1),

  ('a0000001-0001-4000-8000-000000000003', '/images/interior.png', 0),
  ('a0000001-0001-4000-8000-000000000003', '/images/exterior.png', 1),

  ('a0000001-0001-4000-8000-000000000004', '/images/exterior.png', 0),
  ('a0000001-0001-4000-8000-000000000004', '/images/interior.png', 1),

  ('a0000001-0001-4000-8000-000000000005', '/images/exterior.png', 0),
  ('a0000001-0001-4000-8000-000000000005', '/images/interior.png', 1),
  ('a0000001-0001-4000-8000-000000000005', '/images/exterior.png', 2),

  ('a0000001-0001-4000-8000-000000000006', '/images/interior.png', 0),
  ('a0000001-0001-4000-8000-000000000006', '/images/exterior.png', 1),

  ('a0000001-0001-4000-8000-000000000007', '/images/interior.png', 0),
  ('a0000001-0001-4000-8000-000000000007', '/images/exterior.png', 1),

  ('a0000001-0001-4000-8000-000000000008', '/images/exterior.png', 0),
  ('a0000001-0001-4000-8000-000000000008', '/images/interior.png', 1),

  ('a0000001-0001-4000-8000-000000000009', '/images/interior.png', 0),
  ('a0000001-0001-4000-8000-000000000009', '/images/exterior.png', 1),
  ('a0000001-0001-4000-8000-000000000009', '/images/interior.png', 2),

  ('a0000001-0001-4000-8000-000000000010', '/images/exterior.png', 0),
  ('a0000001-0001-4000-8000-000000000010', '/images/interior.png', 1),

  ('a0000001-0001-4000-8000-000000000011', '/images/exterior.png', 0),
  ('a0000001-0001-4000-8000-000000000011', '/images/interior.png', 1),
  ('a0000001-0001-4000-8000-000000000011', '/images/exterior.png', 2),

  ('a0000001-0001-4000-8000-000000000012', '/images/interior.png', 0),
  ('a0000001-0001-4000-8000-000000000012', '/images/exterior.png', 1),

  ('a0000001-0001-4000-8000-000000000013', '/images/interior.png', 0),
  ('a0000001-0001-4000-8000-000000000013', '/images/exterior.png', 1),
  ('a0000001-0001-4000-8000-000000000013', '/images/interior.png', 2),

  ('a0000001-0001-4000-8000-000000000014', '/images/exterior.png', 0),
  ('a0000001-0001-4000-8000-000000000014', '/images/interior.png', 1),
  ('a0000001-0001-4000-8000-000000000014', '/images/exterior.png', 2),

  ('a0000001-0001-4000-8000-000000000015', '/images/interior.png', 0),
  ('a0000001-0001-4000-8000-000000000015', '/images/exterior.png', 1);
