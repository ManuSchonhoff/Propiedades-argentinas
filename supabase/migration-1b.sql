-- =============================================================
-- MIGRATION 1B: Auth + Owner + Storage
-- Ejecutar DESPUÉS de schema.sql en Supabase SQL Editor
-- =============================================================

-- 1) Agregar owner_id a listings
ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES auth.users(id);

CREATE INDEX IF NOT EXISTS idx_listings_owner ON listings(owner_id);

-- 2) RLS: authenticated puede gestionar sus propias listings
CREATE POLICY "auth_insert_own_listings"
  ON listings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "auth_update_own_listings"
  ON listings FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "auth_delete_own_listings"
  ON listings FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- 3) listing_media: authenticated puede gestionar media de sus listings
CREATE POLICY "auth_insert_own_media"
  ON listing_media FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = listing_media.listing_id
        AND listings.owner_id = auth.uid()
    )
  );

CREATE POLICY "auth_delete_own_media"
  ON listing_media FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = listing_media.listing_id
        AND listings.owner_id = auth.uid()
    )
  );

-- 4) Storage bucket para imágenes de propiedades
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT DO NOTHING;

-- Storage: authenticated puede subir
CREATE POLICY "auth_upload_property_images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'property-images');

-- Storage: público puede leer
CREATE POLICY "public_read_property_images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'property-images');

-- Storage: authenticated puede borrar sus propios uploads
CREATE POLICY "auth_delete_own_uploads"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'property-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
