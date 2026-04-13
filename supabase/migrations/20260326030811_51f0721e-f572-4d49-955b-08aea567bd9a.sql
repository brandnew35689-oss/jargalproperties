
-- Create storage bucket for property images
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true);

-- Anyone can view property images
CREATE POLICY "Anyone can view property images"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-images');

-- Admins can upload property images
CREATE POLICY "Admins can upload property images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'property-images'
  AND public.has_role(auth.uid(), 'admin')
);

-- Admins can update property images
CREATE POLICY "Admins can update property images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'property-images'
  AND public.has_role(auth.uid(), 'admin')
);

-- Admins can delete property images
CREATE POLICY "Admins can delete property images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'property-images'
  AND public.has_role(auth.uid(), 'admin')
);
