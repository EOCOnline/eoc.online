$src = "d:\Projects\EOC.online\eoc.online\assets\images\logos\eoc.online-logo.png"
$out = "d:\Projects\EOC.online\eoc.online\static"

$sizes = @(16,32,48,57,60,64,70,72,76,96,114,120,144,150,152,167,180,192,256,310,512)
foreach ($s in $sizes) {
    magick $src -resize "${s}x${s}" -gravity center -background none -extent "${s}x${s}" "$out\favicon-${s}x${s}.png"
    Write-Host "  favicon-${s}x${s}.png"
}

# Named aliases
Copy-Item "$out\favicon-180x180.png" "$out\apple-touch-icon.png" -Force
Copy-Item "$out\favicon-180x180.png" "$out\apple-touch-icon-180x180.png" -Force
Copy-Item "$out\favicon-180x180.png" "$out\apple-touch-icon-precomposed.png" -Force
Copy-Item "$out\favicon-57x57.png"   "$out\apple-touch-icon-57x57.png" -Force
Copy-Item "$out\favicon-60x60.png"   "$out\apple-touch-icon-60x60.png" -Force
Copy-Item "$out\favicon-72x72.png"   "$out\apple-touch-icon-72x72.png" -Force
Copy-Item "$out\favicon-76x76.png"   "$out\apple-touch-icon-76x76.png" -Force
Copy-Item "$out\favicon-114x114.png" "$out\apple-touch-icon-114x114.png" -Force
Copy-Item "$out\favicon-120x120.png" "$out\apple-touch-icon-120x120.png" -Force
Copy-Item "$out\favicon-144x144.png" "$out\apple-touch-icon-144x144.png" -Force
Copy-Item "$out\favicon-152x152.png" "$out\apple-touch-icon-152x152.png" -Force
Copy-Item "$out\favicon-167x167.png" "$out\apple-touch-icon-167x167.png" -Force
Copy-Item "$out\favicon-192x192.png" "$out\android-chrome-192x192.png" -Force
Copy-Item "$out\favicon-512x512.png" "$out\android-chrome-512x512.png" -Force
Copy-Item "$out\favicon-70x70.png"   "$out\ms-icon-70x70.png" -Force
Copy-Item "$out\favicon-150x150.png" "$out\ms-icon-150x150.png" -Force
Copy-Item "$out\favicon-144x144.png" "$out\ms-icon-144x144.png" -Force
Copy-Item "$out\favicon-310x310.png" "$out\ms-icon-310x310.png" -Force
Copy-Item "$out\favicon-150x150.png" "$out\mstile-150x150.png" -Force
Copy-Item "$out\favicon-512x512.png" "$out\favicon.png" -Force

# Multi-size favicon.ico (16, 32, 48 embedded)
magick "$out\favicon-16x16.png" "$out\favicon-32x32.png" "$out\favicon-48x48.png" "$out\favicon.ico"
Write-Host "  favicon.ico (multi-size: 16+32+48)"

Write-Host "All favicons generated."
