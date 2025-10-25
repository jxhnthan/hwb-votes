# Deploying HWB Votes to Vercel

## ⚠️ Important Note About File Storage

**Photos are NOT persistent on Vercel!**

Vercel's serverless functions are **stateless**, which means:
- Photos uploaded will be **deleted after ~5 minutes** when the function spins down
- SQLite database will also reset
- This is NOT suitable for production with user uploads

## Better Deployment Options

### Option 1: Use Cloud Storage (Recommended for Vercel)
To keep photos persistent on Vercel, you need to:
1. Use **Vercel Blob Storage** or **AWS S3** for photos
2. Use **Vercel Postgres** or another cloud database instead of SQLite
3. This requires code changes to integrate cloud services

### Option 2: Traditional Hosting (Easiest)
Deploy to a service with persistent storage:
- **Railway.app** (easiest, supports file uploads + SQLite)
- **Render.com** (supports persistent disks)
- **DigitalOcean App Platform**
- **AWS EC2** or **Google Cloud Compute**

## Quick Deploy to Railway (Recommended)

1. Sign up at [railway.app](https://railway.app)
2. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```
3. Login and deploy:
   ```bash
   railway login
   railway init
   railway up
   ```
4. Photos will persist! Railway provides persistent storage.

## If You Still Want to Deploy to Vercel

### Prerequisites
- Vercel account
- GitHub repository

### Steps

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect settings

3. **Configure Build Settings:**
   - Framework Preset: Other
   - Build Command: `npm run build`
   - Output Directory: `client/dist`
   - Install Command: `npm run install-all`

4. **Environment Variables:**
   No environment variables needed for basic setup.

5. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete

### ⚠️ Limitations on Vercel:
- **Photos will be deleted periodically** (5-15 min after upload)
- Database resets on each deployment
- Not suitable for production use with uploads
- Good for: demos, testing, temporary showcases

### Making Photos Persistent on Vercel

You'll need to modify the code to use:

**For Photos:**
- Vercel Blob: `@vercel/blob`
- Or AWS S3: `aws-sdk`
- Or Cloudinary: `cloudinary`

**For Database:**
- Vercel Postgres
- Or MongoDB Atlas
- Or Supabase

This requires significant code changes to the `server/index.js` file.

## Recommendation

**For a costume voting competition**, use **Railway.app** instead:
- Photos stay forever
- SQLite works perfectly
- Much simpler deployment
- Free tier available
- No code changes needed

Just run:
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

Done! Your app with persistent photos is live! 🚀
