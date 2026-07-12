# Solar Intelligence & Sales Optimization Platform - Project Description

## 🌍 The Problem
Currently, data regarding India's solar capacity, state-wise installations, and revenue generation is highly fragmented. Government agencies typically publish static PDFs or raw Excel sheets. This makes it incredibly difficult for solar manufacturers, investors, and policymakers to track historical trends, identify regional opportunities, or forecast future hardware demand to optimize the supply chain.

## 💡 The Solution
We built an integrated, AI-driven web platform that acts as a centralized "Single Source of Truth." It processes 10 years of historical data (2014-2024) across 36 Indian States and Union Territories, compiling over 500+ granular temporal capacity records. The platform visualizes this data interactively and predicts future hardware requirements using Machine Learning, directly enabling supply chain optimization.

## 🔑 Core Pillars of the Platform

### 1. Data Engineering & Visualization
- **Dashboards**: Features an Executive Dashboard tracking over 81.8 GW of national capacity (the physical footprint) and a Revenue Dashboard that calculates Capital Expenditure (CapEx) based on standardized cost matrices.
- **Deep Analytics**: Highlights long-term sustainable growth by mathematically smoothing metrics, such as calculating 10-Year Compound Annual Growth Rates (CAGR), mitigating short-term volatility.

### 2. Geo-Intelligence & Satellite Vision
- **Interactive Heatmaps**: Integrated React-Leaflet maps that query our database, allowing EPCs (Engineering, Procurement, and Construction companies) to identify "dark zones" ripe for future solar investment.
- **Satellite AI Pipeline**: A real-time Computer Vision system. Users can inspect high-resolution imagery of operational solar farms. An OpenCV ML endpoint uses HSV color segmentation to detect dark-blue/black PV cluster signatures, instantly estimating Megawatt capacity based on pixel area.

### 3. AI Polynomial Forecasting Engine
- **Overcoming Linear Limits**: Solar growth in India follows an exponential curve due to compounding investments and falling panel prices. We engineered a Polynomial Regression Model (Degree 2) to accurately map this parabolic, accelerating trend.
- **Validation**: Trained on an 80/20 split (Training: 2014-2021, Testing: 2022-2023). It outperforms standard linear regression and predicts exact capacity targets up to 2030, generating dynamic confidence intervals. 
- **Impact**: By knowing how many Gigawatts will be added next year, manufacturers can preemptively order raw materials, preventing national shortages.

### 4. Interactive Innovation Hub
- **3D & AR Simulation**: Features an interactive 3D solar farm walkthrough built with Three.js. Includes an AR Simulator that calculates the maximum number of panels that can fit on a detected surface.
- **Smart Assistance**: A context-aware AI chatbot deployed across the application to summarize modules and explain complex ML models to users on the fly.

## ⚙️ Architecture & Tech Stack
- **Frontend**: React.js, Tailwind CSS (premium "Midnight & Frost" design system), Recharts, Leaflet.js, and Three.js.
- **Backend API**: Node.js, Express.js with a secure Role-Based Access Control (RBAC) system.
- **Database Layer**: MongoDB (for core application data) and PostgreSQL (for relational data querying).
- **ML Microservice**: Python FastAPI service utilizing Scikit-Learn (for forecasting models) and OpenCV (for real-time satellite imagery analysis).
