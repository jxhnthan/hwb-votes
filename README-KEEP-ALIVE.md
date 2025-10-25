# Keep-Alive Script

This Python script keeps your HWB Votes app awake by pinging it every 10 minutes, preventing it from going to sleep on platforms like Render.

## Setup

1. **Install Python** (if not already installed)
   - Download from [python.org](https://www.python.org/downloads/)
   - Make sure to check "Add Python to PATH" during installation

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```
   
   Or install directly:
   ```bash
   pip install requests
   ```

3. **Configure the script**
   - Open `keep-alive.py`
   - Replace `APP_URL` with your actual deployed app URL
   ```python
   APP_URL = "https://hwb-votes.onrender.com"  # Your actual URL
   ```

4. **Run the script**
   ```bash
   python keep-alive.py
   ```

## Usage

### Run in foreground (for testing)
```bash
python keep-alive.py
```
Press `Ctrl+C` to stop.

### Run in background (Windows)
Using PowerShell:
```powershell
Start-Process python -ArgumentList "keep-alive.py" -WindowStyle Hidden
```

Or use Task Scheduler:
1. Open Task Scheduler
2. Create Basic Task
3. Set trigger to "When I log on"
4. Action: Start a program
5. Program: `python`
6. Arguments: `C:\Users\johna\OneDrive\Desktop\hwb-votes\keep-alive.py`

### Run in background (Linux/Mac)
```bash
nohup python keep-alive.py > keep-alive.log 2>&1 &
```

Or use `screen`:
```bash
screen -S keep-alive
python keep-alive.py
# Press Ctrl+A then D to detach
# To reattach: screen -r keep-alive
```

## Configuration

You can adjust these settings in `keep-alive.py`:

- **PING_INTERVAL**: Time between pings in seconds (default: 600 = 10 minutes)
- **ENDPOINT**: API endpoint to ping (default: `/api/photos`)
- **APP_URL**: Your deployed app URL

## Alternative: Use a Service

Instead of running this script yourself, you can use free services like:

1. **UptimeRobot** (uptimerobot.com)
   - Free monitoring for up to 50 monitors
   - Checks every 5 minutes
   - No script needed

2. **Cron-job.org** (cron-job.org)
   - Free HTTP pings
   - Set to run every 10 minutes

3. **Better Uptime** (betteruptime.com)
   - Free tier available
   - Monitors your app and keeps it awake

## Notes

- The script pings every 10 minutes (less than the 15-minute sleep threshold)
- It uses minimal resources and bandwidth
- Logs each ping attempt with timestamp and status
- Automatically handles errors and retries
