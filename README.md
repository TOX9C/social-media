# Social Media Application

A full-stack social media platform built with React, Node.js, Express, Prisma, and Socket.io for real-time features.

## Features

- **Authentication**: User registration and login with JWT
- **Posts**: Create, view, and like posts
- **Comments**: Comment on posts
- **Real-time Messaging**: Direct messaging with Socket.io
- **Follow System**: Follow/unfollow users with request approval
- **Notifications**: Real-time notifications for likes, comments, follows, and messages
- **Search**: Find users
- **Profile**: User profiles with profile pictures (Supabase storage)

## Tech Stack

### Backend
- Node.js + Express
- Prisma ORM with PostgreSQL
- Socket.io for real-time communication
- JWT authentication
- Supabase for file storage
- Bcrypt for password hashing

### Frontend
- React 19
- Vite
- React Router v7
- Tailwind CSS
- Socket.io Client
- Firebase

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- Supabase account (for file storage)

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd social-media
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/social_media"
JWT_CODE="your-secret-jwt-key"
SUPABASE_URL="your-supabase-url"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
```

Run Prisma migrations:
```bash
npx prisma migrate dev
npx prisma generate
```

Start the backend server:
```bash
node app.js
```

The backend will run on `http://localhost:3000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory with your configuration.

Start the development server:
```bash
npm run dev
```

The frontend will typically run on `http://localhost:5173`

## Database Schema

The application uses the following main models:
- **User**: User accounts with authentication
- **Post**: User posts
- **Comment**: Comments on posts
- **Like**: Post likes
- **Follow**: Follow relationships with approval system
- **Message**: Direct messages between users
- **Notification**: User notifications

## API Endpoints

- `/auth` - Authentication routes (login, register)
- `/post` - Post management
- `/comment` - Comment operations
- `/follow` - Follow/unfollow operations
- `/message` - Direct messaging
- `/search` - User search
- `/noti` - Notifications

## Development

### Backend
```bash
cd backend
node app.js
```

### Frontend
```bash
cd frontend
npm run dev
```

### Lint Frontend
```bash
cd frontend
npm run lint
```

### Build Frontend
```bash
cd frontend
npm run build
```

## Project Structure

```
social-media/
├── backend/
│   ├── controllers/     # Route controllers
│   ├── routes/          # API routes
│   ├── prisma/          # Database schema and migrations
│   ├── app.js           # Main server file
│   └── socket.js        # Socket.io configuration
└── frontend/
    ├── src/
    │   ├── pages/       # Page components
    │   ├── comps/       # Reusable components
    │   └── App.jsx      # Main app component
    └── public/          # Static assets
```

## License

ISC
