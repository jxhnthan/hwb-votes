# Test if your Render app is responding
# Run this to verify the keep-alive is working

Write-Host "Testing HWB Votes app response..." -ForegroundColor Cyan
Write-Host ""

$url = "https://hwb-votes.onrender.com/api/photos"

Write-Host "Sending request to: $url" -ForegroundColor Yellow

try {
    $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 90
    $stopwatch.Stop()
    
    $responseTime = $stopwatch.Elapsed.TotalSeconds
    
    Write-Host ""
    Write-Host "✅ SUCCESS!" -ForegroundColor Green
    Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response Time: $([math]::Round($responseTime, 2)) seconds" -ForegroundColor $(if ($responseTime -lt 3) { "Green" } elseif ($responseTime -lt 10) { "Yellow" } else { "Red" })
    Write-Host ""
    
    if ($responseTime -lt 3) {
        Write-Host "🎉 App is AWAKE and fast!" -ForegroundColor Green
    } elseif ($responseTime -lt 15) {
        Write-Host "⚠️  App is awake but slow. Might have been waking up." -ForegroundColor Yellow
    } else {
        Write-Host "😴 App was SLEEPING and just woke up!" -ForegroundColor Red
        Write-Host "   Keep-alive may not be working properly." -ForegroundColor Red
    }
    
} catch {
    Write-Host ""
    Write-Host "❌ ERROR!" -ForegroundColor Red
    Write-Host "Message: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "This could mean:" -ForegroundColor Yellow
    Write-Host "  - App is down" -ForegroundColor Yellow
    Write-Host "  - Network issue" -ForegroundColor Yellow
    Write-Host "  - Request timeout (app taking too long to wake up)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Tip: Run this script multiple times:" -ForegroundColor Cyan
Write-Host "  - First time: Might be slow (waking up)" -ForegroundColor Cyan
Write-Host "  - Second time: Should be fast (already awake)" -ForegroundColor Cyan
Write-Host "  - Wait 20 minutes and test again to verify keep-alive" -ForegroundColor Cyan
