# AI Model Leaderboard

A modern, responsive leaderboard web app built with Next.js and Tailwind CSS, showcasing the latest AI models from top companies. Easily filter models by category (Coding, Writing, Reasoning, Multimodal) to compare their scores and features.

## Features

- 🏆 Clean, professional leaderboard UI
- 🏢 Displays model name, company, category, and score
- 🔍 Category filtering with interactive buttons
- 💻 Responsive design for desktop and mobile
- 🌙 Dark mode support (follows system preference)
- ⚡ Built with Next.js App Router and Tailwind CSS

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000) to view the leaderboard.

## Usage

- The homepage displays a ranked list of AI models with their company, category, and score.
- Use the filter buttons at the top to view models by category (e.g., Coding, Writing, Reasoning, Multimodal) or show all models.
- The leaderboard is fully responsive and works great on all devices.

## Customization

- To add or update models, edit the `models` array in `src/app/page.tsx`.
- To change categories, update the `categories` array and model objects in the same file.

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## License

MIT. Feel free to use and modify for your own projects!
