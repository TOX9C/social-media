# Pre-Deployment Checklist

## ✅ Completed Steps

- [x] Created environment variable configuration (`config.js`)
- [x] Updated all frontend API calls to use `API_URL`
- [x] Updated Socket.IO connection to use `API_URL`
- [x] Created `.env.local` for local development
- [x] Created `.env.example` for reference
- [x] Build successful - no errors
- [x] Created comprehensive deployment documentation

## 📝 Next Steps Before Deployment

### 1. Test Locally
```bash
# Make sure everything works with the environment variable
cd frontend
npm run dev

# Verify in browser that:
# - Login/Register works
# - Posts can be created
# - Real-time features work
# - Socket.IO connects properly
```

### 2. Push to GitHub
```bash
git add .
git commit -m "Prepare for deployment: Replace hardcoded URLs with environment variables"
git push origin main
```

### 3. Deploy Backend to Railway

1. Sign up at https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. **Important Settings:**
   - Root Directory: `backend`
   - Start Command: `npm start`
   
5. Add PostgreSQL database:
   - Click "+ New" → "Database" → "PostgreSQL"
   
6. **Set Environment Variables** in Railway:
   ```env
   DATABASE_URL=<automatically provided by Railway>
   JWT_CODE=<generate with: openssl rand -base64 32>
   SUPABASE_URL=<your supabase url>
   SUPABASE_SERVICE_ROLE_KEY=<your supabase key>
   CORS_ORIGIN=https://your-app.vercel.app
   NODE_ENV=production
   PORT=3000
   ```

7. **Run migrations** (in Railway shell or add to start script):
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

8. Copy your Railway backend URL (e.g., `https://your-app.up.railway.app`)

### 4. Deploy Frontend to Vercel

1. Sign up at https://vercel.com
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. **Important Settings:**
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   
5. **Set Environment Variable:**
   ```env
   VITE_API_URL=https://your-backend.up.railway.app
   ```
   (Use the URL from step 3.8)

6. Click "Deploy"

7. Copy your Vercel URL (e.g., `https://your-app.vercel.app`)

### 5. Update Backend CORS

Go back to Railway and update the `CORS_ORIGIN` environment variable:
```env
CORS_ORIGIN=https://your-app.vercel.app
```

Railway will automatically redeploy.

### 6. Final Testing

Visit your Vercel URL and test:
- [ ] Can register a new account
- [ ] Can login
- [ ] Can create posts
- [ ] Can like/comment
- [ ] Real-time messages work
- [ ] Real-time notifications work
- [ ] File upload (profile picture) works
- [ ] Follow/unfollow works

---

## 🔧 If Something Goes Wrong

### Frontend won't connect to backend
1. Check browser console for errors
2. Verify `VITE_API_URL` is set correctly in Vercel
3. Check Network tab - are requests going to the right URL?
4. Verify CORS is configured correctly in backend

### Socket.IO not connecting
1. Check browser console for Socket.IO errors
2. Verify backend URL is correct
3. Check Railway logs for connection errors
4. Make sure Railway allows WebSocket connections (it does by default)

### Database errors
1. Check Railway logs
2. Verify `DATABASE_URL` is correct
3. Make sure migrations were run (`npx prisma migrate deploy`)
4. Check PostgreSQL database is running

### 500 errors
1. Check Railway backend logs
2. Verify all environment variables are set
3. Check for missing dependencies
4. Look for runtime errors in logs

---

## 💰 Estimated Costs

### Free Tier (Good for testing/portfolio)
- **Vercel**: Free forever (hobby plan)
- **Railway**: $5/month (requires credit card, includes $5 credit)
- **Supabase**: Free tier (1GB storage, 2GB database)
- **Total**: ~$0-5/month

### Production Ready
- **Vercel Pro**: $20/month
- **Railway**: ~$20-50/month
- **Supabase Pro**: $25/month
- **Total**: ~$65-95/month

---

## 🔒 Security Notes

Before going to production, consider:

1. **Rate limiting** - Add rate limiting to prevent abuse
2. **Input validation** - Validate all user inputs
3. **HTTPS only** - Force HTTPS in production (Vercel/Railway do this automatically)
4. **Strong secrets** - Use strong, unique JWT_CODE
5. **Database backups** - Enable automated backups on Railway
6. **Error monitoring** - Consider adding Sentry or similar
7. **Update dependencies** - Keep all packages up to date

---

## 📚 Useful Resources

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Prisma Deployment: https://www.prisma.io/docs/guides/deployment
- Socket.IO Deployment: https://socket.io/docs/v4/server-deployment/

---

## ✉️ Need Help?

If you run into issues:
1. Check the DEPLOYMENT.md file for detailed instructions
2. Review the error messages in browser console
3. Check Railway/Vercel logs for backend errors
4. Search for the specific error message online
