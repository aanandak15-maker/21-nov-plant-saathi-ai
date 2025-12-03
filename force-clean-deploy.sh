#!/bin/bash

# Clear Vercel Build Cache and Force Fresh Deploy
# Use this if blog layout still appears broken after deployment

echo "🧹 Clearing local build artifacts..."
rm -rf dist/
rm -rf node_modules/.vite/
rm -rf .vercel/

echo "📦 Rebuilding locally to verify..."
npm run build

echo "🚀 Deploying to Vercel with cache bypass..."
vercel --prod --yes --force

echo "✅ Done! New deployment should include all CSS classes."
echo "🔗 Check your deployment URL to verify the fix."
