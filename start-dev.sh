#!/bin/bash

# Plant Saathi AI - Development Startup Script
# This script starts both the frontend and backend proxy servers

echo "🚀 Starting Plant Saathi AI Development Servers..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if backend-proxy/.env exists
if [ ! -f "backend-proxy/.env" ]; then
    echo -e "${YELLOW}⚠️  Warning: backend-proxy/.env not found${NC}"
    echo "Creating from .env.example..."
    cp backend-proxy/.env.example backend-proxy/.env
    echo -e "${YELLOW}Please edit backend-proxy/.env and add your API keys:${NC}"
    echo "  - OPENWEATHER_API_KEY"
    echo "  - BACKEND_API_KEY"
    echo ""
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Warning: .env not found${NC}"
    echo "Creating from .env.example..."
    cp .env.example .env
    echo -e "${YELLOW}Please edit .env and add your API keys:${NC}"
    echo "  - VITE_BACKEND_API_KEY (must match backend-proxy/.env)"
    echo ""
fi

# Function to kill processes on ports
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    pkill -f "vite" || true
    pkill -f "backend-proxy" || true
    lsof -ti:8080 | xargs kill -9 2>/dev/null || true
    lsof -ti:3002 | xargs kill -9 2>/dev/null || true
    echo "✅ Servers stopped"
    exit 0
}

# Trap Ctrl+C
trap cleanup INT TERM

# Kill any existing processes on the ports
echo "🧹 Cleaning up existing processes..."
lsof -ti:8080 | xargs kill -9 2>/dev/null || true
lsof -ti:3002 | xargs kill -9 2>/dev/null || true
sleep 1

# Start backend proxy in background
echo -e "${BLUE}📡 Starting Backend Proxy Server (Port 3002)...${NC}"
cd backend-proxy
PORT=3002 npm run dev > ../logs/backend-proxy.log 2>&1 &
BACKEND_PID=$!
cd ..
sleep 2

# Check if backend started successfully
if ps -p $BACKEND_PID > /dev/null; then
    echo -e "${GREEN}✅ Backend Proxy running on http://localhost:3002${NC}"
else
    echo -e "${YELLOW}⚠️  Backend Proxy failed to start. Check logs/backend-proxy.log${NC}"
fi

# Start frontend in background
echo -e "${BLUE}🎨 Starting Frontend Server (Port 8080)...${NC}"
npm run dev > logs/frontend.log 2>&1 &
FRONTEND_PID=$!
sleep 2

# Check if frontend started successfully
if ps -p $FRONTEND_PID > /dev/null; then
    echo -e "${GREEN}✅ Frontend running on http://localhost:8080${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend failed to start. Check logs/frontend.log${NC}"
fi

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 Plant Saathi AI is running!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  ${BLUE}Frontend:${NC}      http://localhost:8080"
echo -e "  ${BLUE}Backend Proxy:${NC} http://localhost:3002"
echo ""
echo -e "  ${BLUE}Test Weather:${NC}  file://$(pwd)/test-weather-api-direct.html"
echo ""
echo -e "${YELLOW}📝 Logs:${NC}"
echo -e "  Frontend:      tail -f logs/frontend.log"
echo -e "  Backend Proxy: tail -f logs/backend-proxy.log"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all servers${NC}"
echo ""

# Wait for processes
wait
