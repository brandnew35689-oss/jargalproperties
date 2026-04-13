-- Add bilingual columns to properties
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS title_mn text;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS description_mn text;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS is_dubai boolean NOT NULL DEFAULT false;

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert contact messages"
  ON public.contact_messages FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Admins can view contact messages"
  ON public.contact_messages FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));