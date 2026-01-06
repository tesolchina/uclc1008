-- Internal staff collaboration tables for UCLC1008

-- Threads where Simon and Naina discuss topics and decisions
CREATE TABLE IF NOT EXISTS public.staff_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  is_decided boolean NOT NULL DEFAULT false,
  decided_summary text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Comments inside a thread
CREATE TABLE IF NOT EXISTS public.staff_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES public.staff_threads(id) ON DELETE CASCADE,
  author_name text,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Teaching materials attached to a thread, with original text and Markdown version
CREATE TABLE IF NOT EXISTS public.staff_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES public.staff_threads(id) ON DELETE CASCADE,
  title text NOT NULL,
  original_content text,
  markdown_content text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Shared function to keep updated_at in sync
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for automatic updated_at management
CREATE TRIGGER set_staff_threads_updated_at
BEFORE UPDATE ON public.staff_threads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_staff_materials_updated_at
BEFORE UPDATE ON public.staff_materials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security with permissive policies for now
ALTER TABLE public.staff_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_materials ENABLE ROW LEVEL SECURITY;

-- Threads policies (temporarily open; UI password provides basic separation)
CREATE POLICY "staff_threads_select_all"
ON public.staff_threads
FOR SELECT
USING (true);

CREATE POLICY "staff_threads_insert_all"
ON public.staff_threads
FOR INSERT
WITH CHECK (true);

CREATE POLICY "staff_threads_update_all"
ON public.staff_threads
FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "staff_threads_delete_all"
ON public.staff_threads
FOR DELETE
USING (true);

-- Comments policies
CREATE POLICY "staff_comments_select_all"
ON public.staff_comments
FOR SELECT
USING (true);

CREATE POLICY "staff_comments_insert_all"
ON public.staff_comments
FOR INSERT
WITH CHECK (true);

CREATE POLICY "staff_comments_update_all"
ON public.staff_comments
FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "staff_comments_delete_all"
ON public.staff_comments
FOR DELETE
USING (true);

-- Materials policies
CREATE POLICY "staff_materials_select_all"
ON public.staff_materials
FOR SELECT
USING (true);

CREATE POLICY "staff_materials_insert_all"
ON public.staff_materials
FOR INSERT
WITH CHECK (true);

CREATE POLICY "staff_materials_update_all"
ON public.staff_materials
FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "staff_materials_delete_all"
ON public.staff_materials
FOR DELETE
USING (true);