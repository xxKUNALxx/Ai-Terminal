#!/bin/bash

# Build script for frontend deployment
echo "🚀 Building frontend for production..."

# Navigate to frontend directory
cd frontend

# Install dependencies
echo "📦 Installing npm dependencies..."
npm install

# Build the React app
echo "🔨 Building React app..."
npm run build

echo "✅ Frontend build complete!"
echo "📁 Build files are in: frontend/build"
