# PowerShell script to deploy changes to GitHub

# Check if Git is installed
$gitInstalled = $false
try {
    $gitVersion = Invoke-Expression "git --version" -ErrorAction SilentlyContinue
    if ($gitVersion) {
        $gitInstalled = $true
        Write-Host "Git is installed: $gitVersion" -ForegroundColor Green
    }
} catch {
    Write-Host "Git is not installed or not in PATH" -ForegroundColor Red
}

if (-not $gitInstalled) {
    Write-Host "Installing Git using winget..." -ForegroundColor Yellow
    try {
        # Try to install Git using winget
        Invoke-Expression "winget install --id Git.Git -e --source winget" -ErrorAction SilentlyContinue
        
        # Refresh environment variables
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        
        # Check if Git is now installed
        $gitVersion = Invoke-Expression "git --version" -ErrorAction SilentlyContinue
        if ($gitVersion) {
            $gitInstalled = $true
            Write-Host "Git installed successfully: $gitVersion" -ForegroundColor Green
        } else {
            Write-Host "Failed to install Git automatically" -ForegroundColor Red
            Write-Host "Please install Git manually from https://git-scm.com/download/win" -ForegroundColor Yellow
            exit 1
        }
    } catch {
        Write-Host "Failed to install Git automatically: $_" -ForegroundColor Red
        Write-Host "Please install Git manually from https://git-scm.com/download/win" -ForegroundColor Yellow
        exit 1
    }
}

# Check if the directory is a Git repository
$isGitRepo = Test-Path -Path ".git" -PathType Container
if (-not $isGitRepo) {
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    Invoke-Expression "git init"
    
    # Ask for GitHub repository URL
    $repoUrl = Read-Host "Enter your GitHub repository URL (e.g., https://github.com/username/repo.git)"
    if (-not $repoUrl) {
        Write-Host "No repository URL provided. Exiting." -ForegroundColor Red
        exit 1
    }
    
    # Add remote origin
    Invoke-Expression "git remote add origin $repoUrl"
}

# Get list of modified files
Write-Host "\nModified files in the last 24 hours:" -ForegroundColor Cyan
$modifiedFiles = Get-ChildItem -Path . -Recurse -File | Where-Object {$_.LastWriteTime -gt (Get-Date).AddHours(-24)} | Select-Object -ExpandProperty FullName
foreach ($file in $modifiedFiles) {
    Write-Host "- $file" -ForegroundColor Gray
}

# Confirm deployment
Write-Host "\nAutomatically committing changes..." -ForegroundColor Yellow
$confirmation = 'y' # Auto-confirm

# Add all changes
Write-Host "\nAdding changes to Git..." -ForegroundColor Yellow
Invoke-Expression "git add ."

# Commit changes
$commitMessage = Read-Host "Enter commit message (default: 'Update website with new features')"
if (-not $commitMessage) {
    $commitMessage = "Update website with new features"
}

Write-Host "Committing changes..." -ForegroundColor Yellow
Invoke-Expression "git commit -m `"$commitMessage`""

# Check if branch exists
$currentBranch = Invoke-Expression "git branch --show-current"
if (-not $currentBranch) {
    # Create main branch if no branch exists
    Write-Host "Creating main branch..." -ForegroundColor Yellow
    Invoke-Expression "git checkout -b main"
    $currentBranch = "main"
}

# Push changes
Write-Host "Pushing changes to GitHub..." -ForegroundColor Yellow
try {
    Invoke-Expression "git push -u origin $currentBranch"
    Write-Host "\nDeployment successful!" -ForegroundColor Green
} catch {
    Write-Host "\nFailed to push changes: $_" -ForegroundColor Red
    Write-Host "You may need to authenticate with GitHub." -ForegroundColor Yellow
}