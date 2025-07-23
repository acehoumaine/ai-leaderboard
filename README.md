# AI Model Leaderboard

A simple, modern leaderboard for comparing top AI models by intelligence, speed, cost efficiency, and more. Filter and search by company or model name. Data is synced from Artificial Analysis.

---

**Why?**
> As a tech sales professional, this is my humble (and slightly desperate) attempt to revive my engineering background. If it works, great. If not, at least I tried.

---

## Features
- See and compare the latest AI models
- Filter by company (OpenAI, Anthropic, Google, etc.)
- Search for models or companies
- Sort by intelligence, speed, cost efficiency, or coding
- Data is always up to date (syncs from Artificial Analysis)

## Quick Start
1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
2. **Set up your environment:**
   - Copy `.env.local.example` to `.env.local` and add your Supabase and Artificial Analysis API keys.
3. **Run the app:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
4. **Visit:**
   - Home: [http://localhost:3000](http://localhost:3000)
   - Admin (sync data): [http://localhost:3000/admin]

## Tech Stack
- Next.js (App Router)
- React
- Tailwind CSS
- Supabase (Postgres)

## Security
- No secrets or credentials are committed to the repo.
- All keys are loaded from `.env.local`.
- Admin login is required to sync data.

---

**Built for fun, learning, and a little bit of professional redemption.**


