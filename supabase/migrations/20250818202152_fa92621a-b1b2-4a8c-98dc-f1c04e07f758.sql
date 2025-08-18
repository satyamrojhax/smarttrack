-- Ensure we have the correct subjects table structure
-- Drop the problematic subjects table and recreate with proper structure
DROP TABLE IF EXISTS subjects CASCADE;

-- Rename subjects_old to subjects to be the main table
ALTER TABLE subjects_old RENAME TO subjects;

-- Recreate chapters table to reference the correct subjects table
ALTER TABLE chapters DROP CONSTRAINT IF EXISTS chapters_subject_id_fkey;
ALTER TABLE chapters ADD CONSTRAINT chapters_subject_id_fkey 
    FOREIGN KEY (subject_id) REFERENCES subjects(id);

-- Create RLS policies for subjects table
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Subjects can be viewed by all" 
ON subjects FOR SELECT 
USING (true);

CREATE POLICY "Authenticated can insert subjects" 
ON subjects FOR INSERT 
WITH CHECK (true);

-- Create RLS policies for chapters table  
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Chapters can be viewed by all" 
ON chapters FOR SELECT 
USING (true);

CREATE POLICY "Authenticated can insert chapters" 
ON chapters FOR INSERT 
WITH CHECK (true);

-- Insert Information Technology - 402 subject
INSERT INTO subjects (name, icon, color, class, board, subject_type, created_at) 
VALUES (
    'Information Technology - 402', 
    '💻', 
    'from-blue-400 to-purple-600', 
    'class-12', 
    'cbse', 
    'optional',
    now()
);

-- Insert Grammar subject  
INSERT INTO subjects (name, icon, color, class, board, subject_type, created_at) 
VALUES (
    'Grammar', 
    '📝', 
    'from-green-400 to-teal-600', 
    'class-12', 
    'cbse', 
    'core',
    now()
);

-- Get the subject IDs for inserting chapters
DO $$
DECLARE
    it_subject_id uuid;
    grammar_subject_id uuid;
BEGIN
    -- Get Information Technology subject ID
    SELECT id INTO it_subject_id 
    FROM subjects 
    WHERE name = 'Information Technology - 402';
    
    -- Get Grammar subject ID  
    SELECT id INTO grammar_subject_id 
    FROM subjects 
    WHERE name = 'Grammar';
    
    -- Insert Information Technology chapters
    INSERT INTO chapters (subject_id, name, order_index, created_at) VALUES
    (it_subject_id, 'Communication Skills-I', 1, now()),
    (it_subject_id, 'Self-Management Skills-I', 2, now()),
    (it_subject_id, 'Basic Information and Communication Technology Skills-I', 3, now()),
    (it_subject_id, 'Entrepreneurial Skills-I', 4, now()),
    (it_subject_id, 'Green Skills-I', 5, now()),
    (it_subject_id, 'Digital Documentation (Advanced) using LibreOffice Writer', 6, now()),
    (it_subject_id, 'Electronic Spreadsheet (Advanced) using LibreOffice Calc', 7, now()),
    (it_subject_id, 'Database Management System using LibreOffice Base', 8, now()),
    (it_subject_id, 'Maintain Healthy, Safe and Secure Working Environment', 9, now()),
    (it_subject_id, 'Digital Documentation (Advanced) using LibreOffice Writer [Practical]', 10, now()),
    (it_subject_id, 'Electronic Spreadsheet (Advanced) using LibreOffice Calc [Practical]', 11, now()),
    (it_subject_id, 'Database Management System using LibreOffice Base [Practical]', 12, now()),
    (it_subject_id, 'Viva Voce', 13, now()),
    (it_subject_id, 'Project Work/Field Visit (Case Study, Reports in Base, Documentation in Writer)', 14, now()),
    (it_subject_id, 'Portfolio/Practical File (Printouts of 5 problems each from Writer, Calc, Base)', 15, now());
    
    -- Insert Grammar chapters
    INSERT INTO chapters (subject_id, name, order_index, created_at) VALUES
    (grammar_subject_id, 'Determiners', 1, now()),
    (grammar_subject_id, 'Tenses', 2, now()),
    (grammar_subject_id, 'Modals', 3, now()),
    (grammar_subject_id, 'Subject– verb concord', 4, now()),
    (grammar_subject_id, 'Reported speech', 5, now()),
    (grammar_subject_id, 'Commands and requests', 6, now()),
    (grammar_subject_id, 'Statements', 7, now()),
    (grammar_subject_id, 'Questions', 8, now()),
    (grammar_subject_id, 'Gap Filling / Editing / Transformation', 9, now()),
    (grammar_subject_id, 'रचना के आधार पर वाक्य भेद', 10, now()),
    (grammar_subject_id, 'वाच्य', 11, now()),
    (grammar_subject_id, 'पद परिचय', 12, now()),
    (grammar_subject_id, 'अलंकार', 13, now());
END $$;