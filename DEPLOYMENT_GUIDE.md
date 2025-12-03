# 🚀 Deployment Guide: Plant Saathi AI

This guide explains how to deploy the Plant Saathi AI application to Vercel, including the new Backend Proxy for weather data.

## 1. Architecture Overview

The app consists of two parts:
1.  **Frontend**: The React application (Vite).
2.  **Backend Proxy**: An Express server that handles Weather and Satellite data APIs.

You need to deploy **both** for the application to work fully.

## 2. Deploying the Backend Proxy

The backend proxy is located in the `backend-proxy/` folder.

1.  **Go to Vercel Dashboard**: https://vercel.com/new
2.  **Import Repository**: Select your `21-nov-plant-saathi-ai` repository.
3.  **Configure Project**:
    - **Project Name**: `plant-saathi-backend` (or similar)
    - **Framework Preset**: Other
    - **Root Directory**: Click `Edit` and select `backend-proxy`
4.  **Environment Variables**: Add the following:
    - `OPENWEATHER_API_KEY`: `e334382ecea74d84ea56220a77c93225`
    - `BACKEND_API_KEY`: `iZcRbox1AW/elm0NN+dFL7tW7deKatA9OFXsUDuBArI=`
    - `GEE_PRIVATE_KEY`: (Your Google Earth Engine key, if available)
    - `GEE_CLIENT_EMAIL`: (Your GEE email, if available)
5.  **Deploy**: Click Deploy.

**After deployment**, note the **Domain** assigned to this project (e.g., `https://plant-saathi-backend.vercel.app`).

## 3. Deploying the Frontend

1.  **Go to Vercel Dashboard**: https://vercel.com/new
2.  **Import Repository**: Select the same repository again.
3.  **Configure Project**:
    - **Project Name**: `plant-saathi-frontend`
    - **Framework Preset**: Vite (should be detected automatically)
    - **Root Directory**: `./` (default)
4.  **Environment Variables**: Add the following:
    - `VITE_SATELLITE_PROXY_URL`: **The URL from Step 2** (e.g., `https://plant-saathi-backend.vercel.app`)
    - `VITE_BACKEND_API_KEY`: `iZcRbox1AW/elm0NN+dFL7tW7deKatA9OFXsUDuBArI=` (Must match the backend!)
    - `VITE_GEMINI_API_KEY`: `AIzaSyBIqwblxkOwuECpcg3inzzYz7NdC3KeLGI`
    - `VITE_SUPABASE_URL`: `https://oislgcwardyvphznqoku.supabase.co`
    - `VITE_SUPABASE_ANON_KEY`: (Your Supabase Anon Key)
5.  **Deploy**: Click Deploy.

## 4. Verification

1.  Open your deployed frontend URL.
2.  Go to the **Weather** page.
3.  If the weather loads, everything is connected correctly! 🎉

## Troubleshooting

- **Weather Error**: If you see "Failed to get weather", check that `VITE_SATELLITE_PROXY_URL` in the frontend project matches the deployed backend URL exactly (no trailing slash).
- **Auth Error**: Ensure `VITE_BACKEND_API_KEY` and `BACKEND_API_KEY` are identical.
