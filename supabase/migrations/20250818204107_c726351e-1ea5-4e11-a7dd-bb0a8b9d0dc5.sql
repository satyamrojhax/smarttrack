-- Remove duplicate chapters in English - First Flight
-- Keep only one copy of each duplicate chapter

-- Remove duplicate "A Tiger in the Zoo" 
DELETE FROM chapters 
WHERE id = '58fb0ce7-30e6-4458-8072-8cf4c9571112'
AND subject_id = (SELECT id FROM subjects WHERE name = 'English - First Flight');

-- Remove duplicate "How to Tell Wild Animals"
DELETE FROM chapters 
WHERE id = '4ba1384a-8ac4-4290-a981-befd57eb6b8e'
AND subject_id = (SELECT id FROM subjects WHERE name = 'English - First Flight');

-- Remove duplicate "The Ball Poem"
DELETE FROM chapters 
WHERE id = 'b2874680-cafa-40c8-9c3a-ebbda2cc5c1b'
AND subject_id = (SELECT id FROM subjects WHERE name = 'English - First Flight');

-- Remove duplicate "Amanda!"
DELETE FROM chapters 
WHERE id = '41b62de1-e14d-4177-970c-e81cc3296faa'
AND subject_id = (SELECT id FROM subjects WHERE name = 'English - First Flight');

-- Remove duplicate "The Trees"
DELETE FROM chapters 
WHERE id = 'c817c492-e10c-47bd-9c61-c37fa2e886ac'
AND subject_id = (SELECT id FROM subjects WHERE name = 'English - First Flight');

-- Remove duplicate "Fog"
DELETE FROM chapters 
WHERE id = '650b8a0f-b941-41e4-9ceb-dcbd0a116904'
AND subject_id = (SELECT id FROM subjects WHERE name = 'English - First Flight');

-- Remove duplicate "The Tale of Custard the Dragon"
DELETE FROM chapters 
WHERE id = 'ef7736f2-c7af-41c5-a0b9-9870d9a488db'
AND subject_id = (SELECT id FROM subjects WHERE name = 'English - First Flight');

-- Remove duplicate "For Anne Gregory"
DELETE FROM chapters 
WHERE id = '89ae5866-a2a5-44e4-98fc-ee7bacf76f80'
AND subject_id = (SELECT id FROM subjects WHERE name = 'English - First Flight');