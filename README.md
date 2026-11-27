# 🎯 Interview AI — AI-Powered Interview Preparation Platform

Interview AI helps you prepare for job interviews. Upload your resume, paste a job description, and get a personalised interview plan. Then practise it in a voice-based mock interview where the AI scores each of your answers and measures how nervous you sound.

---

## ✨ Features

- **Secure authentication**: register and log in with email OTP verification, JWT sessions, and token blacklisting on logout
- **Resume analysis**: upload a PDF resume, or write a short self-description instead
- **AI interview report** for any job description:
  - Match score between your profile and the job
  - Skill gaps ranked by severity
  - 12 technical and 8 behavioural questions, each with the interviewer's intention and a model answer
  - A 10-day preparation roadmap
- **Mock interview**: the AI reads questions aloud, you answer by voice (speech-to-text) or text, and every answer gets a score, feedback and key points
- **Nervousness detector**: filler words, speaking pace (words per minute) and repeated words are measured in the browser
- **PDF export** of your full interview plan
- **Profile dashboard** with your statistics and a change-password option
- **Dark and light theme**

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router, Axios, Sass |
| Backend | Node.js, Express 5 |
| Database | MongoDB with Mongoose |
| AI | Google Gemini (through an OpenAI-compatible API) |
| Email | Resend |
| Auth | JWT, bcryptjs, cookie-parser |
| File handling | Multer (upload), pdf-parse (read PDFs), PDFKit (create PDFs) |
| Browser APIs | Web Speech API, speechSynthesis, camera access |

The AI layer is provider-agnostic. Any OpenAI-compatible service (Gemini, OpenRouter, Ollama, and others) works by changing three environment variables.

---

## 📁 Project Structure

```
interviewAi/
├── Backend/
│   └── src/
│       ├── app.js                  # Express setup, CORS, routes
│       ├── server.js               # Entry point
│       ├── config/                 # MongoDB connection
│       ├── controller/             # auth, interview, mock, user logic
│       ├── middlewares/            # JWT auth middleware
│       ├── model/                  # user, interview, mockInterview, blacklist
│       ├── routes/                 # auth, interview, mock, user routes
│       └── utils/
│           ├── llm.js              # AI client with retry and fallback
│           └── email.js            # OTP emails
└── Frontend/
    └── src/
        ├── App.jsx, app.routes.jsx
        ├── components/             # Navbar
        ├── context/                # Theme context
        ├── features/
        │   ├── auth/               # Login, Register, Verify OTP
        │   ├── interview/          # Dashboard, report, mock interview
        │   └── user/               # Profile
        ├── pages/                  # Landing, NotFound
        └── utils/                  # api client, toast, nervousness analysis
```

---

## 🚀 Getting Started

### Requirements
- Node.js 18 or newer
- A MongoDB database (a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster works)
- A [Google Gemini API key](https://aistudio.google.com/apikey) (free tier available)
- A [Resend](https://resend.com) API key (optional while developing)

### 1. Clone the repository
```bash
git clone https://github.com/Bhanusaraswal/interviewAi.git
cd interviewAi
```

### 2. Set up the backend
```bash
cd Backend
npm install
```

Create `Backend/.env`:
```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/interview-ai
JWT_SECRET=a_long_random_string_of_at_least_32_characters
RESEND_API_KEY=re_xxxxxxxxxxxx

LLM_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai
LLM_API_KEY=your_gemini_api_key
LLM_MODEL=your_gemini_model_name
LLM_FALLBACK_MODEL=optional_backup_model_name
```

Start the server:
```bash
npm run dev
```
The API runs at `http://localhost:3000`.

### 3. Set up the frontend
```bash
cd ../Frontend
npm install
```

Create `Frontend/.env`:
```env
VITE_API_URL=http://localhost:3000
```

Start the app:
```bash
npm run dev
```
Open `http://localhost:5173`.

> **Development tip:** if `RESEND_API_KEY` is missing, or Resend refuses to send, the OTP code is printed in the backend terminal so you can still sign up.
> Resend's free sandbox only delivers email to the address you registered with. To email other users, verify your own domain in Resend.

---

## 🔑 Environment Variables

### Backend
| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign login tokens (at least 32 characters) |
| `RESEND_API_KEY` | Resend API key for OTP emails |
| `LLM_BASE_URL` | Base URL of an OpenAI-compatible AI API |
| `LLM_API_KEY` | API key for that provider |
| `LLM_MODEL` | Model name to use |
| `LLM_FALLBACK_MODEL` | Optional backup model used if the main one is busy |
| `NODE_ENV` | Set to `production` when deployed |
| `PORT` | Optional, defaults to 3000 |

### Frontend
| Variable | Description |
|---|---|
| `VITE_API_URL` | URL of the backend API |

---

## 📡 API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create an account and send an OTP |
| POST | `/api/auth/login` | Check credentials and send an OTP |
| POST | `/api/auth/verify-otp` | Verify the OTP and log in |
| POST | `/api/auth/resend-otp` | Send a new OTP |
| POST | `/api/auth/logout` | Log out and blacklist the token |
| GET | `/api/auth/get-me` | Get the current user |
| POST | `/api/interview/` | Generate an interview report (resume PDF and job description) |
| GET | `/api/interview/` | List your reports |
| GET | `/api/interview/report/:id` | Get one report |
| POST | `/api/interview/resume/pdf/:id` | Download the report as a PDF |
| DELETE | `/api/interview/report/:id` | Delete a report |
| POST | `/api/mock/start/:reportId` | Start a mock interview |
| POST | `/api/mock/submit/:sessionId` | Submit an answer for scoring |
| GET | `/api/mock/:sessionId` | Get a mock interview session |
| GET | `/api/user/stats` | Get profile statistics |
| PUT | `/api/user/change-password` | Change your password |

All routes except register, login, verify-otp and resend-otp require a valid token.

---

## ☁️ Deployment

### Backend on Render
1. Create a new **Web Service** and connect this GitHub repository
2. **Root Directory:** `Backend`
3. **Build Command:** `npm install`
4. **Start Command:** `npm start`
5. Add all backend environment variables and set `NODE_ENV=production`

### Frontend on Vercel
1. Import this repository
2. **Root Directory:** `Frontend`
3. Add the environment variable `VITE_API_URL` with your Render backend URL
4. Deploy

### MongoDB Atlas
Under **Network Access**, allow `0.0.0.0/0` so the hosted backend can connect.

> **Note:** with `NODE_ENV=production`, failed emails are treated as errors. Verify a domain in Resend before inviting other users. Render's free tier also sleeps when idle, so the first request after a pause can take up to a minute.

---

## 🔒 Security

- Passwords are hashed with bcrypt
- Login tokens are signed JWTs that expire after one day, and logged-out tokens are blacklisted
- Every report and mock session is filtered by user, so people only see their own data
- Uploads are limited to PDF files under 5 MB
- Secrets live in `.env` files, which are excluded from Git

---

## 🗺️ Roadmap

- Cross-questioning interviewer that asks follow-up questions based on your answers
- AI agents for company research, resume tailoring and adaptive study plans
- Progress charts across mock interviews
- In-browser coding round

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome. Open an issue or submit a pull request.
