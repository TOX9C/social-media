# Deployment Guide

This guide will help you deploy your social media application to production.

## Architecture Overview

- **Frontend**: React + Vite + Socket.IO Client
- **Backend**: Node.js + Express + Socket.IO + Prisma
- **Database**: PostgreSQL
- **Storage**: Supabase (profile pictures)

---

## ⚠️ Important: Free Tier Options

Railway now only offers **free databases**, not free backend hosting. Here are the best **100% free** deployment options:

### Option 1: Render (Recommended - Easiest)
- **Frontend**: Vercel (free forever)
- **Backend**: Render (free with cold starts)
- **Database**: Railway PostgreSQL (free) or Neon (free)

### Option 2: Fly.io
- **Frontend**: Vercel (free forever)
- **Backend**: Fly.io (free tier available)
- **Database**: Railway PostgreSQL (free) or Neon (free)

### Option 3: All Render
- **Frontend**: Render Static Site (free)
- **Backend**: Render Web Service (free)
- **Database**: Render PostgreSQL (free, 90-day expiry)

**This guide will use Option 1 (Render + Vercel + Railway) as it's the most reliable free option.**

---

## Prerequisites

Before deploying, you need:
1. GitHub account (to push your code)
2. Render account (for backend) - https://render.com
3. Railway account (for database) - https://railway.app
4. Vercel account (for frontend) - https://vercel.com
5. Supabase account (already set up for storage)

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

## Step 2: Deploy Database to Railway

### 2.1 Create Railway Account & PostgreSQL Database

1. Go to https://railway.app and sign up with GitHub
2. Click **"+ New Project"**
3. Select **"Provision PostgreSQL"**
4. Railway will create a free PostgreSQL database

### 2.2 Get Database Connection String

1. Click on your PostgreSQL database
2. Go to **"Variables"** tab
3. Copy the **"DATABASE_URL"** value (it looks like: `postgresql://user:pass@host:port/dbname`)
4. **Save this URL** - you'll need it for the backend deployment

**Note:** This is your free PostgreSQL database that you'll use permanently.

---

## Step 3: Deploy Backend to Render

### 3.1 Create Render Account

1. Go to https://render.com and sign up with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account and select this repository

### 3.2 Configure Web Service

Fill in these settings:

- **Name**: `your-app-backend` (or any name you want)
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install && npx prisma generate`
- **Start Command**: `npx prisma migrate deploy && node app.js`
- **Instance Type**: **Free** ⚠️ (This will have cold starts - app sleeps after 15 min of inactivity)

### 3.3 Add Environment Variables

In the **Environment Variables** section, add these:

```env
DATABASE_URL=<paste your Railway PostgreSQL URL from Step 2.2>
JWT_CODE=<generate with: openssl rand -base64 32>
SUPABASE_URL=<your supabase url>
SUPABASE_SERVICE_ROLE_KEY=<your supabase key>
CORS_ORIGIN=https://your-app.vercel.app
NODE_ENV=production
PORT=10000
```

**Important Notes:**
- Replace `<your-app.vercel.app>` with your actual Vercel URL (we'll update this later)
- Generate a strong JWT_CODE using: `openssl rand -base64 32`
- Render uses port 10000 by default for free tier
- Copy your Supabase credentials from your existing `.env` file

### 3.4 Deploy

1. Click **"Create Web Service"**
2. Wait for the build to complete (5-10 minutes first time)
3. Render will give you a URL like: `https://your-app-backend.onrender.com`
4. **Copy this URL** - you'll need it for the frontend

⚠️ **Important about Free Tier:**
- Your backend will "sleep" after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds to wake up
- Subsequent requests are fast
- This is normal for free tier hosting

---

## Step 4: Deploy Frontend to Vercel

### 4.1 Create Vercel Account

1. Go to https://vercel.com and sign up with GitHub
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Select the **frontend** folder as the root directory

### 4.2 Configure Build Settings

Vercel should auto-detect Vite, but verify these settings:
- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 4.3 Add Environment Variables

In Vercel project settings → **Environment Variables**, add:

```env
VITE_API_URL=https://your-app-backend.onrender.com
```

Replace with your actual Render backend URL from Step 3.4.

### 4.4 Deploy

Click **"Deploy"** and wait for the build to complete.

Vercel will give you a URL like: `https://your-app.vercel.app`

---

## Step 5: Update CORS on Backend

Go back to Render and update the `CORS_ORIGIN` environment variable with your Vercel URL:

```env
CORS_ORIGIN=https://your-app.vercel.app
```

Then click **"Manual Deploy"** → **"Deploy latest commit"** to restart the backend.

---

## Step 6: Test Your Deployment

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Try to register a new account
3. Test logging in
4. Create a post
5. Test real-time features (messages, notifications)

---

## Alternative Free Deployment Options

### Option 2: All on Render (Simpler but DB expires after 90 days)

**Pros**: Everything in one place
**Cons**: Free PostgreSQL expires after 90 days, need to migrate data

1. Sign up at https://render.com
2. Create PostgreSQL database (free, 90-day limit)
3. Create Web Service for backend
4. Create Static Site for frontend

### Option 3: Fly.io Backend + Railway DB + Vercel Frontend

**Pros**: Fly.io has better free tier limits
**Cons**: Slightly more complex setup

1. Database: Railway PostgreSQL (free, permanent)
2. Backend: Fly.io (free tier, no cold starts)
3. Frontend: Vercel (free forever)

### Option 4: Upgrade to Paid (Recommended for Production)

If you want to avoid cold starts and have a production-ready app:

- **Backend**: Render Starter ($7/month) or Railway ($5/month minimum)
- **Database**: Railway PostgreSQL ($5/month included) or Render PostgreSQL ($7/month)
- **Frontend**: Vercel (free forever, or Pro $20/month for teams)

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
- **If using Render**: Wait 30-60 seconds for backend to wake up from sleep

### Database connection errors
- Verify `DATABASE_URL` is correct in Render
- Check if Prisma migrations were run (check Render logs)
- Test database connection in Railway dashboard
- Make sure database is active and not paused

### Socket.IO not connecting
- Verify Socket.IO URL uses same backend URL
- Check Render logs for WebSocket errors
- Render supports WebSocket connections by default
- **Wait for backend to wake up** if it's been sleeping

### 500 errors on backend
- Check Render logs (click on your web service → "Logs")
- Verify all environment variables are set correctly
- Check database connection string
- Look for missing dependencies or build errors

### Backend is slow or timing out
- **This is normal for free tier** - first request takes 30-60 seconds
- Backend sleeps after 15 minutes of inactivity
- Consider upgrading to paid tier to avoid cold starts
- Or use a service like [UptimeRobot](https://uptimerobot.com) to ping your backend every 5 minutes (keeps it awake)

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
