-- Migration: expand internship_applications for full online application form
ALTER TABLE internship_applications
  ADD COLUMN IF NOT EXISTS college_university VARCHAR(255),
  ADD COLUMN IF NOT EXISTS current_year_semester VARCHAR(100),
  ADD COLUMN IF NOT EXISTS areas_of_interest TEXT,
  ADD COLUMN IF NOT EXISTS cover_letter TEXT,
  ADD COLUMN IF NOT EXISTS resume_filename VARCHAR(255),
  ADD COLUMN IF NOT EXISTS resume_path TEXT;
