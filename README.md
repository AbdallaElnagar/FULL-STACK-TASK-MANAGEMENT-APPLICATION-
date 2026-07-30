# Task Management Application

A production-minded full-stack task management application built for team collaboration.

Authenticated users can create and manage projects, collaborate with project members, create and assign tasks, track progress through an interactive Kanban board, and filter tasks by status, priority, and assignee.

The application emphasizes secure authentication, role-based authorization, resource-level access control, validation, centralized error handling, automated testing, and a responsive user experience.

---

## Overview

**Task Management Application** provides teams with a centralized workspace for managing projects and tracking tasks.

The application consists of:

- A RESTful Node.js/Express backend
- A MongoDB database using Mongoose
- A React/Vite frontend
- JWT-based authentication
- Role-based and resource-level authorization
- Automated backend integration tests
- Postman API collection
- Seed data for development and evaluation

---

## Features

### Authentication & Security

- User registration and login
- JWT-based authentication
- Secure password hashing with bcrypt
- Protected API routes
- Configurable JWT expiration
- Helmet security headers
- CORS configuration
- Rate limiting for protected endpoints where applicable
- Server-side validation and sanitization

### Authorization

- Two roles: `Admin` and `Member`
- Role-based authorization
- Project-level resource authorization
- Users can only access projects they are authorized to access
- Backend authorization is enforced independently from frontend restrictions

### Project Management

- Create projects
- View accessible projects
- View project details
- Update projects
- Delete projects
- Add project members
- Remove project members

### Task Management

- Create tasks
- View tasks
- Update tasks
- Delete tasks
- Assign tasks to users
- Update task status
- Set task priority
- Set due dates
- Interactive Kanban board

### Task Filtering

Tasks can be filtered by:

- Status
- Priority
- Assignee

Multiple filters can be combined in a single request.

### Validation & Error Handling

- Centralized request validation using `express-validator`
- Consistent API response structure
- Centralized error handling
- Proper HTTP status codes
- MongoDB and validation error handling

### Automated Testing

- Jest
- Supertest
- MongoDB Memory Server
- 10 integration tests covering authentication, authorization, project access, task creation, task authorization, and filtering

---

# Technology Stack

## Backend

| Technology            | Purpose                    |
| --------------------- | -------------------------- |
| Node.js               | Runtime                    |
| Express.js            | REST API framework         |
| MongoDB               | Database                   |
| Mongoose              | ODM                        |
| JSON Web Token        | Authentication             |
| bcryptjs              | Password hashing           |
| express-validator     | Request validation         |
| Helmet                | HTTP security headers      |
| CORS                  | Cross-origin configuration |
| express-rate-limit    | Rate limiting              |
| Jest                  | Testing framework          |
| Supertest             | API integration testing    |
| mongodb-memory-server | Isolated test database     |

## Frontend

| Technology       | Purpose                       |
| ---------------- | ----------------------------- |
| React 18         | UI framework                  |
| Vite             | Frontend build tool           |
| React Router DOM | Client-side routing           |
| Axios            | HTTP client                   |
| Lucide React     | Icons                         |
| CSS3             | Styling and responsive layout |

The frontend uses a custom responsive design system with CSS variables, glassmorphism components, animations, and a dark visual palette.

---

# Architecture

The backend follows a layered architecture with clear separation of concerns.

```text
┌──────────────────────────────┐
│        React / Vite          │
│          Frontend            │
└──────────────┬───────────────┘
               │
          HTTP / REST
        JSON + Bearer JWT
               │
               ▼
┌──────────────────────────────┐
│           Routes             │
│   Authentication / Projects  │
│          / Tasks              │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│          Middleware          │
│ Auth / Roles / Validation    │
│        Error Handling        │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│         Controllers          │
│      HTTP Request/Response   │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│           Services           │
│     Business Logic + Data    │
│       Access Operations      │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│        Mongoose Models       │
│   User / Project / Task      │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│          MongoDB             │
└──────────────────────────────┘
```

### Responsibilities

**Routes**

Define API endpoints and attach the required middleware.

**Validators**

Validate and sanitize incoming request data.

**Middleware**

Handle authentication, role checks, validation, and centralized errors.

**Controllers**

Handle HTTP requests and responses.

**Services**

Contain business logic and database operations.

**Models**

Define MongoDB schemas, relationships, validation rules, and hooks.

---

# Project Structure

```text
Power_Pi_Task/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── project.controller.js
│   │   │   ├── task.controller.js
│   │   │   └── user.controller.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   ├── notFound.middleware.js
│   │   │   ├── role.middleware.js
│   │   │   └── validate.middleware.js
│   │   │
│   │   ├── models/
│   │   │   ├── Project.js
│   │   │   ├── Task.js
│   │   │   └── User.js
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── project.routes.js
│   │   │   ├── task.routes.js
│   │   │   └── user.routes.js
│   │   │
│   │   ├── services/
│   │   │   ├── auth.service.js
│   │   │   ├── project.service.js
│   │   │   └── task.service.js
│   │   │
│   │   ├── utils/
│   │   │   ├── apiResponse.js
│   │   │   └── generateToken.js
│   │   │
│   │   ├── validators/
│   │   │   ├── auth.validator.js
│   │   │   ├── project.validator.js
│   │   │   └── task.validator.js
│   │   │
│   │   ├── app.js
│   │   ├── seed.js
│   │   └── server.js
│   │
│   ├── tests/
│   │   ├── auth.test.js
│   │   ├── projects.test.js
│   │   └── tasks.test.js
│   │
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── ProjectDetailsPage.jsx
│   │   │   ├── ProjectsPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── Task_Management_API.postman_collection.json
├── package.json
└── README.md
```

---

# Database Design

## User

| Field     | Type   | Description                          |
| --------- | ------ | ------------------------------------ |
| name      | String | Required                             |
| email     | String | Required, unique, lowercase          |
| password  | String | Hashed, excluded from normal queries |
| role      | String | `Admin` or `Member`                  |
| createdAt | Date   | Timestamp                            |
| updatedAt | Date   | Timestamp                            |

## Project

| Field       | Type       | Description         |
| ----------- | ---------- | ------------------- |
| name        | String     | Required            |
| description | String     | Optional            |
| createdBy   | ObjectId   | Reference to User   |
| members     | ObjectId[] | References to Users |
| createdAt   | Date       | Timestamp           |
| updatedAt   | Date       | Timestamp           |

The project creator is automatically added to the project members.

## Task

| Field       | Type     | Description                    |
| ----------- | -------- | ------------------------------ |
| title       | String   | Required                       |
| description | String   | Optional                       |
| status      | String   | `To Do`, `In Progress`, `Done` |
| priority    | String   | `Low`, `Medium`, `High`        |
| dueDate     | Date     | Optional                       |
| creator     | ObjectId | Reference to User              |
| assignee    | ObjectId | Reference to User              |
| project     | ObjectId | Reference to Project           |
| createdAt   | Date     | Timestamp                      |
| updatedAt   | Date     | Timestamp                      |

---

# Authentication

Authentication uses Bearer JWT tokens.

### Registration

```http
POST /api/auth/register
```

Creates a new Member account after validating and hashing the password.

### Login

```http
POST /api/auth/login
```

Validates credentials and returns a signed JWT.

### Current User

```http
GET /api/auth/me
Authorization: Bearer <token>
```

Returns the authenticated user's profile.

Passwords are hashed using bcrypt and are excluded from normal Mongoose query results.

---

# Authorization

Authorization is implemented at two levels.

## Role-Based Authorization

The application supports:

- `Admin`
- `Member`

Administrative operations are protected server-side using role-based middleware.

## Resource-Level Authorization

Project and task access is verified on the backend.

Members can only access projects they created or belong to.

Tasks inherit access restrictions from their parent project.

Unauthorized resource access returns:

```http
403 Forbidden
```

Frontend restrictions are not treated as a security boundary; all important authorization checks are performed by the backend.

---

# API Endpoints

## Authentication

| Method | Endpoint             | Description            |
| ------ | -------------------- | ---------------------- |
| POST   | `/api/auth/register` | Register user          |
| POST   | `/api/auth/login`    | Authenticate user      |
| GET    | `/api/auth/me`       | Get authenticated user |

## Users

| Method | Endpoint     | Description                                          |
| ------ | ------------ | ---------------------------------------------------- |
| GET    | `/api/users` | List users for member assignment and task assignment |

## Projects

| Method | Endpoint                                   | Description              |
| ------ | ------------------------------------------ | ------------------------ |
| POST   | `/api/projects`                            | Create project           |
| GET    | `/api/projects`                            | List accessible projects |
| GET    | `/api/projects/:projectId`                 | Get project              |
| PATCH  | `/api/projects/:projectId`                 | Update project           |
| DELETE | `/api/projects/:projectId`                 | Delete project           |
| POST   | `/api/projects/:projectId/members`         | Add member               |
| DELETE | `/api/projects/:projectId/members/:userId` | Remove member            |

## Tasks

| Method | Endpoint                                 | Description        |
| ------ | ---------------------------------------- | ------------------ |
| POST   | `/api/projects/:projectId/tasks`         | Create task        |
| GET    | `/api/projects/:projectId/tasks`         | List project tasks |
| GET    | `/api/projects/:projectId/tasks/:taskId` | Get task           |
| PATCH  | `/api/projects/:projectId/tasks/:taskId` | Update task        |
| DELETE | `/api/projects/:projectId/tasks/:taskId` | Delete task        |

### Task Filtering

```http
GET /api/projects/:projectId/tasks?status=In%20Progress
```

```http
GET /api/projects/:projectId/tasks?priority=High
```

```http
GET /api/projects/:projectId/tasks?assignee=USER_ID
```

Filters can be combined:

```http
GET /api/projects/:projectId/tasks?status=In%20Progress&priority=High&assignee=USER_ID
```

---

# API Response Format

Successful responses follow a consistent structure:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

Errors follow:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

The API uses appropriate HTTP status codes including `201`, `200`, `400`, `401`, `403`, `404`, `409`, and `500`.

---

# Environment Variables

## Backend

Create:

```text
backend/.env
```

based on:

```text
backend/.env.example
```

Example:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task_management_app
JWT_SECRET=your_secure_random_secret_here
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

## Frontend

If frontend environment configuration is required, create:

```text
frontend/.env
```

based on the provided example:

```env
VITE_API_URL=http://localhost:5000/api
```

**Never commit real `.env` files or production secrets.**

---

# Installation

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB, or a MongoDB-compatible environment

## Backend

```bash
cd backend
npm install
```

## Frontend

```bash
cd ../frontend
npm install
```

---

# Running the Application

## Start Backend

```bash
cd backend
npm run dev
```

The API runs on:

```text
http://localhost:5000
```

## Start Frontend

In another terminal:

```bash
cd frontend
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

If the configured MongoDB connection is unavailable, the development setup can fall back to an in-memory MongoDB instance where supported by the application configuration.

---

# Database Seed

To create development data:

```bash
cd backend
npm run seed
```

The seed creates sample Admin and Member accounts together with sample projects and tasks.

## Test Credentials

| Role   | Email                | Password     |
| ------ | -------------------- | ------------ |
| Admin  | `admin@example.com`  | `Admin123!`  |
| Member | `member@example.com` | `Member123!` |

These credentials are intended for local development and assessment purposes only.

---

# Testing

The backend includes integration tests using Jest, Supertest, and MongoDB Memory Server.

Run:

```bash
cd backend
npm test
```

The test suite covers:

- User registration
- Duplicate email handling
- Login
- Invalid credentials
- Protected routes
- Project creation
- Project authorization
- Task creation
- Task authorization
- Task filtering

Current test result:

```text
10 / 10 tests passed
```

---

# Postman Collection

A complete Postman collection is included in the project root:

```text
Task_Management_API.postman_collection.json
```

## Import

1. Open Postman.
2. Select **Import**.
3. Choose `Task_Management_API.postman_collection.json`.
4. Start the backend server.
5. Run the authentication requests first.

The collection uses variables for:

- `baseUrl`
- `token`
- `projectId`
- `taskId`
- `userId`

Relevant request scripts automatically update these variables during the workflow.

Default API base URL:

```text
http://localhost:5000/api
```

---

# Security Considerations

### Password Security

Passwords are hashed using bcrypt before storage.

The password field is configured to be excluded from normal Mongoose queries.

### JWT Security

JWTs are signed using a configurable `JWT_SECRET` and expire according to `JWT_EXPIRES_IN`.

### Authorization

Authorization is enforced on the backend for both roles and individual project resources.

### Validation

Incoming request data is validated using `express-validator`.

### HTTP Security

Helmet is used to configure security-related HTTP headers.

### CORS

Cross-origin requests are restricted through the configured frontend origin.

### Rate Limiting

Rate limiting is applied where appropriate to reduce abuse of API endpoints.

---

# Design Decisions

## Layered Backend Architecture

Routes, controllers, services, models, validators, and middleware are separated to improve maintainability and testability.

## MongoDB

MongoDB was selected because the application has straightforward document relationships and benefits from Mongoose's schema validation and population capabilities.

## JWT Authentication

JWT provides stateless API authentication and works well with a React SPA consuming a REST API.

## Resource-Level Authorization

Authorization is checked against the project membership rather than relying on frontend visibility.

This prevents users from accessing private project data simply by manually calling the API.

## Cascade Task Deletion

When a project is deleted, its associated tasks are also removed to prevent orphaned task documents.

## In-Memory Testing Database

Automated tests use MongoDB Memory Server to isolate test execution from the developer's local or production database.

---

# Git Workflow

The project was developed using incremental conventional commits.

Examples:

```text
chore: initialize project structure
feat: add database models and mongodb connection
feat: implement user authentication
feat: add role based authorization
feat: implement project management api
feat: implement task management api
feat: add validation and centralized error handling
test: add backend api tests
feat: implement frontend authentication
feat: implement project dashboard
feat: implement task management interface
feat: improve frontend ux and validation
docs: complete project documentation
```

---

# Project Status

### Core Assessment Requirements

- [x] Authentication
- [x] JWT authorization
- [x] Secure password hashing
- [x] Admin and Member roles
- [x] Project CRUD
- [x] Project member management
- [x] Task CRUD
- [x] Task assignment
- [x] Task status management
- [x] Task filtering
- [x] Resource-level authorization
- [x] Input validation
- [x] Centralized error handling
- [x] React frontend
- [x] Responsive UI
- [x] Loading, empty, success, and error states
- [x] Automated backend tests
- [x] Seed data
- [x] Postman collection
- [x] Environment configuration example
- [x] Documentation

---

# Future Improvements

Potential future enhancements include:

- Docker Compose
- Swagger/OpenAPI documentation
- Pagination
- Search
- Sorting
- Audit logs
- Real-time updates using WebSockets
- Cloud deployment
- CI/CD pipeline

These features are intentionally kept separate from the completed core assessment scope.

---

# License

This project was created as part of a technical recruitment assessment.
