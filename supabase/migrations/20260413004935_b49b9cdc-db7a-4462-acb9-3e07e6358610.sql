-- Add new text column for contact status
ALTER TABLE public.leads ADD COLUMN contact_status text NOT NULL DEFAULT 'no_contactado';

-- Migrate existing data
UPDATE public.leads SET contact_status = CASE WHEN contacted = true THEN 'contactado' ELSE 'no_contactado' END;

-- Drop old boolean column
ALTER TABLE public.leads DROP COLUMN contacted;