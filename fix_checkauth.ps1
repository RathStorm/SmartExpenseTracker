$content = Get-Content ExpenseTrackerFarm2/script.js -Raw

# Replace the checkAuth function
$pattern = 'function checkAuth\(\) \{\s+if \(currentUser\) \{\s+showPage\(''dashboard''\);\s+\}\s+\}'
$replacement = @'
function checkAuth() {
  if (currentUser) {
    showPage('dashboard');
  } else {
    showPage('login');
  }
}
'@

$newContent = $content -replace $pattern, $replacement

if ($newContent -ne $content) {
    $newContent | Set-Content ExpenseTrackerFarm2/script.js -NoNewline
    Write-Host "Successfully updated checkAuth function!"
} else {
    Write-Host "Pattern not found, trying alternative approach..."
    # Alternative: find and replace line by line
    $lines = Get-Content ExpenseTrackerFarm2/script.js
    $output = @()
    $i = 0
    while ($i -lt $lines.Count) {
        if ($lines[$i] -match 'function checkAuth\(\)') {
            $output += $lines[$i]  # function checkAuth() {
            $i++
            $output += $lines[$i]  # if (currentUser) {
            $i++
            $output += $lines[$i]  # showPage('dashboard');
            $i++
            $output += $lines[$i]  # }
            $i++
            # Add else clause before the closing brace
            $output += "  } else {"
            $output += "    showPage('login');"
            # Skip the closing brace, we'll add it
            if ($lines[$i] -match '^\}') {
                $output += $lines[$i]  # }
                $i++
            }
        } else {
            $output += $lines[$i]
            $i++
        }
    }
    $output | Set-Content ExpenseTrackerFarm2/script.js
    Write-Host "Updated using line-by-line approach!"
}
