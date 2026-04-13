ALTER TABLE public.leads ADD COLUMN province text NOT NULL DEFAULT '';
ALTER TABLE public.leads ADD COLUMN contacted boolean NOT NULL DEFAULT false;
ALTER TABLE public.leads ADD COLUMN tags text[] NOT NULL DEFAULT '{}';