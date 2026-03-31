$logFile = [System.IO.Path]::GetTempFileName()

$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = 'cloudflared'
$psi.Arguments = 'tunnel --url http://localhost:4200 --http-host-header localhost:4200'
$psi.RedirectStandardOutput = $true
$psi.RedirectStandardError = $true
$psi.UseShellExecute = $false

$process = New-Object System.Diagnostics.Process
$process.StartInfo = $psi

$handler = {
    $line = $Event.SourceEventArgs.Data
    if ($line) {
        Write-Host $line
        if ($line -match 'https://[a-z0-9\-]+\.trycloudflare\.com') {
            Set-Content -Path $logFile -Value $Matches[0]
        }
    }
}

Register-ObjectEvent -InputObject $process -EventName OutputDataReceived -Action $handler | Out-Null
Register-ObjectEvent -InputObject $process -EventName ErrorDataReceived -Action $handler | Out-Null

$process.Start() | Out-Null
$process.BeginOutputReadLine()
$process.BeginErrorReadLine()

Write-Host 'Waiting for cloudflare URL...'
$timeout = 60
$elapsed = 0
while ($elapsed -lt $timeout) {
    $content = Get-Content $logFile -ErrorAction SilentlyContinue
    if ($content) {
        Write-Host "Opening in 10 seconds: $content"
        Start-Sleep -Seconds 10
        Start-Process $content
        break
    }
    Start-Sleep -Seconds 2
    $elapsed += 2
}
if ($elapsed -ge $timeout) {
    Write-Host 'Timeout: cloudflare URL not found'
}

$process.WaitForExit()
