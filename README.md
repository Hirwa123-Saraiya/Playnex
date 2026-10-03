# 🏆 The Champions Club - Sports Club Management System
> Built for the Odoo Hackathon • Digital backbone of a modern sports club that has outgrown WhatsApp & Excel.

---

## 🏗️ Architecture & Stack Overview

- **Backend:** Node.js (Express + JavaScript, ES Modules)
- **Frontend:** React + TypeScript (Vite + Tailwind CSS + Lucide Icons)
- **Environment:** Single **Unified Root `.env`** shared seamlessly across Backend and Frontend.

---

## 📁 Repository Structure (Initial First Commit)

```text
Playnex/
├── .env                  # Common environment variables (Backend & Frontend)
├── .env.example          # Template environment file
├── .gitignore            # Clean git exclusion rules
├── package.json          # Root runner scripts (dev:backend, dev:frontend)
├── problem statement.md  # Complete problem statement with Odoo branding
├── odoo_logo.svg         # Official Odoo vector asset
│
├── backend/              # Node.js (JavaScript) Engine
│   ├── package.json      # Backend dependencies & watch scripts
│   └── src/
│       ├── config/
│       │   └── env.js    # Loads common root .env dynamically
│       ├── controllers/  # Controllers placeholder (Members, Courts, Shop, Bar, Leads, Owner)
│       ├── middlewares/
│       │   └── errorHandler.js # Global error handler
│       ├── routes/
│       │   └── index.js  # Base API routes with /health endpoint
│       ├── utils/
│       │   └── apiResponse.js # Unified ApiResponse standard wrapper
│       └── server.js     # Express entrypoint with CORS & logging
│
└── frontend/             # React + TypeScript (Vite)
    ├── index.html        # HTML shell with Odoo branding
    ├── package.json      # React, TypeScript, Tailwind, Lucide dependencies
    ├── postcss.config.js # PostCSS configuration
    ├── tailwind.config.js# Tailwind CSS design system tokens
    ├── tsconfig.json     # Strict TypeScript configuration
    ├── vite.config.ts    # Configured with envDir: '../' (reads root .env)
    ├── public/
    │   └── odoo_logo.svg # Asset accessible to browser
    └── src/
        ├── components/
        │   ├── common/   # Reusable UI widgets
        │   └── layout/   # Navigation shells
        ├── services/
        │   └── api.client.ts # Typed HTTP client (fetch/axios style)
        ├── types/
        │   └── api.types.ts  # Standard ApiResponse<T> interface
        ├── App.tsx       # Main dashboard layout with live backend health indicator
        ├── main.tsx      # React DOM entry
        └── index.css     # Global styles & Tailwind directives
```

---

## ⚙️ Environment Variables (Single Root `.env`)

Both the backend server and Vite frontend automatically load settings from the shared root `.env`:

```env
# Backend (Node.js)
PORT=8000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Frontend (Vite / React)
VITE_API_URL=http://localhost:8000/api/v1
VITE_APP_NAME="The Champions Club"
```

---

## 🚀 Quickstart Commands

### 1. Run the Backend (Node.js)
```bash
npm run dev:backend
# or: cd backend && npm run dev
# -> Server runs on http://localhost:8000
# -> Health check: http://localhost:8000/api/v1/health
```

### 2. Run the Frontend (React + TypeScript)
```bash
npm run dev:frontend
# or: cd frontend && npm run dev
# -> App runs on http://localhost:5173
```
