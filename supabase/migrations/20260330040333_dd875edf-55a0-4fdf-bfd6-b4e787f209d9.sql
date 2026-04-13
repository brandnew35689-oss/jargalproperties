ALTER TABLE public.properties ADD COLUMN country text NOT NULL DEFAULT 'Mongolia';

UPDATE public.properties SET country = 'UAE' WHERE is_dubai = true;
UPDATE public.properties SET country = 'Mongolia' WHERE is_dubai = false;