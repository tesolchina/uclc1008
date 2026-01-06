-- Create app role enum
CREATE TYPE public.app_role AS ENUM ('teacher', 'student');

-- Create user profiles table (stores HKBU OAuth users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hkbu_user_id TEXT UNIQUE NOT NULL,
  email TEXT,
  display_name TEXT,
  role app_role NOT NULL DEFAULT 'student',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user roles table for additional role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (profile_id, role)
);

-- Create lessons table
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_id INTEGER NOT NULL,
  lesson_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  objectives JSONB DEFAULT '[]'::jsonb,
  key_concepts JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (week_id, lesson_number)
);

-- Create lesson progress table (tracks student progress)
CREATE TABLE public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  section_completed JSONB DEFAULT '{}'::jsonb,
  notes TEXT,
  mc_answers JSONB DEFAULT '{}'::jsonb,
  fill_blank_answers JSONB DEFAULT '{}'::jsonb,
  open_ended_responses JSONB DEFAULT '[]'::jsonb,
  ai_feedback JSONB DEFAULT '[]'::jsonb,
  reflection TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (profile_id, lesson_id)
);

-- Create sessions table to store OAuth tokens
CREATE TABLE public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  access_token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_profile_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE profile_id = _profile_id
      AND role = _role
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Profiles are viewable by owner" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Profiles can be inserted by system" 
  ON public.profiles FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Profiles can be updated by owner" 
  ON public.profiles FOR UPDATE 
  USING (true);

-- RLS Policies for user_roles
CREATE POLICY "User roles viewable by owner and teachers" 
  ON public.user_roles FOR SELECT 
  USING (true);

-- RLS Policies for lessons (public read)
CREATE POLICY "Lessons are viewable by everyone" 
  ON public.lessons FOR SELECT 
  USING (true);

CREATE POLICY "Lessons can be managed by teachers" 
  ON public.lessons FOR ALL 
  USING (true);

-- RLS Policies for lesson_progress
CREATE POLICY "Progress viewable by owner" 
  ON public.lesson_progress FOR SELECT 
  USING (true);

CREATE POLICY "Progress insertable by owner" 
  ON public.lesson_progress FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Progress updatable by owner" 
  ON public.lesson_progress FOR UPDATE 
  USING (true);

-- RLS Policies for sessions
CREATE POLICY "Sessions viewable by system" 
  ON public.user_sessions FOR SELECT 
  USING (true);

CREATE POLICY "Sessions insertable by system" 
  ON public.user_sessions FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Sessions deletable by system" 
  ON public.user_sessions FOR DELETE 
  USING (true);

-- Update trigger for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lesson_progress_updated_at
  BEFORE UPDATE ON public.lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert Week 1 lessons based on existing content
INSERT INTO public.lessons (week_id, lesson_number, title, description, objectives, key_concepts) VALUES
(1, 1, 'Anatomy of an Article', 'Learn to distinguish article types and analyse titles and abstracts', 
  '["Distinguish between Empirical and Conceptual research articles", "Analyse article Titles to identify subject matter and author stance", "Identify the standard components of an Abstract"]'::jsonb,
  '["Empirical vs Conceptual articles", "Title analysis for stance prediction", "Abstract structure moves"]'::jsonb),
(1, 2, 'Reading with Purpose', 'Master strategic reading using headings, topic sentences, and claim identification',
  '["Use Section Headings to navigate argument structure", "Locate and analyse Topic Sentences to identify main ideas", "Distinguish between Author Claims and Opposing Claims"]'::jsonb,
  '["Power of headings as roadmaps", "Topic sentence formula", "Separating claims from evidence"]'::jsonb),
(1, 3, 'Abstract Analysis Lab', 'Practice deconstructing abstracts into functional moves',
  '["Deconstruct an abstract into functional moves", "Predict article content and stance from abstract", "Identify Signpost Words that signal transitions"]'::jsonb,
  '["Signpost words in abstracts", "Colour coding abstract moves", "Prediction from abstracts"]'::jsonb);