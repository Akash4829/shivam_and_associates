# Mishra Juris Chamber

Public website and admin tools for **Mishra Juris Chamber** (Adv. Shivam Mishra). Clients can request consultations without an account. Admins review appointments, internship applications, and case studies.

## Architecture

| Layer | Stack |
| --- | --- |
| Frontend | React 18, React Router, Tailwind CSS, Framer Motion, i18next |
| Backend | Node.js, Express, PostgreSQL (`pg`) |
| Auth | JWT in an HTTP-only cookie (Bearer token still accepted as a fallback) |
| Hosting | Frontend on Vercel, API on Render, database on Neon/PostgreSQL |

Business contact details live in `frontend/src/constants/site.js`. Use that file as the single source for phone, WhatsApp, email, address, and maps.

**Note:** The call number (`+91 70819 79737`) and WhatsApp number (`+91 74599 19737`) are different values already stored in site configuration. They were not merged.

## Public routes

- `/` Home
- `/about` About
- `/focus-areas` Practice areas
- `/services` Services
- `/case-studies` Case studies / results
- `/testimonials` Testimonials
- `/contact` Consultation request (no login)
- `/privacy-policy`, `/terms-of-use`, `/disclaimer`

## Authenticated routes

- `/internship` Internship application (login required because a resume is uploaded)
- `/login`, `/register`, `/forgot-password`, `/reset-password`

## Admin

- `/admin` — appointments, internships, case studies
- Backend enforces `users.role = 'admin'`
- A bootstrap email allowlist (`backend/utils/adminEmails.js` plus `ADMIN_EMAILS`) can promote matching accounts on login. It is not a replacement for the role column.
- The `admin_users` table is legacy and unused by the running API.

## API

| Method | Path | Auth |
| --- | --- | --- |
| POST | `/api/appointments` | Public (rate limited + validated) |
| GET | `/api/appointments` | Admin |
| PUT | `/api/appointments/:id` | Admin |
| GET | `/api/case-studies` | Public |
| POST/PUT/DELETE | `/api/case-studies` | Admin |
| POST | `/api/internship-applications` | Authenticated |
| GET/PATCH | `/api/internship-applications` | Admin |
| POST | `/api/auth/login`, `/register`, `/google`, `/apple` | Public |
| GET | `/api/auth/me` | Authenticated |
| GET | `/health` | Public |

## Local setup

1. Copy `backend/.env.example` and `frontend/.env.example`.
2. Create the database with `database/schema.sql` (and any files in `database/migrations/` if the database is older).
3. Optional admin seed: `node database/seed-admin.js`
4. Backend: `cd backend && npm install && npm run dev` (default `http://localhost:5000`)
5. Frontend: `cd frontend && npm install && npm start` (default `http://localhost:3000`)

Required backend env: `DATABASE_URL` or `DB_*`, `JWT_SECRET`, `CLIENT_URL`. See `backend/.env.example` for mail, Google/Apple OAuth, and `ADMIN_EMAILS`.

## Production

- Frontend `vercel.json` proxies `/api` to the Render API and sets a restrictive CSP.
- Set `CLIENT_URL` / `CLIENT_URLS` to the live Vercel origin(s).
- `COOKIE_SAMESITE=none` is the production default when the frontend and API are on different domains.
- Do not expose `ADMIN_SEED_PASSWORD` in production; set a strong password before seeding.

## Security notes

- Consultation POST is public on purpose. It is protected with rate limiting, validation, sanitization, and a honeypot field (`website`).
- Admin list/update endpoints remain authenticated.
- Resume files are not statically served; downloads require an admin session.
- Google OAuth redirect no longer puts the JWT in the URL query string.
