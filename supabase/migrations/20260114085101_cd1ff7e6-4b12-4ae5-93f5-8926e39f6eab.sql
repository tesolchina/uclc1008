-- Create table for pending teacher/staff requests
CREATE TABLE public.pending_teacher_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  sections TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.pending_teacher_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a request (anonymous insert)
CREATE POLICY "Anyone can submit teacher request"
ON public.pending_teacher_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (status = 'pending');

-- Only admins can view all requests
CREATE POLICY "Admins can view all requests"
ON public.pending_teacher_requests
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can update requests
CREATE POLICY "Admins can update requests"
ON public.pending_teacher_requests
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete requests
CREATE POLICY "Admins can delete requests"
ON public.pending_teacher_requests
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add index for faster lookups
CREATE INDEX idx_pending_teacher_requests_email ON public.pending_teacher_requests(email);
CREATE INDEX idx_pending_teacher_requests_status ON public.pending_teacher_requests(status);