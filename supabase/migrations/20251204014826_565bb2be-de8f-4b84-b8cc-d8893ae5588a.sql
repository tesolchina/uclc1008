-- Shared staff file & folder library

-- Folders table
CREATE TABLE IF NOT EXISTS public.staff_library_folders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  parent_id uuid REFERENCES public.staff_library_folders(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Files table
CREATE TABLE IF NOT EXISTS public.staff_library_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  folder_id uuid REFERENCES public.staff_library_folders(id) ON DELETE SET NULL,
  thread_id uuid REFERENCES public.staff_threads(id) ON DELETE SET NULL,
  filename text NOT NULL,
  original_content text,
  markdown_content text,
  is_archived boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.staff_library_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_library_files ENABLE ROW LEVEL SECURITY;

-- Open policies for staff-only area (access is gated at app level)
-- staff_library_folders policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'staff_library_folders' AND policyname = 'staff_library_folders_select_all'
  ) THEN
    CREATE POLICY staff_library_folders_select_all
      ON public.staff_library_folders
      FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'staff_library_folders' AND policyname = 'staff_library_folders_insert_all'
  ) THEN
    CREATE POLICY staff_library_folders_insert_all
      ON public.staff_library_folders
      FOR INSERT
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'staff_library_folders' AND policyname = 'staff_library_folders_update_all'
  ) THEN
    CREATE POLICY staff_library_folders_update_all
      ON public.staff_library_folders
      FOR UPDATE
      USING (true)
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'staff_library_folders' AND policyname = 'staff_library_folders_delete_all'
  ) THEN
    CREATE POLICY staff_library_folders_delete_all
      ON public.staff_library_folders
      FOR DELETE
      USING (true);
  END IF;
END $$;

-- staff_library_files policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'staff_library_files' AND policyname = 'staff_library_files_select_all'
  ) THEN
    CREATE POLICY staff_library_files_select_all
      ON public.staff_library_files
      FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'staff_library_files' AND policyname = 'staff_library_files_insert_all'
  ) THEN
    CREATE POLICY staff_library_files_insert_all
      ON public.staff_library_files
      FOR INSERT
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'staff_library_files' AND policyname = 'staff_library_files_update_all'
  ) THEN
    CREATE POLICY staff_library_files_update_all
      ON public.staff_library_files
      FOR UPDATE
      USING (true)
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'staff_library_files' AND policyname = 'staff_library_files_delete_all'
  ) THEN
    CREATE POLICY staff_library_files_delete_all
      ON public.staff_library_files
      FOR DELETE
      USING (true);
  END IF;
END $$;

-- updated_at triggers
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_timestamp_staff_library_folders'
  ) THEN
    CREATE TRIGGER set_timestamp_staff_library_folders
      BEFORE UPDATE ON public.staff_library_folders
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_timestamp_staff_library_files'
  ) THEN
    CREATE TRIGGER set_timestamp_staff_library_files
      BEFORE UPDATE ON public.staff_library_files
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;