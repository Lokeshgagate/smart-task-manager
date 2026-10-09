# Smart Task Manager

A full-stack task manager built with Next.js, Express, and Tailwind CSS.

## Features

- Mock user selection and task assignment
- Task creation, updates, deletion, and priority filtering
- Task dependencies and blocked-task views
- Responsive interface

## Run Locally

Requires Node.js 20.9 or newer.

In one terminal:

```bash
cd backend
npm ci
npm start
```

In another terminal:

```bash
cd frontend
npm ci
npm run dev
```

The frontend runs at `http://localhost:3000`; the API runs at `http://localhost:5000`.
To use a different API origin, set `NEXT_PUBLIC_API_URL` in `frontend/.env.local`.

## Deploy

The repository includes a Render Blueprint that creates the Next.js web service and
Express API together. Push this repository to GitHub, then in Render choose **New**
> **Blueprint**, connect `Lokeshgagate/smart-task-manager`, and deploy the services
from `render.yaml`. The frontend is configured to use the API service automatically.

The demo stores tasks and users in memory. They reset whenever the API restarts or
spins down; use a persistent database before relying on this deployment for real data.

## Structure

- `backend/`: Express API and in-memory data store
- `frontend/`: Next.js App Router application
