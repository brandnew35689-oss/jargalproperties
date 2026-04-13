ALTER TABLE public.properties ADD COLUMN status text NOT NULL DEFAULT 'available';

UPDATE public.properties SET status = 'available' WHERE status IS NULL OR status = '';