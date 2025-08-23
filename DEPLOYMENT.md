# 🚀 Deploy AI Vision Classifier to Render

## Quick Deploy to Render

### Method 1: One-Click Deploy (Recommended)

1. **Click this button:**
   [![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy/schema/new?template=https://github.com/your-username/teachable-machine-ui)

2. **Or use the manual method below**

### Method 2: Manual Deploy

#### Step 1: Prepare Your Repository

1. **Create a GitHub repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/teachable-machine-ui.git
   git push -u origin main
   ```

#### Step 2: Deploy to Render

1. **Go to [Render Dashboard](https://dashboard.render.com/)**
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service:**
   - **Name**: `ai-vision-classifier`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

#### Step 3: Environment Variables

Add these environment variables in Render:
- `NODE_ENV`: `production`

#### Step 4: Deploy

1. **Click "Create Web Service"**
2. **Wait for deployment** (usually 2-3 minutes)
3. **Your app will be live at**: `https://your-app-name.onrender.com`

## 🐟 Your Fish Classification Model

Your model can identify:
- **Clownfish** (ปลาการ์ตูน)
- **Butterflyfish** (ปลาผีเสื้อ) 
- **Longfin Bannerfish** (ปลาโนรีคีบยาว)

## 🔧 Important Notes

### HTTPS Required
- Render provides HTTPS automatically
- Camera access requires HTTPS
- Your app will work perfectly on Render

### Model Files
- Your model files are included in the repository
- No additional setup needed
- The app will automatically detect your fish classification model

### Free Tier Limitations
- **Sleep after 15 minutes** of inactivity
- **Cold start** when waking up (30-60 seconds)
- **Perfect for demos and testing**

## 🎯 Testing Your Deployed App

1. **Visit your Render URL**
2. **Click "Start Camera"**
3. **Allow camera permissions**
4. **Point camera at fish images**
5. **See real-time fish classification!**

## 🔄 Updating Your App

1. **Make changes locally**
2. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Update app"
   git push
   ```
3. **Render automatically redeploys**

## 📱 Share Your App

Your deployed app URL can be shared with anyone:
- Works on desktop and mobile
- No installation required
- Real-time fish classification

## 🆘 Troubleshooting

### Common Issues:

**App not loading:**
- Check Render logs in dashboard
- Ensure all files are committed to GitHub

**Camera not working:**
- Ensure you're using HTTPS (Render provides this)
- Check browser permissions

**Model not loading:**
- Verify model files are in the repository
- Check the `/api/model-status` endpoint

## 🎉 Success!

Your AI Vision Classifier is now live on the internet! Share the URL with friends and family to show off your fish classification skills! 🐠
