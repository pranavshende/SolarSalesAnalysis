# Solar Intelligence & Sales Optimization Platform

AI-powered decision support system for solar companies, based on state-wise and city-wise solar sales data.

## Features
- **MERN Stack**: MongoDB, Express, React, Node.js
- **ML Microservice**: Python FastAPI (Linear Regression, ARIMA)
- **Interactive Dashboards**: State-to-City drill-down, ROI metrics, Forecasts
- **Secure Auth**: Role-Based Access Control (Admin, Analyst, Sales Manager, Investor)
- **Data Ingestion**: Automatic Excel/CSV processing and normalization

## Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- Python (3.9+)
- MongoDB Atlas account (or local MongoDB)

### 2. Backend Setup
```bash
cd backend
npm install
# Configure .env with MONGODB_URI and JWT_SECRET
npm start
```

### 3. ML Service Setup
```bash
cd ml-service
python -m venv .venv
.\.venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## User Roles
- **Admin**: All features + User Management
- **Analyst**: Data upload + Analytics
- **Sales Manager**: Dashboard view + Reports
- **Investor**: High-level summaries + ROI metrics

## Tech Stack
- **Frontend**: React, Tailwind CSS, Recharts, Lucide-React
- **Backend**: Express.js, Mongoose, Passport.js, Socket.IO
- **ML**: FastAPI, scikit-learn, statsmodels
- **DevOps**: Docker, Vercel (Frontend), Render (Backend)
