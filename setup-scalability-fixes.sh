#!/bin/bash
# Quick Setup Script - Run this after implementing fixes

echo "🚀 Plant Saathi AI - Scalability Fixes Setup"
echo "=============================================="
echo ""

# 1. Generate API Key
echo "1️⃣ Generating secure API key..."
API_KEY=$(openssl rand -base64 32)
echo "Generated API Key: $API_KEY"
echo ""

# 2. Update backend .env
echo "2️⃣ Updating backend-proxy/.env..."
if [ ! -f backend-proxy/.env ]; then
  cp backend-proxy/.env.example backend-proxy/.env
fi
echo "BACKEND_API_KEY=$API_KEY" >> backend-proxy/.env
echo "✅ Backend .env updated"
echo ""

# 3. Update frontend .env
echo "3️⃣ Updating frontend .env..."
if [ ! -f .env ]; then
  cp .env.example .env
fi
echo "VITE_BACKEND_API_KEY=$API_KEY" >> .env
echo "✅ Frontend .env updated"
echo ""

# 4. Instructions for Supabase
echo "4️⃣ Next Steps - Supabase Migrations:"
echo "   a) Open Supabase SQL Editor"
echo "   b) Run: supabase/migrations/add_performance_indexes.sql"
echo "   c) Run: supabase/migrations/create_view_events_system.sql"
echo "   d) Set up hourly cron job:"
echo "      SELECT cron.schedule('refresh-view-counts', '0 * * * *', 'SELECT refresh_view_counts()');"
echo ""

# 5. Restart services
echo "5️⃣ Restart Instructions:"
echo "   Backend: cd backend-proxy && npm start"
echo "   Frontend: npm run dev"
echo ""

echo "🎉 Setup complete! Your API key is: $API_KEY"
echo "⚠️  Save this key securely - you'll need it for deployment"
