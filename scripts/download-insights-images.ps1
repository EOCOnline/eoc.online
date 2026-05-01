$imgDir = "d:\Projects\EOC.online\eoc.online\content\english\insights\2023\images\497"
New-Item -ItemType Directory -Force -Path $imgDir | Out-Null

$urls = @{
    "King County Fires, 2015-2019.png" = "https://vashonbeprepared.org/images/497/King%20County%20Fires%2C%202015-2019.png"
    "WA Fires 2015-2019 by Type.png"   = "https://vashonbeprepared.org/images/497/WA%20Fires%202015-2019%20by%20Type.png"
    "WA Fires 2015-2019 by Cause.png"  = "https://vashonbeprepared.org/images/497/WA%20Fires%202015-2019%20by%20Cause.png"
}
foreach ($kv in $urls.GetEnumerator()) {
    $dest = Join-Path $imgDir $kv.Key
    try {
        Invoke-WebRequest -Uri $kv.Value -OutFile $dest -UseBasicParsing -TimeoutSec 15
        Write-Host "OK: $($kv.Key) ($((Get-Item $dest).Length) bytes)"
    } catch {
        Write-Host "FAIL: $($kv.Key) — $($_.Exception.Message)"
    }
}

# Also try wildfireClass.jpg for entry 495
$wfDir = "d:\Projects\EOC.online\eoc.online\static\Portals\1\Graphics\Fire"
New-Item -ItemType Directory -Force -Path $wfDir | Out-Null
try {
    Invoke-WebRequest -Uri "https://vashonbeprepared.org/Portals/1/Graphics/Fire/wildfireClass.jpg" -OutFile "$wfDir\wildfireClass.jpg" -UseBasicParsing -TimeoutSec 15
    Write-Host "OK: wildfireClass.jpg ($((Get-Item "$wfDir\wildfireClass.jpg").Length) bytes)"
} catch {
    Write-Host "FAIL: wildfireClass.jpg — $($_.Exception.Message)"
}
