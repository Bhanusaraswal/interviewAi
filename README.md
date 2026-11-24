<div align="center">

# 🎯 PrepAI — AI-Powered Interview Preparation Platform

**Land your dream job with personalized AI interview coaching, face-to-face mock interviews, and real-time delivery analysis.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://mongodb.com)
[![Groq](https://img.shields.io/badge/Groq-LLaMA_3.3_70B-F55036?style=flat-square)](https://groq.com)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)

[Live Demo](#) · [Report Bug](https://github.com/Rajveer230/Prepai/issues) · [Request Feature](https://github.com/Rajveer230/Prepai/issues)

</div>

---

## ✨ Features

### 🤖 AI Interview Plan Generation
Upload your resume (PDF) + paste a job description → AI generates a fully personalized interview strategy in ~30 seconds including:
- **Match Score** — how well your profile fits the role
- **12 Technical Questions** with model answers and interviewer intentions
- **8 Behavioral Questions** tailored to the company culture
- **10-Day Preparation Roadmap** with daily tasks
- **Skill Gap Analysis** — what's missing and how critical it is

### 🎥 Face-to-Face Mock Interview
Live video interview experience with an AI interviewer:
- AI reads each question aloud using Text-to-Speech
- You answer using your **voice** (Web Speech API)
- Real-time speech transcription appears as you speak
- AI evaluates each answer and gives a score + feedback + key points
- Session saved to MongoDB — resume anytime

### 🧠 Nervousness Detector *(Unique Feature)*
Analyzes your speech delivery in real-time after every answer:
- **Confidence Score** (0–100) calculated instantly — no API call needed
- Detects **20+ filler words** ("um", "uh", "like", "basically", "you know"...)
- Measures **speaking pace** in WPM — flags too fast (>195) or too slow (<85)
- Tracks **word repetition** and **answer length**
- Gives actionable coaching tips after each question
- Final results show **Answer Quality** + **Delivery Score** side by side

### 📊 Analytics Dashboard
- Score trend chart across all mock interview sessions
- Technical vs Behavioral performance breakdown (bar chart)
- Stats: total plans, total mocks, average score, personal best
- Recent interview plans with match scores

### 🔐 Secure Authentication
- Email OTP verification for both registration and login
- JWT stored in httpOnly cookies (XSS-safe)
- Token blacklist on logout
- 3-step OTP page with live progress indicator and countdown timer

### 🎨 Dark / Light Theme
- Smooth CSS variable-based theming across all pages
- Preference saved in `localStorage`
- One-click toggle in the Navbar

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + Vite | UI framework + build tool |
| React Router v7 | Client-side routing |
| SCSS (BEM) | Styling with CSS custom properties for theming |
| Recharts | Analytics charts |
| Axios | HTTP client |
| Web Speech API | Voice input + Text-to-Speech |
| MediaDevices API | Camera access |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Database |
| Groq SDK (LLaMA 3.3 70B) | AI question generation + answer evaluation |
| JWT + bcryptjs | Authentication |
| Nodemailer + Gmail SMTP | OTP email delivery |
| Multer + pdf-parse | Resume PDF upload and parsing |

---

## 📁 Project Structure

```
prepai/
├── Backend/
│   └── src/
│       ├── controller/
│       │   ├── auth.controller.js       # Register, login, OTP verify
│       │   ├── interview.controller.js  # AI plan generation
│       │   ├── mock.controller.js       # Mock interview sessions
│       │   └── user.controller.js       # Profile stats, change password
│       ├── model/
│       │   ├── user.model.js
│       │   ├── interview.model.js
│       │   ├── mockInterview.model.js   # Stores nervousness data per question
│       │   └── blacklist.model.js
│       ├── routes/
│       ├── middlewares/
│       └── utils/
│           └── email.js                 # Nodemailer OTP sender
│
└── Frontend/
    └── src/
        ├── features/
        │   ├── auth/                    # Login, Register, OTP pages + context
        │   ├── interview/
        │   │   ├── pages/
        │   │   │   ├── Home.jsx         # Dashboard + plan generator
        │   │   │   ├── interview.jsx    # View generated plan
        │   │   │   └── MockInterview.jsx # Face-to-face mock + nervousness UI
        │   │   └── utils/
        │   │       └── nervousness.js   # Pure JS speech analysis (no API)
        │   └── user/
        │       └── pages/Profile.jsx   # Analytics dashboard
        ├── context/
        │   └── ThemeContext.jsx         # Dark/light theme
        ├── pages/
        │   └── Landing.jsx
        └── components/
            └── Navbar.jsx
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free)
- Groq API key (free at console.groq.com)
- Gmail account with App Password enabled

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/prepai.git
cd prepai
```

### 2. Setup Backend
```bash
cd Backend
npm install
```

Create `Backend/.env`:
```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/interview-ai
JWT_SECRET=your_random_64_char_secret
GROQ_API_KEY=gsk_your_groq_api_key
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_gmail_app_password
```

> **Gmail App Password:** Go to myaccount.google.com → Security → 2-Step Verification → App Passwords → Generate

```bash
npm run dev
# Server runs on http://localhost:3000
```

### 3. Setup Frontend
```bash
cd ../Frontend
npm install
```

Create `Frontend/.env`:
```env
VITE_API_URL=http://localhost:3000
```

```bash
npm run dev
# App runs on http://localhost:5173
```

---

## ☁️ Deployment

| Service | Platform | Free Tier |
|---|---|---|
| Frontend | [Vercel](https://vercel.com) | ✅ Yes |
| Backend | [Render](https://render.com) | ✅ Yes |
| Database | MongoDB Atlas | ✅ Yes |

### Deploy Backend (Render)
1. New Web Service → connect GitHub repo
2. Root Directory: `Backend`
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add all environment variables from `.env` + `NODE_ENV=production`

### Deploy Frontend (Vercel)
1. Import GitHub repo → Root Directory: `Frontend`
2. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com`
3. Deploy

---

## 🔑 Environment Variables

### Backend
| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT signing (min 32 chars) |
| `GROQ_API_KEY` | Groq API key for LLaMA 3.3 70B |
| `EMAIL_USER` | Gmail address for sending OTPs |
| `EMAIL_PASS` | Gmail App Password (not your Gmail password) |
| `NODE_ENV` | Set to `production` on deployment |

### Frontend
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend URL (e.g. `https://prepai-backend.onrender.com`) |

---

## 📸 Pages Overview

| Page | Route | Description |
|---|---|---|
| Landing | `/` | Marketing page |
| Register | `/register` | Sign up with OTP verification |
| Login | `/login` | Sign in with OTP verification |
| Verify OTP | `/verify-otp` | 6-digit email OTP with countdown timer |
| Dashboard | `/dashboard` | Generate new interview plan |
| Interview Plan | `/interview/:id` | View questions, answers, roadmap |
| Mock Interview | `/mock-interview/:id` | Face-to-face AI interview + nervousness detector |
| Profile | `/profile` | Analytics dashboard + change password |

---

## ⚡ How the Nervousness Detector Works

No AI API is called — analysis runs instantly in the browser:

```
transcript + duration
        ↓
analyzeNervousness()
        ↓
┌─────────────────────────────────┐
│ Count filler words              │  "um", "uh", "like", "you know"...
│ Calculate WPM                   │  words ÷ seconds × 60
│ Detect word repetition          │  words used 3+ times
│ Measure answer length           │  total word count
└─────────────────────────────────┘
        ↓
Confidence Score (0–100)
+ Coaching Tips
```

**Score formula:** Start at 100 → deduct for fillers (−6 each), fast/slow pace (−15/−10), short answers (−20), repetition (−5 each)

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

---


---

<div align="center">
Built with ❤️ using React, Node.js, and Groq AI
</div>
