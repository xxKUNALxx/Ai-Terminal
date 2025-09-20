#!/bin/bash

# Debug script to check frontend structure
echo "🔍 Debugging frontend structure..."

# Set working directory
cd /opt/render/project/src

echo "📁 Current directory: $(pwd)"
echo "📁 Contents:"
ls -la

echo "📁 Frontend directory:"
ls -la frontend/

echo "📁 Frontend public directory:"
ls -la frontend/public/

echo "📁 Frontend src directory:"
ls -la frontend/src/

echo "📁 Package.json contents:"
cat frontend/package.json

echo "🔍 Checking for index.html:"
if [ -f "frontend/public/index.html" ]; then
    echo "✅ index.html found"
    head -5 frontend/public/index.html
else
    echo "❌ index.html not found"
fi
