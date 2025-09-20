#!/bin/bash

# Start script for Render deployment
echo "🚀 Starting AI Terminal Backend..."

# Change to the project directory
cd /opt/render/project/src

# Start the production backend
python backend/main_production.py
