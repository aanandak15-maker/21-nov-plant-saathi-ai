# 🔧 Fix Gemini Cache Issue

## Problem
Still seeing error: `models/gemini-1.5-flash is not found`

Even though the code has been updated to `gemini-flash-latest`.

## Root Cause
**Browser cache** is serving old JavaScript code.

## Solution (Choose One)

### Option 1: Hard Refresh (Fastest)
```
Windows/Linux: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

### Option 2: Clear Cache & Reload
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

### Option 3: Restart Dev Server
```bash
# Stop the dev server (Ctrl+C)
# Then restart:
npm run dev
# or
yarn dev
```

### Option 4: Clear Build Cache
```bash
# Delete build artifacts
rm -rf dist/
rm -rf node_modules/.vite/

# Restart dev server
npm run dev
```

## Verify Fix

1. Open browser DevTools (F12)
2. Go to Network tab
3. Check "Disable cache"
4. Refresh page
5. Try AI chat again

## Expected Result

✅ AI chat works without errors
✅ Console shows no 404 errors
✅ Gemini responds successfully

## If Still Not Working

Check the actual API URL being called:
1. Open DevTools → Network tab
2. Send a message to AI
3. Look for request to `generativelanguage.googleapis.com`
4. Check the URL - should contain `gemini-flash-latest`

If it still shows `gemini-1.5-flash`, the browser is definitely using cached code.

## Nuclear Option (If Nothing Else Works)

```bash
# Clear everything
rm -rf dist/
rm -rf node_modules/.vite/
rm -rf .vite/

# Restart
npm run dev
```

Then do a hard refresh in browser (Ctrl+Shift+R).

## Prevention

Add this to your dev workflow:
- Always hard refresh after code changes
- Keep DevTools open with "Disable cache" checked
- Use incognito mode for testing

---

**The code is correct. This is purely a caching issue!**
