#!/bin/bash

# Build script for Render deployment

echo "🚀 Building AI Terminal for Render deployment..."

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt
pip install -r backend/requirements.txt

# Install Node.js dependencies and build frontend
echo "📦 Installing Node.js dependencies..."
cd frontend
npm install

echo "🔨 Building frontend..."
npm run build

echo "✅ Build complete!"
echo "📁 Frontend build files are in: frontend/build"
echo "🐍 Backend is ready to run with: python backend/main.py"
