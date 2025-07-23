# AI Model Leaderboard

This project is a web app for displaying and managing a leaderboard of AI models. It uses Next.js, React, Tailwind CSS, and Supabase for the backend database.

## Features
- View a ranked list of AI models with scores for different metrics
- Filter and sort by metrics like Overall Intelligence, Speed, Cost Efficiency, and Coding
- Add new models through a simple admin interface (/admin)
- Responsive design with dark mode support

## Setup
1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
2. **Set up environment variables:**
   - Create a `.env.local` file in the project root:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
     ```
   - Never commit your real keys to public repos.
3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
4. **Open your browser:**
   Go to [http://localhost:3000](http://localhost:3000) for the leaderboard, or [http://localhost:3000/admin](http://localhost:3000/admin) to add models.

## Usage
- The homepage shows the leaderboard. Use the buttons to sort by different metrics.
- The admin page lets you add new models with all required fields.

## Security & Best Practices
- All database credentials are stored in environment variables and never exposed in the codebase.
- All user input is validated on the client before being sent to the database.
- Errors are caught and displayed to the user.
- The Supabase anon key is for public, non-privileged access only. For sensitive operations, use RLS (Row Level Security) and server-side logic.

## Security Note

- Never commit real secrets, API keys, or admin credentials to a public repo.
- Always use environment variables (like `.env.local`) for all secrets and credentials.
- The admin credentials for this project are loaded from `.env.local` as `ADMIN_USERNAME` and `ADMIN_PASSWORD`.
- If you deploy this project, set strong, unique credentials and keep your repo private if you use real data or access.

## Tech Stack
- Next.js
- React
- Tailwind CSS
- Supabase


