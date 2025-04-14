# FinWell - Not Just Tracking. Transforming.

**FinWell** is a modern, AI-powered financial management platform designed to provide insights to the user by analyzing their transaction history and thus help users track, analyze, and optimize their spending habits in a smart, interactive way. With seamless PDF parsing, AI-generated insights, goal tracking — FinWell makes managing money feel less like a chore and more like a win.

---

## ✨ Features

- **Dashboard Overview**: Get a quick summary of your financial health, including total income, expenses, savings, and visual spending analytics.
- **AI-Powered Insights**: Receive actionable financial suggestions, alerts, and even humorous taunts powered by Google's Gemini AI.
- **Transaction Management**: Upload bank statements (PDF) or manually input transactions. Auto-categorized and stored securely.
- **Goal Setting**: Create financial goals (e.g. emergency fund, vacation, rent) with target timelines and real-time progress.
- **Reports & Visuals**: Detailed breakdowns, trend detection, category-wise charts, and daily expense timelines.
- **Security First**: Supabase-authenticated access for protecting sensitive data.

---

## 🛠 Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, shadcn/ui, Lucide Icons
- **Backend**: Supabase (DB, Auth), Flask (PDF parsing API)
- **AI Integration**: Google Gemini API (text analysis)
- **Build Tool**: Vite
- **State Management**: React Query
- **Animations**: TailwindCSS Animate

---

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase project with URL & anon key

### Steps
```bash
# 1. Clone the repository
$ git clone https://github.com/your-repo/finwell-dashboard.git
$ cd finwell-dashboard

# 2. Install frontend dependencies
$ cd client
$ npm install

# 3. Install backend (Flask) dependencies
$ cd ../server
$ npm install

# 4. Add environment variables
# In server/.env
SUPABASE_URL="your-supabase-url"
SUPABASE_KEY="your-supabase-key"

# 5. Run the project
# Frontend
$ cd client && npm run dev

# Backend (Flask or Node)
$ cd ../server && npm start

# Access the app at http://localhost:3000
```
---

## 💠 Development Scripts

### Frontend
- `npm run dev` – Start Vite dev server
- `npm run build` – Build production app
- `npm run preview` – Preview prod build

### Backend
- `npm start` – Start Flask server

---

## 🤝 Contributing

Contributions are welcome! Follow the steps:
1. Fork the repo
2. Create a feature branch
3. Push your changes
4. Open a Pull Request ✨

---

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for auth & DB
- [Lucide Icons](https://lucide.dev) for icon set
- [Google Gemini](https://makersuite.google.com) for AI insights
- [TailwindCSS](https://tailwindcss.com) for design system
- [Shadcn/ui](https://ui.shadcn.com) for polished React components

Built at AIRAVAT Hackathon by IEEE SPIT by team **MindFlairs**
