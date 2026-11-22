#!/bin/sh
# Renders ads.html#1..5 to ad-1.png..ad-5.png (1080x1350) with Playwright's headless Chromium.
CH="$LOCALAPPDATA/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe"
DIR="C:/Users/gende/Documents/nexusmedia/marketing/fb-ads-calculator"
for i in ${@:-1 2 3 4 5}; do
  "$CH" --headless --no-sandbox --disable-gpu --in-process-gpu --use-angle=swiftshader --hide-scrollbars \
    --window-size=1080,1350 --virtual-time-budget=8000 \
    --screenshot="$DIR/ad-$i.png" "file:///$DIR/ads.html#$i" 2>/dev/null | grep -o 'bytes written'
done
