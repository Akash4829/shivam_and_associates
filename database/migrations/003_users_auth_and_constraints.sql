-- Migration: users table, email/phone constraints, indexes
-- Run against existing databases that predate schema.sql updates

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT,
    google_id VARCHAR(255) UNIQUE,
    avatar_url TEXT,
    auth_provider VARCHAR(50) NOT NULL DEFAULT 'local',
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    email_verified BOOLEAN DEFAULT FALSE,
    reset_token_hash TEXT,
    reset_token_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT users_auth_provider_check CHECK (auth_provider IN ('local', 'google')),
    CONSTRAINT users_role_check CHECK (role IN ('user', 'admin'))
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'appointments_phone_length'
    ) THEN
        ALTER TABLE appointments
            ADD CONSTRAINT appointments_phone_length CHECK (length(phone_number) BETWEEN 10 AND 20);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'appointments_email_length'
    ) THEN
        ALTER TABLE appointments
            ADD CONSTRAINT appointments_email_length CHECK (length(email) <= 255);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'internship_phone_length'
    ) THEN
        ALTER TABLE internship_applications
            ADD CONSTRAINT internship_phone_length CHECK (length(phone_number) BETWEEN 10 AND 20);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'internship_email_length'
    ) THEN
        ALTER TABLE internship_applications
            ADD CONSTRAINT internship_email_length CHECK (length(email) <= 255);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_appointments_email ON appointments (email);
CREATE INDEX IF NOT EXISTS idx_internship_created_at_desc ON internship_applications (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_internship_email ON internship_applications (email);
