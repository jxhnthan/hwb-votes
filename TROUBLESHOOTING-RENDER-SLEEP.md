# Troubleshooting: Render App Still Going to Sleep

## The Problem

Your Render free tier app goes to sleep after **15 minutes of inactivity**, despite having a keep-alive script.

## Why It's Happening

### ❌ Common Issues:

1. **Local Script Not Running 24/7**
   - The `keep-alive.py` script only works when YOUR computer is on and running
   - If your computer sleeps, shuts down, or loses internet → the script stops
   - **This is the most common issue!**

2. **GitHub Actions Not Enabled**
   - The workflow file exists but might not be pushed to GitHub
   - GitHub Actions only runs if the workflow is in your GitHub repository

3. **Render Takes Time to Wake Up**
   - First request after sleep can take 30-60 seconds
   - If timeout is too short, it might appear to fail

## ✅ Solutions

### Option 1: GitHub Actions (Best Solution - 100% Free)

**Status Check:**
1. Go to your GitHub repository: `https://github.com/jxhnthan/hwb-votes`
2. Click on the "Actions" tab
3. Look for "Keep App Awake" workflow
4. Check if it's running every 5 minutes

**If not running:**
```powershell
# Make sure all files are committed and pushed
git add .github/workflows/keep-alive.yml
git commit -m "Update keep-alive workflow"
git push origin main
```

**How to verify it's working:**
- Go to GitHub → Actions tab
- Click on "Keep App Awake" workflow
- You should see runs every 5 minutes
- Click on a run to see the logs
- Both ping steps should show "✅"

### Option 2: UptimeRobot (Alternative - Also Free)

If GitHub Actions isn't working, use UptimeRobot:

1. **Sign up:** https://uptimerobot.com (free)
2. **Add Monitor:**
   - Monitor Type: HTTP(s)
   - Friendly Name: HWB Votes
   - URL: `https://hwb-votes.onrender.com/api/photos`
   - Monitoring Interval: 5 minutes (free tier)
3. **Save**

That's it! UptimeRobot will ping your app every 5 minutes automatically.

### Option 3: Cron-job.org (Another Alternative)

1. **Sign up:** https://cron-job.org (free)
2. **Create Cronjob:**
   - URL: `https://hwb-votes.onrender.com/api/photos`
   - Schedule: Every 5 minutes
   - Title: Keep HWB Votes Awake
3. **Save**

## How to Test

### Test if your app is sleeping:

1. **Wait 20 minutes** without visiting the site
2. Try to load: `https://hwb-votes.onrender.com`
3. If it takes 30+ seconds to load → it was asleep
4. Check again in 5-10 minutes → should load instantly

### Test if keep-alive is working:

**Method 1: Check Render logs**
```
1. Go to Render Dashboard
2. Click on your app
3. Click "Logs" tab
4. You should see activity every 5 minutes
```

**Method 2: Monitor response time**
```powershell
# Run this on your computer
while ($true) {
    $time = Measure-Command { Invoke-WebRequest -Uri "https://hwb-votes.onrender.com/api/photos" -UseBasicParsing }
    Write-Host "Response time: $($time.TotalSeconds) seconds - $(Get-Date)"
    Start-Sleep -Seconds 60
}
```

If response time is consistently under 2 seconds → app is staying awake! 🎉
If response time spikes to 30-60 seconds → app is waking from sleep 😴

## Recommended Setup

**Use BOTH for redundancy:**

1. ✅ **GitHub Actions** (primary)
   - Already set up in `.github/workflows/keep-alive.yml`
   - Runs every 5 minutes
   - Free forever

2. ✅ **UptimeRobot** (backup)
   - Also pings every 5 minutes
   - Free forever
   - Sends you alerts if app goes down

This way, if one fails, the other keeps your app awake!

## Important Notes

### About the Local Python Script (`keep-alive.py`)

❌ **Don't rely on this** - it only works when:
- Your computer is ON
- The script is running
- You have internet connection
- Your computer doesn't sleep

This is fine for testing but **NOT reliable** for production.

### Why We Removed `exit 1` from Workflow

The old workflow would fail if status wasn't exactly 200. But:
- Initial wake-up can return different codes
- App might return 304 (Not Modified) - which is fine
- Better to log and continue than to fail

### Render Free Tier Limitations

- Sleeps after **15 minutes** of inactivity
- Takes **30-60 seconds** to wake up
- Limited to **750 hours/month** of runtime
- If you need 24/7 uptime, consider upgrading to paid tier ($7/month)

## Quick Checklist

- [ ] GitHub Actions workflow is pushed to GitHub
- [ ] GitHub Actions tab shows workflow running every 5 minutes
- [ ] OR UptimeRobot monitor is set up and active
- [ ] Test: Wait 20 minutes, then check if app loads quickly
- [ ] If still sleeping: Check Render logs for incoming requests

## Still Having Issues?

1. Check Render Dashboard → Logs
2. Check GitHub Actions → Workflow runs
3. Make sure you're on Render's free tier (not starter)
4. Consider upgrading to paid tier for guaranteed uptime
