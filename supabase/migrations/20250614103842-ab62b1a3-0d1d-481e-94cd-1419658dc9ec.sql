
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE app_role AS ENUM ('student', 'teacher', 'admin');
CREATE TYPE board_type AS ENUM ('cbse', 'icse', 'state');
CREATE TYPE class_level AS ENUM ('class-9', 'class-10', 'class-11', 'class-12');
CREATE TYPE subject_type AS ENUM ('mathematics', 'science', 'social-science', 'english-first-flight', 'english-footprints', 'hindi');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  class class_level NOT NULL,
  board board_type NOT NULL,
  role app_role DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subjects table
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject_type subject_type NOT NULL,
  icon TEXT NOT NULL DEFAULT '📚',
  color TEXT NOT NULL DEFAULT 'from-blue-400 to-blue-600',
  class class_level NOT NULL,
  board board_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chapters table
CREATE TABLE public.chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_progress table to track syllabus completion
CREATE TABLE public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, chapter_id)
);

-- Create questions table
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB, -- For MCQ options
  correct_answer TEXT,
  explanation TEXT,
  difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
  question_type TEXT DEFAULT 'mcq' CHECK (question_type IN ('mcq', 'short', 'long')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_bookmarks table
CREATE TABLE public.user_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- Create doubts table
CREATE TABLE public.doubts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'answered', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create doubt_responses table
CREATE TABLE public.doubt_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doubt_id UUID REFERENCES public.doubts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  response_text TEXT NOT NULL,
  is_ai_response BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doubts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doubt_responses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for subjects (public read)
CREATE POLICY "Anyone can view subjects" ON public.subjects
  FOR SELECT TO authenticated USING (true);

-- Create RLS policies for chapters (public read)
CREATE POLICY "Anyone can view chapters" ON public.chapters
  FOR SELECT TO authenticated USING (true);

-- Create RLS policies for user_progress
CREATE POLICY "Users can view own progress" ON public.user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for questions (public read)
CREATE POLICY "Anyone can view questions" ON public.questions
  FOR SELECT TO authenticated USING (true);

-- Create RLS policies for bookmarks
CREATE POLICY "Users can view own bookmarks" ON public.user_bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks" ON public.user_bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks" ON public.user_bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for doubts
CREATE POLICY "Users can view own doubts" ON public.doubts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own doubts" ON public.doubts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own doubts" ON public.doubts
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for doubt responses
CREATE POLICY "Users can view doubt responses" ON public.doubt_responses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.doubts 
      WHERE doubts.id = doubt_responses.doubt_id 
      AND doubts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert doubt responses" ON public.doubt_responses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, class, board)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'class')::class_level, 'class-10'),
    COALESCE((NEW.raw_user_meta_data->>'board')::board_type, 'cbse')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default subjects and chapters for CBSE Class 10
INSERT INTO public.subjects (name, subject_type, icon, color, class, board) VALUES
  ('Mathematics', 'mathematics', '📊', 'from-blue-400 to-blue-600', 'class-10', 'cbse'),
  ('Science', 'science', '🔬', 'from-green-400 to-green-600', 'class-10', 'cbse'),
  ('Social Science', 'social-science', '🌍', 'from-orange-400 to-orange-600', 'class-10', 'cbse'),
  ('English - First Flight', 'english-first-flight', '📖', 'from-purple-400 to-purple-600', 'class-10', 'cbse'),
  ('English - Footprints Without Feet', 'english-footprints', '👣', 'from-pink-400 to-pink-600', 'class-10', 'cbse'),
  ('Hindi', 'hindi', '🇮🇳', 'from-yellow-400 to-yellow-600', 'class-10', 'cbse');

-- Insert Mathematics chapters
INSERT INTO public.chapters (subject_id, name, order_index)
SELECT s.id, chapter_name, row_number() OVER () - 1
FROM public.subjects s,
(VALUES 
  ('Real Numbers'),
  ('Polynomials'),
  ('Pair of Linear Equations in Two Variables'),
  ('Quadratic Equations'),
  ('Arithmetic Progressions'),
  ('Triangles'),
  ('Coordinate Geometry'),
  ('Introduction to Trigonometry'),
  ('Some Applications of Trigonometry'),
  ('Circles'),
  ('Area Related to Circles'),
  ('Surface Area and Volumes'),
  ('Statistics'),
  ('Probability')
) AS chapters(chapter_name)
WHERE s.subject_type = 'mathematics' AND s.class = 'class-10' AND s.board = 'cbse';

-- Insert Science chapters
INSERT INTO public.chapters (subject_id, name, order_index)
SELECT s.id, chapter_name, row_number() OVER () - 1
FROM public.subjects s,
(VALUES 
  ('Light - Reflection and Refraction'),
  ('Human Eye and Colourful World'),
  ('Electricity'),
  ('Magnetic Effects of Electric Current'),
  ('Life Processes'),
  ('Control and Coordination'),
  ('How do Organisms Reproduce?'),
  ('Heredity and Evolution'),
  ('Natural Resource Management'),
  ('Acids, Bases and Salts'),
  ('Metals and Non-metals'),
  ('Carbon and its Compounds'),
  ('Periodic Classification of Elements')
) AS chapters(chapter_name)
WHERE s.subject_type = 'science' AND s.class = 'class-10' AND s.board = 'cbse';

-- Insert Social Science chapters
INSERT INTO public.chapters (subject_id, name, order_index)
SELECT s.id, chapter_name, row_number() OVER () - 1
FROM public.subjects s,
(VALUES 
  ('The Rise of Nationalism in Europe'),
  ('Nationalism in India'),
  ('The Making of a Global World'),
  ('The Age of Industrialisation'),
  ('Print Culture and the Modern World'),
  ('Resources and Development'),
  ('Forest and Wildlife Resources'),
  ('Water Resources'),
  ('Agriculture'),
  ('Minerals and Energy Resources'),
  ('Manufacturing Industries'),
  ('Lifelines of National Economy'),
  ('Power Sharing'),
  ('Federalism'),
  ('Democracy and Diversity'),
  ('Gender, Religion and Caste'),
  ('Popular Struggles and Movements'),
  ('Political Parties'),
  ('Outcomes of Democracy'),
  ('Challenges to Democracy'),
  ('Development'),
  ('Sectors of the Indian Economy'),
  ('Money and Credit'),
  ('Globalisation and the Indian Economy'),
  ('Consumer Rights')
) AS chapters(chapter_name)
WHERE s.subject_type = 'social-science' AND s.class = 'class-10' AND s.board = 'cbse';

-- Insert English First Flight chapters
INSERT INTO public.chapters (subject_id, name, order_index)
SELECT s.id, chapter_name, row_number() OVER () - 1
FROM public.subjects s,
(VALUES 
  ('A Letter to God'),
  ('Nelson Mandela: Long Walk to Freedom'),
  ('Two Stories about Flying'),
  ('From the Diary of Anne Frank'),
  ('The Hundred Dresses - I'),
  ('The Hundred Dresses - II'),
  ('Glimpses of India'),
  ('Mijbil the Otter'),
  ('Madam Rides the Bus'),
  ('The Sermon at Benares'),
  ('The Proposal')
) AS chapters(chapter_name)
WHERE s.subject_type = 'english-first-flight' AND s.class = 'class-10' AND s.board = 'cbse';

-- Insert English Footprints chapters
INSERT INTO public.chapters (subject_id, name, order_index)
SELECT s.id, chapter_name, row_number() OVER () - 1
FROM public.subjects s,
(VALUES 
  ('A Triumph of Surgery'),
  ('The Thief''s Story'),
  ('The Midnight Visitor'),
  ('A Question of Trust'),
  ('Footprints without Feet'),
  ('The Making of a Scientist'),
  ('The Necklace'),
  ('The Hack Driver'),
  ('Bholi'),
  ('The Book That Saved the Earth')
) AS chapters(chapter_name)
WHERE s.subject_type = 'english-footprints' AND s.class = 'class-10' AND s.board = 'cbse';

-- Insert Hindi chapters
INSERT INTO public.chapters (subject_id, name, order_index)
SELECT s.id, chapter_name, row_number() OVER () - 1
FROM public.subjects s,
(VALUES 
  ('सूरदास के पद'),
  ('राम-लक्ष्मण-परशुराम संवाद'),
  ('नेताजी का चश्मा'),
  ('बालगोबिन भगत'),
  ('लखनवी अंदाज़'),
  ('मनुष्यता'),
  ('पर्वत प्रदेश में पावस'),
  ('तोप'),
  ('कारतूस'),
  ('बालक')
) AS chapters(chapter_name)
WHERE s.subject_type = 'hindi' AND s.class = 'class-10' AND s.board = 'cbse';
