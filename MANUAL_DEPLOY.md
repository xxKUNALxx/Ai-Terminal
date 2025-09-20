# Manual Render Deployment Guide

## Current Issue
The build command in render.yaml is causing issues with pip install. Let's deploy manually with the correct settings.

## Step-by-Step Deployment

### 1. Backend Service (API)

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +" → "Web Service"
3. **Connect GitHub Repository**: Select your `Ai-Terminal` repository
4. **Configure Service**:
   - **Name**: `ai-terminal-backend`
   - **Environment**: `Python 3`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Build Command**: `pip install -r requirements-complete.txt`
   - **Start Command**: `python backend/main_production.py`

5. **Environment Variables**:
   - `PORT`: `8000` (Render sets this automatically)
   - `PYTHON_VERSION`: `3.9.0`

6. **Click "Create Web Service"**

### 2. Frontend Service (Static Site)

1. **Go to Render Dashboard**
2. **Click "New +" → "Static Site"
3. **Connect GitHub Repository**: Select your `Ai-Terminal` repository
4. **Configure Service**:
   - **Name**: `ai-terminal-frontend`
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`

5. **Environment Variables**:
   - `REACT_APP_API_URL`: `https://ai-terminal-backend.onrender.com`
     (Replace with your actual backend URL)

6. **Click "Create Static Site"**

### 3. Update Frontend API URL

1. **Wait for both services to deploy**
2. **Copy the backend service URL** from Render dashboard
3. **Go to frontend service settings**
4. **Update `REACT_APP_API_URL`** with the backend URL
5. **Redeploy the frontend service**

## Alternative: Single Service Deployment

If you prefer one service:

1. **Create Web Service** (not Static Site)
2. **Use these settings**:
   - **Build Command**: 
     ```bash
     pip install -r requirements-complete.txt
     curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
     apt-get install -y nodejs
     cd frontend
     npm install
     npm run build
     cd ..
     ```
   - **Start Command**: `python backend/main_production.py`

## Testing Your Deployment

1. **Backend Health Check**: Visit `https://your-backend-url.onrender.com/api/status`
2. **Frontend**: Visit `https://your-frontend-url.onrender.com`
3. **Test Commands**: Try natural language commands like "list files" or "create a new file"

## Troubleshooting

### Common Issues:
1. **Build Fails**: Check that all dependencies are in `requirements-complete.txt`
2. **API Not Working**: Verify `REACT_APP_API_URL` is set correctly
3. **Frontend Not Loading**: Check that build completed successfully

### Logs:
- Check service logs in Render dashboard
- Backend: Service → Logs
- Frontend: Service → Logs

## Expected Result

After successful deployment:
- ✅ Backend serves API at `/api/execute` and `/api/suggestions`
- ✅ Frontend loads and connects to backend
- ✅ Natural language commands work
- ✅ Terminal interface is fully functional
