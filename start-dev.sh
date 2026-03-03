#!/bin/bash

echo "🚀 Starting Consumer Portal Development Server..."
echo "📍 Directory: $(pwd)"
echo "🌐 Backend API: http://115.124.119.161:5029/api/v1"
echo "👤 Login Credentials: CNS004 / 9999999789"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if concurrently is installed
if ! npm list concurrently &>/dev/null; then
    echo "📦 Installing concurrently..."
    npm install concurrently --save-dev
fi

# Start the development server
echo "🎯 Starting development server..."
echo "✅ React App: http://localhost:5173"
echo "✅ Proxy Server: http://localhost:3001"
echo "✅ API Target: http://115.124.119.161:5029"
echo ""
echo "🎉 Ready to test login with real backend data!"
echo ""

# Run the development server
npm run dev
