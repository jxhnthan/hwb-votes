# Deploy to Railway - Step by Step Guide

Railway is perfect for this app because it provides **persistent file storage** and supports SQLite!

## Prerequisites
- Railway account (free tier available)
- Your code in a GitHub repository

---

## Method 1: Deploy via GitHub (Recommended)

### Step 1: Push Your Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit for Railway deployment"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Deploy on Railway

1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub
5. Select your `hwb-votes` repository

### Step 3: Configure the Project

Railway will automatically detect your Node.js project. Configure:

1. **Root Directory:** Leave as `/` (root)
2. **Build Command:** `npm run install-all && npm run build`
3. **Start Command:** `npm start`

### Step 4: Set Up Environment Variables (if needed)

Click on your service → **Variables** tab:
- `NODE_ENV` = `production` (optional)
- Railway automatically assigns a `PORT` variable

### Step 5: Deploy

- Railway will automatically build and deploy
- Wait 2-3 minutes for deployment to complete
- You'll get a URL like: `hwb-votes-production.up.railway.app`

### Step 6: Configure Ports

Railway automatically detects port 3001 from your server. Make sure your client's API URL points to the Railway URL:

**Update `client/src/App.jsx`:**
```javascript
const API_URL = import.meta.env.PROD 
  ? '/api'  // In production, same domain
  : 'http://localhost:3001/api'; // In development
```

### Step 7: Enable Public Networking

1. Go to your service in Railway
2. Click **Settings** tab
3. Scroll to **Networking**
4. Click **Generate Domain** to get a public URL

---

## Method 2: Deploy via Railway CLI

### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
```

### Step 2: Login to Railway

```bash
railway login
```

This will open your browser to authenticate.

### Step 3: Initialize Project

```bash
railway init
```

Follow the prompts:
- Create new project or link existing
- Give your project a name (e.g., "hwb-votes")

### Step 4: Deploy

```bash
railway up
```

This will:
1. Upload your code
2. Build the project
3. Start the server

### Step 5: Link a Domain

```bash
railway domain
```

This generates a public URL for your app.

---

## Method 3: Deploy Using Railway Button

Add this to your README.md for one-click deployment:

```markdown
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/YOUR_USERNAME/hwb-votes)
```

---

## Configuration Files for Railway

### Create `railway.json` in root:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run install-all && npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Update `package.json` scripts:

Your root `package.json` should have:
```json
{
  "scripts": {
    "install-all": "cd server && npm install && cd ../client && npm install",
    "build": "cd client && npm run build",
    "start": "cd server && node index.js",
    "dev:server": "cd server && npm run dev",
    "dev:client": "cd client && npm run dev"
  }
}
```

---

## Production Environment Setup

### Update Client API URL

**Edit `client/src/App.jsx`:**

Change:
```javascript
const API_URL = 'http://localhost:3001/api';
```

To:
```javascript
const API_URL = import.meta.env.PROD 
  ? window.location.origin + '/api'
  : 'http://localhost:3001/api';
```

### Serve Client from Server

**Edit `server/index.js`** to serve the built client:

Add at the top:
```javascript
const path = require('path');
```

Add after other routes (before `app.listen`):
```javascript
// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}
```

---

## Post-Deployment Checklist

✅ Photos persist across restarts
✅ SQLite database persists
✅ Uploads folder persists
✅ Auto-refresh works (polling every 10s)
✅ Admin delete functionality works
✅ One vote per device persists

---

## Troubleshooting

### Issue: "Cannot GET /"
**Solution:** Make sure server serves the built client files (see "Serve Client from Server" above)

### Issue: "CORS errors"
**Solution:** Update CORS in `server/index.js`:
```javascript
app.use(cors({
  origin: [
    'http://localhost:5174',
    'https://your-railway-url.railway.app'
  ]
}));
```

### Issue: Photos not persisting
**Solution:** Railway provides persistent volumes by default. Check that uploads folder exists.

### Issue: Port errors
**Solution:** Railway assigns `PORT` env variable. Update server:
```javascript
const PORT = process.env.PORT || 3001;
```

---

## Monitoring Your App

1. Go to Railway dashboard
2. Click on your project
3. View:
   - **Deployments** - build logs and history
   - **Metrics** - CPU, memory, network usage
   - **Logs** - real-time application logs

---

## Cost

Railway offers:
- **Free Trial:** $5 credit (no credit card)
- **Developer Plan:** $5/month for 500 execution hours
- **Hobby Plan:** $10/month for 500 execution hours + team features

Your app should easily fit in the free tier for testing!

---

## Next Steps

After deployment:
1. Test uploading photos from multiple devices
2. Verify votes persist
3. Test admin delete functionality
4. Share the Railway URL with users!

**Your app will be live at:** `https://your-project-name.up.railway.app`

---

## Need Help?

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Railway Status: https://status.railway.app
