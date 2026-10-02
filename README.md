# SkillAssess AI — Cognitive Adaptive Assessment Platform

An intelligent, multi-provider diagnostic multiple-choice assessment platform with an Express backend, live stopwatch timer, cognitive hesitation analysis, and an interactive modern web application. Powered by Google Gemini (`gemini-1.5-flash`).

> 📚 For a complete deep-dive into the architecture, workflow diagram, cognitive algorithms, and technology stack, see [**PROJECT_OVERVIEW.md**](PROJECT_OVERVIEW.md).

---

## 🌟 Key Features

- **Google Gemini Integration (`gemini-1.5-flash`)**:
  - Dynamically crafts psychometric diagnostic MCQs targeting genuine conceptual misconceptions and cognitive traps.
  - Automatically balances option lengths, formats structured JSON, and shuffles options.
  - Robust rate-limit detection and exponential backoff retry system.
- **Smart Domain Knowledge Fallback Engine**:
  - Offline domain knowledge banks and procedural synthesizers across technical and non-technical disciplines (JavaScript, Python, Anatomy, Physics, Calculus, etc.).
  - Seamlessly engages if no API key is provided or if network/quota errors occur.
- **Live Per-Question Timer & Cognitive Hesitation Detection**:
  - Real-time stopwatch widget tracking response speed on every question.
  - Categorizes responses into a **Cognitive Diagnosis**:
    - ⚡ **Fluent Mastery** (Correct & < 20s): Effortless recall and intuitive grasp.
    - ✓ **Solid Understanding** (Correct on pace): Grounded conceptual knowledge.
    - ⏳ **Hesitant / High Cognitive Load** (Correct but > 35s): Correct answer under high mental strain.
    - 🚨 **Impulsive Misconception Trap** (Wrong & < 12s): Rushed into a common distractor trap.
    - 🛑 **Critical Skill Gap** (Wrong & > 35s): High struggle with missing foundational prerequisite.
- **Session Anti-Repetition & Memory**:
  - Word-level Jaccard similarity and duplicate prevention guarantee unique questions across test sessions.

---

## 🚀 Quickstart & Setup

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **Google Gemini API Key**: Free tier (no credit card required)

### 2. Installation
Clone or navigate to the project directory and install the dependencies:
```bash
npm install
```

### 3. Get a Free Google Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/apikey).
2. Sign in with your Google account.
3. Click **"Create API key"**.
4. Copy the generated key.

### 4. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Open `.env` and set your key:
```env
# Google Gemini API Key (https://aistudio.google.com/apikey)
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Choose Gemini Model (defaults to gemini-1.5-flash)
# GEMINI_MODEL=gemini-1.5-flash

# Server Port (Optional, defaults to 3000)
PORT=3000
```
*(Note: If no API key is provided, the platform automatically runs using the Offline Domain Knowledge Base).*

### 5. Run the Application
Start the Express server:
```bash
npm start
```
Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🧪 Verification & Testing

Run the automated integration test suite:
```bash
node test-flow.js
```
Runs a complete adaptive testing verification on technical and non-technical domains, checking deduplication, adaptive progression, and schema validation.