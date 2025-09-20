# Render Deployment Fix

## Current Issue
The deployment is failing with "Permission denied" because Render is trying to execute the Python file directly instead of using the Python interpreter.

## Quick Fix

### Option 1: Update Render Service Settings
1. Go to your Render dashboard
2. Click on your service
3. Go to "Settings" tab
4. Update the **Start Command** to:
   ```bash
   python backend/main_production.py
   ```

### Option 2: Use the Simple Configuration
1. Delete your current service on Render
2. Create a new Web Service
3. Use these settings:
   - **Build Command**:
     ```bash
     pip install -r requirements.txt
     pip install -r backend/requirements.txt
     curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
     apt-get install -y nodejs
     cd frontend
     npm install
     npm run build
     cd ..
     ```
   - **Start Command**:
     ```bash
     python backend/main_production.py
     ```

### Option 3: Manual Deploy (Recommended)
1. **Backend Service**:
   - Type: Web Service
   - Environment: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python backend/main_production.py`
   - Environment Variables: `PORT=8000`

2. **Frontend Service**:
   - Type: Static Site
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/build`
   - Environment Variables: `REACT_APP_API_URL=https://your-backend-url.onrender.com`

## Test the Fix
After updating, your service should:
- ✅ Start without permission errors
- ✅ Serve the API at `/api/execute` and `/api/suggestions`
- ✅ Serve the frontend at the root URL
- ✅ Handle natural language commands

## Troubleshooting
If you still get errors:
1. Check the service logs in Render dashboard
2. Ensure all dependencies are in requirements.txt
3. Verify the Python version (3.9+ recommended)
4. Check that the file paths are correct
