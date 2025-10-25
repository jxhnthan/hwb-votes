"""
Keep-Alive Script for HWB Votes App
Pings the application every 10 minutes to prevent it from going to sleep
"""

import requests
import time
from datetime import datetime
import sys

# Configuration
APP_URL = "https://hwb-votes.onrender.com"  # Your actual Render app URL
PING_INTERVAL = 600  # 10 minutes in seconds (less than 15 min sleep threshold)
ENDPOINT = "/api/photos"  # Endpoint to ping

def ping_app():
    """Send a ping request to keep the app alive"""
    try:
        url = f"{APP_URL}{ENDPOINT}"
        print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Pinging {url}...", end=" ")
        
        response = requests.get(url, timeout=30)
        
        if response.status_code == 200:
            print(f"✓ Success (Status: {response.status_code})")
            return True
        else:
            print(f"⚠ Warning (Status: {response.status_code})")
            return False
            
    except requests.exceptions.Timeout:
        print("✗ Timeout")
        return False
    except requests.exceptions.ConnectionError:
        print("✗ Connection Error")
        return False
    except Exception as e:
        print(f"✗ Error: {str(e)}")
        return False

def main():
    """Main loop to keep the app alive"""
    print("=" * 60)
    print("HWB Votes Keep-Alive Script")
    print("=" * 60)
    print(f"Target URL: {APP_URL}")
    print(f"Ping Interval: {PING_INTERVAL} seconds ({PING_INTERVAL/60} minutes)")
    print(f"Endpoint: {ENDPOINT}")
    print("=" * 60)
    print("\nPress Ctrl+C to stop\n")
    
    # Initial ping
    ping_app()
    
    try:
        while True:
            # Wait for the specified interval
            time.sleep(PING_INTERVAL)
            
            # Ping the app
            ping_app()
            
    except KeyboardInterrupt:
        print("\n\n" + "=" * 60)
        print("Keep-Alive script stopped by user")
        print("=" * 60)
        sys.exit(0)

if __name__ == "__main__":
    # Check if requests library is installed
    try:
        import requests
    except ImportError:
        print("Error: 'requests' library not found")
        print("Please install it using: pip install requests")
        sys.exit(1)
    
    main()
