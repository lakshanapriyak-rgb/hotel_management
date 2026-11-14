# Hotel Management

A hotel list web app where users can add, view, edit, search and filter hotels by price, with pagination.

## Tech Stack

- Frontend: React, Redux Toolkit, React Router
- Backend: Node.js, Express.js
- Database: PostgreSQL (native SQL, no ORM)
- Image upload: Multer

## Demo Video

[Watch the demo video](https://drive.google.com/drive/folders/1Yr6mRxqYI_dqWtxsNEy6meUtMOxwlVvN)

## Features

- Hotel list with image, title, price and description
- Search by hotel name
- Price filter (min and max)
- Pagination
- Add and edit hotel using one reusable form
- Image upload

## Setup

### 1. Database

Create a database named `hotel_management`, then run the SQL in `backend/database.sql`.

### 2. Backend

```
cd backend
npm install
```

Create a `.env` file in the `backend` folder (see `.env.example`) and set your database password. Then:

```
npm run dev
```

Backend runs on http://localhost:5000

### 3. Frontend

```
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:5173