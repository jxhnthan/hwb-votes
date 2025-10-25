# Deploy to Render.com - 100% FREE# Deploy to Render.com (100% FREE)



Render.com offers a completely free tier with persistent storage - perfect for this app!Render.com offers a **free tier with NO credit card required!**



## ✅ Why Render?## ✨ Free Tier Features

- ✅ Persistent storage (photos stay)

- ✅ **100% Free** - No credit card required- ✅ SQLite works

- ✅ **Persistent Disk** - Photos stay forever (1GB free)- ✅ 750 hours/month free

- ✅ **SQLite Support** - Database works out of the box- ⚠️ Spins down after 15 min of inactivity (slow first load after sleep)

- ✅ **750 Hours/Month Free** - More than enough

- ⚠️ **Spins down after 15 min** - First load after inactivity is slow (~30 sec)---



---## 🚀 Deploy Steps (5 minutes)



## 🚀 Deploy in 5 Minutes### Step 1: Push to GitHub



### Step 1: Push to GitHub```bash

git init

```bashgit add .

# Initialize gitgit commit -m "Deploy to Render"

git initgit branch -M main

```

# Add all files

git add .Create a new repo on GitHub: https://github.com/new



# Commit```bash

git commit -m "Deploy to Render"git remote add origin https://github.com/YOUR_USERNAME/hwb-votes.git

git push -u origin main

# Create repo on GitHub, then:```

git remote add origin https://github.com/YOUR_USERNAME/hwb-votes.git

git branch -M main### Step 2: Sign Up for Render

git push -u origin main

```1. Go to https://render.com

2. Click **"Get Started for Free"**

### Step 2: Sign Up on Render3. Sign up with GitHub (easiest)



1. Go to https://render.com### Step 3: Create New Web Service

2. Click **"Get Started for Free"**

3. Sign up with GitHub (easiest)1. Click **"New +"** → **"Web Service"**

2. Connect your GitHub repo: `hwb-votes`

### Step 3: Create New Web Service3. Configure:



1. Click **"New +"** → **"Web Service"**   **Name:** `hwb-votes` (or whatever you want)  

2. Connect your GitHub account   **Environment:** `Node`  

3. Select your `hwb-votes` repository   **Region:** Choose closest to you  

4. Render auto-detects settings from `render.yaml`!   **Branch:** `main`  

   **Build Command:** `npm run install-all && npm run build`  

### Step 4: Configure (Auto-filled from render.yaml)   **Start Command:** `npm start`  



- **Name:** `hwb-votes`4. Select **FREE** plan

- **Environment:** `Node`5. Click **"Create Web Service"**

- **Build Command:** `npm run install-all && npm run build`

- **Start Command:** `npm start`### Step 4: Wait for Deployment

- **Instance Type:** **Free**

- Takes 3-5 minutes first time

### Step 5: Add Persistent Disk- Watch the logs for any errors

- Once done, you'll get a URL like: `https://hwb-votes.onrender.com`

1. Scroll to **"Disk"** section

2. Click **"Add Disk"**### Step 5: Test Your App

3. **Name:** `uploads`

4. **Mount Path:** `/opt/render/project/src/server/uploads`Open the URL and test:

5. **Size:** `1 GB` (free)- ✅ Upload a photo

- ✅ Vote on photos

### Step 6: Deploy!- ✅ Admin mode works

- ✅ Delete works

Click **"Create Web Service"**

---

Render will:

- Build your app (~2-3 minutes)## ⚙️ Optional: Add Disk Storage (For Production)

- Deploy automatically

- Give you a URL: `https://hwb-votes.onrender.com`Free tier includes disk storage, but you need to add it:



---1. Go to your service dashboard

2. Click **"Disks"** in left sidebar

## 🎉 That's It!3. Click **"Add Disk"**

4. Name: `uploads`

Your app is live! Test it:5. Mount Path: `/opt/render/project/src/server/uploads`

- Upload photos6. Size: 1 GB (free)

- Vote from multiple devices7. Click **"Save"**

- Photos persist forever on the disk

This ensures photos persist even if the app restarts!

---

---

## ⚠️ Important Notes

## 📊 Free Tier Limitations

### Free Tier Limitations:

- **Spins down after 15 min of inactivity**### What's Free:

  - First request after sleep takes ~30 seconds to wake up- 750 hours/month (enough for 24/7 if only 1 app)

  - Subsequent requests are instant- 100 GB bandwidth/month

  - Perfect for events/competitions with active users- Automatic HTTPS

- Custom domains

### Keep It Awake (Optional):- Persistent disk storage

Use a free service like **UptimeRobot** to ping your app every 14 minutes to prevent sleeping.

### Limitations:

---- **Spins down after 15 min** of no traffic

  - First visit after sleep = 30-60 second load time

## 🔧 Troubleshooting  - After that, fast again

- Slower CPU than paid plans

### "Build failed"

Check Render logs:### Workaround for Spin-Down:

1. Go to your service dashboardUse a free uptime monitor to ping your app every 10 min:

2. Click "Logs" tab- https://uptimerobot.com (free)

3. Look for errors- https://cron-job.org (free)



### "Photos disappearing"---

Make sure persistent disk is mounted:

1. Go to service → "Disk" tab## 🔧 Troubleshooting

2. Verify mount path: `/opt/render/project/src/server/uploads`

### "Build failed"

### "Can't access app"Check logs in Render dashboard. Common issues:

Wait 30 seconds if it's been inactive - it's waking up!- Missing dependencies (run `npm run install-all` locally first)

- Build command wrong (should be: `npm run install-all && npm run build`)

---

### "Cannot GET /"

## 💰 Pricing- Make sure `npm run build` worked

- Check that `client/dist` folder was created

**Free Tier Includes:**- Server should serve static files (already configured)

- 750 hours/month (more than 30 days!)

- 512MB RAM### Photos disappearing

- 1GB persistent disk- Add persistent disk storage (see "Add Disk Storage" above)

- Shared CPU- Mount path must match `server/uploads/`

- Custom domain support

### API errors

**Paid Plans (Optional):**- Check environment variables in Render dashboard

- $7/month for always-on (no spin down)- Make sure `NODE_ENV=production` is set

- More RAM/CPU

---

---

## 🎉 You're Live!

## 📊 Monitor Your App

Share your URL: `https://your-app-name.onrender.com`

Dashboard shows:

- **Logs** - Real-time server logsAdmin password: `hwbadmin2025`

- **Metrics** - CPU, Memory, Requests

- **Disk Usage** - How much space photos use---

- **Deploy History** - All deployments

## 💡 Other Free Alternatives

---

If Render doesn't work, try:

## 🔄 Auto-Deploy

### Fly.io (Free Tier)

Every time you push to GitHub, Render auto-deploys!```bash

# Install Fly CLI

```bashpowershell -Command "iwr https://fly.io/install.ps1 -useb | iex"

git add .

git commit -m "Update feature"# Deploy

git pushfly launch

```fly deploy

```

Render rebuilds and deploys automatically. 🎉

### Glitch.com

---1. Go to https://glitch.com

2. Click "New Project" → "Import from GitHub"

## 🆚 Render vs Railway vs Vercel3. Paste your GitHub URL

4. Done!

| Feature | Render | Railway | Vercel |

|---------|--------|---------|--------|---

| **Free Tier** | ✅ Yes | ❌ Trial only | ✅ Yes |

| **Persistent Storage** | ✅ 1GB free | ✅ Yes | ❌ No |## Need Help?

| **SQLite Support** | ✅ Yes | ✅ Yes | ❌ No |

| **Always On** | ❌ Spins down | ✅ Yes | ✅ Yes |- Render Docs: https://render.com/docs

| **Good for File Uploads** | ✅ Perfect | ✅ Perfect | ❌ No |- Render Community: https://community.render.com


**Verdict:** Render is the best free option for your app!

---

## Need Help?

- Render Docs: https://render.com/docs
- Community: https://community.render.com
- Status: https://status.render.com
