# HelloDoc - AI-Powered Medical Consultation Platform

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-ISC-green)
![Status](https://img.shields.io/badge/status-Active%20Development-brightgreen)

A modern, full-stack React application for AI-powered health assessments, maternal care guidance, and medical consultations. Built with **TypeScript**, **Vite**, and powered by **Google Gemini** or **AWS Bedrock** AI providers.

**Live Demo:** http://146.190.74.221:3000

</div>

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Locally](#running-locally)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [AI Providers](#ai-providers)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

### 🩺 Core Healthcare Features

- **AI-Powered Chat Assistant** - Medical consultation with context-aware responses
- **Health Assessment** - Comprehensive health questionnaires with AI analysis
- **Clinical Reports** - AI-generated health reports with:
  - Health score (0-100)
  - Risk analysis (Lifestyle, BMI, Diabetes, Hypertension, Heart, Mental Stress, Nutrition, Sleep)
  - Personalized recommendations
  - Suggested medical tests
  - Specialist recommendations
  - Lifestyle improvement plans

### 👶 Maternal Care Module

- **Weekly Pregnancy Guidance** - Week-by-week pregnancy insights
- **Baby Growth Tracking** - Development milestones and size comparisons
- **Nutrition Plans** - Localized for Bangladesh (Bengali/English)
- **Exercise & Safety** - Safe exercises and precautions
- **Vaccination Reminders** - TT, Tetanus, and other reminders
- **Emergency Warnings** - Critical symptom detection

### 📚 Records & History

- **Consultation History** - Save and access past consultations
- **Patient Records** - Store health assessments locally
- **Multi-language Support** - English & Bengali (বাংলা)

### 🔐 Authentication

- **Demo Login** - Quick access with pre-configured demo accounts
- **Direct Login** - Custom user authentication
- **LocalStorage-Based** - Temporary local storage (no Firebase required)

---

## 🛠 Tech Stack

### Frontend
- **React 19** - UI Framework
- **TypeScript** - Type-safe development
- **Vite 6** - Lightning-fast build tool
- **Tailwind CSS 4** - Utility-first CSS
- **Lucide React** - Icon library
- **Motion** - Animation library

### Backend
- **Node.js 18+** - JavaScript runtime
- **Express** - Web framework
- **dotenv** - Environment variable management

### AI Providers
- **Google Gemini API** - Natural language processing
- **AWS Bedrock** - Claude model access
- **@aws-sdk/client-bedrock-runtime** - AWS SDK

### DevOps
- **GitHub Actions** - CI/CD automation
- **DigitalOcean** - Cloud hosting (146.190.74.221)
- **http-server** - Static file serving

---

## 🏗 Architecture

### AI Provider Architecture

HelloDoc uses a **clean, modular AI provider architecture**:

```
UI Components (React)
         ↓
AI Service Layer (aiService.ts)
         ↓
AI Router (aiProvider.ts) - Unified Interface
    ├── Gemini Provider (gemini.ts)
    ├── Bedrock Provider (bedrock.ts)
    └── Provider Selection Logic
         ↓
Backend API Server (/api/ai/message)
    ├── Gemini API (generativelanguage.googleapis.com)
    └── AWS Bedrock SDK
```

### Key Benefits

✅ **Isolated Providers** - Easy to maintain/update individual providers
✅ **Unified Interface** - Single `aiRouter.chat()` for all AI calls
✅ **Easy Switching** - Change provider by updating one env variable
✅ **Type-Safe** - Full TypeScript support throughout
✅ **Testable** - Separate test files for each provider

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (recommended: 20+)
- npm 10+
- Git

### 1. Clone Repository

```bash
git clone https://github.com/km-wahid/HelloDoc.git
cd HelloDoc
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
```

### 4. Add API Key (Gemini Recommended)

Edit `.env` and add your Gemini API key:

```env
AI_PROVIDER="gemini"
GEMINI_API_KEY="your-api-key-here"
GEMINI_MODEL="gemini-2.5-flash"
AI_API_PORT="8787"
```

**Get Gemini API Key (Free):**
1. Visit: https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy and paste into `.env`

### 5. Start Development Servers

**Terminal 1 - Backend API:**
```bash
npm run dev:api
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 6. Open App

Visit: **http://localhost:3000**

---

## 📦 Installation

### Complete Setup Steps

#### Step 1: Clone & Install

```bash
git clone https://github.com/km-wahid/HelloDoc.git
cd HelloDoc
npm install
```

#### Step 2: Choose AI Provider

**Option A: Google Gemini (FREE - Recommended)**

1. Visit: https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key

**Option B: AWS Bedrock (Requires AWS Account)**

1. Go to AWS Console
2. Search for "Bedrock"
3. Enable Bedrock
4. Request model access (Claude Opus 4.6)
5. Create IAM user with Bedrock permissions
6. Get Access Key ID and Secret Access Key

#### Step 3: Configure `.env`

For **Gemini**:
```env
AI_PROVIDER="gemini"
GEMINI_API_KEY="AIzaSy..."
GEMINI_MODEL="gemini-2.5-flash"
AI_API_PORT="8787"
```

For **Bedrock**:
```env
AI_PROVIDER="bedrock"
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="AKIA..."
AWS_SECRET_ACCESS_KEY="..."
AWS_BEDROCK_MODEL_ID="anthropic.claude-opus-4-6-v1"
AI_API_PORT="8787"
```

#### Step 4: Run Locally

```bash
# Terminal 1
npm run dev:api

# Terminal 2
npm run dev
```

---

## ⚙️ Configuration

### Environment Variables Reference

```bash
# AI Provider (gemini or bedrock)
AI_PROVIDER="gemini"

# ======== GEMINI CONFIG ========
GEMINI_API_KEY="AIzaSy..."
GEMINI_MODEL="gemini-2.5-flash"

# ======== AWS BEDROCK CONFIG ========
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="AKIA..."
AWS_SECRET_ACCESS_KEY="..."
AWS_BEDROCK_MODEL_ID="anthropic.claude-opus-4-6-v1"

# API Server
AI_API_PORT="8787"

# App URL
APP_URL="http://localhost:3000"
```

### File Locations

- **Development Config**: `.env` (create from `.env.example`)
- **Template**: `.env.example` (commit to repo)
- **Server Config**: `server/bedrock-server.mjs` (loads .env)

⚠️ **IMPORTANT:** Never commit `.env` to Git. It's in `.gitignore`.

---

## 💻 Running Locally

### Development Mode

```bash
# Terminal 1: Start API Server
npm run dev:api

# Terminal 2: Start Frontend Dev Server
npm run dev
```

**URLs:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8787
- Health Check: http://localhost:8787/api/health

### Available Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start frontend dev server (Vite) |
| `npm run dev:api` | Start backend API server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | TypeScript type checking |
| `npm run clean` | Remove build artifacts |

### Production Build

```bash
# Build
npm run build

# Preview (test production build)
npm run preview

# Deploy to server
# See Deployment section below
```

---

## 🌍 Deployment

### Automated Deployment (GitHub Actions)

#### 1. Setup SSH Key for GitHub Actions

Generate new SSH key:
```bash
ssh-keygen -t ed25519 -f ~/.ssh/github_deploy -C "github-actions" -N ""
```

Add public key to your server (`146.190.74.221`):
```bash
ssh root@146.190.74.221
cat >> ~/.ssh/authorized_keys << 'EOF'
<paste-your-public-key-here>
EOF
exit
```

#### 2. Add GitHub Secrets

Go to: **GitHub Repository → Settings → Secrets and Variables → Actions**

Click "New repository secret" and add:

| Name | Value |
|------|-------|
| `DIGITALOCEAN_HOST` | `146.190.74.221` |
| `DIGITALOCEAN_USER` | `root` |
| `DIGITALOCEAN_SSH_KEY` | Your private SSH key content |

#### 3. Push to GitHub

```bash
git add .
git commit -m "Deploy HelloDoc to DigitalOcean"
git push origin main
```

**CI/CD Pipeline automatically:**
- ✅ Builds the app
- ✅ Uploads to server
- ✅ Installs dependencies
- ✅ Restarts services
- ✅ Creates backups

#### 4. Verify Deployment

Visit: **http://146.190.74.221:3000**

### Manual Deployment

If GitHub Actions is not set up:

```bash
# 1. Build locally
npm run build

# 2. Upload to server
scp -r dist root@146.190.74.221:~/HelloDoc/
scp -r server root@146.190.74.221:~/HelloDoc/
scp .env root@146.190.74.221:~/HelloDoc/
scp package.json package-lock.json root@146.190.74.221:~/HelloDoc/

# 3. SSH into server
ssh root@146.190.74.221

# 4. Install dependencies
cd ~/HelloDoc
npm install --production

# 5. Start services
nohup node server/bedrock-server.mjs > server.log 2>&1 &
nohup npx http-server dist -p 3000 --gzip --cors > frontend.log 2>&1 &

# 6. Check status
ps aux | grep -E "node|http-server"
```

### Server Configuration

**Server OS:** Ubuntu 24.04 LTS
**Server IP:** 146.190.74.221
**Node Version:** 18+

---

## 📁 Project Structure

```
HelloDoc/
├── src/
│   ├── ai/                          # 🤖 AI Provider Architecture
│   │   ├── aiProvider.ts            #    Unified router
│   │   ├── gemini.ts                #    Gemini provider
│   │   ├── bedrock.ts               #    Bedrock provider
│   │   └── bedrock.test.ts          #    Testing
│   │
│   ├── services/                    # 🔧 Business Logic
│   │   ├── aiService.ts             #    AI chat
│   │   ├── assessmentService.ts     #    Health assessment
│   │   ├── maternalService.ts       #    Pregnancy
│   │   ├── authService.ts           #    Authentication
│   │   ├── recordService.ts         #    Records
│   │   └── bedrockApiService.ts     #    Legacy API
│   │
│   ├── components/                  # 🎨 React Components
│   │   ├── consultation/
│   │   │   ├── AIChat.tsx           #    Chat interface
│   │   │   └── Consultation.tsx     #    Main screen
│   │   ├── assessment/
│   │   ├── maternal/
│   │   ├── profile/
│   │   ├── records/
│   │   └── layout/
│   │
│   ├── types.ts                     # 📝 TypeScript Interfaces
│   ├── App.tsx                      # Main component
│   └── main.tsx                     # Entry point
│
├── server/
│   └── bedrock-server.mjs           # 🖥️  Backend API Server
│
├── .github/
│   └── workflows/
│       └── deploy.yml               # 🚀 CI/CD Pipeline
│
├── dist/                            # 📦 Build output (generated)
├── node_modules/                    # 📚 Dependencies
│
├── .env                             # Environment variables (LOCAL)
├── .env.example                     # Environment template
├── .gitignore                       # Git ignore rules
├── vite.config.ts                   # Vite configuration
├── tsconfig.json                    # TypeScript config
├── package.json                     # Dependencies & scripts
└── README.md                        # This file
```

---

## 🤖 AI Providers

### Google Gemini

**Best for:** Quick setup, general medical chat

**Pros:**
- ✅ Free tier available
- ✅ 60 requests/min on free tier
- ✅ Easy to set up
- ✅ Good for chat
- ✅ Supports streaming

**Setup:**
1. Go to: https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key
4. Paste into `.env`:
   ```env
   AI_PROVIDER="gemini"
   GEMINI_API_KEY="AIzaSy..."
   ```

### AWS Bedrock (Claude Opus)

**Best for:** Enterprise, medical-grade analysis

**Pros:**
- ✅ Enterprise-grade
- ✅ Better reasoning
- ✅ Better for medical content
- ✅ Better compliance & privacy
- ✅ No rate limits on paid tier

**Setup:**
1. Create AWS account
2. Go to AWS Console → Bedrock
3. Enable Bedrock
4. Request model access (Claude Opus 4.6)
5. Create IAM user with Bedrock permissions
6. Get Access Key ID & Secret
7. Paste into `.env`:
   ```env
   AI_PROVIDER="bedrock"
   AWS_ACCESS_KEY_ID="AKIA..."
   AWS_SECRET_ACCESS_KEY="..."
   ```

### Switching Providers

**To switch from Gemini to Bedrock (or vice versa):**

1. Edit `.env`:
   ```bash
   # Change this line
   AI_PROVIDER="bedrock"    # was "gemini"
   ```

2. Restart server:
   ```bash
   npm run dev:api
   ```

That's it! No code changes needed.

---

## 🔌 API Endpoints

### Health Check

```http
GET http://localhost:8787/api/health
```

**Response:**
```json
{
  "ok": true,
  "provider": "gemini",
  "geminiModel": "gemini-2.5-flash",
  "bedrockModelId": "anthropic.claude-opus-4-6-v1",
  "region": "us-east-1"
}
```

### Chat Completion

```http
POST http://localhost:8787/api/ai/message
Content-Type: application/json
```

**Request Example:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "What are the symptoms of diabetes?"
        }
      ]
    }
  ],
  "systemPrompt": "You are a helpful medical assistant.",
  "maxTokens": 1400,
  "temperature": 0.2
}
```

**Response:**
```json
{
  "text": "Diabetes is a chronic condition characterized by elevated blood sugar levels. Common symptoms include..."
}
```

### Error Responses

**Invalid Provider:**
```json
{
  "error": "GEMINI_API_KEY is missing."
}
```

**Rate Limited:**
```json
{
  "error": "API rate limit exceeded. Please try again later."
}
```

---

## 🐛 Troubleshooting

### Issue: "API Key is invalid" / "Gemini request failed"

**Causes:**
- Key expired or revoked
- Key never existed
- Typo in `.env`

**Solution:**
1. Get new key: https://aistudio.google.com/app/apikey
2. Update `.env`
3. Restart: `npm run dev:api`

### Issue: "The security token included in the request is invalid" (Bedrock)

**Causes:**
- AWS credentials are wrong
- AWS credentials expired
- User doesn't have Bedrock permissions

**Solution:**
1. Check AWS Console for active credentials
2. Create new IAM user if needed
3. Ensure Bedrock permissions are set
4. Update `.env` with new credentials

### Issue: "Cannot find module" or "Module not found"

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Issue: Port 3000 or 8787 already in use

**Solution (Mac/Linux):**
```bash
# Find process
lsof -i :3000

# Kill process
kill -9 <PID>
```

**Solution (Windows):**
```bash
# Find process
netstat -ano | findstr :3000

# Kill process
taskkill /PID <PID> /F
```

### Issue: Frontend changes not showing up

**Causes:**
- Browser cache
- Build not updated
- Dev server crashed

**Solution:**
```bash
# Hard refresh
Cmd+Shift+R  (Mac)
Ctrl+Shift+R (Windows/Linux)

# Rebuild
npm run build

# Restart dev server
npm run dev
```

---

## 🔐 Security Best Practices

### Never Do This ❌

```bash
# ❌ DON'T commit .env to Git
git add .env

# ❌ DON'T hardcode keys in code
const API_KEY = "AIzaSy...";

# ❌ DON'T share keys in chat/email/Slack
"Here's my key: AKIA..."
```

### Always Do This ✅

```bash
# ✅ DO keep .env local only
# .env is in .gitignore

# ✅ DO use environment variables
process.env.GEMINI_API_KEY

# ✅ DO rotate keys after exposing them
# Go to API provider and revoke old key, create new
```

---

## 🎯 Roadmap

### ✅ Completed Features
- ✅ AI chat with Gemini & Bedrock
- ✅ Health assessments with AI analysis
- ✅ Maternal pregnancy guidance
- ✅ Multi-language support (EN/BN)
- ✅ Consultation history/records
- ✅ CI/CD with GitHub Actions
- ✅ Production deployment

### 📋 Future Plans
- 📋 Streaming chat responses
- 📋 Doctor dashboard
- 📋 Video consultation
- 📋 Hospital integration

---

## 📄 License

ISC License

---

## 👨‍💻 Author

**Khalid Muhammad**
- GitHub: [@km-wahid](https://github.com/km-wahid)
- Repository: [HelloDoc](https://github.com/km-wahid/HelloDoc)

---

<div align="center">

Made with ❤️ for better healthcare access

**Live Demo:** http://146.190.74.221:3000

</div>
