-- Run once on existing databases that were created before image_url existed.
ALTER TABLE case_studies
  ADD COLUMN IF NOT EXISTS image_url TEXT;
