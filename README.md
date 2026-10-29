# ShopSaathi Backend

- **Live API:** https://shopsaathi-backend.onrender.com
- **Live app:** https://shopsaathi-e778c.web.app

REST API for **ShopSaathi**, a hyperlocal job-matching platform that connects small Indian shop owners (kirana, medical, stationery stores) with nearby workers.

Frontend (React + Firebase): https://github.com/yashveerniat/shopsaathi

## Tech Stack

- **Node.js** and **Express.js**: server and REST API
- **MongoDB Atlas** with **Mongoose**: database and schemas
- **JWT** (jsonwebtoken): authentication
- **bcryptjs**: password hashing
- **dotenv**, **cors**

## Features

- Register and login for two roles: `owner` and `worker`
- Passwords stored as bcrypt hashes, never in plain text
- JWT-protected routes through auth middleware
- Owners post and manage jobs
- Workers apply to jobs; duplicate applications are blocked
- Owners shortlist, hire or reject applicants
- Ownership checks: only the owner of a job or application can modify it

## Project Structure

```
shopsaathi-backend/
├── config/db.js            # MongoDB connection
├── middleware/auth.js      # JWT verification (protect)
├── models/
│   ├── User.js
│   ├── Job.js
│   └── Application.js
├── routes/
│   ├── auth.js
│   ├── jobs.js
│   └── applications.js
├── server.js               # Entry point
└── .env.example
```

## Database Collections

| Collection | Purpose |
|---|---|
| `users` | Owners and workers (role-based fields) |
| `jobs` | Job postings, linked to the owner via `owner` (ObjectId ref) |
| `applications` | Links a worker to a job; stores status and a worker snapshot |

`applications` has a unique index on `(job, worker)`, so a worker can apply to a job only once.

## API Endpoints

### Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create account, returns JWT |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/profile` | Token | Get logged-in user's profile |

### Jobs

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/jobs` | Public | All open jobs |
| GET | `/api/jobs/my` | Owner | Jobs posted by the logged-in owner |
| GET | `/api/jobs/:id` | Public | Single job |
| POST | `/api/jobs` | Token | Create job |
| PUT | `/api/jobs/:id` | Job owner | Update job |

### Applications

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/applications` | Token | Apply to a job (`{ "jobId": "..." }`) |
| GET | `/api/applications/worker` | Token | Applications submitted by the worker |
| GET | `/api/applications/owner` | Token | Applications received by the owner |
| PUT | `/api/applications/:id/status` | Job owner | Set status: `pending`, `shortlisted`, `hired`, `rejected` |

Protected routes need this header: `Authorization: Bearer <token>`

## Setup

1. Clone the repo and install dependencies
```bash
   git clone https://github.com/yashveerniat/shopsaathi-backend.git
   cd shopsaathi-backend
   npm install
```
2. Copy `.env.example` to `.env` and fill in your values
```
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/shopsaathi
   JWT_SECRET=your_secret_here
```
3. Start the server
```bash
   node server.js
```
   Expected output: `Server running on port 5000` and `MongoDB Connected: ...`

## Quick Test (PowerShell)

```powershell
Invoke-RestMethod -Uri http://localhost:5000/api/auth/register -Method Post -ContentType "application/json" -Body '{"name":"Test Owner","email":"owner1@test.com","password":"test1234","phone":"9876543210","role":"owner","businessName":"Sharma Kirana"}'
```

## Author

Yashveer Singh
Manasvi Mali
Tanvi Yadav
Aashi Soni