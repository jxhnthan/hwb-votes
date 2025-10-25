# Pre-Deployment Checklist

Before deploying to Railway, make sure everything works locally!

## ✅ Local Testing Steps

### 1. Install All Dependencies
```bash
npm run install-all
```

### 2. Test Development Mode
```bash
npm run dev
```

Visit: http://localhost:5174
- ✅ Upload a photo
- ✅ Vote on a photo
- ✅ Enable admin mode (password: `hwbadmin2025`)
- ✅ Delete a photo in admin mode
- ✅ Wait 10 seconds - auto-refresh works
- ✅ Click refresh button
- ✅ Open in mobile view (Chrome DevTools)

### 3. Test Production Build
```bash
# Build the client
npm run build

# Start production server
cd server
npm start
```

Visit: http://localhost:3001
- ✅ Upload works from production build
- ✅ Voting works
- ✅ Admin delete works

### 4. Clean Up Test Data (Optional)
```bash
# Delete test uploads
Remove-Item -Path "server\uploads\*" -Force

# Reset database
Remove-Item -Path "server\voting.db" -Force

# Restart server - it will recreate the database
```

---

## 🚀 Deploy to Railway

### Option 1: GitHub (Recommended)

1. **Create GitHub repo** (if not done):
   ```bash
   git init
   git add .
   git commit -m "Ready for Railway deployment"
   git branch -M main
   ```

2. **Create new repo on GitHub** at https://github.com/new

3. **Push code**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/hwb-votes.git
   git push -u origin main
   ```

4. **Deploy on Railway**:
   - Go to https://railway.app
   - Click "Start a New Project"
   - Select "Deploy from GitHub repo"
   - Authorize Railway
   - Select `hwb-votes` repo
   - Railway will auto-deploy!

5. **Get your URL**:
   - Go to Settings → Networking
   - Click "Generate Domain"
   - Your app will be live at: `your-app.up.railway.app`

### Option 2: Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up

# Get public URL
railway domain
```

---

## 🔧 Troubleshooting

### If you see "Cannot GET /" after deployment:
The server is serving the built client files. Make sure:
- `npm run build` completed successfully
- `client/dist` folder exists
- Server code includes the production static file serving

### If API calls fail:
Check that the client is using the right API URL:
- In development: `http://localhost:3001/api`
- In production: `window.location.origin + '/api'`

### If photos don't persist on Railway:
Railway provides persistent storage by default. If photos disappear:
1. Check Railway logs for errors
2. Verify `server/uploads/` folder exists
3. Check file permissions

---

## 📊 After Deployment

Test your live app:
1. ✅ Open from your phone
2. ✅ Upload a photo
3. ✅ Open from another device
4. ✅ Verify photo appears on both devices
5. ✅ Vote from different devices
6. ✅ Test admin mode
7. ✅ Delete a photo

---

## 🎉 Share Your App!

Once deployed, share the Railway URL:
```
https://your-app.up.railway.app
```

**Reminder:** Admin password is `hwbadmin2025`

---

## 💰 Railway Costs

- **Free Trial:** $5 credit (enough for testing)
- **Developer Plan:** $5/month for 500 hours
- Your app should easily run 24/7 on the free trial!

Monitor usage at: https://railway.app/account/usage

---

## Need Help?

- [Railway Docs](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [Detailed Deploy Guide](./RAILWAY_DEPLOY.md)
