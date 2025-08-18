-- Update Information Technology - 402 chapters with shorter names
UPDATE chapters 
SET name = CASE order_index
  WHEN 1 THEN 'Communication Skills'
  WHEN 2 THEN 'Self-Management Skills'
  WHEN 3 THEN 'ICT Skills'
  WHEN 4 THEN 'Entrepreneurial Skills'
  WHEN 5 THEN 'Green Skills'
  WHEN 6 THEN 'Digital Documentation (Writer)'
  WHEN 7 THEN 'Spreadsheet (Calc)'
  WHEN 8 THEN 'Database Management (Base)'
  WHEN 9 THEN 'Healthy & Safe Environment'
  WHEN 10 THEN 'Documentation Practical (Writer)'
  WHEN 11 THEN 'Spreadsheet Practical (Calc)'
  WHEN 12 THEN 'Database Practical (Base)'
  WHEN 13 THEN 'Viva'
  WHEN 14 THEN 'Project Work / Field Visit'
  WHEN 15 THEN 'Portfolio / Practical File'
END
WHERE subject_id = (
  SELECT id FROM subjects WHERE name = 'Information Technology - 402'
) AND order_index BETWEEN 1 AND 15;