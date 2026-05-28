-- PostgreSQL Schema for Shivam Mishra and Associates Law Firm

-- Create admin_users table
CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create appointments table
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    case_summary TEXT,
    preferred_date DATE,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_appointments_status ON appointments (status);
CREATE INDEX idx_appointments_created_at_desc ON appointments (created_at DESC);

-- Internship inquiries from the public site (see POST /api/internship-applications)
CREATE TABLE internship_applications (
    id SERIAL PRIMARY KEY,
    applicant_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    statement TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create case_studies table (Blog)
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

-- Insert sample data for testing
INSERT INTO case_studies (title, summary, full_content, court_name) VALUES
('Landmark Divorce Settlement Case', 'Successfully negotiated a complex divorce settlement involving substantial assets and child custody arrangements.', 'In this landmark case, our firm represented the petitioner in a high-stakes divorce proceeding. The case involved multiple properties, business interests, and complex child custody arrangements. Through strategic negotiation and thorough preparation, we secured a favorable settlement that protected our client''s financial interests while ensuring the welfare of the children involved.', 'Allahabad High Court'),
('Criminal Defense Success Story', 'Acquitted client in a high-profile criminal case through meticulous evidence analysis and strategic defense.', 'Our client was facing serious criminal charges that could have resulted in significant imprisonment. Through careful examination of prosecution evidence, identification of procedural irregularities, and presentation of compelling defense arguments, we achieved a complete acquittal. This case demonstrates our commitment to thorough preparation and strategic legal advocacy.', 'Allahabad High Court'),
('Complex Property Dispute Resolution', 'Resolved a multi-generational property dispute through innovative legal strategies and mediation.', 'This case involved a complex property dispute spanning three generations of a family. The dispute involved multiple properties, unclear titles, and emotional family dynamics. Our approach combined traditional legal arguments with innovative mediation techniques, resulting in a resolution that satisfied all parties and preserved family relationships.', 'District Court, Prayagraj');
