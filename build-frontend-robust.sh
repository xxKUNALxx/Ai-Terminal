#!/bin/bash

# Robust build script for frontend deployment
echo "🚀 Building frontend for production..."

# Set working directory to project root
cd /opt/render/project/src

# Check if frontend directory exists
if [ ! -d "frontend" ]; then
    echo "❌ Frontend directory not found!"
    ls -la
    exit 1
fi

# Navigate to frontend directory
cd frontend

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found in frontend directory!"
    ls -la
    exit 1
fi

# Check if public directory exists
if [ ! -d "public" ]; then
    echo "❌ Public directory not found!"
    ls -la
    exit 1
fi

# Check if index.html exists
if [ ! -f "public/index.html" ]; then
    echo "❌ index.html not found in public directory!"
    ls -la public/
    exit 1
fi

echo "✅ All required files found"

# Install dependencies
echo "📦 Installing npm dependencies..."
npm install

# Build the React app
echo "🔨 Building React app..."
npm run build

# Check if build was successful
if [ ! -d "build" ]; then
    echo "❌ Build failed - build directory not created!"
    exit 1
fi

echo "✅ Frontend build complete!"
echo "📁 Build files are in: frontend/build"
ls -la build/
