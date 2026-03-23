# Layr Web Application

This repository contains the full-stack code for Layr.

## Structure

- `/frontend` - React application (Vite + TypeScript + Tailwind)
- `/backend` - Spring Boot backend application (Java 17 + Maven)

## Running the Application

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
./mvnw spring-boot:run
```

The frontend runs on `http://localhost:5173` and proxies `/api` requests to the backend running on `http://localhost:8080`.
