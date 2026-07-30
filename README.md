# Task Management Application

A production-minded, full-stack task management application built for team collaboration. Authenticated users can create projects, manage project members, assign tasks, track task progress through an interactive Kanban board, and filter tasks by status, priority, and assignee while enforcing strict backend access control.

---

## Overview

TaskPulse provides team members and managers with a centralized dashboard to streamline task delegation and tracking. Built with Node.js, Express, MongoDB, and React, the system emphasizes solid backend security, robust architecture, centralized validation and error handling, role-based authorization, and an intuitive user interface.

---

## Features

- **Authentication & Security**: Secure User Registration and Login using JWT and bcrypt password hashing.
- **Role-Based Access Control (RBAC)**: Admin and Member roles with server-side authorization enforcement.
- **Resource Authorization**: Project access control ensuring non-members cannot view or modify private project data.
- **Project Management**: Create projects, view accessible projects, update project details, and delete projects.
- **Member Collaboration**: Project creators and Admins can add or remove members to/from projects.
- **Task Management & Kanban Board**: Create, edit, assign, reorder, and delete tasks within projects.
- **Task Filtering**: Multi-criteria query filtering by `status`, `priority`, and `assignee`.
- **Centralized Error Handling & Validation**: Strict request body validation via `express-validator` and standard JSON error structure.
- **Automated Integration Testing**: Comprehensive test suite using Jest and Supertest against an in-memory MongoDB environment.

---

## Technology Stack

### Backend
- **Runtime**: Node.js (v24.x)
- **Framework**: Express.js (v4.x)
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs`
- **Validation**: `express-validator`
- **Security**: `helmet`, `cors`, `express-rate-limit`
- **Testing**: Jest, Supertest, `mongodb-memory-server`

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM (v6)
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Styling**: Modern CSS System with Glassmorphism, HSL color tokens, dark mode palette, and micro-animations.

---

## Architecture

The project adheres to a standard 3-tier architecture with separation of concerns:

```
[ Client (React/Vite) ] <--- HTTP/REST (JSON + JWT) ---> [ Controller Layer ]
                                                                 │
                                                          [ Service Layer ]
                                                                 │
                                                           [ Model Layer ]
                                                                 │
                                                        [ MongoDB Database ]
```

- **Routes**: Define endpoint URLs and attach middleware chains.
- **Validators**: Centralized request schema validators using `express-validator`.
- **Middleware**: Intercepts requests for authentication (`protect`), role checks (`authorize`), and global error handling.
- **Controllers**: Handle HTTP request/response handling.
- **Services**: Enforce domain business logic and database interactions.
- **Models**: Mongoose schemas defining fields, indexes, hooks, and relationships.

---

## Project Structure

```
Power_Pi_Task/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── project.controller.js
│   │   │   ├── task.controller.js
│   │   │   └── user.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   ├── notFound.middleware.js
│   │   │   ├── role.middleware.js
│   │   │   └── validate.middleware.js
│   │   ├── models/
│   │   │   ├── Project.js
│   │   │   ├── Task.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── project.routes.js
│   │   │   ├── task.routes.js
│   │   │   └── user.routes.js
│   │   ├── services/
│   │   │   ├── auth.service.js
│   │   │   ├── project.service.js
│   │   │   └── task.service.js
│   │   ├── utils/
│   │   │   ├── apiResponse.js
│   │   │   └── generateToken.js
│   │   ├── validators/
│   │   │   ├── auth.validator.js
│   │   │   ├── project.validator.js
│   │   │   └── task.validator.js
│   │   ├── app.js
│   │   ├── seed.js
│   │   └── server.js
│   ├── tests/
│   │   ├── auth.test.js
│   │   ├── projects.test.js
│   │   └── tasks.test.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── ProjectDetailsPage.jsx
│   │   │   ├── ProjectsPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── Task_Management_API.postman_collection.json
├── package.json
└── README.md
```

---

## Database Design

### User Model
- `name` (String, required)
- `email` (String, required, unique, lowercase, trimmed)
- `password` (String, required, min length 6, excluded from normal query results)
- `role` (String, enum: `['Admin', 'Member']`, default: `'Member'`)
- Timestamps (`createdAt`, `updatedAt`)

### Project Model
- `name` (String, required, trimmed)
- `description` (String, default: `''`)
- `createdBy` (ObjectId, ref: `'User'`, required)
- `members` (Array of ObjectId, ref: `'User'`)
- Timestamps (`createdAt`, `updatedAt`)

### Task Model
- `title` (String, required, trimmed)
- `description` (String, default: `''`)
- `status` (String, enum: `['To Do', 'In Progress', 'Done']`, default: `'To Do'`)
- `priority` (String, enum: `['Low', 'Medium', 'High']`, default: `'Medium'`)
- `dueDate` (Date, default: null)
- `creator` (ObjectId, ref: `'User'`, required)
- `assignee` (ObjectId, ref: `'User'`, default: null)
- `project` (ObjectId, ref: `'Project'`, required)
- Timestamps (`createdAt`, `updatedAt`)

---

## Authentication

Authentication is managed using Bearer JWT tokens.

1. **Registration** (`POST /api/auth/register`): Hashes password using `bcryptjs` (salt round 10) and creates a `Member` account. Returns JWT token and user info.
2. **Login** (`POST /api/auth/login`): Verifies credentials and generates a JWT signed with `JWT_SECRET`.
3. **Current Profile** (`GET /api/auth/me`): Verifies `Authorization: Bearer <token>` header and returns user profile.

---

## Authorization

1. **Role-Based Authorization**:
   - `Admin`: Global access across projects and member operations.
   - `Member`: Access restricted strictly to projects they created or belong to as members.
2. **Resource-Level Authorization**:
   - Implemented in `ProjectService` and `TaskService`. Requests for project or task resources verify membership before executing operations.
   - Unauthorized attempts return `403 Forbidden`.

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new account
- `POST /api/auth/login` - Authenticate user
- `GET /api/auth/me` - Fetch authenticated user info

### Users
- `GET /api/users` - List registered users (for member addition & task assignment)

### Projects
- `POST /api/projects` - Create a new project
- `GET /api/projects` - Get projects accessible to user
- `GET /api/projects/:projectId` - Get project details
- `PATCH /api/projects/:projectId` - Update project details
- `DELETE /api/projects/:projectId` - Delete project & associated tasks
- `POST /api/projects/:projectId/members` - Add member to project
- `DELETE /api/projects/:projectId/members/:userId` - Remove member from project

### Tasks
- `POST /api/projects/:projectId/tasks` - Create a task
- `GET /api/projects/:projectId/tasks` - List tasks (Supports filtering `?status=...&priority=...&assignee=...`)
- `GET /api/projects/:projectId/tasks/:taskId` - Get task by ID
- `PATCH /api/projects/:projectId/tasks/:taskId` - Update task status/fields
- `DELETE /api/projects/:projectId/tasks/:taskId` - Delete task

---

## Environment Variables

### Backend Environment Configuration (`backend/.env.example`)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task_management_app
JWT_SECRET=super_secret_jwt_key_change_in_production_12345
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend Environment Configuration (`frontend/.env.example`)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Installation

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

---

## Running the Application

### Option A: Development Mode

1. **Start Backend API**:
   ```bash
   cd backend
   npm run dev
   ```
   *Note: If no local MongoDB is running on port 27017, the application automatically launches an in-memory MongoDB server instance seamlessly!*

2. **Start Frontend Dev Server**:
   ```bash
   cd frontend
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## Database Seed

To populate the database with initial users, sample projects, and tasks:

```bash
cd backend
npm run seed
```

### Seed Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@example.com` | `Admin123!` |
| **Member** | `member@example.com` | `Member123!` |

---

## Testing

Run automated backend integration tests covering registration, authentication, authorization, access control, task creation, and query filtering:

```bash
cd backend
npm test
```

Test results execute against an isolated in-memory MongoDB database.

---

## Postman Collection

A complete Postman collection is included in the project root:
`Task_Management_API.postman_collection.json`

### How to Import and Use:
1. Open Postman.
2. Click **Import** and select `Task_Management_API.postman_collection.json`.
3. The collection includes pre-configured tests that automatically extract and populate variables:
   - `baseUrl` (`http://localhost:5000/api`)
   - `token` (populated automatically upon running **Login User**)
   - `projectId` (populated automatically upon running **Create Project**)
   - `taskId` (populated automatically upon running **Create Task**)

---

## Security Considerations

- **Password Safety**: Passwords are hashed with `bcryptjs` with salt round 10. Passwords are set with `select: false` in the Mongoose schema to prevent leak in queries.
- **JWT Protection**: Tokens contain payload claims and expire in configurable windows (`JWT_EXPIRES_IN`).
- **HTTP Security Headers**: `helmet` is enabled to set security headers.
- **Input Validation & Sanitization**: Request inputs are validated via `express-validator` to protect against injection and invalid parameters.
- **CORS Protection**: Access control headers restricted to configured `CLIENT_URL`.

---

## Design Decisions

1. **Fallback Database Connection**: `db.js` includes automated fallback to `mongodb-memory-server` if local MongoDB is offline, enabling immediate out-of-the-box execution for reviewers.
2. **Cascade Deletion**: Deleting a project automatically cleans up all associated task documents to avoid orphan records.
3. **Explicit API Error Responses**: API returns standardized JSON envelopes `{ success: boolean, message: string, data?: object, errors?: array }` for predictable client consumption.
