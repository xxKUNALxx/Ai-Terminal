# Deployment Guide for Render

This guide will help you deploy your AI Terminal application on Render.

## Prerequisites

1. A GitHub account
2. A Render account (free tier available)
3. Your code pushed to a GitHub repository

## Deployment Steps

### 1. Backend Service (API)

1. **Connect to GitHub**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Backend Service**:
   - **Name**: `terminal-backend` (or your preferred name)
   - **Environment**: `Python 3`
   - **Build Command**: 
     ```bash
     pip install -r backend/requirements.txt
     pip install -r requirements.txt
     ```
   - **Start Command**: 
     ```bash
     cd backend && python main.py
     ```

3. **Environment Variables**:
   - `PORT`: `8000` (Render will set this automatically)
   - `PYTHON_VERSION`: `3.9.0`

4. **Deploy**: Click "Create Web Service"

### 2. Frontend Service (Static Site)

1. **Create Static Site**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Static Site"
   - Connect your GitHub repository

2. **Configure Frontend Service**:
   - **Name**: `terminal-frontend` (or your preferred name)
   - **Build Command**: 
     ```bash
     cd frontend
     npm install
     npm run build
     ```
   - **Publish Directory**: `frontend/build`

3. **Environment Variables**:
   - `REACT_APP_API_URL`: `https://your-backend-service.onrender.com`
     (Replace with your actual backend URL from step 1)

4. **Deploy**: Click "Create Static Site"

### 3. Update Backend URL

After both services are deployed:

1. Copy the backend service URL from Render dashboard
2. Go to your frontend service settings
3. Update the `REACT_APP_API_URL` environment variable
4. Redeploy the frontend service

## Alternative: Single Service Deployment

If you prefer to deploy as a single service:

1. **Create Web Service**:
   - **Build Command**: 
     ```bash
     # Install Python dependencies
     pip install -r backend/requirements.txt
     pip install -r requirements.txt
     
     # Install Node.js dependencies and build frontend
     cd frontend
     npm install
     npm run build
     cd ..
     ```
   - **Start Command**: 
     ```bash
     python backend/main.py
     ```

2. **Serve Static Files**:
   - Add this to your backend `main.py`:
   ```python
   from fastapi.staticfiles import StaticFiles
   from fastapi import FastAPI
   
   app = FastAPI()
   
   # Serve static files
   app.mount("/", StaticFiles(directory="frontend/build", html=True), name="static")
   ```

## Environment Variables

### Backend
- `PORT`: Port number (set by Render)
- `GEMINI_API_KEY`: Your Google Gemini API key (optional)

### Frontend
- `REACT_APP_API_URL`: Backend service URL

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check that all dependencies are in requirements.txt
   - Ensure Python version is compatible
   - Check build logs for specific errors

2. **API Connection Issues**:
   - Verify `REACT_APP_API_URL` is set correctly
   - Check CORS settings in backend
   - Ensure backend service is running

3. **Static File Serving**:
   - Verify build directory path is correct
   - Check that frontend build completed successfully

### Logs

- Check service logs in Render dashboard
- Backend logs: Service → Logs
- Frontend logs: Service → Logs

## Custom Domain (Optional)

1. Go to your service settings
2. Click "Custom Domains"
3. Add your domain
4. Follow DNS configuration instructions

## Monitoring

- Use Render's built-in monitoring
- Check service health endpoints
- Monitor resource usage

## Cost

- **Free Tier**: 750 hours/month per service
- **Paid Plans**: Start at $7/month for always-on services

## Security Notes

- Never commit API keys to repository
- Use environment variables for sensitive data
- Enable HTTPS (automatic on Render)
- Consider rate limiting for production use
