# Deployment Guide

This guide will help you deploy your social media application to production.

## Architecture Overview

- **Frontend**: React + Vite + Socket.IO Client
- **Backend**: Node.js + Express + Socket.IO + Prisma
- **Database**: PostgreSQL
- **Storage**: Supabase (profile pictures)

---

## Prerequisites

Before deploying, you need:
1. GitHub account (to push your code)
2. Railway account (for backend + database) - https://railway.app
3. Vercel account (for frontend) - https://vercel.com
4. Supabase account (already set up for storage)

---

## Step 1: Prepare Your Code for Deployment

### 1.1 Update Frontend to Use Environment Variables

The frontend currently has hardcoded `http://localhost:3000` URLs. We need to make this configurable.

**Create `/frontend/.env.local`:**
```env
VITE_API_URL=http://localhost:3000
```

**Update `/frontend/src/config.js`** (already created):
```javascript
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

**Update `/frontend/src/socket.js`:**
```javascript
import { io } from "socket.io-client";
import { API_URL } from './config';

export const socket = io(API_URL, {
    autoConnect: false,
});
```

**Replace all `http://localhost:3000` in frontend files:**

You need to import `API_URL` and use it instead of hardcoded URLs in these files:
- `src/comps/Post.jsx`
- `src/comps/AuthRouter.jsx`
- `src/comps/MakeComment.jsx`
- `src/comps/Noti.jsx`
- `src/comps/ProfileUserCard.jsx`
- `src/comps/MakePost.jsx`
- `src/comps/ProfileCard.jsx`
- `src/comps/PostWall.jsx`
- `src/comps/SearchAndFollow.jsx`
- `src/pages/Search.jsx`
- `src/pages/ProfileEdit.jsx`
- `src/pages/PostPage.jsx`
- `src/pages/Notifications.jsx`
- `src/pages/Login.jsx`
- `src/pages/Messages.jsx`
- `src/pages/Register.jsx`

Example for `src/pages/Login.jsx`:
```javascript
import { API_URL } from '../config';

// Change this:
const response = await fetch("http://localhost:3000/auth/login", {

// To this:
const response = await fetch(`${API_URL}/auth/login`, {
```

### 1.2 Update Backend CORS Configuration

Make sure your backend allows requests from your production frontend URL.

---

## Step 2: Deploy Backend to Railway

### 2.1 Create Railway Account & Project

1. Go to https://railway.app and sign up with GitHub
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Connect your GitHub account and select this repository
5. Railway will detect the backend folder

### 2.2 Add PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"PostgreSQL"**
3. Railway will automatically create the database and provide a `DATABASE_URL`

### 2.3 Configure Environment Variables

In Railway project settings, add these environment variables:

```env
# Railway automatically provides DATABASE_URL
# You just need to add these:

JWT_CODE=your-super-secret-jwt-key-change-this-in-production
SUPABASE_URL=your-supabase-project-url
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
CORS_ORIGIN=https://your-frontend-domain.vercel.app
PORT=3000
NODE_ENV=production
```

**Important**: Generate a strong JWT_CODE (you can use: `openssl rand -base64 32`)

### 2.4 Set Root Directory

In Railway settings:
- **Root Directory**: `backend`
- **Start Command**: `npm start`
- **Build Command**: Leave empty (or `npm install`)

### 2.5 Run Database Migrations

After deployment, go to Railway project → **"Deployments"** → Click on your backend service → **"Shell"**

Run these commands:
```bash
npx prisma migrate deploy
npx prisma generate
```

Or you can add this to your backend `package.json`:
```json
"scripts": {
  "start": "npx prisma migrate deploy && npx prisma generate && node app.js",
  "dev": "node app.js",
  "seed": "node prisma/seed.js"
}
```

### 2.6 Note Your Backend URL

Railway will give you a public URL like: `https://your-app.up.railway.app`

Copy this URL - you'll need it for the frontend.

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Account

1. Go to https://vercel.com and sign up with GitHub
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Select the **frontend** folder as the root directory

### 3.2 Configure Build Settings

Vercel should auto-detect Vite, but verify these settings:
- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 3.3 Add Environment Variables

In Vercel project settings → **Environment Variables**, add:

```env
VITE_API_URL=https://your-backend.up.railway.app
```

Replace with your actual Railway backend URL from Step 2.6.

### 3.4 Deploy

Click **"Deploy"** and wait for the build to complete.

Vercel will give you a URL like: `https://your-app.vercel.app`

---

## Step 4: Update CORS on Backend

Go back to Railway and update the `CORS_ORIGIN` environment variable with your Vercel URL:

```env
CORS_ORIGIN=https://your-app.vercel.app
```

Then redeploy the backend (Railway will auto-redeploy on environment variable change).

---

## Step 5: Test Your Deployment

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Try to register a new account
3. Test logging in
4. Create a post
5. Test real-time features (messages, notifications)

---

## Alternative Deployment Options

### Option 2: Render (All-in-One)

**Pros**: Single platform for frontend, backend, and database
**Cons**: Free tier has cold starts (apps sleep after 15 min of inactivity)

1. Sign up at https://render.com
2. Create a PostgreSQL database
3. Create a Web Service for backend (Node.js)
4. Create a Static Site for frontend (Vite)

### Option 3: DigitalOcean App Platform

**Pros**: More control, good for scaling
**Cons**: No generous free tier

Similar to Railway but with DigitalOcean's infrastructure.

### Option 4: Self-Hosted VPS (Advanced)

Use a VPS like:
- DigitalOcean Droplet
- AWS EC2
- Linode
- Vultr

You'll need to:
1. Set up Ubuntu server
2. Install Node.js, PostgreSQL, Nginx
3. Configure reverse proxy
4. Set up SSL certificates (Let's Encrypt)
5. Configure PM2 for process management

---

## Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Database migrations run successfully
- [ ] Frontend deployed and accessible
- [ ] Environment variables set correctly
- [ ] CORS configured properly
- [ ] Socket.IO connections working
- [ ] File uploads to Supabase working
- [ ] Real-time features (messages/notifications) working
- [ ] SSL/HTTPS enabled (Vercel and Railway do this automatically)
- [ ] Custom domain configured (optional)

---

## Troubleshooting

### Frontend can't connect to backend
- Check `VITE_API_URL` in Vercel environment variables
- Verify CORS settings in backend allow your frontend domain
- Check browser console for CORS errors

### Database connection errors
- Verify `DATABASE_URL` in Railway
- Check if Prisma migrations were run
- Look at Railway logs for database errors

### Socket.IO not connecting
- Verify Socket.IO URL uses same backend URL
- Check backend logs for WebSocket errors
- Ensure Railway allows WebSocket connections (it does by default)

### 500 errors on backend
- Check Railway logs
- Verify all environment variables are set
- Check database connection

---

## Costs (Approximate)

### Free Tier (Good for Development/Portfolio)
- **Vercel**: Free (includes custom domain)
- **Railway**: $5/month credit (requires credit card)
- **Supabase**: Free tier (1GB storage, 2GB database)
- **Total**: ~$0-5/month

### Production Ready
- **Vercel Pro**: $20/month (better performance, team features)
- **Railway**: ~$20-50/month (depends on usage)
- **Supabase Pro**: $25/month (more storage, better support)
- **Total**: ~$65-95/month

---

## Security Recommendations

1. **Change default secrets**: Generate strong JWT_CODE
2. **Enable HTTPS only**: Force HTTPS in production
3. **Rate limiting**: Add rate limiting to prevent abuse
4. **Input validation**: Validate all user inputs
5. **SQL injection protection**: Prisma handles this, but verify
6. **XSS protection**: Sanitize user-generated content
7. **Environment variables**: Never commit `.env` files
8. **Database backups**: Enable automated backups on Railway
9. **Monitor logs**: Set up error monitoring (e.g., Sentry)

---

## Need Help?

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Prisma Deployment: https://www.prisma.io/docs/guides/deployment
- Socket.IO Deployment: https://socket.io/docs/v4/server-deployment/
