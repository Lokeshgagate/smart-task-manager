# Smart Task Manager - Full Stack Application

A full-stack task management application built with Next.js, Node.js/Express, and Tailwind CSS.

## 🚀 Features
- **User Authentication:** Mock login system supporting multiple Indian user personas.
- **Task Management:** Create, update, delete, and view tasks.
- **Task Dependencies:** Define dependencies between tasks (tasks are blocked until dependent tasks are completed).
- **Filtering & Views:** Filter tasks by priority (Low, Medium, High) and view user-assigned tasks.
- **Responsive UI:** Clean interface styled with Tailwind CSS.

---

## 🛠️ Project Setup & Local Run Instructions

### Prerequisites
Make sure you have **Node.js** (v18 or higher) installed on your system.

---

### 1. Backend Setup
Navigate to the `backend` directory, install dependencies, and start the server:

```bash
cd backend
npm install
npm start
The backend server will start on http://localhost:5000 (or configured port).


2. Frontend Setup
Open a new terminal, navigate to the frontend directory, install dependencies, and start the development server:

Bash
cd frontend
npm install
npm run dev
The frontend application will be live at http://localhost:3000.

📁 Repository Structure
smart-task-manager/
├── backend/    # Express API, mock data store, task routes
└── frontend/   # Next.js App Router, React components, Tailwind styling
