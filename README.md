# Raver.ai - AI Creative Studio & Ad Platform 🚀

[![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

Raver.ai is a next-generation platform designed to streamline advertising workflows through advanced AI. It provides an intuitive Studio and Dashboard for generating, managing, and optimizing ad campaigns across various platforms (Instagram, Facebook, TikTok).

---

## ✨ Core Features

- **🎨 AI Creative Studio**: Multi-step wizard to generate ad creatives based on visual style, tone, and platform.
- **🤖 Agent Orchestration**: Monitor and manage specialized AI agents (Audience Optimizer, Content Analyst, Creative Director).
- **📊 Campaign Dashboard**: Real-time performance metrics and active campaign management.
- **💎 Premium UI/UX**: Designed with smooth animations (Framer Motion), dark-mode aesthetics, and a glassmorphism feel.

---

## 🛠 Tech Stack

### Core Frameworks
- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Architecture**: React Server Components (RSC)

### Styling & Visuals
- **CSS**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)

### State & Utilities
- **Data Fetching**: Custom API wrappers with standard error handling.
- **Notifications**: [React Toastify](https://fkhadra.github.io/react-toastify/)
- **Formatting**: `clsx` and `tailwind-merge` for dynamic styling.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.17.0 or higher
- **NPM**: v9 or higher
- **Docker** (Optional, for containerized deployment)

### 1. Environment Configuration
Copy the template file and adjust the variables:
```bash
cp .env.example .env
```

| Variable | Description | Default |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Base URL for the Backend API | `http://localhost:8000/api` |
| `NEXT_PUBLIC_BACKEND_URL` | Base URL for static assets/server | `http://localhost:8000` |

### 2. Local Development
Install dependencies and start the dev server:
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the application.

### 3. Production Build
```bash
npm run build
npm run start
```

### 🐳 Docker Setup
Run the application in a containerized environment:
```bash
# Build the image
docker build -t ravi-ai-frontend .

# Run the container
docker run -p 3000:3000 --env-file .env ravi-ai-frontend
```

---

## 📂 Project Structure

- `src/app/`: Next.js App Router pages and layouts.
- `src/components/`: Modular UI components (Dashboard, Studio, Agents).
- `src/context/`: React Context providers for global state (e.g., User, Notifications).
- `src/lib/`: Utility functions and shared library configurations.
- `public/`: Static assets such as logos and brand images.

---

## 🔌 Related Documentation

Detailed documentation for the backend API and database schemas can be found in:
👉 **[BACKEND.md](./BACKEND.md)**

---

## 🛡 Security & Contributing

### Security
If you discover any security-related issues, please avoid using the public issue tracker and instead contact the maintainers directly at [security@raver.ai](mailto:security@raver.ai).

### Contributing
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.
