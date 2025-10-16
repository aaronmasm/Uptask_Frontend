# UpTask MERN — Frontend (React + TypeScript + Vite)

Frontend of the UpTask MERN application. This is the client-side app built with React, TypeScript, Vite, React Router, TanStack Query, Tailwind CSS, and Axios. It communicates with a separate Node/Express + MongoDB backend via a REST API.

Description: Web application to manage projects and tasks. Create and organize projects, manage tasks, and collaborate with your team. This repository contains the React frontend that consumes the backend API (Node/Express + MongoDB).

Note: This repository is the Frontend only (the “F” in MERN). The Backend lives in a separate project and must be running for full functionality.

Backend repository: https://github.com/aaronmasm/Uptask_Backend

## Tech Stack

- Language: TypeScript
- Framework: React 19
- Build tool/dev server: Vite 6 (@vitejs/plugin-react-swc)
- Routing: react-router-dom 7
- Data fetching/cache: @tanstack/react-query 5 (+ Devtools)
- HTTP client: axios
- Styling: Tailwind CSS 4
- Linting/formatting: ESLint 9, Prettier 3, lint-staged, Husky
- Package manager: npm (package-lock.json present)

## Requirements

- Node.js >= 18 (Vite 6 requires Node 18+)
- npm >= 9
- A running Backend API compatible with this frontend

## Environment Variables

Create a .env.local file in the project root.

Required:

- VITE_API_URL: Base URL of the backend API. Example:

```
VITE_API_URL=http://localhost:4000/api
```

Notes:

- Only variables prefixed with VITE\_ are exposed to the client.
- TODO: Add production API URL and any other required env vars if/when they exist.

## Getting Started

1. Install dependencies

```
npm install
```

2. Start the development server (Vite)

```
npm run dev
```

- Default URL: http://localhost:5173
- Hot Module Replacement (HMR) is enabled by Vite.

3. Build for production

```
npm run build
```

4. Preview the production build locally

```
npm run preview
```

## Available Scripts

- npm run dev: Start Vite dev server.
- npm run build: Type-check (tsc -b) and build with Vite to dist/.
- npm run preview: Preview the dist/ build locally.
- npm run lint: Run ESLint.
- npm run prepare: Husky Git hooks install.

Git hooks and formatting:

- lint-staged runs Prettier and ESLint on staged files according to package.json.
- Husky is configured via the prepare script (see .husky/ if present).

## Project Structure

A simplified view of key files/folders:

```
.
├─ public/
├─ src/
│  ├─ api/            # API calls (uses axios instance)
│  ├─ components/     # Reusable UI components
│  ├─ layouts/        # Layout components
│  ├─ lib/            # Libraries/utilities (e.g., axios.ts)
│  ├─ utils/          # Helpers, policies, etc.
│  ├─ views/          # Route views/pages
│  ├─ main.tsx        # React entry point
│  ├─ router.tsx      # App routes (react-router-dom)
│  └─ index.css       # Global styles (Tailwind)
├─ index.html         # Vite HTML entry (loads src/main.tsx)
├─ vite.config.ts     # Vite config; alias @ -> /src
├─ tsconfig*.json     # TypeScript configs
├─ eslint.config.js   # ESLint config
├─ vercel.json        # Vercel routing for SPA
├─ package.json
├─ package-lock.json
├─ README.md
└─ LICENSE
```

Conventions and aliases:

- Import alias @ maps to src (configured in vite.config.ts).

## Entry Points

- index.html includes <script type="module" src="/src/main.tsx"></script>
- src/main.tsx bootstraps React and wraps the app with QueryClientProvider.
- src/router.tsx defines routes using BrowserRouter.

## API Client

- src/lib/axios.ts creates a preconfigured axios instance:
  - baseURL: import.meta.env.VITE_API_URL
  - withCredentials: true (cookies/session handled by backend)
- Example API usage can be found under src/api/ (e.g., auth-api.ts).

## API Endpoints (High level)

Base URL: ${VITE_API_URL} (e.g., http://localhost:4000/api)

- /api/auth

  - POST /create-account
  - POST /confirm-account
  - POST /login
  - POST /logout
  - POST /request-code
  - POST /forgot-password
  - POST /validate-token
  - POST /update-password/:token
  - GET /user
  - PATCH /profile
  - PATCH /update-password
  - POST /check-password

- /api/projects
  - Projects: CRUD
  - Tasks: CRUD and status updates
  - Team members: add/remove
  - Notes

Note: Detailed per-route request/response shapes are defined in the backend controllers and validators. See the Backend repository: https://github.com/aaronmasm/Uptask_Backend for details.

## Styling

- Tailwind CSS v4 via @tailwindcss/vite plugin; styles entry at src/index.css.
- You may customize Tailwind according to Tailwind v4 conventions.

## Deployment

- Static build output is generated in dist/.
- Vercel: vercel.json includes a SPA route fallback so client-side routes resolve.
- Typical Vercel configuration:
  - Build Command: npm run build
  - Output Directory: dist
- TODO: Document the production URL and any CDN/hosting specifics if applicable.

## Troubleshooting

- Ensure the backend is running and VITE_API_URL points to it.
- If CORS/cookies are used, confirm backend CORS settings allow the frontend origin and credentials.
- Node version mismatches can cause Vite to fail; use Node 18+.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgements / TODO

- Based on Vite + React + TypeScript starter, adapted for the UpTask MERN frontend.
- Backend repository: https://github.com/aaronmasm/Uptask_Backend
- TODO: Provide full API documentation once available.
