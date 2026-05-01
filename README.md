# Team Task Manager (Full-Stack)

A complete, full-stack application for managing teams, projects, and tasks. Features a modern, premium design with role-based access control.

## Features
- **Authentication**: JWT-based Signup/Login.
- **Role-Based Access**: Distinguishes between Admin (can create projects/tasks) and Members (can view and update tasks).
- **Projects & Teams**: Create projects and assign team members.
- **Task Tracking**: Assign tasks, track progress (Todo, In Progress, Done).
- **Dynamic Dashboard**: View tasks and their status securely.

## Tech Stack
- **Frontend**: React (Vite), Zustand, vanilla CSS with custom premium styling.
- **Backend**: Node.js, Express, Prisma ORM.
- **Database**: SQLite (locally) -> Easily deployable to PostgreSQL on Railway.

## Local Development

### 1. Backend Setup
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```
*(Backend runs on http://localhost:5000)*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*(Frontend runs on http://localhost:5173)*

## Deployment to Railway (Mandatory Instructions)

To make this application live and fully functional, follow these steps:

### 1. Deploy the Backend
1. Go to [Railway.app](https://railway.app/).
2. Create a new Project from your GitHub repository (this code).
3. Select the `backend` folder as the root if prompted, or set the root directory in settings.
4. Add a PostgreSQL database to the project in Railway.
5. In your Backend settings on Railway, add an environment variable `DATABASE_URL` and copy the connection string from the PostgreSQL database you just created.
6. Change the database provider in `backend/prisma/schema.prisma` from `"sqlite"` to `"postgresql"`.
7. Railway will automatically run `npm install` and start your app using `npm start` (already defined in `package.json`).
8. Add a custom domain (or use Railway's default domain) and keep note of the URL (e.g., `https://my-backend.up.railway.app`).

### 2. Deploy the Frontend
1. Create a new service in the same Railway project (from your GitHub repo).
2. Set the root directory to `frontend`.
3. Add an environment variable `VITE_API_URL` to point to your live backend URL (e.g., `https://my-backend.up.railway.app/api`). Note: You will need to change `API_URL` in `frontend/src/store/useStore.js` to use `import.meta.env.VITE_API_URL` instead of the localhost hardcoded URL.
4. Railway will automatically build the Vite app and serve it.
5. Once deployed, you will receive a Live URL!
