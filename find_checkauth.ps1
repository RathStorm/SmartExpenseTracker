$content = Get-Content ExpenseTrackerFarm2/script.js -Raw
$pattern = 'function checkAuth\(\) \{[^}]+\}'
if ($content -match $pattern) {
    $matches[0]
} else {
    "Not found in simple pattern, searching broader..."
    $lines = Get-Content ExpenseTrackerFarm2/script.js
    $startLine = -1
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match 'function checkAuth') {
            $startLine = $i
            break
        }
    }
    if ($startLine -ge 0) {
        $lines[$startLine..($startLine + 40)] -join "`n"
    }
}
