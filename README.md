# Raver.ai - AI Creative Studio & Ad Platform 🚀

Raver.ai is a next-generation platform designed to streamline advertising workflows through advanced AI. It provides an intuitive Studio and Dashboard for generating, managing, and optimizing ad campaigns across various platforms (Instagram, Facebook, TikTok).

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: TypeScript

## 🚀 Getting Started

First, ensure you have the required environment variables. Create a `.env` file in the root of your project:

```env
# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

Next, install the dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

- `src/app/`: Next.js App Router pages (Home, Studio, Dashboard, Settings, etc.)
- `src/components/`: Reusable UI components (Modals, Cards, Sidebar, Layout)
- `public/`: Static assets (Logos, Images)

## ✨ Core Features

- **AI Creative Studio**: Multi-step wizard to generate ad creatives based on visual style, tone, and platform.
- **Agent Orchestration**: Monitor and manage specialized AI agents (Audience Optimizer, Content Analyst, Creative Director).
- **Campaign Dashboard**: Real-time performance metrics and active campaign management.
- **Premium UI/UX**: Designed with smooth animations, dark-mode aesthetics, and a glassmorphism feel.
