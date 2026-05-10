$f = 'teacher-dashboard.html'
$lines = [System.IO.File]::ReadAllLines($f)
# Keep lines 1-762 (0-indexed: 0-761) and lines 929-end (0-indexed: 928-end)
$kept = $lines[0..761] + $lines[928..($lines.Length - 1)]
[System.IO.File]::WriteAllLines($f, $kept, [System.Text.Encoding]::UTF8)
Write-Host "Done. New line count: $($kept.Length)"
