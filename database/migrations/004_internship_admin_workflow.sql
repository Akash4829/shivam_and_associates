-- Migration: internship review workflow for admin panel
ALTER TABLE internship_applications
  ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Pending',
  ADD COLUMN IF NOT EXISTS admin_notes TEXT,
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL;

UPDATE internship_applications
SET status = 'Pending'
WHERE status IS NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'internship_status_check'
  ) THEN
    ALTER TABLE internship_applications
      ADD CONSTRAINT internship_status_check
      CHECK (status IN ('Pending', 'Shortlisted', 'Approved', 'Rejected'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_internship_status ON internship_applications (status);
