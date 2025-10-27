# How to Verify GitHub Actions is Actually Working

## Step 1: Check GitHub Actions Status

1. Go to: https://github.com/jxhnthan/hwb-votes/actions
2. Look for "Keep App Awake" workflow
3. Check the most recent runs

### What to Look For:

✅ **Working correctly:**
- Runs show up every 5 minutes
- All runs have green checkmarks ✓
- Last run was within the last 10 minutes
- Click on a run → both ping steps show ✅

❌ **Not working:**
- No recent runs (nothing in last hour)
- Red X marks (failed runs)
- Runs are skipped or disabled
- Last run was hours/days ago

## Step 2: Check Render Service Logs

1. Go to: https://dashboard.render.com
2. Click on your `hwb-votes` service
3. Click "Logs" tab
4. Look for incoming requests

### What to Look For:

✅ **Working correctly:**
```
GET /api/health 200
GET /api/photos 200
```
These should appear every 5 minutes

❌ **Not working:**
- No incoming requests for 15+ minutes
- Only see requests when YOU visit the site
- Logs show service stopping/restarting

## Step 3: Check Service Status in Render

In your Render dashboard:

1. Check the service status indicator
2. Look for any warnings or errors
3. Check "Settings" → Confirm it says "Free" plan

### Common Issues:

**Issue 1: "This service has been suspended"**
- Means you hit the 750 hours/month limit
- **Solution:** Wait until next month, or upgrade to paid plan

**Issue 2: Service keeps crashing**
- Check logs for errors
- Might be out of memory
- **Solution:** Debug the error, or upgrade to paid plan

**Issue 3: GitHub Actions quota exceeded**
- Free tier has limits on Actions minutes
- **Solution:** Check GitHub billing/usage page

## Step 4: Manual Test

Test if pinging actually prevents sleep:

1. **Wait 20 minutes** without visiting the site
2. Check Render logs - service should be running
3. Try to visit the site:
   - **Fast load (<3 sec)** = Kept awake ✅
   - **Slow load (30-60 sec)** = Was sleeping ❌

## Step 5: Alternative - Use UptimeRobot

If GitHub Actions isn't reliable, use UptimeRobot as backup:

1. Sign up: https://uptimerobot.com
2. Add monitor:
   - **URL:** `https://hwb-votes.onrender.com/api/health`
   - **Type:** HTTP(s)
   - **Interval:** 5 minutes
3. Save

UptimeRobot will:
- Ping your app every 5 minutes
- Send you email if app goes down
- Show uptime statistics

## The Truth About Render Free Tier

⚠️ **Important Limitations:**

1. **750 hours per month limit**
   - 24 hours/day × 31 days = 744 hours
   - If you exceed this, app WILL sleep until next month
   - No amount of pinging will prevent this

2. **Sleep is a feature, not a bug**
   - Designed to save resources
   - Can't be completely disabled on free tier

3. **Wake-up time**
   - First request after sleep: 30-60 seconds
   - Subsequent requests: fast

## When to Upgrade to Paid Tier

Consider upgrading ($7/month) if:
- ❌ App keeps sleeping despite pings
- ❌ Hit 750 hour limit
- ❌ Need guaranteed uptime
- ❌ Wake-up delay is unacceptable

Paid tier benefits:
- ✅ No sleep
- ✅ Unlimited hours
- ✅ Better performance
- ✅ More memory

## Quick Diagnostic Command

Run this to see response time:

```powershell
Measure-Command { Invoke-WebRequest -Uri "https://hwb-votes.onrender.com/api/health" -UseBasicParsing } | Select-Object TotalSeconds
```

**Results:**
- < 3 seconds = App is awake ✅
- > 30 seconds = App was sleeping ❌

## Summary

**If GitHub Actions is running every 5 minutes AND pinging successfully:**
→ App should stay awake (unless you hit 750 hour limit)

**If app still sleeps:**
→ Either pings are failing, or you've hit the usage limit

**Best solution:**
→ Use BOTH GitHub Actions AND UptimeRobot for redundancy
