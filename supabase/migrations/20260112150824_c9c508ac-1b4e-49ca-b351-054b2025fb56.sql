-- =====================================================
-- FIX: Replace open RLS policies with teacher/admin role-based policies
-- This addresses the PUBLIC_DATA_EXPOSURE security finding
-- =====================================================

-- Drop existing permissive policies on staff_threads
DROP POLICY IF EXISTS "staff_threads_select_all" ON public.staff_threads;
DROP POLICY IF EXISTS "staff_threads_insert_all" ON public.staff_threads;
DROP POLICY IF EXISTS "staff_threads_update_all" ON public.staff_threads;
DROP POLICY IF EXISTS "staff_threads_delete_all" ON public.staff_threads;
DROP POLICY IF EXISTS "Anyone can view staff threads" ON public.staff_threads;
DROP POLICY IF EXISTS "Anyone can create staff threads" ON public.staff_threads;
DROP POLICY IF EXISTS "Anyone can update staff threads" ON public.staff_threads;
DROP POLICY IF EXISTS "Anyone can delete staff threads" ON public.staff_threads;

-- Drop existing permissive policies on staff_comments
DROP POLICY IF EXISTS "staff_comments_select_all" ON public.staff_comments;
DROP POLICY IF EXISTS "staff_comments_insert_all" ON public.staff_comments;
DROP POLICY IF EXISTS "staff_comments_update_all" ON public.staff_comments;
DROP POLICY IF EXISTS "staff_comments_delete_all" ON public.staff_comments;
DROP POLICY IF EXISTS "Anyone can view staff comments" ON public.staff_comments;
DROP POLICY IF EXISTS "Anyone can create staff comments" ON public.staff_comments;
DROP POLICY IF EXISTS "Anyone can update staff comments" ON public.staff_comments;
DROP POLICY IF EXISTS "Anyone can delete staff comments" ON public.staff_comments;

-- Drop existing permissive policies on staff_materials
DROP POLICY IF EXISTS "staff_materials_select_all" ON public.staff_materials;
DROP POLICY IF EXISTS "staff_materials_insert_all" ON public.staff_materials;
DROP POLICY IF EXISTS "staff_materials_update_all" ON public.staff_materials;
DROP POLICY IF EXISTS "staff_materials_delete_all" ON public.staff_materials;
DROP POLICY IF EXISTS "Anyone can view staff materials" ON public.staff_materials;
DROP POLICY IF EXISTS "Anyone can create staff materials" ON public.staff_materials;
DROP POLICY IF EXISTS "Anyone can update staff materials" ON public.staff_materials;
DROP POLICY IF EXISTS "Anyone can delete staff materials" ON public.staff_materials;

-- Drop existing permissive policies on staff_library_folders
DROP POLICY IF EXISTS "staff_library_folders_select_all" ON public.staff_library_folders;
DROP POLICY IF EXISTS "staff_library_folders_insert_all" ON public.staff_library_folders;
DROP POLICY IF EXISTS "staff_library_folders_update_all" ON public.staff_library_folders;
DROP POLICY IF EXISTS "staff_library_folders_delete_all" ON public.staff_library_folders;
DROP POLICY IF EXISTS "Anyone can view staff library folders" ON public.staff_library_folders;
DROP POLICY IF EXISTS "Anyone can create staff library folders" ON public.staff_library_folders;
DROP POLICY IF EXISTS "Anyone can update staff library folders" ON public.staff_library_folders;
DROP POLICY IF EXISTS "Anyone can delete staff library folders" ON public.staff_library_folders;

-- Drop existing permissive policies on staff_library_files
DROP POLICY IF EXISTS "staff_library_files_select_all" ON public.staff_library_files;
DROP POLICY IF EXISTS "staff_library_files_insert_all" ON public.staff_library_files;
DROP POLICY IF EXISTS "staff_library_files_update_all" ON public.staff_library_files;
DROP POLICY IF EXISTS "staff_library_files_delete_all" ON public.staff_library_files;
DROP POLICY IF EXISTS "Anyone can view staff library files" ON public.staff_library_files;
DROP POLICY IF EXISTS "Anyone can create staff library files" ON public.staff_library_files;
DROP POLICY IF EXISTS "Anyone can update staff library files" ON public.staff_library_files;
DROP POLICY IF EXISTS "Anyone can delete staff library files" ON public.staff_library_files;

-- Create new role-based policies for staff_threads
CREATE POLICY "Teachers and admins can manage staff threads"
ON public.staff_threads FOR ALL
USING (
  has_role(auth.uid(), 'teacher') OR 
  has_role(auth.uid(), 'admin')
)
WITH CHECK (
  has_role(auth.uid(), 'teacher') OR 
  has_role(auth.uid(), 'admin')
);

-- Create new role-based policies for staff_comments
CREATE POLICY "Teachers and admins can manage staff comments"
ON public.staff_comments FOR ALL
USING (
  has_role(auth.uid(), 'teacher') OR 
  has_role(auth.uid(), 'admin')
)
WITH CHECK (
  has_role(auth.uid(), 'teacher') OR 
  has_role(auth.uid(), 'admin')
);

-- Create new role-based policies for staff_materials
CREATE POLICY "Teachers and admins can manage staff materials"
ON public.staff_materials FOR ALL
USING (
  has_role(auth.uid(), 'teacher') OR 
  has_role(auth.uid(), 'admin')
)
WITH CHECK (
  has_role(auth.uid(), 'teacher') OR 
  has_role(auth.uid(), 'admin')
);

-- Create new role-based policies for staff_library_folders
CREATE POLICY "Teachers and admins can manage staff library folders"
ON public.staff_library_folders FOR ALL
USING (
  has_role(auth.uid(), 'teacher') OR 
  has_role(auth.uid(), 'admin')
)
WITH CHECK (
  has_role(auth.uid(), 'teacher') OR 
  has_role(auth.uid(), 'admin')
);

-- Create new role-based policies for staff_library_files
CREATE POLICY "Teachers and admins can manage staff library files"
ON public.staff_library_files FOR ALL
USING (
  has_role(auth.uid(), 'teacher') OR 
  has_role(auth.uid(), 'admin')
)
WITH CHECK (
  has_role(auth.uid(), 'teacher') OR 
  has_role(auth.uid(), 'admin')
);