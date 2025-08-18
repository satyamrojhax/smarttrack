-- Add new enum values for subject_type (first migration)
ALTER TYPE subject_type ADD VALUE IF NOT EXISTS 'core';
ALTER TYPE subject_type ADD VALUE IF NOT EXISTS 'elective'; 
ALTER TYPE subject_type ADD VALUE IF NOT EXISTS 'information-technology';
ALTER TYPE subject_type ADD VALUE IF NOT EXISTS 'grammar';