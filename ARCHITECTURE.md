# RAVER AI System Architecture

This document provides a detailed technical overview of the RAVER AI platform architecture, covering the frontend application, backend services, and AI orchestration layer.

---

## 1. High-Level Overview

RAVER AI follows a **Decoupled Client-Server Architecture**. The system is designed to handle complex, multi-stage AI creative workflows while maintaining a highly responsive and premium user experience.

- **Frontend**: A React-based Next.js application that serves as the "Creative Studio" and command center.
- **Backend**: A modular Node.js API that orchestrates various AI "Lead" services and manages data persistence via Prisma.
- **AI Layer**: An orchestration layer that interfaces with multiple LLMs (Gemini, GPT) and specialized generative models (ElevenLabs, Fal.ai).

---

## 2. Major Libraries & Dependencies

The RAVER AI Frontend leverages a modern ecosystem of libraries to provide a premium and highly interactive experience:

### Core Framework
- **Next.js 16**: Utilizing the latest App Router patterns for optimized performance and routing.
- **React 19**: Leveraging concurrent rendering and state-of-the-art hook patterns.

### UI & UX
- **Framer Motion**: Powering smooth, production-grade animations and transitions (Modals, Pipelines, Hover states).
- **Lucide React**: Providing a consistent and accessible SVG icon library.
- **React-Toastify**: Standardized notification system for professional user feedback.
- **Recharts**: For high-performance, responsive data visualizations in the Campaign Insights dashboard.
- **React-Markdown**: Safely rendering structured AI-generated responses with proper formatting.

### Styling & Utilities
- **Tailwind CSS 4**: A utility-first CSS framework for rapid and consistent UI development.
- **clsx & tailwind-merge**: Utilities for constructing and merging Tailwind classes efficiently.
- **TypeScript**: Ensuring type safety and robust development across the entire codebase.

---

## 3. Frontend Architecture (Next.js)

### 3.1 Technology Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **State Management**: 
    - **Global**: React Context API (`UserContext`, `NotificationContext`)
    - **Local**: React Hooks (`useState`, `useReducer`) for complex form states in the Studio.
- **Styling**: Tailwind CSS 4 with a strict custom design system for typography and brand colors.
- **Feedback**: React-Toastify for non-blocking notifications.

### 3.2 Core Modules
- **AI Creative Studio**: A multi-step state machine (`CreateCampaignModal`) that tracks campaign strategy across 4 stages.
- **Production Pipeline**: A real-time monitoring system that polls for status updates during the AI generation lifecycle.
- **Asset Library**: A centralized viewer with asset normalization logic to handle diverse media types and sources.

---

## 4. Backend Architecture (Node.js)

### 4.1 Modular Structure
The backend is organized into domain-driven modules, each encapsulated with its own controllers and services.

#### Key Modules:
- **`auth`**: Handles secure authentication and identity.
- **`campaign`**: Manages campaign lifecycle, from draft to active production.
- **`ai-director`**: The "High-Level AI" that interprets user briefs and coordinates "Leads".
- **`ai-producer`**: The "Operational AI" that executes asset generation and assembly.
- **`project`**: Logical grouping of related campaigns and assets.

### 4.2 Data Layer
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Key Models**:
    - `User`: Profile and preferences.
    - `Campaign`: Strategy metadata, configuration, and status.
    - `Asset`: Media file metadata, source URLs, and type tagging.

---

## 5. AI Orchestration Flow

RAVER AI uses a unique **Multi-Agent Orchestration** model:

1. **User Input**: A prompt or brief is received via the Frontend.
2. **Director Analysis**: The `ai-director` breaks the brief into technical sub-tasks.
3. **Lead Execution**:
    - **Copy Lead**: Generates ad scripts.
    - **Image Lead**: Generates visuals.
    - **Audio Lead**: Generates voiceovers.
4. **Assembly**: The `ai-producer` gathers all outputs and finalizes the creative assets.

---

## 6. Design & UI Standards

### 6.1 Typography
- **Headings**: `font-bold` using the **Outfit** font family.
- **Body**: `font-normal` using the **Inter** font family.
- **Consistency**: All typography is standardized to eliminate legacy overrides and ensure brand alignment.

### 6.2 Interactive Patterns
- **Modals**: Sidebar-style slide-ins for creation; centered overlays for confirmations.
- **Input Fields**: Standardized `Input` component with integrated password visibility toggles and validation error "divs".
- **Scrolling**: Viewport-aware containers with thin custom scrollbars to prevent UI congestion.

---

## 7. Infrastructure & DevOps

- **Containerization**: Fully Dockerized environment (`Dockerfile`, `docker-compose.yml`).
- **API Proxy**: Next.js custom rewrites handle secure communication with the `apiplatform.raver.ai` gateway.
- **Asset Hosting**: Standardized URL normalization for both local and cloud-hosted media.

---

## 8. Security

- **JWT Authentication**: All API requests are secured via JSON Web Tokens.
- **Role-Based Access**: Permission checks at the controller level to ensure data privacy between users.
- **Input Sanitization**: Client and server-side validation to prevent injection and ensure data integrity.
