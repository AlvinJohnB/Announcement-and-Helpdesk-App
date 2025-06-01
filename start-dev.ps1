Write-Host "Starting the Announcement Board App..." -ForegroundColor Cyan
Write-Host "--------------------------------------" -ForegroundColor Cyan

# Check if MongoDB is running
Write-Host "Checking MongoDB status..." -ForegroundColor Yellow
$mongoStatus = Get-Service -Name MongoDB -ErrorAction SilentlyContinue

if ($mongoStatus -ne $null) {
    if ($mongoStatus.Status -ne "Running") {
        Write-Host "MongoDB is installed but not running. Starting MongoDB..." -ForegroundColor Yellow
        Start-Service -Name MongoDB
        Write-Host "MongoDB service started successfully!" -ForegroundColor Green
    }
    else {
        Write-Host "MongoDB is running. Great!" -ForegroundColor Green
    }
}
else {
    Write-Host "MongoDB service not found. Please install MongoDB from:" -ForegroundColor Red
    Write-Host "https://www.mongodb.com/try/download/community" -ForegroundColor Blue
    Write-Host "After installing, run this script again." -ForegroundColor Yellow
    
    $install = Read-Host "Do you want to continue without MongoDB? (y/n)"
    if ($install -ne "y") {
        exit
    }
    Write-Host "Continuing without verifying MongoDB..." -ForegroundColor Yellow
}

Write-Host "`nStarting development server..." -ForegroundColor Cyan
Set-Location "C:\Users\BREGS\Documents\Announcement Board App"
npm run dev
