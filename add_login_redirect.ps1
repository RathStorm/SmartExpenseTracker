# Read the entire file
$content = Get-Content ExpenseTrackerFarm2/script.js -Raw

# Find and replace the checkAuth function
$oldFunction = @'
function checkAuth() {
  if (currentUser) {
    showPage('dashboard');
  }
}
'@

$newFunction = @'
function checkAuth() {
  if (currentUser) {
    showPage('dashboard');
  } else {
    showPage('login');
  }
}
'@

if ($content.Contains("function checkAuth()")) {
    $content = $content.Replace($oldFunction, $newFunction)
    Set-Content -Path ExpenseTrackerFarm2/script.js -Value $content -NoNewline
    Write-Host "Successfully added login redirect to checkAuth function!"
} else {
    Write-Host "Could not find checkAuth function"
}
