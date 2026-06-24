-- PostgreSQL Schema for Shivam Mishra and Associates Law Firm

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Legacy admin credentials (used for admin panel bootstrap)
CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Application users (clients, interns, admins)
CREATE TABLE users (
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

CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_role ON users (role);

CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    case_summary TEXT,
    preferred_date DATE,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT appointments_phone_length CHECK (length(phone_number) BETWEEN 10 AND 20),
    CONSTRAINT appointments_email_length CHECK (length(email) <= 255)
);

CREATE INDEX idx_appointments_status ON appointments (status);
CREATE INDEX idx_appointments_created_at_desc ON appointments (created_at DESC);
CREATE INDEX idx_appointments_email ON appointments (email);

CREATE TABLE internship_applications (
    id SERIAL PRIMARY KEY,
    applicant_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    statement TEXT,
    college_university VARCHAR(255),
    current_year_semester VARCHAR(100),
    areas_of_interest TEXT,
    cover_letter TEXT,
    resume_filename VARCHAR(255),
    resume_path TEXT,
    status VARCHAR(50) DEFAULT 'Pending',
    admin_notes TEXT,
    reviewed_at TIMESTAMP,
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT internship_phone_length CHECK (length(phone_number) BETWEEN 10 AND 20),
    CONSTRAINT internship_email_length CHECK (length(email) <= 255),
    CONSTRAINT internship_status_check CHECK (status IN ('Pending', 'Shortlisted', 'Approved', 'Rejected'))
);

CREATE INDEX idx_internship_created_at_desc ON internship_applications (created_at DESC);
CREATE INDEX idx_internship_email ON internship_applications (email);
CREATE INDEX idx_internship_status ON internship_applications (status);

CREATE TABLE case_studies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    full_content TEXT NOT NULL,
    court_name VARCHAR(255) NOT NULL,
    image_url TEXT,
    date_posted DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_case_studies_date_posted_desc ON case_studies (date_posted DESC);

INSERT INTO case_studies (title, summary, full_content, court_name) VALUES
('Landmark Divorce Settlement Case', 'Successfully negotiated a complex divorce settlement involving substantial assets and child custody arrangements.', 'In this landmark case, our firm represented the petitioner in a high-stakes divorce proceeding. The case involved multiple properties, business interests, and complex child custody arrangements. Through strategic negotiation and thorough preparation, we secured a favorable settlement that protected our client''s financial interests while ensuring the welfare of the children involved.', 'Allahabad High Court'),
('Criminal Defense Success Story', 'Acquitted client in a high-profile criminal case through meticulous evidence analysis and strategic defense.', 'Our client was facing serious criminal charges that could have resulted in significant imprisonment. Through careful examination of prosecution evidence, identification of procedural irregularities, and presentation of compelling defense arguments, we achieved a complete acquittal. This case demonstrates our commitment to thorough preparation and strategic legal advocacy.', 'Allahabad High Court'),
('Complex Property Dispute Resolution', 'Resolved a multi-generational property dispute through innovative legal strategies and mediation.', 'This case involved a complex property dispute spanning three generations of a family. The dispute involved multiple properties, unclear titles, and emotional family dynamics. Our approach combined traditional legal arguments with innovative mediation techniques, resulting in a resolution that satisfied all parties and preserved family relationships.', 'District Court, Prayagraj');
