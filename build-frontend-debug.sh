#!/bin/bash

# Debug and build script for frontend
echo "🚀 Starting frontend build with debug..."

# Set working directory
cd /opt/render/project/src

echo "📁 Current directory: $(pwd)"
echo "📁 Project structure:"
ls -la

# Check if frontend exists
if [ ! -d "frontend" ]; then
    echo "❌ Frontend directory not found!"
    exit 1
fi

cd frontend

echo "📁 Frontend directory: $(pwd)"
echo "📁 Frontend contents:"
ls -la

# Check public directory
if [ ! -d "public" ]; then
    echo "❌ Public directory not found! Creating it..."
    mkdir -p public
fi

echo "📁 Public directory contents:"
ls -la public/

# Check if index.html exists
if [ ! -f "public/index.html" ]; then
    echo "❌ index.html not found! Creating it..."
    cat > public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#000000" />
  <meta name="description" content="AI-Powered Terminal Emulator" />
  <title>AI Terminal</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap');
    body {
      margin: 0;
      font-family: 'JetBrains Mono', monospace;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      overflow: hidden;
    }
  </style>
</head>
<body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root"></div>
</body>
</html>
EOF
fi

# Check package.json
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found!"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building React app..."
npm run build

# Check if build was successful
if [ ! -d "build" ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"
echo "📁 Build contents:"
ls -la build/
