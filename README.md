# HireFlow — Enterprise Recruitment Platform (Frontend)

> A modern, responsive React single-page application built with **React 18, TypeScript, Vite, Tailwind CSS, TanStack Query v5, Axios, and React Hook Form**.

---

## 🚀 Live Application & Backend URLs

- **Live Frontend Application**: `https://hireflow.vercel.app` *(or configured Vercel domain)*
- **Identity Microservice API**: `http://localhost:5001` (Prod: `https://hireflow-identity.onrender.com`)
- **Hiring Microservice API**: `http://localhost:5002` (Prod: `https://hireflow-hiring.onrender.com`)

---

## 🛠️ Technology Stack

| Area | Technology | Purpose |
| --- | --- | --- |
| **Framework** | React 18 + TypeScript | UI component library with strict type safety |
| **Build Tool** | Vite 5 | Lightning-fast HMR and production bundling |
| **Styling** | Tailwind CSS v4 | Utility-first responsive styling & design tokens |
| **Server State** | TanStack Query v5 | Automatic caching, retries, loading states, server-state sync |
| **HTTP Client** | Axios | Typed HTTP clients with JWT refresh rotation interceptors & correlation tracing |
| **Forms & Validation** | React Hook Form + Zod | High-performance forms with schema validation |
| **Routing** | React Router v6 | Client-side routing with role-based route guards |
| **Icons** | Lucide React | Clean, consistent icons |
| **Testing** | Vitest + Testing Library | Unit, component, and integration testing |

---

## 📐 Architecture & Microservice Integration

```
                         +-----------------------------------+
                         |         React Web Client          |
                         |  (Vite + TypeScript + Tailwind)   |
                         +-----------------+-----------------+
                                           |
                                     HTTPS / JSON
                             Axios Client + Interceptors
                     (Bearer Auth + Correlation ID + Token Refresh)
                                           |
               +---------------------------+---------------------------+
               |                                                       |
       +-------v-------+                                       +-------v-------+
       | Identity API  | (Port 5001)                           | Hiring API    | (Port 5002)
       | Auth, Users,  |                                       | Jobs, Apps,   |
       | OTP, Tokens   |                                       | Interviews    |
       +---------------+                                       +---------------+
```

---

## 📋 Implementation Progress

- [x] **Phase 1: Project Setup & Base Infrastructure** — Vite React TS initialization, Tailwind v4, Axios microservice clients with `X-Correlation-ID`, TanStack Query, `vercel.json` SPA rules.
- [x] **Phase 2: Authentication System & Session State** — JWT token management, Axios 401 refresh token rotation interceptor, Auth Context, Route Guards (`RequireAuth`, `RequireRole`), Login, Candidate Registration, Email OTP Verification, and Password Reset screens.
- [x] **Phase 3: Core UI Framework & Shared Components** — Enterprise UI primitives (Button, Input, Select, Badge, Modal, Drawer, DataTable, Toast Context) and layout shells (Public & App navigation sidebars).
- [x] **Phase 4: Public Job Portal & Search** — Public job listings (`/jobs`), debounced search, filters (location, mode, employment type), job details (`/jobs/:id`), and candidate application submission modal.
- [x] **Phase 5: Candidate Portal & Applications Workflow** — My Applications table (`/candidate/applications`), stage history timeline view (`/candidate/applications/:id`), withdraw modal, and Scheduled Interviews calendar (`/candidate/interviews`).
- [x] **Phase 6: Recruiter & Hiring Manager Portal** — Hiring dashboard KPIs (`/recruiter/dashboard`), Jobs table (`/recruiter/jobs`), Create job modal, Close job modal, Applicant screening drawer (`/recruiter/applications`), and Schedule interview modal.
- [x] **Phase 7: Admin Portal & System Audit** — User management & role assignment (`/admin/users`) and immutable platform audit log viewer (`/admin/audit-logs`).
- [ ] **Phase 8: Automated Tests & Vercel Live Deployment** — Vitest test suites & pushing to live production Vercel environment.

---

## 💻 Local Development Setup

### Prerequisites

- **Node.js**: `v20.0.0` or higher
- **npm**: `v10.0.0` or higher

### Step-by-step Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/<your-username>/hireflow-frontend.git
   cd hireflow-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env.development`:
   ```bash
   cp .env.example .env.development
   ```

   Verify your local backend API URLs:
   ```env
   VITE_IDENTITY_API_BASE_URL=http://localhost:5001
   VITE_HIRING_API_BASE_URL=http://localhost:5002
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   ```
