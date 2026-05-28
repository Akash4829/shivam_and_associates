# Shivam Mishra and Associates - Law Firm Portfolio & Client Management

A comprehensive web application for "Shivam Mishra and Associates" law firm, featuring client appointment booking, case study publishing, and administrative management.

## Features

### Public Website
- **Hero Section**: Professional landing with "Solving your problems head-on" messaging
- **About Section**: Highlights 3+ years of experience at Allahabad High Court
- **Focus Areas**: Maintenance, Divorce, and Complex Litigation
- **Services List**: Criminal Laws, Civil Disputes, B.N.S Matters, Family Dispute, Taxation
- **Testimonials**: Client reviews highlighting availability, strategic approach, and honesty
- **Booking Form**: Client appointment scheduling with validation
- **Case Studies Blog**: Public display of legal insights and court precedents

### Admin Dashboard
- **Appointment Management**: View and update appointment statuses
- **Case Study Publisher**: Create and manage legal blog content
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend
- **Node.js** with Express.js
- **PostgreSQL** database
- **pg** (node-postgres) for database connection
- **CORS** for cross-origin requests
- **dotenv** for environment variables

### Frontend
- **React 18** with modern hooks
- **React Router DOM** for navigation
- **Tailwind CSS** for styling
- **Axios** for API requests

### Database
- **PostgreSQL** with clean, normalized schema
- **appointments** table for client leads
- **case_studies** table for blog content

## Project Structure

```
law-firm-app/
|
|-- backend/
|   |-- controllers/
|   |   |-- appointmentController.js
|   |   |-- blogController.js
|   |-- routes/
|   |   |-- appointments.js
|   |   |-- case-studies.js
|   |-- config/
|   |   |-- db.js
|   |-- package.json
|   |-- server.js
|   |-- .env.example
|
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |   |-- HeroSection.jsx
|   |   |   |-- AboutSpecialty.jsx
|   |   |   |-- FocusAreas.jsx
|   |   |   |-- ServicesList.jsx
|   |   |   |-- Testimonials.jsx
|   |   |   |-- BookingForm.jsx
|   |   |   |-- BlogFeed.jsx
|   |   |   |-- AdminDashboard.jsx
|   |   |   |-- Navbar.jsx
|   |   |   |-- Footer.jsx
|   |   |-- App.jsx
|   |   |-- index.js
|   |   |-- index.css
|   |-- public/
|   |   |-- index.html
|   |-- package.json
|   |-- tailwind.config.js
|   |-- postcss.config.js
|
|-- database/
|   |-- schema.sql
|
|-- README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### 1. Database Setup

1. **Create Database**
   ```sql
   CREATE DATABASE law_firm_db;
   ```

2. **Run Schema**
   ```bash
   psql -d law_firm_db -f database/schema.sql
   ```

### 2. Backend Setup

1. **Navigate to Backend Directory**
   ```bash
   cd backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your database credentials:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=law_firm_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   PORT=5000
   ```

4. **Start Backend Server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

   Backend will run on `http://localhost:5000`

### 3. Frontend Setup

1. **Navigate to Frontend Directory**
   ```bash
   cd frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Frontend Development Server**
   ```bash
   npm start
   ```

   Frontend will run on `http://localhost:3000`

### 4. Verify Installation

1. **Check Backend Health**
   ```bash
   curl http://localhost:5000/health
   ```

2. **Access Application**
   - **Website**: http://localhost:3000
   - **Admin Dashboard**: http://localhost:3000/admin
   - **Case Studies**: http://localhost:3000/blog

## API Endpoints

### Appointments
- `POST /api/appointments` - Create new appointment
- `GET /api/appointments` - Get all appointments
- `PUT /api/appointments/:id` - Update appointment status

### Case Studies
- `POST /api/case-studies` - Create new case study
- `GET /api/case-studies` - Get all case studies
- `GET /api/case-studies/:id` - Get single case study
- `PUT /api/case-studies/:id` - Update case study
- `DELETE /api/case-studies/:id` - Delete case study

## Database Schema

### Appointments Table
```sql
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
```

### Case Studies Table
```sql
CREATE TABLE case_studies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    full_content TEXT NOT NULL,
    court_name VARCHAR(255) NOT NULL,
    date_posted DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Design System

### Color Palette
- **Navy Blue**: `#1e3a5f` - Primary brand color
- **Gold**: `#d4af37` - Accent color for CTAs and highlights
- **Dark Charcoal**: `#2c3e50` - Secondary text and backgrounds
- **Off White**: `#f8f9fa` - Light backgrounds

### Typography
- **Headings**: Georgia serif font for authority
- **Body**: System fonts for readability
- **Responsive**: Mobile-first approach

## Features Implemented

### Frontend Components
- [x] **HeroSection** - Compelling headline with CTAs
- [x] **AboutSpecialty** - Experience and expertise showcase
- [x] **FocusAreas** - Three practice area cards
- [x] **ServicesList** - Comprehensive service offerings
- [x] **Testimonials** - Client trust indicators
- [x] **BookingForm** - Validated appointment scheduling
- [x] **BlogFeed** - Case studies display
- [x] **AdminDashboard** - Business management interface
- [x] **Navbar** - Sticky navigation with mobile menu
- [x] **Footer** - Contact information and links

### Backend Features
- [x] **Express Server** - Clean routing and middleware
- [x] **Database Connection** - PostgreSQL with pg
- [x] **Appointment Management** - CRUD operations
- [x] **Case Study Management** - Full CRUD with publishing
- [x] **Error Handling** - Comprehensive error responses
- [x] **Validation** - Input validation and sanitization

### Admin Dashboard
- [x] **Appointment View** - Table with status management
- [x] **Case Study Publisher** - Form with validation
- [x] **Responsive Design** - Works on all devices
- [x] **Real-time Updates** - Dynamic data fetching

## Development Notes

### Security Considerations
- Input validation on both frontend and backend
- SQL injection prevention with parameterized queries
- CORS configuration for API security
- Environment variables for sensitive data

### Performance Optimizations
- Lazy loading for large content
- Optimized database queries
- Efficient React rendering with proper state management
- Responsive images and assets

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Accessible markup and ARIA labels

## Future Enhancements

### Potential Additions
- User authentication system
- Email notifications for appointments
- File upload for case documents
- Advanced search functionality
- Analytics and reporting dashboard
- Multi-language support
- SEO optimization
- Payment processing integration

### Scaling Considerations
- Database indexing for performance
- Caching strategies
- Load balancing setup
- Microservices architecture
- Cloud deployment options

## Support

For technical support or questions about this project, please refer to the documentation or contact the development team.

---

**Shivam Mishra and Associates** © 2024 - Professional Legal Services with Modern Technology
